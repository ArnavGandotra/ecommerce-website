import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddressFormModal, { validateAddressForm } from '../components/AddressFormModal';
import CatalogNavBar from '../components/CatalogNavBar';
import { useCatalog } from '../hooks/useCatalog';
import {
  addSavedAddress,
  deleteSavedAddress,
  logout,
  updateSavedAddress,
} from '../stores/authSlice';
import { formatSavedAddress } from '../utils/addresses';
import { getUserDisplayName } from '../utils/user';

const emptyAddressForm = {
  line1: '',
  line2: '',
  city: '',
  pincode: '',
  state: '',
};

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { categories } = useCatalog();
  const [query, setQuery] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyAddressForm);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const goToShop = (nextQuery, nextCategory) => {
    navigate('/', { state: { query: nextQuery, category: nextCategory } });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    setForm(emptyAddressForm);
    setFormError('');
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setForm(emptyAddressForm);
    setFormError('');
  };

  const openEditModal = (address) => {
    setModalMode('edit');
    setEditingId(address.id);
    setForm({
      line1: address.line1 ?? '',
      line2: address.line2 ?? '',
      city: address.city ?? '',
      pincode: address.pincode ?? '',
      state: address.state ?? '',
    });
    setFormError('');
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleSave = () => {
    const validationError = validateAddressForm(form);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const fields = {
      line1: form.line1.trim(),
      line2: form.line2.trim(),
      city: form.city.trim(),
      pincode: form.pincode.trim(),
      state: form.state.trim(),
    };

    if (modalMode === 'add') {
      dispatch(addSavedAddress({ label: 'Address', ...fields }));
    } else if (modalMode === 'edit' && editingId) {
      dispatch(updateSavedAddress({ id: editingId, fields }));
    }

    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this address?')) {
      dispatch(deleteSavedAddress(id));
      if (editingId === id) {
        closeModal();
      }
    }
  };

  return (
    <>
      <CatalogNavBar
        categories={categories}
        query={query}
        onQueryChange={setQuery}
        category={null}
        onCategoryChange={(value) => goToShop(query, value)}
      />

      <section className="profile-page">
        <div className="profile-layout">
          <div className="profile-avatar" aria-hidden />

          <p className="profile-name">{getUserDisplayName(user)}</p>
          <p className="profile-meta">{user.email}</p>
          <p className="profile-meta">{user.phone ?? '—'}</p>

          <div className="profile-addresses">
            <div className="profile-addresses-header">
              <h2 className="profile-addresses-title">Saved addresses</h2>
              <button type="button" className="text-button" onClick={openAddModal}>
                Add address
              </button>
            </div>

            <ul className="profile-address-list">
              {(user.savedAddresses ?? []).map((address) => (
                <li key={address.id} className="profile-address-item">
                  <p className="profile-address-text">{formatSavedAddress(address)}</p>
                  <div className="profile-address-actions">
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => openEditModal(address)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-button text-button--danger"
                      onClick={() => handleDelete(address.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button type="button" className="checkout-button profile-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </section>

      {modalMode ? (
        <AddressFormModal
          title={modalMode === 'add' ? 'Add address' : 'Edit address'}
          form={form}
          error={formError}
          onClose={closeModal}
          onChange={handleFormChange}
          onSubmit={handleSave}
        />
      ) : null}
    </>
  );
}

export default ProfilePage;
