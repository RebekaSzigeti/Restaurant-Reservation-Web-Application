const legorduloLista = document.getElementById('meret');
let kiJatszikEppen = 1;
const tablazat = document.getElementById('tablazat');
let matrix = [];
let m = 3;
let n = 3;
const szoveg = document.getElementById('szoveg');
let korokSzama = 0;
let jatekVege = false;

function vanNyertes() {
  if (kiJatszikEppen === 1) {
    szoveg.textContent = 'Az első játékos(X) nyert \u{1F3C6}';
  } else {
    szoveg.textContent = 'Az második játékos(O) nyert \u{1F3C6}';
  }
  jatekVege = true;
}

function dontetlen() {
  szoveg.textContent = 'Döntetlen!';
}

function ellenorzesVizszintesen(i, j) {
  let j2 = j + 1;
  if (n - m >= j) {
    let szamlalo = 1;
    while (szamlalo < m && matrix[i][j2] === kiJatszikEppen) {
      ++szamlalo;
      ++j2;
    }
    if (szamlalo === m) {
      return 1;
    }
  }

  return 0;
}

function ellenorzesFuggolegesen(i, j) {
  let i2 = i + 1;
  if (n - m >= i) {
    let szamlalo = 1;
    while (szamlalo < m && matrix[i2][j] === kiJatszikEppen) {
      ++szamlalo;
      ++i2;
    }

    if (szamlalo === m) {
      return 1;
    }
  }

  return 0;
}

function ellenorzesAtlosan(i, j) {
  let i2 = i + 1;
  let j2 = j + 1;
  let szamlalo = 1;
  if (n - m >= i) {
    if (n - m >= j) {
      while (szamlalo < m && matrix[i2][j2] === kiJatszikEppen) {
        ++szamlalo;
        ++i2;
        ++j2;
      }

      if (szamlalo === m) {
        return 1;
      }
    }

    if (j - m + 1 >= 0) {
      i2 = i + 1;
      j2 = j - 1;
      szamlalo = 1;
      while (szamlalo < m && matrix[i2][j2] === kiJatszikEppen) {
        ++szamlalo;
        ++i2;
        --j2;
      }

      if (szamlalo === m) {
        return 1;
      }
    }
  }

  return 0;
}

function ellenorzesMindenfelekeppen(i, j) {
  if (parseInt(ellenorzesFuggolegesen(i, j), 10) === 1) {
    return 1;
  } else if (parseInt(ellenorzesVizszintesen(i, j), 10) === 1) {
    return 1;
  } else if (parseInt(ellenorzesAtlosan(i, j), 10) === 1) {
    return 1;
  }
  return 0;
}

function ellenorzesValakiNyertE() {
  let i = 0;
  while (i < n) {
    let j = 0;
    while (j < n) {
      if (matrix[i][j] === kiJatszikEppen) {
        if (parseInt(ellenorzesMindenfelekeppen(i, j), 10) === 1) {
          vanNyertes();
          return 1;
        }
      }
      ++j;
    }
    ++i;
  }
  return 0;
}

function kattintas(mezo, i, j) {
  if (!jatekVege && matrix[i][j] === 0) {
    ++korokSzama;
    let mostNyertValaki = 1;
    matrix[i][j] = kiJatszikEppen;
    if (kiJatszikEppen === 1) {
      const img = document.createElement('img');
      img.src = 'assets/x.png';
      img.width = '50';
      img.height = '50';

      mezo.appendChild(img);
      if (ellenorzesValakiNyertE() !== 1) {
        kiJatszikEppen = 2;
        szoveg.textContent = 'Az második játékos(O) következik';
        mostNyertValaki = 0;
      }
    } else {
      const img = document.createElement('img');
      img.src = 'assets/o.png';
      img.width = '40';
      img.height = '40';

      mezo.appendChild(img);
      if (ellenorzesValakiNyertE() !== 1) {
        kiJatszikEppen = 1;
        szoveg.textContent = 'Az első játékos(X) következik';
        mostNyertValaki = 0;
      }
    }
    if (mostNyertValaki === 0 && korokSzama === n * n) {
      dontetlen();
    }
  }
}

function valtoztatTablazat() {
  jatekVege = false;
  kiJatszikEppen = 1;
  n = legorduloLista.value;
  korokSzama = 0;
  tablazat.innerHTML = '';
  matrix = [];
  if (m > n) {
    m = parseInt(n, 10);
    document.getElementById('mErteke').value = m;
  }
  for (let i = 0; i < n; ++i) {
    matrix[i] = [];
    for (let j = 0; j < n; ++j) {
      matrix[i][j] = 0;
    }
  }

  for (let i = 0; i < n; ++i) {
    const sor = document.createElement('tr');
    for (let j = 0; j < n; ++j) {
      const mezo = document.createElement('td');
      mezo.addEventListener('click', () => kattintas(mezo, i, j));
      sor.appendChild(mezo);
    }
    tablazat.appendChild(sor);
  }
  szoveg.textContent = 'Az első játékos(X) következik';
}

function valtoztatM() {
  const m1 = parseInt(document.getElementById('mErteke').value, 10);
  if (m1 > n) {
    alert('M értéke kisebb vagy egyenlő kell legyen n értékénél.');
    document.getElementById('mErteke').value = m;
    return;
  }
  m = m1;
  valtoztatTablazat();
}

function ujraKezd() {
  valtoztatTablazat();
  valtoztatM();
}

window.onload = () => {
  legorduloLista.addEventListener('change', valtoztatTablazat);
  document.getElementById('mErteke').addEventListener('change', valtoztatM);
  valtoztatTablazat();
  document.getElementById('ujrakezdButton').addEventListener('click', ujraKezd);
};
