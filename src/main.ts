import Sprite from "./Sprite"
import { movePlayer } from './utils';

const canvas = document.querySelector("#game") as HTMLCanvasElement
const context = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight


context?.fillRect(0, 0, canvas.width, canvas.height)

const player = new Sprite({ id: "player", height: 300, width: 100, position: { x: 700, y: 500 }, velocity: { x: 0, y: 0 }, canvas })
const enemy = new Sprite({ id: "enemy", height: 150, width: 100, position: { x: 100, y: 500 }, velocity: { x: 0, y: 0 }, canvas })


function gameLoop() {
    //clearing the background
    if (context?.fillStyle) context.fillStyle = "black"
    context?.fillRect(0, 0, window.innerWidth, window.innerHeight)

    const isPlayerSwordTouching = player.sword.edge >= enemy.position.x && player.position.x < enemy.position.x && player.position.y > enemy.position.y && player.isAttacking
    const isEnemySwordTouching = enemy.sword.edge >= player.position.x && enemy.position.x < player.position.x && enemy.position.y > player.position.y && enemy.isAttacking

    player.update()
    enemy.update()

    //keeps the game loop running
    window.requestAnimationFrame(gameLoop)
}


window.addEventListener("keydown", (e) => {
    switch (e.key) {
        //player cases
        case "q":
            movePlayer(player, { x: -8, y: 0 })
            break;
        case "z":
            movePlayer(player, { x: 0, y: -30 })
            break;
        case "d":
            movePlayer(player, { x: 8, y: 0 })
            break;
        case " " :
            player.attack()
            break 

        //enemy cases
        case "ArrowLeft":
            movePlayer(enemy, { x: -8, y: 0 })
            break;
        case "ArrowUp":
            movePlayer(enemy, { x: 0, y: -30 })
            break;
        case "ArrowRight":
            movePlayer(enemy, { x: 8, y: 0 })
            break;
        case "ArrowDown": 
            enemy.attack()
        break
        default:
            break;
    }
})

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        //player cases
        case "q":
            movePlayer(player, { x: 0, y: 0 })
            break;
        case "z":
            movePlayer(player, { x: 0, y: 0 })
            break;
        case "d":
            movePlayer(player, { x: 0, y: 0 })
            break;
        //enemy cases
        case "ArrowLeft":
            movePlayer(enemy, { x: 0, y: 0 })
            break;
        case "ArrowUp":
            movePlayer(enemy, { x: 0, y: 0 })
            break;
        case "ArrowRight":
            movePlayer(enemy, { x: 0, y: 0 })
            break;
        default:
            break;
    }
})
gameLoop()