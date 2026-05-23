import { formatDeliveryAddress } from './checkout';
import { userAddressToCheckoutFields } from './user';

export function createAddressId() {
  return `addr-${Date.now().toString(36)}`;
}

export function apiAddressToSaved(address, id = 'addr-default') {
  const fields = userAddressToCheckoutFields(address);
  return {
    id,
    label: 'Home',
    ...fields,
  };
}

export function formatSavedAddress(address) {
  if (!address) {
    return '—';
  }

  return formatDeliveryAddress(address);
}

export function hydrateUserWithAddresses(apiUser, storedUser) {
  const hasStoredList =
    storedUser?.id === apiUser.id &&
    Array.isArray(storedUser.savedAddresses) &&
    storedUser.savedAddresses.length > 0;

  return {
    ...apiUser,
    savedAddresses: hasStoredList
      ? storedUser.savedAddresses
      : [apiAddressToSaved(apiUser.address)],
  };
}
