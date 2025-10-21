import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-brand">
          <h1>EasyBuy<span>Dubai</span></h1>
        </div>

        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {location.pathname === '/' ? (
            <>
              <a onClick={() => scrollToSection('hero')} className="nav-link">Home</a>
              <a onClick={() => scrollToSection('services')} className="nav-link">How It Works</a>
              <a onClick={() => scrollToSection('about')} className="nav-link">About</a>
              <a onClick={() => scrollToSection('contact')} className="nav-link">Contact</a>
            </>
          ) : (
            <Link to="/" className="nav-link">Home</Link>
          )}
          <Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>Chat</Link>
          <Link to="/chat" className="btn btn-primary nav-cta">Get Started</Link>
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;