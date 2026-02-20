import sql from 'mssql';

const pool = new sql.ConnectionPool({
  server: 'localhost',
  user: '',
  password: '',
  database: 'webprog',
  options: { trustServerCertificate: true },
});

export const poolConnect = pool.connect();
export default pool;
