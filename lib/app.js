const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/v1/recipes', require('./controllers/recipe'));
app.use('/api/v1/logs', require('./controllers/log'));


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
