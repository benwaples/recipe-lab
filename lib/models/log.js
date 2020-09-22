const pool = require('../utils/pool');

module.exports = class Log {
  recipeId;
  dateOfEvent;
  notes;
  rating;

  constructor(log) {
    this.recipeId = log.recipe_id;
    this.dateOfEvent = log.date_of_event;
    this.notes = log.notes;
    this.rating = log.rating;
  }

  static async insert(log) {
    const { rows } = await pool.query(`
    INSERT into logs (date_of_event, notes, rating) VALUES ($1, $2, $3) RETURNING *
    `, [log.dateOfEvent, log.notes, log.rating]);

    return new Log(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query('SElECT * FROM logs WHERE recipe_id=$1', [id]);

    return new Log(rows[0]);
  }
};
