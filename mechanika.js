let pocet = 0;

function Klik() {
  const vystup = document.getElementById('Count');
  pocet++;
  vystup.textContent = "Počet kliků: " + pocet;
}