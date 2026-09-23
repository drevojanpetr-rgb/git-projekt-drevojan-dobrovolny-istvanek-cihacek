// Stav proměných
let donuts = 0;
let donutsPerClick = 1;
let donutsPerSecond = 0;

// Konfigurace vylepšení
const UPGRADES = {
  'extra-sprinkles': { cost: 25, clickAdd: 1, secAdd: 0 },
  'glaze-machine':   { cost: 60, clickAdd: 0, secAdd: 1 },
  'bigger-oven':      { cost: 260, clickAdd: 0, secAdd: 5 },
  'pastry-chef':      { cost: 700, clickAdd: 10, secAdd: 0 }
};

// Získání prvků z HTML
const donutsDisplay = document.getElementById('donuts');
const dpsDisplay = document.getElementById('dps');
const dpcDisplay = document.getElementById('dpc');
const clickerButton = document.getElementById('clicker-button');
const upgradesContainer = document.querySelector('.upgrades');

// Funkce pro aktualizaci všech textů na obrazovce
function updateDisplay() {
  donutsDisplay.textContent = `Donuts: ${donuts}`;
  dpsDisplay.textContent = `Donuts per second: ${donutsPerSecond}`;
  dpcDisplay.textContent = `Donuts per click: ${donutsPerClick}`;
}

// 1. Klikání na koblížek
clickerButton.addEventListener('click', () => {
  donuts += donutsPerClick;
  updateDisplay();
});

// 2. Nakupování vylepšení
upgradesContainer.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;

  const card = e.target.closest('.upgrade');
  if (!card) return;

  const upgrade = UPGRADES[card.id];

  if (upgrade && donuts >= upgrade.cost) {
    donuts -= upgrade.cost;
    donutsPerClick += upgrade.clickAdd;
    donutsPerSecond += upgrade.secAdd;
    updateDisplay();
  }
});

// 3. Automatické přičítání za sekundu
setInterval(() => {
  if (donutsPerSecond > 0) {
    donuts += donutsPerSecond;
    updateDisplay();
  }
}, 1000);