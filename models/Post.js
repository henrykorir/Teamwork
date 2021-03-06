const postTable =`
					
					CREATE TABLE IF NOT EXISTS Post
					(
						postId   integer NOT NULL GENERATED ALWAYS AS IDENTITY (start 1),
						authorId integer NOT NULL,
						postTime  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(0) NOT NULL,
						UNIQUE(postId),
						PRIMARY KEY(postId),
						FOREIGN KEY ( authorId ) REFERENCES Employee( userid ) ON DELETE CASCADE
					)
				`;
export default postTable;