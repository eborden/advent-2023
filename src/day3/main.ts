#!/usr/bin/env -S deno -L info run

import { Schematic, schematicParser } from './parser.ts'
import { flushStdIn } from '../io.ts'

main()

export async function main(): Promise<void> {
  const rawMap = await flushStdIn()
  const schematic = schematicParser(rawMap)

  let solution1 = 0
  const ratioMap: Map<string, Array<number>> = new Map([])
  schematic.forEach((row, i) => {
    row.forEach((_, j) => {
      const nums = extractAdjacentSymbol(i, j, schematic)
      if (nums.length > 0) {
        nums.forEach(({ code, symbol, symbolPosition }) => {
          // solution 1
          solution1 += code

          // accumuate solution 2
          if (symbol === '*') {
            const key = symbolPosition.join(',')
            ratioMap.set(key, [code, ...ratioMap.get(key) ?? []])
          }
        })
      }
    })
  })
  console.log(solution1)
  console.log(
    Array.from(ratioMap.values())
      .filter((xs) => xs.length > 1)
      .map((xs) => xs.reduce((x, y) => x * y, 1))
      .reduce((x, y) => x + y, 0),
  )
}

type Adjacent = {
  code: number
  symbol: string
  symbolPosition: [number, number]
}

function extractAdjacentSymbol(
  i: number,
  j: number,
  schematic: Schematic,
): Array<Adjacent> {
  const adjacents: Array<Adjacent> = []
  const cell = schematic[i][j]
  if (cell.type === 'code') {
    // Search for and accumulate adjacent symbols
    for (const [x, y] of buildSearchDirections(cell.digits)) {
      const row = schematic[i + y]
      if (row) {
        const neighbor = row[j + x]
        if (neighbor.type == 'symbol') {
          adjacents.push({
            code: cell.code,
            symbol: neighbor.symbol,
            symbolPosition: [j + x, i + y],
          })
        }
      }
    }
  }

  return adjacents
}

function buildSearchDirections(digits: number): number[][] {
  // Build right facing directions based on number of digits in code
  const dynamicDirections = Array.from(
    { length: digits },
    (_, i) => [[i + 1, 1], [i + 1, 0], [i + 1, -1]],
  ).flatMap((x) => x)
  const staticDirections = [[-1, 1], [0, 1], [0, -1], [-1, -1], [-1, 0]]
  return [...dynamicDirections, ...staticDirections]
}
