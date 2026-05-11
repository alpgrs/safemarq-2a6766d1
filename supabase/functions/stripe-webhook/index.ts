// Edge Function : reçoit les webhooks Stripe et synchronise garage_subscriptions
// Secrets requis : STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
//                  STRIPE_PRO_PRICE_ID, STRIPE_PREMIUM_PRICE_ID,
//                  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//
// IMPORTANT : déployer avec --no-verify-jwt (Stripe ne passe pas de JWT Supabase)

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const PRO_PRICE_ID = Deno.env.get('STRIPE_PRO_PRICE_ID') ?? '';
const PREMIUM_PRICE_ID = Deno.env.get('STRIPE_PREMIUM_PRICE_ID') ?? '';

function priceIdToTier(priceId: string | undefined): 'pro' | 'premium' | null {
  if (!priceId) return null;
  if (priceId === PRO_PRICE_ID) return 'pro';
  if (priceId === PREMIUM_PRICE_ID) return 'premium';
  return null;
}

async function syncSubscription(sub: Stripe.Subscription) {
  const garageId = sub.metadata?.garage_id;
  if (!garageId) {
    console.warn('Subscription sans garage_id metadata:', sub.id);
    return;
  }
  const priceId = sub.items.data[0]?.price.id;
  const tier = priceIdToTier(priceId);
  if (!tier) {
    console.warn('Price ID inconnu pour subscription', sub.id, ':', priceId);
    return;
  }

  const { error } = await supabase.from('garage_subscriptions').upsert({
    garage_id: garageId,
    tier,
    stripe_customer_id: sub.customer as string,
    stripe_subscription_id: sub.id,
    status: sub.status,
    current_period_end: sub.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : null,
    cancel_at_period_end: sub.cancel_at_period_end,
  }, { onConflict: 'garage_id' });

  if (error) console.error('Upsert garage_subscriptions error:', error);
}

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) return new Response('No signature', { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const garageId = sub.metadata?.garage_id;
        if (garageId) {
          await supabase
            .from('garage_subscriptions')
            .update({ status: 'canceled', cancel_at_period_end: false })
            .eq('garage_id', garageId);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const inv = event.data.object as Stripe.Invoice;
        const subId = (inv as unknown as { subscription?: string }).subscription;
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          await syncSubscription(sub);
        }
        break;
      }

      default:
        // Autres events ignorés
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Handler error:', err);
    return new Response(`Handler Error: ${(err as Error).message}`, { status: 500 });
  }
});
