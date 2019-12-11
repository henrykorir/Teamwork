import { Pool } from 'pg';
const config = {
  user: 'ovidcipzamqlwa',
  password: '794d8dbaa91456297b970ddc3b3e832ea983590a3fdf6d0d7c0d688e9616e4e8',
  host: 'ec2-107-22-253-158.compute-1.amazonaws.com',
  port: 5432,
  database: 'dea2opuoqakgpj',
  ssl: true
};
const pool = new Pool(config);

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

export default pool;