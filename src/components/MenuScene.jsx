import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    this.load.image("bgMenu", "/MenuPrincipal.png"); 
  }

  create() {
    this.add.image(395, 295, "bgMenu").setScale(0.66);

    const opcoes = ["PLAYER 1", "CONFIGURAÇÃO"];
    this.opcaoSelecionada = 0;

    this.textos = opcoes.map((texto, index) =>
      this.add.text(250, 300 + index * 40, texto, {
        fontFamily: "SuperMario",
        fontSize: "32px",
        color: index === 0 ? "#ffff00" : "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000000",
          blur: 2,
          fill: true,
        },
      })
    );
    

    this.input.keyboard.on("keydown-UP", () => {
      this.atualizaSelecao(-1);
    });

    this.input.keyboard.on("keydown-DOWN", () => {
      this.atualizaSelecao(1);
    });

    this.input.keyboard.on("keydown-ENTER", () => {
      if (this.opcaoSelecionada < 3) {
        this.scene.start("MainScene");
      } else {
        console.log("ERASE DATA acionado");
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
  }
}
