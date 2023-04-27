export type Coordinates = {
  x: number,
  y: number
}

export class Canvas {
  canvas = document.getElementById('game-canvas') as HTMLCanvasElement
  ctx = this.canvas.getContext('2d')
  offscreenCanvas: HTMLCanvasElement
  offscreenCtx: CanvasRenderingContext2D
  pixelRatio: number

  constructor() {
    this.offscreenCanvas = document.createElement("canvas")
    this.offscreenCtx = this.offscreenCanvas.getContext("2d")
    this.pixelRatio = window.devicePixelRatio;
  }

  setDimensions = () => {
    console.log(this.canvas.offsetWidth, this.canvas.offsetHeight)
    const minSize = Math.min(this.canvas.offsetHeight, this.canvas.offsetWidth)

    this.canvas.style.height = `${minSize}px`
    this.canvas.style.width = `${minSize}px`

    this.canvas.width = minSize * this.pixelRatio
    this.canvas.height = minSize * this.pixelRatio

    this.offscreenCanvas.width = this.canvas.width;
    this.offscreenCanvas.height = this.canvas.height;
  }

  get size() {
    return Math.min(this.canvas.width, this.canvas.height)
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  prerender() {
    this.ctx.drawImage(this.offscreenCanvas, 0, 0)
  }

  drawCircle(coordinates: Coordinates, radius: number, color: string, prerender?: boolean) {
    const ctx = prerender ? this.offscreenCtx : this.ctx

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(coordinates.x, coordinates.y, radius * this.pixelRatio, 0, 2 * Math.PI)
    ctx.fill()
  }

  drawLine(color: string, width: number, from: Coordinates, to: Coordinates, prerender?: boolean) {
    const ctx = prerender ? this.offscreenCtx : this.ctx

    ctx.strokeStyle = color
    ctx.lineWidth = width * this.pixelRatio
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke();
  }

  drawText(color: string, text: string, position: Coordinates, prerender = false) {
    const ctx = prerender ? this.offscreenCtx : this.ctx

    ctx.fillStyle = color
    ctx.font = `${14 * this.pixelRatio}px Trebuchet MS`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.fillText(text, position.x, position.y)
  }

  whenClicked(callback: (p: Coordinates) => void) {
    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas.getBoundingClientRect()
      const cursorPosition: Coordinates  = {
        x: (event.clientX - rect.left) * this.pixelRatio,
        y: (event.clientY - rect.top)  * this.pixelRatio
      }
      console.log(this.pixelRatio, this.size, cursorPosition)

      callback(cursorPosition)
    })
  }
}
