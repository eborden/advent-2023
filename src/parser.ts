import {
  Parser,
  many,
  seqMap,
  choice,
  string,
  RMap
} from "https://deno.land/x/applicative_parser@1.0.23/mod.ts"

export function sepBy <A, B>(p: Parser<unknown, A>, sep: Parser<unknown, B>): Parser<unknown, Array<A>> {
  return seqMap(
    (x, xs) => ([x].concat(xs)),
    p, many(seqMap((_, x) => (x), sep, p))
  )
}

export function stringUnion <A>(...choices: Array<A>): Parser<unknown, A> {
  return RMap(x => <A>x, choice(...choices.map(x => string(<string>x))))
}
