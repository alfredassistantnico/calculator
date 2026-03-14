// Calculator State
let currentValue = '0';
let previousValue = '';
let operator = null;
let shouldResetDisplay = false;
let expression = '';

// DOM Elements
const resultDisplay = document.getElementById('result');
const expressionDisplay = document.getElementById('expression');

// Update display
function updateDisplay() {
  resultDisplay.textContent = currentValue;
  expressionDisplay.textContent = expression;

  // Add animation class
  resultDisplay.classList.add('updated');
  setTimeout(() => resultDisplay.classList.remove('updated'), 200);
}

// Handle number input
function inputNumber(value) {
  if (shouldResetDisplay) {
    currentValue = value === '.' ? '0.' : value;
    shouldResetDisplay = false;
  } else {
    if (value === '.' && currentValue.includes('.')) return;
    if (currentValue === '0' && value !== '.') {
      currentValue = value;
    } else {
      currentValue += value;
    }
  }
  updateDisplay();
}

// Handle operator input
function inputOperator(op) {
  if (operator && !shouldResetDisplay) {
    calculate();
  }

  previousValue = currentValue;
  shouldResetDisplay = true;

  const opSymbols = {
    add: '+',
    subtract: '−',
    multiply: '×',
    divide: '÷'
  };

  operator = op;
  expression = `${previousValue} ${opSymbols[op]}`;
  updateDisplay();
}

// Calculate result
function calculate() {
  if (!operator || previousValue === '') return;

  const prev = parseFloat(previousValue);
  const current = parseFloat(currentValue);
  let result;

  switch (operator) {
    case 'add':
      result = prev + current;
      break;
    case 'subtract':
      result = prev - current;
      break;
    case 'multiply':
      result = prev * current;
      break;
    case 'divide':
      result = current === 0 ? 'Error' : prev / current;
      break;
    default:
      return;
  }

  expression = `${previousValue} ${getOperatorSymbol(operator)} ${currentValue} =`;
  currentValue = typeof result === 'number' ? formatNumber(result) : result;
  operator = null;
  previousValue = '';
  shouldResetDisplay = true;
  updateDisplay();
}

function getOperatorSymbol(op) {
  const symbols = {
    add: '+',
    subtract: '−',
    multiply: '×',
    divide: '÷'
  };
  return symbols[op] || '';
}

// Format number for display
function formatNumber(num) {
  if (Number.isInteger(num)) return num.toString();
  return parseFloat(num.toFixed(10)).toString();
}

// Clear calculator
function clear() {
  currentValue = '0';
  previousValue = '';
  operator = null;
  shouldResetDisplay = false;
  expression = '';
  updateDisplay();
}

// Toggle sign
function toggleSign() {
  if (currentValue !== '0') {
    currentValue = currentValue.startsWith('-')
      ? currentValue.slice(1)
      : '-' + currentValue;
    updateDisplay();
  }
}

// Calculate percentage
function percentage() {
  currentValue = (parseFloat(currentValue) / 100).toString();
  updateDisplay();
}

// Add button press animation
function addPressAnimation(button) {
  button.classList.add('pressed');
  setTimeout(() => button.classList.remove('pressed'), 150);
}

// Event Listeners
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', () => {
    addPressAnimation(button);

    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value !== undefined) {
      inputNumber(value);
    } else if (action) {
      switch (action) {
        case 'clear':
          clear();
          break;
        case 'sign':
          toggleSign();
          break;
        case 'percent':
          percentage();
          break;
        case 'equals':
          calculate();
          break;
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
          inputOperator(action);
          break;
      }
    }
  });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (/[0-9.]/.test(key)) {
    inputNumber(key);
  } else if (key === '+') {
    inputOperator('add');
  } else if (key === '-') {
    inputOperator('subtract');
  } else if (key === '*') {
    inputOperator('multiply');
  } else if (key === '/') {
    e.preventDefault();
    inputOperator('divide');
  } else if (key === 'Enter' || key === '=') {
    calculate();
  } else if (key === 'Escape' || key === 'c' || key === 'C') {
    clear();
  } else if (key === '%') {
    percentage();
  }
});

// Initialize display
updateDisplay();
