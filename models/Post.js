const postTable =`
					DROP TABLE IF EXISTS Post CASCADE;
					CREATE TABLE IF NOT EXISTS Post
					(
						postId   integer NOT NULL GENERATED ALWAYS AS IDENTITY (start 1),
						authorId integer NOT NULL,
						postTime timestamp(6) with time zone NOT NULL,
						UNIQUE(postId),
						PRIMARY KEY(postId),
						FOREIGN KEY ( authorId ) REFERENCES Employee( userid ) ON DELETE CASCADE
					)
				`;
export default postTable;