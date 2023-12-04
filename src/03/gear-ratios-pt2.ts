import { readFileSync } from 'fs';
import { resolve } from 'path';

interface InputElement {
  char: string;
  value: string;
  isEmpty: boolean;
  isNumber: boolean;
  isSymbol: boolean;
  isGearRatio: boolean;
  x: number;
  y: number;
  adjacent: InputElement[];
}

function parseLine(line: string, y: number): InputElement[] {
  const elements: InputElement[] = [];

  for (let x = 0; x < line.length; x++) {
    const char = line[x];
    const isEmpty = char === '.';
    const isNumber = !isEmpty && !isNaN(+char);
    const isSymbol = !isEmpty && !isNumber;

    let value = char;
    if (isNumber) {
      let j = x + 1;
      while (j < line.length && !isNaN(+line[j])) {
        value += line[j];
        j++;
      }
    }

    elements.push({ char, value, isEmpty, isNumber, isSymbol, x, y, isGearRatio: false, adjacent: [] });
  }

  return elements;
}

function getStartOfNumber(x: number, y: number, lines: InputElement[][]): InputElement {
  let j = x - 1;
  while (j >= 0 && lines[y][j].isNumber) {
    j--;
  }

  return lines[y][j + 1];
}

function getAdjacentNumbers(x: number, y: number, lines: InputElement[][]): InputElement[] {
  const adjacent: InputElement[] = [];

  for (let j = y - 1; j < y + 2; j++) {
    for (let i = x - 1; i < x + 2; i++) {
      if (lines?.[j]?.[i]?.isNumber) {
        const newItem = getStartOfNumber(i, j, lines);
        if (!adjacent.find((a) => a.x === newItem.x && a.y === newItem.y)) {
          adjacent.push(newItem);
        }
      }
    }
  }

  return adjacent;
}


const input = readFileSync(resolve(__dirname, 'gear-ratios.txt'), 'utf-8').trim();
const lines = input.split('\n');

const parsedLines: InputElement[][] = [];
for (let y = 0; y < lines.length; y++) {
  parsedLines.push(parseLine(lines[y], y));
}

const gerRatios: InputElement[] = [];
let sum = 0;
for (let y = 0; y < parsedLines.length; y++) {
  for (let x = 0; x < parsedLines[y].length; x++) {
    const element = parsedLines[y][x];

    if (element.isSymbol && element.value === '*') {
      element.adjacent = getAdjacentNumbers(x, y, parsedLines);
      element.isGearRatio = element.adjacent.length === 2;
      gerRatios.push(element);

      if (element.isGearRatio) {
        const [a, b] = element.adjacent;
        const ratio = +a.value * +b.value;
        sum += ratio;
      }
    }
   
  }
}

console.log(sum);
