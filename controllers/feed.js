import pool from '../models/config';

const getFeed = (req, res, next) =>{
	pool.connect().then(
		(client) => {
			const query = {
				text: `select   e.userId, e.userName, e.firstName, e.lastname, e.email, e.age, e.gender, e.jobrole, e.department, e.address, e.managerid, 
								p.postid, p.posttime, 
								g.gifid, g.title, g.description, g.url, g.cloudinary_upload_time,
								a.articleid, a.title, a.content, a.created_at,COALESCE(g.url, a.content) as "feed_body",
								c.commentid, c.authorid,concat(ec.firstName, ' ', ec.lastname) as commentor,c.comment, c.commented_at
						from 	Employee e
						inner join Post p 
								on e.userid = p.authorid
						full join Gif g 
								on g.postid = p.postid
						full join Article a
								on a.postid = p.postid
						full join Comment c
								on c.postid = p.postid
						left join Employee ec 
								on ec.userid = c.authorid
						order by p.posttime asc
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