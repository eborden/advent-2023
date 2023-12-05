#!/usr/bin/env -S deno -L info run

import { Almanac, almanacParser, RangeExpr } from './parser.ts'
import { difference, intersection, isInRange, Range } from '../range.ts'
import { flushStdIn } from '../io.ts'

main()

export async function main(): Promise<void> {
  const rawAlmanac = await flushStdIn()
  const almanac = almanacParser(rawAlmanac)
  const initial = Object.keys(almanac.categories)[0]

  console.log(
    'solution 1',
    almanac.seeds.flat().map((seed) => traverse(seed, initial, almanac)).reduce(
      (x, y) => Math.min(x, y),
    ),
  )

  console.log(
    'solution 2',
    almanac.seeds.map((range) =>
      traverseRange(
        [range[0], range[0] + range[1]],
        initial,
        almanac,
      )
    ).flatMap((xs) => xs.map(([lower, _]) => lower)).reduce((x, y) =>
      Math.min(x, y)
    ),
  )
}

function traverseRange(
  [lower, upper]: Range,
  category: string,
  almanac: Almanac,
): Array<Range> {
  if (category === 'location') return [[lower, upper]]

  const map = almanac.categories[category]
  return findDestinationIntersect([lower, upper], map.ranges).flatMap((range) =>
    traverseRange(range, map.to, almanac)
  )
}

function findDestinationIntersect(
  [lower, upper]: Range,
  rangeExprs: Array<RangeExpr>,
): Array<Range> {
  const intersects: Array<Range> = []
  const sources: Array<Range> = []
  let extras: Array<Range> = []
  for (const rangeExpr of rangeExprs) {
    const ranges = intersectRange([lower, upper], rangeExpr)
    if (ranges) {
      intersects.push(ranges.destination)
      sources.push(ranges.source)
      extras = [...extras, ...ranges.extras]
    }
  }
  // Identity souces with no destination and clean up intersections
  const noMatches = sources.reduce(
    (acc, src) => <Range[]> acc.flatMap((extra) => difference(extra, src)),
    extras,
  )
  if (intersects.length <= 0) return [[lower, upper], ...noMatches]
  return [...intersects, ...noMatches]
}

function intersectRange(
  x: Range,
  rangeExpr: RangeExpr,
): {
  source: Range
  destination: Range
  extras: Array<Range>
} | null {
  const y: Range = [rangeExpr.source, rangeExpr.source + rangeExpr.length]
  const intersect = intersection(x, y)
  if (intersect !== null) {
    const [lower, upper] = intersect
    return {
      source: [lower, upper],
      destination: [
        (lower - rangeExpr.source) + rangeExpr.destination,
        (upper - rangeExpr.source) + rangeExpr.destination,
      ],
      extras: <Array<Range>> [
        x[0] < y[0] && x[0] < lower ? [x[0], lower - 1] : null,
        y[1] < x[1] && upper < x[1] ? [upper + 1, x[1]] : null,
      ].filter((x) => x),
    }
  }
  return null
}

function traverse(seed: number, category: string, almanac: Almanac): number {
  if (category === 'location') return seed

  const map = almanac.categories[category]
  return traverse(findDestination(seed, map.ranges), map.to, almanac)
}

function findDestination(seed: number, rangeExprs: Array<RangeExpr>): number {
  for (const rangeExpr of rangeExprs) {
    if (
      isInRange(seed, [rangeExpr.source, rangeExpr.source + rangeExpr.length])
    ) {
      return (seed - rangeExpr.source) + rangeExpr.destination
    }
  }
  return seed
}
