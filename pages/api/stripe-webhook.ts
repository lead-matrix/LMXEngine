import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { sendOrderConfirmationEmail } from "@/lib/utils/email";

export const config = {
    api: {
        bodyParser: false,
    },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-01-27-acacia" as any,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") return res.status(405).end();

    const sig = req.headers["stripe-signature"];

    if (!sig) {
        return res.status(400).send("Missing stripe-signature header");
    }

    const buf = await buffer(req);

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            buf,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`❌ Webhook signature verification failed:`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            if (!session.metadata?.orderId) {
                return res.status(200).json({ received: true });
            }

            // Update order status to paid
            const supabase = await supabaseAdmin();
            await supabase
                .from("orders")
                .update({
                    status: "paid",
                    stripe_payment_intent_id: session.payment_intent as string,
                })
                .eq("id", session.metadata.orderId);

            // Send order confirmation email
            const customerEmail = session.customer_details?.email;
            const customerName = session.customer_details?.name || "Valued Client";

            if (customerEmail) {
                await sendOrderConfirmationEmail({
                    orderId: session.metadata.orderId,
                    customerEmail,
                    customerName,
                    totalAmount: session.amount_total ? session.amount_total / 100 : 0,
                });
            }

            // Handle stock decrement
            const { data: items } = await supabase
                .from("order_items")
                .select("product_id, quantity, variant_id")
                .eq("order_id", session.metadata.orderId);

            if (items) {
                for (const item of items) {
                    if (item.variant_id) {
                        await supabase.rpc("decrement_variant_stock", {
                            v_id: item.variant_id,
                            amount: item.quantity,
                        });
                    } else {
                        await supabase.rpc("decrement_product_stock", {
                            p_id: item.product_id,
                            amount: item.quantity,
                        });
                    }
                }
            }
        }
    } catch (error: any) {
        console.error(`❌ Webhook handler failed:`, error);
        return res.status(500).send("Webhook handler failed");
    }

    res.status(200).json({ received: true });
}
