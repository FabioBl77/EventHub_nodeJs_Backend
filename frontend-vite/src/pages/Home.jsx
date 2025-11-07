import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <h1>Benvenuto su EventHub 🎉</h1>
      <p>
        Scopri, crea e partecipa agli eventi della community. Con EventHub puoi gestire
        tutti i tuoi eventi in un unico posto!
      </p>

      <div className="card">
        <h2>Prossimo Evento</h2>
        <p><strong>Hackathon ITS Piemonte</strong></p>
        <p>Data: 25 Novembre 2025</p>
        <button className="btn">Iscriviti Ora</button>
      </div>
    </div>
  );
}
