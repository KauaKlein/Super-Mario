import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.cameras.main.setBackgroundColor("#black");
    this.add.text(320, 280, "Carregando...", {
      fontFamily: "Super Mario",
      fontSize: "32px",
      color: "#ffffff",
    });

    this.load.image("bgMenu", "/MenuPrincipal.png");
    this.load.image("bgConfig", "/Cenario.png");
    this.load.audio("musica1", "/menu.mp3");
    this.load.audio("musica2", "/yoshi.mp3");
    this.load.audio("musica3", "/egg.mp3");
  }

  create() {
    this.scene.start("Menu");
  }
}
