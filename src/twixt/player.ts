export enum Direction {
  Vertical = 'VERTICAL',
  Horizontal = 'HORIZONTAL'
}

export class Player {
  direction: Direction

  constructor(direction: Direction) {
    this.direction = direction
  }
}
