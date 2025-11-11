import RestaurantCard, { type Restaurant } from "@/components/RestaurantCard";
import { getBaseUrl } from "@/lib/baseUrl";

async function getRestaurants(query?: string): Promise<Restaurant[]> {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/restaurants`, {
        next: { revalidate: 60 },
    });
    const data = await res.json();
    let list: Restaurant[] = data.data || [];
    if (query) {
        list = list.filter(
            (r) =>
                r.name.toLowerCase().includes(query.toLowerCase()) ||
                r.address.toLowerCase().includes(query.toLowerCase()),
        );
    }
    return list;
}

// In this Next version, searchParams may be a Promise
export default async function RestaurantsPage({
    searchParams,
}: {
    searchParams?: Promise<{ q?: string }>;
}) {
    const q = (await searchParams)?.q;
    const restaurants = await getRestaurants(q);
    return (
        <div className="w-full mx-auto max-w-6xl space-y-6 px-4 py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    All Restaurants
                </h1>
            </div>
            <form action="/restaurants" className="flex gap-2">
                <input
                    name="q"
                    defaultValue={q || ""}
                    placeholder="Search by name or address"
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                    type="submit"
                >
                    Search
                </button>
            </form>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {restaurants.map((r) => (
                    <RestaurantCard key={r.id} r={r} />
                ))}
                {restaurants.length === 0 && (
                    <div className="col-span-full rounded-lg border border-dashed p-6 text-center text-gray-600">
                        No results.
                    </div>
                )}
            </div>
        </div>
    );
}
