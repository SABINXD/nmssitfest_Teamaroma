
'use client'
import React, { useEffect } from 'react'
import { useAppContext } from '../context/appContext'
import { useAuth } from '../context/storeUserId'
import Loading from '@/components/Loading'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLogo from '@/components/AppLogo'
import NotificationUI from '@/components/NotificationUI'

const page = () => {
    const { appName, setAppName } = useAppContext();
    const { user, openNotificationUI, setOpenNotificationUI } = useAuth();
    const [userDetails, setUserDetails] = useState(null);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        contact: "",
        birthYear: "",
        province: "",
        district: "",
        isActive: false,
    });


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const res = await fetch("/api/alterUserDetails", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, formData }),
            });

            const data = await res.json();

            if (data.success) {
                setUserDetails(data.detail); // update UI instantly
                setEditMode(false);
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = () => {
        // Reset to original data
        setFormData({
            email: userDetails.email,
            contact: userDetails.contact,
            birthYear: userDetails.birthYear,
            province: userDetails.province,
            district: userDetails.district,
        });
        setEditMode(false);
    };

    const logoutHandle = async () => {

        let resUser = confirm("Are you sure to LogOut");
        if (!resUser) {
            return;
        }


        const res = await fetch("/api/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });
        const data = await res.json();
        if (data.success) {
            alert("Logout successful!");
            window.location.href = "/login";
        } else {
            alert("Error: " + data.error);

        };
    }

    useEffect(() => {
        if (!user) return;

        async function fetchData() {
            try {
                const res = await fetch("/api/getUserData", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user }),
                });

                const data = await res.json();
                setUserDetails(data.detail);
                console.log(data.detail);
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, [user]); // dependencies array

    useEffect(() => {
        if (userDetails) {
            setFormData({
                email: userDetails.email ?? "",
                contact: userDetails.contact ?? "",
                birthYear: userDetails.birthYear ?? "",
                province: userDetails.province ?? "",
                district: userDetails.district ?? "",
                isActive: userDetails.isActive ?? false,
            });
        }
    }, [userDetails]);



    if (!userDetails) return <Loading />;

    if (openNotificationUI) {
        return < NotificationUI />
    }

    return (
        <div>
            <nav className="w-full bg-[#2a2a2a] text-white px-6 py-4 shadow-lg">
                {/* Top bar */}
                <div className="flex items-center justify-between">
                    {/* Left */}
                    <div className='flex items-center justify-left gap-2'>
                        <div>
                            <h1 className="text-xl font-bold">Dashboard Page</h1>
                            <p className="text-sm text-gray-300">{appName}</p>
                        </div>

                        {/* Icon */}
                        <AppLogo />
                    </div>

                    {/* Hamburger */}
                    <button
                        className="flex flex-col gap-1 cursor-pointer sm:hidden"
                        onClick={() => setOpen(!open)}
                    >
                        <span className="w-6 h-0.5 bg-white"></span>
                        <span className="w-6 h-0.5 bg-white"></span>
                        <span className="w-6 h-0.5 bg-white"></span>
                    </button>

                    <div className='flex justify-center items-center gap-2'>
                        <button onClick={() => { setOpenNotificationUI(true) }}
                            className="hidden border sm:flex hover:bg-white hover:text-red-400 border-white p-2 rounded-2xl flex-col gap-1 cursor-pointer"
                        >
                            <a>Notification</a>
                        </button>

                        <button onClick={() => {
                            router.push('/find_blood')

                        }}

                            className="hidden border sm:flex hover:bg-white hover:text-red-400 border-white p-2 rounded-2xl flex-col gap-1 cursor-pointer"
                        >
                            <a>Find Blood</a>
                        </button>

                        <button
                            onClick={logoutHandle}
                            className="hidden border sm:flex hover:bg-white hover:text-red-400 border-white p-2 rounded-2xl flex-col gap-1 cursor-pointer"
                        >
                            <a>Logout</a>
                        </button>
                    </div>
                </div>

                {open && (
                    <div onClick={() => { setOpenNotificationUI(true) }} className="sm:hidden mt-4 flex flex-col gap-4 items-center bg-gray-900 p-4 rounded-lg">
                        <a className="hover:text-red-400">Notification</a>
                    </div>
                )}
                {open && (
                    <div onClick={() => {
                        router.push('/find_blood')

                    }} className="sm:hidden mt-4 flex flex-col gap-4 items-center bg-gray-900 p-4 rounded-lg">
                        <a className="hover:text-red-400">Find Blood</a>
                    </div>
                )}
                {open && (
                    <div onClick={logoutHandle} className="sm:hidden mt-4 flex flex-col gap-4 items-center bg-gray-900 p-4 rounded-lg">
                        <a className="hover:text-red-400">Logout</a>
                    </div>
                )}
            </nav>

            <main className="p-6 space-y-6 bg-gray-50 min-h-screen">
                {/* Welcome Section */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-900 via-rose-900 to-red-800 p-6 shadow-2xl text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

                    {/* Glow accent */}
                    <div className="absolute -top-10 -right-10 h-40 w-40 bg-red-600/20 rounded-full blur-3xl"></div>

                    {/* User Info */}
                    <div className="relative">
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            Welcome, {userDetails.name}
                        </h1>

                        <div className="flex items-center gap-3 mt-2">
                            <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur text-sm font-semibold border border-white/20">
                                🩸 {userDetails.bloodgroup}
                            </span>
                            <span className="text-sm text-red-200">
                                Blood Type
                            </span>
                        </div>
                    </div>

                    {/* Donation Stats */}
                    <div className="relative text-center sm:text-right">
                        <p className="text-sm uppercase tracking-widest text-red-200">
                            Total Donations
                        </p>
                        <p className="text-4xl font-extrabold text-white mt-1">
                            {userDetails.donationCount}
                        </p>
                        <p className="text-xs text-red-300 mt-1">
                            Lives Impacted
                        </p>
                    </div>
                </div>


                {/* Profile Card */}
                <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                            My Profile
                        </h2>

                        {!editMode ? (
                            <button
                                onClick={() => setEditMode(true)}
                                className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition"
                            >
                                ✏️ Edit Info
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSave}
                                    className="px-5 py-2 rounded-full bg-gradient-to-r from-red-600 to-rose-700 text-white font-semibold shadow-md hover:from-red-700 hover:to-rose-800 transition"
                                >
                                    Save
                                </button>

                                <button
                                    onClick={handleCancel}
                                    className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 font-medium border border-gray-300 hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                        <div className="space-y-4">

                            {/* Email */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span className="sm:w-32 font-semibold text-gray-700">
                                    Email
                                </span>

                                {editMode ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition"
                                    />
                                ) : (
                                    <span className="text-gray-800 font-medium">
                                        {userDetails.email}
                                    </span>
                                )}
                            </div>

                            {/* Contact */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span className="sm:w-32 font-semibold text-gray-700">
                                    Contact
                                </span>

                                {editMode ? (
                                    <input
                                        type="text"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition"
                                    />
                                ) : (
                                    <span className="text-gray-800 font-medium">
                                        {userDetails.contact}
                                    </span>
                                )}
                            </div>

                            {/* Birth Year */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span className="sm:w-32 font-semibold text-gray-700">
                                    Birth Year
                                </span>

                                {editMode ? (
                                    <input
                                        type="number"
                                        name="birthYear"
                                        value={formData.birthYear}
                                        onChange={handleChange}
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition"
                                    />
                                ) : (
                                    <span className="text-gray-800 font-medium">
                                        {userDetails.birthYear}
                                    </span>
                                )}
                            </div>

                        </div>

                        <div className="space-y-5">

                            {/* Section Title */}
                            <h3 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
                                📍 Location & Status
                            </h3>

                            {/* Province */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span className="sm:w-32 font-semibold text-gray-700">
                                    Province
                                </span>

                                {editMode ? (
                                    <input
                                        type="text"
                                        name="province"
                                        value={formData.province}
                                        onChange={handleChange}
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition"
                                    />
                                ) : (
                                    <span className="text-gray-800 font-medium">
                                        {userDetails.province}
                                    </span>
                                )}
                            </div>

                            {/* District */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span className="sm:w-32 font-semibold text-gray-700">
                                    District
                                </span>

                                {editMode ? (
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition"
                                    />
                                ) : (
                                    <span className="text-gray-800 font-medium">
                                        {userDetails.district}
                                    </span>
                                )}
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center gap-4">
                                <span className="sm:w-32 font-semibold text-gray-700">
                                    Active Status
                                </span>

                                {editMode ? (
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!!formData.isActive}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    isActive: e.target.checked,
                                                })
                                            }
                                            className="h-5 w-5 accent-red-600"
                                        />
                                        <span className="text-gray-700 font-medium">
                                            Available for Donation
                                        </span>
                                    </label>
                                ) : (
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${userDetails.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {userDetails.isActive ? "Active" : "Inactive"}
                                    </span>
                                )}
                            </div>

                        </div>

                    </div>
                </div>

                {/* show donation history */}
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl p-6 space-y-5 border border-red-100">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                            🩸 Donation History
                        </h2>

                        <span className="px-4 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                            Lifesaver Stats
                        </span>
                    </div>

                    {/* Donation Count */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4">
                        <div>
                            <p className="text-sm uppercase tracking-wider text-gray-500">
                                Total Donations
                            </p>
                            <p className="text-4xl font-extrabold text-red-700">
                                {userDetails.donationCount}
                            </p>
                        </div>

                        <div className="text-5xl">
                            🫀
                        </div>
                    </div>

                    {/* Empty State */}
                    {userDetails.donationCount === 0 && (
                        <div className="mt-4 bg-gradient-to-br from-gray-50 to-white border border-dashed border-gray-300 rounded-xl p-6 text-center">
                            <p className="text-gray-600 font-medium">
                                No donation history yet
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                Start donating and become a lifesaver ❤️
                            </p>

                            <div className="mt-4 text-red-600 text-3xl">
                                🩸
                            </div>
                        </div>
                    )}

                </div>


            </main>


        </div>
    )
}

export default page
