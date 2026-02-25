'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, updateProduct } from '@/lib/actions/admin'
import { ImageUpload } from './ImageUpload'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface Category {
    id: string
    name: string
}

interface ProductFormProps {
    product?: {
        id?: string
        name?: string
        description?: string
        price?: number
        stock?: number
        images?: string[]
        is_featured?: boolean
        category_id?: string
    }
}

export function ProductForm({ product }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [images, setImages] = useState<string[]>(product?.images || [])
    const [categories, setCategories] = useState<Category[]>([])

    // Fetch categories for the dropdown
    useEffect(() => {
        const supabase = createClient()
        supabase
            .from('categories')
            .select('id, name')
            .order('name')
            .then(({ data }) => {
                if (data) setCategories(data)
            })
    }, [])

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        try {
            // Attach images list to formData
            formData.set('images', images.join(','))

            if (product?.id) {
                formData.set('id', product.id)
                await updateProduct(formData)
            } else {
                await createProduct(formData)
            }
            router.push('/admin/products')
            router.refresh()
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'An unexpected error occurred while saving.'
            console.error('Product save error:', message)
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-10">

            {/* Error Banner */}
            {error && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* LEFT COLUMN */}
                <div className="space-y-6">
                    {/* Product Name */}
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-text-mutedDark/60">
                            Product Name *
                        </Label>
                        <Input
                            name="name"
                            defaultValue={product?.name}
                            placeholder="e.g. Obsidian Foundation"
                            required
                            className="bg-background-primary border-gold-primary/20 rounded-none focus-visible:ring-gold-primary focus-visible:ring-offset-0 text-text-bodyDark placeholder:text-text-mutedDark/20 h-12"
                        />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-text-mutedDark/60">
                            Price (USD) *
                        </Label>
                        <Input
                            name="base_price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            defaultValue={product?.price}
                            required
                            className="bg-background-primary border-gold-primary/20 rounded-none focus-visible:ring-gold-primary focus-visible:ring-offset-0 text-text-bodyDark placeholder:text-text-mutedDark/20 h-12"
                        />
                    </div>

                    {/* Stock */}
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-text-mutedDark/60">
                            Stock Quantity *
                        </Label>
                        <Input
                            name="stock"
                            type="number"
                            min="0"
                            placeholder="50"
                            defaultValue={product?.stock ?? 0}
                            required
                            className="bg-background-primary border-gold-primary/20 rounded-none focus-visible:ring-gold-primary focus-visible:ring-offset-0 text-text-bodyDark placeholder:text-text-mutedDark/20 h-12"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-text-mutedDark/60">
                            Category
                        </Label>
                        <select
                            name="category_id"
                            defaultValue={product?.category_id ?? ''}
                            className="w-full h-12 bg-background-primary border border-gold-primary/20 px-4 text-sm text-text-bodyDark focus:outline-none focus:border-gold-primary/50 transition-colors"
                        >
                            <option value="">— No Category —</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {categories.length === 0 && (
                            <p className="text-[10px] text-text-mutedDark/40 uppercase tracking-widest">
                                No categories yet — create them in /admin/categories
                            </p>
                        )}
                    </div>

                    {/* Featured Toggle */}
                    <div className="flex items-center space-x-3 py-2">
                        <Switch
                            id="is_featured"
                            name="is_featured"
                            defaultChecked={product?.is_featured}
                        />
                        <Label
                            htmlFor="is_featured"
                            className="text-[10px] uppercase tracking-[0.2em] text-text-mutedDark/60 cursor-pointer"
                        >
                            Feature in Collection
                        </Label>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                    {/* Description */}
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-text-mutedDark/60">
                            Description *
                        </Label>
                        <Textarea
                            name="description"
                            defaultValue={product?.description}
                            placeholder="Describe the masterpiece..."
                            required
                            className="bg-background-primary border-gold-primary/20 rounded-none focus-visible:ring-gold-primary focus-visible:ring-offset-0 text-text-bodyDark placeholder:text-text-mutedDark/20 min-h-[180px] resize-none"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-4">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-text-mutedDark/60">
                            Visual Gallery
                        </Label>
                        <ImageUpload
                            images={images}
                            onImagesChange={setImages}
                            maxImages={10}
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-8 border-t border-gold-primary/10">
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gold-primary text-background-primary rounded-none px-12 py-6 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gold-hover transition-all disabled:opacity-50 min-w-[200px]"
                >
                    {loading ? <Loader2 className="animate-spin mr-2 w-4 h-4 inline" /> : null}
                    {product?.id ? 'Refine Masterpiece' : 'Forge Collection Item'}
                </Button>
            </div>
        </form>
    )
}
