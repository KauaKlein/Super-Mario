import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    this.load.image("bgMenu", "/MenuPrincipal.png");
    this.load.audio("temaMenu", "/menu.mp3");
  }
  
  create() {
    this.add.image(395, 295, "bgMenu").setScale(0.66);
  
    const volumeSalvo = localStorage.getItem("config_volume");
    const volumeFinal = volumeSalvo !== null ? parseInt(volumeSalvo) / 10 : 0.5;
  
    this.musica = this.sound.add("temaMenu", {
      volume: volumeFinal,
      loop: true
    });
  
    this.input.keyboard.once("keydown", () => {
      if (!this.musica.isPlaying) this.musica.play();
    });
  
    // ... resto do código do menu
    // Opções do menu
    const opcoes = ["PLAYER 1", "CONFIGURAÇÃO"];
    this.opcaoSelecionada = 0;

    // Renderiza texto das opções
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

    // Navegação ↑ ↓
    this.input.keyboard.on("keydown-UP", () => {
      this.atualizaSelecao(-1);
    });

    this.input.keyboard.on("keydown-DOWN", () => {
      this.atualizaSelecao(1);
    });

    // ENTER para iniciar ou abrir configuração
    this.input.keyboard.on("keydown-ENTER", () => {
      this.musica.stop(); // Para a música antes de sair da cena
      if (this.opcaoSelecionada === 0) {
        this.scene.start("MainScene"); // Inicia o jogo
      } else if (this.opcaoSelecionada === 1) {
        this.scene.start("ConfigScene"); // Vai para configurações
      }
    });
  }

  atualizaSelecao(direcao) {
    this.textos[this.opcaoSelecionada].setColor("#ffffff"); // Reseta anterior
    this.opcaoSelecionada = Phaser.Math.Wrap(
      this.opcaoSelecionada + direcao,
      0,
      this.textos.length
    );
    this.textos[this.opcaoSelecionada].setColor("#ffff00"); // Destaca atual
  }
}
