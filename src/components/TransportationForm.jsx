import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlane, FaCalendarAlt, FaClock, FaUsers, FaBus, FaCheckCircle, FaEnvelope } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

const TransportationForm = () => {
  // Load saved data from localStorage on mount
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('transportationFormData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Convert date strings back to Date objects
      return {
        ...parsed,
        arrivalTime: parsed.arrivalTime ? new Date(parsed.arrivalTime) : null,
        bnaArrivalTime: parsed.bnaArrivalTime ? new Date(parsed.bnaArrivalTime) : null,
        departureTime: parsed.departureTime ? new Date(parsed.departureTime) : null,
        hotelDepartureTime: parsed.hotelDepartureTime ? new Date(parsed.hotelDepartureTime) : null
      };
    }
    return {
      name: '',
      email: '',
      groupSize: '',
      arrivalTransportation: '',
      bnaArrivalTime: null,
      arrivalTime: null,
      departureTransportation: '',
      hotelDepartureTime: null,
      departureTime: null,
      additionalNotes: ''
    };
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('transportationFormData', JSON.stringify(formData));
  }, [formData]);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.groupSize) {
      newErrors.groupSize = 'Please enter your group size';
    } else if (isNaN(formData.groupSize) || parseInt(formData.groupSize) < 1) {
      newErrors.groupSize = 'Please enter a valid group size';
    }

    if (!formData.arrivalTransportation) {
      newErrors.arrivalTransportation = 'Please select if you need arrival transportation';
    }

    if (formData.arrivalTransportation === 'yes' && !formData.bnaArrivalTime) {
      newErrors.bnaArrivalTime = 'Please specify when the car will arrive at BNA';
    }

    if (formData.arrivalTransportation === 'no' && !formData.arrivalTime) {
      newErrors.arrivalTime = 'Please specify your arrival time at Alila';
    }

    if (!formData.departureTransportation) {
      newErrors.departureTransportation = 'Please select if you need departure transportation';
    }

    if (formData.departureTransportation === 'yes' && !formData.hotelDepartureTime) {
      newErrors.hotelDepartureTime = 'Please specify when you plan to leave the hotel';
    }

    if (formData.departureTransportation === 'no' && !formData.departureTime) {
      newErrors.departureTime = 'Please specify your departure time from Alila';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Replace this URL with your Google Apps Script Web App URL
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw5UBs1krBoKn4toa6Ym3SMGdn7yRx-jM27zocNF1QfFLhlagY7tcyxnedoVJrmgm_x4w/exec';
      
      const submissionData = {
        timestamp: new Date().toISOString(),
        name: formData.name,
        email: formData.email,
        groupSize: formData.groupSize,
        arrivalTransportation: formData.arrivalTransportation,
        bnaArrivalTime: formData.arrivalTransportation === 'yes' ? formatTime(formData.bnaArrivalTime) : 'N/A',
        arrivalTime: formData.arrivalTransportation === 'no' ? formatTime(formData.arrivalTime) : 'N/A',
        departureTransportation: formData.departureTransportation,
        hotelDepartureTime: formData.departureTransportation === 'yes' ? formatTime(formData.hotelDepartureTime) : 'N/A',
        departureTime: formData.departureTransportation === 'no' ? formatTime(formData.departureTime) : 'N/A',
        additionalNotes: formData.additionalNotes || 'None'
      };

      console.log('Submitting data:', submissionData);

      // Create a form element to submit via redirect method (works with Google Apps Script)
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = GOOGLE_SCRIPT_URL;
      form.target = 'hidden_iframe';
      
      // Add hidden input for each field
      Object.keys(submissionData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = submissionData[key];
        form.appendChild(input);
        console.log(`Field: ${key} = ${submissionData[key]}`);
      });
      
      // Create hidden iframe if it doesn't exist
      let iframe = document.querySelector('iframe[name="hidden_iframe"]');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.name = 'hidden_iframe';
        iframe.style.display = 'none';
        
        // Add load event listener to iframe to detect submission
        iframe.onload = function() {
          console.log('Form submitted successfully to Google Apps Script');
        };
        
        document.body.appendChild(iframe);
      }
      
      console.log('Submitting form to:', GOOGLE_SCRIPT_URL);
      
      // Append form and submit
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
      // Show confirmation after a brief delay
      setTimeout(() => {
        setShowConfirmation(true);
        // Clear localStorage after successful submission
        localStorage.removeItem('transportationFormData');
      }, 500);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        groupSize: '',
        arrivalTransportation: '',
        bnaArrivalTime: null,
        arrivalTime: null,
        departureTransportation: '',
        hotelDepartureTime: null,
        departureTime: null,
        additionalNotes: ''
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your information. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    return (
      <motion.div 
        className="success-message"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <FaCheckCircle style={{ fontSize: '4rem', color: 'var(--champagne)', marginBottom: '1rem' }} />
        </motion.div>
        <h2>Thank You!</h2>
        <p>Your transportation information has been submitted successfully. We'll be in touch if we need any additional details.</p>
        <button 
          className="submit-btn" 
          onClick={() => setShowConfirmation(false)}
          style={{ maxWidth: '300px', margin: '32px auto 0' }}
        >
          Submit Another Response
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="info-box"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h3>Attire Recommendations</h3>
        <p>
        We recommend ladies bring 2-3 light-colored long dresses, and gentlemen bring 2-3 suits.
        </p>
      </motion.div>

      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <label className="form-label form-label-required" htmlFor="name">
          <span style={{ marginRight: '8px', color: 'var(--champagne)' }}>👤</span>
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-input"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </motion.div>

      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.225, duration: 0.3 }}
      >
        <label className="form-label form-label-required" htmlFor="email">
          <FaEnvelope style={{ marginRight: '8px', color: 'var(--champagne)' }} />
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-input"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </motion.div>

      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
      >
        <label className="form-label form-label-required" htmlFor="groupSize">
          <FaUsers style={{ marginRight: '8px', color: 'var(--champagne)' }} />
          Party size (including yourself)
        </label>
        <input
          type="number"
          id="groupSize"
          name="groupSize"
          className="form-input"
          value={formData.groupSize}
          onChange={handleChange}
          placeholder="Enter number of people"
          min="1"
        />
        {errors.groupSize && <span className="form-error">{errors.groupSize}</span>}
      </motion.div>

      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <label className="form-label form-label-required">
          <FaBus style={{ marginRight: '8px', color: 'var(--champagne)' }} />
          Do you need transportation from airport to hotel on June 13th?
        </label>
        <div className="radio-group">
          <div className="radio-option">
            <input
              type="radio"
              id="arrival-yes"
              name="arrivalTransportation"
              value="yes"
              checked={formData.arrivalTransportation === 'yes'}
              onChange={handleChange}
            />
            <label htmlFor="arrival-yes">Yes, I need transportation</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="arrival-no"
              name="arrivalTransportation"
              value="no"
              checked={formData.arrivalTransportation === 'no'}
              onChange={handleChange}
            />
            <label htmlFor="arrival-no">No, I'll arrange my own</label>
          </div>
        </div>
        {errors.arrivalTransportation && (
          <span className="form-error">{errors.arrivalTransportation}</span>
        )}
      </motion.div>

      <AnimatePresence>
        {formData.arrivalTransportation === 'yes' && (
          <motion.div 
            className="conditional-field"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '32px' }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label form-label-required" htmlFor="bnaArrivalTime">
                <FaClock style={{ marginRight: '8px', color: 'var(--champagne)' }} />
                When do you expect the car to arrive in BNA?
              </label>
              <DatePicker
                id="bnaArrivalTime"
                selected={formData.bnaArrivalTime}
                onChange={(date) => {
                  setFormData(prev => ({ ...prev, bnaArrivalTime: date }));
                  if (errors.bnaArrivalTime) {
                    setErrors(prev => ({ ...prev, bnaArrivalTime: null }));
                  }
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                placeholderText="Select BNA arrival time"
                className="form-input"
              />
              {errors.bnaArrivalTime && (
                <span className="form-error">{errors.bnaArrivalTime}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {formData.arrivalTransportation === 'no' && (
          <motion.div 
            className="conditional-field"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '32px' }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label form-label-required" htmlFor="arrivalTime">
                <FaClock style={{ marginRight: '8px', color: 'var(--champagne)' }} />
                Around what time will you arrive at Alila on June 13th?
              </label>
              <DatePicker
                id="arrivalTime"
                selected={formData.arrivalTime}
                onChange={(date) => {
                  setFormData(prev => ({ ...prev, arrivalTime: date }));
                  if (errors.arrivalTime) {
                    setErrors(prev => ({ ...prev, arrivalTime: null }));
                  }
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                placeholderText="Select arrival time at Alila"
                className="form-input"
              />
              {errors.arrivalTime && (
                <span className="form-error">{errors.arrivalTime}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
      >
        <label className="form-label form-label-required">
          <FaBus style={{ marginRight: '8px', color: 'var(--champagne)' }} />
          Do you need transportation from hotel to airport on June 15th?
        </label>
        <div className="radio-group">
          <div className="radio-option">
            <input
              type="radio"
              id="departure-yes"
              name="departureTransportation"
              value="yes"
              checked={formData.departureTransportation === 'yes'}
              onChange={handleChange}
            />
            <label htmlFor="departure-yes">Yes, I need transportation</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="departure-no"
              name="departureTransportation"
              value="no"
              checked={formData.departureTransportation === 'no'}
              onChange={handleChange}
            />
            <label htmlFor="departure-no">No, I'll arrange my own</label>
          </div>
        </div>
        {errors.departureTransportation && (
          <span className="form-error">{errors.departureTransportation}</span>
        )}
      </motion.div>

      <AnimatePresence>
        {formData.departureTransportation === 'yes' && (
          <motion.div 
            className="conditional-field"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '32px' }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label form-label-required" htmlFor="hotelDepartureTime">
                <FaClock style={{ marginRight: '8px', color: 'var(--champagne)' }} />
                When do you plan to leave from the hotel to the airport?
              </label>
              <DatePicker
                id="hotelDepartureTime"
                selected={formData.hotelDepartureTime}
                onChange={(date) => {
                  setFormData(prev => ({ ...prev, hotelDepartureTime: date }));
                  if (errors.hotelDepartureTime) {
                    setErrors(prev => ({ ...prev, hotelDepartureTime: null }));
                  }
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                placeholderText="Select hotel departure time"
                className="form-input"
              />
              {errors.hotelDepartureTime && (
                <span className="form-error">{errors.hotelDepartureTime}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {formData.departureTransportation === 'no' && (
          <motion.div 
            className="conditional-field"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '32px' }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label form-label-required" htmlFor="departureTime">
                <FaClock style={{ marginRight: '8px', color: 'var(--champagne)' }} />
                Around what time will you leave Alila on June 15th?
              </label>
              <DatePicker
                id="departureTime"
                selected={formData.departureTime}
                onChange={(date) => {
                  setFormData(prev => ({ ...prev, departureTime: date }));
                  if (errors.departureTime) {
                    setErrors(prev => ({ ...prev, departureTime: null }));
                  }
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                placeholderText="Select Alila departure time"
                className="form-input"
              />
              {errors.departureTime && (
                <span className="form-error">{errors.departureTime}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <label className="form-label" htmlFor="additionalNotes">
        Anything else we should know?
        </label>
        <textarea
          id="additionalNotes"
          name="additionalNotes"
          className="form-textarea"
          value={formData.additionalNotes}
          onChange={handleChange}
          placeholder="Accommodations, preferences, etc."
        />
      </motion.div>

      <motion.button 
        type="submit" 
        className="submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Information'}
      </motion.button>
    </motion.form>
  );
};

export default TransportationForm;
