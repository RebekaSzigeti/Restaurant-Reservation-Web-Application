import express from 'express';
import * as vendegloDb from '../db/vendeglok.db.js';
import * as db from '../db/foglalas.db.js';
import { ellenorizIdo, isInteger, requireLogin } from './helper.js';

const router = new express.Router();

function beleferNyitvatartasbaAFoglalas(adat, ora, perc) {
  const nyitasOra = parseInt(adat.nyit_ora, 10);
  const nyitasPerc = parseInt(adat.nyit_perc, 10);
  const zarasOra = parseInt(adat.zaras_ora, 10);
  const zarasPerc = parseInt(adat.zaras_perc, 10);

  const foglalasOra = parseInt(ora, 10);
  const foglalasPerc = parseInt(perc, 10);

  if (nyitasOra === foglalasOra && nyitasPerc > foglalasPerc) {
    console.log('Foglalás túl korán.');
    return false;
  }

  if (zarasOra === foglalasOra && zarasPerc < foglalasPerc) {
    console.log('Foglalás túl későn.');
    return false;
  }

  if (nyitasOra > foglalasOra) {
    console.log('Foglalás túl korán.');
    return false;
  }

  if (zarasOra < foglalasOra) {
    console.log('Foglalás túl későn.');
    return false;
  }
  console.log('Foglalás nyitvatartáson belül.');
  return true;
}

function beleferNyitvatartasbaAFoglalas2(adat, ora, perc) {
  const nyitasOra = parseInt(adat.nyit_ora, 10);
  const nyitasPerc = parseInt(adat.nyit_perc, 10);
  const zarasOra = parseInt(adat.zaras_ora, 10);
  const zarasPerc = parseInt(adat.zaras_perc, 10);

  const foglalasOra = parseInt(ora, 10);
  const foglalasPerc = parseInt(perc, 10);

  if (nyitasOra === foglalasOra && nyitasPerc > foglalasPerc) {
    console.log('Foglalás túl korán.');
    return false;
  }

  if (zarasOra === foglalasOra && zarasPerc < foglalasPerc) {
    console.log('Foglalás túl későn.');
    return false;
  }

  if (nyitasOra > foglalasOra && foglalasOra > zarasOra) {
    console.log('Foglalás nincs a nyitvatartason belul.');
    return false;
  }

  console.log('Foglalás nyitvatartáson belül.');
  return true;
}

function ellenorizNyitvatartasonBelulVanE(adat, ora, perc) {
  const nyitasOra = parseInt(adat.nyit_ora, 10);
  const zarasOra = parseInt(adat.zaras_ora, 10);

  if (nyitasOra < zarasOra) {
    return beleferNyitvatartasbaAFoglalas(adat, ora, perc);
  }
  return beleferNyitvatartasbaAFoglalas2(adat, ora, perc);
}

function validateFoglalas(vendeglo, ora, perc) {
  if (!isInteger(ora) || !isInteger(perc)) {
    return 'Csak számot adhatsz meg órának és percnek!';
  }

  if (!ellenorizIdo(ora, perc)) {
    return 'Az órának 0–23, a percnek 0–59 között kell lennie.';
  }

  if (!ellenorizNyitvatartasonBelulVanE(vendeglo, ora, perc)) {
    return 'A foglalás nem esik a nyitvatartási időn belül.';
  }

  return null;
}

router.post('/vendeglo/:id/foglalas', requireLogin, async (req, res) => {
  try {
    const vendegloId = parseInt(req.params.id, 10);
    const { ora, perc } = req.body;
    const vendeglo = await vendegloDb.findById(vendegloId);
    console.log('-------------------------------------------');
    console.log('Asztal foglalása');
    console.log(`metodus: ${req.method}`);
    console.log(`url: ${req.url}`);
    const id = req.session.userId;
    console.log(`Foglalás próbálkozás: vendegloID=${vendegloId}, ora=${ora}, perc=${perc}, felhasznaloId=${id}`);

    const error = validateFoglalas(vendeglo, ora, perc);

    if (error) {
      console.log('A megadott idopont nem volt megfelelo');
      console.log(error);
      return res.redirect(`/vendeglo/${vendegloId}?msg=hiba2`);
    }

    await db.insertFoglalas(vendegloId, req.body, id);
    console.log('A foglalás sikeresen rögzítve!');
    return res.redirect(`/vendeglo/${vendegloId}?msg=siker`);
  } catch (err) {
    console.error(err);
    return res.status(500).render('error', { message: `Hiba a beszuraskor: ${err.message}` });
  }
});

export default router;
