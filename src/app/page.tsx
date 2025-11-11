import RestaurantCard, { type Restaurant } from "@/components/RestaurantCard";
import { getBaseUrl } from "@/lib/baseUrl";

async function getRestaurants(): Promise<Restaurant[]> {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/restaurants`, {
        next: { revalidate: 60 },
    });
    const data = await res.json();
    return data.data || [];
}

export default async function Home() {
    const restaurants = await getRestaurants();
    return (
        <div className="w-full mx-auto max-w-6xl px-4 py-8">
            <section className="mb-8 rounded-2xl bg-indigo-600 px-6 py-10 text-white">
                <h1 className="text-3xl font-bold">Book your next meal</h1>
                <p className="mt-2 text-indigo-100">
                    Discover restaurants and reserve a table in seconds.
                </p>
            </section>
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Featured Restaurants
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {restaurants.map((r) => (
                        <RestaurantCard key={r.id} r={r} />
                    ))}
                    {restaurants.length === 0 && (
                        <div className="col-span-full rounded-lg border border-dashed p-6 text-center text-gray-600">
                            No restaurants yet.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
