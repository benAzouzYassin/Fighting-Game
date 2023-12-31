import Player from "./Player"
import { didAttack, endGame,  startTimer  } from './utils';

const canvas = document.querySelector("#game") as HTMLCanvasElement
const context = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight


context?.fillRect(0, 0, canvas.width, canvas.height)

const rightPlayer = new Player({ id: "rightPlayer", height: 300, width: 100, position: { x: 700, y: 500 }, velocity: { x: 0, y: 0 }, canvas })
const leftPlayer = new Player({ id: "leftPlayer", height: 300, width: 100, position: { x: 100, y: 500 }, velocity: { x: 0, y: 0 }, canvas })

startTimer()

function gameLoop() {
    //clearing the background  
    if (context?.fillStyle) context.fillStyle = "black"
    context?.fillRect(0, 0, window.innerWidth, window.innerHeight)
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
            rightPlayer.stop()
            break;
        case "d":
            rightPlayer.stop()
            break;
        //leftPlayer cases
        case "ArrowLeft":
            leftPlayer.stop()
            break;
        case "ArrowUp":
            leftPlayer.stop()
            break;
        case "ArrowRight":
            leftPlayer.stop()
            break;
        default:
            break;
    }
})
gameLoop()