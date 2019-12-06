const gifTable = `
					DROP TABLE IF EXISTS Gifs CASCADE;
					CREATE TABLE IF NOT EXISTS Gifs(
					gifId SERIAL NOT NULL PRIMARY KEY,
					publicId VARCHAR(255) NOT NULL,
					authorId INTEGER NOT NULL,
					title VARCHAR(255),
					description VARCHAR(255),
					url VARCHAR(255) NOT NULL,
					created_at VARCHAR(255),
					UNIQUE(gifId),
					FOREIGN KEY(authorId) REFERENCES Users(userId) ON DELETE CASCADE
				)`;
export default gifTable;