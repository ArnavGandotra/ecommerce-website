import React from 'react';
import { currency } from '../utils/checkout';

function OrderSummary({ cartItems, subtotal, shipping, total }) {
  return (
    <aside className="checkout-panel order-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Order</p>
          <h2>Summary</h2>
        </div>
      </div>
      <div className="cart-items">
        {cartItems.map(({ product, quantity }) => (
          <div className="cart-item" key={product.external_id ?? product.id}>
            <img src={product.image_url} alt="" />
            <div>
              <strong>{product.title}</strong>
              <span>
                {quantity} x {currency.format(product.price)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="totals">
        <div>
          <span>Subtotal</span>
          <strong>{currency.format(subtotal)}</strong>
        </div>
        <div>
          <span>Shipping</span>
          <strong>{shipping ? currency.format(shipping) : 'Free'}</strong>
        </div>
        <div className="grand-total">
          <span>Total</span>
          <strong>{currency.format(total)}</strong>
        </div>
      </div>
    </aside>
  );
}

export default OrderSummary;
