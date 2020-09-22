const fs = require('fs');
const pool = require('../utils/pool');
const Log = require('./log');

describe('Log class', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('should insert a log into the database', async() => {
    const log = await Log.insert({
      dateOfEvent: '05/17/1996',
      notes: 'best day on earth',
      rating: 5
    });
    console.log(log);

    const test = await pool.query('SELECT * FROM logs WHERE recipe_id=$1', [log.recipeId]);


    expect(test.rows[0]).toEqual({
      recipe_id: '1',
      date_of_event: '05/17/1996',
      notes: 'best day on earth',
      rating: 5
    });
  });
});
