import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Check, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';
import ProductImage from './ProductImage';
import { capitalize, formatPrice } from '../utils/helpers';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const outOfStock = product.stock < 1;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = async () => {
    // The cart belongs to a logged-in user, so send guests to the login page first
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setAdding(true);
    setFeedback({ type: '', text: '' });

    try {
      await addItem(product._id, 1);
      setFeedback({ type: 'success', text: 'Added to cart' });
    } catch (error) {
      setFeedback({ type: 'error', text: error.message });
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className={outOfStock ? 'product-card product-card-out' : 'product-card'}>
      {/* The product name below is the keyboard link, so the picture link is skipped by Tab */}
      <Link to={`/products/${product._id}`} className="product-card-image" tabIndex={-1}>
        <ProductImage product={product} alt={product.name} width={600} />
      </Link>

      <div className="product-card-body">
        <span className="product-category">{capitalize(product.category)}</span>
        <h3 className="product-name">
          <Link to={`/products/${product._id}`} title={product.name}>
            {product.name}
          </Link>
        </h3>

        <StarRating value={product.ratings?.average || 0} count={product.ratings?.count || 0} />

        <div className="product-meta">
          <span className="product-price">{formatPrice(product.price)}</span>
          {outOfStock && <span className="stock stock-out">Out of stock</span>}
          {lowStock && <span className="stock stock-low">Only {product.stock} left</span>}
          {!outOfStock && !lowStock && <span className="stock stock-in">In stock</span>}
        </div>

        <div className="product-actions">
          <button className="btn btn-primary btn-block" onClick={handleAddToCart} disabled={outOfStock || adding}>
            {outOfStock ? (
              'Out of stock'
            ) : adding ? (
              'Adding...'
            ) : (
              <>
                <ShoppingCart size={17} aria-hidden="true" />
                Add to cart
              </>
            )}
          </button>
          <Link to={`/products/${product._id}`} className="card-link">
            View details
          </Link>
        </div>

        {feedback.text && (
          <p
            className={feedback.type === 'error' ? 'card-feedback card-feedback-error' : 'card-feedback'}
            role={feedback.type === 'error' ? 'alert' : 'status'}
          >
            {feedback.type === 'success' && <Check size={15} aria-hidden="true" />}
            {feedback.text}
          </p>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
