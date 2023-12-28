import Sprite from "./Sprite"

export  function movePlayer(sprite: Sprite, newVelocity: { x: number, y: number }) {
    sprite.velocity.y = newVelocity.y
    sprite.velocity.x = newVelocity.x

}