// Note: Shippo is imported dynamically inside the function to avoid build-time constructor errors.

export async function createShippingLabel(order: any) {
    const apiKey = process.env.SHIPPO_API_KEY;
    if (!apiKey) {
        console.warn("SHIPPO_API_KEY is missing");
        return { tracking_number: "SHP-DEBUG", label_url: "#", status: "PENDING" };
    }

    try {
        // Dynamic import to handle constructor issues in different build environments
        const ShippoModule = await import('shippo');
        // @ts-ignore
        const Shippo = ShippoModule.default || ShippoModule;

        let shippo: any;
        if (typeof Shippo === 'function') {
            try {
                shippo = new (Shippo as any)(apiKey);
            } catch (e) {
                shippo = (Shippo as any)(apiKey);
            }
        } else {
            throw new Error("Shippo is not a constructor or function");
        }

        const shipment = await shippo.shipment.create({
            address_from: {
                name: "DINA COSMETIC | The Obsidian Palace",
                street1: "123 Luxury Lane",
                city: "Beverly Hills",
                state: "CA",
                zip: "90210",
                country: "US",
            },
            address_to: {
                name: order.shipping_address?.name || "Valued client",
                street1: order.shipping_address?.address?.line1,
                city: order.shipping_address?.address?.city,
                state: order.shipping_address?.address?.state,
                zip: order.shipping_address?.address?.postal_code,
                country: order.shipping_address?.address?.country,
            },
            parcels: [{
                length: "10",
                width: "5",
                height: "5",
                distance_unit: "in",
                weight: "2",
                mass_unit: "lb",
            }],
            async: false,
        });

        const rate = shipment.rates[0];
        const transaction = await shippo.transaction.create({
            rate: rate.object_id,
            label_file_type: "PDF",
            async: false,
        });

        return {
            tracking_number: transaction.tracking_number,
            label_url: transaction.label_url,
            status: transaction.status,
        };
    } catch (error) {
        console.error("Shippo Error:", error);
        throw error;
    }
}
