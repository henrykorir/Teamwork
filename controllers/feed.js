import pool from '../models/config';

// Accepts the array and key
const groupBy = (array, key) => {
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
  }, {}); // empty object is the initial value for result object
};

const getFeed = (req, res, next) =>{
	pool.connect().then(
		(client) => {
			const query = {
				text: `select   e.userId, e.userName, CONCAT(e.firstName,' ',e.lastname) as ownername, e.email, e.age, e.gender, e.jobrole, e.department, e.address, e.managerid, 
								p.postid, p.posttime, 
								g.gifid, g.title, g.description, g.url, g.cloudinary_upload_time,
								a.articleid, a.title, a.content, a.created_at,COALESCE(g.url, a.content) as "feed_body",
								c.commentid, c.authorid,CONCAT(ec.firstName, ' ', ec.lastname) as commentorname,c.comment, c.commented_at
						from 	Employee e
						inner join Post p 
								on e.userid = p.authorid
						full join Gif g 
								on p.postid = g.postid
						full join Article a
								on p.postid = a.postid
						full join Comment c
								on p.postid = c.postid
						left join Employee ec 
								on ec.userid = c.authorid
						order by p.posttime asc
						`,
			};
			return client.query(query).then(
				(results) => {
					client.release();
					if(results.rowCount > 0){
						console.log(results.rows);
						const feeds = groupBy(results.rows, "postid");
						res.status(200).json({
							status: "success",
							data: feeds
						});	
					}
					else 
					{
						res.status(200).json({
							status: 'success',
							data: 'No feeds yet'
						});
					}
				}
			)
			.catch(
				(error)=> {
					//client.release();
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