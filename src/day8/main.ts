#!/usr/bin/env -S deno -L info run

import { flushStdIn } from '../io.ts'
import { Map, mapParser, Move } from './parser.ts'

main()

export async function main(): Promise<void> {
  const raw = await flushStdIn()
  const map = mapParser(raw)
  console.log('solution 1', await traverse('AAA', moves(map.path), map))
}

async function traverse(
  position: string,
  path: AsyncGenerator<Move, Move>,
  map: Map,
): Promise<number> {
  if (position === 'ZZZ') return 0
  const { value: move } = await path.next()
  return 1 + await traverse(map.instructions[position][move], path, map)
}

async function* moves(array: Move[]): AsyncGenerator<Move, Move> {
  let i = 0
  while (true) {
    if (i == array.length) i = 0
    yield array[i]
    i++
  }
}
