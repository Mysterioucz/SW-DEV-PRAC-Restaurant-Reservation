import { getBaseUrl } from "@/lib/baseUrl";
import { headers } from "next/headers";

type ReservationDetail = {
    id: string;
    date: string;
    restaurant: { id: string; name: string };
    user?: { name: string; email: string; telephone: string };
};

async function getReservation(id: string): Promise<ReservationDetail | null> {
    const base = getBaseUrl();
    const reqHeaders = await headers();
    const cookieHeader: string | undefined = reqHeaders.get("cookie") ?? undefined;
    const res = await fetch(`${base}/api/reservations/${id}`, {
        cache: "no-store",
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
}

export default async function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const reservation = await getReservation(id);
    if (!reservation) {
        return (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                Reservation not found or you don&apos;t have access.
            </div>
        );
    }
    return (
        <div className="w-full mx-auto max-w-6xl space-y-6 px-4 py-8">
            <h1 className="text-2xl font-bold">Reservation Details</h1>
            <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-5">
                <div>
                    <div className="text-sm text-gray-500">Restaurant</div>
                    <div className="font-medium">{reservation.restaurant.name}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-medium">{new Date(reservation.date).toLocaleString()}</div>
                </div>
                {reservation.user && (
                    <div>
                        <div className="text-sm text-gray-500">User</div>
                        <div className="font-medium">
                            {reservation.user.name} ({reservation.user.email})
                        </div>
                        <div className="text-sm text-gray-600">{reservation.user.telephone}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
