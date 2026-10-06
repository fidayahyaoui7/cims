import React from 'react';

const SupportPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Support</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">Need help? Contact our support team.</p>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Email</h3>
            <a href="mailto:support@example.com" className="text-blue-500 hover:underline">
              support@example.com
            </a>
          </div>
          <div>
            <h3 className="font-medium">Phone</h3>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
