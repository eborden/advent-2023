import {
  integer,
  many1,
  Parser,
  seqMap,
  string,
  token,
} from 'applicative_parser/mod.ts'
import { parseOrThrow } from '../parser.ts'

export type Card = {
  id: number
  scratch: Set<number>
  winning: Set<number>
}
const pCard: Parser<unknown, Card> = seqMap(
  (_, id, __, scratch, ___, winning) => ({
    id,
    scratch: new Set(scratch),
    winning: new Set(winning),
  }),
  token(string('Card')),
  integer,
  token(string(':')),
  many1(token(integer)),
  token(string('|')),
  many1(token(integer)),
)

export const cardParser: (str: string) => Card = parseOrThrow(pCard)
