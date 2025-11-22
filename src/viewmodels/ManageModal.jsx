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
                <button type="button" onClick={onApprove}>Approve</button>
                <button type="button" onClick={onPending}>Pending</button>
                <button type="button" onClick={onAvailable}>Available</button>
                <button type="button" onClick={onNA}>N/A</button>
                <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}