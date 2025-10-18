const bcrypt = require('bcryptjs');

// Inserisci qui la password che hai appena settato
const passwordInChiaro = 'Psw123';

// Inserisci qui l'hash che trovi nel database
const hashDalDB = '$2b$10$4RK2/NMX2LjF8/GcJMrwDOKuSy/.v2i9aMNDFLQ7JTRtteUzrpCXy';

bcrypt.compare(passwordInChiaro, hashDalDB).then(res => {
  console.log('Corrispondenza password?', res); // true se corrisponde
}).catch(err => {
  console.error('Errore:', err);
});
