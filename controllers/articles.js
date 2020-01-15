import pool from '../models/config';

export const postArticle = (req, res, next) =>{
	if(Object.keys(req.body).length === 2 && 
		Object.keys(req.body).includes('title') && 
		Object.keys(req.body).includes('content')){
		const { userid } = res.locals;
		const query = {
			text: 	`with insert_post_cte as (
						insert into Post(authorId)
						values($1) 
						returning postId
					)
					insert into Article( postId, title,content)
					select insert_post_cte.postId,$2, $3 from insert_post_cte returning *
				`,
			values: [
				userid,
				req.body.title,	
				req.body.content
			]
		};
		pool.connect().then(
			(client) => {
				return client.query(query).then(
					(results) => {
						console.log(results.rows);
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
			text: 	`UPDATE Article
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
				return client.query(query).then(
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
	const query = {
		text: `DELETE FROM Article WHERE post.postid IN  ( SELECT postId FROM Article WHERE articleId = $1 ) AND post.authorId = $2 RETURNING *`,
		values: [articleid, userid]
	};
	pool.connect().then(
		(client) => {
			return client.query(query).then(
				(results) => {
					client.release();
					if(results.rowCount > 0){
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
	let id = parseInt(req.params.articleId);
	pool.connect().then(
		(client) => {
			const query = {
				text: `SELECT article.articleid, post.posttime, article.title, article.content, comment.commentid, comment.authorid, comment.comment
						FROM article
						INNER JOIN post
						ON article.postid = post.postid
						INNER JOIN comment
						ON comment.postid = article.postid
						WHERE article.articleid = $1`,
				values: [id]
			};
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
	const query = {
		text: `insert into comment(postid, authorid, comment) select postid, $1, $2 from article where articleid = $3 returning *`,
		values: [userid,req.body.comment, articleid]
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