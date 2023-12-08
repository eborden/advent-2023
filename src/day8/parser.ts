import {
  between,
  many1,
  OneOf,
  Parser,
  RMap,
  seqMap,
  string,
  strtok,
} from 'applicative_parser/mod.ts'
import { parseOrThrow, sepBy } from '../parser.ts'

export type Move = 'L' | 'R'

export type Map = {
  path: Move[]
  instructions: Record<string, Instruction>
}

export type Instruction = {
  L: string
  R: string
}

const alphanum: Parser<unknown, string> = RMap(
  (x) => x.join(''),
  many1(OneOf('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')),
)

const instruction: Parser<unknown, Instruction> = between(
  string('('),
  string(')'),
  seqMap((L, _, R) => ({ L, R }), alphanum, strtok(','), alphanum),
)

const instructions: Parser<unknown, Record<string, Instruction>> = RMap(
  Object.fromEntries,
  sepBy(
    seqMap(
      (name, _, instruct) => [name, instruct],
      alphanum,
      strtok(' = '),
      instruction,
    ),
    string('\n'),
  ),
)

const map: Parser<unknown, Map> = seqMap(
  (path, _, inst) => ({ path: path.map((x) => <Move> x), instructions: inst }),
  many1(OneOf('LR')),
  many1(string('\n')),
  instructions,
)

export const mapParser: (str: string) => Map = parseOrThrow(map)
