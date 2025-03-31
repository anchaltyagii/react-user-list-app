import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  setSelectedUser,
  setSearchQuery,
  fetchUsers,
} from '../../redux/slices/userSlice';
import Table from '../../components/Table';
import { getInitials, getInitialsColor } from '../../utils/string';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/hooks';

const UserList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users = [], filteredUsers = [], loading, error, searchQuery } = useSelector(
    (state: any) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const handleRowClick = (user: User) => {
    dispatch(setSelectedUser(user.id));
  };

  const columns = [
    {
      header: 'Name',
      accessor: (user: User) => (
        <Link
          to={`/users/${user.id}`}
          className="flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setSelectedUser(user.id));
          }}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${getInitialsColor(
              getInitials(user.name)
            )}`}
          >
            {getInitials(user.name)}
          </div>
          <span className="ml-3 text-sm font-medium text-gray-900">{user.name}</span>
        </Link>
      ),
      sortValue: (user: User) => user.name,
      sortable: true,
    },
    {
      header: 'Email address',
      accessor: (user: User) => user.email,
      sortable: true,
    },
    {
      header: 'Phone',
      accessor: (user: User) => user.phone,
      sortable: true,
    },
    {
      header: 'Website',
      accessor: (user: User) => (
        <a
          href={`https://${user.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
          onClick={(e) => e.stopPropagation()}
        >
          {user.website}
        </a>
      ),
      sortValue: (user: User) => user.website,
      sortable: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  const displayedUsers = searchQuery ? filteredUsers : users;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Users</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <Table
            data={displayedUsers}
            columns={columns}
            selectable
            onRowClick={handleRowClick}
            emptyMessage="No users found matching your search criteria."
            pageSize={5}
          />
        </div>
      </div>
    </div>
  );
};

export default UserList;
