const articleCommentTable = `
					DROP TABLE IF EXISTS Article_comments CASCADE;
					CREATE TABLE IF NOT EXISTS Article_comments(
					commentId SERIAL NOT NULL PRIMARY KEY,
					articleId INTEGER NOT NULL,
					authorId INTEGER NOT NULL,
					comment VARCHAR(255),
					UNIQUE(commentId),
					FOREIGN KEY(articleId) REFERENCES Articles(articleId) ON DELETE CASCADE,
					FOREIGN KEY(authorId) REFERENCES Users(userId) ON DELETE CASCADE
				)`;
export default articleCommentTable;