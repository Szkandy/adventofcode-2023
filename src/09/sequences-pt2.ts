import { readFileSync } from 'fs';
import { resolve } from 'path';

function getNextSequence(sequence: number[]) {
  const nextSeq: number[] = [];

  for (let i = 1; i < sequence.length; i += 1) {
    nextSeq.push(sequence[i] - sequence[i - 1])
  }

  return nextSeq;
}

function calculatePrevSequenceValue(sequence: number[]) {
  const sequences: number[][] = [sequence];

  while (true) {
    const nextSeq = getNextSequence(sequences[sequences.length - 1]);
    sequences.push(nextSeq);

    if (nextSeq.every(n => n === 0)) {
      break;
    }
  }

  for (let i = sequences.length - 2; i >= 0; i -= 1) {
    const prevVal = sequences[i][0] - sequences[i + 1][0];
    sequences[i].unshift(prevVal);
  }  

  return sequences[0][0];
}


const input = readFileSync(resolve(__dirname, 'sequences.txt'), 'utf-8').trim();
const lines = input.split('\n');

const sequences = lines.map(l => l.split(' ').map(s => +s));

const prevValues = sequences.map(calculatePrevSequenceValue)
const sum = prevValues.reduce((acc, n) => acc + n, 0);
console.log(sum);