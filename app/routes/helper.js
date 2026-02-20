export function ellenorizIdo(ora, perc) {
  const oraInt = parseInt(ora, 10);
  const percInt = parseInt(perc, 10);

  if (oraInt < 0 || oraInt > 23) {
    return false;
  }

  if (percInt < 0 || percInt > 59) {
    return false;
  }

  return true;
}

export function ellenorizTobbIdo(ora1, perc1, ora2, perc2) {
  if (!ellenorizIdo(ora1, perc1)) {
    return false;
  }
  return ellenorizIdo(ora2, perc2);
}

export function isInteger(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return false;
  if (!Number.isInteger(num)) return false;
  return true;
}

export function requireLogin(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    console.log('Hibás bejelentkezési állapot: nincs bejelentkezve');
    res.redirect('/login');
  }
}
