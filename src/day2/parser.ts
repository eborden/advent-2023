import {
  seqMap, Parser, Parse, OneOf, integer, string, choice, RMap, parse, many
} from "https://deno.land/x/applicative_parser@1.0.23/mod.ts"

type Color = 'red' | 'green' | 'blue'

const pColor: Parser<unknown, Color> = RMap(x => <Color>x, choice(
  string('red'), string('green'), string('blue')
))

type Cube = {
  count: number,
  color: Color
}

const pCube: Parser<unknown, Cube> = seqMap(
  (count, _, color) => ({count, color}),
  integer, OneOf(' '), pColor
)

const sepBy: <A>(p: Parser<unknown, A>, x: string) => Parser<unknown, Array<A>> =
  (p, sep) => seqMap(
    (x, xs) => ([x].concat(xs)),
    p, many(seqMap((_, x) => (x), string(sep), p))
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
  sepBy(pCube, ', ')
)

export type Round = {
  id: number
  sets: Array<CubeSet>,
}

const pRound: Parser<unknown, Round> = seqMap(
  (_, id, __, sets) => ({id, sets}),
  string('Game '), integer, string(': '), sepBy(pCubeSet, '; ')
)

export const roundParser: Parse<string, Round> = parse(pRound)
