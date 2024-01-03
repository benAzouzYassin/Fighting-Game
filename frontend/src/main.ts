import { io } from "socket.io-client";
import GameImage from "./GameImage";
import Player from "./Player"
import { didAttack, startTimer } from './utils';


let lastPressedKey = ""

const movementsActions: Record<string, () => void> = {
    "rightPlayer/q": () => rightPlayer.moveLeft(),
    "rightPlayer/z": () => rightPlayer.jump(),
    "rightPlayer/d": () => rightPlayer.moveRight(),
    "rightPlayer/ ": () => rightPlayer.openSword(),
    "leftPlayer/q": () => leftPlayer.moveLeft(),
    "leftPlayer/z": () => leftPlayer.jump(),
    "leftPlayer/d": () => leftPlayer.moveRight(),
    "leftPlayer/ ": () => leftPlayer.openSword(),
};


const stopMovementActions: Record<string, () => void> = {
    "rightPlayer/q": () => rightPlayer.stop(),
    "rightPlayer/z": () => rightPlayer.stopJumping(),
    "rightPlayer/d": () => rightPlayer.stop(),
    "leftPlayer/q": () => leftPlayer.stop(),
    "leftPlayer/z": () => leftPlayer.stopJumping(),
    "leftPlayer/d": () => leftPlayer.stop(),
};

const pressedKeys: Record<string, boolean> = {
    "q": false,
    "z": false,
    "d": false,
    " ": false
}

function handleKeydown(key: string) {
    if (["q", "z", "d", " "].includes(key)) {
        lastPressedKey = key
        if (pressedKeys[key]) pressedKeys[key] = true
        const movementAction = movementsActions[`${currentSide}/${key}`]
        socket.emit("keydown", { playerSide : currentSide , key , gameRoom})
        movementAction()
    }
}

function handleKeyup(key: string) {
    if (["q", "z", "d", " "].includes(key) && lastPressedKey === key) {
        lastPressedKey = ""
        if (pressedKeys[key]) pressedKeys[key] = false
        const stoppingAction = stopMovementActions[`${currentSide}/${key}`]
        socket.emit("keyup", { playerSide : currentSide , key , gameRoom})
        stoppingAction()
    }
}

type MovementMessageType = {    
    playerSide : "leftPlayer" | "rightPlayer" ,
    key  : string , 
    action : "keydown" | "keyup"
}

//online logic
let gameRoom = ""
let currentSide = ""
//creating a random room
const currentRoute = window.location.href.split("//")[1].split("/")[1]
if (currentRoute === "") {
    const randomUUID = crypto.randomUUID()
    window.location.href += randomUUID
} else {
    gameRoom = currentRoute
}

const socket = io("http://localhost:3000")
socket.on("connect", () => {
    socket.emit("join-room", gameRoom)
    socket.on("room-joined", (message) => {
        console.log(message)
    })
    socket.on("player", (side) => {
        currentSide = side
    })
    socket.on("movement" , (data:MovementMessageType )=>{
        console.log(data)
        if(data?.playerSide !== currentSide){
            if(data?.action =="keydown"){
                const movementAction = movementsActions[`${data?.playerSide}/${data?.key}`]
                movementAction()
            }else{
                const stoppingAction = stopMovementActions[`${data?.playerSide}/${data?.key}`]
                stoppingAction()
            }
        }    
    })
    socket.on("start-game" ,startTimer)
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


function gameLoop() {
    //clearing the background  
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



export function finishGame(result: string) {
    isFinished = true
    const resultElement = document.querySelector<HTMLDivElement>("#game-result")
    if (resultElement) resultElement.innerText = result
}



window.addEventListener("keydown", (e) => { !isFinished && handleKeydown(e.key) });
window.addEventListener("keyup", (e) => { handleKeyup(e.key) });

gameLoop()