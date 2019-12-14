import pool from '../models/config';

const getFeed = (req, res, next) =>{
	pool.connect().then(
		(client) => {
			const query = {
				text: `select *
						from users u 
						left join gifs g 
							on u.userid = g.authorid
						left join gif_comments cg 
							on g.gifid = cg.gifid
						left join articles a
							on u.userid = a.authorid
						left join article_comments ca
							on a.articleid = ca.articleid
						order by g.created_at asc, a.created_at asc
						`
			};
			return client.query(query).then(
				(results) => {
					client.release();
					console.log(results.rows[0]);
					res.status(200).json({
							status: 'success',
							data: results.rows
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
			res.status(500).json({
				status:'error',
				error: error
			});
		}
	);
}
export default getFeed;