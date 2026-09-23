// ==========================================
// 1. STAV HRY A PROMĚNNÉ
// ==========================================
let score = 0;
let cps = 0; // Donuts per second (DPS)
let clickValue = 1; // Donuts per click (DPC)

// Pevné ceny podle vášho HTML
const upgrade1Price = 25;  // Extra Sprinkles (+1/klik)
const upgrade2Price = 60;  // Glaze Machine (+1/s)
const upgrade3Price = 260; // Bigger Oven (+5/s)
const upgrade4Price = 700; // Pastry Chef (+10/klik)

let currentMilestone = 'default';

// ==========================================
// 2. PRVKY Z HTML
// ==========================================
const donutsDisplay = document.getElementById('donuts');
const dpsDisplay = document.getElementById('dps');
const dpcDisplay = document.getElementById('dpc');

const clickerButton = document.getElementById('clicker-button');
const donutImage = clickerButton ? clickerButton.querySelector('img') : null;

const btnUpgrade1 = document.getElementById('upgrade1');
const btnUpgrade2 = document.getElementById('upgrade2');
const btnUpgrade3 = document.getElementById('upgrade3');
const btnUpgrade4 = document.getElementById('upgrade4');

// Cesty k obrázkům (upravte podle své složky)
const DONUT_DEFAULT = './Assets/Images/DonutClickerIcon.png';
const DONUT_GOLDEN  = './Assets/Images/ClickIconGolden.png';
const DONUT_DIAMOND = './Assets/Images/ClickIconDiamond.png';

// ==========================================
// 3. LOGIKA ZMĚNY OBRÁZKU PODLE CPS (DPS)
// ==========================================
function updateDonutSkin() {
    if (!donutImage) return;

    // Milníky nastavené podle DPS (Donuts per second)
    if (cps > 1000) {
        if (currentMilestone !== 'diamond') {
            donutImage.src = DONUT_DIAMOND;
            currentMilestone = 'diamond';
        }
    } else if (cps > 100) {
        if (currentMilestone !== 'golden') {
            donutImage.src = DONUT_GOLDEN;
            currentMilestone = 'golden';
        }
    } else {
        if (currentMilestone !== 'default') {
            donutImage.src = DONUT_DEFAULT;
            currentMilestone = 'default';
        }
    }
}

// Pomocná funkce pro nastavení průhlednosti (opacity) tlačítek
function setButtonState(button, price) {
    if (!button) return;
    const canAfford = score >= price;
    button.disabled = !canAfford;
    button.style.opacity = canAfford ? '1' : '0.5';
    button.style.cursor = canAfford ? 'pointer' : 'not-allowed';
}

// ==========================================
// 4. AKTUALIZACE UI A OPACITY
// ==========================================
function updateUI() {
    // Uzamčení velikosti obrázku, aby po změně skinu nezměnil velikost
    if (donutImage) {
        donutImage.style.width = '200px';
        donutImage.style.height = 'auto';
        donutImage.style.objectFit = 'contain';
    }

    if (donutsDisplay) donutsDisplay.textContent = `Donuts: ${Math.floor(score)}`;
    if (dpsDisplay) dpsDisplay.textContent = `Donuts per second: ${cps}`;
    if (dpcDisplay) dpcDisplay.textContent = `Donuts per click: ${clickValue}`;

    // Nastavení opacity tlačítek podle aktuálního počtu donutů
    setButtonState(btnUpgrade1, upgrade1Price);
    setButtonState(btnUpgrade2, upgrade2Price);
    setButtonState(btnUpgrade3, upgrade3Price);
    setButtonState(btnUpgrade4, upgrade4Price);

    // Zkontrolovat a případně změnit obrázek koblihy
    updateDonutSkin();
}

// ==========================================
// 5. AKCE A NÁKUPY
// ==========================================
function clickDonut() {
    score += clickValue;
    updateUI();
}

// Extra Sprinkles: +1 per click
function buyUpgrade1() {
    if (score >= upgrade1Price) {
        score -= upgrade1Price;
        clickValue += 1;
        updateUI();
    }
}

// Glaze Machine: +1 CPS
function buyUpgrade2() {
    if (score >= upgrade2Price) {
        score -= upgrade2Price;
        cps += 1;
        updateUI();
    }
}

// Bigger Oven: +5 CPS
function buyUpgrade3() {
    if (score >= upgrade3Price) {
        score -= upgrade3Price;
        cps += 5;
        updateUI();
    }
}

// Pastry Chef: +10 per click
function buyUpgrade4() {
    if (score >= upgrade4Price) {
        score -= upgrade4Price;
        clickValue += 10;
        updateUI();
    }
}

// ==========================================
// 6. ČASOVAČ PRO AUTOMATICKÉ TIKÁNÍ (CPS)
// ==========================================
setInterval(() => {
    if (cps > 0) {
        score += cps / 10;
        updateUI();
    }
}, 100);

// ==========================================
// 7. SPUŠTĚNÍ PO NAČTENÍ STRÁNKY
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    if (clickerButton) clickerButton.addEventListener('click', clickDonut);
    if (btnUpgrade1) btnUpgrade1.addEventListener('click', buyUpgrade1);
    if (btnUpgrade2) btnUpgrade2.addEventListener('click', buyUpgrade2);
    if (btnUpgrade3) btnUpgrade3.addEventListener('click', buyUpgrade3);
    if (btnUpgrade4) btnUpgrade4.addEventListener('click', buyUpgrade4);

    updateUI();
});