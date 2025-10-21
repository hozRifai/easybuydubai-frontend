import React, { useState } from 'react';
import './Testimonials.css';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  content: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah A.',
    role: 'Looking For',
    avatar: '👩',
    rating: 5,
    content: 'I need a 2-bedroom apartment in Marina or JBR, budget around 1.5M AED. Looking for something modern with a good view. The AI assistant understood my needs perfectly!'
  },
  {
    id: 2,
    name: 'Mohammed K.',
    role: 'Investment Buyer',
    avatar: '👨',
    rating: 5,
    content: 'Searching for high-ROI properties in Business Bay or Downtown. Cash buyer ready to move fast. Love that I can share requirements without getting bombarded with calls.'
  },
  {
    id: 3,
    name: 'The Hassans',
    role: 'Family Needs',
    avatar: '👨‍👩‍👧',
    rating: 5,
    content: 'We need a 4-bedroom villa in Arabian Ranches or Dubai Hills, good schools nearby. Budget 3-4M. The chat format makes it easy to explain our family requirements.'
  },
  {
    id: 4,
    name: 'James W.',
    role: 'New to Dubai',
    avatar: '👨‍💼',
    rating: 5,
    content: 'Just arrived in Dubai, need a 1-bed in Downtown or DIFC near Metro. Budget 100-120k/year for rent. Great to get expert advice without the pressure!'
  },
  {
    id: 5,
    name: 'Aisha M.',
    role: 'Upgrading',
    avatar: '👩',
    rating: 5,
    content: 'Looking to upgrade from apartment to townhouse, preferably in Damac Hills or Dubai Sports City. The AI helps me clarify what I really want.'
  },
  {
    id: 6,
    name: 'Omar R.',
    role: 'Ready Buyer',
    avatar: '👨',
    rating: 5,
    content: 'Cash ready, want a penthouse in Marina or Palm Jumeirah. No time for endless viewings - need curated options only. This platform gets it!'
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= testimonials.length ? 0 : prevIndex + 3
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 3 < 0 ? Math.max(0, testimonials.length - 3) : prevIndex - 3
    );
  };

  return (
    <section id="testimonials" className="section testimonials">
      <div className="container">
        <div className="section-title">
          <h2>What Buyers Are Looking For</h2>
          <p>
            See how our AI assistant helps different types of buyers express their
            property requirements clearly and efficiently
          </p>
        </div>

        <div className="testimonials-container">
          <button className="testimonial-nav prev" onClick={prevTestimonial}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="testimonials-grid">
            {testimonials.slice(currentIndex, currentIndex + 3).map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-role">{testimonial.role}</p>
                  </div>
                </div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
              </div>
            ))}
          </div>

          <button className="testimonial-nav next" onClick={nextTestimonial}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="testimonials-indicators">
          {[0, 3].map((index) => (
            <button
              key={index}
              className={`indicator ${currentIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;