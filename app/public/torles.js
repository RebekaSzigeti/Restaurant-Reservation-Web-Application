async function torolFoglalas(id) {
  const response = await fetch(`/foglalas/${id}`, {
    method: 'DELETE',
  });

  const visszajelzes = document.getElementById('visszajelzes');

  if (response.status === 204) {
    document.getElementById(`foglalas${id}`).remove();
    visszajelzes.innerText = 'Sikeres törlés';
  } else if (response.status === 404) {
    visszajelzes.innerText = 'Foglalás nem található';
  } else {
    visszajelzes.innerText = 'Hiba történt törléskor';
  }
}

function initTorlesGombok() {
  const buttonok = document.getElementsByClassName('torlesGomb');
  for (const btn of buttonok) {
    btn.addEventListener('click', () => torolFoglalas(btn.id));
  }
}

window.onload = () => {
  initTorlesGombok();
};
