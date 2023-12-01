#!/usr/bin/env -S deno -L info run

import { TextLineStream } from "https://deno.land/std@0.208.0/streams/mod.ts";

main()

export async function main (): Promise<void> {
  let sum = 0
  const lines = Deno.stdin.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream())
  for await (const line of lines) {
    sum += extractNumber(line)
  }
  console.log(sum)
}

function extractNumber (text: string): number {
  let i = 0
  let j = text.length
  let x = null
  let y = null
  // Use classic pointer chasing to do this in O(n)
  while (i <= j && (x === null || y === null)) {
    if (x === null) {
      const num = parseNumber(text.slice(i))
      if (num !== null) {
        x = num
      } else {
        i++
      }
    }
    if (y === null) {
      const num = parseNumber(text.slice(j))
      if (num !== null) {
        y = num
      } else {
        j--
      }
    }
  }
  if (x === null || y === null) {
    throw new Error(`bad input: ${text}`)
  } else {
    return parseInt(`${x}${y}`, 10)
  }
}

function parseNumber(x: string): string | null {
  if (!x) {
    return null;
  }
  const matches = x.match(numsRegex)
  if (!matches) {
    return null;
  }
  const result = matches[0]
  switch (result) {
    case 'zero': return '0'
    case 'one': return '1'
    case 'two': return '2'
    case 'three': return '3'
    case 'four': return '4'
    case 'five': return '5'
    case 'six': return '6'
    case 'seven': return '7'
    case 'eight': return '8'
    case 'nine': return '9'
    default: return result
  }
}

const numsRegex = /^(\d|zero|one|two|three|four|five|six|seven|eight|nine)/i
