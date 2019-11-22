const gifsRoute = require('./gifs');
const articlesRoute = require('./articles');
const createUserRoute = require('./create-user');
const signInRoute = require('./signin');
const feedRoute = require('./feed');
const routes = {
	gifsRoute,
	articlesRoute,
	createUserRoute,
	signInRoute,
	feedRoute
};
module.exports = routes;