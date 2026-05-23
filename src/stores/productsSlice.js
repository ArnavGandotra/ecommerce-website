import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCategories, fetchProducts } from '../services/products';

/** Remote catalog state: product list, categories, loading, and error flags. */
export const loadProducts = createAsyncThunk('products/loadProducts', fetchProducts);
export const loadCategories = createAsyncThunk('products/loadCategories', fetchCategories);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    categories: [],
    status: 'idle',
    categoryStatus: 'idle',
    error: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loadCategories.pending, (state) => {
        state.categoryStatus = 'loading';
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.categoryStatus = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(loadCategories.rejected, (state) => {
        state.categoryStatus = 'failed';
      });
  },
});

export default productsSlice.reducer;
