
'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/storeUserId'
import AppLogo from './AppLogo'
import { useAppContext } from '@/app/context/appContext'

const NotificationUI = () => {
  const { user, openNotificationUI, setOpenNotificationUI } = useAuth();
  const { appName } = useAppContext();
  const [notifications, setNotifications] = useState([]);

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
          setNotifications(data.notifications);
          console.log(data.notifications);

        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getNotifications();
  }, [user]);

  return (
    <div className='w-full min-h-screen bg-red-50 p-6'>
      <AppLogo />
      <h1 className='text-2xl font-bold text-red-600 mt-4'>{appName} - Notifications</h1>
      <button
      onClick={()=>setOpenNotificationUI(false)}
        className='absolute top-4 right-4 text-gray-500 hover:text-red-600 bg-white hover:bg-red-100 rounded-full p-2 shadow-md transition'
        title="Close"
      >
        ✕
      </button>

      {notifications.length === 0 ? (
        <p className='mt-6 text-gray-700'>No notifications yet.</p>
      ) : (
        <div className='mt-4 space-y-4'>
          {notifications.map((notif) => (
            <div key={notif._id} className='bg-white p-4 rounded-lg shadow-md flex justify-between items-center border-l-4 border-red-600'>
              <div>
                <p className='font-semibold text-gray-800'>{notif.notificationSenderId.name}</p>
                <p className='text-sm text-gray-600'>Blood Group Required: {notif.bloodGroupRequire}</p>
                <p className='text-sm text-gray-600'>Contact Info: {notif.notificationSenderId.contact}</p>
                <p className='text-xs text-gray-500'>{new Date(notif.createdAt).toLocaleString()}</p>
              </div>
              <button className='bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700'>View</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationUI;
