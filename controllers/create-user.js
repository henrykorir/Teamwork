import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import pool from '../models/config';

const createUser  = (req, res, next) =>{
	console.clear();
	console.log("creating user ...");
	if(Object.keys(req.body).length > 0){
		
		bcrypt.hash(req.body.password, 10).then(
			(hash) =>{
				const query = {
					text: 	`INSERT INTO Employee(userName, firstName, lastName,email, password, gender, jobRole, department, address) 
							VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
							`,
					values: [
						req.body.username,
						req.body.firstname,					
						req.body.lastname,										
						req.body.email, 
						hash, 
						req.body.gender, 
						req.body.jobrole, 
						req.body.department, 
						req.body.address 
					]
				};
				pool.connect().then(
					(client) => {
						return client.query(query).then(
							(result) => {
								client.release();
								console.clear();
								console.log('User account successfully created');
								const token = jwt.sign(
									{
										userId: result.rows[0].userid,
										userName: result.rows[0].username,
										email: result.rows[0].email,
										loggedin:'false',
										role: 'user'
									}, 
									'HENRY',
									{ 
										expiresIn: '24h'
									}
								);
								res.status(201).json({
									status:'success',
									data : {
										message:'User account successfully created',
										token: token,
										userId: result.rows[0].userid
									}
								});
							}
						)
						.catch(
							(error)=> {
								client.release();
								console.log(error);
								res.status(403).json({
									status: 'error',
									error: error.detail
								});
							}
						);
					}
				)
				.catch(
					(error) => {
						console.log(error);
					}
				);
			}
		)
		.catch(
			(error) =>{
				res.status(500).json({
					status:"error",
					error: error
				});
			}
		);
	}
	else{
		res.status(400).json({
			status: 'error',
			error: 'Empty request'
		});
	}
}; 
export default createUser;