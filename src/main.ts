import GameImage from "./GameImage";
import Player from "./Player"
import { didAttack, endGame,  startTimer  } from './utils';

const canvas = document.querySelector("#game") as HTMLCanvasElement
const context = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight


context?.fillRect(0, 0, canvas.width, canvas.height)
const background = new GameImage({imgUrl : "../assets/background.png" , canvas , height :canvas.height , width : canvas.width , position : {x :0 , y : 0 }})
const shop = new GameImage({imgUrl : "../assets/shop.png" , canvas , height :700, width :708 , position : {x :canvas.width - 800, y : 320 } , frames  : 6 , scale : 3.8}, )
const rightPlayer = new Player({ id: "rightPlayer",imgHeight : 140,   height: 120, width: 100, position: { x: 700, y: 500 }, velocity: { x: 0, y: 0 }, canvas, scale: 4 })
const leftPlayer = new Player({ id: "leftPlayer", imgHeight : 140, height: 120, width: 100, position: { x: 100, y: 500 }, scale : 4, velocity: { x: 0, y: 0 }, canvas })

startTimer()

function gameLoop() {
    //clearing the background  
    // if (context?.fillStyle) context.fillStyle = "black"
    // context?.fillRect(0, 0, window.innerWidth, window.innerHeight)
    background.update()
    shop.update()
    //moving players
    leftPlayer.update()
    rightPlayer.update()

    //handling damage
     didAttack(rightPlayer , leftPlayer) && leftPlayer.receiveDamage()
     didAttack(leftPlayer , rightPlayer) && rightPlayer.receiveDamage()
    
    const time = document.querySelector<HTMLDivElement>(".timer")?.innerText
     if(time === "0") endGame("tie")
     if(leftPlayer.dead) endGame("left player is dead")
     if(rightPlayer.dead) endGame("right player is dead")
     
    //keeps the game loop running
    window.requestAnimationFrame(gameLoop)
}


window.addEventListener("keydown", (e) => {
    switch (e.key) {
        //rightPlayer cases
        case "q":
            rightPlayer.moveLeft()
            break;
        case "z":
            rightPlayer.jump()
            break;
        case "d":
            rightPlayer.moveRight()
            break;
        case " ":
            rightPlayer.openSword()
            break

        //leftPlayer cases
        case "ArrowLeft":
            leftPlayer.moveLeft()
            break;
        case "ArrowUp":
            leftPlayer.jump()
            break;
        case "ArrowRight":
            leftPlayer.moveRight()
            break;
        case "ArrowDown":
            leftPlayer.openSword()
            break
        default:
            break;
    }
})

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        //rightPlayer cases
        case "q":
            rightPlayer.stop()
            break;
        case "z":
            rightPlayer.stopJumping()
            break;
        case "d":
            rightPlayer.stop()
            break;
        //leftPlayer cases
        case "ArrowLeft":
            leftPlayer.stop()
            break;
        case "ArrowUp":
            leftPlayer.stopJumping()
            break;
        case "ArrowRight":
            leftPlayer.stop()
            break;
        default:
            break;
    }
})
gameLoop()