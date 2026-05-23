import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartQuantityStepper from './CartQuantityStepper';
import QuantitySelector from './QuantitySelector';
import { addItem, removeItem, setQuantity } from '../stores/cartSlice';
import { store } from '../stores/store';

const MAX_QTY = 5;

function DetailPurchaseActions({ productId, product, quantity, onQuantityChange, onAdd }) {
  const dispatch = useDispatch();
  const cartQuantity = useSelector((state) => state.cart[productId]?.quantity ?? 0);

  const adjustQuantity = (delta) => {
    const current = store.getState().cart[productId]?.quantity ?? 0;

    if (delta < 0) {
      if (current <= 1) {
        dispatch(removeItem(productId));
      } else {
        dispatch(setQuantity({ id: productId, quantity: current - 1 }));
      }
      return;
    }

    if (current < MAX_QTY) {
      dispatch(setQuantity({ id: productId, quantity: current + 1 }));
    }
  };

  if (cartQuantity > 0) {
    return (
      <div className="detail-purchase-in-cart">
        <CartQuantityStepper
          value={cartQuantity}
          min={1}
          max={MAX_QTY}
          onDecrement={() => adjustQuantity(-1)}
          onIncrement={() => adjustQuantity(1)}
        />
        <Link className="go-to-cart-btn" to="/cart">
          Go to Cart
        </Link>
      </div>
    );
  }

  return (
    <>
      <QuantitySelector value={quantity} min={1} max={MAX_QTY} onChange={onQuantityChange} />
      <button type="button" className="checkout-button compact-button" onClick={onAdd}>
        Add to Cart
      </button>
    </>
  );
}

export default DetailPurchaseActions;
