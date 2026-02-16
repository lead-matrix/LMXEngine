import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, User, LogOut, ChevronRight } from "lucide-react";
import SignOutButton from "@/components/auth/SignOutButton";

export const metadata = {
    title: "My Account | DINA COSMETIC",
    description: "Manage your account and view order history.",
};

export default async function AccountPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Profile if needed (for full name)
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const userName = profile?.full_name || user.email?.split("@")[0] || "Guest";
    const userRole = profile?.role || "customer";

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Welcome Header */}
                <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <p className="text-gold text-xs uppercase tracking-[0.3em]">The Obsidian Palace</p>
                    <h1 className="text-4xl md:text-5xl font-serif text-white">
                        Welcome back, {userName}
                    </h1>
                    <p className="text-zinc-500 font-light tracking-wide max-w-lg mx-auto">
                        Your personal sanctuary for managing orders and account details.
                    </p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">

                    {/* Orders Card */}
                    <Link href="/orders" className="group p-8 border border-white/5 bg-zinc-950/30 hover:border-gold/30 hover:bg-zinc-900/50 transition-all duration-500">
                        <div className="flex justify-between items-start mb-6">
                            <Package size={24} className="text-zinc-600 group-hover:text-gold transition-colors" />
                            <ChevronRight size={16} className="text-zinc-700 group-hover:text-white transition-colors group-hover:translate-x-1 duration-300" />
                        </div>
                        <h3 className="text-xl font-serif mb-2 text-zinc-300 group-hover:text-white">Order History</h3>
                        <p className="text-sm text-zinc-500 font-light">View past purchases and track current shipments.</p>
                    </Link>

                    {/* Profile Card */}
                    <div className="p-8 border border-white/5 bg-zinc-950/30 hover:border-gold/30 transition-all duration-500 group">
                        <div className="flex justify-between items-start mb-6">
                            <User size={24} className="text-zinc-600 group-hover:text-gold transition-colors" />
                            <div className="px-3 py-1 bg-white/5 text-[10px] uppercase tracking-widest text-zinc-400 border border-white/5 rounded-full">
                                {userRole}
                            </div>
                        </div>
                        <h3 className="text-xl font-serif mb-2 text-zinc-300 group-hover:text-white">Account Details</h3>
                        <p className="text-sm text-zinc-500 font-light mb-1">{user.email}</p>
                        <p className="text-xs text-zinc-600 font-light">Member since {new Date(user.created_at).getFullYear()}</p>
                    </div>

                    {/* Admin Access (If Admin) */}
                    {userRole === 'admin' && (
                        <Link href="/admin" className="md:col-span-2 group p-8 border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <User size={100} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-serif mb-2 text-gold">Admin Portal Access</h3>
                                <p className="text-sm text-gold/70 font-light">Manage products, orders, and site content.</p>
                            </div>
                        </Link>
                    )}

                    {/* Sign Out Action */}
                    <div className="md:col-span-2 flex justify-center pt-8">
                        <SignOutButton />
                    </div>

                </div>
            </div>
        </div>
    );
}
