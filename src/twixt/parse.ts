import { Position } from "./board";

export const parseMoves = (rawMovesString: string) => {
  const rawMoves = rawMovesString.split(',')

  return rawMoves.map(parseMove)
}

export const parseMove = (rawMove: string): Position => {
  const rawColumn = rawMove[0]
  const rawRow = rawMove.substring(1)

  return {
    row: Number(rawRow) - 1,
    column: rawColumn.charCodeAt(0) - 'A'.charCodeAt(0)
  }
}

