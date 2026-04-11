import React, { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { AnimatePresence, motion } from 'framer-motion';
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
      required_error: 'Please select an option'
    }),
    bnaArrivalTime: z.date().nullable(),
    arrivalTime: z.date().nullable(),
    departureTransportation: z.enum(['yes', 'no'], {
      required_error: 'Please select an option'
    }),
    hotelDepartureTime: z.date().nullable(),
    departureTime: z.date().nullable(),
    additionalNotes: z.string().optional()
  })
  .superRefine((values, ctx) => {
    if (values.arrivalTransportation === 'yes' && !values.bnaArrivalTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['bnaArrivalTime'], message: 'Please select a pickup time' });
    }
    if (values.arrivalTransportation === 'no' && !values.arrivalTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['arrivalTime'], message: 'Please specify your arrival time' });
    }
    if (values.departureTransportation === 'yes' && !values.hotelDepartureTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['hotelDepartureTime'], message: 'Please select a departure time' });
    }
    if (values.departureTransportation === 'no' && !values.departureTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['departureTime'], message: 'Please specify your departure time' });
    }
  });

const deserialize = (raw) => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const pg = parsed?.groupSize;
    const groupSize = typeof pg === 'number' ? (Number.isFinite(pg) ? pg : undefined)
      : typeof pg === 'string' && pg.trim() !== '' ? Number(pg) : undefined;
    return {
      ...defaultValues, ...parsed,
      groupSize: typeof groupSize === 'number' && Number.isFinite(groupSize) ? groupSize : undefined,
      bnaArrivalTime: parsed?.bnaArrivalTime ? new Date(parsed.bnaArrivalTime) : null,
      arrivalTime: parsed?.arrivalTime ? new Date(parsed.arrivalTime) : null,
      hotelDepartureTime: parsed?.hotelDepartureTime ? new Date(parsed.hotelDepartureTime) : null,
      departureTime: parsed?.departureTime ? new Date(parsed.departureTime) : null
    };
  } catch { return null; }
};

const serialize = (v) => ({
  ...v,
  groupSize: typeof v.groupSize === 'number' && Number.isFinite(v.groupSize) ? v.groupSize : null,
  bnaArrivalTime: v.bnaArrivalTime?.toISOString() ?? null,
  arrivalTime: v.arrivalTime?.toISOString() ?? null,
  hotelDepartureTime: v.hotelDepartureTime?.toISOString() ?? null,
  departureTime: v.departureTime?.toISOString() ?? null
});

const makeTime = (h, m) => { const d = new Date(); d.setHours(h, m, 0, 0); return d; };

const makeTimes = (startH, startM, endH, endM, step = 15) => {
  const times = [];
  let h = startH, m = startM;
  while (h < endH || (h === endH && m <= endM)) {
    times.push(makeTime(h, m));
    m += step;
    if (m >= 60) { h += 1; m -= 60; }
  }
  return times;
};

// "Yes" shuttle pickup: 2:00, 2:15, 2:30 PM
const arrivalTimes = makeTimes(14, 0, 14, 30);
// "No" arrive at Alila: 3:00 PM – 5:00 PM
const alilaArrivalTimes = makeTimes(15, 0, 17, 0);
// "Yes" shuttle from hotel: 1:00, 1:15, 1:30 PM
const departureTimes = makeTimes(13, 0, 13, 30);
// "No" leave Alila: 10:00 AM – 2:00 PM
const alilaDepartureTimes = makeTimes(10, 0, 14, 0);

const slide = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto', transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
};

const TransportationForm = () => {
  const [done, setDone] = useState(false);
  const init = useMemo(() => deserialize(localStorage.getItem(STORAGE_KEY)) ?? defaultValues, []);

  const { control, register, handleSubmit, reset, watch, clearErrors, formState: { errors, isSubmitting } } = useForm({
    defaultValues: init, resolver: zodResolver(schema), mode: 'onSubmit'
  });

  const arrival = watch('arrivalTransportation');
  const departure = watch('departureTransportation');
  const all = watch();

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize(all))); }, [all]);

  const fmt = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    let h = dt.getHours();
    const m = String(dt.getMinutes()).padStart(2, '0');
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ap}`;
  };

  const onSubmit = async (v) => {
    try {
      const url = 'https://script.google.com/macros/s/AKfycbxK1ZOrGrcxJId7FOdEwmDEc8L-NxFcReg718FjIibkcvx2hpWLACnJjT9Ot_xug9KHCw/exec';
      const fd = new FormData();
      fd.append('name', v.name);
      fd.append('email', v.email);
      fd.append('group_size', String(v.groupSize));
      fd.append('arrival_transportation', v.arrivalTransportation);
      fd.append('bna_arrival_time', v.arrivalTransportation === 'yes' ? fmt(v.bnaArrivalTime) : 'N/A');
      fd.append('arrival_time', v.arrivalTransportation === 'no' ? fmt(v.arrivalTime) : 'N/A');
      fd.append('departure_transportation', v.departureTransportation);
      fd.append('hotel_departure_time', v.departureTransportation === 'yes' ? fmt(v.hotelDepartureTime) : 'N/A');
      fd.append('departure_time', v.departureTransportation === 'no' ? fmt(v.departureTime) : 'N/A');
      fd.append('additional_notes', v.additionalNotes?.trim() || 'None');

      const res = await fetch(url, { method: 'POST', body: fd, redirect: 'follow' });
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        if (json.result === 'error') { alert(json.message || 'Something went wrong. Please try again.'); return; }
      } catch {}
      setDone(true);
      localStorage.removeItem(STORAGE_KEY);
      reset(defaultValues);
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again or contact us directly.');
    }
  };

  if (done) {
    return (
      <div className="success-message">
        <div className="success-icon-wrap">
          <div className="success-icon-ring">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M10 16L14 20L22 12" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <h2>You're all set.</h2>
        <p>We've received your transportation details. We'll be in touch if we need anything else.</p>
        <button className="submit-btn" onClick={() => setDone(false)} style={{ maxWidth: 240, marginTop: 20 }}>
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="form-label form-label-required" htmlFor="name">Full name</label>
        <input type="text" id="name" className="form-input" placeholder="Your full name"
          {...register('name', { onChange: () => clearErrors('name') })} />
        {errors.name && <span className="form-error">{errors.name.message}</span>}
      </div>

      <div className="form-group">
        <label className="form-label form-label-required" htmlFor="email">Email</label>
        <input type="email" id="email" className="form-input" placeholder="you@example.com"
          {...register('email', { onChange: () => clearErrors('email') })} />
        {errors.email && <span className="form-error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label className="form-label form-label-required" htmlFor="groupSize">Party size</label>
        <input type="number" id="groupSize" className="form-input" placeholder="Including yourself" min="1"
          {...register('groupSize', { valueAsNumber: true, onChange: () => clearErrors('groupSize') })} />
        {errors.groupSize && <span className="form-error">{errors.groupSize.message}</span>}
      </div>

      <div className="form-group">
        <label className="form-label form-label-required">Need a shuttle from the airport to hotel on June 13?</label>
        <div className="radio-group">
          <div className="radio-option">
            <input type="radio" id="arrival-yes" value="yes"
              {...register('arrivalTransportation', { onChange: () => { clearErrors('arrivalTransportation'); clearErrors(['bnaArrivalTime', 'arrivalTime']); } })} />
            <label htmlFor="arrival-yes">Yes please</label>
          </div>
          <div className="radio-option">
            <input type="radio" id="arrival-no" value="no"
              {...register('arrivalTransportation', { onChange: () => { clearErrors('arrivalTransportation'); clearErrors(['bnaArrivalTime', 'arrivalTime']); } })} />
            <label htmlFor="arrival-no">No thanks</label>
          </div>
        </div>
        {errors.arrivalTransportation && <span className="form-error">{errors.arrivalTransportation.message}</span>}
      </div>

      <AnimatePresence>
        {arrival === 'yes' && (
          <motion.div className="conditional-field" variants={slide} initial="initial" animate="animate" exit="exit" style={{ marginBottom: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label form-label-required" htmlFor="bnaArrivalTime">Car pickup time at Bali airport</label>
              <Controller name="bnaArrivalTime" control={control} render={({ field }) => (
                <DatePicker id="bnaArrivalTime" selected={field.value}
                  onChange={d => { field.onChange(d); clearErrors('bnaArrivalTime'); }}
                  showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time"
                  dateFormat="h:mm aa" placeholderText="Select a time"
                  includeTimes={arrivalTimes} className="form-input" />
              )} />
              {errors.bnaArrivalTime && <span className="form-error">{errors.bnaArrivalTime.message}</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {arrival === 'no' && (
          <motion.div className="conditional-field" variants={slide} initial="initial" animate="animate" exit="exit" style={{ marginBottom: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label form-label-required" htmlFor="arrivalTime">What time will you arrive at Alila on June 13?</label>
              <Controller name="arrivalTime" control={control} render={({ field }) => (
                <DatePicker id="arrivalTime" selected={field.value}
                  onChange={d => { field.onChange(d); clearErrors('arrivalTime'); }}
                  showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time"
                  dateFormat="h:mm aa" placeholderText="Select a time"
                  includeTimes={alilaArrivalTimes}
                  className="form-input" />
              )} />
              {errors.arrivalTime && <span className="form-error">{errors.arrivalTime.message}</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="form-group">
        <label className="form-label form-label-required">Need a shuttle from hotel to airport on June 15?</label>
        <div className="radio-group">
          <div className="radio-option">
            <input type="radio" id="departure-yes" value="yes"
              {...register('departureTransportation', { onChange: () => { clearErrors('departureTransportation'); clearErrors(['hotelDepartureTime', 'departureTime']); } })} />
            <label htmlFor="departure-yes">Yes please</label>
          </div>
          <div className="radio-option">
            <input type="radio" id="departure-no" value="no"
              {...register('departureTransportation', { onChange: () => { clearErrors('departureTransportation'); clearErrors(['hotelDepartureTime', 'departureTime']); } })} />
            <label htmlFor="departure-no">No thanks</label>
          </div>
        </div>
        {errors.departureTransportation && <span className="form-error">{errors.departureTransportation.message}</span>}
      </div>

      <AnimatePresence>
        {departure === 'yes' && (
          <motion.div className="conditional-field" variants={slide} initial="initial" animate="animate" exit="exit" style={{ marginBottom: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label form-label-required" htmlFor="hotelDepartureTime">Shuttle departure time from hotel</label>
              <Controller name="hotelDepartureTime" control={control} render={({ field }) => (
                <DatePicker id="hotelDepartureTime" selected={field.value}
                  onChange={d => { field.onChange(d); clearErrors('hotelDepartureTime'); }}
                  showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time"
                  dateFormat="h:mm aa" placeholderText="Select a time"
                  includeTimes={departureTimes} className="form-input" />
              )} />
              {errors.hotelDepartureTime && <span className="form-error">{errors.hotelDepartureTime.message}</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {departure === 'no' && (
          <motion.div className="conditional-field" variants={slide} initial="initial" animate="animate" exit="exit" style={{ marginBottom: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label form-label-required" htmlFor="departureTime">What time will you leave Alila on June 15?</label>
              <Controller name="departureTime" control={control} render={({ field }) => (
                <DatePicker id="departureTime" selected={field.value}
                  onChange={d => { field.onChange(d); clearErrors('departureTime'); }}
                  showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time"
                  dateFormat="h:mm aa" placeholderText="Select a time"
                  includeTimes={alilaDepartureTimes}
                  className="form-input" />
              )} />
              {errors.departureTime && <span className="form-error">{errors.departureTime.message}</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="form-group">
        <label className="form-label" htmlFor="additionalNotes">Anything else we should know?</label>
        <textarea id="additionalNotes" className="form-textarea" placeholder="Special requests, dietary needs, etc."
          {...register('additionalNotes')} />
      </div>

      <button type="submit" className={`submit-btn ${isSubmitting ? 'submitting-shimmer' : ''}`} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting…' : 'Submit RSVP'}
      </button>
    </form>
  );
};

export default TransportationForm;
