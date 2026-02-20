import express from 'express';
import * as vendegloDb from '../db/vendeglok.db.js';
import * as foglalasDb from '../db/foglalas.db.js';
import * as fenykepDb from '../db/fenykep.db.js';
import { requireLogin } from './helper.js';

const router = new express.Router();

router.get('/vendeglo/:id', async (req, res) => {
  try {
    console.log('-------------------------------------------');
    console.log('Vendeglo reszleteinek lekerese (foglalasok + kepek)');
    console.log(`metodus: ${req.method}`);
    console.log(`url: ${req.url}`);
    const vendegloId = parseInt(req.params.id, 10);
    console.log(`Vendeglo id: ${vendegloId}`);
    const [vendeglo, foglalasok, fenykep] = await Promise.all([
      vendegloDb.findById(vendegloId),
      foglalasDb.findByVendeglo(vendegloId),
      fenykepDb.findByVendeglo(vendegloId),
    ]);
    let message = '';
    if (req.query.msg === 'siker') message = 'A foglalás sikeresen rögzítve!';
    if (req.query.msg === 'hiba') message = 'Hiba történt a foglalás során.';
    if (req.query.msg === 'hiba2') message = 'A megadott idopont nem volt megfelelo';
    res.render('vendeglo_detail', {
      vendeglo,
      foglalasok,
      fenykep,
      message,
      username: req.session.username,
      userId: req.session.userId,
    });
    console.log('Adatok elkuldve.');
  } catch (err) {
    res.status(500).render('error', {
      message: `Hiba az adatok lekeresekor: ${err.message}`,
    });
    console.log(`Hiba az adatok lekeresekor: ${err.message}`);
  }
});

router.delete('/foglalas/:id', requireLogin, async (req, res) => {
  try {
    console.log('-------------------------------------------');
    console.log('Foglalas torlese');
    console.log(`metodus: ${req.method}`);
    console.log(`url: ${req.url}`);
    const id = parseInt(req.params.id, 10);
    console.log(`Foglalas id: ${id}`);
    const foglalas = await foglalasDb.findById(id);
    if (!foglalas) {
      console.log('Foglalas nem talalhato');
      return res.status(404).json({ message: 'Foglalas nem talalhato' });
    }

    if (foglalas.felhasznalo_id !== req.session.userId) {
      console.log('Hozzaferes megtagadva: nem a tulajdonos');
      return res.status(403).json({ message: 'Hozzaferes megtagadva' });
    }
    const sikeres = await foglalasDb.deleteFoglalas(id);
    if (!sikeres) {
      console.log('Foglalas nem talalhato');
      return res.status(404).json({ message: 'Foglalas nem talalhato' });
    }
    console.log('Sikeres torles');
    return res.sendStatus(204);
  } catch (err) {
    console.log(`Hiba: ${err.message}`);
    return res.status(500).json({ message: err.message });
  }
});

export default router;
