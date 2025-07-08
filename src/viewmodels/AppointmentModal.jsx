import React from 'react';
import '../AppointmentModal.css';

export default function AppointmentModal({
  slot,
  name,
  email,
  number,
  service_desc,
  onNameChange,
  onEmailChange,
  onNumberChange,
  onDescChange,
  onSubmit,
  onCancel
}) {
  const date = new Date(slot.appointment_time);

  return (
    <div className="reserve-modal">
      <div className="reserve-modal-content">
        <h3>Confirm Appointment</h3>
        <p><strong>Date:</strong> {date.toDateString()}</p>
        <p><strong>Time:</strong> {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>

        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={onNameChange}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={onEmailChange}
            required
          />
          <input
            type="text"
            placeholder="Your Number"
            value={number}
            onChange={onNumberChange}
            required
          />
          <textarea
            placeholder="Service Description"
            value={service_desc}
            onChange={onDescChange}
            rows={4}
            required
          />
          <div className="modal-buttons">
            <button type="submit">Confirm</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}