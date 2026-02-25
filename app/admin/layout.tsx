import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    let user = null;
    try {
        const { data: { user: foundUser } } = await supabase.auth.getUser()
        user = foundUser;
    } catch {
        // Fall through to redirect
    }

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        redirect('/')
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>
}
