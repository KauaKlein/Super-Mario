import Phaser from "phaser";

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super("PauseScene");
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);

    this.add.text(240, 200, "JOGO PAUSADO", {
      fontFamily: "sans-serif",
      fontSize: "40px",
      color: "#ffffff",
    });

    const opcoes = ["Continuar", "Reiniciar", "Configuração", "Menu"];
    this.opcaoSelecionada = 0;

    this.textos = opcoes.map((texto, i) =>
      this.add.text(310, 300 + i * 50, texto, {
        fontFamily: "sans-serif",
        fontSize: "28px",
        color: i === 0 ? "#ffff00" : "#ffffff",
      })
    );

    this.input.keyboard.on("keydown-UP", () => this.mudarOpcao(-1));
    this.input.keyboard.on("keydown-DOWN", () => this.mudarOpcao(1));

    this.input.keyboard.on("keydown-ENTER", () => {
      switch (this.opcaoSelecionada) {
        case 0: // Continuar
          this.scene.resume("MainScene");
          this.scene.stop();
          break;

        case 1: // Reiniciar
          this.scene.stop("MainScene");
          this.scene.start("MainScene"); // reinicia diretamente
          this.scene.stop(); // fecha PauseScene
          break;

        case 2: // Configuração
        this.scene.stop(); // Fecha a PauseScene
        this.scene.launch("ConfigScene", { voltarPara: "PauseScene" }); // Abre config e envia origem
          break;

        case 3: // Menu
          this.scene.stop("MainScene");
          this.scene.start("MenuScene");
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
  }
}
