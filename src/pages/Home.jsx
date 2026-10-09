import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { getProducts } from '../api/productApi';
import ProductGrid, { ProductSkeletons } from '../components/ProductGrid';
import ProductImage from '../components/ProductImage';
import Message from '../components/Message';
import { CATEGORIES, capitalize, formatPrice } from '../utils/helpers';

const categoryNotes = {
  electronics: 'Phones, audio and gadgets',
  clothing: 'Everyday wear and jackets',
  food: 'Snacks, tea and pantry items',
  books: 'Learn, study and read',
  other: 'Home and desk essentials',
};

const Home = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    // One request: the newest 20 products. Featured = newest 4, popular = best rated of the rest.
    getProducts({ sort: 'newest', limit: 20 })
      .then((response) => {
        if (!cancelled) setProducts(response.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const featured = products.slice(0, 4);
  const popular = products
    .slice(4)
    .sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0) || (b.ratings?.count || 0) - (a.ratings?.count || 0))
    .slice(0, 4);

  // The hero shows real products that have a picture (newest first). Without any, the hero is text only.
  const showcase = products.filter((product) => product.images && product.images[0]).slice(0, 3);
  const showVisual = loading || showcase.length > 0;

  const handleSearch = (event) => {
    event.preventDefault();
    const text = searchText.trim();
    navigate(text ? `/products?search=${encodeURIComponent(text)}` : '/products');
  };

  return (
    <>
      <section className="hero">
        <div className={showVisual ? 'container hero-inner hero-inner-split' : 'container hero-inner'}>
          <div className="hero-copy">
            <h1>
              Quality products, <span>simple shopping.</span>
            </h1>
            <p>Browse the full catalogue, build your cart and follow every order from placed to delivered.</p>

            <div className="hero-actions">
              <Link to="/products" className="btn btn-accent">
                Shop Now
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href="#categories" className="hero-link">
                Browse categories
              </a>
            </div>

            <form className="hero-search" onSubmit={handleSearch} role="search">
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search for headphones, books, tea..."
                aria-label="Search products"
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Search
              </button>
            </form>
          </div>

          {showVisual && (
            <div className="hero-visual" aria-label="Featured products">
              {loading
                ? [0, 1, 2].map((index) => <div key={index} className="hero-tile hero-tile-skeleton" aria-hidden="true"></div>)
                : showcase.map((product) => (
                    <Link key={product._id} to={`/products/${product._id}`} className="hero-tile">
                      <span className="hero-tile-image">
                        <ProductImage product={product} alt="" width={700} />
                      </span>
                      <span className="hero-tile-label">
                        <strong>{product.name}</strong>
                        <span>{formatPrice(product.price)}</span>
                      </span>
                    </Link>
                  ))}
            </div>
          )}
        </div>
      </section>

      <section className="container section" id="categories">
        <div className="section-header">
          <h2>Shop by category</h2>
        </div>
        <div className="category-grid">
          {CATEGORIES.map((category) => (
            <Link key={category} to={`/products?category=${category}`} className="category-tile">
              <strong>{capitalize(category)}</strong>
              <span>{categoryNotes[category]}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-header">
          <h2>Featured products</h2>
          <Link to="/products" className="section-link">
            See all products
          </Link>
        </div>

        {loading && <ProductSkeletons count={4} />}
        {error && <Message type="error">Unable to load products. {error}</Message>}
        {!loading && !error && featured.length === 0 && (
          <div className="empty-state">
            <h3>No products yet</h3>
            <p>Products added by an admin or moderator will appear here.</p>
          </div>
        )}
        {featured.length > 0 && <ProductGrid products={featured} />}
      </section>

      <section className="promo">
        <div className="container promo-inner">
          <div>
            <h2>Two ways to pay</h2>
            <p>
              Choose the demo card for an instantly paid order, or cash on delivery to pay later. Both are simulated, so
              nothing is ever charged.
            </p>
          </div>
          <Link to="/products" className="btn btn-accent">
            Start shopping
          </Link>
        </div>
      </section>

      {popular.length > 0 && (
        <section className="container section">
          <div className="section-header">
            <h2>Popular products</h2>
          </div>
          <ProductGrid products={popular} />
        </section>
      )}
    </>
  );
};

export default Home;
