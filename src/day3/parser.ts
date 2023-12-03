import {
  Parse,
  Parser,
  OneOf,
  RMap,
  choice,
  integer,
  many1,
  parse,
  string
} from "https://deno.land/x/applicative_parser@1.0.23/mod.ts"
import {sepBy} from '../parser.ts'

export type Cell =
  | {type: 'empty'}
  | {type: 'symbol', symbol: string}
  | {type: 'code', code: number, digits: number}

const pCell: Parser<unknown, Row> = RMap(xs => xs.flatMap(x => x),
  choice(
    RMap(() => [<Cell>{type: 'empty'}], string('.')),
    RMap(symbol => [<Cell>{type: 'symbol', symbol}], OneOf('!@#$%^&*+-/=')),
    RMap((code: number) => {
      const digits = Math.floor(Math.log10(code) + 1)
      // Fill the remaining code space with empty cells,
      // but retain the size of the code for later boundary checks.
      const arr = Array(digits - 1) .fill(<Cell>{type: 'empty'})
      arr.unshift(<Cell>{type: 'code', code, digits})
      return arr
    }, integer)
  )
)

export type Row = Array<Cell>

const pRow: Parser<unknown, Row> = RMap(xs => xs.flatMap(x => x), many1(pCell))

export type Schematic = Array<Row>

const pSchematic: Parser<unknown, Schematic> = sepBy(pRow, string('\n'))

export const schematicParser: Parse<string, Schematic> = parse(pSchematic)
