const EmployeeTable = `
					DROP TABLE IF EXISTS Employee CASCADE;
					CREATE TABLE IF NOT EXISTS Employee
					(
						userId  INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY (start 1),
						userName VARCHAR(64) NOT NULL,
						firstName VARCHAR(64) NOT NULL, 
						lastName VARCHAR(64) NOT NULL, 
						email VARCHAR(355) NOT NULL,  
						password VARCHAR(255), 
						age INTEGER, 
						gender VARCHAR(10), 
						jobRole VARCHAR(255), 
						department VARCHAR(255), 
						address VARCHAR(255),
						managerId  INTEGER NULL,
						registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(0) NOT NULL,
						UNIQUE(userId),
						UNIQUE(userName),
						UNIQUE(email),
						FOREIGN KEY ( managerId ) REFERENCES Employee ( userId )
					)`;
export default EmployeeTable;