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
        this.load.spritesheet("MarioAgachado", "/MarioAgachado.png", {
          frameWidth: 16,
          frameHeight: 16,
        });
        this.load.spritesheet("MarioGameOver", "/MarioGameOver.png", {
          frameWidth: 16,
          frameHeight: 24,
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
        this.player.setOrigin(0, 1);
        this.player.setScale(3);
        this.player.isAgachado = false;
        this.player.wasAgachado = false;
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

        //Klein, NÃO mexe nisso, eu não vou saber fazer de novo, prioriza o meu  ao do Ale
        this.player.isIndoEsquerda = this.cursors.left.isDown;
        this.player.isIndoDireita = this.cursors.right.isDown;
        this.player.isPulando =
          this.cursors.up.isDown && this.player.body.touching.down;
        this.player.isAgachando = this.cursors.down.isDown;
        this.player.isSubindo = this.player.body.velocity.y < 0;
        this.player.isDescendo = this.player.body.velocity.y > 0;
        

        if (this.player.isAgachando) {
          this.player.wasAgachado = true;
          this.player.body.setOffset(0, 5);
          this.player.body.setSize(16, 12);
        } else if (!this.player.isAgachando &&  this.player.wasAgachado) {
          this.player.y -= 2;

          this.player.wasAgachado = false;
          this.player.body.setSize(16, 22);
          this.player.body.setOffset(0, 0);
        }

        let velocidade = 0;

        if (this.player.isIndoEsquerda && !this.player.isAgachando) {
          velocidade = -700;
          this.player.isOlhandoFrente = false;
        } else if (this.player.isIndoDireita && !this.player.isAgachando) {
          velocidade = 700;
          this.player.isOlhandoFrente = true;
        }
        this.player.setVelocityX(velocidade);

        if (this.player.isPulando) {
          this.player.setVelocityY(-1600);
        }

        if (this.player.isAgachando) {
          if (this.player.isIndoDireita) {
            this.player.isOlhandoFrente = true;
          } else if (this.player.isIndoEsquerda) {
            this.player.isOlhandoFrente = false;
          }
          const direcao = this.player.isOlhandoFrente
            ? "olhandoFrente"
            : "olhandoCosta";
          if (this.player.anims.currentAnim?.key !== direcao) {
            this.player.anims.play(direcao);
          }
          return;
        }

        if (this.player.isSubindo) {
          const direcao = this.player.isOlhandoFrente
            ? "pulandoFrente"
            : "pulandoCosta";
          if (this.player.anims.currentAnim?.key !== direcao) {
            this.player.anims.play(direcao);
          }
          return;
        }

        if (this.player.isDescendo) {
          const direcao = this.player.isOlhandoFrente
            ? "caindoFrente"
            : "caindoCosta";
          if (this.player.anims.currentAnim?.key !== direcao) {
            this.player.anims.play(direcao);
          }
          return;
        }

        if (velocidade !== 0) {
          const anim = this.player.isOlhandoFrente
            ? "andandoFrente"
            : "andandoCosta";
          if (this.player.anims.currentAnim?.key !== anim) {
            this.player.anims.play(anim);
          }
        } else {
          const anim = this.player.isOlhandoFrente
            ? "paradoFrente"
            : "paradoCosta";
          if (this.player.anims.currentAnim?.key !== anim) {
            this.player.anims.play(anim);
          }
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
