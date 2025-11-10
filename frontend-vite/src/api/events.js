import api from "./api";

// 🔹 Recupera tutti gli eventi pubblici
export const getAllEvents = () => api.get("/events/public");

// 🔹 Recupera gli eventi creati dall’utente loggato
export const getMyEvents = () => api.get("/events/mine");

// 🔹 Recupera gli eventi a cui l’utente è iscritto
export const getRegisteredEvents = () => api.get("/events/registered");

// 🔹 Recupera i dettagli di un singolo evento
export const getEventById = (id) => api.get(`/events/${id}`);

// 🔹 Crea un nuovo evento
export const createEvent = (eventData) => api.post("/events", eventData);

// 🔹 Aggiorna un evento
export const updateEvent = (id, eventData) => api.put(`/events/${id}`, eventData);

// 🔹 Cancella un evento
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// 🔹 Iscrizione a un evento
export const registerToEvent = (id) => api.post(`/events/${id}/register`);

// 🔹 Annulla iscrizione a un evento
export const cancelRegistration = (id) => api.post(`/events/${id}/cancel`);

// 🔹 Segnala un evento (es. spam, contenuti inappropriati, ecc.)
export const reportEvent = (id, reason) =>
  api.post(`/events/${id}/report`, { reason });

// 🔹 Filtra eventi pubblici per categoria, data o luogo
export const filterEvents = (filters) =>
  api.get("/events/filter", { params: filters });

// 🔹 Filtra i miei eventi per categoria, data o luogo
export const filterMyEvents = (filters) =>
  api.get("/events/mine/filter", { params: filters });

// 🔹 Filtra gli eventi a cui sono iscritto
export const filterRegisteredEvents = (filters) =>
  api.get("/events/registered/filter", { params: filters });
