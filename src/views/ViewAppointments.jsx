import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import '../Reserve.css';
import '../App.css';


export default function ViewAppointments() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const { id } = useParams();

  // dates for dropdown
  useEffect(() => {
    console.log("acquired id:", id);
    if (!id) return;

    const loadDates = async () => {
      const{ data, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .in('status', ['pending', 'approved'])
        .eq('stylist_id', id)
        .gte('appointment_time', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())

        if (error) console.log(error);
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
        .in('status', ['pending', 'approved'])
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

    const navigate = useNavigate();

    return (
      <>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <div className="reserve-container">
          <h2 className="reserve-title"> View Appointments</h2>
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
          >
            {new Date(slot.appointment_time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}  {slot.client_name} :  {slot.status}
          </li>
        ))
      ) : (
        <p className="reserve-empty">No slots available for this day.</p>
      )}
    </ul>
        </div>
      </div>
      <button className="bottom-left-button" onClick={() => navigate("/")}> Go Back </button>
      </>
    );
  }