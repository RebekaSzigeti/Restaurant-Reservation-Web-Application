import sql from 'mssql';
import pool, { poolConnect } from './db.js';

await poolConnect;

await pool.query(`
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='felhasznalo' AND xtype='U')
BEGIN
  CREATE TABLE felhasznalo (
    id INT PRIMARY KEY IDENTITY(1,1),
    nev NVARCHAR(100),
    email NVARCHAR(100),
    hash NVARCHAR(200)
  )
END
`);
console.log('felhasznalo tabla keszen');

export const findAllFelhasznalo = async () => {
  const data = await pool.request().query('SELECT * FROM felhasznalo');
  return data.recordset;
};

export const findFelhasznalokByVendeglo = async (vendegloId) => {
  const data = await pool.request().input('id', sql.Int, vendegloId).query(`
      SELECT DISTINCT f.*
      FROM felhasznalo f
      JOIN foglalas fog ON fog.felhasznalo_id = f.id
      WHERE fog.vendeglo_id = @id
    `);

  return data.recordset;
};

export const findFelhasznaloAuthByNev = async (nev) => {
  const result = await pool.request().input('nev', sql.NVarChar, nev).query(`
      SELECT hash
      FROM felhasznalo
      WHERE nev = @nev
    `);

  return result.recordset[0]?.hash || null;
};

export const findFelhasznaloIdByNev = async (nev) => {
  const result = await pool.request().input('nev', sql.NVarChar, nev).query(`
      SELECT id
      FROM felhasznalo
      WHERE nev = @nev
    `);

  return result.recordset[0]?.id || null;
};
