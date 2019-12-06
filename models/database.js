import pool from './config';
import ddl from './ddl';

const connection = () =>{
	pool.connect().then(
		(client) => {
			console.clear();
			console.log('database successfully connected');
			client.query(ddl)
			.then(
				(result) => {
					client.release();
					console.log('Tables created successfully');
				}
			)
			.catch(
				(e)=> {
					client.release();
					console.error('query error', e.message, e.stack);
				}
			)
		}
	)
	.catch(
		(error) => {
			console.log(error);
		}
	)
};
export default connection;




