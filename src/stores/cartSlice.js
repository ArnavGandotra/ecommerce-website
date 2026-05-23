import { createSlice } from '@reduxjs/toolkit';
import { readStorage, writeStorage } from '../utils/storage';

/** Cart state persisted in localStorage so items survive page refresh. */
const CART_KEY = 'ecommerce.cart';

const normalizeCart = () => {
  const savedCart = readStorage(CART_KEY, {});

  return Object.fromEntries(
    Object.entries(savedCart).filter(([, item]) => item && typeof item === 'object' && item.product && item.quantity),
  );
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: normalizeCart(),
  reducers: {
    addItem(state, action) {
      const { product, quantity = 1, max = 10 } = action.payload;
      const id = String(product.external_id ?? product.id);
      const existing = state[id]?.quantity ?? 0;
      state[id] = { product, quantity: Math.min(max, existing + quantity) };
      writeStorage(CART_KEY, state);
    },
    setQuantity(state, action) {
      const { id, quantity } = action.payload;
      const nextQuantity = Math.max(1, Math.min(10, Number(quantity)));

      if (state[id]) {
        state[id].quantity = nextQuantity;
      }

      writeStorage(CART_KEY, state);
    },
    removeItem(state, action) {
      delete state[action.payload];
      writeStorage(CART_KEY, state);
    },
    clearCart() {
      writeStorage(CART_KEY, {});
      return {};
    },
  },
});

export const { addItem, clearCart, removeItem, setQuantity } = cartSlice.actions;
export default cartSlice.reducer;
