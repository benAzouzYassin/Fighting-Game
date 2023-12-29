import Sprite from "./Sprite"
import { didAttack, movePlayer , startTimer  } from './utils';

const canvas = document.querySelector("#game") as HTMLCanvasElement
const context = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight


context?.fillRect(0, 0, canvas.width, canvas.height)

const rightPlayer = new Sprite({ id: "rightPlayer", height: 300, width: 100, position: { x: 700, y: 500 }, velocity: { x: 0, y: 0 }, canvas })
const leftPlayer = new Sprite({ id: "leftPlayer", height: 300, width: 100, position: { x: 100, y: 500 }, velocity: { x: 0, y: 0 }, canvas })

startTimer()

function gameLoop() {
    //clearing the background
    if (context?.fillStyle) context.fillStyle = "black"
    context?.fillRect(0, 0, window.innerWidth, window.innerHeight)
     didAttack(rightPlayer , leftPlayer) && leftPlayer.receiveDamage()
     didAttack(leftPlayer , rightPlayer) && rightPlayer.receiveDamage()


    rightPlayer.update()
    leftPlayer.update()

    //keeps the game loop running
    window.requestAnimationFrame(gameLoop)
}


window.addEventListener("keydown", (e) => {
    switch (e.key) {
        //rightPlayer cases
        case "q":
            movePlayer(rightPlayer, { x: -8, y: 0 })
            break;
        case "z":
            movePlayer(rightPlayer, { x: 0, y: -30 })
            break;
        case "d":
            movePlayer(rightPlayer, { x: 8, y: 0 })
            break;
        case " ":
            rightPlayer.openSword()
            break

        //leftPlayer cases
        case "ArrowLeft":
            movePlayer(leftPlayer, { x: -8, y: 0 })
            break;
        case "ArrowUp":
            movePlayer(leftPlayer, { x: 0, y: -30 })
            break;
        case "ArrowRight":
            movePlayer(leftPlayer, { x: 8, y: 0 })
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
            movePlayer(rightPlayer, { x: 0, y: 0 })
            break;
        case "z":
            movePlayer(rightPlayer, { x: 0, y: 0 })
            break;
        case "d":
            movePlayer(rightPlayer, { x: 0, y: 0 })
            break;
        //leftPlayer cases
        case "ArrowLeft":
            movePlayer(leftPlayer, { x: 0, y: 0 })
            break;
        case "ArrowUp":
            movePlayer(leftPlayer, { x: 0, y: 0 })
            break;
        case "ArrowRight":
            movePlayer(leftPlayer, { x: 0, y: 0 })
            break;
        default:
            break;
    }
})
gameLoop()