import { TextLineStream } from 'std/streams/mod.ts'

export async function flushStdIn(): Promise<string> {
  const input = Deno.stdin.readable
    .pipeThrough(new TextDecoderStream())
  let str = ''
  for await (const chunk of input) {
    str += chunk
  }
  return str
}

export function stdInLines(): ReadableStream<string> {
  return Deno.stdin.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream())
}
