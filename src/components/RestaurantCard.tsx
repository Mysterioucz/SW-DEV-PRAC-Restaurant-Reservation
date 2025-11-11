import Link from "next/link";

export type Restaurant = {
    id: string;
    name: string;
    address: string;
    telephone: string;
    openTime: string;
    closeTime: string;
};

export default function RestaurantCard({ r }: { r: Restaurant }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {r.name}
                    </h3>
                    <p className="text-sm text-gray-600">{r.address}</p>
                    <p className="text-sm text-gray-600">☎ {r.telephone}</p>
                    <p className="mt-1 text-xs text-gray-500">
                        Open {r.openTime} - {r.closeTime}
                    </p>
                </div>
                <Link
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    href={`/restaurants/${r.id}`}
                >
                    View
                </Link>
            </div>
        </div>
    );
}
