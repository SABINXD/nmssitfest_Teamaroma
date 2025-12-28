
"use client";

import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function AdminPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch("/api/me");
                const data = await res.json();

                if (res.ok && data.user) {
                    setUser(data.user);

                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    if (loading) return <Loading />;

    if (!user) {
        return <p className="text-red-600 text-center mt-10">You are not logged in.</p>;
    }
    if (user.isAdmin === "false") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-rose-900 px-4">
                <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 max-w-md text-center border border-red-500">
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-6xl text-red-600 animate-pulse">⚠️</div>
                        <h2 className="text-2xl font-extrabold text-red-700">Access Denied</h2>
                        <p className="text-gray-700">
                            You are not authorized to access this page. Only admins can view this section.
                        </p>
                        <a
                            href="/"
                            className="mt-4 inline-block px-6 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition"
                        >
                            Go Back Home
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const donors = [
        { name: "Aarav Sharma", blood: "O+", bloodClass: "bg-green-700", location: "Kathmandu", age: 33, donations: 12, status: "active" },
        { name: "Priya Thapa", blood: "A+", bloodClass: "bg-blue-700", location: "Pokhara", age: 37, donations: 8, status: "active" },
        { name: "Bijay Gurung", blood: "B+", bloodClass: "bg-orange-600", location: "Rupandehi", age: 30, donations: 5, status: "inactive" },
        { name: "Sita Rai", blood: "AB-", bloodClass: "bg-purple-700", location: "Jhapa", age: 35, donations: 3, status: "active" },
        { name: "Ashwin Nigam", blood: "O+", bloodClass: "bg-green-700", location: "Chitwan", age: 25, donations: 12, status: "active" },
    ];

    const bloodDistribution = [
        { type: "O+", donors: 35, percent: 70 },
        { type: "A+", donors: 28, percent: 56 },
        { type: "B+", donors: 22, percent: 44 },
        { type: "AB+", donors: 12, percent: 24 },
        { type: "O-", donors: 25, percent: 50 },
        { type: "A-", donors: 18, percent: 36 },
        { type: "B-", donors: 15, percent: 30 },
        { type: "AB-", donors: 9, percent: 18 },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-60 bg-white p-6 shadow-md hidden lg:block">
                <h1 className="text-2xl font-bold text-red-700 mb-6">BloodFlow</h1>
                <nav className="flex flex-col gap-3">
                    <a className="flex items-center gap-2 px-3 py-2 rounded bg-red-700 text-white font-semibold">
                        <i className="fa fa-chart-line"></i> Dashboard
                    </a>
                    <a className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-100">
                        <i className="fa fa-users"></i> Donors
                    </a>
                    <a className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-100">
                        <i className="fa fa-hospital"></i> Requests
                    </a>
                    <a className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-100">
                        <i className="fa fa-gear"></i> Settings
                    </a>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Welcome Back, Admin</h1>
                <p className="text-lg mb-8">Here's what's happening with your blood network today.</p>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-red-700 text-white p-6 rounded shadow">
                        <h3 className="text-lg font-semibold">Total Donors</h3>
                        <h2 className="text-3xl font-bold mt-2">8</h2>
                        <p className="mt-1">Registered</p>
                    </div>
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-lg font-semibold">Total Donations</h3>
                        <h2 className="text-3xl font-bold mt-2">61</h2>
                        <p className="mt-1">+8% this month</p>
                    </div>
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-lg font-semibold">Average Donations</h3>
                        <h2 className="text-3xl font-bold mt-2">7.6</h2>
                        <p className="mt-1">Per donor</p>
                    </div>
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-lg font-semibold">Active Donors</h3>
                        <h2 className="text-3xl font-bold mt-2">7</h2>
                        <p className="mt-1">Currently active</p>
                    </div>
                </div>

                {/* Blood Distribution & Donors Table */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Blood Distribution */}
                    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl md:text-2xl font-bold text-red-700 mb-6 drop-shadow-md">
                            Blood Type Distribution
                        </h3>

                        {bloodDistribution.map((b) => (
                            <div className="mb-4" key={b.type}>
                                <div className="flex justify-between text-sm md:text-base font-medium mb-2 text-gray-700">
                                    <span className="text-gray-800">{b.type}</span>
                                    <span className="text-red-600 font-semibold">{b.donors} donors</span>
                                </div>
                                <div className="w-full bg-red-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-3 rounded-full bg-gradient-to-r from-red-600 to-rose-600 transition-all duration-500"
                                        style={{ width: `${b.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* Donors Table */}
                    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg overflow-x-auto">
                        <h3 className="text-xl md:text-2xl font-bold text-red-700 mb-6 drop-shadow-md">
                            Registered Donors
                        </h3>

                        <table className="min-w-full text-left border-collapse">
                            <thead className="bg-red-100 text-red-800">
                                <tr>
                                    <th className="px-4 py-3 text-sm md:text-base font-semibold">Name</th>
                                    <th className="px-4 py-3 text-sm md:text-base font-semibold">Blood</th>
                                    <th className="px-4 py-3 text-sm md:text-base font-semibold">Location</th>
                                    <th className="px-4 py-3 text-sm md:text-base font-semibold">Age</th>
                                    <th className="px-4 py-3 text-sm md:text-base font-semibold">Donations</th>
                                    <th className="px-4 py-3 text-sm md:text-base font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donors.map((donor) => (
                                    <tr key={donor.name} className="hover:bg-red-50 transition-colors">
                                        <td className="text-gray-800 font-medium">{donor.name}</td>

                                        {/* Blood type with smaller padding */}
                                        <td className={`px-2 py-1 text-white font-bold text-center text-sm rounded-full ${donor.bloodClass}`}>
                                            {donor.blood}
                                        </td>

                                        <td className="px-4 py-2 text-gray-700">{donor.location}</td>
                                        <td className="px-4 py-2 text-gray-700">{donor.age}</td>
                                        <td className="px-4 py-2 text-gray-700 font-semibold">{donor.donations}</td>
                                        <td className={`px-2 py-1 text-white font-bold text-center text-sm rounded-full ${donor.status === "active" ? "bg-green-600" : "bg-red-600"}`}>
                                            {donor.status.charAt(0).toUpperCase() + donor.status.slice(1)}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>

                </div>
            </main>
        </div>
    );
}
