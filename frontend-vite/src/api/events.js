import api from "./api";

// Recupera tutti gli eventi pubblici
export const getAllEvents = () => api.get("/events");

// Recupera eventi creati e a cui l'utente è iscritto (dashboard)
export const getDashboard = () => api.get("/events/dashboard");

// Helpers per liste specifiche
export const getMyEvents = async () => {
  const res = await getDashboard();
  return res.data?.createdEvents || [];
};

export const getRegisteredEvents = async () => {
  const res = await getDashboard();
  return res.data?.joinedEvents || [];
};

// Recupera i dettagli di un singolo evento
export const getEventById = (id) => api.get(`/events/${id}`);

// Crea/Aggiorna/Cancella evento
export const createEvent = (eventData) => api.post("/events", eventData);
export const updateEvent = (id, eventData) => api.put(`/events/${id}`, eventData);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Iscrizione e annullamento
export const registerToEvent = (id) => api.post(`/events/${id}/register`);
export const cancelRegistration = (id) => api.delete(`/events/${id}/cancel`);

// Segnala un evento
export const reportEvent = (id, reason) => api.post(`/events/${id}/report`, { reason });

// Filtra eventi pubblici per categoria, data o luogo
export const filterEvents = (filters) => api.get("/events/filter", { params: filters });

// Filtra i miei eventi (client-side via dashboard)
export const filterMyEvents = async (filters) => {
  const list = await getMyEvents();
  return list.filter((e) =>
    (!filters.date || new Date(e.date).toDateString() === new Date(filters.date).toDateString()) &&
    (!filters.category || (e.category || "").toLowerCase().includes(filters.category.toLowerCase())) &&
    (!filters.location || (e.location || "").toLowerCase().includes(filters.location.toLowerCase()))
  );
};

// Filtra gli eventi a cui sono iscritto (client-side via dashboard)
export const filterRegisteredEvents = async (filters) => {
  const list = await getRegisteredEvents();
  return list.filter((e) =>
    (!filters.date || new Date(e.date).toDateString() === new Date(filters.date).toDateString()) &&
    (!filters.category || (e.category || "").toLowerCase().includes(filters.category.toLowerCase())) &&
    (!filters.location || (e.location || "").toLowerCase().includes(filters.location.toLowerCase()))
  );
};

