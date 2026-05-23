import React from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CATEGORY_ORDER = ["women's clothing", "men's clothing", 'jewelery', 'electronics'];

const FALLBACK_CATEGORIES = CATEGORY_ORDER;

function formatCategoryLabel(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function sortCategories(categories) {
  return [...categories].sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);

    if (indexA === -1 && indexB === -1) {
      return a.localeCompare(b);
    }

    if (indexA === -1) {
      return 1;
    }

    if (indexB === -1) {
      return -1;
    }

    return indexA - indexB;
  });
}

/** Site header + catalog filters (search, categories, cart). Used on home and cart. */
function CatalogNavBar({ categories, query, onQueryChange, category, onCategoryChange, onResetHome }) {
  const cartCount = useSelector((state) =>
    Object.values(state.cart).reduce((total, item) => total + item.quantity, 0),
  );
  const user = useSelector((state) => state.auth.user);
  const profilePath = user ? '/profile' : '/login';

  const categoryOptions = sortCategories(categories?.length ? categories : FALLBACK_CATEGORIES);

  return (
    <nav className="catalog-navbar" aria-label="Site navigation">
      <Link
        className="navbar-brand"
        to="/"
        onClick={() => {
          onResetHome?.();
        }}
      >
        YourStore
      </Link>

      <div className="navbar-categories">
        {categoryOptions.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-btn ${category === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {formatCategoryLabel(cat)}
          </button>
        ))}
      </div>

      <div className="navbar-search">
        <Search size={18} aria-hidden />
        <input
          type="search"
          placeholder="Search products by title..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>

      <div className="navbar-end">
        <Link
          to={profilePath}
          className="navbar-profile"
          aria-label={user ? 'Profile' : 'Sign in'}
        >
          <User size={22} />
        </Link>

        <Link to="/cart" className="navbar-cart" aria-label={`Cart, ${cartCount} items`}>
          <ShoppingCart size={22} />
          {cartCount > 0 ? <span className="cart-count">{cartCount}</span> : null}
        </Link>
      </div>
    </nav>
  );
}

export default CatalogNavBar;
