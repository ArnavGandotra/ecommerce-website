import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { currency } from '../utils/checkout';

const getProductId = (product) => String(product.external_id ?? product.id);

function ProductCard({ product, hideCategory = false }) {
  const id = getProductId(product);

  return (
    <article className={`product-card${hideCategory ? ' product-card--catalog' : ''}`}>
      <Link className="product-link" to={`/product/${id}`} state={{ category: product.category }}>
        <div className="product-image">
          <img src={product.image_url} alt={product.title} loading="lazy" />
        </div>
        <div className="product-body">
          <div className={`product-meta${hideCategory ? ' product-meta--rating-only' : ''}`}>
            {!hideCategory ? <span className="product-category">{product.category}</span> : null}
            <span className="rating">
              <Star size={15} fill="currentColor" />
              {product.rating_rate ?? 'New'}
            </span>
          </div>
          <h3>{product.title}</h3>
          <span className="product-card-price">{currency.format(product.price)}</span>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
