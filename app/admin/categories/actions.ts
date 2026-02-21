"use server"

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
    const supabase = await createClient()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const slug = name.toLowerCase().replace(/ /g, '-')

    const { error } = await supabase
        .from('categories')
        .insert([{ name, description, slug }])

    if (error) throw error
    revalidatePath('/admin/categories')
}

export async function updateCategory(id: string, formData: FormData) {
    const supabase = await createClient()
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    const { error } = await supabase
        .from('categories')
        .update({ name, description })
        .eq('id', id)

    if (error) throw error
    revalidatePath('/admin/categories')
}

export async function deleteCategory(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

    if (error) throw error
    revalidatePath('/admin/categories')
}
