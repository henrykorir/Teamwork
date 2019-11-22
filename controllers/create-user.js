const bcrypt = require('bcryptjs');
//const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.createUser  = (req, res, next) =>{
	console.clear();
	console.log("creating user ...");
	res.json({message: "User created successfully!"});
	/*bcrypt.hash(req.body.password, 10).then(
		(hash) =>{
			const user = new User({
				email: req.body.email,
				password: hash
			});
			user.save(
				() => {
					res.status(201).json({
						message: 'User added successfully!'
					});
				}
			).catch(
				(error) => {
					res.status(500).json({
						error: error
					});
				}
			);
		}
	);*/
}; 