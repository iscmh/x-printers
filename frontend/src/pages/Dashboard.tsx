import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Tweet {
  id: string;
  text: string;
  created_at: string;
}

interface User {
  name: string;
  username: string;
  profile_image_url: string;
}

const Dashboard: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchRecentTweets();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError('Failed to load user data');
    }
  };

  const fetchRecentTweets = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tweets/recent`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tweets');
      }

      const tweetsData = await response.json();
      setTweets(tweetsData);
    } catch (err) {
      setError('Failed to load tweets');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-50 p-4 rounded-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {user?.profile_image_url && (
                <img
                  src={user.profile_image_url}
                  alt={user.name}
                  className="h-10 w-10 rounded-full"
                />
              )}
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">{user?.name}</h1>
                <p className="text-sm text-gray-500">@{user?.username}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Tweets</h2>
            
            {tweets.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tweets found</p>
            ) : (
              <div className="space-y-4">
                {tweets.map((tweet) => (
                  <div
                    key={tweet.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition duration-200"
                  >
                    <p className="text-gray-900">{tweet.text}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(tweet.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 