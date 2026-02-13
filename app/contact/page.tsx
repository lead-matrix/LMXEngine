import { Mail, MapPin, Phone, Send } from "lucide-react";

export const metadata = {
    title: "Concierge | DINA COSMETIC",
    description: "Contact the Obsidian Palace for inquiries and luxury support.",
};

export default function ContactPage() {
    return (
        <div className="bg-black text-white min-h-screen pt-32 pb-20">
            <div className="px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    {/* Left: Info */}
                    <div className="space-y-16">
                        <div className="space-y-6">
                            <h2 className="text-gold uppercase tracking-[0.5em] text-xs font-light">Client Relations</h2>
                            <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter uppercase leading-none">
                                Concierge
                            </h1>
                            <p className="text-zinc-500 text-sm uppercase tracking-[0.3em] max-w-md leading-relaxed">
                                Our dedicated team is available to assist you with any inquiries regarding the Palace collection and your acquisitions.
                            </p>
                        </div>

                        <div className="space-y-12">
                            <ContactItem 
                                icon={<Mail size={20} className="text-gold" />}
                                label="Electronic Mail"
                                value="concierge@dinacosmetic.store"
                            />
                            <ContactItem 
                                icon={<Phone size={20} className="text-gold" />}
                                label="Tele-Inquiry"
                                value="+1 (800) LUX-DINA"
                            />
                            <ContactItem 
                                icon={<MapPin size={20} className="text-gold" />}
                                label="The Palace Headquarters"
                                value="123 Obsidian Tower, Virtual City"
                            />
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="bg-zinc-950 border border-gold/10 p-12 space-y-10 group hover:border-gold/30 transition-all duration-700">
                        <h3 className="text-xl font-serif italic text-white">Send an Inquiry</h3>
                        <form className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold">Your Identity</label>
                                <input 
                                    type="text" 
                                    placeholder="NAME / TITLE"
                                    className="w-full bg-black border-b border-white/10 py-4 outline-none focus:border-gold transition-colors text-sm font-light tracking-widest uppercase placeholder:text-zinc-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold">Contact Channel</label>
                                <input 
                                    type="email" 
                                    placeholder="EMAIL ADDRESS"
                                    className="w-full bg-black border-b border-white/10 py-4 outline-none focus:border-gold transition-colors text-sm font-light tracking-widest uppercase placeholder:text-zinc-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold">The Essence of Inquiry</label>
                                <textarea 
                                    rows={4}
                                    placeholder="HOW MAY WE ASSIST YOU?"
                                    className="w-full bg-black border-b border-white/10 py-4 outline-none focus:border-gold transition-colors text-sm font-light tracking-widest uppercase placeholder:text-zinc-800 resize-none"
                                />
                            </div>
                            <button className="w-full bg-gold text-black py-5 uppercase text-[10px] tracking-[0.4em] font-bold hover:bg-white transition-all flex items-center justify-center gap-4">
                                Dispatch Message <Send size={14} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex gap-6 items-start">
            <div className="mt-1">{icon}</div>
            <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-bold">{label}</p>
                <p className="text-lg font-serif italic text-white/80">{value}</p>
            </div>
        </div>
    );
}
