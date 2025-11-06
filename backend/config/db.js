const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,      
  process.env.DB_USER,      
  process.env.DB_PASSWORD,  
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false, 
  }
);

sequelize.authenticate()
  .then(() => console.log('Connessione al database MySQL riuscita.'))
  .catch(err => console.error('Errore connessione al database:', err));

module.exports = sequelize;
