import React, { useState } from 'react';
import './Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-title">
          <h2>Get In Touch</h2>
          <p>
            Have questions or need assistance? We're here to help you with your shopping journey
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h3>Let's Connect</h3>
            <p>
              Whether you have a question about our services, pricing, or anything else,
              our team is ready to answer all your questions.
            </p>

            <div className="contact-items">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4>Visit Us</h4>
                  <p>Dubai Marina, Dubai, UAE</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <h4>Email Us</h4>
                  <p>support@easybuydubai.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Call Us</h4>
                  <p>+971 50 123 4567</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">⏰</div>
                <div>
                  <h4>Working Hours</h4>
                  <p>24/7 Support Available</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <a href="#" className="social-link">
                <span>f</span>
              </a>
              <a href="#" className="social-link">
                <span>t</span>
              </a>
              <a href="#" className="social-link">
                <span>in</span>
              </a>
              <a href="#" className="social-link">
                <span>ig</span>
              </a>
            </div>
          </div>

          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                Send Message
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;