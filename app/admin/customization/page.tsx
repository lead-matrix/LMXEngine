import { createClient } from "@/utils/supabase/server";
import { updateFrontendContent } from "../actions/frontend-actions";
import { Edit3, Layout, Save } from "lucide-react";

export default async function AdminCustomization() {
    const supabase = await createClient();
    const { data: hero } = await supabase.from('frontend_content').select('*').eq('content_key', 'hero_main').single();

    return (
        <div className="space-y-12 pb-24">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-serif text-white mb-2 italic tracking-tight">Curation</h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-[0.4em] font-medium">Visual Storefront Identity</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Hero Section Editor */}
                <section className="bg-zinc-950 border border-white/5 p-10 space-y-8">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                        <Layout className="w-4 h-4 text-gold" />
                        <h2 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold">Hero Masterpiece</h2>
                    </div>

                    <form action={async (formData) => {
                        "use server";
                        const title = formData.get("title");
                        const subtitle = formData.get("subtitle");
                        await updateFrontendContent('hero_main', { title, subtitle });
                    }} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Main Callout</label>
                            <textarea
                                name="title"
                                defaultValue={hero?.content_data?.title || ''}
                                className="w-full bg-zinc-900 border border-white/5 px-6 py-4 text-2xl font-serif text-white focus:border-gold/50 outline-none transition-all h-32 resize-none italic"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Subtext</label>
                            <input
                                name="subtitle"
                                type="text"
                                defaultValue={hero?.content_data?.subtitle || ''}
                                className="w-full bg-zinc-900 border border-white/5 px-6 py-4 text-sm text-zinc-400 focus:border-gold/50 outline-none transition-all"
                            />
                        </div>

                        <button type="submit" className="bg-gold text-black px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-gold/90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                            <Save className="w-4 h-4" />
                            Update Presence
                        </button>
                    </form>
                </section>

                {/* Live Preview Placeholder */}
                <section className="bg-zinc-950/50 border border-white/5 p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950 pointer-events-none"></div>
                    <p className="text-[9px] uppercase tracking-[0.5em] text-zinc-700 mb-4">Real-time Visual</p>
                    <h3 className="text-4xl font-serif text-white/20 italic mb-2 select-none">Preview Stage</h3>
                    <p className="text-zinc-800 text-[10px] select-none">Live changes apply instantly to dinacosmetic.store</p>
                </section>
            </div>
        </div>
    );
}
