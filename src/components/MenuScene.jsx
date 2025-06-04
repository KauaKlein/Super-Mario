import Phaser from "phaser"

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene")
  }

  preload() {
    this.load.image("bgMenu", "/MenuPrincipal.png")

    // Pré-carrega todas as possíveis músicas
    this.load.audio("musica1", "/menu.mp3")
    this.load.audio("musica2", "/yoshi.mp3")
    this.load.audio("musica3", "/starroad.mp3")
    this.load.audio("musica4", "/egg.mp3")
  }

  create() {
    this.add.text(0, 0, ".", {
      fontFamily: "sans-serif",
      fontSize: "1px"
    }).setAlpha(0)
    this.add.image(395, 295, "bgMenu").setScale(0.66)

    const volumeSalvo = localStorage.getItem("config_volume")
    const musicaSalva = localStorage.getItem("config_musica")

    const volumeFinal = volumeSalvo !== null ? parseInt(volumeSalvo) / 10 : 0.5
    const musicaIndex = musicaSalva !== null ? parseInt(musicaSalva) : 0

    const musicas = ["musica1", "musica2", "musica3", "musica4"]

    this.musica = this.sound.add(musicas[musicaIndex], {
      volume: volumeFinal,
      loop: true
    })

    this.input.keyboard.once("keydown", () => {
      if (!this.musica.isPlaying)
        this.musica.play()
    })

    // Menu
    const opcoes = ["PLAYER 1", "CONFIGURAÇÃO"]
    this.opcaoSelecionada = 0

    this.textos = opcoes.map((texto, index) =>
      this.add.text(280, 310 + index * 60, texto, {
        fontFamily: "sans-serif",
        fontSize: "32px",
        color: index === 0 ? "#ffff00" : "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000000",
          blur: 2,
          fill: true
        }
      })
    )

    this.input.keyboard.on("keydown-UP", () => this.atualizaSelecao(-1))
    this.input.keyboard.on("keydown-DOWN", () => this.atualizaSelecao(1))

    this.input.keyboard.on("keydown-ENTER", () => {
      this.musica.stop()
      if (this.opcaoSelecionada === 0) {
        this.scene.start("MainScene")
      } else if (this.opcaoSelecionada === 1) {
        this.scene.start("ConfigScene")
      }
    })
  }

  atualizaSelecao(direcao) {
    this.textos[this.opcaoSelecionada].setColor("#ffffff")
    this.opcaoSelecionada = Phaser.Math.Wrap(this.opcaoSelecionada + direcao, 0, this.textos.length)
    this.textos[this.opcaoSelecionada].setColor("#ffff00")
  }
}
