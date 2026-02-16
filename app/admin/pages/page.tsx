"use client";

import { useEffect, useState } from "react";
import { FileText, Plus, Edit, Trash2, Eye, Loader2, Save } from "lucide-react";
import { getAllPages, createPage, updatePage, deletePage } from "../actions/frontend-actions";
import { toast } from "sonner";
import Link from "next/link";

interface Page {
    id: string;
    slug: string;
    title: string;
    meta_description: string | null;
    meta_keywords: string[] | null;
    content: any;
    is_published: boolean;
    is_homepage: boolean;
    created_at: string;
    updated_at: string;
}

export default function PageBuilderPage() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [editingPage, setEditingPage] = useState<Page | null>(null);

    useEffect(() => {
        loadPages();
    }, []);

    async function loadPages() {
        setLoading(true);
        const data = await getAllPages();
        setPages(data);
        setLoading(false);
    }

    async function handleDelete(slug: string) {
        if (!confirm("Are you sure you want to delete this page?")) return;

        const result = await deletePage(slug);
        if (result.success) {
            toast.success("Page deleted successfully");
            await loadPages();
        } else {
            toast.error("Failed to delete page");
        }
    }

    function handleEdit(page: Page) {
        setEditingPage(page);
        setShowEditor(true);
    }

    function handleNew() {
        setEditingPage({
            id: "",
            slug: "",
            title: "",
            meta_description: "",
            meta_keywords: [],
            content: {},
            is_published: false,
            is_homepage: false,
            created_at: "",
            updated_at: "",
        });
        setShowEditor(true);
    }

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
                <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px]">
                    Loading Pages...
                </p>
            </div>
        );
    }

    if (showEditor) {
        return (
            <PageEditor
                page={editingPage}
                onClose={() => {
                    setShowEditor(false);
                    setEditingPage(null);
                    loadPages();
                }}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif text-gold mb-1">Page Builder</h2>
                    <p className="text-zinc-500 text-sm tracking-widest uppercase">
                        Create and manage all pages
                    </p>
                </div>
                <button
                    onClick={handleNew}
                    className="px-6 py-3 bg-gold text-black font-medium uppercase tracking-wider text-sm hover:bg-gold/90 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Page
                </button>
            </div>

            {/* Pages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page) => (
                    <div
                        key={page.id}
                        className="bg-zinc-950 border border-gold/10 p-6 hover:border-gold/30 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <FileText className="w-6 h-6 text-gold" />
                            <div className="flex items-center gap-2">
                                {page.is_homepage && (
                                    <span className="px-2 py-0.5 bg-gold/10 text-gold text-[10px] uppercase tracking-wider border border-gold/30">
                                        Home
                                    </span>
                                )}
                                <span
                                    className={`px-2 py-0.5 text-[10px] uppercase tracking-wider border ${page.is_published
                                            ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/5"
                                            : "border-zinc-600 text-zinc-500 bg-zinc-900"
                                        }`}
                                >
                                    {page.is_published ? "Published" : "Draft"}
                                </span>
                            </div>
                        </div>

                        <h3 className="text-xl font-serif text-white mb-2">{page.title}</h3>
                        <p className="text-sm text-zinc-400 mb-1">/{page.slug}</p>
                        <p className="text-xs text-zinc-600 mb-4 line-clamp-2">
                            {page.meta_description || "No description"}
                        </p>

                        <div className="flex items-center gap-2 pt-4 border-t border-gold/10">
                            <Link
                                href={`/${page.slug}`}
                                target="_blank"
                                className="flex-1 px-3 py-2 bg-zinc-900 text-zinc-400 text-xs uppercase tracking-wider hover:text-white hover:bg-zinc-800 transition-all text-center"
                            >
                                <Eye className="w-3 h-3 inline mr-1" />
                                Preview
                            </Link>
                            <button
                                onClick={() => handleEdit(page)}
                                className="flex-1 px-3 py-2 bg-gold/10 text-gold text-xs uppercase tracking-wider hover:bg-gold/20 transition-all"
                            >
                                <Edit className="w-3 h-3 inline mr-1" />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(page.slug)}
                                className="px-3 py-2 bg-red-950/20 text-red-400 text-xs uppercase tracking-wider hover:bg-red-950/40 transition-all"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {pages.length === 0 && (
                <div className="text-center py-20">
                    <FileText className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500 text-sm uppercase tracking-wider">
                        No pages yet. Create your first page.
                    </p>
                </div>
            )}
        </div>
    );
}

// Page Editor Component
function PageEditor({
    page,
    onClose,
}: {
    page: Page | null;
    onClose: () => void;
}) {
    const [formData, setFormData] = useState<Page>(
        page || {
            id: "",
            slug: "",
            title: "",
            meta_description: "",
            meta_keywords: [],
            content: {},
            is_published: false,
            is_homepage: false,
            created_at: "",
            updated_at: "",
        }
    );
    const [saving, setSaving] = useState(false);
    const [contentCode, setContentCode] = useState(
        JSON.stringify(formData.content, null, 2)
    );

    async function handleSave() {
        setSaving(true);

        try {
            const contentData = JSON.parse(contentCode);
            const pageData = {
                ...formData,
                content: contentData,
            };

            let result;
            if (page?.id) {
                result = await updatePage(formData.slug, pageData);
            } else {
                result = await createPage(pageData);
            }

            if (result.success) {
                toast.success("Page saved successfully!", {
                    description: "Changes are now live on your site.",
                });
                onClose();
            } else {
                toast.error("Failed to save page", {
                    description: result.error,
                });
            }
        } catch (e: any) {
            toast.error("Invalid JSON in content", {
                description: e.message,
            });
        }

        setSaving(false);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif text-gold mb-1">
                        {page?.id ? "Edit Page" : "New Page"}
                    </h2>
                    <p className="text-zinc-500 text-sm tracking-widest uppercase">
                        Configure page settings and content
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-zinc-900 text-zinc-400 font-medium uppercase tracking-wider text-sm hover:text-white transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-gold text-black font-medium uppercase tracking-wider text-sm hover:bg-gold/90 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save & Publish
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="bg-zinc-950 border border-gold/10 p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-400">
                            Page Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            className="w-full bg-zinc-900 border border-gold/10 px-4 py-3 text-white focus:border-gold/30 focus:outline-none transition-colors"
                            placeholder="About Us"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-400">
                            URL Slug
                        </label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) =>
                                setFormData({ ...formData, slug: e.target.value })
                            }
                            className="w-full bg-zinc-900 border border-gold/10 px-4 py-3 text-white focus:border-gold/30 focus:outline-none transition-colors font-mono"
                            placeholder="about-us"
                        />
                    </div>
                </div>

                {/* Meta Description */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-zinc-400">
                        Meta Description
                    </label>
                    <textarea
                        value={formData.meta_description || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, meta_description: e.target.value })
                        }
                        className="w-full bg-zinc-900 border border-gold/10 px-4 py-3 text-white focus:border-gold/30 focus:outline-none transition-colors"
                        rows={3}
                        placeholder="Brief description for SEO..."
                    />
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.is_published}
                            onChange={(e) =>
                                setFormData({ ...formData, is_published: e.target.checked })
                            }
                            className="w-5 h-5 bg-zinc-900 border border-gold/30 checked:bg-gold checked:border-gold"
                        />
                        <span className="text-sm text-zinc-400 uppercase tracking-wider">
                            Published
                        </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.is_homepage}
                            onChange={(e) =>
                                setFormData({ ...formData, is_homepage: e.target.checked })
                            }
                            className="w-5 h-5 bg-zinc-900 border border-gold/30 checked:bg-gold checked:border-gold"
                        />
                        <span className="text-sm text-zinc-400 uppercase tracking-wider">
                            Set as Homepage
                        </span>
                    </label>
                </div>

                {/* Content Editor */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-zinc-400">
                        Page Content (JSON)
                    </label>
                    <textarea
                        value={contentCode}
                        onChange={(e) => setContentCode(e.target.value)}
                        className="w-full h-[400px] bg-zinc-900 border border-gold/10 px-4 py-3 text-white font-mono text-sm focus:border-gold/30 focus:outline-none transition-colors"
                        spellCheck={false}
                    />
                    <p className="text-xs text-zinc-600">
                        Define your page structure using JSON. Include sections, hero, text
                        blocks, etc.
                    </p>
                </div>
            </div>
        </div>
    );
}
