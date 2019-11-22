const express = require('express');
const bodyParser = require('body-parser');
const path  = require('path');

const routes = require('./routes/routes');

const app = express();

const baseUrl = '/api/v1/';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(baseUrl, routes.gifsRoute);
app.use(baseUrl, routes.articlesRoute);
app.use(baseUrl, routes.createUserRoute);
app.use(baseUrl, routes.signInRoute);
app.use(baseUrl, routes.feedRoute);


module.exports = app;