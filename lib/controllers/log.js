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
  });