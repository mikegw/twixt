import { COLORS, positionToCoordinates } from "../renderer";
import { Canvas } from "../canvas";
import { Connection } from "../../board/connection";
import { addVectors, scale, subtractVectors } from "../../board/vector";
import { Position } from "../../board";
import { ColorForDirection } from "../../gameUI";
import { easeInOutCubic, setNextFrame } from "./animation";

const CONNECTION_WIDTH = 0.004
const ANIMATION_SPEED = 0.06

export type AnimatedConnection = {
  connection: Connection,
  completion: number
}

export const drawConnection = (animatedConnection: AnimatedConnection, canvas: Canvas, gapSize: number) => {
  const positions = animatedPositions(animatedConnection)
  const coordinates = positions.map(position => {
    return positionToCoordinates(position, gapSize)
  })

  canvas.drawLine(
    COLORS[ColorForDirection.get(animatedConnection.connection.direction)],
    connectionWidth(canvas),
    coordinates[0],
    coordinates[1]
  )

  setNextFrame(animatedConnection, ANIMATION_SPEED)
}

const connectionWidth = (canvas: Canvas) => {
  return Math.ceil(CONNECTION_WIDTH * canvas.size)
}

const animatedPositions = ({ connection, completion }: AnimatedConnection) => {
  const direction = subtractVectors(connection.positions[1], connection.positions[0])
  const scaledDirection = scale(direction, easeInOutCubic(completion))

  return [connection.positions[0], addVectors(connection.positions[0], scaledDirection) as Position]
}
