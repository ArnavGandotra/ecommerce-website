import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CatalogNavBar from '../components/CatalogNavBar';
import QuantitySelector from '../components/QuantitySelector';
import { useCartTotals } from '../hooks/useCartTotals';
import { useCatalog } from '../hooks/useCatalog';
import { removeItem, setQuantity } from '../stores/cartSlice';
import { currency } from '../utils/checkout';

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useCatalog();
  const { cartItems, subtotal, shipping, total } = useCartTotals();
  const [query, setQuery] = useState('');

  const goToShop = (nextQuery, nextCategory) => {
    navigate('/', { state: { query: nextQuery, category: nextCategory } });
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

      <section className="cart-page">
      <div className="section-heading cart-page-heading">
        <h2>Cart</h2>
      </div>

      {!cartItems.length ? (
        <div className="cart-empty-state">
          <p className="cart-empty-message">Your cart is empty</p>
          <Link className="checkout-button compact-button" to="/">
            Go shopping
          </Link>
        </div>
      ) : (
        <div className="checkout-grid">
          <div className="cart-list">
            {cartItems.map(({ product, quantity }) => {
              const id = String(product.external_id ?? product.id);

              return (
                <article className="cart-row" key={id}>
                  <img src={product.image_url} alt="" />
                  <div>
                    <h3>{product.title}</h3>
                    <p>{currency.format(product.price)} each</p>
                  </div>
                  <QuantitySelector
                    value={quantity}
                    min={1}
                    max={10}
                    onChange={(nextQuantity) => dispatch(setQuantity({ id, quantity: nextQuantity }))}
                    label=""
                  />
                  <strong>{currency.format(product.price * quantity)}</strong>
                  <button className="icon-button" onClick={() => dispatch(removeItem(id))} aria-label={`Remove ${product.title}`}>
                    <Trash2 size={17} />
                  </button>
                </article>
              );
            })}
          </div>

          <aside className="checkout-panel order-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Total</p>
                <h2>Cart summary</h2>
              </div>
            </div>
            <div className="totals">
              <div>
                <span>Subtotal</span>
                <strong>{currency.format(subtotal)}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>{shipping ? currency.format(shipping) : 'Free'}</strong>
              </div>
              <div className="grand-total">
                <span>Grand total</span>
                <strong>{currency.format(total)}</strong>
              </div>
            </div>
            <Link className="checkout-button" to="/checkout">
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
    </>
  );
}

export default CartPage;
