import ReservationForm from "@/components/ReservationForm";
import { authOptions } from "@/lib/auth";
import { getBaseUrl } from "@/lib/baseUrl";
import { getServerSession } from "next-auth";
import Link from "next/link";

type RestaurantDetail = {
    id: string;
    name: string;
    address: string;
    telephone: string;
    openTime: string;
    closeTime: string;
    reservations: {
        id: string;
        date: string;
        user?: { name: string; email: string; telephone: string };
    }[];
};

async function getRestaurant(id: string): Promise<RestaurantDetail | null> {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/restaurants/${id}`, {
        cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
}

// NOTE: In this Next.js version, dynamic route params arrive as a Promise; we must await it.
export default async function RestaurantDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";
    const restaurant = await getRestaurant(id);
    if (!restaurant) {
        return (
            <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 text-center">
                <h1 className="text-xl font-semibold">Restaurant not found</h1>
                <p className="text-gray-600">
                    The restaurant may have been removed or the link is
                    incorrect.
                </p>
                <div className="flex items-center justify-center gap-2">
                    <Link
                        href="/restaurants"
                        className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        Back to Restaurants
                    </Link>
                    <Link
                        href="/"
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto max-w-6xl space-y-8 px-4 py-8">
            <header className="space-y-1">
                <h1 className="text-3xl font-bold text-gray-900">
                    {restaurant.name}
                </h1>
                <p className="text-gray-600">{restaurant.address}</p>
                <p className="text-sm text-gray-500">
                    ☎ {restaurant.telephone}
                </p>
                <p className="text-sm text-gray-500">
                    Open {restaurant.openTime} – {restaurant.closeTime}
                </p>
            </header>
            <ReservationForm
                restaurantId={restaurant.id}
                openTime={restaurant.openTime}
                closeTime={restaurant.closeTime}
            />
            {isAdmin && (
                <section>
                    <h2 className="mb-2 text-lg font-semibold">
                        Upcoming Reservations
                    </h2>
                    <div className="space-y-2">
                        {restaurant.reservations.length === 0 && (
                            <p className="text-sm text-gray-600">
                                No reservations yet.
                            </p>
                        )}
                        {restaurant.reservations.map((r) => (
                            <div
                                key={r.id}
                                className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                            >
                                <span>{new Date(r.date).toLocaleString()}</span>
                                {r.user && (
                                    <span className="text-gray-500">
                                        {r.user.name} ({r.user.email})
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

// Client component for reservation form
// We keep this in the same file; Next can't mix client/server in one file without a separate boundary.
// So we move the client component to a separate file to satisfy the directive.
// (Simpler: inline but mark component as client via a separate file.)
// For now, leave here but add the directive at the top of the file for entire file.
// NOTE: To avoid lint error we will extract the client component to a new file.

// NOTE: ReservationForm was here; moved to a dedicated client component file for proper Next.js separation.
