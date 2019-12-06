import fs from 'fs';
import { v2 } from 'cloudinary';

import pool from '../models/config';

const cloudinary = v2;

cloudinary.config({
	cloud_name: 'henrykorir',
	api_key: '513554986993748',
	api_secret: 'DnrvCSRuAvHvfxhbPMkJYb75VGw'
});

export const postGif = (req, res, next) =>{
	if(Object.keys(req).includes('files') && (req.files.length > 0)){
		const { path } = req.files[0];
		const {userid, username} = res.locals;
		console.log(req.files);
		cloudinary.uploader.upload(path,{folder: username}).then(
			(result) =>{
				const url = JSON.stringify(
					{
						http_url: result.url, 
						https_url:result.secure_url
					}
				);
				const query = {
					text: 	`INSERT INTO Gifs(publicId, authorId, title,description, url, created_at) 
							VALUES($1, $2, $3, $4, $5, $6) RETURNING *
							`,
					values: [
						result.public_id,
						userid,					
						req.body.title,										
						req.body.description, 
						url,
						result.created_at.replace('T',' ').replace('Z', ' ')
					]
				};
				pool.connect().then(
					(client) => {
						client.query(query).then(
							(query_results) => {
								client.release();
								res.status(200).json({
									status: "success",
									data:{
										gifId: query_results.rows[0].gifid, 
										message: "GIF image successfully posted",
										createdOn: query_results.created_at,
										imageUrl:query_results.rows[0].url,
										cloudinary: result
									}
								});
								console.clear();
								console.log("GIF image successfully posted");
							}
						)
						.catch(
							(error)=> {
								client.release();
								console.log(error);
								res.status(403).json({
									status: 'error',
									error: error
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
			(error) => {
				console.log(error);
				res.status(400).json({
					status: "error",
					error: error
				});
			}
		);
		fs.unlink(path, (err) => {
			if (err) {
				console.error(err);
			}
			else{
				console.log('file removed successfully');
			}
		});
	}
	else{
		res.status(400).json({
			status: 'error',
			error: 'Provide gif file'
		});
	}
}
export const getGifById = (req, res, next) =>{
	let id = parseInt(req.params.gifId); //id looked in the database
	pool.connect().then(
		(client) => {
			const query = {
				text: `SELECT *
						FROM Gifs g
						INNER JOIN gif_comments gc
						ON g.gifid = gc.gifid
						WHERE g.gifid = $1`,
				values: [id]
			};
			client.query(query).then(
				(results) => {
					if(results.rowCount> 0){
						const records = results.rows;
						let comments = [];
						records.forEach((row) => {
							let temp = {};
							temp.commentId = row.commentid;
							temp.comment = row.comment;
							temp.authorId = row.authorid;
							comments.push(temp);
						});
						res.status(200).json({
							status: 'success',
							data: {
								'id': results.rows[0].gifid,
								'createdOn': results.rows[0].created_at,
								'title': results.rows[0].title,
								'url': results.rows[0].url,
								comments
							}
						});
					}
					else{
						res.status(404).json({
							status: 'error',
							error: 'Gif not found'
						});
					}
				}
			)
			.catch(
				(error)=> {
					client.release();
					console.log(error);
					res.status(403).json({
						status: 'error',
						error: error
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
export const deleteGifById = (req, res) =>{
	let gifid = parseInt(req.params.gifId); 
	let userid = parseInt(res.locals.userid);
	console.log(gifid, userid);
	pool.connect().then(
		(client) => {
			const query = {
				text: `DELETE FROM Gifs WHERE gifId = $1 AND authorid = $2 RETURNING *`,
				values: [gifid, userid]
			};
			client.query(query).then(
				(results) => {
					client.release();
					if(results.rowCount > 0){
						cloudinary.uploader.destroy(results.rows[0].publicid).then(
							(result)=>{
								console.log(result,'\ngif deleted successfully');
								res.status(200).json({  
									status:'success',  
									data:{ 
										message:'gif post successfully deleted' 
									}  
								});
							}
						)
						.catch(
							(error) =>{
								console.log(error);
							}
						)
						 
					}
					else{
						res.status(404).json({
							status: 'error',
							error: 'Gif not found'
						});
					}
				}
			)
			.catch(
				(error)=> {
					client.release();
					console.log(error);
					res.status(403).json({
						status: 'error',
						error: error
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
export const postCommentByGifId = (req, res, next) =>{
	let gifid = parseInt(req.params.gifId); 
	let userid = parseInt(res.locals.userid);
	pool.connect().then(
		(client) => {
			const query = {
				text: `INSERT INTO Gif_comments(gifId, authorId,comment) VALUES($1, $2, $3) RETURNING *`,
				values: [gifid, userid, req.body.comment]
			};
			client.query(query).then(
				(results) => {
					client.release();
					if(results.rowCount > 0){
						res.status(201).json({
							comment: results.rows[0].comment
						});
					}
					else{
						res.status(404).json({
							status: 'error',
							error: 'comment creation failed peration failed'
						});
					}
				}
			)
			.catch(
				(error)=> {
					client.release();
					console.error(error);
					res.status(403).json({
						status: 'error',
						error: error
					});
				}
			);
		}
	)
	.catch(
		(error) => {
			console.log(error);
			res.status(500).json({
				status: 'error',
				error: error
			});
		}
	);
}