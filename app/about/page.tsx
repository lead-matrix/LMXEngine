import { createClient } from "@/utils/supabase/server";
import { Sparkles, ShieldCheck, History, Heart } from "lucide-react";
import Image from "next/image";

export const metadata = {
    title: "The Palace | DINA COSMETIC",
    description: "The story and philosophy of the Obsidian Palace, where luxury meets absolute black.",
};

export default function AboutPage() {
    return (
        <div className="bg-black text-white min-h-screen pt-32 pb-20 overflow-hidden">
            {/* Hero Section */}
            <div className="px-6 max-w-7xl mx-auto space-y-24 mb-32">
                <div className="text-center space-y-8 animate-in fade-in slide-in-from-top-12 duration-1000">
                    <div className="flex justify-center mb-6">
                        <div className="relative w-24 h-24 opacity-80">
                            <Image src="/logo.jpg" alt="Palace Sigil" fill className="object-contain" />
                        </div>
                    </div>
                    <p className="text-gold uppercase tracking-[0.5em] text-[10px] md:text-xs font-light">
                        Our Genesis
                    </p>
                    <h1 className="text-6xl md:text-9xl font-serif italic tracking-tighter uppercase leading-[0.8] mix-blend-difference">
                        The Obsidian <br /> Palace
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="relative aspect-square bg-zinc-950 border border-gold/10 overflow-hidden group">
                        <Image
                            src="/logo.jpg"
                            alt="The Genesis"
                            fill
                            className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                    </div>

                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-gold font-serif text-3xl italic">Rituals of Illumination</h2>
                            <p className="text-zinc-500 text-[11px] md:text-sm uppercase tracking-[0.3em] leading-relaxed font-light">
                                DINA COSMETIC was founded not in a laboratory, but in a sanctuary. We believe that true beauty is the illumination of the soul, and our products are merely the vessels to manifest that light.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-gold font-serif text-3xl italic">The Obsidian Standard</h2>
                            <p className="text-zinc-500 text-[11px] md:text-sm uppercase tracking-[0.3em] leading-relaxed font-light">
                                Every artifact produced within the Palace undergoes a rigorous alchemy of absolute black minerals and liquid gold accents. This is the Obsidian Standard—a promise of weight, luxury, and unmatched performance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Philosophy Grid */}
            <div className="bg-zinc-950/50 border-y border-white/5 py-32 mt-32">
                <div className="px-6 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <PhilosophyPoint
                            icon={<History className="text-gold" size={20} />}
                            title="Legacy"
                            text="Evolving the timeless secrets of cosmetics into modern artifacts."
                        />
                        <PhilosophyPoint
                            icon={<ShieldCheck className="text-gold" size={20} />}
                            title="Purity"
                            text="Untouched by ordinary standards. Crafted for the absolute."
                        />
                        <PhilosophyPoint
                            icon={<Sparkles className="text-gold" size={20} />}
                            title="Radiance"
                            text="Designed to capture and reflect light in its most premium form."
                        />
                        <PhilosophyPoint
                            icon={<Heart className="text-gold" size={20} />}
                            title="Devotion"
                            text="A singular focus on the enhancement of your natural majesty."
                        />
                    </div>
                </div>
            </div>

            {/* Final Call to Order */}
            <div className="py-40 text-center px-6">
                <h2 className="text-2xl md:text-4xl font-serif italic text-white/40 max-w-2xl mx-auto leading-relaxed">
                    "Step out of the ordinary and into the sanctuary of your own excellence."
                </h2>
                <div className="mt-12">
                    <div className="w-px h-24 bg-gold/30 mx-auto" />
                    <p className="mt-8 text-[9px] uppercase tracking-[0.5em] text-gold font-bold italic">
                        The Ritual Awaits
                    </p>
                </div>
            </div>
        </div>
    );
}

function PhilosophyPoint({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
    return (
        <div className="space-y-6 group">
            <div className="w-12 h-12 flex items-center justify-center border border-gold/10 bg-black group-hover:border-gold/40 transition-all duration-500">
                {icon}
            </div>
            <h3 className="text-xs uppercase tracking-[0.4em] text-white font-bold">{title}</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 leading-loose">
                {text}
            </p>
        </div>
    );
}
