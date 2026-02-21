"use server"

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateStoreSettings(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const tagline = formData.get('tagline') as string
    const currency = formData.get('currency') as string
    const storeEnabled = formData.get('storeEnabled') === 'on'

    // Update store info
    const { error: infoError } = await supabase
        .from('site_settings')
        .upsert({
            setting_key: 'store_info',
            setting_value: { name, tagline, currency }
        })

    if (infoError) throw infoError

    // Update kill switch
    const { error: enabledError } = await supabase
        .from('site_settings')
        .upsert({
            setting_key: 'store_enabled',
            setting_value: storeEnabled
        })

    if (enabledError) throw enabledError

    revalidatePath('/admin/settings')
    revalidatePath('/')
}
