"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

const TRUST_STATS = [
    { value: "500+", label: "Luxury Products" },
    { value: "10k+", label: "Happy Clients" },
    { value: "Free", label: "Shipping $75+" },
];

export function MasterpieceHero() {
    const { setIsCartOpen } = useCart();
    void setIsCartOpen; // available for future use

    return (
        <section className="relative min-h-[90vh] w-full overflow-hidden bg-[#050505] flex items-center">

            {/* Atmospheric glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-[65vw] h-[65vh] rounded-full blur-[160px] bg-amber-900/15" />
                <div className="absolute top-1/3 left-1/4 w-[45vw] h-[45vw] rounded-full blur-[120px] bg-yellow-900/08 animate-pulse"
                    style={{ animationDuration: "8s" }} />
                <div className="absolute inset-y-0 left-0 w-1/2 hero-vignette-left" />
                <div className="absolute bottom-0 inset-x-0 h-48 hero-vignette-bottom" />
            </div>

            {/* Main layout */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-32 lg:py-0 min-h-[90vh] flex flex-col items-center justify-center text-center">

                {/* Content Wrapper */}
                <div className="space-y-10 max-w-4xl w-full">
                    <motion.span
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="block text-[10px] sm:text-[11px] uppercase tracking-[0.55em] text-[#D4AF37]/80 font-medium whitespace-nowrap">
                        The Obsidian Palace Collection
                    </motion.span>

                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.1 }} className="space-y-2 sm:space-y-4">
                        <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-[7.5rem] font-serif text-white/95 leading-[1.02] tracking-tight">
                            Where Radiance
                        </h1>
                        <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-[7.5rem] font-serif italic text-[#D4AF37] leading-[1.02] tracking-tight">
                            Meets Absolute Black
                        </h1>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }} className="flex flex-col items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
                            <p className="text-[11px] uppercase tracking-[0.4em] text-white/35 font-light">Elevate Your Presence</p>
                            <div className="w-12 h-px bg-gradient-to-l from-transparent via-[#D4AF37]/40 to-transparent" />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-wrap items-center justify-center gap-6 pt-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/shop" id="hero-cta-shop"
                                className="flex items-center gap-3 bg-[#D4AF37] text-black px-10 py-5 text-[11px] uppercase tracking-[0.35em] font-bold shadow-[0_0_50px_rgba(212,175,55,0.25)] hover:shadow-[0_0_70px_rgba(212,175,55,0.45)] transition-all duration-400 min-h-[44px]">
                                Explore The Vault <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/collections" id="hero-cta-collections"
                                className="flex items-center gap-2 border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 text-[#D4AF37]/70 hover:text-[#D4AF37] px-10 py-5 text-[11px] uppercase tracking-[0.35em] font-light transition-all duration-300 glass-sm min-h-[44px]">
                                View Collections
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Desktop Floating Decorative Elements (Now more artistic and less 'empty') */}
                    <div className="hidden lg:block absolute inset-0 pointer-events-none">
                        <motion.div
                            animate={{ y: [0, -20, 0], opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute left-[-15%] top-[20%] w-48 h-48 blur-[80px] bg-[#D4AF37]/10 rounded-full" />
                        <motion.div
                            animate={{ y: [0, 25, 0], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute right-[-10%] bottom-[30%] w-64 h-64 blur-[100px] bg-amber-900/15 rounded-full" />

                        {/* Floating Product Elements */}
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 0.4, x: 0 }}
                            transition={{ duration: 2, delay: 1 }}
                            className="absolute left-[5%] bottom-[15%] w-32 h-32 hidden xl:block">
                            <Image src="/logo.jpg" alt="Decoration" fill className="object-contain filter grayscale brightness-50 contrast-125" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 0.4, x: 0 }}
                            transition={{ duration: 2, delay: 1.2 }}
                            className="absolute right-[5%] top-[15%] w-40 h-40 hidden xl:block">
                            <Image src="/logo.jpg" alt="Decoration" fill className="object-contain filter grayscale brightness-50 contrast-125" />
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 1 }} className="flex items-center justify-center gap-6 sm:gap-14 pt-12 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0">
                        {TRUST_STATS.map((stat, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                                <div className="text-xl sm:text-2xl font-serif text-[#D4AF37] tracking-wider">{stat.value}</div>
                                <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-white/25 font-light">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Floating particles - more subtle and widespread */}
            <div className="absolute inset-0 pointer-events-none hidden lg:block">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -100, 0],
                            x: [0, Math.random() * 50 - 25, 0],
                            opacity: [0, 0.3, 0]
                        }}
                        transition={{
                            duration: 15 + Math.random() * 10,
                            repeat: Infinity,
                            delay: i * 2,
                            ease: "easeInOut"
                        }}
                        className="absolute w-1 h-1 bg-[#D4AF37]/30 rounded-full"
                        style={{
                            left: `${15 + i * 20}%`,
                            top: `${20 + i * 15}%`
                        }}
                    />
                ))}
            </div>

            {/* Scroll indicator */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none">
                <div className="w-px h-14 bg-gradient-to-b from-transparent via-[#D4AF37]/60 to-transparent" />
                <span className="text-[8px] uppercase tracking-[0.6em] text-[#D4AF37]/80">Scroll</span>
            </motion.div>
        </section>
    );
}
