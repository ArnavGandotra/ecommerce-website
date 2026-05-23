import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCategories, loadProducts } from '../stores/productsSlice';

/** Loads products and categories once into Redux (uses cached API responses when available). */
export function useCatalog() {
  const dispatch = useDispatch();
  const catalog = useSelector((state) => state.products);

  useEffect(() => {
    if (catalog.status === 'idle') {
      dispatch(loadProducts());
    }

    if (catalog.categoryStatus === 'idle') {
      dispatch(loadCategories());
    }
  }, [catalog.categoryStatus, catalog.status, dispatch]);

  return catalog;
}
