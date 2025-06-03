import { useEffect, useRef } from "react";
import Phaser from "phaser";
import MenuScene from "./MenuScene";
import ConfigScene from "./ConfigScene";

export const Game = () => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const GameOver = false

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

        // colisão com goomba
        this.physics.add.collider(
          this.player,
          this.goombaGroup,
          this.onPlayerHitObstacle,
          null,
          this
        );

        // câmera seguindo o Mario
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 2000, 600);

        // animações
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
        this.anims.create({
          key: "game over",
          //A ser implementado função game over
          frames: [
            { key: "MarioGameOver", frame: 0 },
            { key: "MarioGameOver", frame: 1 },
          ],
          frameRate: 8,
          repeat: -1,
        });
        if (!this.anims.exists("game over")) {
          this.anims.create({
            key: "game over",
            frames: [
              { key: "MarioGameOver", frame: 0 },
              { key: "MarioGameOver", frame: 1 },
            ],
            frameRate: 8,
            repeat: -1,
          });
        }
      }

      onPlayerHitObstacle(player, goomba) {
        if (this.colidiuComgoomba) return;

        this.gameOver();
        this.colidiuComgoomba = true;
        console.log("Colisão detectada!");
        player.setTint(0xff0000);
      }

      gameOver() {
        this.physics.pause();
        this.player.anims.play("game over", true);
        this.player.setTint(0xff0000);
      
        this.cameras.main.fadeOut(1000);
      
        this.cameras.main.once("camerafadeoutcomplete", () => {
          const centerX = this.cameras.main.centerX;
          const centerY = this.cameras.main.centerY;
      
          const gameImg = this.add.image(-200, centerY, "game").setScale(2);
          const overImg = this.add.image(this.cameras.main.width + 200, centerY, "over").setScale(2);
      
          this.tweens.add({
            targets: gameImg,
            x: centerX - 150,
            duration: 1000,
            ease: "Power2",
          });
      
          this.tweens.add({
            targets: overImg,
            x: centerX + 150,
            duration: 1000,
            ease: "Power2",
          });
        });
      }

      // collectCoin(player, coin) {
      //   coin.disableBody(true, true);
      //   console.log("Moeda coletada!");
      // }

      update() {
        //Movimentação eixo X
        if (this.cursors.left.isDown && this.cursors.right.isDown) {
          this.player.x += 0;
          //e esses para nao ficar repetindo animação de ficar parado atoa quando ja esta parado
          if (this.player.anims.currentAnim?.key !== "parado") {
            this.player.anims.play("parado");
          }
        } else if (this.cursors.down.isDown) {
          if (this.player.anims.currentAnim?.key !== "MarioAgachado") {
            this.player.setTexture("MarioAgachado");
          }
        } else if (this.cursors.right.isDown) {
          this.player.x += 10;
          this.player.flipX = false;
          //esses Ifs sao para as animações não ficarem repetindo infinitamente
          if (this.player.anims.currentAnim?.key !== "andando") {
            this.player.anims.play("andando");
          }
        } else if (this.cursors.left.isDown) {
          this.player.x -= 10;
          this.player.flipX = true;
          if (this.player.anims.currentAnim?.key !== "andando") {
            this.player.anims.play("andando");
          }
        } else {
          if (this.player.anims.currentAnim?.key !== "parado") {
            this.player.anims.play("parado");
          }
        }
        //Movimentação eixo Y
        if (this.player.body.velocity.y < 0) {
          if (this.player.anims.currentAnim?.key !== "pulando") {
            this.player.anims.play("pulando");
          }
        }
        if (this.player.body.velocity.y > 0) {
          if (this.player.anims.currentAnim?.key !== "caindo") {
            this.player.anims.play("caindo");
          }
        }
        if (this.cursors.up.isDown && this.player.body.touching.down) {
          this.player.setVelocityY(-1500);
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
