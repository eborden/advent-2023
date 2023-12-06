import {
  integer,
  many1,
  Parser,
  RMap,
  seqMap,
  string,
  token,
} from 'applicative_parser/mod.ts'
import { parseOrThrow, sepBy } from '../parser.ts'

export type Race = {
  time: number
  distance: number
}

const pRace: Parser<unknown, Race[]> = RMap(
  ({ time, distance }) =>
    time.map((t, i) => ({ time: t, distance: distance[i] })),
  seqMap(
    (_, time, __, ___, distance) => ({ time, distance }),
    token(string('Time:')),
    sepBy(integer, many1(string(' '))),
    string('\n'),
    token(string('Distance:')),
    sepBy(integer, many1(string(' '))),
  ),
)

export const raceParser: (str: string) => Race[] = parseOrThrow(
  pRace,
)
