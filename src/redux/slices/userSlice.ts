import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filteredUsers: User[];
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  searchQuery: '',
  filteredUsers: [],
};

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    // Transform API data to match our User interface
    return data.map((user: any) => ({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: 'User', // Default role since API doesn't provide it
      permission: 'User', // Default permission since API doesn't provide it
      initials: user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
      username: user.username,
      phone: user.phone,
      website: user.website,
      address: user.address,
      company: user.company,
    }));
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<string>) => {
      state.selectedUser = state.users.find(user => user.id === action.payload) || null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredUsers = filterUsers(state.users, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.filteredUsers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

// Helper function to filter users
const filterUsers = (users: User[], query: string): User[] => {
  if (!query) return users;
  const lowercaseQuery = query.toLowerCase();
  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery)
  );
};

export const { setSelectedUser, setSearchQuery } = userSlice.actions;
export default userSlice.reducer; 