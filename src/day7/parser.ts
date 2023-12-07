import {
  integer,
  many1,
  OneOf,
  Parser,
  seqMap,
  token,
} from 'applicative_parser/mod.ts'
import { parseOrThrow } from '../parser.ts'

export type Hand = {
  cards: Array<string>
  bet: number
}

const card: Parser<unknown, string> = OneOf('AKQJT98765432')

const hand: Parser<unknown, Hand> = seqMap(
  (cards, bet) => ({ cards, bet }),
  token(many1(card)),
  integer,
)

export const handParser: (str: string) => Hand = parseOrThrow(hand)
