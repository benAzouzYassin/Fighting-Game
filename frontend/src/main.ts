import { io } from "socket.io-client";
import GameImage from "./GameImage";
import Player from "./Player"
import { didAttack,  startTimer } from './utils';



//online logic

let gameRoom = ""
//creating a random room
const currentRoute = window.location.href.split("//")[1].split("/")[1]
if(currentRoute === ""){
    const randomUUID =  crypto.randomUUID()
    window.location.href += randomUUID
}else{
    gameRoom = currentRoute
}

const socket = io("http://localhost:3000") 
socket.on("connect",()=>{
    socket.emit("game-room" , gameRoom)
    socket.on("room-join" , (message)=>{
        console.log(message)
    })
})

//game logic
let isFinished = false

const canvas = document.querySelector("#game") as HTMLCanvasElement
const context = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight


context?.fillRect(0, 0, canvas.width, canvas.height)
const background = new GameImage({ imgUrl: "../assets/background.png", canvas, height: canvas.height, width: canvas.width, position: { x: 0, y: 0 } })
const shop = new GameImage({ imgUrl: "../assets/shop.png", canvas, height: 700, width: 708, position: { x: canvas.width - 800, y: 320 }, frames: 6, scale: 3.8 },)
const rightPlayer = new Player({ id: "rightPlayer", imgHeight: 140, height: 120, width: 100, position: { x: 1700, y: 500 }, velocity: { x: 0, y: 0 }, canvas, scale: 4 })
const leftPlayer = new Player({ id: "leftPlayer", imgHeight: 140, height: 120, width: 100, position: { x: 100, y: 500 }, scale: 4, velocity: { x: 0, y: 0 }, canvas })

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
    didAttack(rightPlayer, leftPlayer) && leftPlayer.receiveDamage()
    didAttack(leftPlayer, rightPlayer) && rightPlayer.receiveDamage()

    //keeps the game loop running
    window.requestAnimationFrame(gameLoop)
}

let lastRightPLayerPressedKey = "";
let lastLeftPLayerPressedKey = "";

const movementsActions: Record<string, () => void> = {
    "q": () => rightPlayer.moveLeft(),
    "z": () => rightPlayer.jump(),
    "d": () => rightPlayer.moveRight(),
    " ": () => rightPlayer.openSword(),
    "ArrowLeft": () => leftPlayer.moveLeft(),
    "ArrowUp": () => leftPlayer.jump(),
    "ArrowRight": () => leftPlayer.moveRight(),
    "ArrowDown": () => leftPlayer.openSword(),
};


const stopMovementActions: Record<string, () => void> = {
    "q": () => rightPlayer.stop(),
    "z": () => rightPlayer.stopJumping(),
    "d": () => rightPlayer.stop(),
    "ArrowLeft": () => leftPlayer.stop(),
    "ArrowUp": () => leftPlayer.stopJumping(),
    "ArrowRight": () => leftPlayer.stop(),
};
const pressedKeys: Record<string, boolean> = {
    "q": false,
    "z": false,
    "d": false,
    " ": false,
    "ArrowLeft": false,
    "ArrowUp": false,
    "ArrowRight": false,
    "ArrowDown": false,
}
function handleKeypress(key: string) {
    if (["q", "z", "d", " "].includes(key)) lastLeftPLayerPressedKey = key
    if (["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp"].includes(key)) lastRightPLayerPressedKey = key

    if (pressedKeys[key]) pressedKeys[key] = true
    const action = movementsActions[key]
    action()
}
function handleKeyup(key: string) {
    if (["q", "z", "d", " "].includes(key) && lastLeftPLayerPressedKey === key){
        lastLeftPLayerPressedKey = ""
        if (pressedKeys[key]) pressedKeys[key] = false
        const action = stopMovementActions[key]
        action()
    } 
    if (["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp"].includes(key) && lastRightPLayerPressedKey === key ){
        lastRightPLayerPressedKey = ""
        if (pressedKeys[key]) pressedKeys[key] = false
        const action = stopMovementActions[key]
        action()
    } 
}

export function finishGame(result: string) {
    isFinished = true
    const resultElement = document.querySelector<HTMLDivElement>("#game-result")
    if(resultElement) resultElement.innerText = result
}



window.addEventListener("keydown", (e) => { !isFinished && handleKeypress(e.key) });
window.addEventListener("keyup", (e) => { handleKeyup(e.key) });

gameLoop()