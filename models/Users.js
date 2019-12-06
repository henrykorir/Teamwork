const usertTable = `
					DROP TABLE IF EXISTS Users CASCADE;
					CREATE TABLE IF NOT EXISTS Users(
					userId SERIAL NOT NULL PRIMARY KEY,
					userName VARCHAR(10) NOT NULL,
					firstName VARCHAR(50) NOT NULL, 
					lastName VARCHAR(50) NOT NULL, 
					email VARCHAR(355) NOT NULL,  
					password VARCHAR(255), 
					age INTEGER, 
					gender VARCHAR(10), 
					jobRole VARCHAR(255) NOT NULL, 
					department VARCHAR(255), 
					address VARCHAR(255),
					registered_at VARCHAR(255),
					UNIQUE(userId),
					UNIQUE(userName),
					UNIQUE(email)
				)`;
export default usertTable;