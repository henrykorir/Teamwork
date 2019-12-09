import  userTable from './User';
import  postTable from './Post';
import  gifTable from './Gif';
import  articleTable  from './Article';
import  commentTable  from './Comment';
import  ShareTable  from './Share';

const ddl =`${userTable}; 
			${postTable}; 
			${gifTable}; 
			${articleTable}; 
			${commentTable};
			${ShareTable};
			`;
export default ddl;