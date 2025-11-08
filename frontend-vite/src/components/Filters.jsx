export default function Filters({ filters, setFilters }) {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Categoria"
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      />
      <input
        type="date"
        value={filters.date}
        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
      />
      <input
        type="text"
        placeholder="Luogo"
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
      />
    </div>
  );
}
