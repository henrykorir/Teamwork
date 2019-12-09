import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../models/config';


const signIn = (req, res, next) =>{
	const query = {
	  name: 'fetch-user',
	  text: 'SELECT * FROM Employee WHERE email = $1',
	  values: [req.body.email],
	};
	if(Object.keys(req.body).length > 0){
		pool.connect().then(
			(client) => {
				client.query(query).then(
					(result) => {
						client.release();
						if(result.rows.length > 0){
							bcrypt.compare(req.body.password, result.rows[0].password).then(
								(valid) =>{
									if(!valid){
										return res.status(401).json({
											status: 'error',
											error: valid
										});
									}
									const token = jwt.sign(
										{
											userId: result.rows[0].userid,
											userName: result.rows[0].username,
											email: result.rows[0].email
										}, 
										'HENRY',
										{
											expiresIn: '24h'
										}
									);
									res.status(202).json({
										status:'success',
										data:{
											token: token,
											email: result.rows
										}
									});
								}
							).catch(
								(error) => {
									res.status(500).json({
										status: 'error',
										error:error
									});
								}
							);
						}
						else{
							res.status(404).json({
								status: 'error',
								error:'User not found'
							});
						}
					}
				)
				.catch(
					(error)=> {
						client.release();
						console.error('query error', error.message, error.stack);
					}
				)
			}
		)
		.catch(
			(error) => {
				console.log(error);
			}
		)
	}
	else{
		res.status(400).json({
			status: 'error',
			error: 'Empty request'
		});
	}
};
export default signIn;