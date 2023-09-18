export default class CanvasHandler {
  elemenet: HTMLCanvasElement;

  constructor() {
    this.elemenet = document.createElement('canvas');
  }

  attachTo(target: HTMLElement) {
    target.appendChild(this.elemenet);
    this.elemenet.style.width = "100%";
    this.elemenet.style.height = "100%";

    this.elemenet.width = this.elemenet.clientWidth
    this.elemenet.height = this.elemenet.clientHeight
  }

  getCtx(): CanvasRenderingContext2D {
    const ctx = this.elemenet.getContext('2d');
    if (ctx === null) throw "no canvas context"
    return ctx
  }

  printPixel(x: number, y: number, color: string, w = 1, h = 1) {
    this.getCtx().fillStyle = color;
    this.getCtx().fillRect(x, y, w, h);
  }

  clear() {
    this.getCtx().clearRect(
      0,
      0,
      this.elemenet.clientWidth,
      this.elemenet.clientHeight
    )
  }
}
