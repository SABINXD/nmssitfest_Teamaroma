
'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/storeUserId'
import AppLogo from './AppLogo'
import { useAppContext } from '@/app/context/appContext'

const NotificationUI = () => {
  const { user, openNotificationUI, setOpenNotificationUI } = useAuth();
  const { appName } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [confirmNotifications, setConfirmNotifications] = useState([]);

  const handleReadyDonate = async (notificationId) => {
    try {
      const res = await fetch("/api/sendNotification", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }), // send notification ID
      });

      const data = await res.json();
      if (data.success) {
        alert('Great, Now wait for receiver to confirm it.');
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmReceivedBlood = async (notificationId, notificationSenderId, notificationReceiverId) => {
    try {
      const res = await fetch("/api/confirmBloodReceived", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId, notificationSenderId, notificationReceiverId }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Donation confirmed! Donor's donation count updated.");
        setConfirmNotifications(prev =>
          prev.filter(notif => notif._id !== notificationId)
        );
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };


  useEffect(() => {
    if (!user) return;


    const getNotifications = async () => {
      try {
        const res = await fetch("/api/sendNotification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, isNotificationReceiveCase: true }),
        });

        const data = await res.json();
        if (data.success) {
          console.log(data, 'notify');

          setNotifications(data.notifications);
          setConfirmNotifications(data.confirmNotifications);
          console.log(data.confirmNotifications, 'x'); // will now show actual items if backend returns
        } else {
          console.error(data.error);
        }

      } catch (err) {
        console.error(err);
      }
    };

    getNotifications();
  }, [user]);

  if (notifications.length === 0 && confirmNotifications.length === 0) {

    return (
      <>
        <button
          onClick={() => setOpenNotificationUI(false)}
          className='absolute top-4 right-4 text-gray-500 hover:text-red-600 bg-white hover:bg-red-100 rounded-full p-2 shadow-md transition'
          title="Close"
        >
          ✕
        </button>
        <div className="flex flex-col items-center justify-center w-full min-h-[200px] bg-red-50 rounded-xl p-6 mt-6 shadow-md border border-red-200">
          <svg
            className="w-12 h-12 text-red-400 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m2 0a9 9 0 11-8-8 9 9 0 018 8z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">No Notifications</h2>
          <p className="text-gray-600 text-center">
            You don’t have any notifications yet. Once someone requests blood or confirms a donation, it will appear here.
          </p>
        </div>
      </>
    )
  }


  return (
    <div className='w-full min-h-screen bg-red-50 p-6'>
      <AppLogo />
      <h1 className='text-2xl font-bold text-red-600 mt-4'>{appName} - Notifications</h1>
      <button
        onClick={() => setOpenNotificationUI(false)}
        className='absolute top-4 right-4 text-gray-500 hover:text-red-600 bg-white hover:bg-red-100 rounded-full p-2 shadow-md transition'
        title="Close"
      >
        ✕
      </button>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Blood Requests - helpers */}
        {notifications.map((notif) => (
          <div
            key={notif._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 border-l-4 border-red-600 flex flex-col justify-between"
          >
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">{notif.notificationSenderId.name}</h3>
                <span className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-red-600">
                  {notif.bloodGroupRequire}
                </span>
              </div>
              <p className="text-sm text-gray-600">📞 {notif.notificationSenderId.contact}</p>
              <p className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</p>
            </div>
            <div className="border-t" />
            <div className="p-5 flex flex-col gap-3">
              <p className="text-sm font-medium text-gray-700 text-center">Are you ready to donate?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleReadyDonate(notif._id)}
                  className="flex-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  I Helped
                </button>
                <button
                  onClick={() => alert("No worries! Maybe next time you can help someone in need ❤️")}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  ❌ No
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Confirm Notifications - receiver */}
        {confirmNotifications.map((notif) => (
          <div
            key={notif._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 border-l-4 border-green-600 flex flex-col justify-between"
          >
            <div className="p-5 space-y-2">
              <h3 className="text-lg font-bold text-gray-800">{notif.notificationReceiverId.name}</h3>
              <p className="text-sm text-gray-600">📞 {notif.notificationSenderId.contact}</p>
              <p className="text-sm text-gray-600">Blood Group Donated: {notif.bloodGroupRequire}</p>
              <p className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</p>
            </div>
            <div className="border-t" />
            <div className="p-5 flex flex-col gap-3">
              <p className="text-sm font-medium text-gray-700 text-center">Did you receive blood from this helper?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => confirmReceivedBlood(notif._id, notif.notificationSenderId._id, notificationReceiverId)}
                  className="flex-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  ✅ Yes
                </button>
                <button
                  // onClick={() => rejectBloodDonation(notif._id)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  ❌ No
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default NotificationUI;
