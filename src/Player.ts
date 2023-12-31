
import Sprite from "./Sprite"
import { GRAVITY } from "./constants"
import { renderDamage } from "./utils"
type FighterConstructorType = {
    id: "rightPlayer" | "leftPlayer"
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

type SwordType = { width: number, x: number, y: number, height: number }

export default class Player extends Sprite {
    context; 
    velocity; 
    isAttacking = false;
    sword: SwordType;
    id: "rightPlayer" | "leftPlayer";
    health = 100
    dead = false
    jumping = false 
    constructor({ position, height, width, velocity, canvas, id }: FighterConstructorType) {
        super({position, height ,width,canvas})
        this.context = canvas.getContext("2d")
        this.velocity = velocity
        this.id = id
        // in the player case sword should be inverted 
        this.sword = { width: id === "rightPlayer" ? - 100 - width : 100, x: position.x, y: position.y, height: 20 }
    }
    openSword() {
        this.isAttacking = true
        setTimeout(() => this.isAttacking = false, 30)
    }
    receiveDamage() {
        if (this.health > 0) this.health -= 10
        renderDamage(this.id , this.health)
    }
    
    draw() {
        //draw player
        if (this.context?.fillStyle) {
            this.context.fillStyle = this.id === "rightPlayer" ? "green" : "red"
            this.context?.fillRect(this.position.x, this.position.y, this.width, this.height)

            //draw sword
            if (this.isAttacking) {
                this.sword.x = this.position.x + this.width
                this.sword.y = this.position.y
                this.context.fillStyle = "blue"
                this.context.fillRect(this.sword.x, this.sword.y + 20, this.sword.width, this.sword.height)
            }
        }
    }
    update() {
        //handling the game background
        this.draw()

        if(this.health <= 0) this.dead = true
        
        // updating position
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        this.sword.x = this.position.x
        this.sword.y = this.position.y

        // gravity handling
        if (this.position.y + this.height <= this.canvas.height) {
            this.velocity.y += GRAVITY
        } else {
            this.jumping = false
            this.velocity.y = 0
        }
    }
    jump(){
        if(!this.jumping){
            this.velocity.y = -30
            this.jumping = true
        }
    }
    stop(){
        this.velocity.x = 0
        this.velocity.y = 0
    }
    moveLeft() {
        this.velocity.x = -8
    }
    moveRight() {
        this.velocity.x = 8
    }
}
