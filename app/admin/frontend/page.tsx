"use client";

import { useEffect, useState } from "react";
import { Settings, Save, Loader2, Eye, Code } from "lucide-react";
import {
    getAllFrontendContent,
    updateFrontendContent,
} from "../actions/frontend-actions";
import { toast } from "sonner";

interface FrontendContent {
    id: string;
    content_key: string;
    content_type: string;
    content_data: any;
    is_active: boolean;
}

export default function FrontendCustomizationPage() {
    const [content, setContent] = useState<FrontendContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedContent, setSelectedContent] = useState<FrontendContent | null>(null);
    const [editMode, setEditMode] = useState<"visual" | "code">("visual");

    useEffect(() => {
        loadContent();
    }, []);

    async function loadContent() {
        setLoading(true);
        const data = await getAllFrontendContent();
        setContent(data);
        if (data.length > 0) {
            setSelectedContent(data[0]);
        }
        setLoading(false);
    }

    async function handleSave() {
        if (!selectedContent) return;

        setSaving(true);
        const result = await updateFrontendContent(
            selectedContent.content_key,
            selectedContent.content_data
        );

        if (result.success) {
            toast.success("Changes saved and live!", {
                description: "Your changes are now visible to all visitors.",
            });
            await loadContent();
        } else {
            toast.error("Failed to save changes", {
                description: result.error,
            });
        }
        setSaving(false);
    }

    function updateContentData(path: string, value: any) {
        if (!selectedContent) return;

        const keys = path.split(".");
        const newData = JSON.parse(JSON.stringify(selectedContent.content_data));
        let current = newData;

        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;

        setSelectedContent({
            ...selectedContent,
            content_data: newData,
        });
    }

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
                <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px]">
                    Loading Customization Panel...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif text-gold mb-1">
                        Frontend Customization
                    </h2>
                    <p className="text-zinc-500 text-sm tracking-widest uppercase">
                        Master control over your entire storefront
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || !selectedContent}
                    className="px-6 py-3 bg-gold text-black font-medium uppercase tracking-wider text-sm hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

            <div className="grid grid-cols-12 gap-6">
                {/* Sidebar - Content Selector */}
                <div className="col-span-3 space-y-2">
                    <div className="bg-zinc-950 border border-gold/10 p-4">
                        <h3 className="text-sm font-medium text-gold uppercase tracking-wider mb-4">
                            Content Sections
                        </h3>
                        <div className="space-y-1">
                            {content.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedContent(item)}
                                    className={`w-full text-left px-3 py-2 text-sm transition-all ${selectedContent?.id === item.id
                                            ? "bg-gold/10 text-gold border-l-2 border-gold"
                                            : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                        }`}
                                >
                                    <div className="font-medium">{item.content_key}</div>
                                    <div className="text-[10px] uppercase tracking-wider opacity-60">
                                        {item.content_type}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Editor */}
                <div className="col-span-9">
                    <div className="bg-zinc-950 border border-gold/10 p-6">
                        {/* Editor Toolbar */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gold/10">
                            <h3 className="text-xl font-serif text-white">
                                {selectedContent?.content_key}
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditMode("visual")}
                                    className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-all ${editMode === "visual"
                                            ? "bg-gold text-black"
                                            : "bg-zinc-900 text-zinc-400 hover:text-white"
                                        }`}
                                >
                                    <Eye className="w-3 h-3 inline mr-1" />
                                    Visual
                                </button>
                                <button
                                    onClick={() => setEditMode("code")}
                                    className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-all ${editMode === "code"
                                            ? "bg-gold text-black"
                                            : "bg-zinc-900 text-zinc-400 hover:text-white"
                                        }`}
                                >
                                    <Code className="w-3 h-3 inline mr-1" />
                                    Code
                                </button>
                            </div>
                        </div>

                        {/* Editor Content */}
                        {editMode === "visual" ? (
                            <VisualEditor
                                content={selectedContent}
                                onUpdate={updateContentData}
                            />
                        ) : (
                            <CodeEditor
                                content={selectedContent}
                                onChange={(newData) =>
                                    setSelectedContent({
                                        ...selectedContent!,
                                        content_data: newData,
                                    })
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Visual Editor Component
function VisualEditor({
    content,
    onUpdate,
}: {
    content: FrontendContent | null;
    onUpdate: (path: string, value: any) => void;
}) {
    if (!content) return null;

    const renderField = (key: string, value: any, path: string = "") => {
        const fullPath = path ? `${path}.${key}` : key;

        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            return (
                <div key={fullPath} className="space-y-3 pl-4 border-l border-gold/10">
                    <h4 className="text-sm font-medium text-gold uppercase tracking-wider">
                        {key}
                    </h4>
                    {Object.entries(value).map(([k, v]) => renderField(k, v, fullPath))}
                </div>
            );
        }

        if (Array.isArray(value)) {
            return (
                <div key={fullPath} className="space-y-2">
                    <h4 className="text-sm font-medium text-gold uppercase tracking-wider">
                        {key}
                    </h4>
                    {value.map((item, index) => (
                        <div
                            key={index}
                            className="bg-zinc-900 p-3 border border-gold/5 space-y-2"
                        >
                            {typeof item === "object"
                                ? Object.entries(item).map(([k, v]) =>
                                    renderField(k, v, `${fullPath}.${index}`)
                                )
                                : renderField(index.toString(), item, fullPath)}
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div key={fullPath} className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-zinc-400">
                    {key}
                </label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onUpdate(fullPath, e.target.value)}
                    className="w-full bg-zinc-900 border border-gold/10 px-3 py-2 text-sm text-white focus:border-gold/30 focus:outline-none transition-colors"
                />
            </div>
        );
    };

    return (
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
            {Object.entries(content.content_data).map(([key, value]) =>
                renderField(key, value)
            )}
        </div>
    );
}

// Code Editor Component
function CodeEditor({
    content,
    onChange,
}: {
    content: FrontendContent | null;
    onChange: (data: any) => void;
}) {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (content) {
            setCode(JSON.stringify(content.content_data, null, 2));
        }
    }, [content]);

    function handleCodeChange(newCode: string) {
        setCode(newCode);
        try {
            const parsed = JSON.parse(newCode);
            onChange(parsed);
            setError("");
        } catch (e: any) {
            setError(e.message);
        }
    }

    return (
        <div className="space-y-3">
            <textarea
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full h-[500px] bg-zinc-900 border border-gold/10 px-4 py-3 text-sm text-white font-mono focus:border-gold/30 focus:outline-none transition-colors"
                spellCheck={false}
            />
            {error && (
                <div className="bg-red-950/20 border border-red-500/30 px-4 py-2 text-sm text-red-400">
                    <strong>JSON Error:</strong> {error}
                </div>
            )}
        </div>
    );
}
