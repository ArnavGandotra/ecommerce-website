import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CatalogNavBar from '../components/CatalogNavBar';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import { useCatalog } from '../hooks/useCatalog';

function formatCategoryHeading(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { categories, error, items, status } = useCatalog();
  const [query, setQuery] = useState(location.state?.query ?? '');
  const [category, setCategory] = useState(location.state?.category ?? null);
  const [sort, setSort] = useState('relevant');

  useEffect(() => {
    setQuery(location.state?.query ?? '');
    setCategory(location.state?.category ?? null);
  }, [location.key, location.state]);

  const showHero = !category && !query.trim();

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let filtered = items.filter((product) => {
      const matchesCategory = !category || product.category === category;
      const matchesQuery = !normalizedQuery || product.title.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });

    if (sort === 'price-low') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered = [...filtered].sort((a, b) => (b.rating_rate ?? 0) - (a.rating_rate ?? 0));
    }

    return filtered;
  }, [category, items, query, sort]);

  const resultsTitle = category
    ? formatCategoryHeading(category)
    : query.trim()
      ? `Results for "${query.trim()}"`
      : 'All products';

  return (
    <div className={showHero ? 'home-shell home-landing' : 'home-shell'}>
      <CatalogNavBar
        categories={categories}
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        onResetHome={() => {
          setCategory(null);
          setQuery('');
          navigate('/', { replace: true, state: null });
        }}
      />

      {showHero ? (
        <header className="hero hero-banner">
          <picture>
            <source media="(min-width: 1025px)" srcSet="/hero-home-desktop.png" />
            <img
              className="hero-image"
              src="/hero-home-desktop.png"
              alt="Discover what you love — shop electronics, fashion, and accessories"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </header>
      ) : null}

      <section className="catalog-page home-catalog" id="products">
        <div className={`section-heading${category ? ' section-heading--category' : ''}`}>
          <div>
            {category ? (
              <p className="catalog-results-meta">{visibleProducts.length} products</p>
            ) : (
              <>
                <h2>{resultsTitle}</h2>
                <span className="results-count">{visibleProducts.length} products</span>
              </>
            )}
          </div>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="sort-select-inline">
            <option value="relevant">Relevant</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {status === 'loading' && <ProductGridSkeleton />}

        {status === 'failed' && (
          <div className="empty-state">
            <h3>Products did not load</h3>
            <p>{error}</p>
          </div>
        )}

        {status === 'succeeded' && visibleProducts.length === 0 && (
          <div className="empty-state">
            <h3>No matching products</h3>
            <p>Try a different title or category.</p>
          </div>
        )}

        {status === 'succeeded' && visibleProducts.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.external_id ?? product.id}
                product={product}
                hideCategory={Boolean(category)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
