import pool from '../models/config';

const getComments = (array) => {
	return array.reduce((comment,pair) =>{
		let [key,value] = pair;
		if(comment[key] !== null){
			comment[key] = value;
		}
		return comment;
	},{});
}
// Accepts the array 
const groupBy = (array) => {
	let prevPostId = 0;
	let idx = 0;
	let cmt = 0;
	// Return the end result
	return array.reduce((result, currentValue) => {
		console.log(JSON.stringify(result));
	  let entries = Object.entries(currentValue);
	  if(prevPostId !== currentValue.postid){
		  let post = {};
		  let i = 0;
		  for(; i < entries.length; i++){
			  let [key, value] = entries[i];
			  if(key === "commentid")break;
			  post[key] = value;
		  }
		  cmt = i; //set the comment point
		  post["comments"] = [];
		  if(currentValue.commentid !== null){
			  let comment = getComments(entries.splice(cmt));
			  post["comments"].push(comment);
		  }
		  prevPostId = currentValue.postid;
		  result.data.push(post);
		  
		  idx = result.data.length - 1; 
	  }
	  else{
		  if(currentValue.commentid !== null){
			  let comment = getComments(entries.splice(cmt));
			  result.data[idx].comments.push(comment);
		  }
	  }
	  return result;
  }, {status: "success",data:[]}); 
};

const getFeed = (req, res, next) =>{
	pool.connect().then(
		(client) => {
			const query = {
				text: `select   COALESCE(g.gifid,a.articleid) AS id, 
								p.posttime as createdOn, 
								COALESCE(g.title, a.title) AS title,
								COALESCE(g.url, a.content) as "article/url", 
								e.userId as "authorId",
								p.postid, 
								e.userName, CONCAT(e.firstName,' ',e.lastname) as ownername, 
								e.email, e.age, e.gender, e.jobrole, e.department, e.address, e.managerid,   
								g.description, g.cloudinary_upload_time,
								a.created_at,
								c.commentid, c.authorid as commentorId,CONCAT(ec.firstName, ' ', ec.lastname) as commentorname,c.comment, c.commented_at
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
					let feeds = {};
					feeds = groupBy(results.rows);
					res.status(200).json({
						feeds
					});	
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