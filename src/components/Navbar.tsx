"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

function NavLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link
            href={href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
            }`}
        >
            {children}
        </Link>
    );
}

export default function Navbar() {
    const { data: session, status } = useSession();
    const isAuth = status === "authenticated";
    const isAdmin = session?.user?.role === "ADMIN";

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60">
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-lg font-semibold text-indigo-700"
                        >
                            ReserveIt
                        </Link>
                        <div className="hidden md:flex items-center gap-2">
                            <NavLink href="/">Home</NavLink>
                            <NavLink href="/restaurants">Restaurants</NavLink>
                            {isAuth && (
                                <NavLink href="/dashboard">Dashboard</NavLink>
                            )}
                            {isAdmin && (
                                <NavLink href="/admin/restaurants">
                                    Admin
                                </NavLink>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isAuth && (
                            <>
                                <Link
                                    href="/login"
                                    className="px-3 py-2 text-sm rounded-md font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-3 py-2 text-sm rounded-md font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                        {isAuth && (
                            <>
                                <span className="hidden sm:block text-sm text-gray-600 mr-2">
                                    Hi, {session?.user?.name}
                                </span>
                                <button
                                    onClick={() =>
                                        signOut({ callbackUrl: "/" })
                                    }
                                    className="px-3 py-2 text-sm rounded-md font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    Log out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
