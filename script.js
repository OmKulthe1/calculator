let displayText = '0';
let currentInput = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function add(a, b) { return a + b; }
function sub(a, b) { return a - b; }
function divide(a, b) { return b !== 0 ? a / b : 'Error: Divide by zero'; }
function multiply(a, b) { return a * b; }

function operate(opp, n1, n2) {
    n1 = parseFloat(n1);
    n2 = parseFloat(n2);
    if (isNaN(n1) || isNaN(n2)) {
        return 'Error: Invalid number';
    }
    switch(opp) {
        case '+': return add(n1, n2);
        case '-': return sub(n1, n2);
        case '/': return divide(n1, n2);
        case '*': return multiply(n1, n2);
        default: return 'Error: Invalid operator';
    }
}

function updateDisplay() {
    document.querySelector(".display").textContent = displayText;
}

function inputDigit(digit) {
    if (waitingForSecondOperand) {
        currentInput = digit;
        displayText += digit;
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? digit : currentInput + digit;
        displayText = displayText === '0' ? digit : displayText + digit;
    }
}

function inputDecimal() {
    if (!currentInput.includes('.')) {
        currentInput += '.';
        displayText += '.';
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (operator && waitingForSecondOperand) {
        displayText = displayText.slice(0, -1) + nextOperator;
        operator = nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = operate(operator, firstOperand, inputValue);
        if (typeof result === 'number') {
            firstOperand = result;
            displayText = `${parseFloat(result.toFixed(7))}`;
        } else {
            displayText = result;
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
            currentInput = '0';
            updateDisplay();
            return;
        }
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
    displayText += nextOperator;
    currentInput = '0';
}

document.querySelectorAll(".button").forEach(button => {
    button.addEventListener("click", function() {
        const buttonText = this.textContent;
        
        if ('0123456789'.includes(buttonText)) {
            inputDigit(buttonText);
        } else if (buttonText === '.') {
            inputDecimal();
        } else if ('+-/*'.includes(buttonText)) {
            if (!waitingForSecondOperand && !isNaN(parseFloat(currentInput))) {
                handleOperator(buttonText);
            }
        } else if (buttonText === '=') {
            if (operator && firstOperand !== null && !isNaN(parseFloat(currentInput))) {
                const result = operate(operator, firstOperand, parseFloat(currentInput));
                if (typeof result === 'number') {
                    displayText = `${parseFloat(result.toFixed(7))}`;
                    currentInput = displayText;
                    firstOperand = null;
                    operator = null;
                    waitingForSecondOperand = false;
                } else {
                    displayText = result;
                    currentInput = '0';
                    firstOperand = null;
                    operator = null;
                    waitingForSecondOperand = false;
                }
            }
        } else if (buttonText === 'CE') {
            if (displayText.length > 1) {
                displayText = displayText.slice(0, -1);
                currentInput = currentInput.slice(0, -1);
                if (currentInput === '') {
                    currentInput = '0';
                }
            } else {
                displayText = '0';
                currentInput = '0';
            }
        } else if (buttonText === 'AC') {
            displayText = '0';
            currentInput = '0';
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
        }
        updateDisplay();
    });
});

updateDisplay(); // Initial display update