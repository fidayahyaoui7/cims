const db = require('../database/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const SALT_ROUNDS = 10;

class User {
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    const [user] = await db('users')
      .insert({
        email: userData.email,
        password_hash: hashedPassword,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        role: userData.role || 'patient',
        verification_token: uuidv4(),
        verification_token_expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      })
      .returning('*');
    return user;
  }

  static async findByEmail(email) {
    return db('users').where({ email }).first();
  }

  static async findById(id) {
    return db('users').where({ id }).first();
  }

  static async verifyUser(token) {
    const user = await db('users')
      .where('verification_token', token)
      .where('verification_token_expires', '>', new Date())
      .first();

    if (!user) return false;

    await db('users')
      .where({ id: user.id })
      .update({
        is_verified: true,
        verification_token: null,
        verification_token_expires: null
      });

    return true;
  }

  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await db('users')
      .where({ id: userId })
      .update({ password_hash: hashedPassword });
  }

  static async comparePasswords(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;
