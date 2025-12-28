
"use client"
import React from 'react';
import { useAuth } from '@/app/context/storeUserId';

const AllRequireUsers = () => {
    const { allUsers, openAllRequireUsers, setOpenAllRequireUsers, user, setAllUsers } = useAuth();
    console.log(allUsers, 'allusers');
    console.log(user, " user");

    const handleNotifyUser = async (notificationSenderId, bloodRequire, notificationReceiverId) => {
        if (!user) return alert("You must be logged in!");

        console.log(notificationSenderId, bloodRequire, notificationReceiverId, 'here');

        try {
            const res = await fetch("/api/sendNotification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    notificationSenderId,
                    notificationReceiverId,
                    bloodRequire,
                }),
            });

            const data = await res.json();
            console.log(data, 'x');

            if (data.success) {
                alert("Notification sent successfully!");
            } else {
                alert("Error: " + data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong!");
        }
    };


    if (!allUsers || allUsers.length === 0) {
        return (
            <div className='w-full h-screen bg-red-50 flex items-center justify-center relative'>

                {/* Close button */}
                <button
                    onClick={() => setOpenAllRequireUsers(false)}
                    className='absolute top-4 right-4 text-gray-500 hover:text-red-600 bg-white hover:bg-red-100 rounded-full p-2 shadow-md transition'
                    title="Close"
                >
                    ✕
                </button>

                {/* Message */}
                <p className='text-gray-700 text-lg font-medium'>
                    No users found.
                </p>
            </div>
        );
    }


    return (
        <div className="w-full min-h-screen relative p-6 bg-gradient-to-br from-red-900 via-red-800 to-red-700 overflow-hidden">



            {/* Top Header */}
            <div className="flex justify-between items-center mb-6 bg-white/10 backdrop-blur px-4 py-3 rounded-2xl shadow-md border border-red-100">

                {/* Title with subtle icon */}
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                    🩸 All Users from Your Criteria
                </h2>

                {/* Close Button */}
                <button
                    onClick={() => setOpenAllRequireUsers(false)}
                    className="flex items-center justify-center text-white bg-red-600 hover:bg-red-700 rounded-full p-2 shadow-lg transition transform hover:scale-110"
                    title="Close"
                >
                    ✕
                </button>
            </div>


            {/* Users Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {allUsers
                    .filter(donor => donor._id !== user?.id)
                    .map((donor) => (
                        <div
                            key={donor._id}
                            className="bg-[#fff] shadow-lg rounded-2xl p-6 border-l-4 border-gradient-to-b from-red-600 to-rose-600 hover:shadow-2xl hover:scale-105 transition duration-300"
                        >
                            {/* Name + Blood Group */}
                            <div className="flex items-center justify-between mb-4">
                                {/* Donor Name */}
                                <h3 className="text-xl sm:text-2xl font-extrabold text-black drop-shadow-md">
                                    {donor.name}
                                </h3>

                                {/* Blood Group Badge */}
                                <span
                                    className={`px-4 py-1 rounded-full font-semibold text-white shadow-md ${donor.bloodgroup.includes("+")
                                        ? "bg-gradient-to-r from-red-600 to-rose-600"
                                        : "bg-red-500/90"
                                        }`}
                                >
                                    {donor.bloodgroup}
                                </span>
                            </div>


                            {/* User Info */}
                            <div className="space-y-2 text-gray-200 text-base">
                                <p>
                                    <span className="font-semibold text-black">Email:</span>{" "}
                                    <span className="text-black">{donor.email}</span>
                                </p>
                                <p>
                                    <span className="font-semibold text-black">Contact:</span>{" "}
                                    <span className="text-black">{donor.contact}</span>
                                </p>
                                <p>
                                    <span className="font-semibold text-black">Province:</span>{" "}
                                    <span className="text-black">{donor.province}</span>
                                </p>
                                <p>
                                    <span className="font-semibold text-black">District:</span>{" "}
                                    <span className="text-black">{donor.district}</span>
                                </p>
                                <p>
                                    <span className="font-semibold text-black">Birth Year:</span>{" "}
                                    <span className="text-black">{donor.birthYear}</span>
                                </p>
                                <p>
                                    <span className="font-semibold text-black">Donation Count:</span>{" "}
                                    <span className="text-red-400 font-medium">{donor.donationCount}</span>
                                </p>
                                <p>
                                    <span className="font-semibold text-black">Active:</span>{" "}
                                    <span className={`px-2 py-1 rounded-full font-semibold text-sm ${donor.isActive ? "bg-green-600/30 text-green-600" : "bg-gray-500/30 text-gray-400"
                                        }`}>
                                        {donor.isActive ? "Yes" : "No"}
                                    </span>
                                </p>
                            </div>


                            {/* Action Button */}
                            <button
                                onClick={() => handleNotifyUser(user.id, donor.bloodgroup, donor._id)}
                                className="mt-4 w-full py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 shadow-lg transition-all duration-300"
                            >
                                Send Request for Blood
                            </button>
                        </div>

                    ))}

            </div>
        </div>

    );
};

export default AllRequireUsers;
