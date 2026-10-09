import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div>
        <strong className="footer-logo">SwiftKart</strong>
        <p>Your one-stop destination for quality products, great deals, and a seamless shopping experience.</p>
      </div>
      <div className="footer-links">
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">My orders</Link>
      </div>
    </div>
    <div className="container footer-bottom">© 2026 SwiftKart. All rights reserved. | Privacy Policy | Terms & Conditions</div>
  </footer>
);

export default Footer;
