import Phaser from "phaser";

export default class Pause extends Phaser.Scene {
  constructor() {
    super("Pause");
  }

  create() {
    const mainScene = this.scene.get("MainScene");
    if (mainScene.musicaDeFundo && mainScene.musicaDeFundo.isPlaying) {
      mainScene.musicaDeFundo.pause();
    }

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.add.rectangle(centerX, centerY, 800, 600, 0x000000, 0.5);

    this.add
      .text(centerX, 150, "JOGO PAUSADO", {
        fontFamily: "Super Mario",
        fontSize: "36px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000000",
          blur: 2,
          fill: true,
        },
      })
      .setOrigin(0.5);

    const opcoes = ["Continuar", "Reiniciar", "Configuração", "Menu"];
    this.opcaoSelecionada = 0;

    this.textos = opcoes.map(
      (texto, i) =>
        this.add
          .text(centerX, 230 + i * 50, texto, {
            fontFamily: "Super Mario",
            fontSize: "28px",
            color: i === 0 ? "#ffff00" : "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
            shadow: {
              offsetX: 2,
              offsetY: 2,
              color: "#000000",
              blur: 2,
              fill: true,
            },
          })
          .setOrigin(0.5, 0.5) // <-- CENTRALIZADO HORIZONTALMENTE
    );

    // seta ➤
    this.seta = this.add
      .text(centerX - 100, 230, "➤", {
        fontFamily: "Super Mario",
        fontSize: "28px",
        color: "#ffff00",
        stroke: "#000000",
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    this.input.keyboard.on("keydown-UP", () => this.mudarOpcao(-1));
    this.input.keyboard.on("keydown-DOWN", () => this.mudarOpcao(1));

    this.input.keyboard.on("keydown-ENTER", () => {
      switch (this.opcaoSelecionada) {
        case 0: {
          const cenaPrincipal = this.scene.get("MainScene");
          if (
            cenaPrincipal.musicaDeFundo &&
            cenaPrincipal.musicaDeFundo.isPaused
          ) {
            cenaPrincipal.musicaDeFundo.resume();
          }
          this.scene.resume("MainScene");
          this.scene.stop();
          break;
        }
        case 1:
          this.scene.stop("MainScene");
          this.scene.start("MainScene");
          this.scene.stop();
          break;
        case 2:
          this.scene.stop();
          this.scene.launch("Config", { voltarPara: "Pause" });
          break;
        case 3:
          this.scene.stop("MainScene");
          this.scene.start("Menu");
          break;
      }
    });
  }

  mudarOpcao(delta) {
    this.textos[this.opcaoSelecionada].setColor("#ffffff");

    this.opcaoSelecionada = Phaser.Math.Wrap(
      this.opcaoSelecionada + delta,
      0,
      this.textos.length
    );

    this.textos[this.opcaoSelecionada].setColor("#ffff00");

    const novoY = 230 + this.opcaoSelecionada * 50;
    this.seta.setY(230 + this.opcaoSelecionada * 50);
  }
}
