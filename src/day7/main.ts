#!/usr/bin/env -S deno -L info run

import { stdInLines } from '../io.ts'
import { Hand, handParser } from './parser.ts'

main()

export async function main(): Promise<void> {
  const version2 = Deno.args[0] === '2'
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
    const handValue = (version2 ? getHandValue2 : getHandValue)(hand)
    hands[handValue].push(hand)
  }
  const compare = version2 ? compareHand2 : compareHand
  const sortedHands = [
    ...hands[5].sort(compare),
    ...hands[4].sort(compare),
    ...hands[32].sort(compare),
    ...hands[3].sort(compare),
    ...hands[22].sort(compare),
    ...hands[2].sort(compare),
    ...hands[''].sort(compare),
  ]
  console.log(
    'solution ',
    Deno.args[0] ?? '1',
    score(sortedHands),
  )
}

function getHandValue(hand: Hand): string {
  return [...hand.cards].sort(compareCard).reduce(collectMatches, [])
    .map((x) => x.length + '').sort().reverse().filter((x) => '1' !== x).join(
      '',
    )
}

function getHandValue2(hand: Hand): string {
  const sorted = [...hand.cards].sort(compareCard2)
  const grouped = sorted.reduce(collectMatches, []).sort(compareLength)
  if (grouped[0].length === 5) {
    return '5'
  }

  const highest = grouped[0][0] === 'J' ? grouped[1][0] : grouped[0][0]

  const value = sorted.map((x) => x === 'J' ? highest : x).sort(compareCard2)
    .reduce(
      collectMatches,
      [],
    )
    .filter((x) => x.length !== 1).sort(compareLength).map((x) => `${x.length}`)
    .join(
      '',
    )
  return value
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

function compareCard2(a: string, b: string): number {
  return cardValue2[b] - cardValue2[a]
}

function compareHand({ cards: a }: Hand, { cards: b }: Hand): number {
  for (let i = 0; i < 5; i++) {
    const comp = compareCard(a[i], b[i])
    if (comp !== 0) return comp
  }
  return 0
}

function compareHand2({ cards: a }: Hand, { cards: b }: Hand): number {
  for (let i = 0; i < 5; i++) {
    const comp = compareCard2(a[i], b[i])
    if (comp !== 0) return comp
  }
  return 0
}

function compareLength<A>(x: A[], y: A[]): number {
  return y.length - x.length
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

const cardValue2: Record<string, number> = toValue([
  'A',
  'K',
  'Q',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
  'J',
])

function toValue(arr: string[]): Record<string, number> {
  return arr.reduce((obj, c: string, i: number, self: Array<string>) => {
    obj[c] = self.length - i
    return obj
  }, <Record<string, number>> {})
}
