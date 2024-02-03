
export type CoinValue = 'HEADS' | 'TAILS'

export const Coin = {
  Heads: 'HEADS',
  Tails: 'TAILS',
  toss: (): CoinValue => Math.random() > 0.5 ? 'HEADS' : 'TAILS'
}
