import { createClient } from '@/utils/supabase/server'
import { Plus, Trash2, Edit3, Tag } from 'lucide-react'
import { createCategory, deleteCategory } from './actions'

export default async function AdminCategories() {
    const supabase = await createClient()
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name')

    return (
        <div className="space-y-12 pb-24">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-serif text-white mb-2 italic tracking-tight">Taxonomy</h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-[0.4em] font-medium">Category Management & Hierarchy</p>
                </div>

                <form action={createCategory} className="flex gap-4">
                    <input
                        name="name"
                        placeholder="NEW CATEGORY NAME"
                        className="bg-zinc-950 border border-white/10 px-6 py-3 text-[10px] uppercase tracking-widest text-white outline-none focus:border-gold/50 transition-all"
                        required
                    />
                    <button type="submit" className="bg-gold text-black px-10 py-3 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-gold/90 transition-all active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                        <Plus className="w-4 h-4" />
                        Add Category
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories?.map((category) => (
                    <div key={category.id} className="group relative bg-zinc-950 border border-white/5 p-8 hover:border-gold/30 transition-all duration-500 overflow-hidden">
                        {/* Background Ornament */}
                        <Tag className="absolute -right-4 -bottom-4 w-24 h-24 text-white/[0.02] -rotate-12 group-hover:text-gold/[0.05] transition-all duration-700" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-lg font-serif text-white italic tracking-wide">{category.name}</h3>
                                <form action={async () => {
                                    "use server"
                                    await deleteCategory(category.id);
                                }}>
                                    <button className="text-zinc-700 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>

                            <p className="text-[11px] text-zinc-500 leading-relaxed uppercase tracking-widest mb-8">
                                {category.description || 'No description provided for this collection.'}
                            </p>

                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[9px] text-zinc-600 uppercase tracking-[0.3em]">Slug: {category.slug}</span>
                                <button className="text-[9px] text-gold uppercase tracking-widest font-bold flex items-center gap-2 hover:opacity-80 transition-all">
                                    <Edit3 className="w-3 h-3" />
                                    Modify
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {(!categories || categories.length === 0) && (
                    <div className="col-span-full py-24 text-center border border-dashed border-white/10">
                        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.5em]">No categories defined in the vault.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
