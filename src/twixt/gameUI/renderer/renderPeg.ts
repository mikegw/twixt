import { COLORS, positionToCoordinates } from "../renderer";
import { Slot } from "../../board/slot";
import { Canvas } from "../canvas";

const PEG_RADIUS = 0.00525
const ANIMATION_SPEED = 0.05

export type AnimatedPeg = {
  peg: Slot
  completion: number
}

export const drawPeg = (pegAnimation: AnimatedPeg, canvas: Canvas, gapSize: number) => {
  const slotCoordinates = positionToCoordinates(pegAnimation.peg.position, gapSize)

  canvas.drawCircle(
    slotCoordinates,
    pegRadius(pegAnimation.completion, radiusValue, canvas),
    COLORS[pegAnimation.peg.color]
  )

  if (pegAnimation.completion < 1) pegAnimation.completion = nextFrame(pegAnimation.completion, ANIMATION_SPEED)
}

export const pegRadius = (completion: number, animation: (c: number) => number, canvas: Canvas) => {
  return Math.ceil(PEG_RADIUS * canvas.size * animation(completion))
}

const radiusValue = (completion: number): number => {
  if(completion < 0.75) {
    return easeInOutCubic(completion * 2)
  } else {
    return easeInOutCubic(1.5 - ((completion - 0.75) * 2))
  }
}

export function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function nextFrame(animationFrame: number, speed: number): number {
  return Math.min(animationFrame + speed, 1)
}
