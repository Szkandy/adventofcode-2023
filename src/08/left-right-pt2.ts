import { readFileSync } from 'fs';
import { resolve } from 'path';

interface MapNode {
  key: string;
  left: string;
  right: string;
}

function findStartNodes(map: Map<string, MapNode>) {
  const startNodes: MapNode[] = [];

  for (const [key, node] of map.entries()) {
    if (key.endsWith('A')) {
      startNodes.push(node);
    }
  }

  return startNodes;
}

function nextNode(current: MapNode, direction: string) {
  if (direction === 'L') {
    return current.left;
  } else {
    return current.right;
  }
}

function findEndNodeSteps(start: MapNode, map: Map<string, MapNode>, directions: string[]) {
  let current = start;

  let steps = 0;
  while (true) {
    const direction = directions[steps % directions.length];
    current = map.get(nextNode(current, direction))!;

    steps += 1;

    if (current.key.endsWith('Z')) {
      return steps;
    }
  }
}

function greatestCommonDivisor(a: number, b: number) {
  while (b != 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function leastCommonMultiple(steps: number[]) {
  return steps.reduce((acc, step) => acc * step / greatestCommonDivisor(acc, step), 1);
}

const input = readFileSync(resolve(__dirname, 'left-right.txt'), 'utf-8').trim();
const lines = input.split('\n');

const directions = lines.shift()!.split('');
lines.shift();

const map = new Map<string, MapNode>();

lines.forEach(line => {
  const [index, leftRight] = line.split(' = ');
  const [left, right] = leftRight.replace(/[()]/g, '').split(', ');

  map.set(index, { key: index, left, right });
});

const starts = findStartNodes(map);
const steps = starts.map(start => findEndNodeSteps(start, map, directions));

console.log(leastCommonMultiple(steps));