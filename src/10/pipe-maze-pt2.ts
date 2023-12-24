import { readFileSync } from 'fs';
import { resolve } from 'path';
const classifyPoint = require("robust-point-in-polygon")

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

function getLoop(maze: Pipe[][], start: Point): Point[] {
  const loop: Point[] = [];
  let current = start;
  let previous = start;

  while (true) {
    loop.push(current);
    const pipe = maze[current.y][current.x];
    const directions = getPipeDirections(pipe);
    const nextDirection = directions.find((dir) => !arePointsEqual(previous, getNextPoint(current, dir)));

    if (!nextDirection) {
      throw new Error('No next direction found');
    }

    previous = current;
    current = getNextPoint(current, nextDirection);

    if (maze[current.y][current.x] === 'S') {
      break;
    }
  }

  return loop;
}

function findStart(maze: Pipe[][]): Point {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 'S') {
        return { x, y };
      }
    }
  }
  throw new Error('No start found');
}

const input = readFileSync(resolve(__dirname, 'pipe-maze.txt'), 'utf-8');
const maze: Pipe[][] = input.split('\n').map((line) => line.split('')) as Pipe[][];

const start = findStart(maze);
const loop = getLoop(maze, start);
const insidePolygon: Point[] = [];

for (let y = 0; y < maze.length; y++) {
  for (let x = 0; x < maze[y].length; x++) {
    const point = { x, y };
    // 3rd party library to check if a point is inside a polygon
    // @see https://github.com/mikolalysenko/robust-point-in-polygon
    if (classifyPoint(loop.map((p) => [p.x, p.y]), [point.x, point.y]) === -1) {
      insidePolygon.push(point);
    }
  }
}

// write the whole maze to the console and mark inside points with an X
for (let y = 0; y < maze.length; y++) {
  for (let x = 0; x < maze[y].length; x++) {
    const point = { x, y };
    if (insidePolygon.find((p) => arePointsEqual(p, point))) {
      process.stdout.write('X');
    } else {
      process.stdout.write(maze[y][x]);
    }
  }
  process.stdout.write('\n');
}

console.log('insidePolygon', insidePolygon.length);