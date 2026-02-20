import sql from 'mssql';
import pool, { poolConnect } from './db.js';

await poolConnect;

await pool.query(`
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='fenykep' AND xtype='U')
  BEGIN
    CREATE TABLE fenykep (
      id INT PRIMARY KEY IDENTITY(1,1),
      vendeglo_id INT,
      fajlnev NVARCHAR(255),
      FOREIGN KEY (vendeglo_id) REFERENCES vendeglok(id)
    )
  END
  `);
console.log('fenykep tabla keszen');

export const findAllFenykep = async () => {
  const data = await pool.request().query('SELECT * FROM fenykep');
  return data.recordset;
};

export const insertFenykep = (vendegloId, filename) => {
  return pool.request().input('vendeglo_id', sql.Int, vendegloId).input('fajlnev', sql.NVarChar, filename).query(`
      INSERT INTO fenykep (vendeglo_id, fajlnev)
      VALUES (@vendeglo_id, @fajlnev)
    `);
};

export const findByVendeglo = async (id) => {
  const data = await pool.request().input('id', sql.Int, id).query('SELECT * FROM fenykep WHERE vendeglo_id = @id');
  return data.recordset;
};
