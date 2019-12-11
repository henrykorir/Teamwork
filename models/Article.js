const articleTable =`
					DROP TABLE IF EXISTS Article CASCADE;
					CREATE TABLE IF NOT EXISTS Article(
					articleId INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY (start 1),
					postId INTEGER NOT NULL,
					title TEXT NOT NULL,
					content TEXT NOT NULL,
					created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(0) NOT NULL ,
					UNIQUE(articleId),
					PRIMARY KEY(articleId),
					FOREIGN KEY(postId) REFERENCES Post(postId) ON UPDATE CASCADE ON DELETE CASCADE
				)`;
export default articleTable;