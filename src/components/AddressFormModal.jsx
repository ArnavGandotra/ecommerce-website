import React from 'react';
import { validateAddressFields } from '../utils/checkout';

function AddressFormModal({ title, form, error, onClose, onChange, onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="address-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="address-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="address-modal-title">{title}</h2>

        <form className="stack-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="line1"
            placeholder="Address line 1"
            value={form.line1}
            onChange={onChange}
          />
          <input
            type="text"
            name="line2"
            placeholder="Address line 2 (optional)"
            value={form.line2}
            onChange={onChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={onChange}
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={onChange}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={onChange}
          />

          {error ? <p className="error-message">{error}</p> : null}

          <div className="address-modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="checkout-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function validateAddressForm(form) {
  return validateAddressFields(form);
}

export default AddressFormModal;
