async function megjelenitPlusszInformacio(id) {
  console.log('kattintas');
  const response = await fetch(`/vendegloInfo/${id}`);
  const data = await response.json();
  const tdElem = document.getElementById(`sorok${id}`);
  tdElem.textContent = `Cím: ${data.utca} ${data.hazszam}, Telefon: ${data.telefonszam}`;
}

function hozzaadButtonokhozEventListener() {
  const sorok = document.getElementsByClassName('sorok');
  for (let i = 0; i < sorok.length; i++) {
    sorok[i].addEventListener('click', () => megjelenitPlusszInformacio(sorok[i].id));
  }
}

window.onload = () => {
  hozzaadButtonokhozEventListener();
};
