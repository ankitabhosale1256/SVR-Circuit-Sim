import React from 'react';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-100">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 border rounded-md mb-4"
        />
        <button className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
          Send Reset Link
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;


