const { Router } = require('express');
const Log = require('../models/log');

module.exports = Router()
  .post('', (req, res, next) => {
    console.log(req.body);
    Log.insert(req.body)
      .then(log => res.send(log))
      .catch(next);
  });
