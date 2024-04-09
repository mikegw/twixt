import { Position } from "./board";
import { Direction } from "./player";

type PlacePegAction = {
  kind: 'PLACE_PEG',
  position: Position
}

type UndoAction = {
  kind: 'UNDO'
}

type EndTurnAction = {
  kind: 'END_TURN'
}

type SurrenderAction = {
  kind: 'SURRENDER',
  direction: Direction
}

export type Action =
  | PlacePegAction
  | UndoAction
  | EndTurnAction
  | SurrenderAction
