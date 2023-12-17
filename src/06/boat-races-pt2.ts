interface BoatRace {
  time: number;
  distance: number;
}

const race =
  { time: 52947594, distance: 426137412791216 };


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

const winingTimes = getWindUpWinningTimes(race);
console.log(winingTimes.length);