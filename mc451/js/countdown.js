document.addEventListener("DOMContentLoaded", function() {
  const givenNumbersEl = document.getElementById('givenNumbers');
  const targetNumberEl = document.getElementById('targetNumber');
  const generateButton = document.getElementById('generate');
  const submitButton = document.getElementById('submit');
  const userInputEl = document.getElementById('userInput');
  const resultEl = document.getElementById('result');
  const largeNumbersEl = document.getElementById('largeNumbers');

  let givenNumbers = [];
  let targetNumber = 0;

  generateButton.addEventListener('click', function() {
    const largeNumbersCount = parseInt(largeNumbersEl.value);
    givenNumbers = generateGivenNumbers(largeNumbersCount);
    targetNumber = generateTargetNumber();

    givenNumbersEl.innerHTML = 'Given Numbers: ' + givenNumbers.join(', ');
    targetNumberEl.innerHTML = 'Target Number: ' + targetNumber;
  });

  submitButton.addEventListener('click', function() {
    const userInput = userInputEl.value;
    if (isValidEquation(userInput, givenNumbers, targetNumber)) {
      resultEl.innerHTML = 'Correct!';
    } else {
      resultEl.innerHTML = 'Incorrect. Try Again.';
    }
  });
});

function generateGivenNumbers(largeNumbersCount) {
  const smallNumbers = Array.from({length: 20}, (_, i) => i + 1);
  const largeNumbers = [25, 50, 75, 100];
  const selectedLargeNumbers = [];
  const selectedSmallNumbers = [];

  for (let i = 0; i < largeNumbersCount; i++) {
    const index = Math.floor(Math.random() * largeNumbers.length);
    selectedLargeNumbers.push(largeNumbers.splice(index, 1)[0]);
  }

  for (let i = 0; i < 6 - largeNumbersCount; i++) {
    const index = Math.floor(Math.random() * smallNumbers.length);
    selectedSmallNumbers.push(smallNumbers.splice(index, 1)[0]);
  }

  return selectedLargeNumbers.concat(selectedSmallNumbers);
}

function generateTargetNumber() {
  return Math.floor(Math.random() * 899) + 100;
}

function isValidEquation(equation, numbers, target) {
  // This is a placeholder. Actual validation logic would go here.
  return false;
}
