import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <div className="section-title about-title">
              <h2>About EasyBuy Dubai</h2>
              <p>Revolutionizing property buying in Dubai - no pressure, just results</p>
            </div>

            <div className="about-description">
              <p>
                EasyBuy Dubai was born from a simple frustration - the overwhelming and high-pressure
                experience of buying property in Dubai. We believe finding your dream home should be
                exciting, not stressful. That's why we created an AI-powered platform that puts you
                in control.
              </p>
              <p>
                Our innovative approach eliminates endless agent calls and pressure tactics. Instead,
                you have a conversation with our AI assistant at your own pace, share your requirements,
                and let our experts do the heavy lifting. We only connect you with properties that
                truly match your needs, saving you time and eliminating frustration.
              </p>
            </div>

            <div className="about-stats">
              <div className="about-stat">
                <span className="stat-value">24/7</span>
                <span className="stat-name">Available</span>
              </div>
              <div className="about-stat">
                <span className="stat-value">100%</span>
                <span className="stat-name">No Pressure</span>
              </div>
              <div className="about-stat">
                <span className="stat-value">1-on-1</span>
                <span className="stat-name">Expert Support</span>
              </div>
            </div>
          </div>

          <div className="about-visual">
            <div className="about-mission">
              <h3>Our Mission</h3>
              <p>
                To revolutionize property buying in Dubai by eliminating high-pressure sales tactics
                and connecting serious buyers with their ideal properties through intelligent technology
                and personalized service.
              </p>

              <div className="about-features">
                <div className="about-feature">
                  <span className="feature-icon">🎯</span>
                  <h4>Precision Matching</h4>
                  <p>Our AI analyzes your requirements to ensure perfect property matches</p>
                </div>
                <div className="about-feature">
                  <span className="feature-icon">🛡️</span>
                  <h4>Privacy First</h4>
                  <p>Your information is shared only with one dedicated expert</p>
                </div>
                <div className="about-feature">
                  <span className="feature-icon">⚡</span>
                  <h4>Quick Process</h4>
                  <p>From chat to property viewing in the shortest time possible</p>
                </div>
                <div className="about-feature">
                  <span className="feature-icon">🤝</span>
                  <h4>Transparent Dealings</h4>
                  <p>Honest advice and fair pricing with no hidden costs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about-values">
          <h3>Our Values</h3>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h4>Customer First</h4>
              <p>Every decision we make starts with our customers' needs</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🚀</div>
              <h4>Innovation</h4>
              <p>Continuously improving with the latest technology</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h4>Trust</h4>
              <p>Building lasting relationships through transparency</p>
            </div>
            <div className="value-card">
              <div className="value-icon">✨</div>
              <h4>Excellence</h4>
              <p>Striving for the highest quality in everything we do</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;