import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setSelectedUser } from '../../../redux/slices/userSlice';
import { useAppDispatch } from '../../../redux/hooks';
import { getInitialsColor } from '../utils';

const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();
  const { selectedUser, users, loading, error } = useSelector((state: any) => state.users);

  useEffect(() => {
    if (userId) {
      dispatch(setSelectedUser(userId));
    }
  }, [userId, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center text-red-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center text-gray-500">User not found</div>
            <div className="mt-4 text-center">
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                Back to Users
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Users
            </Link>
          </div>

          <div className="flex items-center mb-6">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium text-white ${getInitialsColor(
                selectedUser.initials
              )}`}
            >
              {selectedUser.initials}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h1>
              <p className="text-gray-500">{selectedUser.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-900">{selectedUser.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <a
                  href={`https://${selectedUser.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  {selectedUser.website}
                </a>
              </div>
            </div>
          </div>

          {selectedUser.address && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Street</p>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.address.street}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Suite</p>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.address.suite}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.address.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Zipcode</p>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.address.zipcode}</p>
                </div>
              </div>
            </div>
          )}

          {selectedUser.company && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Company</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.company.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Catch Phrase</p>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.company.catchPhrase}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">BS</p>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.company.bs}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails; 