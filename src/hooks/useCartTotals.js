import { useSelector } from 'react-redux';

export function useCartTotals() {
  const cart = useSelector((state) => state.cart);
  const cartItems = Object.values(cart);
  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 8.99;

  return {
    cartItems,
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}
