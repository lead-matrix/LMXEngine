import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
    title: "Refine Item | Admin Palace",
};

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: product } = await supabase
        .from('products')
        .select('*, variants(*)')
        .eq('id', id)
        .single();

    if (!product) {
        notFound();
    }

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link
                href="/admin/products"
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-zinc-500 hover:text-gold transition-colors"
            >
                <ArrowLeft size={12} />
                Back to Vault
            </Link>

            <div>
                <h2 className="text-3xl font-serif text-gold mb-1">Refine Masterpiece</h2>
                <p className="text-zinc-500 text-sm tracking-widest uppercase">Evolving the {product.name}</p>
            </div>

            <div className="bg-zinc-950 border border-gold/10 p-8 shadow-2xl">
                <ProductForm product={product} />
            </div>
        </div>
    );
}
