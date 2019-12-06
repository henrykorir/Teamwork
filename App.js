import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

import gifsRoute from './routes/gifs';
import articlesRoute from './routes/articles';
import createUserRoute from './routes/create-user';
import signInRoute from './routes/signin';
import feedRoute from './routes/feed';
import createDatabase from './models/database';

const app = express();

const rootUrl = '/';
const apiUrl = '/api/v1/';
const imageUrl = '/images';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

createDatabase();

app.use(imageUrl, express.static(path.join(__dirname, 'images')));
app.use(apiUrl, feedRoute);
app.use(apiUrl, signInRoute);
app.use(apiUrl, gifsRoute);
app.use(apiUrl, articlesRoute);
app.use(apiUrl, createUserRoute);
app.use(apiUrl, feedRoute);

export default app;