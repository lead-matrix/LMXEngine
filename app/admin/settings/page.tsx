import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Save, ShieldCheck, Globe, CreditCard, Bell } from 'lucide-react'

export default async function AdminSettings() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    const { data: storeInfo } = await supabase.from('site_settings').select('*').eq('setting_key', 'store_info').single()

    return (
        <div className="space-y-12 pb-24">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-serif text-white mb-2 italic tracking-tight">Configuration</h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-[0.4em] font-medium">System Control & Identity</p>
                </div>
                <button className="bg-gold text-black px-10 py-3 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-gold/90 transition-all active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Navigation */}
                <div className="lg:col-span-1 space-y-4">
                    {[
                        { label: 'General Info', icon: Globe, active: true },
                        { label: 'Security', icon: ShieldCheck },
                        { label: 'Payments', icon: CreditCard },
                        { label: 'Notifications', icon: Bell },
                    ].map((item) => (
                        <button key={item.label} className={`w-full flex items-center gap-4 px-6 py-4 border-l-2 transition-all ${item.active ? 'border-gold bg-white/5 text-gold' : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/[0.02]'}`}>
                            <item.icon className="w-4 h-4" />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="lg:col-span-3 space-y-12">
                    {/* Store Section */}
                    <section className="bg-zinc-950 border border-white/5 p-10 space-y-8">
                        <h2 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold border-b border-white/5 pb-4">Brand Identity</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Store Name</label>
                                <input
                                    type="text"
                                    defaultValue={storeInfo?.setting_value?.name || 'DINA COSMETIC'}
                                    className="w-full bg-zinc-900 border border-white/5 px-6 py-3 text-sm text-white focus:border-gold/50 outline-none transition-all placeholder:text-zinc-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Primary Currency</label>
                                <select className="w-full bg-zinc-900 border border-white/5 px-6 py-3 text-sm text-white focus:border-gold/50 outline-none transition-all">
                                    <option>USD ($)</option>
                                    <option>EUR (€)</option>
                                    <option>GBP (£)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Store Tagline</label>
                            <input
                                type="text"
                                defaultValue={storeInfo?.setting_value?.tagline || 'Luxury Redefined'}
                                className="w-full bg-zinc-900 border border-white/5 px-6 py-3 text-sm text-white focus:border-gold/50 outline-none transition-all"
                            />
                        </div>
                    </section>

                    {/* Infrastructure */}
                    <section className="bg-zinc-950 border border-white/5 p-10 space-y-8">
                        <h2 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold border-b border-white/5 pb-4">Infrastructure</h2>
                        <div className="flex items-center justify-between p-6 bg-emerald-500/5 border border-emerald-500/10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-widest text-emerald-500 font-bold">System Status: Optimal</p>
                                    <p className="text-[10px] text-emerald-500/60 mt-0.5">Stripe Webhooks & Supabase Engine Active</p>
                                </div>
                            </div>
                            <button className="text-[9px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Run Diagnostics</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
