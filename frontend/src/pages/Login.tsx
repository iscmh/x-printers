import React from 'react';

const Login: React.FC = () => {
  const handleTwitterLogin = () => {
    // This will be connected to your backend Twitter auth endpoint
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/twitter`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      {/* Logo/Brand Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600">X Printers</h1>
        <p className="mt-2 text-gray-600">Generate tweets with AI magic ✨</p>
      </div>

      {/* Login Card */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>
        
        <p className="text-center text-gray-600 mb-8">
          Sign in with your Twitter account to start generating amazing tweets
        </p>

        {/* Twitter Login Button */}
        <button
          onClick={handleTwitterLogin}
          className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Sign in with Twitter
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login; 