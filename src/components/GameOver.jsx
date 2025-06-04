export function GameOver(scene) {
  // Protege contra múltiplos game overs
  if (scene._gameOverActive) return;
  scene._gameOverActive = true;

  scene.player.setAccelerationX(0);
  scene.player.anims.play("game over", true);
  scene.isGameOver = true;

  scene.physics.world.removeCollider(scene.goombaCollider);
  scene.physics.world.removeCollider(scene.chaoCollider);
  scene.player.setDepth(100);

  scene.chaoGroup.children.iterate((tile) => {
    tile.disableBody(false, false);
  });

  scene.player.setCollideWorldBounds(false);
  scene.player.setVelocity(0, -1000);
  scene.player.body.allowGravity = false;

  scene.time.delayedCall(280, () => {
    scene.player.body.allowGravity = true;
  });

  const blackout = scene.add.graphics();
  blackout.fillStyle(0x000000, 1);
  blackout.fillRect(0, 0, scene.cameras.main.width, scene.cameras.main.height);
  blackout.setScrollFactor(0);
  blackout.setDepth(99);
  blackout.setAlpha(0);

  scene.time.delayedCall(600, () => {
    scene.tweens.add({
      targets: blackout,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        const centerX = scene.cameras.main.centerX;
        const centerY = scene.cameras.main.centerY;

        const gameImg = scene.add
          .image(-300, centerY, "game")
          .setScale(5)
          .setScrollFactor(0)
          .setDepth(100);

        const overImg = scene.add
          .image(scene.cameras.main.width + 300, centerY, "over")
          .setScale(5)
          .setScrollFactor(0)
          .setDepth(100);

        scene.tweens.add({
          targets: gameImg,
          x: centerX - 100,
          duration: 1000,
          ease: "Power2",
        });

        scene.tweens.add({
          targets: overImg,
          x: centerX + 100,
          duration: 1000,
          ease: "Power2",
          onComplete: () => {
            // Remove elementos antigos, se existirem
            if (scene.selector) scene.selector.destroy();
            if (scene.restartText) scene.restartText.destroy();
            if (scene.menuText) scene.menuText.destroy();
            if (scene.keyListener)
              scene.input.keyboard.removeListener("keydown", scene.keyListener);

            scene.menuOptions = [];

            scene.restartText = scene.add
              .text(centerX, centerY + 100, "Reiniciar", {
                fontFamily: "Super Mario",
                fontSize: "32px",
                color: "#ffffff",
                backgroundColor: "#000000",
                padding: { x: 20, y: 10 },
                align: "center",
              })
              .setOrigin(0.5)
              .setScrollFactor(0)
              .setDepth(101);

            scene.menuText = scene.add
              .text(centerX, centerY + 160, "Menu", {
                fontFamily: "Super Mario",
                fontSize: "32px",
                color: "#ffffff",
                backgroundColor: "#000000",
                padding: { x: 20, y: 10 },
                align: "center",
              })
              .setOrigin(0.5)
              .setScrollFactor(0)
              .setDepth(101);

            scene.menuOptions = [scene.restartText, scene.menuText];
            scene.selectedOptionIndex = 0;

            scene.selector = scene.add
              .text(scene.menuOptions[0].x - 120, scene.menuOptions[0].y, "➤", {
                fontFamily: "Super Mario",
                fontSize: "32px",
                color: "#ffff00",
              })
              .setOrigin(0.5)
              .setScrollFactor(0)
              .setDepth(101);

            const updateSelectorPosition = () => {
              const target = scene.menuOptions[scene.selectedOptionIndex];
              scene.selector.setPosition(target.x - 120, target.y);
            };

            updateSelectorPosition();

            // Registra o evento de teclado e guarda o handler para remover depois
            scene.keyListener = (event) => {
              if (event.code === "ArrowUp" || event.code === "ArrowLeft") {
                scene.selectedOptionIndex =
                  (scene.selectedOptionIndex - 1 + scene.menuOptions.length) %
                  scene.menuOptions.length;
                updateSelectorPosition();
              } else if (
                event.code === "ArrowDown" ||
                event.code === "ArrowRight"
              ) {
                scene.selectedOptionIndex =
                  (scene.selectedOptionIndex + 1) %
                  scene.menuOptions.length;
                updateSelectorPosition();
              } else if (event.code === "Enter") {
                // Reseta controles e reinicia a cena ou vai pro menu
                scene._gameOverActive = false;
                scene.input.keyboard.removeListener(
                  "keydown",
                  scene.keyListener
                );

                if (scene.selectedOptionIndex === 0) {
                  scene.scene.restart();
                } else if (scene.selectedOptionIndex === 1) {
                  scene.scene.start("MenuScene");
                }
              }
            };

            scene.input.keyboard.on("keydown", scene.keyListener);
          },
        });
      },
    });
  });
}
