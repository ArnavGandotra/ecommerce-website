import { createSlice } from '@reduxjs/toolkit';
import { readStorage, writeStorage } from '../utils/storage';

const ORDER_KEY = 'ecommerce.latestOrder';

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    latestOrder: readStorage(ORDER_KEY, null),
  },
  reducers: {
    placeOrder(state, action) {
      state.latestOrder = action.payload;
      writeStorage(ORDER_KEY, state.latestOrder);
    },
  },
});

export const { placeOrder } = checkoutSlice.actions;
export default checkoutSlice.reducer;
