#!/usr/bin/env -S deno -L info run

import { flushStdIn } from '../io.ts'
import { Map, mapParser, Move } from './parser.ts'

main()

export async function main(): Promise<void> {
  const raw = await flushStdIn()
  const map = mapParser(raw)

  console.log(
    'solution 1',
    traverse(
      [mkCursor('AAA')],
      moves(map.path),
      map,
      (c) => c.position === 'ZZZ',
    ),
  )

  const cursors = Object.keys(map.instructions)
    .filter((x) => x[2] === 'A')
    .map((position) => mkCursor(position))
  console.log(
    'solution 2',
    traverse(cursors, moves(map.path), map, (c) => c.position[2] === 'Z'),
  )
}

function traverse(
  cursors: Cursor[],
  path: Generator<Move, Move>,
  map: Map,
  isFinish: (cursor: Cursor) => boolean,
): number {
  do {
    const { value: move } = path.next()
    cursors = cursors.map((cursor) => ({
      position: map.instructions[cursor.position][move],
      iteration: cursor.iteration + 1,
    }))
  } while (!cursors.every(isFinish))
  return cursors[0].iteration
}

function* moves(array: Move[]): Generator<Move, Move> {
  let i = 0
  while (true) {
    if (i == array.length) i = 0
    yield array[i]
    i++
  }
}

type Cursor = {
  position: string
  iteration: number
}

function mkCursor(position: string): Cursor {
  return { position, iteration: 0 }
}
