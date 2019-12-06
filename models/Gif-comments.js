const gifCommentTable = `
					DROP TABLE IF EXISTS Gif_comments CASCADE;
					CREATE TABLE IF NOT EXISTS Gif_comments(
					commentId SERIAL NOT NULL PRIMARY KEY,
					gifId INTEGER NOT NULL,
					authorId INTEGER NOT NULL,
					comment TEXT,
					UNIQUE(commentId),
					FOREIGN KEY(gifId) REFERENCES Gifs(gifId) ON DELETE CASCADE,
					FOREIGN KEY(authorId) REFERENCES Users(userId) ON DELETE CASCADE
				)`;
export default gifCommentTable;