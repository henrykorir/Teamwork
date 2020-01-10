import pool from '../models/config';

const filterFeeds = (results) =>{
	let keys = results.fields.map(field => field.name);
	let prevpost = 0;
	const data = [];
	let comments = [];
	let post = {};
	let nextpost = 0;
	const feeds = results.rows;
	console.log(feeds[0]);
    for(let k = 0; k <= feeds.length;k++){
		let comment = {};
		let i = k;
		if(i === 0){
			prevpost = Number(feeds[0][10]); 
			for(let j = 0; j < feeds[i].length ; j++){
				if(j < 22)
				{
					post[keys[j]] = feeds[i][j];
				}
				else 
				{
					comment[keys[j]] = feeds[i][j];
				}
			}
			i++;
		}
		if( i < feeds.length){
			nextpost =  Number(feeds[i][10]);
		}
		else {
			i--;
			if(Number(feeds[i][10]) !== Number(feeds[i-1][10]) && feeds.length > 1) 
				nextpost = 0;
		}
		if(prevpost !== nextpost) 
		{
			post['comments']=comments;
			data.push(post);
			comments = [];
			post = {};
			for(let j = 0; j < feeds[i].length; j++){
				if(j < 22)
				{
					post[keys[j]] = feeds[i][j];
				}
				else 
				{
					comment[keys[j]] = feeds[i][j];
				}
			}
		
			prevpost =  nextpost;
		}
		else
		{
			for(let j = 22;j < feeds[i].length; j++)
			{
				comment[keys[j]] = feeds[i][j];
			}
		}
		if(Number(feeds[i][23])!==0)
			comments.push(comment);
	}
	const response = {
		status: 'success',
		data
	}
	return response;
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
				rowMode: 'array',
			};
			return client.query(query).then(
				(results) => {
					client.release();
					if(results.rowCount > 0){
						const feeds = filterFeeds(results);
						res.status(200).json({
							feeds
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