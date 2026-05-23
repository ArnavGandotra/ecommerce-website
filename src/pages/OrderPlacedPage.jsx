import React from 'react';
import { Check } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { currency } from '../utils/checkout';

function OrderPlacedPage() {
  const order = useSelector((state) => state.checkout.latestOrder);

  return (
    <section className="form-page">
      <div className="order-success">
        <span className="success-mark">
          <Check size={34} />
        </span>
        <p className="eyebrow">Order placed</p>
        <h1>Thank you for shopping with YourStore.</h1>
        {order ? (
          <p>
            Your order <strong>{order.id}</strong> has been placed. Total paid:{' '}
            <strong>{currency.format(order.total)}</strong>.
          </p>
        ) : (
          <p>Your order has been placed.</p>
        )}
        <Link className="checkout-button compact-button" to="/">
          Go to home page
        </Link>
      </div>
    </section>
  );
}

export default OrderPlacedPage;
