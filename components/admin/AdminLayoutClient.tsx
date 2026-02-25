"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    ChevronRight,
    Menu,
    ChevronLeft,
    Layers,
    LogOut
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const SidebarContent = () => (
        <div className="flex flex-col h-full font-sans bg-background-primary border-r border-gold-primary/10">
            <div className="px-6 py-8 border-b border-gold-primary/10 bg-background-secondary/30">
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 border border-gold-primary/20 bg-background-primary flex items-center justify-center">
                        <span className="font-serif text-gold-primary text-xs">OP</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-serif tracking-widest text-gold-primary uppercase">
                            Obsidian Palace
                        </h1>
                        <p className="text-[8px] text-text-mutedDark tracking-[0.3em] font-light mt-1">
                            SUPREME MANAGEMENT
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-grow py-6 space-y-0.5 overflow-y-auto">
                <div className="px-6 mb-3">
                    <span className="text-[8px] uppercase tracking-[0.3em] text-text-mutedDark/40 font-bold">Operations</span>
                </div>
                <AdminNavLink href="/admin" exact pathname={pathname} onClick={() => setIsMobileMenuOpen(false)} icon={<LayoutDashboard size={15} />} label="Overview" />
                <AdminNavLink href="/admin/products" pathname={pathname} onClick={() => setIsMobileMenuOpen(false)} icon={<Package size={15} />} label="Products" />
                <AdminNavLink href="/admin/orders" pathname={pathname} onClick={() => setIsMobileMenuOpen(false)} icon={<ShoppingCart size={15} />} label="Fulfillment" />
                <AdminNavLink href="/admin/categories" pathname={pathname} onClick={() => setIsMobileMenuOpen(false)} icon={<Layers size={15} />} label="Categories" />
                <AdminNavLink href="/admin/users" pathname={pathname} onClick={() => setIsMobileMenuOpen(false)} icon={<Users size={15} />} label="Clientele" />

                <div className="pt-6 mt-2">
                    <div className="px-6 mb-3">
                        <span className="text-[8px] uppercase tracking-[0.3em] text-text-mutedDark/40 font-bold">Configuration</span>
                    </div>
                    <AdminNavLink href="/admin/settings" pathname={pathname} onClick={() => setIsMobileMenuOpen(false)} icon={<Settings size={15} />} label="Site Editor" />
                </div>
            </nav>

            <div className="p-4 border-t border-gold-primary/10 bg-background-secondary/50">
                <Link
                    href="/"
                    className="flex items-center gap-3 mb-1 px-4 py-3 text-[9px] uppercase tracking-widest text-text-mutedDark/50 hover:text-text-headingDark hover:bg-gold-primary/5 transition-all group"
                >
                    <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                    View Storefront
                </Link>
                <button
                    onClick={async () => {
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        window.location.href = "/";
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[9px] uppercase tracking-widest text-red-500/60 hover:text-red-400 hover:bg-red-500/8 transition-all"
                >
                    <LogOut size={12} />
                    Disconnect
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-background-primary text-text-bodyDark font-sans overflow-x-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 border-r border-gold-primary/10 flex-col bg-background-secondary/20 sticky top-0 h-screen">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-grow flex flex-col min-w-0">
                <header className="h-16 md:h-20 border-b border-gold-primary/10 flex items-center justify-between px-4 md:px-10 bg-background-primary/50 backdrop-blur-xl sticky top-0 z-[40]">
                    <div className="flex items-center gap-4">
                        {/* Mobile Hamburguer */}
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <button className="md:hidden p-2 -ml-2 text-text-mutedDark/40 hover:text-gold-primary transition-colors">
                                    <Menu size={20} />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-background-primary border-r border-gold-primary/20 w-[280px] p-0">
                                <SheetHeader className="sr-only">
                                    <SheetTitle>Admin Navigation</SheetTitle>
                                </SheetHeader>
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>

                        <nav className="flex items-center gap-2 text-[8px] md:text-[10px] text-text-mutedDark/40 uppercase tracking-[0.3em] font-light">
                            <span className="text-text-mutedDark/20">Operations</span>
                            <ChevronRight size={10} className="text-text-mutedDark/10" />
                            <span className="text-gold-primary">Command Center</span>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end mr-2">
                            <span className="text-[9px] uppercase tracking-widest text-text-mutedDark/60">Arch-Admin</span>
                            <span className="text-[8px] text-text-mutedDark/30">CONNECTED</span>
                        </div>
                        <div className="w-10 h-10 rounded-none bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center text-[11px] text-gold-primary font-bold shadow-[0_0_15px_rgb(var(--gold-primary)/0.1)]">
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

function AdminNavLink({
    href, icon, label, onClick, pathname, exact
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    pathname?: string | null;
    exact?: boolean;
}) {
    const isActive = exact
        ? pathname === href
        : (pathname?.startsWith(href) && href !== '/admin') || pathname === href;

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-4 px-6 py-3.5 text-[10px] uppercase tracking-[0.25em] border-l-2 transition-all duration-200 ${isActive
                    ? 'border-gold-primary bg-gold-primary/8 text-gold-primary'
                    : 'border-transparent text-text-mutedDark/50 hover:border-gold-primary/40 hover:bg-gold-primary/4 hover:text-text-headingDark'
                }`}
        >
            <span className={`transition-colors ${isActive ? 'text-gold-primary' : 'text-text-mutedDark/40'}`}>
                {icon}
            </span>
            <span className={`font-light transition-colors ${isActive ? 'text-gold-primary' : ''}`}>
                {label}
            </span>
            {isActive && <div className="ml-auto w-1 h-1 bg-gold-primary rounded-full" />}
        </Link>
    );
}
