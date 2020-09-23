const { Router } = require('express');
const Log = require('../models/log');

module.exports = Router()
  .post('', (req, res, next) => {
    Log.insert(req.body)
      .then(log => res.send(log))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Log.findById(req.params.id)
      .then(log => res.send(log))
      .catch(next);
  })

  .get('', (req, res, next) => {
    Log.findAll()
      .then(logs => res.send(logs))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    console.log(req.params.id, 'id to update');
    console.log(req.body, 'body to update inside route');
    Log.update(req.params.id, req.body)
      .then(updatedLog => res.send(updatedLog))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Log.delete(req.params.id)
      .then(deletedLog => res.send(deletedLog))
      .catch(next);
  });


