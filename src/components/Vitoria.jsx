export function Vitoria(scene) {
  const centerX = scene.cameras.main.centerX;
  const centerY = scene.cameras.main.centerY;

  scene.physics.pause(); // Pausa o jogo
  scene.player.setVisible(false); // Esconde o personagem se quiser

  // Fundo preto com fade
  scene.victoryBg = scene.add
    .rectangle(centerX, centerY, scene.cameras.main.width, scene.cameras.main.height, 0x000000, 0)
    .setScrollFactor(0)
    .setDepth(99);

  scene.tweens.add({
    targets: scene.victoryBg,
    alpha: 0.7,
    duration: 500,
    ease: "Power1",
  });

  // Texto "Você venceu!" estilo animado
  const textoVitoria = scene.add
    .text(centerX, centerY - 100, "VOCÊ VENCEU!", {
      fontFamily: "Super Mario",
      fontSize: "48px",
      color: "#ffff00",
      stroke: "#000000",
      strokeThickness: 6,
      align: "center",
    })
    .setOrigin(0.5)
    .setDepth(100)
    .setScrollFactor(0)
    .setScale(0);

  scene.tweens.add({
    targets: textoVitoria,
    scale: 1,
    ease: "Bounce",
    duration: 800,
    delay: 500,
  });

  // Estrelas ou moedinhas (opcional)
  for (let i = 0; i < 10; i++) {
    const estrela = scene.add.image(centerX, centerY, "estrela"); // você precisa ter essa imagem carregada
    estrela.setDepth(100).setScrollFactor(0);
    estrela.setScale(0.5);

    scene.tweens.add({
      targets: estrela,
      x: Phaser.Math.Between(centerX - 100, centerX + 100),
      y: Phaser.Math.Between(centerY - 150, centerY + 50),
      alpha: 0,
      duration: 1000,
      delay: i * 100,
      onComplete: () => estrela.destroy(),
    });
  }

  // Opção de continuar após um tempo
  scene.time.delayedCall(2000, () => {
    const continuar = scene.add
      .text(centerX, centerY + 80, "Pressione ENTER para continuar", {
        fontFamily: "Super Mario",
        fontSize: "24px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 15, y: 10 },
      })
      .setOrigin(0.5)
      .setDepth(100)
      .setScrollFactor(0);

    // Aguarda ENTER
    scene.input.keyboard.once("keydown-ENTER", () => {
      scene.scene.start("MenuScene"); // Ou próxima fase, conforme seu jogo
    });
  });

  // Música de vitória (se quiser adicionar)
  // scene.sound.play("vitoria"); // Certifique-se de que o som esteja carregado
}
