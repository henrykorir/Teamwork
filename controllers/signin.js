const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signIn = (req, res, next) =>{
	User.findOne({email: req.body.email}).then(
		(user) => {
			if(!user){
				return res.status(401).json({
					error: new Error('User not found!')
				});
			}
			bcrypt.compare(req.body.password, user.password).then(
				(valid) =>{
					if(!valid){
						return res.status(401).json({
							error: new Error('Incorrect password!')
						});
					}
					const token = jwt.sign(
					{uerId: user._id }, 
					'RANDOM_TOKEN_SECRET',
					{expiresIn: '24h'});
					res.status(200).json({
						userId: user._id,
						token: token
					});
				}
			).catch(
				(error) => {
					res.status(500).json({
						error:error
					});
				}
			);
		}
	).catch(
		(error) => {
			res.status(500).json({
				error: error
			});
		}
	)				
};