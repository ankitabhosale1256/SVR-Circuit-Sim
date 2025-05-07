import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Loginpage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      const userAge = data.age;
      const userName = data.name;

      localStorage.setItem('name', userName);
      localStorage.setItem('email', email); // ✅ Save email for dashboard use

      // ✅ Age-wise routing
      if (userAge >= 7 && userAge <= 15) {
        navigate('/dashboardA');
      } else if (userAge >= 16 && userAge <= 25) {
        navigate('/dashboardB');
      } else if (userAge >= 26 && userAge <= 45) {
        navigate('/dashboardC');
      } else {
        setError('Age not allowed for dashboard access.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-purple-700">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Login</h2>
        <p className="text-sm text-gray-500 mb-4">
          Don’t have an account yet?{' '}
          <Link to="/signup" className="text-purple-600 hover:underline">Sign Up</Link>
        </p>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <div className="text-right text-sm mt-1">
              <Link to="/forgot-password" className="text-purple-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-200"
          >
            LOGIN
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500 text-sm">or login with</div>

        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={() => window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth'}
            className="bg-white border px-4 py-2 rounded-md flex items-center shadow"
          >
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" className="mr-2" />
            Google
          </button>
          <button className="bg-white border px-4 py-2 rounded-md flex items-center shadow">
            <img src="https://img.icons8.com/color/16/000000/facebook-new.png" alt="Facebook" className="mr-2" />
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;
