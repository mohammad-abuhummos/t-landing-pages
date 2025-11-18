"use client";

import React from "react";
import { useEffect, useMemo, useState } from "react";

const PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "lead!123";

export default function DashboardPage() {
    const [entered, setEntered] = useState("");
    const [authed, setAuthed] = useState(false);

    const [partners, setPartners] = useState<Array<{ name: string; url?: string }>>([]);
    const [newPartnerName, setNewPartnerName] = useState("");
    const [newPartnerUrl, setNewPartnerUrl] = useState("");
    const [bulkPartners, setBulkPartners] = useState("");
    const [savingPartners, setSavingPartners] = useState(false);

    const [srcMap, setSrcMap] = useState<any>({});
    const [srcMapRaw, setSrcMapRaw] = useState("");
    const [savingSrc, setSavingSrc] = useState(false);

    // Heroes (hero image urls per new-vertical)
    const [heroes, setHeroes] = useState<Record<string, string>>({});
    const [savingHeroes, setSavingHeroes] = useState(false);

    // Images state
    const [images, setImages] = useState<Array<{ name: string; url: string }>>([]);
    const [uploading, setUploading] = useState(false);
    const refreshImages = () => {
        fetch("/api/admin/images").then((r) => r.json()).then(setImages).catch(() => setImages([]));
    };

    const headers = useMemo(() => ({ "x-admin-password": PASSWORD }), []);

    const login = () => {
        const ok = entered === PASSWORD;
        setAuthed(ok);
        if (ok) {
            try { localStorage.setItem("adminAuthed", "1"); } catch {}
        }
    };

    const logout = () => {
        try { localStorage.removeItem("adminAuthed"); } catch {}
        setAuthed(false);
        setEntered("");
    };

    useEffect(() => {
        try {
            if (localStorage.getItem("adminAuthed") === "1") {
                setAuthed(true);
            }
        } catch {}
        if (!authed) return;
        fetch("/api/admin/partners", { headers })
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const mapped = data.map((p: any) => (typeof p === "string" ? { name: p, url: "" } : { name: p?.name || "", url: p?.url || "" })).filter((x: any) => x.name);
                    setPartners(mapped);
                } else {
                    setPartners([]);
                }
            })
            .catch(() => setPartners([]));
        fetch("/api/admin/srcmap")
            .then((r) => r.json())
            .then((data) => {
                setSrcMap(data);
                setSrcMapRaw(JSON.stringify(data, null, 2));
            })
            .catch(() => {
                setSrcMap({});
                setSrcMapRaw("{}");
            });
        fetch("/api/admin/heroes")
            .then((r) => r.json())
            .then((data) => setHeroes(data || {}))
            .catch(() => setHeroes({}));
        refreshImages();
    }, [authed, headers]);

    const addPartner = () => {
        const name = newPartnerName.trim();
        const url = newPartnerUrl.trim();
        if (!name) return;
        setPartners((p) => {
            const exists = p.some((x) => x.name.toLowerCase() === name.toLowerCase());
            if (exists) return p.map((x) => (x.name.toLowerCase() === name.toLowerCase() ? { name, url } : x));
            return [...p, { name, url }];
        });
        setNewPartnerName("");
        setNewPartnerUrl("");
    };

    const addBulkPartners = () => {
        const raw = bulkPartners;
        const names = raw.split(",").map((s) => s.trim()).filter(Boolean);
        if (names.length === 0) return;
        setPartners((prev) => {
            const byName = new Map(prev.map((x) => [x.name.toLowerCase(), x]));
            for (const n of names) {
                const key = n.toLowerCase();
                if (!byName.has(key)) {
                    byName.set(key, { name: n, url: "" });
                }
            }
            return Array.from(byName.values());
        });
        setBulkPartners("");
    };

    const removePartner = (name: string) => {
        setPartners((p) => p.filter((x) => x.name !== name));
    };

    const savePartners = async () => {
        setSavingPartners(true);
        try {
            await fetch("/api/admin/partners", {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...headers },
                body: JSON.stringify(partners),
            });
        } finally {
            setSavingPartners(false);
        }
    };

    const saveSrcMap = async () => {
        setSavingSrc(true);
        try {
            const parsed = JSON.parse(srcMapRaw);
            setSrcMap(parsed);
            await fetch("/api/admin/srcmap", {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...headers },
                body: JSON.stringify(parsed),
            });
        } catch (e) {
            alert("Invalid JSON");
        } finally {
            setSavingSrc(false);
        }
    };

    const saveHeroes = async () => {
        setSavingHeroes(true);
        try {
            await fetch("/api/admin/heroes", { method: "PUT", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(heroes) });
        } finally {
            setSavingHeroes(false);
        }
    };

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const form = new FormData();
            form.append("file", file);
            // Optionally specify a subdir for organization
            form.append("dir", "heroes");
            await fetch("/api/admin/images", { method: "POST", headers, body: form });
            refreshImages();
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const removeImage = async (name: string) => {
        await fetch("/api/admin/images", { method: "DELETE", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify({ name }) });
        refreshImages();
    };

    const renameImage = async (oldName: string) => {
        const newName = prompt("New name (with extension)", oldName) || "";
        if (!newName || newName === oldName) return;
        await fetch("/api/admin/images", { method: "PUT", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify({ oldName, newName }) });
        refreshImages();
    };

    if (!authed) {
        return (
            <div className="min-h-screen pt-24 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="container mx-auto px-4 max-w-md">
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Login</h1>
                        <input
                            type="password"
                            value={entered}
                            onChange={(e) => setEntered(e.target.value)}
                            placeholder="Enter password"
                            className="w-full border rounded-xl px-4 py-3 mb-4"
                        />
                        <button onClick={login} className="w-full rounded-xl bg-blue-600 text-white font-semibold py-3">Login</button>
                        <p className="mt-2 text-xs text-gray-500">Hint provided by client.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-2">
                <div className="lg:col-span-2 flex justify-end">
                    <button onClick={logout} className="px-3 py-2 rounded-xl bg-gray-200 text-gray-700 text-sm">Logout</button>
                </div>
                {/* Partners */}
                <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Partners</h2>
                    <div className="flex flex-col gap-2 mb-4 md:flex-row">
                        <input
                            value={newPartnerName}
                            onChange={(e) => setNewPartnerName(e.target.value)}
                            placeholder="Partner name"
                            className="flex-1 border rounded-xl px-3 py-2"
                        />
                        <input
                            value={newPartnerUrl}
                            onChange={(e) => setNewPartnerUrl(e.target.value)}
                            placeholder="https://partner.example.com"
                            className="flex-1 border rounded-xl px-3 py-2"
                        />
                        <button onClick={addPartner} className="px-4 py-2 rounded-xl bg-blue-600 text-white">Add / Update</button>
                    </div>
                    <div className="flex flex-col gap-2 mb-4">
                        <textarea
                            value={bulkPartners}
                            onChange={(e) => setBulkPartners(e.target.value)}
                            placeholder="Bulk add: name1, name2, name3"
                            className="w-full border rounded-xl p-3 font-mono text-sm"
                            rows={3}
                        />
                        <div className="flex justify-end">
                            <button onClick={addBulkPartners} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Add Bulk</button>
                        </div>
                    </div>
                    <ul className="max-h-96 overflow-auto divide-y">
                        {partners.map((p) => (
                            <li key={p.name} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-center py-2">
                                <input
                                    className="border rounded px-2 py-1 text-sm"
                                    value={p.name}
                                    onChange={(e) => setPartners((arr) => arr.map((x) => (x.name === p.name ? { ...x, name: e.target.value } : x)))}
                                />
                                <input
                                    className="border rounded px-2 py-1 text-sm"
                                    value={p.url || ""}
                                    placeholder="https://..."
                                    onChange={(e) => setPartners((arr) => arr.map((x) => (x.name === p.name ? { ...x, url: e.target.value } : x)))}
                                />
                                <div className="flex justify-end">
                                    <button onClick={() => removePartner(p.name)} className="text-red-600 text-sm px-2 py-1">Remove</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 text-right">
                        <button onClick={savePartners} className="px-4 py-2 rounded-xl bg-green-600 text-white" disabled={savingPartners}>{savingPartners ? "Saving..." : "Save"}</button>
                    </div>
                </section>

                {/* Src Map */}
                <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Source Map (srcMap.json)</h2>
                    <textarea
                        value={srcMapRaw}
                        onChange={(e) => setSrcMapRaw(e.target.value)}
                        className="w-full h-96 border rounded-xl p-3 font-mono text-sm"
                    />
                    <div className="mt-4 text-right">
                        <button onClick={saveSrcMap} className="px-4 py-2 rounded-xl bg-green-600 text-white" disabled={savingSrc}>{savingSrc ? "Saving..." : "Save"}</button>
                    </div>
                </section>

                {/* Images */}
                <section className="bg-white rounded-2xl shadow p-6 border border-gray-100 lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Images</h2>
                        <label className="inline-flex items-center gap-3 cursor-pointer text-sm">
                            <span className="px-3 py-2 rounded-xl bg-blue-600 text-white">{uploading ? "Uploading..." : "Upload"}</span>
                            <input type="file" className="hidden" accept="image/*" onChange={onUpload} disabled={uploading} />
                        </label>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {images.map((img) => (
                            <div key={img.name} className="border rounded-xl p-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img.url} alt={img.name} className="w-full h-28 object-cover rounded" />
                                <div className="mt-2 text-xs break-all">{img.name}</div>
                                <div className="mt-2 flex justify-between text-xs">
                                    <button className="text-blue-600" onClick={() => navigator.clipboard.writeText(img.url)}>Copy URL</button>
                                    <button className="text-amber-600" onClick={() => renameImage(img.name)}>Rename</button>
                                    <button className="text-red-600" onClick={() => removeImage(img.name)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Hero bindings */}
                <section className="bg-white rounded-2xl shadow p-6 border border-gray-100 lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Hero Images per Page</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(["new-bathroom", "new-windows", "new-roofing", "new-flooring"]).map((key) => (
                            <div key={key} className="border rounded-xl p-3">
                                <div className="text-sm font-semibold mb-2">{key}</div>
                                <input
                                    value={heroes[key] || ""}
                                    onChange={(e) => setHeroes((h) => ({ ...h, [key]: e.target.value }))}
                                    placeholder="/uploads/hero.jpg or /assets/..."
                                    className="w-full border rounded px-2 py-2 text-sm"
                                />
                                <div className="mt-2 text-xs text-gray-500">Tip: paste an URL from the Images section above.</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-right">
                        <button onClick={saveHeroes} disabled={savingHeroes} className="px-4 py-2 rounded-xl bg-green-600 text-white">{savingHeroes ? "Saving..." : "Save"}</button>
                    </div>
                </section>
            </div>
        </div>
    );
}


