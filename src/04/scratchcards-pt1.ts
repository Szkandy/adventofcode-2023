import { readFileSync } from 'fs';
import { resolve } from 'path';

interface Scratchcard {
  id: number;
  winningNumbers: number[];
  numbers: number[];
  points: number;
}

function parseScratchcardNumbers(numbers: string): number[] {
  return numbers.split(' ').filter((n) => n !== '').map((n) => +n);
}

function calculatePoints(scratchcard: Scratchcard): number {
  let points = 0;

  for (const number of scratchcard.numbers) {
    if (scratchcard.winningNumbers.includes(number)) {
      if (points === 0) {
        points = 1;
      } else {
        points *= 2;
      }
    }
  }

  return points;
}

function parseLine(line: string, id: number): Scratchcard {
  const [, allNumbers] = line.split(': ');
  let [winningNumbers, numbers] = allNumbers.split(' | ');

  const card = {
    id,
    winningNumbers: parseScratchcardNumbers(winningNumbers),
    numbers: parseScratchcardNumbers(numbers),
    points: 0,
  };

  card.points = calculatePoints(card);

  return card;
}



const input = readFileSync(resolve(__dirname, 'scratchcards.txt'), 'utf-8').trim();
const lines = input.split('\n');

let sum = 0;
for (let i = 0; i < lines.length; i++) {
  const scratchcard = parseLine(lines[i], i + 1);
  sum += scratchcard.points;
}

console.log(sum);