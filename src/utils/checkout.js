/** Shared checkout formatting and form validation for the assignment flow. */
export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** Builds a single delivery address string from structured fields. */
export function formatDeliveryAddress({ line1, line2, city, pincode, state }) {
  return [line1, line2, city, pincode, state]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(', ');
}

/** Validates structured delivery address fields only. */
export function validateAddressFields({ line1, line2, city, pincode, state }) {
  if (!line1?.trim()) {
    return 'Please enter address line 1.';
  }

  if (!city?.trim()) {
    return 'Please enter your city.';
  }

  if (!pincode?.trim()) {
    return 'Please enter your pincode.';
  }

  if (!state?.trim()) {
    return 'Please enter your state.';
  }

  return '';
}

/**
 * Validates checkout customer + delivery fields.
 * Returns an error message string, or empty string when valid.
 */
export function validateCheckoutForm({ name, email, line1, line2, city, pincode, state }) {
  if (!name?.trim()) {
    return 'Please enter your name.';
  }

  if (!email?.trim()) {
    return 'Please enter your email.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Please enter a valid email address.';
  }

  return validateAddressFields({ line1, line2, city, pincode, state });
}
