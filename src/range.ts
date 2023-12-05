export type Range = [number, number]

export function intersection(
  x: Range,
  y: Range,
): Range | null {
  const lower = Math.max(x[0], y[0])
  const upper = Math.min(x[1], y[1])
  if (lower <= upper) return [lower, upper]
  return null
}

export function difference(
  x: Range,
  y: Range,
): Array<Range> | null {
  if (x[1] < y[0]) {
    return [x]
  } else if (x[0] > y[1]) {
    return [x]
  } else if (y[0] <= x[0] && x[1] <= y[1]) {
    return []
  } else if (x[0] < y[0] && y[1] < x[1]) {
    return [[x[0], y[0] - 1], [y[1] + 1, x[1]]]
  } else if (x[1] < y[1]) {
    return [[x[0], y[0]]]
  } else {
    return [[y[1], x[1]]]
  }
}

export function isInRange(i: number, [lower, upper]: Range): boolean {
  return lower <= i && i <= upper
}
