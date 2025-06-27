
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
    
    console.log('Request received:', { prompt, quality, size, user_id });
    
    if (!prompt) {
      console.error('No prompt provided');
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate credits based on quality
    const creditsMap = {
      'standard': 3,
      'hd': 8
    };
    const creditsNeeded = creditsMap[quality as keyof typeof creditsMap] || 3;

    console.log('Credits needed:', creditsNeeded);

    // Check user credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user_id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!profile || profile.credits < creditsNeeded) {
      console.error('Insufficient credits:', profile?.credits, 'needed:', creditsNeeded);
      return new Response(JSON.stringify({ error: 'Insufficient credits' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating image with OpenAI...');

    // Generate image with OpenAI
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: size,
        quality: quality,
        response_format: 'b64_json'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return new Response(JSON.stringify({ 
        error: `OpenAI API error: ${response.status} - ${errorText}` 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const imageData = data.data[0].b64_json;
    const imageUrl = `data:image/png;base64,${imageData}`;

    console.log('Image generated successfully');

    // Save image to database
    const { data: savedImage, error: saveError } = await supabase
      .from('images')
      .insert({
        user_id: user_id,
        prompt: prompt,
        quality: quality,
        size: size,
        category: category,
        style: style,
        image_data: imageData,
        image_url: imageUrl,
        credits_used: creditsNeeded,
        status: 'completed'
      })
      .select()
      .single();

    if (saveError) {
      console.error('Database save error:', saveError);
      return new Response(JSON.stringify({ error: 'Failed to save image' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Deduct credits using the function
    const { error: creditError } = await supabase.rpc('update_user_credits', {
      user_uuid: user_id,
      credit_change: -creditsNeeded,
      transaction_type: 'usage',
      transaction_description: `Image generation: ${prompt.substring(0, 50)}...`
    });

    if (creditError) {
      console.error('Credit deduction error:', creditError);
      // Don't fail the request if credit deduction fails, just log it
    }

    console.log('Image generation completed successfully');

    return new Response(JSON.stringify({ 
      image: savedImage,
      imageUrl: imageUrl,
      creditsUsed: creditsNeeded
    }), {
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
