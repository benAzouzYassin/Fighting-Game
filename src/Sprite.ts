export type SpriteConstructorType = {
    position: {
        x: number
        y: number
    }
    canvas: HTMLCanvasElement
    height: number
    width: number
}

export default class Sprite {
    context; canvas;
    height; width;
    position;
    constructor({ position, height, width, canvas }: SpriteConstructorType) {
        this.position = position
        this.context = canvas.getContext("2d")
        this.canvas = canvas
        this.height = height
        this.width = width

    }

    draw() { }
    update() {
        this.draw()
    }
}


