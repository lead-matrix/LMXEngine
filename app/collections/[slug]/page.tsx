import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ProductGrid } from '@/components/ProductGrid'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const supabase = await createClient()

    const { data: category } = await supabase
        .from('categories')
        .select('name, description')
        .eq('slug', slug)
        .single()

    if (!category) return { title: 'Collection Not Found' }

    return {
        title: `${category.name} Collection | DINA COSMETIC`,
        description: category.description || `Shop our ${category.name} collection — luxury beauty at its finest.`,
        openGraph: {
            title: `${category.name} | DINA COSMETIC`,
            description: category.description || `Shop the ${category.name} collection.`,
        },
    }
}

export default async function CollectionSlugPage({ params }: Props) {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch the category by slug
    const { data: category } = await supabase
        .from('categories')
        .select('id, name, slug, description, image_url')
        .eq('slug', slug)
        .single()

    if (!category) notFound()

    // Count products in this category
    const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_active', true)

    // Fetch all categories for cross-navigation
    const { data: allCategories } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name')

    return (
        <div className="bg-background-primary text-text-bodyDark min-h-screen">

            {/* ── Hero Banner ── */}
            <div className="relative pt-40 pb-24 px-6 overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.04]"
                        style={{
                            background: 'radial-gradient(ellipse, rgb(212 175 55), transparent 70%)',
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Breadcrumb */}
                    <Link
                        href="/collections"
                        className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-text-mutedDark/40 hover:text-gold-primary transition-colors mb-12"
                    >
                        <ArrowLeft size={10} />
                        All Collections
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-gold-primary/10 pb-16">
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 text-gold-primary">
                                <Sparkles size={10} className="animate-pulse" />
                                <span className="text-[9px] uppercase tracking-[0.6em] font-light">
                                    Collection · {(productCount ?? 0)} pieces
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-serif italic tracking-tighter text-text-headingDark">
                                {category.name}
                            </h1>
                        </div>
                        <p className="text-text-mutedDark text-[10px] uppercase tracking-[0.3em] max-w-xs text-right leading-loose md:pb-4">
                            {category.description || 'Curated excellence for those who demand nothing but the finest.'}
                        </p>
                    </div>

                    {/* Cross-category navigation */}
                    {allCategories && allCategories.length > 1 && (
                        <div className="flex flex-wrap gap-6 items-center pt-8 text-[10px] uppercase tracking-[0.3em] font-light">
                            <span className="text-text-mutedDark/30">Browse:</span>
                            {allCategories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/collections/${cat.slug}`}
                                    className={`transition-colors ${cat.slug === slug
                                        ? 'text-gold-primary'
                                        : 'text-text-bodyDark/30 hover:text-gold-primary'
                                        }`}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Products Grid ── */}
            <div className="px-6 max-w-7xl mx-auto pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <ProductGrid categoryId={category.id} />
            </div>

        </div>
    )
}
