/** Fake Store API integration with localStorage caching (assignment requirement). */
const FAKE_STORE_URL = 'https://fakestoreapi.com/products';
const CATEGORIES_URL = 'https://fakestoreapi.com/products/categories';
const PRODUCT_CACHE_KEY = 'ecommerce.products.cache';
const CATEGORY_CACHE_KEY = 'ecommerce.categories.cache';
const CACHE_TTL = 1000 * 60 * 30;

/** Read cached API data; entries expire after CACHE_TTL. */
const readCache = (key) => {
  try {
    const cached = JSON.parse(localStorage.getItem(key));

    if (!cached || Date.now() - cached.savedAt > CACHE_TTL) {
      return null;
    }

    return cached.value;
  } catch {
    return null;
  }
};

const writeCache = (key, value) => {
  localStorage.setItem(key, JSON.stringify({ value, savedAt: Date.now() }));
};

const normalizeFakeStoreProduct = (product) => ({
  external_id: product.id,
  title: product.title,
  price: product.price,
  description: product.description,
  category: product.category,
  image_url: product.image,
  rating_rate: product.rating?.rate ?? null,
  rating_count: product.rating?.count ?? null,
});

function productsFromCache(cached) {
  if (Array.isArray(cached) && cached.length) {
    return cached;
  }

  if (cached?.products?.length) {
    return cached.products;
  }

  return null;
}

export async function fetchProducts() {
  const cached = readCache(PRODUCT_CACHE_KEY);
  const cachedProducts = productsFromCache(cached);

  if (cachedProducts) {
    return cachedProducts;
  }

  const response = await fetch(FAKE_STORE_URL);

  if (!response.ok) {
    throw new Error('Could not load products right now.');
  }

  const data = await response.json();
  const products = data.map(normalizeFakeStoreProduct);

  writeCache(PRODUCT_CACHE_KEY, products);
  return products;
}

export async function fetchCategories() {
  const cached = readCache(CATEGORY_CACHE_KEY);

  if (cached?.length) {
    return cached;
  }

  const response = await fetch(CATEGORIES_URL);

  if (!response.ok) {
    throw new Error('Could not load categories right now.');
  }

  const categories = await response.json();
  writeCache(CATEGORY_CACHE_KEY, categories);
  return categories;
}
