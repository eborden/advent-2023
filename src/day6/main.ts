#!/usr/bin/env -S deno -L info run

import { flushStdIn } from '../io.ts'
import { raceParser } from './parser.ts'

main()

export async function main(): Promise<void> {
  const raw = await flushStdIn()
  console.log(
    raceParser(raw).map((race) =>
      Array.from({ length: race.time }).map((_, i) => (race.time - i) * i)
        .filter((x) => race.distance < x).length
    ).reduce((x, y) => x * y, 1),
  )
}
