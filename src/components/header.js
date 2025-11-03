import React, { useState, useEffect } from 'react';
import './header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="nav">
          <a href="#home" className="logo">
            Your<span>Name</span>
          </a>
          
          <div 
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#home" onClick={closeMenu}>Home</a></li>
            <li><a href="#about" onClick={closeMenu}>About</a></li>
            <li><a href="#work" onClick={closeMenu}>Work</a></li>
            <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;