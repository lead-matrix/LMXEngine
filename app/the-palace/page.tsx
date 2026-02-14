import { createClient } from '@/utils/supabase/server'

export default async function Page() {
    const supabase = await createClient()

    const { data: todos } = await supabase.from('todos').select()

    return (
        <div className="bg-black text-white min-h-screen pt-32 pb-24 px-6 flex items-center justify-center">
            <div className="max-w-md w-full border border-gold/20 bg-zinc-950 p-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-serif italic text-gold uppercase tracking-tighter">The Registry</h1>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.5em] font-light">Artifact Manifestations</p>
                </div>

                <ul className="space-y-6">
                    {todos?.map((todo: any, i: number) => (
                        <li key={i} className="flex items-center gap-4 text-[11px] uppercase tracking-widest text-white/70 border-b border-white/5 pb-4">
                            <span className="text-gold opacity-30">[{String(i + 1).padStart(2, '0')}]</span>
                            {typeof todo === 'object' ? JSON.stringify(todo) : todo}
                        </li>
                    ))}
                    {(!todos || todos.length === 0) && (
                        <p className="text-center text-[10px] text-zinc-700 uppercase tracking-widest italic pt-8">No records found in the current vault segment.</p>
                    )}
                </ul>
            </div>
        </div>
    )
}
