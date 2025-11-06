/**
 * Formatta una data in formato leggibile
 * @param {Date|string} date 
 * @param {string} locale 
 * @returns string
 */
const formatDate = (date, locale = 'it-IT') => {
  const d = new Date(date);
  return d.toLocaleDateString(locale, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

module.exports = { formatDate };
