import { useEffect, useRef } from "react";
import Phaser from "phaser";
import MenuScene from "./MenuScene";
import ConfigScene from "./ConfigScene";
import { GameOver } from "./GameOver";
import Movimentacao from "./Movimentacao";
import PreloadScene from "./PreloadScene";
import PauseScene from "./PauseScene";

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
        this.load.audio("temaYoshi", "/yoshi.mp3");
        this.load.image("Background", "/Background.png");

        this.load.spritesheet("SpriteSheetGoomba", "/SpriteSheetGoomba.png", {
          frameWidth: 16,
          frameHeight: 16,
        });
        this.load.spritesheet("MarioAgachado", "/MarioAgachado.png", {
          frameWidth: 16,
          frameHeight: 16,
        });
        this.load.spritesheet("MarioGameOver", "/MarioGameOver.png", {
          frameWidth: 16,
          frameHeight: 24,
        });
        this.load.spritesheet("Moedas", "/Moedas.png", {
          frameWidth: 12,
          frameHeight: 16,
        });
        this.load.spritesheet(
          "MiniMarioSpriteSheet",
          "/MiniMarioSpritesheet.png",
          {
            frameWidth: 16,
            frameHeight: 22,
          }
        );
      }
      geraFundo() {
        for (let i = 0; i < 5; i++) {
          this.add
            .image(i * 1022, -200, "Background")
            .setScale(2)
            .setOrigin(0, 0)
            .setFlipX(true)
            .setScrollFactor(0.1);
        }
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
      criaMoeda() {
        this.moedaGroup = this.physics.add.group();
        for (let i = 1; i < 6; i++) {
          const moeda = this.moedaGroup.create(i * 300, 430, "Moedas");
          moeda.anims.play("animacaoMoeda");
          moeda.setImmovable(false);
          moeda.setScale(3);
          moeda.body.allowGravity = false;
          moeda.setDepth(1);
        }
      }
      criagoomba() {
        this.goombaGroup = this.physics.add.group();
        for (let i = 1; i <= 5; i++) {
          const goomba = this.goombaGroup.create(
            i * 300,
            430,
            "SpriteSheetGoomba",
            0
          );
          goomba.anims.play("goombaMovendo");
          goomba.setScale(3);
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
        this.anims.create({
          key: "goombaMovendo",
          frames: [
            { key: "SpriteSheetGoomba", frame: 0 },
            { key: "SpriteSheetGoomba", frame: 1 },
          ],
          frameRate: 5,
          repeat: -1,
        });
        this.anims.create({
          key: "animacaoMoeda",
          frames: [
            { key: "Moedas", frame: 0 },
            { key: "Moedas", frame: 1 },
            { key: "Moedas", frame: 2 },
            { key: "Moedas", frame: 3 },
          ],
          frameRate: 7,
          repeat: -1,
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on("keydown-ESC", () => {
          this.scene.launch("PauseScene");
          this.scene.pause();
        });
        this.colidiuComgoomba = false;
        this.isGameOver = false;
        this.criaMoeda();
        this.geraFundo();
        this.player = this.physics.add.sprite(
          0,
          300,
          "MiniMarioSpriteSheet",
          2
        );
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0);
        this.player.setOrigin(0, 1);
        this.player.setScale(3);

        // SENSOR DE PISÃO
        this.pisaoSensor = this.add.rectangle(0, 0, this.player.width * 3, 35);
        this.physics.add.existing(this.pisaoSensor);
        this.pisaoSensor.body.allowGravity = false;
        this.pisaoSensor.body.setImmovable(true);

        this.player.setMaxVelocity(500, 1600);
        this.player.setDragX(2000);
        this.player.isAgachado = false;
        this.player.wasAgachado = false;
        this.player.isOlhandoFrente = true;
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
              goomba.anims.play("goombaMorrendo", 2);
              goomba.setVelocity(0, 0);
              goomba.body.enable = false;

              this.time.delayedCall(300, () => {
              goomba.disableBody(true, true);
      });

  this.player.setVelocityY(-1000);
            }
          },
          null,
          this
        );

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 2000, 600);

        this.anims.create({
          key: "andandoFrente",
          frames: [
            { key: "MiniMarioSpriteSheet", frame: 3 },
            { key: "MiniMarioSpriteSheet", frame: 2 },
          ],
          frameRate: 12,
          repeat: -1,
        });

        this.anims.create({
          key: "paradoFrente",
          frames: [{ key: "MiniMarioSpriteSheet", frame: 2 }],
        });

        this.anims.create({
          key: "pulandoFrente",
          frames: [{ key: "MiniMarioSpriteSheet", frame: 1 }],
          frameRate: 1,
        });

        this.anims.create({
          key: "caindoFrente",
          frames: [{ key: "MiniMarioSpriteSheet", frame: 0 }],
          frameRate: 1,
        });

        this.anims.create({
          key: "andandoCosta",
          frames: [
            { key: "MiniMarioSpriteSheet", frame: 4 },
            { key: "MiniMarioSpriteSheet", frame: 5 },
          ],
          frameRate: 12,
          repeat: -1,
        });
        this.anims.create({
          key: "paradoCosta",
          frames: [{ key: "MiniMarioSpriteSheet", frame: 5 }],
        });
        this.anims.create({
          key: "pulandoCosta",
          frames: [{ key: "MiniMarioSpriteSheet", frame: 6 }],
          frameRate: 1,
        });
        this.anims.create({
          key: "caindoCosta",
          frames: [{ key: "MiniMarioSpriteSheet", frame: 7 }],
          frameRate: 1,
        });
        this.anims.create({
          key: "olhandoFrente",
          frames: [{ key: "MarioAgachado", frame: 0 }],
          frameRate: 1,
        });
        this.anims.create({
          key: "olhandoCosta",
          frames: [{ key: "MarioAgachado", frame: 1 }],
          frameRate: 1,
        });
        this.anims.create({
          key: "game over",
          frames: [
            { key: "MarioGameOver", frame: 0 },
            { key: "MarioGameOver", frame: 1 },
          ],
          frameRate: 12,
          repeat: -1,
        });
        this.anims.create({
          key: "goombaMorrendo",
          frames: [{ key: "SpriteSheetGoomba", frame: 2 }],
          frameRate: 1,
        });
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

          GameOver(this);
          this.physics.world.removeCollider(this.goombaCollider);
        });
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
                goomba.setFlipX(true); // olhando pra esquerda (se sua sprite sheet for assim)
              } else if (touchingRight) {
                goomba.setVelocityX(-100);
                goomba.setFlipX(false); // olhando pra direita
              }
          }
        });

        // Atualiza posição do sensor de pisão
        if (this.pisaoSensor && this.player) {
          this.pisaoSensor.x = this.player.body.x + this.player.body.width / 2;
          this.pisaoSensor.y =
            this.player.body.y + this.player.body.height + 25;
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
        scene: [PreloadScene, MenuScene, MainScene, ConfigScene, PauseScene],
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
