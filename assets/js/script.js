const DEFAULT_BALANCE = 100;
const reels = [1,2,3].map(i => document.getElementById(`reel${i}`));
const symbols = ["1","2","3","4","7"]
const balance1 = document.getElementById('balance');
const betInput = document.getElementById('bet');
const spinBtn = document.getElementById('spin');
const resetBtn = document.getElementById('reset');
const msg = document.getElementById('msg');

const fullLine = {
  "7": 50,  
  "4": 10,
  "3": 6,
  "2": 4,
  "1": 3
};
const pair = {
  "7": 5, 
  "4": 3,
  "3": 2,
  "2": 2,
  "1": 1
};

// -- Storages

function loadBalance() {
    const b = Number(localStorage.getItem('lucky.balance'));
    return Number.isFinite(b) && b >= 0 ? b : DEFAULT_BALANCE;
}
function saveBalance(b) {
    localStorage.setItem('lucky.balance', String(b));
}

function loadBet() {
    const b = Number(localStorage.getItem('lucky.bet'));
    return Number.isFinite(b) && b > 0 ? b : 1;
}

function saveBet(b) {
    localStorage.setItem('lucky.bet', String(b));
}

betInput.value = loadBet();

let balance = loadBalance();

function updateBalance() {
    balance1.textContent = `Balance: ${balance}`;
    saveBalance(balance);
}

updateBalance();

// -- Random picker and win checker 

function randomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function limitBet(b) {
    b = Math.floor(Number(b) || 1);
    if (b < 1) b = 1;
    if (b > 20) b = 20;
    return b;
}

function winCheck(x, y , z) {
    if (x === y && y === z) {
        return fullLine[x] || 0;
    }
    let pairs = 0;
    if (x === y) pairs = Math.max(pairs, pair[x] || 0);
    if (x === z) pairs = Math.max(pairs, pair[x] || 0);
    if (y === z) pairs = Math.max(pairs, pair[y] || 0);

  return pairs;
}

// -- Messages

function showMsg(text, type="info") {

    msg.textContent = text;
    msg.classList.remove('d-none', 'alert-info', 'alert-success', 'alert-danger');
    switch (type) {
        case "success":
            msg.classList.add("alert-success");
            break;
        case "danger":
            msg.classList.add("alert-danger");
            break
        default:
            msg.classList.add("alert-info");
    }
}

betInput.addEventListener('change', () => {
    const b = limitBet(betInput.value);
    betInput.value = b;
    saveBet(b);
});

// -- Spin function

function spinOnce() {
    let bet = limitBet(betInput.value);
    betInput.value = bet;
    saveBet(bet);

    if (balance < bet) {
        showMsg(`Not enough stones for a bet of ${bet}.`, 'danger');
        return;
    }
    balance -= bet;
    updateBalance();
    spinBtn.disabled = true;
    showMsg('Throwing stones');
    reels.forEach (r => {
        r.classList.add('Throwing');
        r.textContent = '?';
    });

    const results = [null, null, null];
    let finished = 0;

    function stopReel(index) {
        const symbol = randomSymbol();
        reels[index].textContent = symbol;
        reels[index].classList.remove('Throwing')
        results[index] = symbol;
        finished += 1;
        if (finished === 3) endSpin();
    }

    function endSpin() {
        const [x, y, z] = results;
        const mult = winCheck(x, y, z);
        if (mult > 0) {
            const win = mult * bet;
            balance += win;
            updateBalance();        
            showMsg(`Win +${win} (x${mult})`, 'success');
        } else {
            showMsg(`No win (-${bet})`, 'danger');
        }
        spinBtn.disabled = balance <= 0;
        if (balance <= 0) {
            showMsg('No more Stones. Click reset button to start over', 'danger');
        }
    }
    setTimeout(() => stopReel(0), 300);
    setTimeout(() => stopReel(1), 600);
    setTimeout(() => stopReel(2), 900);

}
spinBtn.addEventListener('click', spinOnce);
resetBtn.addEventListener('click', () => {
  balance = DEFAULT_BALANCE;
  updateBalance();
  showMsg('More stones!! Good luck!', 'info');
  spinBtn.disabled = false;
});