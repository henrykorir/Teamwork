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
export default ddl;