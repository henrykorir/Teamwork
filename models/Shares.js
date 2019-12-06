const share = `
				DROP TABLE IF EXISTS Shares CASCADE;
				CREATE TABLE IF NOT EXISTS Shares(
				shareId SERIAL NOT NULL PRIMARY KEY,
				itemId INTEGER NOT NULL,
				ownerId INTEGER NOT NULL,
				sharedToId INTEGER NOT NULL,
				UNIQUE(shareId),
				FOREIGN KEY (sharedToId) REFERENCES Users(userId),
				FOREIGN KEY (itemId) REFERENCES Gifs(gifId),
				FOREIGN KEY (itemId) REFERENCES Articles(articleId),
				FOREIGN KEY (ownerId) REFERENCES Users(userId),
				FOREIGN KEY (sharedToId) REFERENCES Users(userId)
				)`;
export default share;