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
        this.goombaGroup = this.physics.add.group();
        for (let i = 1; i <= 5; i++) {
          const goomba = this.goombaGroup.create(i * 300, 430, "goomba");
          goomba.setScale(0.2);
          goomba.setOrigin(0.5, 1);
          goomba.setVelocityX(-150);
          goomba.setCollideWorldBounds(true);
          goomba.setBounce(0);
          goomba.setImmovable(false);

          const originalWidth = goomba.width;
          const originalHeight = goomba.height;
          const escala = 1;

          goomba.body.setSize(
            originalWidth * escala,
            originalHeight * escala,
            true
          );
          goomba.refreshBody();
        }
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

        // SENSOR DE PISÃO
        this.pisaoSensor = this.add.rectangle(0, 0, this.player.width * 3, 25);
        this.physics.add.existing(this.pisaoSensor);
        this.pisaoSensor.body.allowGravity = false;
        this.pisaoSensor.body.setImmovable(true);

        this.geraChao();
        this.criagoomba();

        this.physics.add.collider(this.goombaGroup, this.goombaGroup);

        this.physics.world.setBounds(0, 0, 2000, 600);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, this.chaoGroup);
        this.physics.add.collider(this.goombaGroup, this.chaoGroup);

        this.goombaCollider = this.physics.add.collider(
          this.player,
          this.goombaGroup,
          this.onPlayerHitObstacle,
          null,
          this
        );

        // COLLIDER normal
        this.physics.add.collider(
          this.player,
          this.goombaGroup,
          this.onPlayerHitObstacle,
          null,
          this
        );

        // OVERLAP extra contra tunneling
        this.physics.add.overlap(
          this.player,
          this.goombaGroup,
          (player, goomba) => {
            if (!this.isGameOver && this.detectaColisaoReal(player, goomba)) {
              this.onPlayerHitObstacle();
            }
          },
          null,
          this
        );

        // OVERLAP de pisão
        this.physics.add.overlap(
          this.pisaoSensor,
          this.goombaGroup,
          (sensor, goomba) => {
            if (!this.isGameOver) {
              goomba.disableBody(true, true);
              this.player.setVelocityY(-1000);
            }
          },
          null,
          this
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

      detectaColisaoReal(player, goomba) {
        // Ignora colisão se pisão já estiver ativo
        return (
          !this.physics.overlap(this.pisaoSensor, goomba) &&
          ((player.body.touching.left && goomba.body.touching.right) ||
            (player.body.touching.right && goomba.body.touching.left) ||
            (player.body.touching.down && goomba.body.touching.up) ||
            player.body.embedded)
        );
      }

      onPlayerHitObstacle() {
        if (this.isGameOver) return; // já morreu, não repete

        this.isGameOver = true;

        this.goombaGroup.children.iterate((goomba) => {
          if (goomba.body) {
            goomba.setVelocity(0, 0);
            goomba.body.moves = false;
          }
        });

        GameOver(this);
        this.physics.world.removeCollider(this.goombaCollider);
      }
      update() {
        if (!this.isGameOver) {
          Movimentacao(this);
        }

        this.goombaGroup.children.iterate((goomba) => {
          if (!goomba.body) return;

          if (!this.isGameOver) {
            const touchingLeft =
              goomba.body.blocked.left || goomba.body.touching.left;
            const touchingRight =
              goomba.body.blocked.right || goomba.body.touching.right;

            if (touchingLeft) {
              goomba.setVelocityX(100);
              goomba.flipX = false;
            } else if (touchingRight) {
              goomba.setVelocityX(-100);
              goomba.flipX = true;
            }
          }
        });

        // Atualiza posição do sensor de pisão
        if (this.pisaoSensor && this.player) {
          this.pisaoSensor.x = this.player.body.x + this.player.body.width / 2;
          this.pisaoSensor.y = this.player.body.y + this.player.body.height + 15;
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
            debug: true,
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
