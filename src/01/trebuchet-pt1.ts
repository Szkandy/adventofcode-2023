import { readFileSync } from 'fs';
import { resolve } from 'path';

const input = readFileSync(resolve(__dirname, 'trebuchet.txt'), 'utf-8').trim();
const lines = input.split('\n');
let sum = 0;

for (const line of lines) {
  let lineNumber = '';

  for (let i = 0; i < line.length; i++) {
    if (!isNaN(+line[i])) {
      lineNumber = line[i];

      break;
    }
  }

  for (let i = line.length - 1; i >= 0; i--) {
    if (!isNaN(+line[i])) {
      lineNumber += line[i];

      break;
    }
  }

  sum += +lineNumber;
}

console.log(sum);