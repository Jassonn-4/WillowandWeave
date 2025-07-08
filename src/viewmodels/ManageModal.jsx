import React from 'react';
import '../ManageModal.css';

export default function ManageModal( {
    slot,
    onApprove,
    onPending,
    onAvailable,
    onNA,
    onCancel
}) {
    const date = new Date(slot.appointment_time);

    return (
        <div className="Dashboard-modal">
            <div className="Dashboard-modal-content">
                <h3>Manage Appointment</h3>
                <p><strong>Date:</strong> {date.toDateString()}</p>
                <p><strong>Time:</strong> {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}</p>
                <p><strong>{slot.client_name}</strong> : {slot.client_email} : {slot.client_number}</p>
                <p>{slot.service_desc}</p>

               <div className="modal-form-grid">
                <form onSubmit={onApprove}>
                        <button type="submit">Approve</button>
                </form>
                <form onSubmit={onPending}>
                        <button type="submit">Pending</button>
                </form>
                <form onSubmit={onAvailable}>
                        <button type="submit">Available</button>
                </form>
                <form onSubmit={onNA}>
                        <button type="submit">N/A</button>
                </form>
                <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}