const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');
const Log = require('../lib/models/log');

describe('log routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('add a log to the data base', () => {
    return request(app)
      .post('/api/v1/logs')
      .send({
        recipeId: 1,
        dateOfEvent: '05/17/1996',
        notes: 'best day on earth',
        rating: 5
      })
      .then(res => expect(res.body).toEqual({ id: '1', recipeId: 1, dateOfEvent: '05/17/1996', notes: 'best day on earth', rating: 5 }));
  });

  it('should get a log by id', async() => {
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

    return request(app)
      .get(`/api/v1/logs/${firstInsertedLog.id}`)
      .then(res => expect(res.body).toEqual(firstInsertedLog));
  });

});


describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('should get a recipe by an id', async() => {
    await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));


    return request(app)
      .get('/api/v1/recipes/1')
      .then(res => {
        expect(res.body).toEqual({ name: 'cookies', directions: [], id: '1' });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('should delete a recipe when given an idea', async() => {
    const allRecipesInserted = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    await request(app)
      .delete(`/api/v1/recipes/${allRecipesInserted[0].id}`)
      .then(res => {
        expect(res.body).toEqual({ name: 'cookies', directions: [], id: allRecipesInserted[0].id });
      });

    return request(app)
      .get(`/api/v1/recipes/${allRecipesInserted[0].id}`)
      .then(res => {
        expect(res.body).toEqual({});
      });
    

  });
});
