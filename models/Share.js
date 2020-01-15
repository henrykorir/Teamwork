const shareTable = `
						
						CREATE TABLE IF NOT EXISTS Share
						(
							shareId   integer NOT NULL GENERATED ALWAYS AS IDENTITY (start 1 ),
							shareToId integer NOT NULL,
							postId    integer NOT NULL,
							shareTime timestamp(6) with time zone NOT NULL,
							UNIQUE(shareId),
							FOREIGN KEY ( shareToid ) REFERENCES Employee ( userId ),
							FOREIGN KEY ( postId ) REFERENCES Post ( postId )
						)
					`;
export default shareTable;