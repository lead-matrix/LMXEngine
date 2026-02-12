import { createClient } from "@/lib/supabase/server";
import { Check, Crown, Star, Zap } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27-acacia' as any,
});

const PLANS = [
    {
        id: 'obsidian-essence',
        name: 'Obsidian Essence',
        price: 29.99,
        interval: 'month',
        description: 'Perfect for enthusiasts of essential luxury.',
        features: [
            'Monthly Surprise Deluxe Sample',
            '10% Off All Purchases',
            'Early Access to New Collections',
            'Standard Concierge Support'
        ],
        icon: <Star className="w-6 h-6 text-gold" />,
        stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY // Should be in .env
    },
    {
        id: 'royal-obsidian',
        name: 'Royal Obsidian',
        price: 79.99,
        interval: 'month',
        description: 'For the true connoisseur of DINA COSMETIC.',
        features: [
            'Full-Sized Monthly Product',
            '20% Off All Purchases',
            'Infinite Free Shipping',
            '24/7 VIP Concierge Access',
            'Invitations to Virtual Masterclasses'
        ],
        icon: <Crown className="w-6 h-6 text-gold" />,
        stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_VIP, // Should be in .env
        featured: true
    }
];

export const metadata = {
    title: "Membership | The Obsidian Palace",
    description: "Join the inner circle of DINA COSMETIC for exclusive benefits and monthly luxury.",
};

export default async function MembershipPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if current user has a subscription
    const { data: subscription } = user ? await supabase
        .from('user_subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single() : { data: null };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
                <h1 className="text-4xl md:text-6xl font-serif tracking-[0.2em] text-white">THE INNER CIRCLE</h1>
                <p className="text-gold/60 text-xs uppercase tracking-[0.5em] font-light">Elevate Your Ritual To Eternal Luxury</p>
                <div className="w-24 h-[1px] bg-gold/30 mx-auto mt-8"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {PLANS.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative group p-10 border transition-all duration-500 ${plan.featured
                                ? 'bg-zinc-900/40 border-gold/40 shadow-[0_0_40px_rgba(212,175,55,0.1)] scale-105 z-10'
                                : 'bg-black border-white/5 hover:border-gold/20'
                            }`}
                    >
                        {plan.featured && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-black text-[9px] font-bold px-4 py-1 uppercase tracking-widest">
                                Most Exquisite
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-8">
                            <div className="p-3 bg-gold/5 border border-gold/10 inline-block">
                                {plan.icon}
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-serif text-white">${plan.price}</span>
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">/ {plan.interval}</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-serif text-gold mb-3 tracking-widest">{plan.name}</h3>
                        <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-8 leading-relaxed">
                            {plan.description}
                        </p>

                        <div className="space-y-4 mb-10">
                            {plan.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-1 h-1 bg-gold rounded-full" />
                                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {subscription ? (
                            <Link
                                href="/account/membership"
                                className="w-full block py-4 text-center text-[10px] font-bold uppercase tracking-[0.4em] border border-gold/20 text-gold hover:bg-gold hover:text-black transition-all"
                            >
                                Manage Membership
                            </Link>
                        ) : (
                            <form action="/api/checkout/subscription" method="POST">
                                <input type="hidden" name="priceId" value={plan.stripePriceId} />
                                <button
                                    type="submit"
                                    className={`w-full py-4 text-[10px] font-bold uppercase tracking-[0.4em] transition-all border ${plan.featured
                                            ? 'bg-gold text-black border-gold hover:bg-white hover:border-white'
                                            : 'bg-transparent text-white border-white/10 hover:border-gold hover:text-gold'
                                        }`}
                                >
                                    Begin Ritual
                                </button>
                            </form>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-32 text-center max-w-3xl mx-auto space-y-6">
                <p className="text-[9px] text-zinc-600 uppercase tracking-[0.5em] leading-loose">
                    All memberships are billed monthly and can be cancelled at any time through your Obsidian Palace account portal. Experience the future of beauty curation today.
                </p>
            </div>
        </div>
    );
}
