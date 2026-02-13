import Link from "next/link";
import { Crown, ArrowRight } from "lucide-react";

export const metadata = {
    title: "Welcome to the Inner Circle | The Obsidian Palace",
};

export default function MembershipSuccessPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-12 animate-in fade-in zoom-in duration-1000">
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5 relative">
                        <Crown className="text-gold w-12 h-12" />
                        <div className="absolute inset-0 rounded-full border border-gold/20 animate-ping opacity-20"></div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-serif text-white tracking-tight">Access Granted</h1>
                    <p className="text-gold uppercase tracking-[0.3em] text-[10px] font-bold">Welcome to the Inner Circle</p>
                    <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] leading-relaxed">
                        Your elevated status has been recognized. Exclusive access to vaulted collections and private events is now yours.
                    </p>
                </div>

                <div className="bg-zinc-950 border border-gold/10 p-6">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-medium leading-relaxed">
                        Your membership benefits are now active. Prepare for the extraordinary.
                    </p>
                </div>

                <Link
                    href="/shop"
                    className="inline-flex items-center gap-3 bg-gold text-black px-12 py-5 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 group"
                >
                    Enter Private Collection
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
