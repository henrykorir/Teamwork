import pool from '../models/config';

const filterFeeds = (feeds) =>{
	let keys =[
		"userid","username","firstname","lastname", 
		"email", "age","gender","jobrole","department",
		"address","managerid","postid","posttime","gifid",
		"title","description","url","cloudinary_upload_time",
		"articleid","title","content","created_at","feed_body",
		"commentid","authorid","commentor","comment","commented_at"
	];    
	let prevpost = 0;
	const data = [];
	let comments = [];
	let post = {};
	let nextpost = 0;
    for(let k = 0; k<= feeds.length;k++){
		let comment = {};
		let i = k;
		if(i === 0 ){
			prevpost = Number(feeds[0][11].trim());
			for(j = 0; j < feeds[i].length; j++){
				if(j <= 22)
				{
					post[keys[j]] = feeds[i][j].trim();
				}
				else 
				{
					comment[keys[j]] = feeds[i][j].trim();
				}
			}
			i++;
		}
		if( i < feeds.length)
			nextpost =  Number(feeds[i][11].trim());
		else {
			i--;
			if(Number(feeds[i][11].trim()) !== Number(feeds[i-1][11].trim())) 
				nextpost = 0;
		}
		if(prevpost !== nextpost) 
		{
			post['comments']=comments;
			data.push(post);
			comments = [];
			post = {};
			for(j = 0; j < feeds[i].length; j++){
				if(j <= 22)
				{
					post[keys[j]] = feeds[i][j].trim();
				}
				else 
				{
					comment[keys[j]] = feeds[i][j].trim();
				}
			}
		
			prevpost =  nextpost;
		}
		else
		{
			for(j = 23;j < feeds[i].length; j++){
				comment[keys[j]] = feeds[i][j].trim();
			}
		}
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
				text: `select   e.userId, e.userName, concat(e.firstName,' ',e.lastname) as ownername, e.email, e.age, e.gender, e.jobrole, e.department, e.address, e.managerid, 
								p.postid, p.posttime, 
								g.gifid, g.title, g.description, g.url, g.cloudinary_upload_time,
								a.articleid, a.title, a.content, a.created_at,COALESCE(g.url, a.content) as "feed_body",
								c.commentid, c.authorid,concat(ec.firstName, ' ', ec.lastname) as commentorname,c.comment, c.commented_at
						from 	Employee e
						inner join Post p 
								on e.userid = p.authorid
						full join Gif g 
								on p.postid = g.postid
						full join Article a
								on p.postid = a.postid
						full join Comment c
								on p.postid = c.postid
						inner join Employee ec 
								on c.userid = ec.authorid
						order by p.posttime asc
						`
			};
			return client.query(query).then(
				(results) => {
					client.release();
					console.log(results.rows);
					if(results.rowCount > 0){
						const feeds = filterFeeds(results.rows);
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