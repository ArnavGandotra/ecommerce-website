import { describe, expect, it } from 'vitest';
import { formatDeliveryAddress, validateAddressFields, validateCheckoutForm } from './checkout';

const validAddress = {
  line1: '123 Main St',
  line2: 'Apt 4B',
  city: 'Mumbai',
  pincode: '400001',
  state: 'Maharashtra',
};

const validCheckout = {
  name: 'John Doe',
  email: 'john@example.com',
  ...validAddress,
};

describe('formatDeliveryAddress', () => {
  it('joins address parts', () => {
    expect(formatDeliveryAddress(validAddress)).toBe('123 Main St, Apt 4B, Mumbai, 400001, Maharashtra');
  });
});

describe('validateAddressFields', () => {
  it('requires line1', () => {
    expect(validateAddressFields({ ...validAddress, line1: '   ' })).toBe('Please enter address line 1.');
  });
});

describe('validateCheckoutForm', () => {
  it('requires name and email', () => {
    expect(validateCheckoutForm({ ...validCheckout, name: '' })).toBe('Please enter your name.');
    expect(validateCheckoutForm({ ...validCheckout, email: '' })).toBe('Please enter your email.');
    expect(validateCheckoutForm({ ...validCheckout, email: 'not-an-email' })).toBe(
      'Please enter a valid email address.',
    );
  });

  it('accepts valid checkout payload', () => {
    expect(validateCheckoutForm(validCheckout)).toBe('');
  });
});
