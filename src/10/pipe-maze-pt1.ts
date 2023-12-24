import { readFileSync } from 'fs';
import { resolve } from 'path';

type Direction = 'up' | 'down' | 'left' | 'right';
type Pipe = '|' | '-' | 'S' | 'L' | 'J' | '7' | 'F' | '.';

interface Point {
  x: number;
  y: number;
}

function getPipeDirections(pipe: Pipe): Direction[] {
  switch (pipe) {
    case 'S':
      return ['left', 'right'];
    case '|':
      return ['up', 'down'];
    case '-':
      return ['left', 'right'];
    case 'L':
      return ['up', 'right'];
    case 'J':
      return ['up', 'left'];
    case '7':
      return ['down', 'left'];
    case 'F':
      return ['down', 'right'];
    default:
      return [];
  }
}

function getNextPoint(point: Point, direction: Direction): Point {
  switch (direction) {
    case 'up':
      return { x: point.x, y: point.y - 1 };
    case 'down':
      return { x: point.x, y: point.y + 1 };
    case 'left':
      return { x: point.x - 1, y: point.y };
    case 'right':
      return { x: point.x + 1, y: point.y };
  }
}

function arePointsEqual(point1: Point, point2: Point): boolean {
  return point1.x === point2.x && point1.y === point2.y;
}


const input = readFileSync(resolve(__dirname, 'pipe-maze.txt'), 'utf-8');
const maze: Pipe[][] = input.split('\n').map((line) => line.split('')) as Pipe[][];

// read from the input file
let current: Point = { x: 100, y: 52 };
let previous: Point = { x: 100, y: 52 };

let steps = 0;

while (true) {
  const pipe = maze[current.y][current.x];
  const directions = getPipeDirections(pipe);
  const nextDirection = directions.find((dir) => !arePointsEqual(previous, getNextPoint(current, dir)));

  if (!nextDirection) {
    throw new Error('No next direction found');
  }

  previous = current;
  current = getNextPoint(current, nextDirection);
  steps++;

  if (maze[current.y][current.x] === 'S') {
    break;
  }
}

console.log(steps);
