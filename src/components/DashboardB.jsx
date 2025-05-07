import React, { useEffect, useState } from 'react';

const DashboardB = () => {
  const email = localStorage.getItem('email');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (email) {
      fetch(`http://localhost:3000/api/user/${email}`)
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((err) => console.error('Fetch error:', err));
    }
  }, [email]);

  if (!user) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="min-h-screen grid grid-cols-12 gap-4 p-4 bg-gray-100">
      {/* Sidebar - Left */}
      <div className="col-span-3 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-purple-600">User Info</h2>
        <p className="text-gray-700 mb-2"><strong>Name:</strong> {user.name}</p>
        <p className="text-gray-700 mb-2"><strong>Age:</strong> {user.age}</p>
        {/* <p className="text-gray-700 mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="text-gray-700"><strong>Mobile:</strong> {user.mobile}</p> */}
      </div>

      {/* Editor + Canvas Side by Side */}
      <div className="col-span-9 grid grid-cols-2 gap-4">
        {/* Editor Section */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-purple-600 mb-2">Code Editor</h2>
          <textarea
            className="w-full h-[400px] border border-gray-300 rounded-md p-3 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Write your code here..."
          />
        </div>

        {/* Canvas Section */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-purple-600 mb-2">Canvas</h2>
          <div className="w-full h-[400px] border border-gray-300 rounded-md bg-gray-50 flex items-center justify-center">
            <span className="text-gray-400">Canvas Area (e.g., Drawing or Simulation)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardB;
