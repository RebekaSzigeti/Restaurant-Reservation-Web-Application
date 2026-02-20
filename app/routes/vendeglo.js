import express from 'express';
import * as db from '../db/vendeglok.db.js';
import { ellenorizTobbIdo, isInteger } from './helper.js';

const router = new express.Router();

router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
  try {
    console.log('-------------------------------------------');
    console.log('Vendeglok betoltese');
    console.log(`metodus: ${req.method}`);
    console.log(`url: ${req.url}`);
    const vendeglok = await db.findAllVendeglo();
    let message = '';
    if (req.query.msg === 'siker') message = 'Az új vendéglő sikeresen hozzá lett adva.';
    if (req.query.msg === 'inputHiba') message = 'Az input nem volt megfelelo';
    res.render('vendeglok', { vendeglok, message, username: req.session.username });
    console.log('A vendeglok be lettek toltve');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: `Selection unsuccessful: ${err.message}` });
  }
});

function ellenorizNegySzamrol(kezdetOra, kezdetPerc, vegeOra, vegePerc) {
  if (!isInteger(kezdetOra) || !isInteger(kezdetPerc) || !isInteger(vegeOra) || !isInteger(vegePerc)) {
    return false;
  }
  return true;
}

function validateVendegloInput(reqBody) {
  const { varos, utca, hazszam, telefonszam, kezdetOra, kezdetPerc, vegeOra, vegePerc } = reqBody;

  if (!varos || !utca || !hazszam || !telefonszam || !kezdetOra || !kezdetPerc || !vegeOra || !vegePerc) {
    return 'Hiányzó mezők a vendéglő adatokban';
  }

  if (!ellenorizNegySzamrol(kezdetOra, kezdetPerc, vegeOra, vegePerc)) {
    return 'Csak számot adhatsz meg órának és percnek!';
  }

  if (parseInt(kezdetOra, 10) === parseInt(vegeOra, 10)) {
    return 'A nyitvatartás kezdete nem lehet egyenlő a zárási idővel. (óra)';
  }

  if (!ellenorizTobbIdo(kezdetOra, kezdetPerc, vegeOra, vegePerc)) {
    return 'Az órának 0–23, a percnek 0–59 között kell lennie.';
  }

  return null;
}

router.post('/vendegloHozzaadasa', async (req, res) => {
  try {
    console.log('-------------------------------------------');
    console.log('Vendeglo hozzaadasa');
    console.log(`metodus: ${req.method}`);
    console.log(`url: ${req.url}`);
    console.log(
      `Beirt adatok: varos=${req.body.varos}, ` +
        `utca=${req.body.utca}, hazszam=${req.body.hazszam}, ` +
        `telefon=${req.body.telefonszam}, ` +
        `nyitas=${req.body.kezdetOra}:${req.body.kezdetPerc}, ` +
        `zaras=${req.body.vegeOra}:${req.body.vegePerc}`,
    );

    const hiba = validateVendegloInput(req.body);
    if (hiba) {
      console.log('Az input nem volt megfelelo');
      console.log(hiba);
      return res.redirect('/?msg=inputHiba');
    }

    await db.insertVendeglo(req.body);

    console.log('Beszurtam az új vendéglő adatait');
    return res.redirect('/?msg=siker');
  } catch (err) {
    console.error(err);
    return res.status(500).render('error', { message: `Hiba a beszuraskor: ${err.message}` });
  }
});

router.get('/vendegloInfo/:id', async (req, res) => {
  try {
    console.log('-------------------------------------------');
    console.log('Vendeglohoz tartozo informacio lekerese');
    console.log(`metodus: ${req.method}`);
    console.log(`url: ${req.url}`);
    const vendeglo = await db.findById(req.params.id);
    console.log('Vendeglo informacioi:');
    console.log(vendeglo);
    res.json(vendeglo);
    console.log('Az informaciok el lettek kuldve.');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
