import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CatalogNavBar from '../components/CatalogNavBar';
import { useCatalog } from '../hooks/useCatalog';
import { clearAuthError, loginUser } from '../stores/authSlice';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useCatalog();
  const { user, status, error } = useSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (user || status === 'succeeded') {
      navigate('/', { replace: true });
    }
  }, [user, status, navigate]);

  const goToShop = (nextQuery, nextCategory) => {
    navigate('/', { state: { query: nextQuery, category: nextCategory } });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  return (
    <div className="login-shell">
      <CatalogNavBar
        categories={categories}
        query={query}
        onQueryChange={setQuery}
        category={null}
        onCategoryChange={(value) => goToShop(query, value)}
      />

      <section className="login-page">
        <div className="login-card">
          <h1>Sign in</h1>
          <p className="login-subtitle">Use your Fake Store account credentials</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              Username
              <input
                type="text"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  dispatch(clearAuthError());
                }}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  dispatch(clearAuthError());
                }}
                required
              />
            </label>

            {error ? <p className="error-message">{error}</p> : null}

            <button type="submit" className="checkout-button" disabled={status === 'loading'}>
              {status === 'loading' ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
