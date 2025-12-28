
'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/storeUserId'
import AppLogo from './AppLogo'
import { useAppContext } from '@/app/context/appContext'
import Loading from './Loading'

const NotificationUI = () => {
  const { user, openNotificationUI, setOpenNotificationUI } = useAuth();
  const { appName } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [confirmNotifications, setConfirmNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const confirmReceivedBlood = async (notificationId, notificationSenderId, notificationReceiverId, bloodGroupApproach) => {
    try {
      const res = await fetch("/api/confirmBloodReceived", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId, notificationSenderId, notificationReceiverId, bloodGroupDonated: bloodGroupApproach }),
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
    } finally {
      setIsLoading(false);
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
      } finally {
        setIsLoading(false);
      }
    };

    getNotifications();
  }, [user]);

  if (isLoading) return <Loading />

  if (notifications.length === 0 && confirmNotifications.length === 0) {
    return (
      <div className="relative flex items-center justify-center w-full h-full min-h-screen bg-gradient-to-br from-red-900 via-rose-900 to-red-800 px-6">

        {/* Close Button */}
        <button
          onClick={() => setOpenNotificationUI(false)}
          className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-red-600/30 rounded-full p-2 backdrop-blur shadow-lg transition"
          title="Close"
        >
          ✕
        </button>

        {/* Empty State Card */}
        <div className="relative bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-red-100">

          {/* Icon */}
          <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg text-white text-3xl">
            🩸
          </div>

          <h2 className="text-2xl font-extrabold text-gray-800 mb-3">
            No Notifications Yet
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Blood requests, donation confirmations, and urgent alerts will
            appear here as soon as they happen.
          </p>

          <div className="mt-6 text-sm text-gray-500">
            Stay active — lives may depend on you ❤️
          </div>

        </div>
      </div>
    )
  }


  return (
    <div className="w-full min-h-screen p-6 bg-gradient-to-br from-red-900 via-red-800 to-rose-900 relative">
      {/* App Logo + Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AppLogo />
          <h1 className="text-2xl font-extrabold text-white">{appName} - Notifications</h1>
        </div>
        <button
          onClick={() => setOpenNotificationUI(false)}
          className="text-white hover:text-red-400 bg-red-700/30 hover:bg-red-600/40 rounded-full p-2 shadow-lg transition"
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* Notification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Blood Requests - helpers */}
        {notifications.map((notif) => (
          <div
            key={notif._id}
            className="bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border-l-4 border-red-600 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
          >
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-md">
                  {notif.notificationSenderId.name}
                </h3>
                <span className="px-3 py-1 text-sm sm:text-base font-semibold text-white rounded-full bg-gradient-to-r from-red-600 to-rose-600 shadow-md">
                  {notif.bloodGroupRequire}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-200">📞 {notif.notificationSenderId.contact}</p>
              <p className="text-xs sm:text-sm text-gray-400">{new Date(notif.createdAt).toLocaleString()}</p>
            </div>

            <div className="border-t border-red-700/40" />

            <div className="p-5 flex flex-col gap-3">
              <p className="text-sm sm:text-base font-medium text-gray-200 text-center">
                Did you donate Blood?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleReadyDonate(notif._id)}
                  className="flex-1 bg-green-600 text-white px-3 py-2 sm:py-3 rounded-xl font-semibold hover:bg-green-700 transition text-sm sm:text-base"
                >
                  Yes
                </button>
                <button
                  onClick={() => alert("No worries! Maybe next time you can help someone in need ❤️")}
                  className="flex-1 bg-gray-600/40 text-white px-3 py-2 sm:py-3 rounded-xl font-semibold hover:bg-gray-500/40 transition text-sm sm:text-base"
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
            className="bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border-l-4 border-green-600 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
          >
            <div className="p-5 space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-md">
                {notif.notificationReceiverId.name}
              </h3>
              <p className="text-sm sm:text-base text-gray-200">📞 {notif.notificationReceiverId.contact}</p>
              <p className="text-sm sm:text-base text-gray-200">
                Blood Group Donated: <span className="font-semibold">{notif.bloodGroupRequire}</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-400">{new Date(notif.createdAt).toLocaleString()}</p>
            </div>

            <div className="border-t border-green-700/40" />

            <div className="p-5 flex flex-col gap-3">
              <p className="text-sm sm:text-base font-medium text-gray-200 text-center">
                Did you receive blood from this helper?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => confirmReceivedBlood(notif._id, notif.notificationSenderId._id, notif.notificationReceiverId, notif.bloodGroupRequire)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 sm:py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition text-sm sm:text-base shadow-md"
                >
                  ✅ Yes
                </button>
                <button
                  className="flex-1 bg-gray-600/40 text-white px-3 py-2 sm:py-3 rounded-xl font-semibold hover:bg-gray-500/50 transition text-sm sm:text-base shadow-md"
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
