export type Vector = {
  row: number,
  column: number
}

export const addVectors = (...vectors: Vector[]): Vector => {
  return {
    row: vectors.reduce((sum, vector) => sum + vector.row, 0),
    column: vectors.reduce((sum, vector) => sum + vector.column, 0)
  }
}

export const scale = (vector: Vector, scalar: number): Vector => {
  return {
    row: vector.row * scalar,
    column: vector.column * scalar
  }
}

export const subtractVectors = (v1: Vector, v2: Vector): Vector => {
  return addVectors(v1, scale(v2, -1))
}

export const sameVectors = (vector1: Vector, vector2: Vector): boolean => {
  return vector1.row    == vector2.row
    && vector1.column == vector2.column
}

export const vToS = (vector: Vector): String => {
  return `{row: ${vector.row}, column: ${vector.column}}`
}

export const vectorLength = (vector: Vector): number => {
  return Math.sqrt(vector.row ** 2 + vector.column ** 2)
}

export function intersects([a, b]: [Vector, Vector], [c, d]: [Vector, Vector]) {
  const determinant = (b.row - a.row) * (d.column - c.column) - (d.row - c.row) * (b.column - a.column)
  if (determinant == 0) return false

  const lambda = ((d.column - c.column) * (d.row - a.row) + (c.row - d.row) * (d.column - a.column)) / determinant
  const gamma = ((a.column - b.column) * (d.row - a.row) + (b.row - a.row) * (d.column - a.column)) / determinant

  return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)
};
