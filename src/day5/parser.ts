import {
  integer,
  many1,
  OneOf,
  Parser,
  RMap,
  seqMap,
  string,
  strtok,
  token,
} from 'applicative_parser/mod.ts'
import { parseOrThrow, sepBy } from '../parser.ts'

export type RangeExpr = {
  source: number
  destination: number
  length: number
}

const pRangeExpr: Parser<unknown, RangeExpr> = seqMap(
  (destination, source, length) => ({ source, destination, length }),
  token(integer),
  token(integer),
  integer,
)

const alpha: Parser<unknown, string> = RMap(
  (x) => x.join(''),
  many1(OneOf('abcdefghijklmnopqrstuvwxyz')),
)

const pName: Parser<unknown, [string, string]> = seqMap(
  (source, _, dest) => [source, dest],
  alpha,
  string('-to-'),
  alpha,
)

const pCategories: Parser<
  unknown,
  Record<string, { to: string; ranges: Array<RangeExpr> }>
> = seqMap(
  ([source, to], _, ranges) => ({ [source]: { ranges, to } }),
  token(pName),
  string('map:\n'),
  sepBy(pRangeExpr, string('\n')),
)

export type Almanac = {
  seeds: Array<[number, number]>
  categories: Record<string, {
    to: string
    ranges: Array<RangeExpr>
  }>
}

const pAlmanac: Parser<unknown, Almanac> = seqMap(
  (_, seeds, __, cats) => ({
    seeds,
    categories: cats.reduce((x, y) => ({ ...x, ...y }), {}),
  }),
  strtok('seeds: '),
  sepBy(
    seqMap((x, y) => <[number, number]> [x, y], token(integer), integer),
    string(' '),
  ),
  many1(string('\n')),
  sepBy(pCategories, many1(string('\n'))),
)

export const almanacParser: (str: string) => Almanac = parseOrThrow(
  pAlmanac,
)
