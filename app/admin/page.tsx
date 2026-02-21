import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Package, ShoppingCart, DollarSign, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
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

    // Fetch stats in parallel
    const [
        { data: revenueData },
        { count: totalOrders },
        { count: lowInventoryProducts },
        { data: recentOrders }
    ] = await Promise.all([
        supabase.from('orders').select('total_amount').eq('status', 'paid'),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).lt('inventory', 5),
        supabase.from('orders')
            .select('id, email, status, total_amount, created_at')
            .order('created_at', { ascending: false })
            .limit(10)
    ])

    const totalRevenue = revenueData?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0

    const stats = [
        { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500' },
        { label: 'Total Orders', value: totalOrders || 0, icon: ShoppingCart, color: 'text-blue-500' },
        { label: 'Low Inventory', value: lowInventoryProducts || 0, icon: Package, color: 'text-amber-500' },
        { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, color: 'text-gold' },
    ]

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-serif text-white mb-2 italic tracking-tight">Executive Dashboard</h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-[0.4em] font-medium">Internal Smarket Overview</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="bg-gold text-black px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-gold/90 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Create Product
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-zinc-950 border border-white/5 p-8 group hover:border-gold/30 transition-all duration-500">
                        <div className="flex items-start justify-between mb-4">
                            <stat.icon className={`w-5 h-5 ${stat.color} opacity-80`} />
                        </div>
                        <p className="text-4xl font-serif text-white mb-1">{stat.value}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-950 border border-white/5 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-serif text-white tracking-widest uppercase">Recent Transactions</h2>
                    <Link href="/admin/orders" className="text-[10px] text-gold uppercase tracking-[0.2em] hover:opacity-80 transition-all">
                        View All Orders
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                                <th className="px-8 py-4 font-bold">Order ID</th>
                                <th className="px-8 py-4 font-bold">Email</th>
                                <th className="px-8 py-4 font-bold">Status</th>
                                <th className="px-8 py-4 font-bold">Date</th>
                                <th className="px-8 py-4 font-bold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-[11px] text-zinc-400 font-light">
                            {recentOrders?.map((order) => (
                                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-5 font-mono text-zinc-500 group-hover:text-gold transition-colors truncate max-w-[120px]">
                                        #{order.id.slice(0, 8)}
                                    </td>
                                    <td className="px-8 py-5">{order.email}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold ${order.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-zinc-600">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 text-right text-white font-medium">
                                        ${Number(order.total_amount).toFixed(2)}
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
