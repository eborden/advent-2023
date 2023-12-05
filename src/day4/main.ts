#!/usr/bin/env -S deno -L info run

import { cardParser } from './parser.ts'
import { stdInLines } from '../io.ts'

main()

export async function main(): Promise<void> {
  let solution1 = 0

  const cardCopies: number[] = []
  for await (const line of stdInLines()) {
    const card = cardParser(line)
    const matches = intersection(card.scratch, card.winning)

    solution1 += score(matches)

    // Add an initial copy for solution2
    incrementIndex(cardCopies, card.id)
    // Iterate through each copy of a card
    for (let i = 0; i < cardCopies[card.id]; i++) {
      // Increment next `n` cards from `n` matches on the card
      Array.from(matches).forEach((_, i) => {
        incrementIndex(cardCopies, 1 + i + card.id)
      })
    }
  }
  const solution2 = cardCopies.reduce((x, y) => x + y, 0)

  console.log(solution1)
  console.log(solution2)
}

function score<A>([x, ...xs]: Set<A>): number {
  if (x === undefined) return 0
  return xs.reduce((score, _) => score * 2, 1)
}

function intersection<A>(xs: Set<A>, ys: Set<A>): Set<A> {
  return new Set(Array.from(xs).filter((x) => ys.has(x)))
}

function incrementIndex(xs: Array<number>, i: number) {
  if (xs[i]) xs[i] += 1
  else xs[i] = 1
}
