import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import supabase from '../lib/supabaseClient';
import ManageModal from "../viewmodels/ManageModal";
import '../Dashboard.css';
import '../App.css';

export default function Dashboard() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [monthOptions, setMonthOptions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [weekOptions, setWeekOptions] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [groupedDates, setGroupedDates] = useState({});
  const { id } = useParams();

  const fetchAllAppointments = async () => {
    let allData = [];
    let from = 0;
    const batchSize = 1000;
    let more = true;
    while (more) {
    const{ data, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .in('status', ['pending', 'approved', 'available', 'N/A'])
      .eq('stylist_id', id)
      .range(from, from + batchSize - 1);
      //.gte('appointment_time', new Date().toISOString());

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
  }

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

    // loads appointment slots with time, name and status
    useEffect(() => {
      if (!selectedDate || !id) return;

      const loadSlots = async () => {
        const dayStart = new Date(selectedDate);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayStart.getDate() + 1);

        const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .in('status', ['pending', 'approved', 'available', 'N/A'])
        .eq('stylist_id', id)
        .gte('appointment_time', dayStart.toISOString())
        .lt('appointment_time', dayEnd.toISOString())
        .order('appointment_time', { ascending: true });

        if (error) console.log(error);
        else setSlots(data);
        console.log("loaded slots:", data);
      };
      loadSlots();
    }, [selectedDate, id]);

    // slot clicks
    const handleSlotClick = (slot) => {
      setSelectedSlot(slot);
      setShowModal(true);
    }
    // handle submit to change status of appointment
    const approveSubmit = async (e) => {
      e.preventDefault();

      const { error } = await supabase
      .from('appointments')
      .update({status: 'approved'})
      .eq('id', selectedSlot.id)

      if (error) {
        console.log('Error updating appointments:', error);
        return;
      }
      //Refresh slot list
      setShowModal(false)
      setSelectedSlot(null);
      const updatedSlots = slots.map(slot =>
        slot.id === selectedSlot.id ? { ...slot, status: 'approved' } : slot
      );
      setSlots(updatedSlots);
    }

    const pendingSubmit = async (e) => {
      e.preventDefault();

      const { error } = await supabase
      .from('appointments')
      .update({status: 'pending'})
      .eq('id', selectedSlot.id)

      if (error) {
        console.log('Error updating appointments:', error);
        return;
      }
      //Refresh slot list
      setShowModal(false)
      setSelectedSlot(null);
      const updatedSlots = slots.map(slot =>
        slot.id === selectedSlot.id ? { ...slot, status: 'pending' } : slot
      );
      setSlots(updatedSlots);
    }

    const NASubmit = async (e) => {
      e.preventDefault();

      const { error } = await supabase
      .from('appointments')
      .update({status: 'N/A'})
      .eq('id', selectedSlot.id)

      if (error) {
        console.log('Error updating appointments:', error);
        return;
      }
      //Refresh slot list
      setShowModal(false)
      setSelectedSlot(null);
      const updatedSlots = slots.map(slot =>
        slot.id === selectedSlot.id ? { ...slot, status: 'N/A' } : slot
      );
      setSlots(updatedSlots);
    }

    const availableSubmit = async (e) => {
      e.preventDefault();

      const { error } = await supabase
      .from('appointments')
      .update({
        status: 'available',
        client_name: '',
        client_email: '',
        client_number: '',
        service_desc: ''
      })
      .eq('id', selectedSlot.id)

      if (error) {
        console.log('Error updating appointments:', error);
        return;
      }
      //Refresh slot list
      setShowModal(false)
      setSelectedSlot(null);
      const updatedSlots = slots.map(slot =>
        slot.id === selectedSlot.id ? { 
          ...slot, 
          status: 'available',
          client_name: '',
          client_email: '',
          client_number: '',
          service_desc: ''
        } : slot
      );
      setSlots(updatedSlots);
    }

    const navigate = useNavigate();

  return (
    <>
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div className="Dashboard-container">
        <h2 className="Dashboard-title">Manage Appointments</h2>

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
        className="Dashboard-select"
        >
          {dates.map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>

        <ul className="Dashboard-slots">
        {slots.length > 0 ? (
        slots.map(slot => (
          <li 
          key={slot.id} 
          className="Dashboard-slot"
          onClick={() => handleSlotClick(slot)}
          style={{cursor: 'pointer'}}
          >
            {new Date(slot.appointment_time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })} {slot.client_name} : {slot.status}
          </li>
        ))
      ) : (
        <p className="Dashboard-empty">No slots for this day.</p>
      )}
        </ul>

        {showModal && selectedSlot && (
          <ManageModal 
          slot={selectedSlot}
          onApprove={approveSubmit}
          onPending={pendingSubmit}
          onAvailable={availableSubmit}
          onNA={NASubmit}
          onCancel={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
    <button className="bottom-left-button" onClick={() => navigate("/")}> Go Back </button>
    </>
  );
}