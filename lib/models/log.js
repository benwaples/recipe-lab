const pool = require('../utils/pool');

module.exports = class Log {
  id;
  recipeId;
  dateOfEvent;
  notes;
  rating;
  ingredients;

  constructor(log) {
    this.id = log.id;
    this.recipeId = log.recipe_id;
    this.dateOfEvent = log.date_of_event;
    this.notes = log.notes;
    this.rating = log.rating;
    this.ingredients = log.ingredients;
  }

  static async insert(log) {
    const { rows } = await pool.query(`
    INSERT into logs (recipe_id, date_of_event, notes, rating, ingredients) VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [log.recipeId, log.dateOfEvent, log.notes, log.rating, log.ingredients]);

    return new Log(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query('SElECT * FROM logs WHERE recipe_id=$1', [id]);

    return new Log(rows[0]);
  }

  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM logs');

    return rows.map(log => new Log(log));
  }

  static async update(id, updatedLog) {
    const { rows } = await pool.query(`
      UPDATE logs
      SET recipe_id=$1,
          date_of_event=$2,
          notes=$3,
          rating=$4,
          ingredients=$5
      WHERE id=$6
      RETURNING *
    `, [updatedLog.recipeId, updatedLog.dateOfEvent, updatedLog.notes, updatedLog.rating, updatedLog.ingredients, id]);

    return new Log(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query('DELETE FROM logs WHERE id=$1 RETURNING *', [id]);

    return new Log(rows[0]);
  }
};
