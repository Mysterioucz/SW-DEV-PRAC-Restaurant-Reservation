"use client";

import { useEffect, useState } from "react";

type Reservation = {
    id: string;
    date: string;
    restaurant: { id: string; name: string };
};

export default function DashboardPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [canceling, setCanceling] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/reservations");
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to load");
            setReservations(data.data || []);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to load";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const cancelReservation = async (id: string) => {
        setCanceling(id);
        setError("");
        try {
            const res = await fetch(`/api/reservations/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Cancel failed");
            await load();
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Cancel failed";
            setError(message);
        } finally {
            setCanceling(null);
        }
    };

    return (
        <div className="w-full mx-auto max-w-6xl space-y-6 px-4 py-8">
            <h1 className="text-2xl font-bold">My Reservations</h1>
            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                    {error}
                </div>
            )}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="space-y-3">
                    {reservations.map((r) => (
                        <div
                            key={r.id}
                            className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                        >
                            <div>
                                <div className="font-medium">
                                    {r.restaurant.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {new Date(r.date).toLocaleString()}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={`/dashboard/reservations/${r.id}`}
                                    className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                                >
                                    View
                                </a>
                                <button
                                    onClick={() => cancelReservation(r.id)}
                                    disabled={canceling === r.id}
                                    className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                    {canceling === r.id
                                        ? "Cancelling..."
                                        : "Cancel"}
                                </button>
                            </div>
                        </div>
                    ))}
                    {reservations.length === 0 && (
                        <div className="rounded-md border border-dashed p-6 text-center text-gray-600">
                            No reservations.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
