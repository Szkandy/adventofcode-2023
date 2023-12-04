import { readFileSync } from 'fs';
import { resolve } from 'path';

interface Scratchcard {
  id: number;
  winningNumbers: number[];
  numbers: number[];
  won: number;
  count: number;
}

function parseScratchcardNumbers(numbers: string): number[] {
  return numbers.split(' ').filter((n) => n !== '').map((n) => +n);
}

function parseLine(line: string, id: number, bonusCount: number): Scratchcard {
  const [, allNumbers] = line.split(': ');
  let [winningNumbers, numbers] = allNumbers.split(' | ');

  const card: Scratchcard = {
    id,
    winningNumbers: parseScratchcardNumbers(winningNumbers),
    numbers: parseScratchcardNumbers(numbers),
    count: 1 + bonusCount,
    won: 0,
  };

  card.won = card.winningNumbers.filter((n) => card.numbers.includes(n)).length;

  return card;
}

const input = readFileSync(resolve(__dirname, 'scratchcards.txt'), 'utf-8').trim();
const lines = input.split('\n');

let sum = 0;
const wonBuffer = new Map<number, number>();
for (let i = 0; i < lines.length; i++) {
  const won = wonBuffer.get(i) ?? 0;
  const card = parseLine(lines[i], i + 1, won);

  for (let j = 0; j < card.won; j++) {
    const wonIndex = i + j + 1;
    wonBuffer.set(wonIndex, (wonBuffer.get(wonIndex) ?? 0) + (1 * card.count));
  }

  sum += card.count;
}

console.log(sum);