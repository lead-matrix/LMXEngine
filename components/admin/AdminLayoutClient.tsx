"use client";

import Link from "next/link";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    ChevronRight,
    Menu,
    ChevronLeft
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import Image from "next/image";

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const SidebarContent = () => (
        <div className="flex flex-col h-full font-sans">
            <div className="px-6 py-12 border-b border-gold/10 bg-zinc-950/30">
                <div className="flex items-center gap-3 mb-6">
                    <div className="relative w-8 h-8">
                        <Image src="/logo.jpg" alt="Admin Logo" fill className="object-contain" />
                    </div>
                    <div>
                        <h1 className="text-xl font-serif tracking-widest text-gold uppercase">
                            Admin Palace
                        </h1>
                        <p className="text-[8px] text-zinc-500 tracking-[0.3em] font-light">
                            SUPREME MANAGEMENT
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-grow px-2 py-8 space-y-1">
                <AdminNavLink href="/admin" onClick={() => setIsMobileMenuOpen(false)} icon={<LayoutDashboard size={18} />} label="Dashboard" />
                <AdminNavLink href="/admin/products" onClick={() => setIsMobileMenuOpen(false)} icon={<Package size={18} />} label="Products" />
                <AdminNavLink href="/admin/orders" onClick={() => setIsMobileMenuOpen(false)} icon={<ShoppingCart size={18} />} label="Orders" />
                <AdminNavLink href="/admin/users" onClick={() => setIsMobileMenuOpen(false)} icon={<Users size={18} />} label="Customers" />
                <AdminNavLink href="/admin/settings" onClick={() => setIsMobileMenuOpen(false)} icon={<Settings size={18} />} label="Settings" />
            </nav>

            <div className="p-4 border-t border-gold/10">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-4 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5 transition-all group"
                >
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Teleport To Store
                </Link>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-black text-white font-sans overflow-x-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 border-r border-gold/10 flex-col bg-zinc-950/20 sticky top-0 h-screen">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-grow flex flex-col min-w-0">
                <header className="h-16 md:h-20 border-b border-gold/10 flex items-center justify-between px-4 md:px-10 bg-black/50 backdrop-blur-xl sticky top-0 z-[40]">
                    <div className="flex items-center gap-4">
                        {/* Mobile Hamburguer */}
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <button className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-gold transition-colors">
                                    <Menu size={20} />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-black border-r border-gold/20 w-[280px] p-0">
                                <SheetHeader className="sr-only">
                                    <SheetTitle>Admin Navigation</SheetTitle>
                                </SheetHeader>
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>

                        <nav className="flex items-center gap-2 text-[8px] md:text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-light">
                            <span className="text-zinc-600">Operations</span>
                            <ChevronRight size={10} className="text-zinc-800" />
                            <span className="text-gold">Command Center</span>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end mr-2">
                            <span className="text-[9px] uppercase tracking-widest text-zinc-400">Arch-Admin</span>
                            <span className="text-[8px] text-zinc-600">CONNECTED</span>
                        </div>
                        <div className="w-10 h-10 rounded-none bg-gold/10 border border-gold/30 flex items-center justify-center text-[11px] text-gold font-bold shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                            AD
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-10 container mx-auto max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}

function AdminNavLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick?: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-4 px-6 py-4 text-[10px] uppercase tracking-[0.3em] rounded-none border-l-2 border-transparent hover:border-gold hover:bg-gold/5 transition-all group"
        >
            <span className="text-zinc-600 group-hover:text-gold transition-colors">
                {icon}
            </span>
            <span className="font-light text-zinc-500 group-hover:text-white transition-colors">
                {label}
            </span>
        </Link>
    );
}
