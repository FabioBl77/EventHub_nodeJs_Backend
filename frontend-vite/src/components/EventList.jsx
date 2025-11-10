import EventCard from "./EventCard";

export default function EventList({ events, editable }) {
  if (!events.length) return <p>Nessun evento disponibile.</p>;

  return (
    <div className="event-list">
      {events.map((ev) => (
        <EventCard key={ev.id} event={ev} editable={editable} />
      ))}
    </div>
  );
}
