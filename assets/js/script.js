const reels = [1,2,3].map(i => document.getElementById(`reel${i}`));
const symbols = ["1","2","3","7"];
const balance = document.getElementById('balance');
const DEFAULT_BALANCE = 20;
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
 