const bcrypt = require('bcryptjs');
const User = require('./models/User');
const sequelize = require('./config/db');

(async () => {
  try {
    await sequelize.sync({ force: true });

    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await User.create({
      username: 'EffeBl',
      email: 'fabio.b77@libero.it',
      password: hashedPassword
    });

    console.log('Utente creato:', user.toJSON());
  } catch (err) {
    console.error('Errore test:', err);
  }
})();
