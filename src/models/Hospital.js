const knex = require('knex');
const config = require('../../knexfile');

const db = knex(config.development);

class Hospital {
  static async findAll() {
    return db('hospitals').select('*');
  }

  static async findById(id) {
    return db('hospitals').where({ id }).first();
  }

  static async findByCity(city) {
    return db('hospitals').where('city', 'like', `%${city}%`);
  }

  static async create(hospital) {
    const [id] = await db('hospitals').insert({
      ...hospital,
      created_at: new Date(),
      updated_at: new Date()
    });
    return this.findById(id);
  }

  static async update(id, updates) {
    await db('hospitals')
      .where({ id })
      .update({
        ...updates,
        updated_at: new Date()
      });
    return this.findById(id);
  }

  static async delete(id) {
    return db('hospitals').where({ id }).del();
  }
}

module.exports = Hospital;
