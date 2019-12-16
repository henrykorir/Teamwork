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
		console.log(path);
		console.log(userid);
		console.log(username);
		cloudinary.uploader.upload(path,{folder: username, timeout: 60000}).then(
			(result) =>{
				console.log('gif uploaded to cloudinary successfully');
				const url = JSON.stringify(
					{
						http_url: result.url, 
						https_url:result.secure_url
					}
				);
				const query = {
					text: 	`with insert_post_cte as (
								insert into Post(authorId)
								values($1) 
								returning postId
							)
							insert into Gif(publicId, postId, title, url, description, cloudinary_upload_time)
							select $2, insert_post_cte.postId,$3, $4, $5, $6 from insert_post_cte returning *
						`,
					values: [
						userid,
						result.public_id,
						req.body.title,	
						url,
						req.body.description,
						result.created_at
					]
				};
				pool.connect().then(
					(client) => {
						return client.query(query).then(
							(query_results) => {
								client.release();
								res.status(200).json({
									status: "success",
									data:{
										gifId: query_results.rows[0].gifid, 
										message: "GIF image successfully posted",
										createdOn: query_results.created_at,
										imageUrl:JSON.parse(query_results.rows[0].url),
										cloudinary: result
									}
								});
								console.log('GIF image record created successfully');
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
				console.log('local file removed successfully');
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
	let id = parseInt(req.params.gifId); 
	const query = {
		text: `SELECT gif.gifid, post.posttime, gif.title, gif.url, comment.commentid, comment.authorid, comment.comment
				FROM gif
				INNER JOIN post
				ON gif.postid = post.postid
				INNER JOIN comment
				ON comment.postid = gif.postid
				WHERE gif.gifid = $1`,
		values: [id]
	};
	pool.connect().then(
		(client) => {
			return client.query(query).then(
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
								'url': JSON.parse(results.rows[0].url),
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
export const getPublicId = (req, res, next) =>{
	let gifid = parseInt(req.params.gifId);
	const query={
		text: `SELECT * FROM Gif WHERE gifid = $1`,
		values: [gifid]
	};
	pool.connect().then(
		(client) => {
			return client.query(query).then(
				(results) => {
					client.release();
					if(results.rowCount > 0){
						res.locals.publicid = results.rows[0].publicid;
						next();
					}
					else{
						return res.status(404).json({
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
			res.status(500).json({
				status: 'error',
				error: error
			});
		}
	);
}
export const deleteGifById = (req, res) =>{
	let gifid = parseInt(req.params.gifId); 
	let userid = parseInt(res.locals.userid);
	let publicid = res.locals.publicid;

	const query = {
		text: `DELETE FROM Post WHERE EXISTS ( SELECT * FROM Gif WHERE gifid = $1 ) AND post.authorid = $2 RETURNING *`,
		values: [gifid, userid]
	};
	pool.connect().then(
		(client) => {
			return client.query(query).then(
				(results) => {
					client.release();
					if(results.rowCount > 0){
						cloudinary.uploader.destroy(publicid).then(
							(result)=>{
								console.log('Gif deleted successfully');
								res.status(200).json({  
									status:'success',  
									data:{ 
										message:'gif post successfully deleted',
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
							error: 'Failed to delete the gif'
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
			res.status(500).json({
				status: 'error',
				error: error
			});
		}
	);
}
export const postCommentByGifId = (req, res, next) =>{
	let gifid = parseInt(req.params.gifId); 
	let userid = parseInt(res.locals.userid);
	const query = {
		text: `insert into comment(postid, authorid, comment) select postid, $1, $2 from gif where gifid = $3 returning *`,
		values: [userid, req.body.comment, gifid]
	};
	pool.connect().then(
		(client) => {
			return client.query(query).then(
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