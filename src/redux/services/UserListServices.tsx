import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const UserListServices = {
  getUsers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  },

  getUserById: async (id: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user details');
    }
  },

  searchUsers: async (query: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      const users = response.data;
      return users.filter((user: any) => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      throw new Error('Failed to search users');
    }
  }
};

export default UserListServices;
