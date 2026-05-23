import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginWithCredentials } from '../services/auth';
import { apiAddressToSaved, createAddressId, hydrateUserWithAddresses } from '../utils/addresses';
import { readStorage, writeStorage } from '../utils/storage';

const AUTH_KEY = 'ecommerce.authUser';

function persistUser(user) {
  writeStorage(AUTH_KEY, user);
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      return await loginWithCredentials(username, password);
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed.');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: (() => {
      const stored = readStorage(AUTH_KEY, null);
      if (!stored) {
        return null;
      }

      if (stored.savedAddresses?.length) {
        return stored;
      }

      return hydrateUserWithAddresses(stored, stored);
    })(),
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.status = 'idle';
      state.error = null;
      try {
        localStorage.removeItem(AUTH_KEY);
      } catch {
        /* ignore */
      }
    },
    clearAuthError(state) {
      state.error = null;
    },
    updateSavedAddress(state, action) {
      if (!state.user?.savedAddresses) {
        return;
      }

      const { id, fields } = action.payload;
      const index = state.user.savedAddresses.findIndex((item) => item.id === id);

      if (index === -1) {
        return;
      }

      state.user.savedAddresses[index] = {
        ...state.user.savedAddresses[index],
        ...fields,
      };
      persistUser(state.user);
    },
    addSavedAddress(state, action) {
      if (!state.user) {
        return;
      }

      if (!state.user.savedAddresses) {
        state.user.savedAddresses = [];
      }

      state.user.savedAddresses.push({
        id: action.payload?.id ?? createAddressId(),
        label: 'Address',
        line1: '',
        line2: '',
        city: '',
        pincode: '',
        state: '',
        ...action.payload,
      });
      persistUser(state.user);
    },
    deleteSavedAddress(state, action) {
      if (!state.user?.savedAddresses) {
        return;
      }

      const next = state.user.savedAddresses.filter((item) => item.id !== action.payload);

      if (next.length === 0 && state.user.address) {
        state.user.savedAddresses = [apiAddressToSaved(state.user.address, createAddressId())];
      } else {
        state.user.savedAddresses = next;
      }

      persistUser(state.user);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = hydrateUserWithAddresses(action.payload, state.user);
        state.error = null;
        persistUser(state.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed.';
      });
  },
});

export const { logout, clearAuthError, updateSavedAddress, addSavedAddress, deleteSavedAddress } =
  authSlice.actions;
export default authSlice.reducer;
