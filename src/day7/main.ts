#!/usr/bin/env -S deno -L info run

import { stdInLines } from '../io.ts'
import { Hand, handParser } from './parser.ts'

main()

export async function main(): Promise<void> {
  const hands: Record<string, Hand[]> = {
    '5': [],
    '4': [],
    '32': [],
    '3': [],
    '22': [],
    '2': [],
    '': [],
  }
  for await (const line of stdInLines()) {
    const hand = handParser(line)
    const handValue = getHandValue(hand)
    hands[handValue].push(hand)
  }
  const sortedHands = [
    ...hands[5].sort(compareHand),
    ...hands[4].sort(compareHand),
    ...hands[32].sort(compareHand),
    ...hands[3].sort(compareHand),
    ...hands[22].sort(compareHand),
    ...hands[2].sort(compareHand),
    ...hands[''].sort(compareHand),
  ]
  console.log(
    'solution 1',
    score(sortedHands),
  )
}

function getHandValue(hand: Hand): string {
  return [...hand.cards].sort(compareCard).reduce(collectMatches, [])
    .map((x) => x.length + '').sort().reverse().filter((x) => '1' !== x).join(
      '',
    )
}

function collectMatches(acc: string[][], card: string): string[][] {
  if (acc.length === 0) return [[card]]

  const group: string[] = acc[acc.length - 1]
  const lastCard = group[group.length - 1]
  if (card === lastCard) group.push(card)
  else acc.push([card])

  return acc
}

function score(hands: Hand[]): number {
  return hands.map(({ bet }, i, arr) => bet * (arr.length - i)).reduce((x, y) =>
    x + y
  )
}

function compareCard(a: string, b: string): number {
  return cardValue[b] - cardValue[a]
}

function compareHand({ cards: a }: Hand, { cards: b }: Hand): number {
  for (let i = 0; i < 5; i++) {
    const comp = compareCard(a[i], b[i])
    if (comp !== 0) return comp
  }
  return 0
}

const cardValue: Record<string, number> = toValue([
  'A',
  'K',
  'Q',
  'J',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
])

function toValue(arr: string[]): Record<string, number> {
  return arr.reduce((obj, c: string, i: number, self: Array<string>) => {
    obj[c] = self.length - i
    return obj
  }, <Record<string, number>> {})
}
