
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    const body = await req.text();
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    let event;

    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    console.log('Webhook event:', event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const supabaseService = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      // Update payment session status
      const { error: updateError } = await supabaseService
        .from('payment_sessions')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('stripe_session_id', session.id);

      if (updateError) {
        console.error('Error updating payment session:', updateError);
        throw updateError;
      }

      // Get payment session details
      const { data: paymentSession, error: sessionError } = await supabaseService
        .from('payment_sessions')
        .select('*')
        .eq('stripe_session_id', session.id)
        .single();

      if (sessionError || !paymentSession) {
        console.error('Error getting payment session:', sessionError);
        throw new Error('Payment session not found');
      }

      // Add credits to user account
      const { error: creditsError } = await supabaseService.rpc('update_user_credits', {
        user_uuid: paymentSession.user_id,
        credit_change: paymentSession.credits,
        transaction_type: 'purchase',
        transaction_description: `Purchased ${paymentSession.credits} credits`
      });

      if (creditsError) {
        console.error('Error updating user credits:', creditsError);
        throw creditsError;
      }

      console.log(`Successfully added ${paymentSession.credits} credits to user ${paymentSession.user_id}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
