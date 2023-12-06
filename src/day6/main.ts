#!/usr/bin/env -S deno -L info run

import { flushStdIn } from '../io.ts'

main()

export async function main(): Promise<void> {
  const raw = await flushStdIn()
  console.log(raw)
}
