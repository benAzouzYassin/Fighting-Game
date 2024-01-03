import Player from "./Player"
import { finishGame } from "./main"

export function didAttack(attacker: Player, target: Player) {
    //the if is because the player and the enemy are facing each other
    if (attacker.id === "rightPlayer") {
        return (attacker.position.y >= target.position.y //tall enough ?
            && attacker.position.x >= target.position.x //facing each other ?
            && attacker.isAttacking
            //adding the target width because the attacking side is in the right
            && attacker.sword.x + attacker.sword.width + attacker.width <= target.position.x + target.width) //sword touching enemy ?
    }
    else {
        return attacker.position.y >= target.position.y //tall enough ?
            && attacker.position.x <= target.position.x //facing each other ?
            && attacker.isAttacking
            && attacker.sword.x + attacker.sword.width + attacker.width >= target.position.x //sword touching enemy ?
    }
}
export function renderDamage(playerId : "rightPlayer" | "leftPlayer" , health : number) {
    const element = document.querySelector<HTMLDivElement>(`#${playerId}-health-bars`)
    if(element)element.className = `${playerId}-${health}`
}

//insures only one timer
function generateStartTimer (){
    let intervalId : null | number = null ;
    return () => {
        if(intervalId)clearInterval(intervalId)
        const timerElement = document.querySelector<HTMLSpanElement>(".timer")
        let counter = 60
            intervalId = setInterval(() => {
            counter--
            if (timerElement) timerElement.innerText = counter.toString()
            if (counter <= 0 && intervalId){
                clearInterval(intervalId)
                finishGame("Tie!")
            } 
        }, 1000)
    }
}

export const startTimer = generateStartTimer()