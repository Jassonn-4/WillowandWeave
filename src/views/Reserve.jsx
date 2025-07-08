import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import AppointmentModal from "../viewmodels/AppointmentModal";
import '../Reserve.css';
import '../App.css';

export default function Reserve() {
  const [QRUrl, setQRUrl] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_number: "",
    service_desc: "",
  });
  const { id } = useParams();

// dates for dropdown
useEffect(() => {
  console.log("acquired id:", id);
  if (!id) return;

    const loadDates = async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('status', 'available')
        .eq('stylist_id', id)
        //.gte('appointment_time', new Date().toISOString());

      if (error) console.error(error);
      else {
      const uniqueDates = [...new Set(
          data.map(slot => new Date(slot.appointment_time).toDateString())
        )];
        uniqueDates.sort((a, b) => new Date(a) - new Date(b));
        setDates(uniqueDates);
        if (uniqueDates.length > 0) setSelectedDate(uniqueDates[0]);
      }
    };
    loadDates();
  }, [id]);

// loads actual appointment slots
useEffect(() => {
  if (!selectedDate || !id) return;

  const loadSlots = async () => {
    const dayStart = new Date(selectedDate);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('status', 'available')
      .eq('stylist_id', id)
      .gte('appointment_time', dayStart.toISOString())
      .lt('appointment_time', dayEnd.toISOString())
      .order('appointment_time', { ascending: true });

    if (error) console.error(error);
    else setSlots(data);
    console.log("loaded slots:", data);
  };
  loadSlots();
}, [selectedDate, id]);

// fetches qr code url
useEffect(() => {
  const fetchUrl = async () => {
    const { data, error } = await supabase
    .from('stylists')
    .select('QR_url')
    .eq('id', id)
    .single();

    if (error) {
      console.log('Error fetching QR_url:', error);
    } else {
      console.log('QR_url:', data.QR_url);
      setQRUrl(data.QR_url);
    }
  };
  fetchUrl();
}, [id]);

// popup and database changes
const handleSlotClick = (slot) => {
  setSelectedSlot(slot);
  setShowModal(true);
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const { error } = await supabase
  .from('appointments')
  .update({
    status: 'pending',
    client_name: formData.client_name,
     client_email: formData.client_email,
     client_number: formData.client_number,
     service_desc: formData.service_desc,
  })
  .eq('id', selectedSlot.id);

  if (error) {
    console.log('Error updating appointments:' , error);
    return;
  }

  // Refresh slot list
  setShowModal(false);
  setShowQRCode(true);
  setFormData({
    client_name: "",
    client_email: "",
    client_number: "",
    service_desc: "",
  });
  setSelectedSlot(null);
  const updatedSlots = slots.filter(slot => slot.id !== selectedSlot.id);
  setSlots(updatedSlots);
}

const navigate = useNavigate();

return (
  <>
  <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
  <div className="reserve-container">
    <h2 className="reserve-title">Available Appointments</h2>

    <select
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      className="reserve-select"
    >
      {dates.map(date => (
        <option key={date} value={date}>{date}</option>
      ))}
    </select>

    <ul className="reserve-slots">
      {slots.length > 0 ? (
        slots.map(slot => (
          <li 
          key={slot.id} 
          className="reserve-slot"
          onClick={() => handleSlotClick(slot)}
          style={{cursor: 'pointer'}}
          >
            {new Date(slot.appointment_time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </li>
        ))
      ) : (
        <p className="reserve-empty">No slots available for this day.</p>
      )}
    </ul>

    {showQRCode && QRUrl && (
      <div className="modal-overlay">
      <div className="modal-content">
        <h3>Payment QR Code</h3>
        <img src={QRUrl} alt="Payment QR Code" className="qr-image" />
        <p className="qr-instruction">20$ deposit non-refundable 🗿</p>
        <button onClick={() => setShowQRCode(false)} className="modal-close">Close</button>
      </div>
    </div>
)}

    {showModal && selectedSlot && (
          <AppointmentModal
            slot={selectedSlot}
            name={formData.client_name}
            email={formData.client_email}
            number={formData.client_number}
            service_desc={formData.service_desc}
            onNameChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            onEmailChange={(e) => setFormData({ ...formData, client_email: e.target.value})}
            onNumberChange={(e) => setFormData({ ...formData, client_number: e.target.value})}
            onDescChange={(e) => setFormData({ ...formData, service_desc: e.target.value})}
            onSubmit={handleSubmit}
            onCancel={() => setShowModal(false)}
          />
        )}
  </div>
  </div>
  <button className="bottom-left-button" onClick={() => navigate("/")}> Go Back </button>
  </>
);
}