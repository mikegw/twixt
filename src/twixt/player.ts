export enum Color {
  Red = 'RED',
  Blue = 'BLUE'
}

export class Player {
  color: Color

  constructor(color: Color) {
    this.color = color
  }
}
