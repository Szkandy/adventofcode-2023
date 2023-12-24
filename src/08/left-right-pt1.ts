import { readFileSync } from 'fs';
import { resolve } from 'path';

interface MapNode {
  left: string;
  right: string;
}

const input = readFileSync(resolve(__dirname, 'left-right.txt'), 'utf-8').trim();
const lines = input.split('\n');

const directions = lines.shift()!.split('');
lines.shift();

const map = new Map<string, MapNode>();

lines.forEach(line => {
  const [index, leftRight] = line.split(' = ');
  const [left, right] = leftRight.replace(/[()]/g, '').split(', ');

  map.set(index, { left, right });
});

let current = 'AAA';
let step = 0;
while (true) {
  const direction = directions[step % directions.length];
  const node = map.get(current)!;

  console.log(`Step ${step}: ${current} -> ${direction} -> ${direction === 'L' ? node.left : node.right}`);

  if (direction === 'L') {
    current = node.left;
  } else {
    current = node.right;
  }

  step += 1;
  if (current === 'ZZZ') {
    break;
  }

}

console.log(step);