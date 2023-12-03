#!/usr/bin/env -S deno -L info run

import {TextLineStream} from "https://deno.land/std@0.208.0/streams/mod.ts";
import {roundParser, Round, CubeSet} from "./parser.ts"

main()

export async function main (): Promise<void> {
  let solution1 = 0
  let solution2 = 0

  const lines = Deno.stdin.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream())

  for await (const line of lines) {
    const {result: round} = roundParser({cs: line, pos: 0, attr: ''})
    if (round === undefined) throw new Error(round)

    if (isPossible(round, {red: 12, green: 13, blue: 14})) {
      solution1 += round.id
    }
    solution2 += powerSet(minSet(round))
  }
  console.log(solution1)
  console.log(solution2)
}

function isPossible({sets}: Round, {red, green, blue}: CubeSet): boolean {
  return sets.every(x => x.red <= red && x.green <= green && x.blue <= blue)
}

function minSet({sets}: Round): CubeSet {
  return sets.reduce((x, {red, green, blue}) =>
    ({
      red: max(x.red, red),
      green: max(x.green, green),
      blue: max(x.blue, blue)
    }),
    {red: 0, green: 0, blue: 0}
  )
}

function max(x: number, y: number): number {
  return x > y ? x : y
}

function powerSet({red, green, blue}: CubeSet): number {
  return red * green * blue
}
