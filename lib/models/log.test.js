const fs = require('fs');
const pool = require('../utils/pool');
const Log = require('./log');

describe('Log class', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('should insert a log into the database', async() => {
    const log = await Log.insert({
      recipeId: 1,
      dateOfEvent: '05/17/1996',
      notes: 'best day on earth',
      rating: 5,
      ingredients: '{ "amount": 1, "measurement": "teaspoon", "ingredient": "salt" }'
    });

    const test = await pool.query('SELECT * FROM logs WHERE recipe_id=$1', [log.recipeId]);


    expect(test.rows[0]).toEqual({
      id: '1',
      recipe_id: 1,
      date_of_event: '05/17/1996',
      notes: 'best day on earth',
      rating: 5,
      ingredients: { amount: 1, measurement: 'teaspoon', ingredient: 'salt' }
    });
  });

  it('should return a log by the id', async() => {
    const allLogs = await Promise.all([
      Log.insert({
        recipeId: 1, dateOfEvent: '05/17/1996', notes: 'best day on earth', rating: 5
      }),
      Log.insert({
        recipeId: 2, dateOfEvent: 'another day', notes: 'the 3rd event', rating: 5
      }),
      Log.insert({
        recipeId: 3, dateOfEvent: 'the last day', notes: 'this recipe is quite bad', rating: 5
      }),
    ]);

    const firstInsertedLog = allLogs[0];

    const bestDay = await Log.findById(1);

    expect(bestDay).toEqual(firstInsertedLog);
  });

  it('should git all logs', async() => {
    const allLogs = await Promise.all([
      Log.insert({
        recipeId: 1, dateOfEvent: '05/17/1996', notes: 'best day on earth', rating: 5
      }),
      Log.insert({
        recipeId: 2, dateOfEvent: 'another day', notes: 'the 3rd event', rating: 5
      }),
      Log.insert({
        recipeId: 3, dateOfEvent: 'the last day', notes: 'this recipe is quite bad', rating: 5
      }),
    ]);


    const findAll = await Log.findAll();


    expect(findAll).toEqual(expect.arrayContaining(allLogs));
  });

  it('should update a log when given an id and updated info', async() => {
    const allLogs = await Promise.all([
      Log.insert({
        recipeId: 1, dateOfEvent: '05/17/1996', notes: 'best day on earth', rating: 5, ingredients: '{ "amount": 1, "measurement": "teaspoon", "ingredient": "salt" }'
      }),
      Log.insert({
        recipeId: 2, dateOfEvent: 'another day', notes: 'the 3rd event', rating: 5, ingredients: '{ "amount": 1, "measurement": "teaspoon", "ingredient": "salt" }'
      }),
      Log.insert({
        recipeId: 3, dateOfEvent: 'the last day', notes: 'this recipe is quite bad', rating: 5, ingredients: '{ "amount": 1, "measurement": "teaspoon", "ingredient": "salt" }'
      }),
    ]); 

    const firstInsertedLog = allLogs[0];

    const updatedLog = await Log.update(firstInsertedLog.id, { recipeId: firstInsertedLog.recipeId, dateOfEvent: '05/17/1996', notes: 'just an okay day', rating: 6, ingredients: '{ "amount": 1, "measurement": "teaspoon", "ingredient": "salt" }' });

    expect(updatedLog).toEqual({ id: firstInsertedLog.id, recipeId: Number(firstInsertedLog.recipeId), dateOfEvent: '05/17/1996', notes: 'just an okay day', rating: 6, ingredients: { amount: 1, measurement: 'teaspoon', ingredient: 'salt' } });
  });

  it('should delete an id when given an id', async() => {
    const allLogs = await Promise.all([
      Log.insert({
        recipeId: 1, dateOfEvent: '05/17/1996', notes: 'best day on earth', rating: 5
      }),
      Log.insert({
        recipeId: 2, dateOfEvent: 'another day', notes: 'the 3rd event', rating: 5
      }),
      Log.insert({
        recipeId: 3, dateOfEvent: 'the last day', notes: 'this recipe is quite bad', rating: 5
      }),
    ]);

    const firstInsertedLog = allLogs[0];

    const deletedLog = await Log.delete(firstInsertedLog.id);

    expect(deletedLog).toEqual(firstInsertedLog);
  });
});
