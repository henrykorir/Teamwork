const gifTable = `
				DROP TABLE IF EXISTS Gif CASCADE;
				CREATE TABLE IF NOT EXISTS Gif
				(
					gifId  INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY (start 1),
					publicId INTEGER NOT NULL,
					postId integer NOT NULL,
					title  varchar(50) NOT NULL,
					url    varchar(255) NOT NULL,
					description    varchar(255),
					UNIQUE(gifId),
					PRIMARY KEY(gifId),
					FOREIGN KEY ( postId ) REFERENCES Post ( postId ) ON UPDATE CASCADE ON DELETE CASCADE			
				)`;
export default gifTable;
/*
with insert_post_cte as (
	insert into Post(authorId)
	values($1) returning postId
)
insert into Gif(publicId, title, url, postId)
values($2, $3, $4)
select insert_post_cte.postId) 
with insert_post_cte as (
	insert into Post(authorId, posttime)
	values(1, now()) 
	returning postId
)
insert into Gif(publicId, title, url, postId)
select 11,'igot', 'www.example.com',insert_post_cte.postId from insert_post_cte;
with insert_post_cte as (
	insert into Post(authorId, posttime)
	values($1, now()) 
	returning postId
)
insert into Gif(publicId, title, url, postId)
select $2, $3, $4, $5 from insert_post_cte;
*/