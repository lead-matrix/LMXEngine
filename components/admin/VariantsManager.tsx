"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Variant {
    id?: string;
    name: string;
    price_override?: number;
    stock_quantity: number;
    sku: string;
}

export default function VariantsManager({ initialVariants = [] }: { initialVariants?: Variant[] }) {
    const [variants, setVariants] = useState<Variant[]>(initialVariants.length > 0 ? initialVariants : [{ name: '', stock_quantity: 0, sku: '' }]);

    const addVariant = () => {
        setVariants([...variants, { name: '', stock_quantity: 0, sku: '' }]);
    };

    const removeVariant = (index: number) => {
        const newVariants = [...variants];
        newVariants.splice(index, 1);
        setVariants(newVariants);
    };

    const updateVariant = (index: number, field: keyof Variant, value: any) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };

    return (
        <section className="bg-zinc-950 border border-gold/10 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gold/5 pb-4">
                <h3 className="text-sm font-serif text-zinc-400 uppercase tracking-[0.3em]">The Selection (Variants)</h3>
                <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold hover:text-white transition-colors"
                >
                    <Plus size={14} />
                    Add Variant
                </button>
            </div>

            <div className="space-y-4">
                {variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-zinc-900/50 border border-zinc-800">
                        <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-widest text-zinc-500">Name (e.g. 50ml, Gold Edition)</label>
                            <input
                                name={`variant_name_${index}`}
                                value={variant.name}
                                onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-white text-xs outline-none focus:border-gold"
                                placeholder="Variant Name"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-widest text-zinc-500">Price Override (Optional)</label>
                            <input
                                name={`variant_price_${index}`}
                                type="number"
                                step="0.01"
                                value={variant.price_override || ''}
                                onChange={(e) => updateVariant(index, 'price_override', parseFloat(e.target.value))}
                                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-white text-xs outline-none focus:border-gold"
                                placeholder="Inherit Base"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-widest text-zinc-500">Stock</label>
                            <input
                                name={`variant_stock_${index}`}
                                type="number"
                                value={variant.stock_quantity}
                                onChange={(e) => updateVariant(index, 'stock_quantity', parseInt(e.target.value))}
                                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-white text-xs outline-none focus:border-gold"
                                required
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <div className="flex-grow space-y-1">
                                <label className="text-[9px] uppercase tracking-widest text-zinc-500">SKU</label>
                                <input
                                    name={`variant_sku_${index}`}
                                    value={variant.sku}
                                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 p-2 text-white text-xs outline-none focus:border-gold"
                                    placeholder="SKU-..."
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeVariant(index)}
                                className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        {variant.id && <input type="hidden" name={`variant_id_${index}`} value={variant.id} />}
                    </div>
                ))}
            </div>

            <input type="hidden" name="variant_count" value={variants.length} />

            {variants.length === 0 && (
                <p className="text-center py-10 text-zinc-600 text-xs tracking-widest uppercase">
                    No variants defined. Using base settings.
                </p>
            )}
        </section>
    );
}
