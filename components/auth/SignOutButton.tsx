"use client";

import { createClient } from "@/utils/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/");
    };

    return (
        <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-6 py-2 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 text-zinc-400 text-xs uppercase tracking-widest transition-all duration-300"
        >
            <LogOut size={14} />
            Sign Out
        </button>
    );
}
