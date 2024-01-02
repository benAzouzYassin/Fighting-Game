import Sprite from "./Sprite";
import { GRAVITY } from "./constants";
import { finishGame } from "./main";
import { renderDamage } from "./utils";

type FighterConstructorType = {
    id: "rightPlayer" | "leftPlayer";
    position: {
        x: number;
        y: number;
    };
    canvas: HTMLCanvasElement;
    velocity: {
        x: number;
        y: number;
    };
    height: number;
    width: number;
    scale?: number;
    imgHeight: number;
};

type SwordType = {
    width: number;
    x: number;
    y: number;
    height: number;
};

export default class Player extends Sprite {
    context;
    velocity;
    isAttacking = false;
    sword: SwordType;
    id: "rightPlayer" | "leftPlayer";
    health = 100;
    dead = false;
    jumping = false;
    status : "idle" | "running" | "jumping" | "attacking" | "falling" | "dead" = "idle";
    currentIdleFrame = 0;
    currentRunFrame = 0;
    currentJumpFrame = 0
    currentAttackFrame = 0 
    currentFallFrame = 0 
    currentDeathFrame = 5 
    scale = 4;
    elapsedFrames = 0;
    framesHold = 5;
    attackFrames
    imgHeight;
    idleFrames;
    runningFrames;
    idleImgWidth;
    freezeStatus = false 
    deathFrames

    constructor({
        imgHeight,
        position,
        height,
        width,
        velocity,
        canvas,
        id,
        scale = 1,
        
    }: FighterConstructorType) {
        super({ position, height, width, canvas });
        this.context = canvas.getContext("2d");
        this.velocity = velocity;
        this.id = id;
        this.scale = scale;
        this.sword = {
            width: id === "rightPlayer" ? -250 - width : 250,
            x: position.x,
            y: position.y,
            height: 20,
        };
        this.imgHeight = imgHeight;
        this.idleFrames = id == "leftPlayer" ? 8 : 4;
        this.runningFrames = 8;
        this.idleImgWidth = id === "leftPlayer" ? 1800 : 1000;
        this.attackFrames =  id == "leftPlayer" ? 6 : 4;
        this.deathFrames =  id == "leftPlayer" ? 6 : 7 ;

    }

    openSword() {
        this.status = "attacking"
        this.isAttacking = true;
        this.freezeStatus = true
        setTimeout(() => this.isAttacking = false, 30);
        setTimeout(() => {
            this.status = "idle"
            this.freezeStatus = false
        },430 );
    }

    receiveDamage() {
        if (this.health > 0) this.health -= 10;
        renderDamage(this.id, this.health);
        if(this.health <=0)finishGame(this.id==="leftPlayer" ? "Right Player Won!":" Left Player Won!")
    }

    draw() {
        // draw player and animate him
        if (this.context) {
            this.handlePlayerAnimation({ status: "running" , asset: "Run.png", assetWidth: 1800, currentFrame: this.currentRunFrame, frames: 8 })
            this.handlePlayerAnimation({ status: "idle"  , asset: "Idle.png", assetWidth: this.id=== "leftPlayer"? 1800 : 1000, currentFrame: this.currentIdleFrame, frames: this.id=== "leftPlayer"? 8: 4})
            this.handlePlayerAnimation({ status: "attacking"  , asset: "Attack1.png", assetWidth: this.id=== "leftPlayer"? 1400 : 1000, currentFrame: this.currentAttackFrame, frames:this.id=== "leftPlayer"? 6: 4})
            this.handlePlayerAnimation({ status: "jumping"  , asset: "Jump.png", assetWidth: 700 , currentFrame: this.currentJumpFrame, frames: 2})
            this.handlePlayerAnimation({ status: "falling"  , asset: "Fall.png", assetWidth: 700 , currentFrame: this.currentFallFrame, frames: 2})
            this.handlePlayerAnimation({ status: "dead"  , asset: "Death.png", assetWidth: this.id =="leftPlayer" ? 1400 : 1600 , currentFrame: this.currentDeathFrame, frames : this.id == "leftPlayer"?  6 : 7})
            this.animate();
            this.context.fillStyle = "red";
        }
    }

    update() {
        // handling the game background
        this.draw();
        if (this.health <= 0) {
            this.dead = true;
            this.status = "dead"
        }

        // updating position
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        this.sword.x = this.position.x;
        this.sword.y = this.position.y;

        // gravity handling
        if (this.position.y + this.height <= this.canvas.height - 160) {
            this.velocity.y += GRAVITY;
            // this.status = "falling"
        } else {
            this.jumping = false;
            this.velocity.y = 0;
        }
    }
    handlePlayerAnimation({ asset, assetWidth, currentFrame, frames, status }: { assetWidth: number, status: string, asset: string, frames: number, currentFrame: number }) {
        if (status === this.status) {
            const img = new Image();
            img.src = `../assets/${this.id}/${asset}`;
            this.context?.drawImage(
                img,
                (assetWidth / (frames + 1)) * currentFrame,
                0,
                assetWidth / (frames + 1),
                140,
                this.position.x - 340,
                this.id === "leftPlayer" ? this.position.y - 300 : this.position.y - 320,
                (assetWidth / (frames + 1)) * this.scale,
                this.height * this.scale
            );
        }
    }

    jump() {
        if (!this.jumping) {
            this.status = "jumping"
            this.velocity.y = -30;
            this.jumping = true;
        }
    }

    stopJumping() {
        this.velocity.y = 0;
        this.status = "falling";
        // setTimeout(()=>this.status = "idle",500)
    }
    stop() {
        this.velocity.x = 0;
        this.velocity.y = 0;
    if(!this.freezeStatus)this.status = "idle";
    }

    moveLeft() {
        this.velocity.x = -8;
        if(!this.freezeStatus)this.status = "running";
    }

    moveRight() {
        this.velocity.x = 8;
        if(!this.freezeStatus)this.status = "running";

    }

    animate() {
        this.elapsedFrames++;
        if (this.elapsedFrames % this.framesHold === 0) {
            if (this.currentIdleFrame < this.idleFrames - 1) {
                this.currentIdleFrame++;
            } else {
                this.currentIdleFrame = 0;
            }
            if (this.currentRunFrame < this.runningFrames - 1) {
                this.currentRunFrame++;
            } else {
                this.currentRunFrame = 0;
            }
            if (this.currentAttackFrame <  this.attackFrames) {
                this.currentAttackFrame++;
            } else {
                this.currentAttackFrame= 0;
            }            
            if (this.currentDeathFrame<  this.deathFrames) {
                this.deathFrames++;
            } else {
                this.deathFrames= 0;
            }            
        }
    }
}
