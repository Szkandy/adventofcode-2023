import { readFileSync } from 'fs';
import { resolve } from 'path';

const digits = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
];

const wordToDigit = {
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9',
};

function getAllIndexes(line: string, val: string) {
  const indexes = [];
  let i = -1;

  while ((i = line.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}


function getFirstAndLastDigit(line: string): string {
  let firstDigit = '';
  let firstDigitIndex = 999999999999;
  let lastDigit = '';
  let lastDigitIndex = -1;

  digits.forEach((digit) => {
    const indexes = getAllIndexes(line, digit);
    if (indexes.length === 0) return;

    const lastIndex = indexes[indexes.length - 1];

    if (lastIndex > lastDigitIndex) {
      lastDigit = digit;
      lastDigitIndex = lastIndex;
    }

    if (indexes[0] < firstDigitIndex) {
      firstDigit = digit;
      firstDigitIndex = indexes[0];
    }
  });

  if (firstDigit in wordToDigit) {
    firstDigit = wordToDigit[firstDigit as keyof typeof wordToDigit];
  }

  if (lastDigit in wordToDigit) {
    lastDigit = wordToDigit[lastDigit as keyof typeof wordToDigit];
  }

  return firstDigit + lastDigit;
}

const input = readFileSync(resolve(__dirname, 'trebuchet.txt'), 'utf-8').trim();
const lines = input.split('\n');
let sum = 0;


for (const line of lines) {
  const lineNumber = getFirstAndLastDigit(line);
  sum += +lineNumber;
  console.log(line, +lineNumber, sum);
}

console.log(sum);