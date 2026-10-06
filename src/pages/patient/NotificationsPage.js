import React from 'react';

const NotificationsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Notifications</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-300">No new notifications</p>
      </div>
    </div>
  );
};

export default NotificationsPage;
