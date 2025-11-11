"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        telephone: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    telephone: formData.telephone,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
            } else {
                router.push("/login?registered=true");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Create Account
                    </h1>
                    <p className="mt-2 text-gray-600">Join us today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.telephone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    telephone: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    confirmPassword: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-indigo-600 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
