import Phaser from "phaser"

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene")
  }

  preload() {
    this.cameras.main.setBackgroundColor("#20b2aa")
    this.add.text(320, 280, "Carregando...", {
      fontFamily: "sans-serif",
      fontSize: "24px",
      color: "#ffffff"
    })

    // Carrega tudo antes de ir pro menu
    this.load.image("bgMenu", "/MenuPrincipal.png")
    this.load.image("bgConfig", "/Cenário.png")

    this.load.audio("musica1", "/menu.mp3")
    this.load.audio("musica2", "/yoshi.mp3")
    this.load.audio("musica3", "/starroad.mp3")
    this.load.audio("musica4", "/egg.mp3")
  }

  create() {
    this.scene.start("MenuScene")
  }
}
