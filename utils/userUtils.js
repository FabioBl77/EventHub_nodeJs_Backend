const User = require('../models/User');

async function getCurrentUser(req) {
  if (!req.user || !req.user.userId) return null;
  return await User.findByPk(req.user.userId, { attributes: ['id', 'username', 'email', 'role'] });
}

module.exports = { getCurrentUser };
