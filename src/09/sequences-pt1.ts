import { readFileSync } from 'fs';
import { resolve } from 'path';

function getNextSequence(sequence: number[]) {
  const nextSeq: number[] = [];

  for (let i = 1; i < sequence.length; i += 1) {
    nextSeq.push(sequence[i] - sequence[i - 1])
  }

  return nextSeq;
}

function calculateNextSequenceValue(sequence: number[]) {
  const sequences: number[][] = [sequence];

  while (true) {
    const nextSeq = getNextSequence(sequences[sequences.length - 1]);
    sequences.push(nextSeq);

    if (nextSeq.every(n => n === 0)) {
      break;
    }
  }

  return sequences.reduce((acc, seq) => acc + seq[seq.length -1], 0);
}


const input = readFileSync(resolve(__dirname, 'sequences.txt'), 'utf-8').trim();
const lines = input.split('\n');

const sequences = lines.map(l => l.split(' ').map(s => +s));

const nextValues = sequences.map(calculateNextSequenceValue)
const sum = nextValues.reduce((acc, n) => acc + n, 0);
console.log(sum);