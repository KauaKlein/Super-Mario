export default function Movementacao(scene) {
  const { cursors, player } = scene

  // Eixo X: movimentação horizontal e animação
  if (cursors.left.isDown && cursors.right.isDown) {
    player.x += 0
    if (player.anims.currentAnim?.key !== "parado") {
      player.anims.play("parado")
    }
  } else if (cursors.down.isDown) {
    if (player.texture.key !== "MarioAgachado") {
      player.setTexture("MarioAgachado")
    }
  } else if (cursors.right.isDown) {
    player.x += 5
    player.flipX = false
    if (player.anims.currentAnim?.key !== "andando") {
      player.anims.play("andando")
    }
  } else if (cursors.left.isDown) {
    player.x -= 5
    player.flipX = true
    if (player.anims.currentAnim?.key !== "andando") {
      player.anims.play("andando")
    }
  } else {
    if (player.anims.currentAnim?.key !== "parado") {
      player.anims.play("parado")
    }
  }

  // Eixo Y: animações de pulo e queda
  if (player.body.velocity.y < 0) {
    if (player.anims.currentAnim?.key !== "pulando") {
      player.anims.play("pulando")
    }
  }

  if (player.body.velocity.y > 0) {
    if (player.anims.currentAnim?.key !== "caindo") {
      player.anims.play("caindo")
    }
  }

  // Pulo
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-1500)
  }
}
