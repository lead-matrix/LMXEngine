'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, updateProduct } from '@/lib/actions/admin'
import { VariantsManager } from './VariantsManager'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, X, Image as ImageIcon } from 'lucide-react'

interface ProductFormProps {
    product?: any
}

export function ProductForm({ product }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState<string[]>(product?.images || [])
    const [newImageUrl, setNewImageUrl] = useState('')

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            // Add images to formData as comma separated string
            formData.set('images', images.join(', '))

            if (product?.id) {
                formData.set('id', product.id)
                await updateProduct(formData)
            } else {
                await createProduct(formData)
            }
            router.push('/admin/products')
            router.refresh()
        } catch (error) {
            console.error('Submission error:', error)
            alert('An architectural error occurred while saving.')
        } finally {
            setLoading(false)
        }
    }

    const addImage = () => {
        if (newImageUrl && !images.includes(newImageUrl)) {
            setImages([...images, newImageUrl])
            setNewImageUrl('')
        }
    }

    const removeImage = (url: string) => {
        setImages(images.filter(img => img !== url))
    }

    return (
        <form action={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Product Name</Label>
                        <Input
                            name="name"
                            defaultValue={product?.name}
                            placeholder="e.g. Obsidian Foundation"
                            required
                            className="bg-black border-gold/20 rounded-none focus-visible:ring-gold focus-visible:ring-offset-0 text-white placeholder:text-zinc-700 h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Base Price (USD)</Label>
                        <Input
                            name="base_price"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            defaultValue={product?.base_price}
                            required
                            className="bg-black border-gold/20 rounded-none focus-visible:ring-gold focus-visible:ring-offset-0 text-white placeholder:text-zinc-700 h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Category</Label>
                        <Input
                            name="category"
                            defaultValue={product?.category}
                            placeholder="e.g. FACE, LIPS, EYES"
                            required
                            className="bg-black border-gold/20 rounded-none focus-visible:ring-gold focus-visible:ring-offset-0 text-white placeholder:text-zinc-700 h-12"
                        />
                    </div>

                    <div className="flex items-center space-x-3 py-4">
                        <Switch id="is_featured" name="is_featured" defaultChecked={product?.is_featured} />
                        <Label htmlFor="is_featured" className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 cursor-pointer">Feature in Collection</Label>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Essence (Description)</Label>
                        <Textarea
                            name="description"
                            defaultValue={product?.description}
                            placeholder="Describe the masterpiece..."
                            required
                            className="bg-black border-gold/20 rounded-none focus-visible:ring-gold focus-visible:ring-offset-0 text-white placeholder:text-zinc-700 min-h-[180px] resize-none"
                        />
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Visual Gallery (URLS)</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="https://..."
                                className="bg-black border-gold/20 rounded-none focus-visible:ring-gold text-white placeholder:text-zinc-700 h-10"
                            />
                            <Button
                                type="button"
                                onClick={addImage}
                                className="bg-zinc-800 hover:bg-zinc-700 text-gold rounded-none"
                            >
                                <Plus size={16} />
                            </Button>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-2">
                            {images.map((url, i) => (
                                <div key={i} className="relative group aspect-square bg-zinc-900 border border-gold/10">
                                    <img src={url} alt="product" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(url)}
                                        className="absolute -top-1 -right-1 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                            {images.length === 0 && (
                                <div className="col-span-4 py-8 border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600">
                                    <ImageIcon size={24} className="mb-2 opacity-20" />
                                    <span className="text-[8px] uppercase tracking-widest">Gallery Empty</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-12 border-t border-gold/10">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-1 h-1 bg-gold rounded-full" />
                    <h3 className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">Variant Orchestrator</h3>
                </div>
                <VariantsManager initialVariants={product?.variants || []} />
            </div>

            <div className="flex justify-end pt-12">
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gold text-black rounded-none px-12 py-6 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-all disabled:opacity-50 min-w-[200px]"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                    {product ? 'Refine Masterpiece' : 'Forge Collection Item'}
                </Button>
            </div>
        </form>
    )
}
