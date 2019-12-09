const gifTable = `
				DROP TABLE IF EXISTS Gif CASCADE;
				CREATE TABLE IF NOT EXISTS Gif
				(
					gifId  INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY (start 1),
					title  varchar(50) NOT NULL,
					url    varchar(255) NOT NULL,
					postId integer NOT NULL,
					UNIQUE(gifId),
					PRIMARY KEY(gifId),
					FOREIGN KEY ( postId ) REFERENCES Post ( postId )				
				)`;
export default gifTable;