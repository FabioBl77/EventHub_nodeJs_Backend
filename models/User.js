const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

class User extends Model {
  // Metodo per confrontare password al login
  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Inserisci un indirizzo email valido' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false // nuovo campo: verifica email
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true // token per conferma email
    },
    verificationTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  }
);

module.exports = User;
