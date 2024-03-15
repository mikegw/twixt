type Animation = {
  completion: number
}

export function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function setNextFrame(animation: Animation, speed: number) {
  if (animation.completion < 1) {
    animation.completion = nextFrame(animation.completion, speed)
  }
}

function nextFrame(animationFrame: number, speed: number): number {
  return Math.min(animationFrame + speed, 1)
}
