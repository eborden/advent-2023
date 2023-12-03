import {
  Parse,
  Parser,
  RMap,
  integer,
  parse,
  seqMap,
  string
} from "https://deno.land/x/applicative_parser@1.0.23/mod.ts"
import {sepBy, stringUnion} from '../parser.ts'

const colors = <const>['red', 'green', 'blue']

type Color = typeof colors[number]

const pColor: Parser<unknown, Color> = stringUnion(...colors)

type Cube = {
  count: number,
  color: Color
}

const pCube: Parser<unknown, Cube> = seqMap(
  (count, _, color) => ({count, color}),
  integer, string(' '), pColor
)

export type CubeSet = {
  red: number,
  green: number,
  blue: number
}

const emptyCubeSet = () => ({
  red: 0,
  green: 0,
  blue: 0
})

const pCubeSet: Parser<unknown, CubeSet> = RMap(
  xs => xs.reduce((start, {color, count}) => {
    start[color] += count
    return start
  }, emptyCubeSet()),
  sepBy(pCube, string(', '))
)

export type Round = {
  id: number
  sets: Array<CubeSet>,
}

const pRound: Parser<unknown, Round> = seqMap(
  (_, id, __, sets) => ({id, sets}),
  string('Game '), integer, string(': '), sepBy(pCubeSet, string('; '))
)

export const roundParser: Parse<string, Round> = parse(pRound)
