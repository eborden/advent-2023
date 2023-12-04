import {
  choice,
  many,
  parse,
  Parser,
  RMap,
  seqMap,
  string,
} from 'applicative_parser/mod.ts'

export function parseOrThrow<A>(
  parser: Parser<unknown, A>,
): (str: string) => A {
  const p = parse(parser)
  return (str) => {
    const { result, errors } = p({ cs: str, pos: 0, attr: '' })
    if (result === undefined) throw new Error(errors.toString())
    return result
  }
}

export function sepBy<A, B>(
  p: Parser<unknown, A>,
  sep: Parser<unknown, B>,
): Parser<unknown, Array<A>> {
  return seqMap(
    (x, xs) => ([x].concat(xs)),
    p,
    many(seqMap((_, x) => x, sep, p)),
  )
}

export function stringUnion<A>(...choices: Array<A>): Parser<unknown, A> {
  return RMap((x) => <A> x, choice(...choices.map((x) => string(<string> x))))
}
