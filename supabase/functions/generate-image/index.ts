
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
    const { prompt, quality = 'standard', size = '1024x1024', user_id, category, style } = await req.json();
    
    console.log('Request received:', { prompt, quality, size, user_id, category, style });
    
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
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('OpenAI API key found, proceeding with generation...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const creditsMap = {
      'standard': 3,
      'hd': 8
    };
    const creditsNeeded = creditsMap[quality as keyof typeof creditsMap] || 3;

    console.log('Credits needed:', creditsNeeded);

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

    console.log('Generating image with enhanced prompt:', enhancedPrompt);

    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: enhancedPrompt,
        n: 1,
        size: size,
        quality: quality === 'hd' ? 'high' : 'medium',
        output_format: 'png'
      }),
    });

    console.log('OpenAI API response status:', imageResponse.status);

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error('OpenAI API error:', imageResponse.status, errorText);
      
      let errorMessage = 'Failed to generate image';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        console.error('Error parsing OpenAI error response:', e);
      }
      
      return new Response(JSON.stringify({ 
        error: `Image generation failed: ${errorMessage}` 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const imageData = await imageResponse.json();
    console.log('OpenAI response received, processing...');
    
    if (!imageData.data || !imageData.data[0]) {
      console.error('Invalid response from OpenAI:', imageData);
      return new Response(JSON.stringify({ error: 'Invalid response from image generation service' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const imageBase64 = imageData.data[0].b64_json || imageData.data[0];
    if (!imageBase64) {
      console.error('No image data received from OpenAI');
      return new Response(JSON.stringify({ error: 'No image data received from generation service' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const imageUrl = `data:image/png;base64,${imageBase64}`;
    console.log('Image generated successfully, saving to database...');

    const { data: savedImage, error: saveError } = await supabase
      .from('images')
      .insert({
        user_id: user_id,
        prompt: prompt,
        quality: quality,
        size: size,
        category: category || null,
        style: style || null,
        image_data: imageBase64,
        image_url: imageUrl,
        credits_used: creditsNeeded,
        status: 'completed'
      })
      .select()
      .single();

    if (saveError) {
      console.error('Database save error:', saveError);
      return new Response(JSON.stringify({ error: 'Failed to save image to database' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Image saved to database, updating user credits...');

    const { error: creditError } = await supabase.rpc('update_user_credits', {
      user_uuid: user_id,
      credit_change: -creditsNeeded,
      transaction_type: 'usage',
      transaction_description: `Image generation: ${prompt.substring(0, 50)}...`
    });

    if (creditError) {
      console.error('Credit deduction error:', creditError);
    }

    console.log('Image generation completed successfully');

    return new Response(JSON.stringify({ 
      image: savedImage,
      imageUrl: imageUrl,
      creditsUsed: creditsNeeded,
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ 
      error: `Internal server error: ${error.message}`,
      details: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
