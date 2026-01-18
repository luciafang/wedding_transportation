import React, { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { FaClock, FaUsers, FaBus, FaCheckCircle, FaEnvelope } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

const STORAGE_KEY = 'transportationFormData';

const defaultValues = {
  name: '',
  email: '',
  groupSize: undefined,
  arrivalTransportation: '',
  bnaArrivalTime: null,
  arrivalTime: null,
  departureTransportation: '',
  hotelDepartureTime: null,
  departureTime: null,
  additionalNotes: ''
};

const schema = z
  .object({
    name: z.string().trim().min(1, 'Please enter your name'),
    email: z.string().trim().min(1, 'Please enter your email').email('Please enter a valid email'),
    groupSize: z
      .number({ required_error: 'Please enter your group size', invalid_type_error: 'Please enter a valid group size' })
      .int('Please enter a valid group size')
      .min(1, 'Please enter a valid group size'),
    arrivalTransportation: z.enum(['yes', 'no'], {
      required_error: 'Please select if you need arrival transportation'
    }),
    bnaArrivalTime: z.date().nullable(),
    arrivalTime: z.date().nullable(),
    departureTransportation: z.enum(['yes', 'no'], {
      required_error: 'Please select if you need departure transportation'
    }),
    hotelDepartureTime: z.date().nullable(),
    departureTime: z.date().nullable(),
    additionalNotes: z.string().optional()
  })
  .superRefine((values, ctx) => {
    if (values.arrivalTransportation === 'yes' && !values.bnaArrivalTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['bnaArrivalTime'],
        message: 'Please specify when the car will arrive at BNA'
      });
    }

    if (values.arrivalTransportation === 'no' && !values.arrivalTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['arrivalTime'],
        message: 'Please specify your arrival time at Alila'
      });
    }

    if (values.departureTransportation === 'yes' && !values.hotelDepartureTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['hotelDepartureTime'],
        message: 'Please specify when you plan to leave the hotel'
      });
    }

    if (values.departureTransportation === 'no' && !values.departureTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['departureTime'],
        message: 'Please specify your departure time from Alila'
      });
    }
  });

const deserialize = (raw) => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const parsedGroupSize = parsed?.groupSize;
    const groupSize =
      typeof parsedGroupSize === 'number'
        ? (Number.isFinite(parsedGroupSize) ? parsedGroupSize : undefined)
        : typeof parsedGroupSize === 'string' && parsedGroupSize.trim() !== ''
          ? Number(parsedGroupSize)
          : undefined;
    return {
      ...defaultValues,
      ...parsed,
      groupSize: typeof groupSize === 'number' && Number.isFinite(groupSize) ? groupSize : undefined,
      bnaArrivalTime: parsed?.bnaArrivalTime ? new Date(parsed.bnaArrivalTime) : null,
      arrivalTime: parsed?.arrivalTime ? new Date(parsed.arrivalTime) : null,
      hotelDepartureTime: parsed?.hotelDepartureTime ? new Date(parsed.hotelDepartureTime) : null,
      departureTime: parsed?.departureTime ? new Date(parsed.departureTime) : null
    };
  } catch {
    return null;
  }
};

const serialize = (values) => ({
  ...values,
  groupSize: typeof values.groupSize === 'number' && Number.isFinite(values.groupSize) ? values.groupSize : null,
  bnaArrivalTime: values.bnaArrivalTime ? values.bnaArrivalTime.toISOString() : null,
  arrivalTime: values.arrivalTime ? values.arrivalTime.toISOString() : null,
  hotelDepartureTime: values.hotelDepartureTime ? values.hotelDepartureTime.toISOString() : null,
  departureTime: values.departureTime ? values.departureTime.toISOString() : null
});

const TransportationForm = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const initialValues = useMemo(() => {
    const saved = deserialize(localStorage.getItem(STORAGE_KEY));
    return saved ?? defaultValues;
  }, []);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(schema),
    mode: 'onSubmit'
  });

  const arrivalTransportation = watch('arrivalTransportation');
  const departureTransportation = watch('departureTransportation');
  const allValues = watch();

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize(allValues)));
  }, [allValues]);

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

  const onSubmit = async (values) => {
    try {
      // Replace this URL with your Google Apps Script Web App URL
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEO0-1Q1GUTFSc1VsQJQ3xKcvzEvNsJpC4mxnoxSvVDPbZ3tIyXWDU50ykTfdS3VzI5A/exec';
      
      const submissionData = {
        timestamp: new Date().toISOString(),
        name: values.name,
        email: values.email,
        groupSize: String(values.groupSize),
        arrivalTransportation: values.arrivalTransportation,
        bnaArrivalTime: values.arrivalTransportation === 'yes' ? formatTime(values.bnaArrivalTime) : 'N/A',
        arrivalTime: values.arrivalTransportation === 'no' ? formatTime(values.arrivalTime) : 'N/A',
        departureTransportation: values.departureTransportation,
        hotelDepartureTime: values.departureTransportation === 'yes' ? formatTime(values.hotelDepartureTime) : 'N/A',
        departureTime: values.departureTransportation === 'no' ? formatTime(values.departureTime) : 'N/A',
        additionalNotes: values.additionalNotes?.trim() ? values.additionalNotes.trim() : 'None'
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
        localStorage.removeItem(STORAGE_KEY);
      }, 500);
      
      // Reset form
      reset(defaultValues);

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your information. Please try again or contact us directly.');
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
      onSubmit={handleSubmit(onSubmit)}
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
          className="form-input"
          {...register('name', { onChange: () => clearErrors('name') })}
          placeholder="Enter your full name"
        />
        {errors.name && <span className="form-error">{errors.name.message}</span>}
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
          className="form-input"
          {...register('email', { onChange: () => clearErrors('email') })}
          placeholder="your.email@example.com"
        />
        {errors.email && <span className="form-error">{errors.email.message}</span>}
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
          className="form-input"
          placeholder="Enter number of people"
          min="1"
          {...register('groupSize', {
            valueAsNumber: true,
            onChange: () => clearErrors('groupSize')
          })}
        />
        {errors.groupSize && <span className="form-error">{errors.groupSize.message}</span>}
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
              value="yes"
              {...register('arrivalTransportation', {
                onChange: () => {
                  clearErrors('arrivalTransportation');
                  clearErrors(['bnaArrivalTime', 'arrivalTime']);
                }
              })}
            />
            <label htmlFor="arrival-yes">Yes, I need transportation</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="arrival-no"
              value="no"
              {...register('arrivalTransportation', {
                onChange: () => {
                  clearErrors('arrivalTransportation');
                  clearErrors(['bnaArrivalTime', 'arrivalTime']);
                }
              })}
            />
            <label htmlFor="arrival-no">No, I'll arrange my own</label>
          </div>
        </div>
        {errors.arrivalTransportation && (
          <span className="form-error">{errors.arrivalTransportation.message}</span>
        )}
      </motion.div>

      <AnimatePresence>
        {arrivalTransportation === 'yes' && (
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
              <Controller
                name="bnaArrivalTime"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="bnaArrivalTime"
                    selected={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      clearErrors('bnaArrivalTime');
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="Select BNA arrival time"
                    className="form-input"
                  />
                )}
              />
              {errors.bnaArrivalTime && <span className="form-error">{errors.bnaArrivalTime.message}</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {arrivalTransportation === 'no' && (
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
              <Controller
                name="arrivalTime"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="arrivalTime"
                    selected={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      clearErrors('arrivalTime');
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="Select arrival time at Alila"
                    className="form-input"
                  />
                )}
              />
              {errors.arrivalTime && <span className="form-error">{errors.arrivalTime.message}</span>}
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
              value="yes"
              {...register('departureTransportation', {
                onChange: () => {
                  clearErrors('departureTransportation');
                  clearErrors(['hotelDepartureTime', 'departureTime']);
                }
              })}
            />
            <label htmlFor="departure-yes">Yes, I need transportation</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="departure-no"
              value="no"
              {...register('departureTransportation', {
                onChange: () => {
                  clearErrors('departureTransportation');
                  clearErrors(['hotelDepartureTime', 'departureTime']);
                }
              })}
            />
            <label htmlFor="departure-no">No, I'll arrange my own</label>
          </div>
        </div>
        {errors.departureTransportation && (
          <span className="form-error">{errors.departureTransportation.message}</span>
        )}
      </motion.div>

      <AnimatePresence>
        {departureTransportation === 'yes' && (
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
              <Controller
                name="hotelDepartureTime"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="hotelDepartureTime"
                    selected={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      clearErrors('hotelDepartureTime');
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="Select hotel departure time"
                    className="form-input"
                  />
                )}
              />
              {errors.hotelDepartureTime && <span className="form-error">{errors.hotelDepartureTime.message}</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {departureTransportation === 'no' && (
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
              <Controller
                name="departureTime"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="departureTime"
                    selected={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      clearErrors('departureTime');
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="Select Alila departure time"
                    className="form-input"
                  />
                )}
              />
              {errors.departureTime && <span className="form-error">{errors.departureTime.message}</span>}
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
          className="form-textarea"
          {...register('additionalNotes')}
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
