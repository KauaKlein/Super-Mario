import Phaser from "phaser";


export default class ConfigScene extends Phaser.Scene {
  constructor() {
    super("ConfigScene");
  }

  preload() {
    this.load.image("bgConfig", "/Cenario.png");
    this.load.audio("musica1", "/menu.mp3");
    this.load.audio("musica2", "/yoshi.mp3");
    this.load.audio("musica3", "/starroad.mp3");
    this.load.audio("musica4", "/egg.mp3");
  }

  create() {
    this.add.text(0, 0, ".", {
      fontFamily: "sans-serif",
      fontSize: "1px"
    }).setAlpha(0)
    this.add.image(395, 295, "bgConfig").setScale(0.66);

    this.opcoes = ["Volume", "Música", "Salvar"];
    this.opcaoSelecionada = 0;

    this.musicas = [
      { key: "musica1", nome: "Tema Principal" },
      { key: "musica2", nome: "Tema Yoshi Island" },
      { key: "musica3", nome: "Tema Star Road" },
      { key: "musica4", nome: "Tema Easter Egg" },
    ];

    const volumeSalvo = localStorage.getItem("config_volume");
    const musicaSalva = localStorage.getItem("config_musica");

    this.volume = volumeSalvo !== null ? parseInt(volumeSalvo) : 5;
    this.musicaAtual = musicaSalva !== null ? parseInt(musicaSalva) : 0;

    this.music = this.sound.add(this.musicas[this.musicaAtual].key, {
      volume: this.volume / 10,
      loop: true
    });
    this.music.play();

    this.textos = this.opcoes.map((opcao, index) =>
      this.add.text(200, 200 + index * 50, "", {
        fontFamily: "sans-serif",
        fontSize: "32px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000000",
          blur: 2,
          fill: true
        }
      })
    );

    this.cursor = this.add.text(170, 200, "▶", {
      fontFamily: "sans-serif",
      fontSize: "32px",
      color: "#ffff00",
      stroke: "#000000",
      strokeThickness: 5
    });

    this.atualizaTexto();

    this.input.keyboard.on("keydown-UP", () => this.mudaOpcao(-1));
    this.input.keyboard.on("keydown-DOWN", () => this.mudaOpcao(1));
    this.input.keyboard.on("keydown-LEFT", () => this.ajustarValor(-1));
    this.input.keyboard.on("keydown-RIGHT", () => this.ajustarValor(1));

   this.input.keyboard.on("keydown-ENTER", () => {
      if (this.opcaoSelecionada === 2) {
        // Salva e retorna ao menu
        localStorage.setItem("config_volume", this.volume);
        localStorage.setItem("config_musica", this.musicaAtual);
        this.music.stop();
        this.scene.start("MenuScene");
      }
    });

    this.input.keyboard.on("keydown-ESC", () => {
      this.music.stop();
      this.scene.start("MenuScene");
    });
  }

  mudaOpcao(delta) {
    this.opcaoSelecionada = Phaser.Math.Wrap(
      this.opcaoSelecionada + delta,
      0,
      this.opcoes.length
    );
    this.cursor.setY(200 + this.opcaoSelecionada * 50);
    this.atualizaTexto();
  }

  ajustarValor(delta) {
    if (this.opcaoSelecionada === 0) {
      this.volume = Phaser.Math.Clamp(this.volume + delta, 0, 10);
      this.music.setVolume(this.volume / 10);
    } else if (this.opcaoSelecionada === 1) {
      this.music.stop();
      this.musicaAtual = Phaser.Math.Wrap(
        this.musicaAtual + delta,
        0,
        this.musicas.length
      );
      this.music = this.sound.add(this.musicas[this.musicaAtual].key, {
        volume: this.volume / 10,
        loop: true
      });
      this.music.play();
    }
    this.atualizaTexto();
  }

  atualizaTexto() {
    this.textos[0].setText(`Volume: ${this.volume}`);
    this.textos[1].setText(`Música: ${this.musicas[this.musicaAtual].nome}`);
    this.textos[2].setText("Salvar");
  }
}
