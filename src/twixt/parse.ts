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

export const serializeMoves = (moves: Position[]) => {
  return moves.map(serializeMove).join(',')
}

export const serializeMove = (move: Position) => {
  const column = String.fromCharCode(move.column + 'A'.charCodeAt(0))
  const row = String(move.row + 1)

  return column + row
}
