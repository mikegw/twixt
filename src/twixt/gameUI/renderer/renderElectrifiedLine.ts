import { Canvas, Coordinates } from "../canvas";
import { addVectors, sameVectors, scale, subtractVectors, Vector, vectorLength } from "../../board/vector";
import { easeInOutCubic, setNextFrame } from "./animation";

const ELECTRICITY_WIDTH = 0.002

const HIGH_FIDELITY_ANIMATION_SPEED = 0.001
const MEDIUM_FIDELITY_ANIMATION_SPEED = 0.0015
const LOW_FIDELITY_ANIMATION_SPEED = 0.005

const HIGH_FIDELITY_SEGMENTS = 50
const MEDIUM_FIDELITY_SEGMENTS = 20
const LOW_FIDELITY_SEGMENTS = 7

const HIGH_FIDELITY_PERTURBATION = 0.2
const MEDIUM_FIDELITY_PERTURBATION = 0.1
const LOW_FIDELITY_PERTURBATION = 0.1

export type Fidelity = 'high' | 'medium' | 'low'

type Spark = {
  minAmplitudes: Vector[],
  perturbations: Vector[],
  completion: number,
  intensity: number,
  speed: number
}

type ElectrifiedLine = {
  from: Vector,
  to: Vector,
  sparks: Spark[]
}

const ElectrifiedLines: ElectrifiedLine[] = []

export const drawElectrifiedLine = (from: Coordinates, to: Coordinates, canvas: Canvas, fidelity: Fidelity) => {
  const fromVector = coordinatesToVector(from)
  const toVector = coordinatesToVector(to)
  const electricityWidth = Math.ceil(ELECTRICITY_WIDTH * canvas.size)

  const electrifiedLine = ElectrifiedLines.find(line => {
    return sameVectors(line.from, fromVector) && sameVectors(line.to, toVector)
  }) || createElectrifiedLine(fromVector, toVector, fidelity)

  let color

  for (let spark of electrifiedLine.sparks) {
    color = `rgba(255, 255, 255, ${spark.intensity})`
    canvas.drawPath(color, electricityWidth, sparkCoordinates(spark))

    color = `rgba(255, 255, 255, ${spark.intensity / 4})`
    canvas.drawPath(color, electricityWidth * 3, sparkCoordinates(spark))

    setNextFrame(spark, spark.speed)
  }

  const completedSparks = electrifiedLine.sparks.filter(spark => spark.completion >= 1).length
  if (completedSparks == 0 && electrifiedLine.sparks.length > 1) return

  electrifiedLine.sparks = electrifiedLine.sparks.filter(spark => spark.completion < 1)

  if (electrifiedLine.sparks.length >= 3) return

  const newSparks = randomInt(4)
  for (let i = 0; i < newSparks; i++) {
    electrifiedLine.sparks.push(createSpark(fromVector, toVector, fidelity))
  }
}

const createElectrifiedLine = (from: Vector, to: Vector, fidelity: Fidelity): ElectrifiedLine => {
  const sparks =
    Array.from({length: randomInt(3) + 3}, () => createSpark(from, to, fidelity))

  const electrifiedLine = { from, to, sparks }
  ElectrifiedLines.push(electrifiedLine)

  return electrifiedLine
}

const createSpark = (from: Vector, to: Vector, fidelity: Fidelity): Spark => {
  const segments = segmentsForFidelity(fidelity)
  const lineVector = subtractVectors(to, from)
  const lineSegment = scale(lineVector, 1 / segments)
  const segmentLength = Math.round(vectorLength(lineSegment))
  const perturbationVector = { row: -lineSegment.column, column: lineSegment.row }

  const perturbationScale = perturbationForFidelity(fidelity)
  const perturbationScaleOffset = perturbationScale / 2
  const randomPerturbation = () => (Math.random() ** 2) * (Math.random() * perturbationScale - perturbationScaleOffset)

  const perturbations: Vector[] = []
  const minAmplitudes: Vector[] = []

  for (let i = 0; i <= segments; i++) {
    const nextSegment = addVectors(from, scale(lineSegment, i))
    minAmplitudes.push(nextSegment)

    const parallelPerturbationSize = segmentLength * randomPerturbation() * 0.5
    const perpendicularPerturbationSize = segmentLength * randomPerturbation() * 0.5

    const parallelPerturbation = scale(lineSegment, parallelPerturbationSize)
    const perpendicularPerturbation = scale(perturbationVector, perpendicularPerturbationSize)

    const perturbed = addVectors(parallelPerturbation, perpendicularPerturbation)

    perturbations.push(perturbed)
  }
  const intensity = 0.15 + 0.1 * Math.random()
  const speed = animationSpeed(fidelity)

  return { perturbations, minAmplitudes, completion: 0, intensity, speed }
}

const segmentsForFidelity = (fidelity: Fidelity) => {
  let segments: number
  switch (fidelity) {
    case "high":   segments = HIGH_FIDELITY_SEGMENTS; break
    case "medium": segments = MEDIUM_FIDELITY_SEGMENTS; break
    case "low":    segments = LOW_FIDELITY_SEGMENTS; break
  }
  return segments + randomInt(Math.ceil(segments / 3))
}

const perturbationForFidelity = (fidelity: Fidelity) => {
  switch (fidelity) {
    case "high":   return HIGH_FIDELITY_PERTURBATION
    case "medium": return MEDIUM_FIDELITY_PERTURBATION
    case "low":    return LOW_FIDELITY_PERTURBATION
  }
}

const animationSpeed = (fidelity: Fidelity) => {
  let speed: number
  switch (fidelity) {
    case "high":   speed = HIGH_FIDELITY_ANIMATION_SPEED; break
    case "medium": speed = MEDIUM_FIDELITY_ANIMATION_SPEED; break
    case "low":    speed = LOW_FIDELITY_ANIMATION_SPEED; break
  }
  return speed * (0.7 + Math.random() * 0.6)
}

const sparkCoordinates = (spark: Spark): Coordinates[] => {
  const perturbations =
    spark.perturbations.map(p => scale(p, scaleCompletion(spark.completion)))

  const animatedAmplitudes =
    perturbations.map((p, index) => addVectors(spark.minAmplitudes[index], p))

  return animatedAmplitudes.map(vectorToCoordinates)
}

const coordinatesToVector = (coordinates: Coordinates): Vector => {
  return {
    row: coordinates.y,
    column: coordinates.x
  }
}

const vectorToCoordinates = (vector: Vector): Coordinates => {
  return {
    x: Math.floor(vector.column),
    y: Math.floor(vector.row)
  }
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function scaleCompletion(completion: number) {
  return easeInOutCubic((completion >= 0.5 ? (1-completion) : completion) * 2)
}
