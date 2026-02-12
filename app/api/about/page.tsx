import { ArrowRight, MapPin, History, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "The Palace Essence | DINA COSMETIC",
    description: "Learn about the heritage and architectural beauty of the Obsidian Palace.",
};

export default function AboutPage() {
    return (
        <div className="bg-black text-white min-h-screen pt-32 pb-24">
            <div className="px-6 max-w-5xl mx-auto space-y-32">
                {/* Hero Section */}
                <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                    <div className="flex justify-center mb-12">
                        <div className="relative w-24 h-24 opacity-50">
                            <Image src="/logo.jpg" alt="Logo" fill className="object-contain" />
                        </div>
                    </div>
                    <p className="text-gold uppercase tracking-[0.5em] text-[10px] font-bold">Absolute Heritage</p>
                    <h1 className="text-6xl md:text-9xl font-serif italic tracking-tighter leading-none">The Obsidian<br />Palace</h1>
                    <div className="w-16 h-px bg-gold/50 mx-auto" />
                    <p className="text-zinc-500 text-sm uppercase tracking-[0.4em] leading-loose max-w-2xl mx-auto font-light">
                        Founded in 2026, the Palace stands as a witness to the evolution of luxury beauty.
                        A sanctuary where absolute black meets radiant light.
                    </p>
                </div>

                {/* Chapters */}
                <div className="space-y-48">
                    <AboutSection
                        number="01"
                        title="The Architecture of Beauty"
                        icon={<Sparkles className="text-gold" size={20} />}
                        description="Every LMT formula is built with architectural precision. We view the face as a structure of light and shadow, requiring only the most sophisticated materials to reach its true potential."
                    />

                    <AboutSection
                        number="02"
                        title="The Liquid Gold Standard"
                        icon={<History className="text-gold" size={20} />}
                        description="By incorporating microscopic gold particles and obsidian extracts, our products do not just sit on the skin—they become part of your aura, refracting light in a way that is unique to the Palace resident."
                    />

                    <div className="flex flex-col items-center text-center space-y-12">
                        <MapPin className="text-gold/20 w-12 h-12" />
                        <div className="space-y-4">
                            <h3 className="text-[10px] uppercase tracking-[0.5em] text-gold font-bold">Global Presence</h3>
                            <h2 className="text-4xl font-serif italic">Montreal — Dubai — Tokyo</h2>
                        </div>
                        <Link href="/shop" className="group flex items-center gap-4 border border-gold/40 px-12 py-5 text-gold hover:border-gold transition-all duration-700 uppercase text-[10px] tracking-[0.4em]">
                            Join The Inner Circle <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AboutSection({ number, title, description, icon }: { number: string, title: string, description: string, icon: React.ReactNode }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center group">
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <span className="text-gold/20 font-serif text-6xl group-hover:text-gold/40 transition-colors duration-700">{number}</span>
                    <div className="h-px bg-gold/20 flex-grow" />
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        {icon}
                        <h2 className="text-3xl font-serif text-white">{title}</h2>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed uppercase tracking-widest font-light italic">
                        {description}
                    </p>
                </div>
            </div>
            <div className="aspect-square bg-zinc-950 border border-gold/10 relative overflow-hidden flex items-center justify-center p-24">
                <div className="relative w-full h-full opacity-10 group-hover:scale-110 transition-transform duration-1000">
                    <Image src="/logo.jpg" alt="Palace deco" fill className="object-contain" />
                </div>
            </div>
        </div>
    );
}
