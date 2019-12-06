import pool from '../models/config';

export const postArticle = (req, res, next) =>{
	if(Object.keys(req.body).length === 2 && 
		Object.keys(req.body).includes('title') && 
		Object.keys(req.body).includes('content')){
		const query = {
			text: 	`INSERT INTO Articles(authorId, title,content) 
					VALUES($1, $2, $3) RETURNING *
					`,
			values: [
				parseInt(res.locals.userid),
				req.body.title,
				req.body.content
			]
		};
		pool.connect().then(
			(client) => {
				client.query(query).then(
					(results) => {
						client.release();
						res.status(201).json({  
						status:'success',  
							data:{ 
								message:'Article successfully posted', 
								articleId:results.rows[0].articleid, 
								createdOn:results.rows[0].created_at, 
								title:results.rows[0].title, 
							} 
						});
					}
				)
				.catch(
					(error)=> {
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
	else{
		res.status(400).json({
			status:'error',
			error: 'invalid entries'
		})
	}
}
export const patchArticleById = (req, res, next) =>{
	if(Object.keys(req.body).length > 0 
		&& 
		(
			Object.keys(req.body).includes('title') || 
			Object.keys(req.body).includes('content')
		)
		&& req.params.articleId !== undefined
		){
		
		const query = {
			text: 	`UPDATE Articles 
					SET title = $1, content = $2 
					WHERE articleid = $3 AND authorid = $4
					RETURNING *
					`,
			values: [
				req.body.title,
				req.body.content,
				parseInt(req.params.articleId),
				parseInt(res.locals.userid)
			]
		};
		pool.connect().then(
			(client) => {
				client.query(query).then(
					(results) => {
						client.release();
						res.status(201).json({  
						status:'success',  
							data:{ 
								message:'Article successfully updated', 
								title:results.rows[0].title, 
								article:results.rows[0].content 
							} 
						});
					}
				)
				.catch(
					(error)=> {
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
	else{
		res.status(400).json({
			status:'error',
			error: 'invalid entries'
		})
	}
	
}
export const deleteArticleById = (req, res, next) =>{
	let articleid = parseInt(req.params.articleId); 
	let userid = parseInt(res.locals.userid);
	console.log(articleid, userid);
	pool.connect().then(
		(client) => {
			console.log(articleid, userid);
			const query = {
				text: `DELETE FROM Articles WHERE articleid = $1 AND authorid = $2 RETURNING *`,
				values: [articleid, userid]
			};
			client.query(query).then(
				(results) => {
					console.log(articleid, userid);
					client.release();
					if(results.rowCount > 0){
						console.log(results,'Article deleted successfully');
						res.status(200).json({  
							status:'success',  
							data:{ 
								message:'Article successfully deleted' 
							}  
						});
						 
					}
					else{
						res.status(404).json({
							status: 'error',
							error: 'Article not found'
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
export const getArticleById = (req, res, next) =>{
	let id = parseInt(req.params.articleId); //id looked in the database
	pool.connect().then(
		(client) => {
			const query = {
				text: `SELECT *
						FROM Articles a
						INNER JOIN Article_comments ac
						ON a.articleId = ac.articleId
						WHERE a.articleId = $1 AND a.authorId = ac.authorId
						`,
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
								'article': results.rows[0].article,
								comments
							}
						});
					}
					else{
						res.status(404).json({
							status: 'error',
							error: 'Article not found'
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
export const postCommentByArticleId = (req, res, next) =>{
	let articleid = parseInt(req.params.articleId); //id looked in the database
	let userid = parseInt(res.locals.userid); //id looked in the database
	pool.connect().then(
		(client) => {
			const query = {
				text: `INSERT INTO Article_comments(articleId, authorId,comment) VALUES($1, $2, $3) RETURNING *`,
				values: [articleid, userid, req.body.comment]
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
							error: 'comment post failed '
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