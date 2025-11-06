// src/pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getDashboard } from '../api/eventApi';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ createdEvents: [], registeredEvents: [] });

  useEffect(() => {
    (async () => {
      try {
        const res = await getDashboard();
        setData(res.data || {});
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Dashboard personale</h2>
      <p>Benvenuto, {user?.username}</p>

      <section>
        <h3>Eventi creati</h3>
        {data.createdEvents?.length ? (
          data.createdEvents.map(e => <div key={e.id}>{e.title}</div>)
        ) : <p>Nessun evento creato</p>}
      </section>

      <section>
        <h3>Eventi a cui sei iscritto</h3>
        {data.registeredEvents?.length ? (
          data.registeredEvents.map(r => <div key={r.id}>{r.Event?.title || 'evento'}</div>)
        ) : <p>Nessuna iscrizione</p>}
      </section>
    </div>
  );
};

export default Dashboard;
