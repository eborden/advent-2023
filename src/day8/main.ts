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
    cursors = cursors.map((cursor) =>
      isFinish(cursor) ?
        cursor :
        {
          position: map.instructions[cursor.position][move],
          iteration: cursor.iteration + 1,
        }
    )
  } while (!cursors.every(isFinish))
  return findLCMOfArray(cursors.map(c => c.iteration))
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

function findLCMOfArray(numbers: number[]): number {
  return numbers.reduce((lcm, number) => findLCM(lcm, number), 1)
}

function findLCM(a: number, b: number): number {
  return (a * b) / findGCD(a, b);
}

function findGCD(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}
