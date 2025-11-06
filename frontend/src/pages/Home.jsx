// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { getEvents } from '../api/eventApi';
import { Link } from 'react-router-dom';

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getEvents();
        setEvents(res.data || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>EventHub — Vetrina</h1>
      <p>Ultimi eventi</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
        {events.map(e => (
          <div key={e.id} style={{ border: '1px solid #ccc', padding: 12, borderRadius: 6 }}>
            <h3>{e.title}</h3>
            <p>{e.location} — {new Date(e.date).toLocaleString()}</p>
            <Link to={`/events/${e.id}`}>Dettagli</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
