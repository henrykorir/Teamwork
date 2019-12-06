import jwt from 'jsonwebtoken';

const authorize = (req, res, next) => {
	const authorization = req.headers.authorization;
	if(authorization === undefined){
		res.status(401).json({
			status: 'error',
			error: 'invalid credentials!'
		});
	}
	else{
		const token = authorization.split(' ')[1];
		jwt.verify(token, 'HENRY', (error, decodedToken) =>{
			if(error){
				return res.status(401).json({
					status: 'error',
					error: error
				});
			}
			const keys = Object.keys(decodedToken);
			if(keys.includes('userId') 
				&& keys.includes('userName') 
				&& keys.includes('email')){
					
				if(req.body.email && req.body.email !== decodedToken.email){
					res.status(404).json({
						status: 'error',
						error: 'Uknown user!'
					});
				}
				else{
					res.locals.userid = decodedToken.userId;
					res.locals.username = decodedToken.userName;
					res.locals.email = decodedToken.email;
					next();
				}
			}
			else{
				res.status(401).json({
					status: 'error',
					error: decodedToken
				})
			}
		});
	}
};

export default authorize;