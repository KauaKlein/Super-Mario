import { useEffect, useRef } from "react";
import Phaser from "phaser";

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
        this.load.image("chao", "/Chao.png");
        this.load.image("goomba", "/Goomba.png");
        this.load.spritesheet("teste", "/MarioMiniSpritesheet.png", {
          frameWidth: 16,
          frameHeight: 22,
        });
      }

      geraChao() {
        this.chaoGroup = this.physics.add.staticGroup();

        for (let i = 0; i < 2; i++) {
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

        this.player = this.physics.add.sprite(0, 300, "teste", 2);
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
            { key: "teste", frame: 3 },
            { key: "teste", frame: 2 },
          ],
          frameRate: 12,
          repeat: -1,
        });

        this.anims.create({
          key: "parado",
          frames: [{ key: "teste", frame: 2 }],
        });

        this.anims.create({
          key: "pulando",
          frames: [{ key: "teste", frame: 1 }],
          frameRate: 1,
        });

        this.anims.create({
          key: "caindo",
          frames: [{ key: "teste", frame: 0 }],
          frameRate: 1,
        });
      }

      onPlayerHitObstacle(player, goomba) {
        if (this.colidiuComgoomba) return;

        this.colidiuComgoomba = true;
        console.log("Colisão detectada!");
        player.setTint(0xff0000);
        this.gameOver();
      }

      gameOver() {
        this.cameras.main.fadeOut(1000);
      }

      // collectCoin(player, coin) {
      //   coin.disableBody(true, true);
      //   console.log("Moeda coletada!");
      // }

      update() {
        if (this.cursors.right.isDown) {
          this.player.x += 10;
          this.player.flipX = false;
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

        if (this.player.body.velocity.y < 0) {
          if (this.player.anims.currentAnim?.key !== "pulando") {
            this.player.anims.play("pulando");
          }
        } else if (this.player.body.velocity.y > 0) {
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
            debug: true,
          },
        },
        scene: MainScene,
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
