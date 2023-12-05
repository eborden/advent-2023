#!/usr/bin/env -S deno -L info run

import { Almanac, almanacParser, Range } from './parser.ts'

main()

export async function main(): Promise<void> {
  const input = Deno.stdin.readable
    .pipeThrough(new TextDecoderStream())
  let rawMap = ''
  for await (const chunk of input) {
    rawMap += chunk
  }
  const almanac = almanacParser(rawMap)
  const initial = Object.keys(almanac.categories)[0]
  console.log(
    'solution 1',
    almanac.seeds.flat().map((seed) => traverse(seed, initial, almanac)).reduce(
      min,
    ),
  )
  const solution2 = []
  for (const range of almanac.seeds) {
    const ranges = traverseRange(
      [range[0], range[0] + range[1]],
      initial,
      almanac,
    )
    solution2.push(ranges)
  }
  console.log(
    'solution 2',
    solution2.flatMap((xs) => xs.map(([lower, _]) => lower)).reduce(min),
  )
}

function traverseRange(
  [lower, upper]: [number, number],
  category: string,
  almanac: Almanac,
): Array<[number, number]> {
  if (category === 'location') return [[lower, upper]]

  const map = almanac.categories[category]
  return findDestinationIntersect([lower, upper], map.ranges).flatMap((bound) =>
    traverseRange(bound, map.to, almanac)
  )
}

function findDestinationIntersect(
  [lower, upper]: [number, number],
  ranges: Array<Range>,
): Array<[number, number]> {
  const intersects: Array<[number, number]> = []
  const sources: Array<[number, number]> = []
  let extras: Array<[number, number]> = []
  for (const range of ranges) {
    const bound = intersectRange([lower, upper], range)
    if (bound) {
      intersects.push(bound.destination)
      sources.push(bound.source)
      extras = [...extras, ...bound.extras]
    }
  }
  // Identity souces with no destination and clean up intersections
  const noMatches = sources.reduce(
    (acc, src) =>
      <[number, number][]>acc.flatMap(extra => getDifference(extra, src)),
    extras
  )
  if (intersects.length <= 0) return [[lower, upper], ...noMatches]
  return [...intersects, ...noMatches]
}

function intersectRange(
  x: [number, number],
  range: Range,
): {
  source: [number, number]
  destination: [number, number]
  extras: Array<[number, number]>
} | null {
  const y: [number, number] = [range.source, range.source + range.range]
  const intersect = getIntersect(x, y)
  if (intersect !== null) {
    const [lower, upper] = intersect
    return {
      source: [lower, upper],
      destination: [
        (lower - range.source) + range.destination,
        (upper - range.source) + range.destination,
      ],
      extras: <Array<[number, number]>> [
        x[0] < y[0] && x[0] < lower ? [x[0], lower - 1] : null,
        y[1] < x[1] && upper < x[1] ? [upper + 1, x[1]] : null,
      ].filter((x) => x),
    }
  }
  return null
}

function getIntersect(
  x: [number, number],
  y: [number, number],
): [number, number] | null {
  const lower = max(x[0], y[0])
  const upper = min(x[1], y[1])
  if (lower <= upper) return [lower, upper]
  return null
}

function getDifference(
  x: [number, number],
  y: [number, number],
): [number, number][] | null {
  if (x[1] < y[0]) {
    return [x]
  } else if (x[0] > y[1]) {
    return [x]
  } else if (y[0] <= x[0] && x[1] <= y[1]) {
    return []
  } else if(x[0] < y[0] && y[1] < x[1]) {
    return [[x[0], y[0] - 1], [y[1] + 1, x[1]]]
  } else if (x[1] < y[1]) {
    return [[x[0], y[0]]]
  } else {
    return [[y[1], x[1]]]
  }
}

function traverse(seed: number, category: string, almanac: Almanac): number {
  if (category === 'location') return seed

  const map = almanac.categories[category]
  return traverse(findDestination(seed, map.ranges), map.to, almanac)
}

function findDestination(seed: number, ranges: Array<Range>): number {
  for (const range of ranges) {
    if (isInRange(seed, range)) {
      return (seed - range.source) + range.destination
    }
  }
  return seed
}

function isInRange(seed: number, range: Range): boolean {
  return range.source <= seed && seed <= range.source + range.range
}

function min(x: number, y: number): number {
  return x < y ? x : y
}

function max(x: number, y: number): number {
  return x > y ? x : y
}
