import Phaser from "phaser"

export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu")
  }

  preload() {
    this.load.image("bgMenu", "/MenuPrincipal.png")
  }

  create() {
    this.add.text(0, 0, ".", {
      fontFamily: "Super Mario",
      fontSize: "28px",
    }).setAlpha(0)

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.add.image(centerX, centerY, "bgMenu")
      .setScale(0.66)
      .setOrigin(0.5, 0.5);

    const opcoes = ["Player 1", "Configurações"];
    this.opcaoSelecionada = 0;

    this.textos = opcoes.map((texto, index) =>
      this.add.text(centerX, centerY + index * 50 + 30, texto, {
        fontFamily: "Super Mario",
        fontSize: "36px",
        color: index === 0 ? "#ffff00" : "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000000",
          blur: 2,
          fill: true,
        },
      }).setOrigin(0.5)
    );

    this.seta = this.add.text(
      this.textos[0].x - this.textos[0].width / 2 - 30,
      this.textos[0].y,
      "➤",
      {
        fontFamily: "Super Mario",
        fontSize: "28px",
        color: "#ffff00",
        stroke: "#000000",
        strokeThickness: 8,
      }
    ).setOrigin(0.5);

    this.input.keyboard.on("keydown-UP", () => this.atualizaSelecao(-1));
    this.input.keyboard.on("keydown-DOWN", () => this.atualizaSelecao(1));

    this.input.keyboard.on("keydown-ENTER", () => {
      if (this.opcaoSelecionada === 0) {
        this.scene.start("MainScene");
      } else if (this.opcaoSelecionada === 1) {
        this.scene.start("Config");
      }
    });
  }

  atualizaSelecao(direcao) {
    this.textos[this.opcaoSelecionada].setColor("#ffffff");
    this.opcaoSelecionada = Phaser.Math.Wrap(
      this.opcaoSelecionada + direcao,
      0,
      this.textos.length
    );
    this.textos[this.opcaoSelecionada].setColor("#ffff00");

    const textoSelecionado = this.textos[this.opcaoSelecionada];
    this.seta.setPosition(
      textoSelecionado.x - textoSelecionado.width / 2 - 30,
      textoSelecionado.y
    );
  }
}
