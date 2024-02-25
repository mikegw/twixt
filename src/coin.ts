export type CoinValue = 'HEADS' | 'TAILS'

export const Coin = {
  Heads: 'HEADS',
  Tails: 'TAILS',
  bias: <CoinValue>undefined,
  toss: (): CoinValue => {
    if (Coin.bias) return Coin.bias

    return Math.random() > 0.5 ? 'HEADS' : 'TAILS'
  }
}
