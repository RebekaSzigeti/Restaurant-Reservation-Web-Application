import express from 'express';
import * as db from '../db/fenykep.db.js';
import multer from 'multer';
import { join, extname } from 'path';
import fs from 'fs';

const router = new express.Router();

const uploadDir = join(process.cwd(), 'public/vendeglohozKepek');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 2 * 1024 * 1024 },
});

router.post('/vendeglo/:id/fenykep', upload.single('fenykep'), async (req, res) => {
  try {
    console.log('-------------------------------------------');
    console.log('Kép feltöltése');
    console.log(`metodus: ${req.method}`);
    console.log(`url: ${req.url}`);
    const vendegloId = parseInt(req.params.id, 10);
    console.log(`VendegloId: ${vendegloId}`);
    const file = req.file;

    if (!file) {
      console.log('Nem volt kép feltöltve');
      res.status(400).send('Nem volt kép feltöltve.');
      return;
    }

    const folder = join(uploadDir, vendegloId.toString());
    if (!fs.existsSync(folder)) {
      console.log(`Létrehoztam a ${folder} foldert`);
      fs.mkdirSync(folder, { recursive: true });
    }

    const ext = extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}${ext}`;
    const fullPath = join(folder, filename);
    fs.renameSync(file.path, fullPath);

    await db.insertFenykep(vendegloId, filename);
    console.log('Kép feltöltve a vendéglőhöz!');
    res.redirect(`/vendeglo/${vendegloId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Hiba történt a kép feltöltése közben.');
  }
});

export default router;
