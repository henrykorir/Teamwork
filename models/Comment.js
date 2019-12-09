const commentTable = `
						DROP TABLE IF EXISTS Comment CASCADE;
						CREATE TABLE IF NOT EXISTS Comment
						(
							commentId integer NOT NULL GENERATED ALWAYS AS IDENTITY (start 1),
							comment   varchar(255) NOT NULL,
							postId    integer NOT NULL,
							UNIQUE(commentId),
							PRIMARY KEY(commentId),
							FOREIGN KEY ( postId ) REFERENCES Post ( postId )
						)
					`;
export default commentTable;






