import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Eye, ExternalLink, PackageCheck } from 'lucide-react'
import Link from 'next/link'

export default async function AdminOrders() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    const { data: orders } = await supabase
        .from('orders')
        .select('id, customer_email, status, fulfillment_status, amount_total, created_at')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-12">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-serif text-white mb-2 italic tracking-tight">Ledger</h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-[0.4em] font-medium">Order History & Fulfillment</p>
                </div>
            </div>

            <div className="bg-zinc-950 border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                                <th className="px-8 py-4 font-bold">Ref No.</th>
                                <th className="px-8 py-4 font-bold">Customer</th>
                                <th className="px-8 py-4 font-bold">Payment</th>
                                <th className="px-8 py-4 font-bold">Fulfillment</th>
                                <th className="px-8 py-4 font-bold">Date</th>
                                <th className="px-8 py-4 font-bold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-[11px] text-zinc-400 font-light">
                            {orders?.map((order) => (
                                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-5">
                                        <Link href={`/admin/orders/${order.id}`} className="font-mono text-zinc-500 group-hover:text-gold transition-colors block">
                                            #{order.id.slice(0, 8)}
                                        </Link>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm tracking-wide lowercase">{order.customer_email}</span>
                                            <span className="text-[9px] text-zinc-600 uppercase tracking-widest mt-0.5 font-bold">Verified User</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold border ${order.status === 'paid' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-amber-500/30 text-amber-500 bg-amber-500/5'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold border ${order.fulfillment_status === 'fulfilled' ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' : 'border-zinc-700 text-zinc-500'
                                            }`}>
                                            {order.fulfillment_status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-zinc-600 font-serif italic">
                                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-white font-medium text-[13px]">${Number(order.amount_total).toFixed(2)}</span>
                                            <Link href={`/admin/orders/${order.id}`} className="text-[9px] text-gold uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Fulfill Item
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
