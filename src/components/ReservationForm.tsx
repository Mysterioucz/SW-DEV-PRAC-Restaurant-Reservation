"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ReservationForm({ restaurantId, openTime, closeTime }: { restaurantId: string; openTime: string; closeTime: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isPending, startTransition] = useTransition();

    const parseTime = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        if (Number.isNaN(h) || Number.isNaN(m)) return null;
        return h * 60 + m;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!date) {
            setError("Please select a date/time");
            return;
        }
        // Client-side hours validation (extra safety; server enforces too)
        const d = new Date(date);
        if (isNaN(d.getTime())) {
            setError("Invalid date/time format");
            return;
        }
        const minutes = d.getHours() * 60 + d.getMinutes();
        const openMinutes = parseTime(openTime);
        const closeMinutes = parseTime(closeTime);
        if (openMinutes === null || closeMinutes === null) {
            setError("Restaurant hours misconfigured");
            return;
        }
        const within = openMinutes <= minutes && minutes < closeMinutes;
        if (!within) {
            setError(`Outside operating hours (${openTime} - ${closeTime})`);
            return;
        }
        try {
            const res = await fetch(`/api/reservations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date, restaurantId }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to reserve");
            } else {
                setSuccess("Reservation created!");
                startTransition(() => {
                    router.refresh();
                });
            }
        } catch {
            setError("Network error");
        }
    };

    if (!session) {
        return (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                Log in to make a reservation.
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border border-gray-200 bg-white p-5"
        >
            <h2 className="text-lg font-semibold">Make a Reservation</h2>
            <p className="text-xs text-gray-500">Operating hours: {openTime} - {closeTime}</p>
            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                    {error}
                </div>
            )}
            {success && (
                <div className="rounded-md border border-green-200 bg-green-50 p-2 text-sm text-green-700">
                    {success}
                </div>
            )}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Date & Time</label>
                <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
            </div>
            <button
                disabled={isPending}
                type="submit"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
                {isPending ? "Reserving..." : "Reserve"}
            </button>
        </form>
    );
}
