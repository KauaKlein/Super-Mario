import { useEffect, useRef } from "react";
import Phaser from "phaser";
import MenuScene from "./MenuScene";
import ConfigScene from "./ConfigScene";
import { GameOver } from "./GameOver";
import Movimentacao from "./Movimentacao";

export const Game = () => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  useEffect(() => {
    class MainScene extends Phaser.Scene {
      constructor() {
        super("MainScene");
      }

      preload() {
        this.load.image("game", "/game.png");
        this.load.image("over", "/over.png");
        this.load.image("chao", "/Chao.png");
        this.load.image("MarioAgachado", "/MarioAgachado.png");
        this.load.audio("temaYoshi", "/yoshi.mp3");
        this.load.image("goomba", "/Goomba.png");
        this.load.spritesheet("MarioGameOver", "/MarioGameOver.png", {
          frameWidth: 16,
          frameHeight: 24,
        });
        this.load.spritesheet(
          "MiniMarioSpriteSheet",
          "/MarioMiniSpritesheet.png",
          {
            frameWidth: 16,
            frameHeight: 22,
          }
        );
      }

      geraChao() {
        this.chaoGroup = this.physics.add.staticGroup();
        for (let i = 0; i < 5; i++) {
          const chao = this.chaoGroup.create(i * 900, 500, "chao");
          chao.setOrigin(0, 0);
          chao.setScale(0.75);
          chao.refreshBody();
        }
      }

      criagoomba() {
        this.goombaGroup = this.physics.add.staticGroup();
        const goomba = this.goombaGroup.create(500, 460, "goomba");
        goomba.setOrigin(0, 0);
        goomba.setScale(0.2);
        goomba.refreshBody();
      }

      create() {
        this.colidiuComgoomba = false;
        this.isGameOver = false;

        this.player = this.physics.add.sprite(
          0,
          300,
          "MiniMarioSpriteSheet",
          2
        );
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0);
        this.player.setOrigin(0, 0);
        this.player.setScale(3);

        this.geraChao();
        this.criagoomba();

        this.physics.world.setBounds(0, 0, 2000, 600);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, this.chaoGroup);

        this.goombaCollider = this.physics.add.collider(
          this.player,
          this.goombaGroup,
          this.onPlayerHitObstacle,
          null,
          this
        );

        this.chaoCollider = this.physics.add.collider(
          this.player,
          this.chaoGroup
        );

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 2000, 600);

        this.anims.create({
          key: "andando",
          frames: [
            { key: "MiniMarioSpriteSheet", frame: 3 },
            { key: "MiniMarioSpriteSheet", frame: 2 },
          ],
          frameRate: 12,
          repeat: -1,
        });

        this.anims.create({
          key: "parado",
          frames: [{ key: "MiniMarioSpriteSheet", frame: 2 }],
        });

        this.anims.create({
          key: "pulando",
          frames: [{ key: "MiniMarioSpriteSheet", frame: 1 }],
          frameRate: 1,
        });

        this.anims.create({
          key: "caindo",
          frames: [{ key: "MiniMarioSpriteSheet", frame: 0 }],
          frameRate: 1,
        });

        if (!this.anims.exists("game over")) {
          this.anims.create({
            key: "game over",
            frames: [
              { key: "MarioGameOver", frame: 0 },
              { key: "MarioGameOver", frame: 1 },
            ],
            frameRate: 12,
            repeat: -1,
          });
        }
      }

      onPlayerHitObstacle() {
        if (this.colidiuComgoomba) return;
        this.colidiuComgoomba = true;
        console.log("Colisão detectada!");
        GameOver(this);
      }

      update() {
        if (!this.isGameOver) {
          Movimentacao(this);
        }
      }
    }

    if (!phaserGameRef.current) {
      phaserGameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: "#4488aa",
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 5000 },
            debug: false,
          },
        },
        scene: [MenuScene, MainScene, ConfigScene],
        parent: gameRef.current,
      });
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  return <div ref={gameRef} className="flex justify-center items-center" />;
};
