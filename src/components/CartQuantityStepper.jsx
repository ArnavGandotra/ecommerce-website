import React from 'react';
import { Minus, Plus } from 'lucide-react';

function CartQuantityStepper({ value, min = 1, max = 10, onDecrement, onIncrement }) {
  const atMax = value >= max;

  return (
    <div className="cart-qty-stepper" role="group" aria-label="Quantity in cart">
      <button
        type="button"
        className="cart-qty-btn"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onDecrement?.();
        }}
        aria-label={value <= min ? 'Remove from cart' : 'Decrease quantity'}
      >
        <Minus size={18} />
      </button>
      <span className="cart-qty-value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="cart-qty-btn"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onIncrement?.();
        }}
        disabled={atMax}
        aria-label="Increase quantity"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}

export default CartQuantityStepper;
