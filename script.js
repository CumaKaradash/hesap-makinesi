let display = document.getElementById('display');
let historyList = document.getElementById('history-list');
let currentExpression = '';

// Sayfa yüklendiğinde işlem geçmişini al ve göster
window.addEventListener('load', () => {
    const storedHistory = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
    storedHistory.forEach(item => addToHistory(item));
});

function appendToDisplay(value) {
    display.value += value;
    currentExpression += value;
}

function clearDisplay() {
    display.value = '';
    currentExpression = '';
}

function backspace() {
    display.value = display.value.slice(0, -1);
    currentExpression = currentExpression.slice(0, -1);
}

function square() {
    display.value = parseFloat(display.value) ** 2;
    currentExpression = display.value;
}

function squareRoot() {
    display.value = Math.sqrt(parseFloat(display.value));
    currentExpression = `Math.sqrt(${display.value})`;
}

function percentage() {
    display.value = parseFloat(display.value) / 100;
    currentExpression = `${parseFloat(display.value)} / 100`;
}

function calculateResult() {
    try {
        const result = calculate(currentExpression);
        display.value = result;
        addToHistory(`${currentExpression} = ${result}`);
        saveHistoryToLocalStorage();
    } catch (error) {
        display.value = 'Error';
    }
}

function calculate(expression) {
    const result = new Function('return ' + expression)();
    if (isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid operation');
    }
    return result;
}

function addToHistory(item) {
    const historyItem = document.createElement('li');
    historyItem.textContent = item;
    historyList.appendChild(historyItem);
}

function saveHistoryToLocalStorage() {
    const historyItems = Array.from(historyList.children).map(item => item.textContent);
    localStorage.setItem('calculatorHistory', JSON.stringify(historyItems));
}

function handleKeyPress(key) {
    switch (key) {
        case 'Enter':
            calculateResult();
            break;
        case 'Backspace':
            backspace();
            break;
        default:
            if (/[0-9+\-*/.%]/.test(key)) {
                appendToDisplay(key);
            }
    }
}

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (event.getModifierState('NumLock')) {
        handleKeyPress(key);
    }
});
