import Phaser from "phaser"

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super("PauseScene")
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5)

    this.add.text(240, 200, "JOGO PAUSADO", {
      fontFamily: "sans-serif",
      fontSize: "40px",
      color: "#ffffff"
    })

    const opcoes = ["Continuar", "Menu"]
    this.opcaoSelecionada = 0

    this.textos = opcoes.map((texto, i) =>
      this.add.text(310, 300 + i * 50, texto, {
        fontFamily: "sans-serif",
        fontSize: "28px",
        color: i === 0 ? "#ffff00" : "#ffffff"
      })
    )

    this.input.keyboard.on("keydown-UP", () => this.mudarOpcao(-1))
    this.input.keyboard.on("keydown-DOWN", () => this.mudarOpcao(1))

    this.input.keyboard.on("keydown-ENTER", () => {
      if (this.opcaoSelecionada === 0) {
        this.scene.resume("MainScene")
        this.scene.stop()
      } else {
        this.scene.stop("MainScene")
        this.scene.start("MenuScene")
      }
    })
  }

  mudarOpcao(d) {
    this.textos[this.opcaoSelecionada].setColor("#ffffff")
    this.opcaoSelecionada = Phaser.Math.Wrap(this.opcaoSelecionada + d, 0, this.textos.length)
    this.textos[this.opcaoSelecionada].setColor("#ffff00")
  }
}
