
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, quality = 'standard', size = '1024x1024', user_id, category, style, contentType = 'image' } = await req.json();
    
    console.log('Request received:', { prompt, quality, size, user_id, category, style, contentType });
    
    if (!prompt) {
      console.error('No prompt provided');
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OpenAI_API');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('OpenAI API key found, proceeding with generation...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Different credit costs for different content types
    const creditsMap = {
      'image': {
        'standard': 3,
        'hd': 8
      },
      'video': {
        'standard': 15,
        'hd': 25
      }
    };
    
    const contentCredits = creditsMap[contentType as keyof typeof creditsMap] || creditsMap.image;
    const creditsNeeded = contentCredits[quality as keyof typeof contentCredits] || 3;

    console.log('Credits needed:', creditsNeeded, 'for', contentType);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user_id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      return new Response(JSON.stringify({ error: 'User profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!profile || profile.credits < creditsNeeded) {
      console.error('Insufficient credits:', profile?.credits, 'needed:', creditsNeeded);
      return new Response(JSON.stringify({ error: `Insufficient credits. You need ${creditsNeeded} credits but only have ${profile?.credits || 0}.` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enhanced prompt with style and category
    let enhancedPrompt = prompt;
    if (style && style !== '') {
      enhancedPrompt += `, ${style} style`;
    }
    if (category && category !== '') {
      enhancedPrompt += `, ${category} theme`;
    }

    // Add animation-specific prompt enhancement for videos
    if (contentType === 'video') {
      enhancedPrompt += ', animated scene, smooth motion, cinematic movement';
    }

    console.log('Generating', contentType, 'with enhanced prompt:', enhancedPrompt);

    let generationResponse;
    let contentUrl;
    let contentData;

    if (contentType === 'video') {
      // Generate video using OpenAI's video generation endpoint
      generationResponse = await fetch('https://api.openai.com/v1/videos/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-video-1',
          prompt: enhancedPrompt,
          size: '1024x1024',
          quality: quality === 'hd' ? 'hd' : 'standard',
          response_format: 'b64_json'
        }),
      });
    } else {
      // Generate image using DALL-E 3
      generationResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: enhancedPrompt,
          n: 1,
          size: size,
          quality: quality === 'hd' ? 'hd' : 'standard',
          response_format: 'b64_json'
        }),
      });
    }

    console.log('OpenAI API response status:', generationResponse.status);

    if (!generationResponse.ok) {
      const errorText = await generationResponse.text();
      console.error('OpenAI API error:', generationResponse.status, errorText);
      
      let errorMessage = `Failed to generate ${contentType}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
          if (errorMessage.includes('content policy')) {
            errorMessage = 'Content policy violation. Please modify your prompt and try again.';
          } else if (errorMessage.includes('rate limit')) {
            errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
          }
        }
      } catch (e) {
        console.error('Error parsing OpenAI error response:', e);
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const responseData = await generationResponse.json();
    console.log('OpenAI response received, processing...');
    
    if (!responseData.data || !responseData.data[0] || !responseData.data[0].b64_json) {
      console.error('Invalid response from OpenAI:', responseData);
      return new Response(JSON.stringify({ error: `Invalid response from ${contentType} generation service` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    contentData = responseData.data[0].b64_json;
    
    if (contentType === 'video') {
      contentUrl = `data:video/mp4;base64,${contentData}`;
    } else {
      contentUrl = `data:image/png;base64,${contentData}`;
    }
    
    console.log(`${contentType} generated successfully, saving to database...`);

    // Save to appropriate table based on content type
    const tableName = contentType === 'video' ? 'videos' : 'images';
    const dataColumn = contentType === 'video' ? 'video_data' : 'image_data';
    const urlColumn = contentType === 'video' ? 'video_url' : 'image_url';
    
    const insertData = {
      user_id: user_id,
      prompt: prompt,
      quality: quality,
      category: category || null,
      style: style || null,
      [dataColumn]: contentData,
      [urlColumn]: contentUrl,
      credits_used: creditsNeeded,
      status: 'completed'
    };

    if (contentType === 'image') {
      insertData.size = size;
    }

    const { data: savedContent, error: saveError } = await supabase
      .from(tableName)
      .insert(insertData)
      .select()
      .single();

    if (saveError) {
      console.error('Database save error:', saveError);
      return new Response(JSON.stringify({ error: `Failed to save ${contentType} to database` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`${contentType} saved to database, updating user credits...`);

    const { error: creditError } = await supabase.rpc('update_user_credits', {
      user_uuid: user_id,
      credit_change: -creditsNeeded,
      transaction_type: 'usage',
      transaction_description: `${contentType} generation: ${prompt.substring(0, 50)}...`
    });

    if (creditError) {
      console.error('Credit deduction error:', creditError);
    }

    console.log(`${contentType} generation completed successfully`);

    const responseKey = contentType === 'video' ? 'videoUrl' : 'imageUrl';
    const responseObj = {
      [contentType]: savedContent,
      [responseKey]: contentUrl,
      creditsUsed: creditsNeeded,
      success: true
    };

    return new Response(JSON.stringify(responseObj), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ 
      error: `Internal server error: ${error.message}`
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
