import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="hero">
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-pattern"></div>
      </div>

      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Find Your Dream Property in Dubai
              <span className="hero-highlight"> Without the Pressure</span>
            </h1>
            <p className="hero-subtitle">
              Tell our AI assistant your property requirements and let our experts
              find the perfect match. No endless calls, no pressure tactics - just
              personalized property matching on your schedule.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-lg">
                Find My Property
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="btn btn-secondary btn-lg">
                How It Works
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">Zero</span>
                <span className="stat-label">Pressure Tactics</span>
              </div>
              <div className="stat">
                <span className="stat-number">One</span>
                <span className="stat-label">Dedicated Expert</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">AI Assistant</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-container">
              <div className="hero-image">
                <div className="floating-card card-1">
                  <div className="card-icon">🏠</div>
                  <div className="card-text">No Pressure</div>
                </div>
                <div className="floating-card card-2">
                  <div className="card-icon">🎯</div>
                  <div className="card-text">Perfect Match</div>
                </div>
                <div className="floating-card card-3">
                  <div className="card-icon">💬</div>
                  <div className="card-text">24/7 Support</div>
                </div>
                <div className="hero-main-visual">
                  <svg viewBox="0 0 400 400" className="hero-svg">
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#667eea" />
                        <stop offset="100%" stopColor="#764ba2" />
                      </linearGradient>
                    </defs>
                    <circle cx="200" cy="200" r="150" fill="url(#gradient1)" opacity="0.1"/>
                    <circle cx="200" cy="200" r="120" fill="url(#gradient1)" opacity="0.2"/>
                    <circle cx="200" cy="200" r="90" fill="url(#gradient1)" opacity="0.3"/>
                    <text x="200" y="210" textAnchor="middle" fontSize="80" fill="white">🏢</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;