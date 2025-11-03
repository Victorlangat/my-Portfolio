import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="logo">Your<span>Name</span></div>
          <div className="social-links">
            <a href="https://github.com/yourusername" className="social-link" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com/in/yourusername" className="social-link" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://twitter.com/yourusername" className="social-link" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
            <a href="https://dribbble.com/yourusername" className="social-link" target="_blank" rel="noopener noreferrer">
              Dribbble
            </a>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2023 Your Name. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;