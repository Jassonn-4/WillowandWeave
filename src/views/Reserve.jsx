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
  const [monthOptions, setMonthOptions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [weekOptions, setWeekOptions] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [groupedDates, setGroupedDates] = useState({});
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_number: "",
    service_desc: "",
  });
  const { id } = useParams();

  const fetchAllAppointments = async () => {
    let allData = [];
    let from = 0;
    const batchSize = 1000;
    let more = true;
  
    while (more) {
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('status', 'available')
        .eq('stylist_id', id)
        .order('appointment_time', { ascending: true })
        .range(from, from + batchSize - 1);
  
      if (error) {
        console.error(error);
        return;
      }
  
      if (data.length < batchSize) {
        more = false;
      }
  
      allData = allData.concat(data);
      from += batchSize;
    }
  
    return allData;
  };


// dates for dropdown
useEffect(() => {
  console.log("acquired id:", id);
  if (!id) return;

  const loadDates = async () => {
    const data = await fetchAllAppointments();
    if (!data) return;

    const slots = data.map(slot => new Date(slot.appointment_time));
    const groupedByMonth = {};

    slots.forEach(date => {
      const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });

      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - startOfWeek.getDay());

      const weekKey = new Date(startOfWeek.toDateString()).toISOString().split('T')[0];

      if (!groupedByMonth[month]) groupedByMonth[month] = {};
      if (!groupedByMonth[month][weekKey]) groupedByMonth[month][weekKey] = [];

      groupedByMonth[month][weekKey].push(date);
    });

    console.log("Grouped By Month:", groupedByMonth);
    setGroupedDates(groupedByMonth);

    const months = Object.keys(groupedByMonth);
    setMonthOptions(months);

    if (months.length > 0) {
      const firstMonth = months[0];
      setSelectedMonth(firstMonth);

      const firstMonthWeeks = Object.keys(groupedByMonth[firstMonth] || {}).sort();
      setWeekOptions(firstMonthWeeks);

      if (firstMonthWeeks.length > 0) {
        const firstWeek = firstMonthWeeks[0];
        setSelectedWeek(firstWeek);

        const sortedDays = [
          ...new Set(
            groupedByMonth[firstMonth][firstWeek]
              .sort((a, b) => a - b)
              .map(d => d.toDateString())
          )
        ];
        setDates(sortedDays);
        setSelectedDate(sortedDays[0]);
        console.log("All loaded slots:", slots.map(d => d.toISOString()));
      }
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

    {/* Month Dropdown */}
    <select
      value={selectedMonth}
      onChange={(e) => {
        const month = e.target.value;
        setSelectedMonth(month);

        const newWeeks = Object.keys(groupedDates[month] || {});
        setWeekOptions(newWeeks);
        const firstWeek = newWeeks[0];
        setSelectedWeek(firstWeek);

        const weekDates = groupedDates[month][firstWeek] || [];
        const dayStrings = Array.from(
          new Set(weekDates.sort((a, b) => a - b).map(d => d.toDateString()))
        );
        setDates(dayStrings);
        setSelectedDate(dayStrings[0]);
      }}
      className="reserve-select"
      >
        {monthOptions.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>

      {/* Week Dropdown */}
    <select
      value={selectedWeek}
      onChange={(e) => {
        const week = e.target.value;
        setSelectedWeek(week);

        const weekDates = groupedDates[selectedMonth][week] || [];
        const dayStrings = Array.from(
        new Set(weekDates.sort((a, b) => a - b).map(d => d.toDateString()))
        );
        setDates(dayStrings);
        setSelectedDate(dayStrings[0]);
      }}
      className="reserve-select"
>
      {weekOptions.map(week => (
        <option key={week} value={week}>
          Week of {new Date(week).toLocaleDateString()}
        </option>
      ))}
    </select>

    {/* Day Dropdown */}
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
        <p className="qr-instruction">All services require a deposit for approval</p>
        <p className="qr-instruction"> Services $25 and under : $10-$15 deposit</p>
        <p className="qr-instruction"> Services $80 and under : $20 deposit</p>
        <p className="qr-instruction"> Services $100 and over : $35 deposit</p>
        <p className="qr-instruction"> Upon deposit check appointment status under View Appointments on the Stylist Profile card </p>
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