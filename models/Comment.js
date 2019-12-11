const commentTable = `
						DROP TABLE IF EXISTS Comment CASCADE;
						CREATE TABLE IF NOT EXISTS Comment
						(
							commentId integer NOT NULL GENERATED ALWAYS AS IDENTITY (start 1),
							postId    integer NOT NULL,
							authorid integer NOT NULL,
							comment  varchar(255) NOT NULL,
							commented_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(0) NOT NULL,
							UNIQUE(commentId),
							PRIMARY KEY(commentId),
							FOREIGN KEY ( postId ) REFERENCES Post ( postId ) ON DELETE CASCADE,
							FOREIGN KEY ( authorid ) REFERENCES Employee ( userid ) ON DELETE CASCADE
						)
					`;
export default commentTable;






