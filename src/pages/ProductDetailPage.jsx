import React, { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DetailPurchaseActions from '../components/DetailPurchaseActions';
import ProductCard from '../components/ProductCard';
import ProductImageZoom from '../components/ProductImageZoom';
import { useCatalog } from '../hooks/useCatalog';
import { addItem } from '../stores/cartSlice';
import { currency } from '../utils/checkout';

function BackLink({ category }) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnCategory = category ?? location.state?.category;

  const handleBack = () => {
    if (returnCategory) {
      navigate('/', { state: { category: returnCategory, query: '' } });
      return;
    }
    navigate('/');
  };

  return (
    <button type="button" className="back-link" onClick={handleBack}>
      Back
    </button>
  );
}

function formatCategoryLabel(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items, status } = useCatalog();
  const [quantity, setQuantity] = useState(1);
  const product = useMemo(() => items.find((item) => String(item.external_id ?? item.id) === id), [id, items]);
  const productId = String(product?.external_id ?? product?.id ?? id);

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }
    return items
      .filter((item) => item.category === product.category && String(item.external_id ?? item.id) !== productId)
      .slice(0, 4);
  }, [items, product, productId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQuantity(1);
  }, [id]);

  const handleAdd = () => {
    if (!product) {
      return;
    }
    dispatch(addItem({ product, quantity, max: 5 }));
  };

  const purchaseProps = {
    productId,
    product,
    quantity,
    onQuantityChange: setQuantity,
    onAdd: handleAdd,
  };

  if (status === 'idle' || status === 'loading') {
    return (
      <section className="detail-page">
        <div className="detail-page-inner">
        <div className="empty-state">
          <h3>Loading product</h3>
          <p>Getting the product details ready.</p>
        </div>
        </div>
      </section>
    );
  }

  if (status === 'failed') {
    return (
      <section className="detail-page">
        <div className="detail-page-inner">
          <div className="empty-state">
            <h3>Product could not load</h3>
            <p>Please return to the shop and try again.</p>
            <BackLink />
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="detail-page">
        <div className="detail-page-inner">
          <div className="empty-state">
            <h3>Product not found</h3>
            <p>This product is not available right now.</p>
            <BackLink />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="detail-page">
      <div className="detail-page-inner">
        <BackLink category={product.category} />

        <article className="detail-layout">
        <div className="detail-gallery">
          <ProductImageZoom src={product.image_url} alt={product.title} />
        </div>

        <div className="detail-main">
          <div className="detail-buybox">
            <h1 className="detail-title">{product.title}</h1>
            <div className="detail-rating">
              <Star size={18} fill="currentColor" />
              <span>{product.rating_rate ?? 'New'}</span>
              {product.rating_count ? <span>({product.rating_count} reviews)</span> : null}
            </div>
            <strong className="detail-price">{currency.format(product.price)}</strong>
            <div className="detail-actions">
              <DetailPurchaseActions {...purchaseProps} />
            </div>
          </div>

          <p className="detail-description">{product.description}</p>
        </div>
      </article>

        {relatedProducts.length > 0 ? (
          <section className="detail-related">
            <h2>More in {formatCategoryLabel(product.category)}</h2>
            <div className="detail-related-grid">
              {relatedProducts.map((item) => (
                <ProductCard key={item.external_id ?? item.id} product={item} hideCategory />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}

export default ProductDetailPage;
