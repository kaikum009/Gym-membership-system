import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    port: 5432,
    database: 'gym'
  });
  
  pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(err => {
      console.error("Connection error:", err);
      process.exit(1);
    });

    export default pool;