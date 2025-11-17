README.md
# EventHub - Piattaforma di Gestione Eventi

Il Progetto ha un deploy all' indirizzo : 
https://eventhub-frontend-86l4.onrender.com

## 📋 Descrizione del Progetto

**EventHub** è una piattaforma completa per la gestione e la partecipazione a eventi. Permette agli utenti di creare e gestire eventi, iscriversi a quelli di altri, ricevere notifiche in tempo reale e comunicare tramite chat interna. Gli amministratori dispongono di un pannello di gestione per moderare eventi, utenti e segnalazioni.

### Caratteristiche Principali
- ✅ Creazione e gestione di eventi
- ✅ Iscrizione agli eventi
- ✅ Notifiche in tempo reale
- ✅ Chat interna per ogni evento
- ✅ Catalogo pubblico di eventi filtrabile
- ✅ Pannello amministrativo per la moderazione
- ✅ Autenticazione JWT e ruoli utente
- ✅ Integrazione OAuth (opzionale)

---

## 🎯 Requisiti Funzionali

### A. Gestione Utenti

#### Autenticazione
- Registrazione e login
- Autenticazione tramite JWT
- Recupero password via email
- Validazione email per nuovi iscritti
- Integrazione OAuth (Google, GitHub, ecc.) per login rapido

#### Ruoli Utente
- **Utente Base**: Può creare eventi, iscriversi e chattare
- **Amministratore**: Può approvare/rifiutare eventi, bloccare utenti, moderare

#### Endpoint Principali
```
POST   /api/auth/register          - Registrazione utente
POST   /api/auth/login             - Login
POST   /api/auth/logout            - Logout
POST   /api/auth/forgot-password   - Recupero password
GET    /api/auth/verify-email      - Verifica email
POST   /api/auth/oauth/google      - Login con Google
POST   /api/auth/oauth/github      - Login con GitHub
```

---

### B. Gestione Eventi

#### Funzionalità Utenti
- Creazione di eventi con: titolo, descrizione, data, luogo, capienza, immagine
- Modifica e cancellazione dei propri eventi
- Iscrizione/annullamento iscrizione a un evento
- Filtri per data, categoria e luogo
- Dashboard personale con:
  - Elenco eventi creati
  - Elenco eventi a cui è iscritto
  - Segnalazione di eventi

#### Funzionalità Amministratori
- Approvazione/rifiuto di eventi
- Blocco/eliminazione di eventi
- Visualizzazione di tutti gli eventi
- Gestione delle segnalazioni

#### Endpoint Principali
```
GET    /api/events                 - Lista eventi pubblici (con filtri)
POST   /api/events                 - Creazione evento
GET    /api/events/:id             - Dettagli evento
PUT    /api/events/:id             - Modifica evento
DELETE /api/events/:id             - Cancellazione evento
POST   /api/events/:id/register    - Iscrizione a evento
DELETE /api/events/:id/register    - Annulla iscrizione
POST   /api/events/:id/report      - Segnalazione evento
GET    /api/users/dashboard        - Dashboard personale
```

---

### C. Chat e Notifiche in Tempo Reale

#### Chat
- Chat interna per ogni evento
- Solo partecipanti iscritti possono scrivere
- Storico messaggi
- Supporto WebSocket per comunicazione real-time

#### Notifiche Live
- Quando qualcuno si iscrive a un evento
- Quando qualcuno cancella l'iscrizione
- Quando un evento viene segnalato (solo admin)
- Badge di notifiche non lette

#### Endpoint Principali
```
POST   /api/chat/:eventId/message   - Invio messaggio
GET    /api/chat/:eventId/messages  - Storico messaggi
GET    /api/notifications           - Lista notifiche
PUT    /api/notifications/:id/read  - Segna notifica come letta
```

---

### D. API Pubblica e Documentazione

- Tutte le funzionalità accessibili via API REST
- Endpoint protetti in base ai ruoli (middleware di autorizzazione)
- Documentazione Swagger/OpenAPI
- Gestione errori standardizzata

---

## 👥 Interfaccia Utente

### Per Utenti Base

#### Dashboard Principale
- Visualizzazione di tutti gli eventi disponibili
- Elenco personale: eventi creati + eventi a cui è iscritto
- Barra di ricerca e filtri per:
  - Data
  - Categoria
  - Luogo

#### Azioni Disponibili
- 🎬 Creare un nuovo evento
- ✏️ Modificare/aggiornare un evento creato
- 🗑️ Cancellare un evento creato
- 👁️ Visualizzare dettagli evento (pagina dedicata)
- 📌 Iscriversi a un evento
- ❌ Annullare iscrizione a un evento
- ⚠️ Segnalare un evento agli admin
- 💬 Accedere alla chat interna dell'evento
- 🔔 Ricevere notifiche live

### Per Amministratori

#### Dashboard Principale
- Simile a quella degli user ma con statistiche aggiuntive
- Elenco di tutti gli eventi
- Elenco di tutti gli utenti
- Elenco delle segnalazioni

#### Pannello di Gestione Utenti
- Lista di tutti gli utenti
- Visualizzazione dettagli utente
- Opzioni:
  - Cambiare ruolo (utente ↔ admin)
  - Bloccare/sbloccare utente
  - Eliminare utente

#### Pannello di Gestione Eventi
- Elenco di tutti gli eventi
- Filtri per stato (approvati, in sospeso, segnalati)
- Opzioni:
  - Approvare/rifiutare evento
  - Bloccare evento
  - Eliminare evento
  - Visualizzare segnalazioni

#### Chat
- Accesso a tutte le chat degli eventi
- Visualizzazione messaggi di segnalazione evento
- Possibilità di moderare/eliminare messaggi

---

## 🛠 Stack Tecnologico

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB/PostgreSQL
- **Autenticazione**: JWT
- **Real-time**: Socket.io (WebSocket)
- **Email**: Nodemailer
- **Validazione**: Joi/Yup
- **Documentazione API**: Swagger

### Frontend
- **Framework**: React / Vue.js / Angular
- **Real-time**: Socket.io Client
- **State Management**: Redux / Pinia / Vuex
- **Routing**: React Router / Vue Router
- **Styling**: Tailwind CSS / Material UI
- **Notifiche**: Toast notifications

---

## 📁 Struttura del Progetto

```
EventHub/
├── backend/
│   ├── config/              # Configurazione DB, JWT, email
│   ├── controllers/         # Logica dei controller
│   ├── middlewares/         # Middleware (auth, errori, ruoli)
│   ├── models/              # Modelli dati (User, Event, Chat, etc.)
│   ├── routes/              # Definizione route API
│   ├── services/            # Logica di business
│   ├── utils/               # Utility (email, socket, formatDate)
│   ├── docs/                # Documentazione Swagger
│   ├── tests/               # Test automatici
│   ├── server.js            # Entry point
│   ├── package.json
│   └── .env                 # Variabili di ambiente
│
├── frontend/                # Applicazione client (React/Vue/Angular)
│   ├── src/
│   │   ├── components/      # Componenti React/Vue
│   │   ├── pages/           # Pagine principali
│   │   ├── services/        # Servizi API
│   │   ├── store/           # State management
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## 🚀 Installazione e Setup

### Prerequisiti
- Node.js (v16+)
- npm o yarn
- MongoDB o PostgreSQL
- Account email per invio notifiche

### Backend Setup

1. **Clonare il repository**
   ```bash
   git clone <repository-url>
   cd EventHub/backend
   ```

2. **Installare dipendenze**
   ```bash
   npm install
   ```

3. **Configurare variabili di ambiente**
   ```bash
   cp .env.example .env
   ```
   Compilare `.env` con:
   - `DATABASE_URL`: Connessione al database
   - `JWT_SECRET`: Secret per JWT
   - `EMAIL_USER`: Email per invio notifiche
   - `EMAIL_PASSWORD`: Password email
   - `OAUTH_GOOGLE_ID`: ID client Google (opzionale)
   - `OAUTH_GITHUB_ID`: ID client GitHub (opzionale)

4. **Avviare il server**
   ```bash
   npm start
   ```
   Il server sarà disponibile su `http://localhost:5000`

### Frontend Setup

1. **Navigare nella cartella frontend**
   ```bash
   cd ../frontend
   ```

2. **Installare dipendenze**
   ```bash
   npm install
   ```

3. **Configurare API endpoint**
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Avviare l'applicazione**
   ```bash
   npm start
   ```
   L'app sarà disponibile su `http://localhost:3000`

---

## 📚 Documentazione API

### Autenticazione
Tutti gli endpoint protetti richiedono il token JWT nell'header:
```
Authorization: Bearer <jwt-token>
```

### Formato Risposta
```json
{
  "success": true,
  "data": {},
  "message": "Operazione completata"
}
```

### Errori
```json
{
  "success": false,
  "error": "Descrizione errore",
  "statusCode": 400
}
```

Per la documentazione API completa, consultare Swagger su `/api-docs`

---

## 🔒 Sicurezza

- ✅ Password hashate (bcrypt)
- ✅ Autenticazione JWT
- ✅ Validazione input (Joi/Yup)
- ✅ CORS configurato
- ✅ Rate limiting
- ✅ Protezione da XSS e CSRF
- ✅ Autorizzazione basata su ruoli (RBAC)

---

## 📦 Deployment

### Opzioni di Hosting
- Render
- Vercel (Frontend)
- Railway
- Heroku
- AWS/Google Cloud

### Database Hosting
- MongoDB Atlas (Cloud)
- PostgreSQL su RDS/Heroku
- MongoDB Community Server (self-hosted)

---

## 🧪 Test

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## 📝 Modelli Dati Principali

### User
- ID, email, password, nome, cognome, ruolo, foto profilo, data creazione

### Event
- ID, titolo, descrizione, data, ora, luogo, capienza, categoria, immagine, creatore, stato (approvato/in sospeso), data creazione

### Registration
- ID, utente, evento, data iscrizione, stato

### Chat
- ID, evento, messaggi[], data creazione

### Message
- ID, autore, testo, timestamp

### Notification
- ID, utente, tipo, evento, messaggio, letto, timestamp

### Report (Segnalazione)
- ID, evento, utente, motivo, descrizione, data, status (aperto/chiuso)

---

## 🤝 Contribuire

1. Fork il repository
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit i cambiamenti (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

---

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

---

## 📞 Supporto

Per domande o problemi, contattare il team di sviluppo o aprire un issue nel repository.

---

**Ultima aggiornamento**: 16 novembre 2025