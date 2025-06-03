import { useEffect, useRef } from "react";
import Phaser from "phaser";

export const Game = () => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  useEffect(() => {
    class MainScene extends Phaser.Scene {
      constructor() {
        super("MainScene");
      }
      preload() {
        this.load.image("chao", "/Chao.png");
        this.load.image("MarioAgachado", "/MarioAgachado.png");
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

      create() {
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
        this.player.isAgachado = false;
        this.player.isOlhandoFrente = true;
        this.geraChao();
        this.physics.world.setBounds(0, 0, 2000, 600);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, this.chaoGroup);

        //segue o mario ai
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 2000, 600);

        //Animação Mini Mario
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
      }
      update() {
        //Movimentação eixo X
        if (this.cursors.left.isDown && this.cursors.right.isDown) {
          this.player.x += 0;
          //e esses para nao ficar repetindo animação de ficar parado atoa quando ja esta parado
          if (this.player.anims.currentAnim?.key !== "parado") {
            this.player.anims.play("parado");
          }
        } else if (this.cursors.down.isDown && !this.player.isAgachado) {
          this.player.isAgachado = true;
          this.player.setTexture("MarioAgachado");
          if (this.cursors.left.isDown && this.player.isOlhandoFrente) {
            this.player.flipX = true;
          } else {
            this.player.flipX = false;
          }
        } else if (!this.cursors.down.isDown && this.player.isAgachado) {
          this.player.isAgachado = false;
          this.player.anims.play("parado");
        } else if (this.cursors.right.isDown && !this.player.isAgachado) {
          this.player.x += 10;
          this.player.flipX = false;
          this.player.isOlhandoFrente = false;
          //esses Ifs sao para as animações não ficarem repetindo infinitamente
          if (this.player.anims.currentAnim?.key !== "andando") {
            this.player.anims.play("andando");
          }
        } else if (this.cursors.left.isDown && !this.player.isAgachado) {
          this.player.x -= 10;
          this.player.flipX = true;
          this.player.isOlhandoFrente = true;
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
