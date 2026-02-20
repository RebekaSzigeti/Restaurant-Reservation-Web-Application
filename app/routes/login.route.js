import express from 'express';
import { findFelhasznaloAuthByNev, findFelhasznaloIdByNev } from '../db/felhasznalo.db.js';
import bcrypt from 'bcrypt';

const router = new express.Router();

router.use(express.urlencoded({ extended: true }));

router.post('/login', async (req, res) => {
  console.log('-------------------------------------------');
  console.log('Bejelentkezesi probalkozas');
  console.log(`metodus: ${req.method}`);
  console.log(`url: ${req.url}`);
  const { nev, jelszo } = req.body;
  console.log(`Beirt felhasznalonev: ${nev}`);
  const hash = await findFelhasznaloAuthByNev(nev);
  if (!hash) {
    console.log('Felhasználó nem található');
    return res.status(401).send('Hibás felhasználónév vagy jelszó');
  }
  const match = await bcrypt.compare(jelszo, hash);

  if (match) {
    console.log(`Sikeres bejelentkezes: ${nev}`);
    const felhasznaloId = await findFelhasznaloIdByNev(nev);
    Object.assign(req.session, {
      username: nev,
      userId: felhasznaloId,
    });

    return res.redirect('/');
  }
  console.log('Hibas jelszo');
  return res.status(401).send('Passwords do not match');
});

router.get('/login', (req, res) => {
  console.log('-------------------------------------------');
  console.log('Login oldal betoltese');
  console.log(`metodus: ${req.method}`);
  console.log(`url: ${req.url}`);
  res.redirect('/login.html');
});

router.get('/logout', (req, res) => {
  console.log('-------------------------------------------');
  console.log('Kijelentkezes');
  console.log(`metodus: ${req.method}`);
  console.log(`url: ${req.url}`);
  req.session.destroy((err) => {
    if (err) {
      console.error('Hiba a kijelentkezes soran:', err);
      return res.status(500).send('Hiba a kijelentkezésnél');
    }
    console.log('Sikeres kijelentkezes');
    return res.redirect('/');
  });
});

export default router;
