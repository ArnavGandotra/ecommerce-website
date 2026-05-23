import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OrderSummary from '../components/OrderSummary';
import { useCartTotals } from '../hooks/useCartTotals';
import { getUserDisplayName } from '../utils/user';
import { clearCart } from '../stores/cartSlice';
import { placeOrder } from '../stores/checkoutSlice';
import { formatDeliveryAddress, validateCheckoutForm } from '../utils/checkout';
import { formatSavedAddress } from '../utils/addresses';

const emptyAddressFields = {
  line1: '',
  line2: '',
  city: '',
  pincode: '',
  state: '',
};

function buildInitialFormData(user, savedAddressFields) {
  return {
    name: user ? getUserDisplayName(user) : '',
    email: user?.email ?? '',
    ...(savedAddressFields ?? emptyAddressFields),
  };
}

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { cartItems, subtotal, shipping, total } = useCartTotals();

  const savedAddressFields = useMemo(() => {
    const primary = user?.savedAddresses?.[0];
    if (!primary) {
      return null;
    }

    return {
      line1: primary.line1 ?? '',
      line2: primary.line2 ?? '',
      city: primary.city ?? '',
      pincode: primary.pincode ?? '',
      state: primary.state ?? '',
    };
  }, [user]);

  const [addressMode, setAddressMode] = useState(savedAddressFields ? 'saved' : 'new');
  const [formData, setFormData] = useState(() => buildInitialFormData(user, savedAddressFields));
  const [message, setMessage] = useState('');

  if (!cartItems.length) {
    return (
      <section className="form-page">
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Add products before checkout.</p>
          <button className="checkout-button compact-button" onClick={() => navigate('/')}>
            Go to home
          </button>
        </div>
      </section>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage('');
  };

  const handleAddressModeChange = (mode) => {
    setAddressMode(mode);
    setMessage('');

    if (mode === 'saved' && savedAddressFields) {
      setFormData((prev) => ({ ...prev, ...savedAddressFields }));
    } else if (mode === 'new') {
      setFormData((prev) => ({ ...prev, ...emptyAddressFields }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('');

    const addressFields =
      addressMode === 'saved' && savedAddressFields
        ? savedAddressFields
        : {
            line1: formData.line1,
            line2: formData.line2,
            city: formData.city,
            pincode: formData.pincode,
            state: formData.state,
          };

    const fieldsToValidate = {
      name: formData.name,
      email: formData.email,
      ...addressFields,
    };

    const validationError = validateCheckoutForm(fieldsToValidate);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    const normalizedAddress = {
      line1: addressFields.line1.trim(),
      line2: addressFields.line2.trim(),
      city: addressFields.city.trim(),
      pincode: addressFields.pincode.trim(),
      state: addressFields.state.trim(),
    };

    dispatch(
      placeOrder({
        id: `ORD-${Date.now().toString().slice(-8)}`,
        items: cartItems,
        subtotal,
        shipping,
        total,
        customerInfo: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          address: formatDeliveryAddress(normalizedAddress),
          ...normalizedAddress,
          userId: user?.id ?? null,
          addressSource: addressMode === 'saved' ? 'saved' : 'new',
        },
        placedAt: new Date().toISOString(),
      }),
    );
    dispatch(clearCart());
    navigate('/order-placed');
  };

  return (
    <section className="checkout-page">
      <button type="button" className="back-link" onClick={() => navigate('/cart')}>
        Back
      </button>

      <div className="section-heading">
        <div>
          <p className="eyebrow">Checkout</p>
          <h2>Complete your order</h2>
        </div>
      </div>

      <div className="checkout-grid">
        <div className="checkout-main">
          <div className="checkout-block">
            <h3>Delivery Information</h3>

            {savedAddressFields ? (
              <div className="checkout-address-modes" role="radiogroup" aria-label="Address option">
                <label className="address-mode-option">
                  <input
                    type="radio"
                    name="addressMode"
                    value="saved"
                    checked={addressMode === 'saved'}
                    onChange={() => handleAddressModeChange('saved')}
                  />
                  <span>Use saved address</span>
                </label>
                <label className="address-mode-option">
                  <input
                    type="radio"
                    name="addressMode"
                    value="new"
                    checked={addressMode === 'new'}
                    onChange={() => handleAddressModeChange('new')}
                  />
                  <span>Add a new address</span>
                </label>
              </div>
            ) : null}

            <form className="stack-form" onSubmit={handleSubmit}>
              <label>
                Full name
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              {addressMode === 'saved' && savedAddressFields ? (
                <div className="saved-address-summary">
                  <p>{formatSavedAddress(savedAddressFields)}</p>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    name="line1"
                    placeholder="Address line 1"
                    value={formData.line1}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="line2"
                    placeholder="Address line 2 (optional)"
                    value={formData.line2}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              {message ? <p className="error-message">{message}</p> : null}
              <button type="submit" className="checkout-button">
                Place Order
              </button>
            </form>
          </div>
        </div>

        <OrderSummary cartItems={cartItems} subtotal={subtotal} shipping={shipping} total={total} />
      </div>
    </section>
  );
}

export default CheckoutPage;
