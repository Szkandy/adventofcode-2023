interface BoatRace {
  time: number;
  distance: number;
}

const races = [
  { time: 52, distance: 426 },
  { time: 94, distance: 1374 },
  { time: 75, distance: 1279 },
  { time: 94, distance: 1216 },
];

function getWindUpWinningTimes(race: BoatRace) {
  const winningTimes: number[] = [];

  for (let i = 0; i < race.time; i++) {
    const achievedDistance = i * (race.time - i);
    if (achievedDistance > race.distance) {
      winningTimes.push(i);
    }
  }

  return winningTimes;
}

const windUpTimes = races.map(getWindUpWinningTimes);
const possibilities = windUpTimes.reduce((acc, times) => acc * times.length, 1);
console.log(possibilities);