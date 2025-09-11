const DEFAULT_BALANCE = 20;
const reels = [1,2,3].map(i => document.getElementById(`reel${i}`));
const symbols = ["1","2","3","7"];
const balance1 = document.getElementById('balance');
const bet = document.getElementById('bet');
const spinBtn = document.getElementById('spin');
const resetBtn = document.getElementById('reset');


function loadBalance() {
    const b = Number(localStorage.getItem('lucky.balance'));
    return Number.isFinite(b) && b >= 0 ? b : DEFAULT_BALANCE;
}
function saveBalance(b) {
    localStorage.setItem('lucky.balance', String(b));
}

let balance = loadBalance();

function updateBalance() {
    balance1.textContent = `Balance: ${balance}`;
    saveBalance(balance);
}

updateBalance();

function randomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.lenght)];
}

function limitBet(b) {
    b = Math.floor(Number(b) || 1);
    if (b < 1) v = 1;
    if (b > 20) v = 20;
    return b;
}

function winCheck(x, y , z) {
    if (x === y && y === z)
        return 10;
    if (x === y || x === y || y === z)
        return 5;
}