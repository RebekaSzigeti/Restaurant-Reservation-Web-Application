import sql from 'mssql';
import pool, { poolConnect } from './db.js';

await poolConnect;

await pool.query(`
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='foglalas' AND xtype='U')
  BEGIN
    CREATE TABLE foglalas (
      id INT PRIMARY KEY IDENTITY(1,1),
      vendeglo_id INT,
      felhasznalo_id INT,
      ora INT,
      perc INT,
      FOREIGN KEY (vendeglo_id) REFERENCES vendeglok(id),
      FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(id)
    )
  END
`);
console.log('foglalas tabla keszen');

export const findAllFoglalas = async () => {
  const data = await pool.request().query('SELECT * FROM foglalas');
  return data.recordset;
};

export const insertFoglalas = (vendegloId, foglalas, id) => {
  return pool
    .request()
    .input('vendeglo_id', sql.Int, vendegloId)
    .input('felhasznalo_id', sql.Int, id)
    .input('ora', sql.Int, foglalas.ora)
    .input('perc', sql.Int, foglalas.perc).query(`
      INSERT INTO foglalas (vendeglo_id, felhasznalo_id, ora,perc)
      VALUES (@vendeglo_id, @felhasznalo_id, @ora, @perc)
    `);
};

export const findByVendeglo = async (id) => {
  const data = await pool.request().input('id', sql.Int, id).query('SELECT * FROM foglalas WHERE vendeglo_id = @id');
  return data.recordset;
};

export const deleteFoglalas = async (id) => {
  const data = await pool.request().input('id', sql.Int, id).query('DELETE FROM foglalas WHERE id = @id');
  return data.rowsAffected[0] > 0;
};

export const findById = async (id) => {
  const data = await pool.request().input('id', sql.Int, id).query('SELECT * FROM foglalas WHERE id = @id');
  return data.recordset[0] || null;
};
