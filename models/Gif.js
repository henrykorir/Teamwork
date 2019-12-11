const gifTable = `
				DROP TABLE IF EXISTS Gif CASCADE;
				CREATE TABLE IF NOT EXISTS Gif
				(
					gifId  INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY (start 1),
					publicId varchar NOT NULL,
					postId integer NOT NULL,
					title  varchar(50),
					url    varchar(255) NOT NULL,
					description    varchar(255),
					cloudinary_upload_time varchar(255),
					UNIQUE(gifId),
					PRIMARY KEY(gifId),
					FOREIGN KEY ( postId ) REFERENCES Post ( postId ) ON UPDATE CASCADE ON DELETE CASCADE			
				)`;
export default gifTable;