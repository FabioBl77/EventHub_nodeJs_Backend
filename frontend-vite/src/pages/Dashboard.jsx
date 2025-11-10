import { useEffect, useState } from "react";
import EventList from "../components/EventList";
import EventForm from "../components/EventForm";
import Filters from "../components/Filters";
import api from "../api/api";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [filters, setFilters] = useState({ category: "", date: "", location: "" });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events", { params: filters });
      setEvents(res.data);
    } catch (err) {
      console.error("Errore fetch eventi:", err);
    }
  };

  const fetchMyEvents = async () => {
    try {
      const res = await api.get("/events/my");
      setMyEvents(res.data);
    } catch (err) {
      console.error("Errore fetch miei eventi:", err);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  return (
    <div className="dashboard-page">
      <h1>La tua dashboard</h1>

      <Filters filters={filters} setFilters={setFilters} />

      <h2>Eventi pubblici</h2>
      <EventList events={events} />

      <h2>I miei eventi</h2>
      <EventList events={myEvents} editable />
      
      <h2>Crea un nuovo evento</h2>
      <EventForm onEventCreated={fetchMyEvents} />
    </div>
  );
}
