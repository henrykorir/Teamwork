const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
	jwt.verify(token, 'RANDOM_TOKEN_SECRET').then(
	(decodedToken) =>{
		if (req.body.userId && req.body.userId !== decodedToken.userId) {
			error: "Invalid user ID";
		} else {
		  next();
		}
	})
	.catch(
		(error) =>{
			res.status(401).json({
				status: "error",
				error: error
			});
		}
	);
};