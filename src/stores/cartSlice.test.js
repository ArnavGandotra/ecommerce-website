import { describe, expect, it } from 'vitest';
import cartReducer, { addItem, clearCart, removeItem, setQuantity } from './cartSlice';

const product = {
  external_id: 1,
  title: 'Test Product',
  price: 10,
  description: 'Desc',
  category: 'electronics',
  image_url: 'https://example.com/img.png',
};

describe('cartSlice', () => {
  it('adds and updates items', () => {
    let state = cartReducer(undefined, { type: '@@INIT' });
    state = cartReducer(state, addItem({ product, quantity: 2 }));
    expect(state['1'].quantity).toBe(2);

    state = cartReducer(state, setQuantity({ id: '1', quantity: 5 }));
    expect(state['1'].quantity).toBe(5);
  });

  it('removes items and clears cart', () => {
    let state = cartReducer(undefined, addItem({ product, quantity: 1 }));
    state = cartReducer(state, removeItem('1'));
    expect(state['1']).toBeUndefined();

    state = cartReducer(undefined, addItem({ product, quantity: 1 }));
    state = cartReducer(state, clearCart());
    expect(state).toEqual({});
  });
});
