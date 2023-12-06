#!/usr/bin/env -S deno -L info run

import { flushStdIn } from '../io.ts'
import { Race, raceParser } from './parser.ts'

main()

export async function main(): Promise<void> {
  const raw = await flushStdIn()
  const races = raceParser(raw)
  console.log('solution 1', races.map(numStrategies).reduce((x, y) => x * y, 1))

  const strRace = races.reduce(
    (acc, { time, distance }) => ({
      time: acc.time + time,
      distance: acc.distance + distance,
    }),
    { time: '', distance: '' },
  )
  const longRace = {
    time: parseInt(strRace.time, 10),
    distance: parseInt(strRace.distance, 10),
  }
  console.log(
    'solution 2',
    numStrategies(longRace),
  )
}

function numStrategies(race: Race): number {
  return Array.from({ length: race.time }).map((_, i) => (race.time - i) * i)
    .filter((x) => race.distance < x).length
}
