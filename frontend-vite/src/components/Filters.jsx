// src/components/Filters.jsx

import "../styles/Filters.css";

export default function Filters({ filters, setFilters }) {
  // ✅ Verifica se almeno un filtro è attivo
  const isFilterActive = Object.values(filters).some((val) => val !== "");

  const handleReset = () => {
    setFilters({
      title: "",
      date: "",
      category: "",
      location: "",
    });
  };

  return (
    <div className="filters">
      <h2>Filtra eventi</h2>

      <div className="filters-container">
        <input
          type="text"
          name="title"
          placeholder="Titolo"
          value={filters.title}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
        <input
          type="text"
          name="category"
          placeholder="Categoria"
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        />
        <input
          type="text"
          name="location"
          placeholder="Luogo"
          value={filters.location}
          onChange={(e) =>
            setFilters({ ...filters, location: e.target.value })
          }
        />
      </div>

      {/* ✅ Pulsante “Pulisci filtri” appare solo se serve */}
      {isFilterActive && (
        <button className="btn-reset" onClick={handleReset}>
          Pulisci filtri
        </button>
      )}
    </div>
  );
}
