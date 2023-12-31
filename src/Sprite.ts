type SpriteConstructorType = {
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
    position;
    height; width;
    
    constructor({ position, height, width, canvas }: SpriteConstructorType) {
        this.position = position
        this.context = canvas.getContext("2d")
        this.canvas = canvas
        this.height = height
        this.width = width
        // in the player case sword should be inverted 
    }

    draw() {
        //draw player
       
    }
    update() {
        //handling the game background
        this.draw()

    }
}
