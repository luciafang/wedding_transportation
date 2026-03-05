import React, { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
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

// ── SVG Icon Components ──────────────────────────────────────
const IconPerson = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6, verticalAlign: 'middle', flexShrink: 0 }}>
    <circle cx="8" cy="5" r="3" stroke="var(--green)" strokeWidth="1.4" />
    <path d="M2.5 14C2.5 11 4.5 9 8 9C11.5 9 13.5 11 13.5 14" stroke="var(--green)" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const IconEnvelope = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6, verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="1.5" y="3.5" width="13" height="9" rx="2" stroke="var(--teal)" strokeWidth="1.4" />
    <path d="M1.5 5L8 9.5L14.5 5" stroke="var(--teal)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconPeople = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6, verticalAlign: 'middle', flexShrink: 0 }}>
    <circle cx="6" cy="5" r="2.5" stroke="var(--green)" strokeWidth="1.3" />
    <path d="M1.5 13C1.5 10.5 3.2 9 6 9C8.8 9 10.5 10.5 10.5 13" stroke="var(--green)" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="11" cy="5.5" r="2" stroke="var(--teal)" strokeWidth="1.2" />
    <path d="M8.5 13C8.5 11 9.5 9.5 11 9.5C12.5 9.5 14 11 14 13" stroke="var(--teal)" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const IconShuttle = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6, verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="1" y="4" width="14" height="7" rx="2" stroke="var(--green)" strokeWidth="1.4" />
    <rect x="2.5" y="5.5" width="3" height="2.5" rx="0.5" fill="var(--teal-light)" />
    <rect x="6.5" y="5.5" width="3" height="2.5" rx="0.5" fill="var(--teal-light)" />
    <rect x="10.5" y="5.5" width="3" height="2.5" rx="0.5" fill="var(--teal-light)" />
    <circle cx="4.5" cy="12" r="1.2" fill="var(--green)" />
    <circle cx="11.5" cy="12" r="1.2" fill="var(--green)" />
    <line x1="1" y1="12" x2="15" y2="12" stroke="var(--green)" strokeWidth="0.8" />
  </svg>
);

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6, verticalAlign: 'middle', flexShrink: 0 }}>
    <circle cx="8" cy="8" r="6" stroke="var(--champagne)" strokeWidth="1.4" />
    <line x1="8" y1="4.5" x2="8" y2="8" stroke="var(--champagne)" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="8" y1="8" x2="11" y2="10" stroke="var(--champagne)" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="8" cy="8" r="0.8" fill="var(--champagne)" />
  </svg>
);

const IconNotes = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6, verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="2" y="1.5" width="12" height="13" rx="2" stroke="var(--teal)" strokeWidth="1.4" />
    <line x1="5" y1="5" x2="11" y2="5" stroke="var(--teal)" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="5" y1="8" x2="11" y2="8" stroke="var(--teal)" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="5" y1="11" x2="9" y2="11" stroke="var(--teal)" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const IconSuitcase = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6, verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="2" y="5" width="12" height="8" rx="2" stroke="var(--champagne)" strokeWidth="1.4" />
    <path d="M5.5 5V3.5C5.5 2.67 6.17 2 7 2H9C9.83 2 10.5 2.67 10.5 3.5V5" stroke="var(--champagne)" strokeWidth="1.4" />
    <line x1="2" y1="9" x2="14" y2="9" stroke="var(--champagne)" strokeWidth="1" opacity="0.5" />
  </svg>
);

const IconCheckCircle = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="var(--green)" />
    <path d="M13 20L18 25L27 15" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DecoLeaf = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="success-deco-leaf">
    <path d="M10 2C10 2 4 6 4 12C4 16 7 18 10 18C13 18 16 16 16 12C16 6 10 2 10 2Z" fill="var(--green)" opacity="0.3" />
    <path d="M10 5V16" stroke="var(--green)" strokeWidth="0.8" opacity="0.4" />
  </svg>
);

// ── Animation variants ────────────────────────────────────────
const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const conditionalVariants = {
  initial: { opacity: 0, height: 0, y: -8 },
  animate: {
    opacity: 1,
    height: 'auto',
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 28 }
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -8,
    transition: { duration: 0.25, ease: "easeIn" }
  }
};

// ── Celebration particles (green + teal + champagne) ──────────
const celebrationParticles = [
  { type: 'heart', left: '15%', top: '60%', size: 16, color: 'rgba(92,184,138,0.5)', duration: 2.5, delay: 0.2, travel: -120, drift: -25, rotation: 120 },
  { type: 'star', left: '30%', top: '50%', size: 13, color: 'rgba(91,190,181,0.4)', duration: 3, delay: 0.5, travel: -140, drift: 15, rotation: 200 },
  { type: 'sparkle-dot', left: '45%', top: '55%', size: 7, color: 'rgba(92,184,138,0.55)', duration: 2.8, delay: 0.1, travel: -100, drift: -10, rotation: 90 },
  { type: 'heart', left: '60%', top: '60%', size: 14, color: 'rgba(212,169,106,0.4)', duration: 3.2, delay: 0.7, travel: -130, drift: 30, rotation: 150 },
  { type: 'sparkle-dot', left: '75%', top: '50%', size: 5, color: 'rgba(91,190,181,0.5)', duration: 2.6, delay: 0.3, travel: -110, drift: -20, rotation: 180 },
  { type: 'star', left: '85%', top: '55%', size: 11, color: 'rgba(212,169,106,0.45)', duration: 2.9, delay: 0.6, travel: -105, drift: 18, rotation: 240 },
];

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
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const onSubmit = async (values) => {
    try {
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxK1ZOrGrcxJId7FOdEwmDEc8L-NxFcReg718FjIibkcvx2hpWLACnJjT9Ot_xug9KHCw/exec';

      const formDataToSend = new FormData();
      formDataToSend.append('name', values.name);
      formDataToSend.append('email', values.email);
      formDataToSend.append('group_size', String(values.groupSize));
      formDataToSend.append('arrival_transportation', values.arrivalTransportation);
      formDataToSend.append('bna_arrival_time', values.arrivalTransportation === 'yes' ? formatTime(values.bnaArrivalTime) : 'N/A');
      formDataToSend.append('arrival_time', values.arrivalTransportation === 'no' ? formatTime(values.arrivalTime) : 'N/A');
      formDataToSend.append('departure_transportation', values.departureTransportation);
      formDataToSend.append('hotel_departure_time', values.departureTransportation === 'yes' ? formatTime(values.hotelDepartureTime) : 'N/A');
      formDataToSend.append('departure_time', values.departureTransportation === 'no' ? formatTime(values.departureTime) : 'N/A');
      formDataToSend.append('additional_notes', values.additionalNotes?.trim() || 'None');

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formDataToSend,
        redirect: 'follow'
      });

      const result = await response.text();

      try {
        const jsonResult = JSON.parse(result);
        if (jsonResult.result === 'success') {
          setShowConfirmation(true);
          localStorage.removeItem(STORAGE_KEY);
          reset(defaultValues);
        } else if (jsonResult.result === 'error') {
          alert(jsonResult.message || 'Sorry, there was an error submitting your information. Please try again.');
        }
      } catch (parseError) {
        setShowConfirmation(true);
        localStorage.removeItem(STORAGE_KEY);
        reset(defaultValues);
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Sorry, there was an error submitting your information. Please try again or contact us directly.');
    }
  };

  // ── Success / Celebration State ─────────────────────────────
  if (showConfirmation) {
    return (
      <motion.div
        className="success-message"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="celebration-particles">
          {celebrationParticles.map((p, i) => (
            <div
              key={i}
              className={`celebration-particle ${p.type}`}
              style={{
                left: p.left,
                top: p.top,
                '--size': `${p.size}px`,
                '--color': p.color,
                '--duration': `${p.duration}s`,
                '--delay': `${p.delay}s`,
                '--travel': `${p.travel}px`,
                '--drift': `${p.drift}px`,
                '--rotation': `${p.rotation}deg`,
              }}
            />
          ))}
        </div>

        <motion.div
          className="success-icon-wrap"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 12 }}
        >
          <div className="success-icon-ring">
            <IconCheckCircle />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          You're All Set!
        </motion.h2>

        <motion.div
          className="success-deco"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          <span className="success-deco-line" />
          <DecoLeaf />
          <span className="success-deco-line" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Your transportation details have been received. We'll reach out if we need anything else!
        </motion.p>

        <motion.button
          className="submit-btn"
          onClick={() => setShowConfirmation(false)}
          style={{ maxWidth: '260px', margin: '20px auto 0' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          Submit Another Response
        </motion.button>
      </motion.div>
    );
  }

  // ── Main Form ───────────────────────────────────────────────
  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Tip badge */}
      <motion.div className="info-box" variants={itemVariants}>
        <p><IconSuitcase /> Pack light — think linen suits, maxi dresses &amp; breathable fabrics</p>
      </motion.div>

      {/* Full Name */}
      <motion.div className="form-group" variants={itemVariants}>
        <label className="form-label form-label-required" htmlFor="name">
          <IconPerson />
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

      {/* Email */}
      <motion.div className="form-group" variants={itemVariants}>
        <label className="form-label form-label-required" htmlFor="email">
          <IconEnvelope />
          Email
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

      {/* Group Size */}
      <motion.div className="form-group" variants={itemVariants}>
        <label className="form-label form-label-required" htmlFor="groupSize">
          <IconPeople />
          Party size
        </label>
        <input
          type="number"
          id="groupSize"
          className="form-input"
          placeholder="Including yourself"
          min="1"
          {...register('groupSize', {
            valueAsNumber: true,
            onChange: () => clearErrors('groupSize')
          })}
        />
        {errors.groupSize && <span className="form-error">{errors.groupSize.message}</span>}
      </motion.div>

      {/* Arrival Transportation */}
      <motion.div className="form-group" variants={itemVariants}>
        <label className="form-label form-label-required">
          <IconShuttle />
          Airport → hotel on June 13?
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
            <label htmlFor="arrival-yes">Yes please</label>
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
            <label htmlFor="arrival-no">No thanks</label>
          </div>
        </div>
        {errors.arrivalTransportation && (
          <span className="form-error">{errors.arrivalTransportation.message}</span>
        )}
      </motion.div>

      {/* Arrival — conditional fields */}
      <AnimatePresence>
        {arrivalTransportation === 'yes' && (
          <motion.div
            className="conditional-field"
            variants={conditionalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ marginBottom: '16px' }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label form-label-required" htmlFor="bnaArrivalTime">
                <IconClock />
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
            variants={conditionalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ marginBottom: '16px' }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label form-label-required" htmlFor="arrivalTime">
                <IconClock />
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

      {/* Departure Transportation */}
      <motion.div className="form-group" variants={itemVariants}>
        <label className="form-label form-label-required">
          <IconShuttle />
          Hotel → airport on June 15?
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
            <label htmlFor="departure-yes">Yes please</label>
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
            <label htmlFor="departure-no">No thanks</label>
          </div>
        </div>
        {errors.departureTransportation && (
          <span className="form-error">{errors.departureTransportation.message}</span>
        )}
      </motion.div>

      {/* Departure — conditional fields */}
      <AnimatePresence>
        {departureTransportation === 'yes' && (
          <motion.div
            className="conditional-field"
            variants={conditionalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ marginBottom: '16px' }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label form-label-required" htmlFor="hotelDepartureTime">
                <IconClock />
                When do you plan to leave from the hotel?
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
            variants={conditionalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ marginBottom: '16px' }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label form-label-required" htmlFor="departureTime">
                <IconClock />
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

      {/* Additional Notes */}
      <motion.div className="form-group" variants={itemVariants}>
        <label className="form-label" htmlFor="additionalNotes">
          <IconNotes />
          Anything else?
        </label>
        <textarea
          id="additionalNotes"
          className="form-textarea"
          {...register('additionalNotes')}
          placeholder="Accommodations, preferences..."
          style={{ marginBottom: '4px' }}
        />
      </motion.div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        className={`submit-btn ${isSubmitting ? 'submitting-shimmer' : ''}`}
        disabled={isSubmitting}
        variants={itemVariants}
        whileHover={!isSubmitting ? { scale: 1.02, y: -1 } : {}}
        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? 'Submitting...' : (
          <>
            Submit RSVP
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 6, verticalAlign: 'middle' }}>
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default TransportationForm;
