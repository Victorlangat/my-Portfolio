import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer dark-section">
      <div className="container">
        <div className="footer-content">
          <div className="logo">Victor<span>James</span></div>
          <div className="social-links">
            <a href="https://github.com/Victorlangat" className="social-link" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com/in/victor-james-44b717249" className="social-link" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://twitter.com/yourusername" className="social-link" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
            <a href="/admin" className="social-link admin-link">
              Admin
            </a>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2023 Victor James Langat. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;