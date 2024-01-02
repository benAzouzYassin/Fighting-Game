import Sprite, { SpriteConstructorType } from "./Sprite";

type GameImageConstructor = {
    imgUrl: string,
    frames?: number
    scale?: number
} & SpriteConstructorType

export default class GameImage extends Sprite {
    context;
    imgUrl;
    scale;
    frames;
    currentFrame;
    framesElapsed;
    framesHold;
    constructor({ position, height, width, canvas, imgUrl, scale = 1, frames = 1  }: GameImageConstructor) {
        super({ position, height, width, canvas })
        this.context = canvas.getContext("2d")
        this.imgUrl = imgUrl
        this.scale = scale
        this.frames = frames
        this.currentFrame = 0
        this.framesElapsed = 0
        this.framesHold = 12
    }

    draw() {
        const img = new Image()
        img.width = this.width
        img.height = this.height
        img.src = this.imgUrl

        if (this.frames != 1) {

            this.context?.drawImage(
                img,
                (this.width/this.frames) * this.currentFrame ,
                0,
                this.width / this.frames,
                this.height ,
                this.position.x,
                this.position.y,
                (this.width * this.scale)/ this.frames,
                this.height * this.scale
                )
        } else {
            this.context?.drawImage(
                img,
                this.position.x,
                this.position.y,
                this.width * this.scale,
                this.height * this.scale
                )
        }
    }
    update() {
        this.draw()
        this.framesElapsed++
        if(this.framesElapsed % this.framesHold === 0){
            if(this.currentFrame >= this.frames - 1 ){
                this.currentFrame = 2
            }else{
                this.currentFrame ++
            }
        }
    }
}
