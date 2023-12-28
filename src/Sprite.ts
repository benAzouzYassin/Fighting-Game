import { GRAVITY } from "./constants"
type SpriteConstructorType = {
    id : string
    position: {
        x: number
        y: number
    }
    canvas: HTMLCanvasElement
    velocity: {
        x: number
        y: number
    }
    height: number
    width: number
}

type SwordType = { width: number, x: number , y : number  , height: number, edge : number  }

export default class Sprite {
    context; canvas;
    velocity;position; 
    height; width;
    isAttacking = false;
    sword : SwordType; 
    id;
    constructor({ position, height, width, velocity, canvas , id }: SpriteConstructorType) {
        this.position = position
        this.context = canvas.getContext("2d")
        this.canvas = canvas
        this.velocity = velocity
        this.height = height
        this.width = width
        this.id = id
        this.sword =  { width: 100 , x: 0 , y : 0  , height: 20 , edge :0  }
        this.sword.edge = this.sword.x +  this.sword.width
    }
    attack(){
        this.isAttacking = true
        setTimeout(()=> this.isAttacking = false , 200)
    }

    draw() {
        //draw player
        if (this.context?.fillStyle){
            this.context.fillStyle =  this.id ==="player" ? "green" : "red"
            this.context?.fillRect(this.position.x, this.position.y, this.width, this.height)
            if(this.isAttacking) {
                //draw sword
                this.sword.x = this.position.x + this.width
                this.sword.y = this.position.y 
                this.context.fillStyle = "blue"
                this.context.fillRect(this.sword.x , this.sword.y +20 , this.sword.width , this.sword.height )
            }
        } 
    }
    update() {
        //handling the game ground
        this.draw()
        this.sword.edge = this.sword.x +  this.sword.width
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        if (this.position.y + this.height <= this.canvas.height) {
            this.velocity.y += GRAVITY
        } else {
            this.velocity.y = 0
        }

    }
}