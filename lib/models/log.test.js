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

    const test = await pool.query('SELECT * FROM logs WHERE recipe_id=$1', [log.recipeId]);


    expect(test.rows[0]).toEqual({
      recipe_id: '1',
      date_of_event: '05/17/1996',
      notes: 'best day on earth',
      rating: 5
    });
  });

  it('should return a log by the id', async() => {
    const allLogs = await Promise.all([
      Log.insert({
        dateOfEvent: '05/17/1996', notes: 'best day on earth', rating: 5
      }),
      Log.insert({
        dateOfEvent: 'another day', notes: 'the 3rd event', rating: 5
      }),
      Log.insert({
        dateOfEvent: 'the last day', notes: 'this recipe is quite bad', rating: 5
      }),
    ]);

    const bestDay = await Log.findById(allLogs[0].recipeId);

    expect(bestDay).toEqual({ recipeId: allLogs[0].recipeId, dateOfEvent: '05/17/1996', notes: 'best day on earth', rating: 5 });
  });

  it('should git all logs', async() => {
    const allLogs = await Promise.all([
      Log.insert({
        dateOfEvent: '05/17/1996', notes: 'best day on earth', rating: 5
      }),
      Log.insert({
        dateOfEvent: 'another day', notes: 'the 3rd event', rating: 5
      }),
      Log.insert({
        dateOfEvent: 'the last day', notes: 'this recipe is quite bad', rating: 5
      }),
    ]);

    const findAll = await Log.findAll();


    expect(findAll).toEqual(expect.arrayContaining(allLogs));
  });
});
