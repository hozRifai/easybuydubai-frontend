import React from 'react';
import './Services.css';

interface ServiceCard {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

const services: ServiceCard[] = [
  {
    icon: '💬',
    title: 'Tell Us Your Requirements',
    description: 'Share your property preferences through our friendly AI chatbot - no forms, just conversation.',
    features: ['Property type & budget', 'Location preferences', 'Timeline & financing', 'Special requirements']
  },
  {
    icon: '🤖',
    title: 'AI Qualification',
    description: 'Our intelligent system analyzes your needs to ensure you get matched with the right properties.',
    features: ['Instant analysis', 'Lead scoring', 'Requirement validation', 'Priority classification']
  },
  {
    icon: '🔍',
    title: 'Expert Property Matching',
    description: 'Our property experts search our extensive database to find your perfect match.',
    features: ['Curated selection', 'Market insights', 'Hidden gems', 'Best value options']
  },
  {
    icon: '📞',
    title: 'Personalized Consultation',
    description: 'A dedicated expert reaches out with hand-picked properties that match your criteria.',
    features: ['One-on-one support', 'No spam calls', 'Expert guidance', 'Market advice']
  },
  {
    icon: '🏠',
    title: 'Property Viewings',
    description: 'Schedule viewings at your convenience - physical or virtual tours available.',
    features: ['Flexible scheduling', 'Virtual tours', 'Accompanied visits', 'Detailed walkthroughs']
  },
  {
    icon: '✅',
    title: 'Deal Closure Support',
    description: 'We guide you through the entire purchase process until you get your keys.',
    features: ['Documentation help', 'Negotiation support', 'Legal guidance', 'Post-purchase support']
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="section services">
      <div className="container">
        <div className="section-title">
          <h2>How It Works</h2>
          <p>
            Your journey to finding the perfect property in Dubai - simplified,
            pressure-free, and tailored to your needs.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="service-btn">Learn More →</button>
            </div>
          ))}
        </div>

        <div className="services-cta">
          <h3>Ready to Find Your Dream Property?</h3>
          <p>Start a conversation with our AI assistant and let us handle the rest. No pressure, no spam - just results.</p>
          <button className="btn btn-primary">Start Chat Now</button>
        </div>
      </div>
    </section>
  );
};

export default Services;