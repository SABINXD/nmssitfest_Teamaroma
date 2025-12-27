
"use client"
import React from 'react';
import { useAuth } from '@/app/context/storeUserId';

const AllRequireUsers = () => {
    const { allUsers, openAllRequireUsers, setOpenAllRequireUsers, user } = useAuth();
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
        <div className='w-full min-h-screen bg-red-50 p-6 relative'>
            {/* Top Header */}
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-red-600'>
                    All Users from Your Criteria
                </h2>

                {/* Close Button */}
                <button
                    onClick={() => setOpenAllRequireUsers(false)}
                    className='text-gray-500 hover:text-red-600 bg-white hover:bg-red-100 rounded-full p-2 shadow-md transition duration-200'
                    title="Close"
                >
                    ✕
                </button>
            </div>

            {/* Users Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {allUsers.map((donor) => (
                    <div
                        key={donor._id}
                        className='bg-white shadow-lg rounded-xl p-6 border-l-4 border-red-600 hover:shadow-2xl transition duration-300'
                    >
                        {/* Name + Blood Group */}
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-xl font-bold text-gray-800'>{donor.name}</h3>
                            <span
                                className={`px-3 py-1 rounded-full text-white font-semibold ${donor.bloodgroup.includes('+') ? 'bg-red-600' : 'bg-red-400'
                                    }`}
                            >
                                {donor.bloodgroup}
                            </span>
                        </div>

                        {/* User Info */}
                        <div className='space-y-1 text-gray-700 text-sm'>
                            <p><span className='font-semibold'>Email:</span> {donor.email}</p>
                            <p><span className='font-semibold'>Contact:</span> {donor.contact}</p>
                            <p><span className='font-semibold'>Province:</span> {donor.province}</p>
                            <p><span className='font-semibold'>District:</span> {donor.district}</p>
                            <p><span className='font-semibold'>Birth Year:</span> {donor.birthYear}</p>
                            <p><span className='font-semibold'>Donation Count:</span> {donor.donationCount}</p>
                            <p>
                                <span className='font-semibold'>Active:</span>{' '}
                                <span
                                    className={`font-semibold ${donor.isActive ? 'text-green-600' : 'text-gray-400'
                                        }`}
                                >
                                    {donor.isActive ? 'Yes' : 'No'}
                                </span>
                            </p>
                        </div>

                        {/* Action Button */}
                        <button onClick={() => handleNotifyUser(user?.id, donor.bloodgroup, donor._id)} className='mt-4 w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition'>
                            Send Request for Blood
                        </button>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default AllRequireUsers;
