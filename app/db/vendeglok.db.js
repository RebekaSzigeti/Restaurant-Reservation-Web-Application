import sql from 'mssql';
import pool, { poolConnect } from './db.js';

await poolConnect;

await pool.query(`
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='vendeglok' AND xtype='U')
  BEGIN
    CREATE TABLE vendeglok (
      id INT PRIMARY KEY IDENTITY(1,1),
      varos NVARCHAR(50),
      utca NVARCHAR(50),
      hazszam NVARCHAR(20),
      telefonszam NVARCHAR(50),
      nyit_ora INT,
      nyit_perc INT,
      zaras_ora INT,
      zaras_perc INT
    )
  END
`);
console.log('vendeglok tabla keszen');

export const findAllVendeglo = async () => {
  const data = await pool.request().query('SELECT * FROM vendeglok');
  return data.recordset;
};

export const insertVendeglo = (vendeglo) => {
  return pool
    .request()
    .input('varos', sql.NVarChar, vendeglo.varos)
    .input('utca', sql.NVarChar, vendeglo.utca)
    .input('hazszam', sql.NVarChar, vendeglo.hazszam)
    .input('telefonszam', sql.NVarChar, vendeglo.telefonszam)
    .input('nyit_ora', sql.Int, vendeglo.kezdetOra)
    .input('nyit_perc', sql.Int, vendeglo.kezdetPerc)
    .input('zaras_ora', sql.Int, vendeglo.vegeOra)
    .input('zaras_perc', sql.Int, vendeglo.vegePerc).query(`
      INSERT INTO vendeglok 
        (varos, utca, hazszam, telefonszam, nyit_ora, nyit_perc, zaras_ora, zaras_perc)
      VALUES
        (@varos, @utca, @hazszam, @telefonszam, @nyit_ora, @nyit_perc, @zaras_ora, @zaras_perc)
    `);
};

export const findById = async (id) => {
  const data = await pool.request().input('id', sql.Int, id).query('SELECT * FROM vendeglok WHERE id = @id');
  return data.recordset[0];
};
