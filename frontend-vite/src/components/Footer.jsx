// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#f3f4f6",
        padding: "15px",
        textAlign: "center",
        marginTop: "40px",
        borderTop: "1px solid #ddd",
        color: "#555",
      }}
    >
      <p>
        © {new Date().getFullYear()} <strong>EventHub</strong> — Tutti i diritti riservati.
      </p>
      <small>Progetto ITS Piemonte — Verifica Finale</small>
    </footer>
  );
}
