import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { createShippingLabel } from "@/lib/utils/shippo";
import { sendShippingNotificationEmail } from "@/lib/utils/email";
import { logAdminAction } from "@/lib/utils/admin-audit";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();

        // 1. Verify Admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== "admin") {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // 2. Get Request Data
        const { orderId } = await req.json();
        if (!orderId) {
            return new NextResponse("Missing Order ID", { status: 400 });
        }

        // 3. Fetch Order Details
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select("*, shipping_address") // Ensure shipping_address is selected
            .eq("id", orderId)
            .single();

        if (orderError || !order) {
            return new NextResponse("Order not found", { status: 404 });
        }

        if (order.status !== 'paid' && order.status !== 'processing') {
            return new NextResponse("Order must be PAID or PROCESSING to generate label", { status: 400 });
        }

        // 4. Call Shippo API
        const labelData = await createShippingLabel(order);

        if (!labelData.tracking_number) {
            throw new Error("Failed to generate tracking number from Shippo");
        }

        // 5. Update Database
        const { error: updateError } = await supabase
            .from("orders")
            .update({
                status: "shipped",
                tracking_number: labelData.tracking_number,
                shipping_label_url: labelData.label_url,
                shipped_at: new Date().toISOString()
            })
            .eq("id", orderId);

        if (updateError) throw updateError;

        // 6. Send Email Notification
        // Only if we have a customer email. 
        // We need to fetch the customer email if not in order object.
        // Orders table usually has user_id, or maybe email stored directly.
        // Let's check `user_id`.
        let customerEmail = "";
        let customerName = "Valued Customer";

        if (order.user_id) {
            const { data: userData } = await (await supabaseAdmin()).auth.admin.getUserById(order.user_id);
            customerEmail = userData.user?.email || "";
            // Also check profile
            const { data: userProfile } = await supabase.from('profiles').select('full_name').eq('id', order.user_id).single();
            if (userProfile?.full_name) customerName = userProfile.full_name;
        }

        if (customerEmail) {
            await sendShippingNotificationEmail({
                orderId: orderId,
                customerEmail,
                customerName: order.shipping_address?.name || customerName,
                totalAmount: order.total_amount,
                trackingNumber: labelData.tracking_number,
                labelUrl: labelData.label_url
            });
        }

        // 7. Audit Log
        await logAdminAction(
            'shipping_label_generated',
            'orders',
            orderId,
            { tracking_number: labelData.tracking_number }
        );

        return NextResponse.json({
            success: true,
            tracking_number: labelData.tracking_number,
            label_url: labelData.label_url
        });

    } catch (error: any) {
        console.error("Generate Label Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
