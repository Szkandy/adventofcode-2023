import { readFileSync } from 'fs';
import { resolve } from 'path';

interface IdMapItem {
  idx: number;
  sourceFrom: number;
  sourceTo: number;
  targetFrom: number;
  targetTo: number;
}

interface IdMap {
  name: string;
  ranges: IdMapItem[];
}

function parseMaps(mapsSource: string[]): IdMap[] {
  const maps: IdMap[] = [];

  mapsSource.forEach(mapSource => {
    const lines = mapSource.split('\n');
    lines.shift(); // remove first line
    const name = lines.shift()!.replace(' map:', '');

    const ranges = lines.map((line, idx) => {
      const [target, source, length] = line.split(' ').map(Number);

      return { idx, sourceFrom: source, sourceTo: source + length, targetFrom: target, targetTo: target + length };
    }).filter(({ targetTo }) => !isNaN(targetTo));

    maps.push({ name, ranges });
  });

  return maps;
}

function seedToLocation(seed: number, maps: IdMap[]): number {
  let location = seed;

  for (const { name, ranges } of maps) {
    for (const { idx, sourceFrom, sourceTo, targetFrom, targetTo } of ranges) {
      if (location >= sourceFrom && location <= sourceTo) {
        const oldLocation = location;
        location = targetFrom + (location - sourceFrom);
        console.log(`Seed ${seed} (${name} #${idx}) ${oldLocation} -> ${location}`);
        break;
      }
    }
  }

  return location;
}

const input = readFileSync(resolve(__dirname, 'seed-to-location.txt'), 'utf-8').trim();
const lines = input.split('\n');
const seeds = lines.shift()!.replace('seeds: ', '').split(' ').map(Number);

const maps = parseMaps(lines.join('\n').split(';'));

const mins = seeds.map((seed) => seedToLocation(seed, maps));
console.log(Math.min(...mins));