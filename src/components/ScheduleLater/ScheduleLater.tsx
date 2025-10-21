import React, { useState } from 'react';
import { X, Phone, Mail, Clock, Calendar, Check } from 'lucide-react';
import './ScheduleLater.css';

interface ScheduleLaterProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (data: {
    phone_number: string;
    preferred_time: string;
    contact_method: string;
  }) => void;
  progress: {
    percentage_complete: number;
    time_elapsed: number;
    estimated_remaining: number;
  };
}

const ScheduleLater: React.FC<ScheduleLaterProps> = ({
  isOpen,
  onClose,
  onSchedule,
  progress
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+971');
  const [preferredTime, setPreferredTime] = useState('');
  const [contactMethod, setContactMethod] = useState('whatsapp');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber || !preferredTime) return;

    setIsSubmitting(true);

    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    await onSchedule({
      phone_number: fullPhoneNumber,
      preferred_time: preferredTime,
      contact_method: contactMethod
    });

    setIsSubmitting(false);
    setShowSuccess(true);

    setTimeout(() => {
      onClose();
      setShowSuccess(false);
      // Reset form
      setPhoneNumber('');
      setPreferredTime('');
      setEmail('');
    }, 2000);
  };

  return (
    <>
      <div className="schedule-overlay" onClick={onClose} />
      <div className="schedule-modal">
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {showSuccess ? (
          <div className="success-message">
            <div className="success-icon">
              <Check size={48} />
            </div>
            <h2>Perfect! We'll reach out soon</h2>
            <p>Your progress has been saved and we'll continue the conversation at your convenience.</p>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <Calendar className="header-icon" />
              <h2>Schedule for Later</h2>
              <p>No worries! This usually takes 8-10 minutes when you're ready.</p>
            </div>

            <div className="progress-info">
              <div className="progress-stat">
                <span className="stat-label">Progress Saved</span>
                <span className="stat-value">{progress.percentage_complete}%</span>
              </div>
              <div className="progress-stat">
                <span className="stat-label">Time Remaining</span>
                <span className="stat-value">~{Math.round(progress.estimated_remaining)} min</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="schedule-form">
              <div className="contact-method-selector">
                <label className="method-option">
                  <input
                    type="radio"
                    value="whatsapp"
                    checked={contactMethod === 'whatsapp'}
                    onChange={(e) => setContactMethod(e.target.value)}
                  />
                  <div className="method-content">
                    <Phone size={20} />
                    <div>
                      <span className="method-title">WhatsApp</span>
                      <span className="method-desc">Chat at your convenience</span>
                    </div>
                  </div>
                </label>

                <label className="method-option">
                  <input
                    type="radio"
                    value="email"
                    checked={contactMethod === 'email'}
                    onChange={(e) => setContactMethod(e.target.value)}
                  />
                  <div className="method-content">
                    <Mail size={20} />
                    <div>
                      <span className="method-title">Email</span>
                      <span className="method-desc">Get a link to continue</span>
                    </div>
                  </div>
                </label>
              </div>

              {contactMethod === 'whatsapp' ? (
                <div className="form-group">
                  <label>WhatsApp Number</label>
                  <div className="phone-input-group">
                    <select
                      className="country-code"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+92">🇵🇰 +92</option>
                      <option value="+20">🇪🇬 +20</option>
                    </select>
                    <input
                      type="tel"
                      className="phone-input"
                      placeholder="50 123 4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="email-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>
                  <Clock size={16} />
                  <span>When's the best time to reach you?</span>
                </label>
                <div className="time-options">
                  <label className="time-option">
                    <input
                      type="radio"
                      name="time"
                      value="morning"
                      checked={preferredTime === 'morning'}
                      onChange={(e) => setPreferredTime(e.target.value)}
                    />
                    <span>Morning</span>
                    <small>9 AM - 12 PM</small>
                  </label>
                  <label className="time-option">
                    <input
                      type="radio"
                      name="time"
                      value="afternoon"
                      checked={preferredTime === 'afternoon'}
                      onChange={(e) => setPreferredTime(e.target.value)}
                    />
                    <span>Afternoon</span>
                    <small>12 PM - 5 PM</small>
                  </label>
                  <label className="time-option">
                    <input
                      type="radio"
                      name="time"
                      value="evening"
                      checked={preferredTime === 'evening'}
                      onChange={(e) => setPreferredTime(e.target.value)}
                    />
                    <span>Evening</span>
                    <small>5 PM - 9 PM</small>
                  </label>
                  <label className="time-option">
                    <input
                      type="radio"
                      name="time"
                      value="anytime"
                      checked={preferredTime === 'anytime'}
                      onChange={(e) => setPreferredTime(e.target.value)}
                    />
                    <span>Anytime</span>
                    <small>Flexible</small>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="schedule-btn"
                  disabled={isSubmitting || !phoneNumber || !preferredTime}
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Chat'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default ScheduleLater;