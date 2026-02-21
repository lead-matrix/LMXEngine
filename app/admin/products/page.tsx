import { createClient } from "@/utils/supabase/server";
import { createProduct, deleteProduct } from "./actions";
import { Package, Plus, Trash2, DollarSign, Database } from "lucide-react";

export default async function AdminProductsPage() {
    const supabase = await createClient();

    const { data: products } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-12">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-serif text-white mb-2 italic tracking-tight">Merchandise</h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-[0.4em] font-medium">Inventory Portfolio</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Create Form */}
                <div className="lg:col-span-1">
                    <section className="bg-zinc-950 border border-white/5 p-8 space-y-6 sticky top-8">
                        <h2 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold border-b border-white/5 pb-4">New Acquisition</h2>

                        <form action={createProduct} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Product Name</label>
                                <input
                                    name="name"
                                    placeholder="The Obsidian Essence"
                                    required
                                    className="w-full bg-zinc-900 border border-white/5 px-6 py-3 text-sm text-white focus:border-gold/50 outline-none transition-all placeholder:text-zinc-800"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Price ($)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
                                        <input
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            placeholder="149.00"
                                            required
                                            className="w-full bg-zinc-900 border border-white/5 pl-10 pr-6 py-3 text-sm text-white focus:border-gold/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Initial Stock</label>
                                    <div className="relative">
                                        <Database className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
                                        <input
                                            name="stock"
                                            type="number"
                                            placeholder="50"
                                            required
                                            className="w-full bg-zinc-900 border border-white/5 pl-10 pr-6 py-3 text-sm text-white focus:border-gold/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Optional details..."
                                    className="w-full bg-zinc-900 border border-white/5 px-6 py-3 text-sm text-white focus:border-gold/50 outline-none transition-all h-24 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gold text-black py-4 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-gold/90 transition-all active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                Register Product
                            </button>
                        </form>
                    </section>
                </div>

                {/* Product List */}
                <div className="lg:col-span-2">
                    <div className="bg-zinc-950 border border-white/5 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                                        <th className="px-8 py-4 font-bold">Item</th>
                                        <th className="px-8 py-4 font-bold text-right">Valuation</th>
                                        <th className="px-8 py-4 font-bold text-center">Unit Count</th>
                                        <th className="px-8 py-4 font-bold text-right">Management</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[11px] text-zinc-400 font-light">
                                    {products?.map((product) => (
                                        <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-700 group-hover:border-gold/20 transition-colors">
                                                        <Package className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium text-sm tracking-wide">{product.name}</p>
                                                        <p className="text-[9px] text-zinc-600 font-mono">#{product.id.slice(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right text-zinc-300 font-serif italic">
                                                ${Number(product.price).toFixed(2)}
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`px-3 py-1 text-[9px] font-bold tracking-widest border ${product.stock < 10 ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-zinc-800 text-zinc-500'
                                                    }`}>
                                                    {product.stock} units
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <form action={async () => {
                                                    "use server";
                                                    await deleteProduct(product.id);
                                                }}>
                                                    <button
                                                        type="submit"
                                                        className="text-zinc-600 hover:text-red-500 transition-colors inline-flex items-center gap-2 group/btn"
                                                    >
                                                        <span className="text-[9px] uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity">Remove</span>
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!products || products.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-24 text-center text-zinc-600 uppercase text-[10px] tracking-[0.4em]">
                                                The collection is currently vacant
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
