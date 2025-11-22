"use client";

import { useEffect, useState } from "react";

type Restaurant = {
    id: string;
    name: string;
    address: string;
    telephone: string;
    openTime: string;
    closeTime: string;
};

export default function AdminRestaurantsPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        address: "",
        telephone: "",
        openTime: "",
        closeTime: "",
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Restaurant | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/restaurants");
            const data = await res.json();
            setRestaurants(data.data || []);
        } catch {
            setError("Failed to load restaurants");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const createRestaurant = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("/api/restaurants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Create failed");
            setForm({ name: "", address: "", telephone: "", openTime: "", closeTime: "" });
            await load();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Create failed";
            setError(message);
        }
    };

    const updateRestaurant = async (id: string, patch: Partial<Restaurant>) => {
        setError("");
        try {
            const res = await fetch(`/api/restaurants/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Update failed");
            await load();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Update failed";
            setError(message);
        }
    };

    const deleteRestaurant = async (id: string) => {
        setError("");
        try {
            const res = await fetch(`/api/restaurants/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Delete failed");
            await load();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Delete failed";
            setError(message);
        }
    };

    return (
        <div className="flex flex-col p-8 gap-6">
            <h1 className="text-2xl font-bold">Manage Restaurants</h1>
            <form onSubmit={createRestaurant} className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-5">
                <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                />
                <input
                    placeholder="Address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                />
                <input
                    placeholder="Telephone"
                    value={form.telephone}
                    onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                />
                <input
                    placeholder="Open (e.g. 09:00)"
                    value={form.openTime}
                    onChange={(e) => setForm({ ...form, openTime: e.target.value })}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                />
                <div className="flex items-center gap-2">
                    <input
                        placeholder="Close (e.g. 21:00)"
                        value={form.closeTime}
                        onChange={(e) => setForm({ ...form, closeTime: e.target.value })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        required
                    />
                    <button className="whitespace-nowrap rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700" type="submit">
                        Add
                    </button>
                </div>
            </form>
            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>
            )}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="space-y-3">
                    {restaurants.map((r) => (
                        <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                            {editingId === r.id && editForm ? (
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        await updateRestaurant(r.id, {
                                            name: editForm.name,
                                            address: editForm.address,
                                            telephone: editForm.telephone,
                                            openTime: editForm.openTime,
                                            closeTime: editForm.closeTime,
                                        });
                                        setEditingId(null);
                                        setEditForm(null);
                                    }}
                                    className="space-y-3"
                                >
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium text-gray-600">Name</label>
                                            <input
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium text-gray-600">Address</label>
                                            <input
                                                value={editForm.address}
                                                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium text-gray-600">Telephone</label>
                                            <input
                                                value={editForm.telephone}
                                                onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })}
                                                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium text-gray-600">Open Time</label>
                                            <input
                                                value={editForm.openTime}
                                                onChange={(e) => setEditForm({ ...editForm, openTime: e.target.value })}
                                                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                required
                                                placeholder="09:00"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium text-gray-600">Close Time</label>
                                            <input
                                                value={editForm.closeTime}
                                                onChange={(e) => setEditForm({ ...editForm, closeTime: e.target.value })}
                                                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                required
                                                placeholder="21:00"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditForm(null);
                                            }}
                                            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <div className="font-medium">{r.name}</div>
                                        <div className="text-sm text-gray-600">{r.address} • {r.telephone}</div>
                                        <div className="text-xs text-gray-500">{r.openTime} - {r.closeTime}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingId(r.id);
                                                setEditForm({ ...r });
                                            }}
                                            className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteRestaurant(r.id)}
                                            className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {restaurants.length === 0 && (
                        <div className="rounded-md border border-dashed p-6 text-center text-gray-600">No restaurants.</div>
                    )}
                </div>
            )}
        </div>
    );
}
