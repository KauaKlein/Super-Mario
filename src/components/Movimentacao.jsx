export default function Movimentacao(scene) {
  const { cursors, player } = scene

  // Eixo X: movimentação horizontal e animação
  player.isIndoEsquerda = cursors.left.isDown;
        player.isIndoDireita = cursors.right.isDown;
        player.isPulando =
        cursors.up.isDown && player.body.touching.down;
        player.isAgachando = cursors.down.isDown;
        player.isSubindo = player.body.velocity.y < 0;
        player.isDescendo = player.body.velocity.y > 0;

        if (player.isAgachando) {
          player.wasAgachado = true;
          player.body.setOffset(0, 5);
          player.body.setSize(16, 12);
        } else if (!player.isAgachando && player.wasAgachado) {
          player.y -= 2;

          player.wasAgachado = false;
          player.body.setSize(16, 22);
          player.body.setOffset(0, 0);
        }

        if (player.isIndoEsquerda && !player.isAgachando) {
          player.setAccelerationX(-3000)
          player.isOlhandoFrente = false;
        } else if (player.isIndoDireita && !player.isAgachando) {
          player.setAccelerationX(3000)
          player.isOlhandoFrente = true;
        } else{
          player.setAccelerationX(0)
        }

        if (player.isPulando) {
          player.setVelocityY(-1600);
        }

        if (player.isAgachando) {
          if (player.isIndoDireita) {
            player.isOlhandoFrente = true;
          } else if (player.isIndoEsquerda) {
            player.isOlhandoFrente = false;
          }
          const direcao = player.isOlhandoFrente
            ? "olhandoFrente"
            : "olhandoCosta";
          if (player.anims.currentAnim?.key !== direcao) {
            player.anims.play(direcao);
          }
          return;
        }

        if (player.isSubindo) {
          const direcao = player.isOlhandoFrente
            ? "pulandoFrente"
            : "pulandoCosta";
          if (player.anims.currentAnim?.key !== direcao) {
            player.anims.play(direcao);
          }
          return;
        }

        if (player.isDescendo) {
          const direcao = player.isOlhandoFrente
            ? "caindoFrente"
            : "caindoCosta";
          if (player.anims.currentAnim?.key !== direcao) {
            player.anims.play(direcao);
          }
          return;
        }

        if (player.body.velocity.x !== 0) {
          const anim = player.isOlhandoFrente
            ? "andandoFrente"
            : "andandoCosta";
          if (player.anims.currentAnim?.key !== anim) {
            player.anims.play(anim);
          }
        } else {
          const anim = player.isOlhandoFrente
            ? "paradoFrente"
            : "paradoCosta";
          if (player.anims.currentAnim?.key !== anim) {
            player.anims.play(anim);
          }
        }
}
