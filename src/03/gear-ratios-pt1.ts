import { readFileSync } from 'fs';
import { resolve } from 'path';

interface InputElement {
  char: string;
  value: string;
  isEmpty: boolean;
  isNumber: boolean;
  isSymbol: boolean;
  isPartNumber: boolean;
  x: number;
  y: number;
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

    elements.push({ char, value, isEmpty, isNumber, isSymbol, x, y, isPartNumber: false });
  }

  return elements;
}

function isNeighbourToSymbol(x: number, y: number, value: string, lines: InputElement[][]) {
  for (let j = y - 1; j < y + 2; j++) {
    for (let i = x - 1; i < x + value.length + 1; i++) {
      if (lines?.[j]?.[i]?.isSymbol) {
        return true;
      }
    }
  }

  return false;
}

const input = readFileSync(resolve(__dirname, 'gear-ratios.txt'), 'utf-8').trim();
const lines = input.split('\n');

const parsedLines: InputElement[][] = [];
for (let y = 0; y < lines.length; y++) {
  parsedLines.push(parseLine(lines[y], y));
}

let partNumbers: InputElement[] = [];
let sum = 0;
for (let y = 0; y < parsedLines.length; y++) {
  for (let x = 0; x < parsedLines[y].length; x++) {
    const element = parsedLines[y][x];
    if (element.isNumber) {
      if (isNeighbourToSymbol(x, y, element.value, parsedLines)) {
        element.isPartNumber = true;
        partNumbers.push(element);
        sum += +element.value;
      }

      x += element.value.length - 1;
    }
  }
}

console.log(sum); 
// console.log(JSON.stringify(partNumbers.map((p) => ({ y: p.y, x: p.x, value: p.value }))))
