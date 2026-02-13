"use client";

import { ProductGrid } from "@/components/ProductGrid";
import { Sparkles, Filter } from "lucide-react";

export default function ShopPage() {
    return (
        <div className="bg-black text-white min-h-screen pt-32">
            <div className="px-6 max-w-7xl mx-auto space-y-16">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-gold/10 pb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gold">
                            <Sparkles size={12} className="animate-pulse" />
                            <span className="text-[10px] uppercase tracking-[0.5em] font-light">The Full Collection</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-serif italic tracking-tighter">Boutique</h1>
                    </div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] max-w-xs text-right leading-loose">
                        Synchronized perfection for those who demand absolute excellence in every application.
                    </p>
                </div>

                {/* Categories / Filter Bar */}
                <div className="flex flex-wrap gap-8 items-center text-[10px] uppercase tracking-[0.3em] font-light border-b border-white/5 pb-8">
                    <div className="flex items-center gap-2 text-gold mr-8">
                        <Filter size={12} />
                        <span>Filter:</span>
                    </div>
                    <button className="text-white hover:text-gold transition-colors">All</button>
                    <button className="text-white/40 hover:text-gold transition-colors">Face</button>
                    <button className="text-white/40 hover:text-gold transition-colors">Eyes</button>
                    <button className="text-white/40 hover:text-gold transition-colors">Lips</button>
                    <button className="text-white/40 hover:text-gold transition-colors">Tools</button>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <ProductGrid />
                </div>
            </div>
        </div>
    );
}
