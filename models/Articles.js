const articleTable =`
					DROP TABLE IF EXISTS Articles CASCADE;
					CREATE TABLE IF NOT EXISTS Articles(
					articleId SERIAL NOT NULL PRIMARY KEY,
					authorId INTEGER NOT NULL,
					title TEXT NOT NULL,
					content TEXT NOT NULL,
					created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(0) NOT NULL ,
					UNIQUE(articleId),
					FOREIGN KEY(authorId) REFERENCES Users(userId) ON DELETE CASCADE
				)`;
export default articleTable;