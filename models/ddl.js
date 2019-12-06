import  userTable from './Users';
import  gifTable from './Gifs';
import  articleTable  from './Articles';
import  articleCommentTable  from './Article-comments';
import  gifCommentTable  from './Gif-comments';
import  SharesTable  from './Shares';

const ddl =`${userTable}; 
			${gifTable}; 
			${articleTable}; 
			${articleCommentTable};
			${gifCommentTable};
			${SharesTable};
			`;
/*
select *
from users u 
inner join gifs g 
	on u.userid = g.authorid
inner join gif_comments cg 
	on g.gifid = cg.gifid
inner join articles a
	on u.userid = a.authorid
inner join article_comments ca
	on a.articleid = ca.articleid
order by g.created_at asc, a.created_at asc;
*/
export default ddl;