
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
            <nav className="w-full bg-black text-white px-6 py-4 shadow-lg">
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
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Welcome, {userDetails.name}</h1>
                        <p className="mt-1 text-red-600 font-semibold">{userDetails.bloodgroup}</p>
                    </div>
                    <div className="text-gray-600 font-medium">
                        Total Donations: <span className="text-blue-600">{userDetails.donationCount}</span>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
                        {!editMode ? (
                            <button
                                onClick={() => setEditMode(true)}
                                className="text-blue-600 hover:underline font-medium cursor-pointer"
                            >
                                Edit Info
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                        <div>
                            <p>
                                <span className="font-semibold">Email:</span>{" "}
                                {editMode ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="border rounded p-1 w-full"
                                    />
                                ) : (
                                    userDetails.email
                                )}
                            </p>
                            <p>
                                <span className="font-semibold">Contact:</span>{" "}
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        className="border rounded p-1 w-full"
                                    />
                                ) : (
                                    userDetails.contact
                                )}
                            </p>
                            <p>
                                <span className="font-semibold">Birth Year:</span>{" "}
                                {editMode ? (
                                    <input
                                        type="number"
                                        name="birthYear"
                                        value={formData.birthYear}
                                        onChange={handleChange}
                                        className="border rounded p-1 w-full"
                                    />
                                ) : (
                                    userDetails.birthYear
                                )}
                            </p>
                        </div>

                        <div>
                            <p>
                                <span className="font-semibold">Location:</span>
                            </p>
                            <p>
                                Province:{" "}
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="province"
                                        value={formData.province}
                                        onChange={handleChange}
                                        className="border rounded p-1 w-full"
                                    />
                                ) : (
                                    userDetails.province
                                )}
                            </p>
                            <p>
                                District:{" "}
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="border rounded p-1 w-full"
                                    />
                                ) : (
                                    userDetails.district
                                )}
                            </p>
                            <p>
                                Is Active:{" "}
                                {editMode ? (
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={!!formData.isActive}  // force boolean
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                isActive: e.target.checked,
                                            })
                                        }
                                    />

                                ) : (
                                    userDetails.isActive ? "Yes" : "No"
                                )}
                            </p>

                        </div>
                    </div>
                </div>

                {/* show donation history */}
                <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        🩸 Donation History
                    </h2>

                    <div className="text-gray-700">
                        <p className="text-lg">
                            Total Donations:{" "}
                            <span className="font-semibold text-blue-600">
                                {userDetails.donationCount}
                            </span>
                        </p>
                    </div>

                    {userDetails.donationCount === 0 && (
                        <div className="mt-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <p className="text-gray-500">
                                No donation history available right now.
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                Start donating to make a difference ❤️
                            </p>
                        </div>
                    )}
                </div>

            </main>


        </div>
    )
}

export default page
