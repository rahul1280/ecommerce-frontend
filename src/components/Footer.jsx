
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              SwiftKart<span>.</span>
            </Link>

            <p className="footer-description">
              Discover quality products at great prices, all in one place. Enjoy
              a simple, convenient, and seamless shopping experience with
              SwiftKart.
            </p>

            {/* Social Media Icons */}
            <div className="footer-socials">
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle className="social-dot" cx="17.5" cy="6.5" r="1" />
                </svg>
              </a>

              <a
                href="https://github.com/rahul1280"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    className="social-fill"
                    d="M12 .9a11.1 11.1 0 0 0-3.51 21.63
                    c.56.1.76-.24.76-.54v-2.1
                    c-3.1.67-3.76-1.32-3.76-1.32
                    -.5-1.29-1.23-1.63-1.23-1.63
                    -1.01-.69.08-.68.08-.68
                    1.12.08 1.71 1.15 1.71 1.15
                    1 .1.76 2.08 3.2 1.46
                    .1-.72.39-1.21.7-1.49
                    -2.48-.28-5.08-1.24-5.08-5.51
                    0-1.22.44-2.21 1.15-2.99
                    -.12-.28-.5-1.42.11-2.95
                    0 0 .94-.3 3.05 1.14
                    a10.6 10.6 0 0 1 5.55 0
                    c2.11-1.44 3.05-1.14 3.05-1.14
                    .61 1.53.23 2.67.11 2.95
                    .72.78 1.15 1.77 1.15 2.99
                    0 4.28-2.6 5.23-5.09 5.5
                    .4.34.75 1.02.75 2.06v3.06
                    c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"
                  />
                </svg>
              </a>

              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    className="social-fill"
                    d="M5 8.5A1.8 1.8 0 1 0 5 5
                    a1.8 1.8 0 0 0 0 3.5M3.5 10h3v10h-3z
                    M9 10h2.9v1.4h.1a3.2 3.2 0 0 1 2.9-1.6
                    c3.1 0 3.6 2 3.6 4.6V20h-3v-5
                    c0-1.2 0-2.7-1.7-2.7s-2 1.3-2 2.6V20H9z"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="footer-column">
            <h3>Shop</h3>
            <ul>
              <li>
                <Link to="/products">All Products</Link>
              </li>
              <li>
                <Link to="/cart">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/orders">My Orders</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h3>Contact Us</h3>
            <ul className="footer-contact-list">
              <li>
                <span className="footer-contact-label">Email</span>
                <a href="mailto:rahulmangal836@gmail.com">
                  rahulmangal836@gmail.com
                </a>
              </li>
              <li>
                <span className="footer-contact-label">Phone</span>
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="footer-column">
            <h3>Customer Care</h3>
            <p className="footer-note">
              We're here to make your shopping experience simple, convenient,
              and enjoyable.
            </p>
            <Link to="/products" className="footer-shop-link">
              Start Shopping →
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} SwiftKart. All rights reserved.</p>
          <p className="footer-tagline">Your shopping journey starts here.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
