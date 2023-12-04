import { readFileSync } from 'fs';
import { resolve } from 'path';

const RED_CUBES = 12;
const GREEN_CUBES = 13;
const BLUE_CUBES = 14;

interface CubeGameDraw {
  red: number;
  green: number;
  blue: number;
}

interface CubeGame {
  id: number;
  isValid: boolean;
  minimum: CubeGameDraw;
  minimumPower: number;
  draws: CubeGameDraw[];
}

function parseLine(line: string): CubeGame {
  const gameAndDraws = line.split(': ');
  const gameId = +gameAndDraws[0].split(' ')[1];
  const draws = gameAndDraws[1].split('; ');

  const minimum: CubeGameDraw = {
    red: 0,
    green: 0,
    blue: 0,
  };

  const parsedDraws: CubeGameDraw[] = [];
  let isValid = true;
  draws.forEach((draw) => {
    const parsedDrawValue: CubeGameDraw = {
      red: 0,
      green: 0,
      blue: 0,
    };

    draw.split(', ').forEach((drawValue) => {
      const [val, color] = drawValue.split(' ');
      parsedDrawValue[color as keyof CubeGameDraw] = +val;
    });

    if (parsedDrawValue.red > RED_CUBES || parsedDrawValue.green > GREEN_CUBES || parsedDrawValue.blue > BLUE_CUBES) {
      isValid = false;
    }

    if (parsedDrawValue.red > minimum.red) {
      minimum.red = parsedDrawValue.red;
    }

    if (parsedDrawValue.green > minimum.green) {
      minimum.green = parsedDrawValue.green;
    }

    if (parsedDrawValue.blue > minimum.blue) {
      minimum.blue = parsedDrawValue.blue;
    }

    parsedDraws.push(parsedDrawValue);
  });

  return {
    id: gameId,
    isValid,
    minimum,
    minimumPower: minimum.red * minimum.green * minimum.blue,
    draws: parsedDraws,
  }
}

const input = readFileSync(resolve(__dirname, 'cube-conundrum.txt'), 'utf-8').trim();
const lines = input.split('\n');

let sum = 0;
for (const line of lines) {
  const game = parseLine(line);
  sum += game.minimumPower;
}

console.log(sum);