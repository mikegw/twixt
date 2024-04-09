import { COLORS, DIM_COLORS, positionToCoordinates } from "../renderer";
import { Slot } from "../../board/slot";
import { Canvas } from "../canvas";
import { ColorForDirection } from "../../gameUI";
import { easeInOutCubic, setNextFrame } from "./animation";

const PEG_RADIUS = 0.00525
const ANIMATION_SPEED = 0.05

export type AnimatedPeg = {
  peg: Slot
  completion: number
}

export const drawPeg = (pegAnimation: AnimatedPeg, canvas: Canvas, gapSize: number, electrified: boolean) => {
  const slotCoordinates = positionToCoordinates(pegAnimation.peg.position, gapSize)
  const colors = electrified ? COLORS : DIM_COLORS
  let pegColor = colors[ColorForDirection.get(pegAnimation.peg.direction)]

  const radius = pegRadius(pegAnimation.completion, radiusValue, canvas)
  canvas.drawCircle(slotCoordinates, radius, pegColor)

  setNextFrame(pegAnimation, ANIMATION_SPEED)
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
