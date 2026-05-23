/** Map API address to checkout form fields */
export function userAddressToCheckoutFields(address) {
  if (!address) {
    return {
      line1: '',
      line2: '',
      city: '',
      pincode: '',
      state: '',
    };
  }

  const line1 = [address.number, address.street].filter(Boolean).join(' ').trim();

  return {
    line1,
    line2: '',
    city: address.city?.trim() ?? '',
    pincode: address.zipcode?.trim() ?? '',
    state: address.city?.trim() ?? '',
  };
}

export function getUserDisplayName(user) {
  if (!user?.name) {
    return user?.username ?? 'User';
  }

  const first = user.name.firstname ?? '';
  const last = user.name.lastname ?? '';
  return `${first} ${last}`.trim() || user.username;
}
