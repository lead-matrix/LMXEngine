import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="space-y-12 animate-in fade-in zoom-in duration-1000">
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 border border-gold/20 animate-spin-slow" />
          <Compass size={48} className="text-gold opacity-50" />
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-serif italic tracking-tighter text-white/10 uppercase leading-none">
            Void
          </h1>
          <p className="text-gold uppercase tracking-[0.5em] text-xs font-light">
            Lost in the Obsidian
          </p>
        </div>

        <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-[0.3em] max-w-sm mx-auto leading-loose font-light">
          The artifact you seek has vanished into history or was never meant to be discovered.
        </p>

        <div className="pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-4 text-gold uppercase text-[10px] tracking-[0.5em] border border-gold/30 px-10 py-5 hover:bg-gold hover:text-black transition-all duration-700"
          >
            <ArrowLeft size={14} /> Return To Palace
          </Link>
        </div>
      </div>

      {/* Background Texture/Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gold/5 opacity-50" />
      </div>
    </div>
  );
}