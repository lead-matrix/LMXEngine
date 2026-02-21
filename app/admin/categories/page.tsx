import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Plus, Folder, Edit3, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default async function AdminCategories() {
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

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

    return (
        <div className="space-y-12">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-serif text-white mb-2 italic tracking-tight">Taxonomy</h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-[0.4em] font-medium">Category Architecture</p>
                </div>
                <button className="bg-gold text-black px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-gold/90 transition-all active:scale-95">
                    <Plus className="w-4 h-4" />
                    New Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories?.length ? (
                    categories.map((category) => (
                        <div key={category.id} className="bg-zinc-950 border border-white/5 p-8 group hover:border-gold/30 transition-all duration-500">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-12 h-12 bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-gold/20 transition-colors">
                                    <Folder className="w-5 h-5 text-zinc-500 group-hover:text-gold transition-colors" />
                                </div>
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button title="Edit" className="text-zinc-500 hover:text-gold transition-colors"><Edit3 className="w-4 h-4" /></button>
                                    <button title="Delete" className="text-zinc-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <h3 className="text-xl font-serif text-white mb-2 tracking-wide uppercase">{category.name}</h3>
                            <p className="text-zinc-500 text-[11px] uppercase tracking-widest font-bold mb-4">{category.slug}</p>
                            <p className="text-zinc-600 text-[11px] leading-relaxed line-clamp-2">
                                {category.description || 'No description provided for this collection.'}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5">
                        <Folder className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                        <p className="text-zinc-500 text-xs uppercase tracking-[0.3em]">No custom categories defined</p>
                    </div>
                )}
            </div>
        </div>
    )
}
