// ==========================================
// 1. STAV HRY A PROMĚNNÉ
// ==========================================
let score = 0;
let cps = 0; // Donuts per second (DPS)
let clickValue = 1; // Donuts per click (DPC)

// Pevné ceny vylepšení
const upgrade1Price = 25;  // Extra Sprinkles
let upgrade1Count = 0;

const upgrade2Price = 60;  // Glaze Machine
let upgrade2Count = 0;

const upgrade3Price = 260; // Bigger Oven
let upgrade3Count = 0;

const upgrade4Price = 700; // Pastry Chef
let upgrade4Count = 0;

let currentMilestone = 'default';

// --- PROMĚNNÉ PRO DYNAMICKÉ POZADÍ ---
let clickTimestamps = []; // Pole pro ukládání času jednotlivých kliknutí
const CLICK_SPEED_LIMIT = 10; // Kolik kliknutí za vteřinu spustí změnu pozadí
let isFastClicking = false;
let backgroundResetTimer = null;

// ==========================================
// 2. NAČTENÍ ZVUKŮ (SFX)
// ==========================================
const soundClick = new Audio('./Assets/SFX/Click.m4a');
const soundSprinkles = new Audio('./Assets/SFX/Sprinkles.m4a');
const soundGlaze = new Audio('./Assets/SFX/ExtraGlaze.m4a');
const soundOven = new Audio('./Assets/SFX/ovenUpgraded.m4a');
const soundChef = new Audio('./Assets/SFX/ChefHired.m4a');
const horiMiHlava = new Audio('./Assets/SFX/HoriMiHlava.m4a');
const fuckinHell = new Audio('./Assets/SFX/FuckinHell.m4a')

function playSFX(audio) {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

// ==========================================
// 3. PRVKY Z HTML
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

// Cesty k obrázkům donutů
const DONUT_DEFAULT = './Assets/Images/DonutClickerIcon.png';
const DONUT_GOLDEN  = './Assets/Images/ClickIconGolden.png';
const DONUT_DIAMOND = './Assets/Images/ClickIconDiamond.png';

// --- CESTY K OBRÁZKŮM POZADÍ (Zde si doplň své vlastní cesty) ---
const BG_NORMAL = './Assets/Images/BackgroundNormal.png';
const BG_FAST   = './Assets/Images/FireBackground.png';

// ==========================================
// 4. LOGIKA ZMĚNY OBRÁZKU PODLE CPS (DPS) A RYCHLOSTI KLIKÁNÍ
// ==========================================
function updateDonutSkin() {
    if (!donutImage) return;

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

// Funkce pro kontrolu rychlosti klikání a změnu pozadí
function handleFastClickBackground() {
    const now = Date.now();
    
    // Přidej aktuální kliknutí do historie
    clickTimestamps.push(now);
    
    // Odstraň kliknutí starší než 1 vteřina (1000 ms)
    clickTimestamps = clickTimestamps.filter(timestamp => now - timestamp < 1000);

    // Pokud uživatel překročil limit kliknutí za vteřinu
    if (clickTimestamps.length >= CLICK_SPEED_LIMIT) {
        if (!isFastClicking) {
            isFastClicking = true;
            // Změna pozadí na rychlý/divoký styl (pokud používáš obrázek)
            playSFX(horiMiHlava);
            document.body.style.backgroundImage = `url('${BG_FAST}')`;

        }

        // Resetuj časovač pro návrat pozadí – pozadí zůstane rychlé, dokud uživatel nepřestane klikat
        clearTimeout(backgroundResetTimer);
        backgroundResetTimer = setTimeout(() => {
            isFastClicking = false;
            document.body.style.backgroundImage = `url('${BG_NORMAL}')`;
            playSFX(fuckinHell);
            // document.body.style.backgroundColor = ''; // pro barvu
        }, 800); // Pozadí se vrátí do normálu 0.8s po posledním rychlém kliknutí
    }
}

// Pomocná funkce pro průhlednost (opacity) a počítadlo v tlačítku
function setButtonState(button, name, price, count) {
    if (!button) return;
    const canAfford = score >= price;
    button.disabled = !canAfford;
    button.style.opacity = canAfford ? '1' : '0.5';
    button.style.cursor = canAfford ? 'pointer' : 'not-allowed';
    
    button.textContent = `${name} (${price}) [${count}]`;
}

// ==========================================
// 5. AKTUALIZACE UI
// ==========================================
function updateUI() {
    if (donutImage) {
        donutImage.style.width = '200px';
        donutImage.style.height = 'auto';
        donutImage.style.objectFit = 'contain';
    }

    if (donutsDisplay) donutsDisplay.textContent = `Donuts: ${Math.floor(score)}`;
    if (dpsDisplay) dpsDisplay.textContent = `Donuts per second: ${cps}`;
    if (dpcDisplay) dpcDisplay.textContent = `Donuts per click: ${clickValue}`;

    setButtonState(btnUpgrade1, "Extra Sprinkles", upgrade1Price, upgrade1Count);
    setButtonState(btnUpgrade2, "Glaze Machine", upgrade2Price, upgrade2Count);
    setButtonState(btnUpgrade3, "Bigger Oven", upgrade3Price, upgrade3Count);
    setButtonState(btnUpgrade4, "Pastry Chef", upgrade4Price, upgrade4Count);

    updateDonutSkin();
}

// ==========================================
// 6. AKCE A NÁKUPY
// ==========================================
function clickDonut() {
    score += clickValue;
    playSFX(soundClick);
    
    // Spustí kontrolu rychlosti klikání pro pozadí
    handleFastClickBackground();
    
    updateUI();
}

// Extra Sprinkles (+1/klik)
function buyUpgrade1() {
    if (score >= upgrade1Price) {
        score -= upgrade1Price;
        clickValue += 1;
        upgrade1Count++;
        playSFX(soundSprinkles);
        updateUI();
    }
}

// Glaze Machine (+1 CPS)
function buyUpgrade2() {
    if (score >= upgrade2Price) {
        score -= upgrade2Price;
        cps += 1;
        upgrade2Count++;
        playSFX(soundGlaze);
        updateUI();
    }
}

// Bigger Oven (+5 CPS)
function buyUpgrade3() {
    if (score >= upgrade3Price) {
        score -= upgrade3Price;
        cps += 5;
        upgrade3Count++;
        playSFX(soundOven);
        updateUI();
    }
}

// Pastry Chef (+10/klik)
function buyUpgrade4() {
    if (score >= upgrade4Price) {
        score -= upgrade4Price;
        clickValue += 10;
        upgrade4Count++;
        playSFX(soundChef);
        updateUI();
    }
}

// ==========================================
// 7. ČASOVAČ PRO AUTOMATICKÉ TIKÁNÍ (CPS)
// ==========================================
setInterval(() => {
    if (cps > 0) {
        score += cps / 10;
        updateUI();
    }
}, 100);

// ==========================================
// 8. SPUŠTĚNÍ PO NAČTENÍ STRÁNKY
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    // Nastavení výchozího pozadí při startu
    document.body.style.backgroundImage = `url('${BG_NORMAL}')`;
    document.body.style.backgroundSize = 'cover'; // Doporučeno pro správné roztažení obrázku

    if (clickerButton) clickerButton.addEventListener('click', clickDonut);
    if (btnUpgrade1) btnUpgrade1.addEventListener('click', buyUpgrade1);
    if (btnUpgrade2) btnUpgrade2.addEventListener('click', buyUpgrade2);
    if (btnUpgrade3) btnUpgrade3.addEventListener('click', buyUpgrade3);
    if (btnUpgrade4) btnUpgrade4.addEventListener('click', buyUpgrade4);

    updateUI();
});