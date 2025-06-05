import { useEffect, useRef } from "react";
import Phaser from "phaser";
import Menu from "./Menu";
import Config from "./Config";
import { GameOver } from "./GameOver";
import Movimentacao from "./Movimentacao";
import Preload from "./Preload";
import Pause from "./Pause";
import { Vitoria } from "./Vitoria";

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
        this.load.audio("musica1", "/menu.mp3");
        this.load.image("Background", "/Background.png");
        this.load.image("GroundTorto", "/GroundTorto.png");
        this.load.image("Cano", "/Cano.png");
        this.load.image("PosteFinal", "/PosteFinal.png");

        this.load.spritesheet("SpriteSheetBillBullet", "/BillBullet.png", {
          frameWidth: 63,
          frameHeight: 63,
        });

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
        this.load.spritesheet("Ground", "/GroundSpriteSheet.png", {
          frameWidth: 16,
          frameHeight: 16,
        });
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
      geraGrama(local) {
        for (let i = 0; i < 3; i++) {
          const chao = this.add.image(i * 48 + local, 468, "Ground", i + 6);
          chao.setOrigin(0, 0);
          chao.setScale(3);
          chao.setDepth(0);
        }
      }
      geraChao2(altura, quantidade, local) {
        for (let i = 0; i < quantidade; i++) {
          const chao = this.chaoGroup.create(
            i * 48 + local,
            altura,
            "Ground",
            1
          );
          chao.setOrigin(0, 0);
          chao.setScale(3);
          chao.setDepth(99);
          chao.refreshBody();
        }
        while (altura < 552) {
          for (let i = 0; i < quantidade; i++) {
            const chao = this.add.image(
              i * 48 + local,
              altura + 48,
              "Ground",
              3
            );
            chao.setOrigin(0, 0);
            chao.setScale(3);
            chao.setDepth(1);
          }
          altura += 48;
        }
      }
      geraChao() {
        this.chaoGroup = this.physics.add.staticGroup();
        this.canoGroup = this.physics.add.staticGroup();

        this.add.image(600, 250, "GroundTorto").setOrigin(0, 0).setScale(3);

        this.geraChao2(510, 80, 0);

        this.geraGrama(200);
        this.geraGrama(1000);
        this.geraGrama(1350);
        this.geraGrama(2000);
        this.geraGrama(2200);
        this.geraChao2(300, 10, 2650);
        this.geraChao2(480, 2, 3842);
        this.geraChao2(450, 2, 3938);
        this.geraChao2(420, 2, 4034);
        this.geraChao2(390, 2, 4130);
        this.geraChao2(510, 5, 4314);

        this.cano = this.canoGroup
          .create(1490, 400, "Cano")
          .setOrigin(0, 0)
          .setScale(3)
          .refreshBody();
        for (let i = 1; i < 3; i++) {
          this.cano = this.canoGroup
            .create(i * 120 + 2300, 500 - i * 100, "Cano")
            .setOrigin(0, 0)
            .setScale(3)
            .refreshBody();
        }
      }
      criaMoeda() {
        this.moedaGroup = this.physics.add.group();
        for (let i = 1; i < 8; i++) {
          const moeda = this.moedaGroup.create(i * 500, 360, "Moedas");
          moeda.anims.play("animacaoMoeda");
          moeda.body.allowGravity = false;
          moeda.setScale(3);
          moeda.setDepth(2);
        }
      }
      criaBill() {
        this.bill = this.physics.add.group();
        const billBala = this.bill.create(
          3000,
          360,
          "SpriteSheetBillBullet",
          0
        );

        // Visual e física
        billBala.setScale(3);
        billBala.setVelocityX(-250);
        billBala.setDepth(1);
        billBala.body.allowGravity = false;

        // Hitbox circular (aproximada do corpo real)
        const raio = 30;
        billBala.body.setCircle(raio);
        billBala.body.setOffset(0, 4);

        const body2 = this.add.rectangle(
          billBala.x + 10,
          billBala.y,
          50,
          180,
          0xff0000,
          0
        );
        this.physics.add.existing(body2);
        body2.body.setAllowGravity(false);
        body2.body.setImmovable(true);
        body2.setDepth(1);
        billBala.body2 = body2;
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
          goomba.setOrigin(-20, 1);
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
        this.moedasColetadas = 0;
        this.textoMoeda = this.add.text(16, 16, "Moedas: 0", {
          fontSize: "32px",
          fill: "#fff",
        });
        this.pontuacao = 0;
        this.musica = this.sound.add("musica1", {
        loop: true,
        volume: 0.3,
        });
        this.musica.play();
        this.textoMoeda.setScrollFactor(0);

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
          this.scene.launch("Pause");
          this.scene.pause();
        });
        this.colidiuComgoomba = false;
        this.isGameOver = false;
        this.textoPontuacao = this.add
          .text(20, 20, "SCORE: 000", {
            fontFamily: "Super Mario",
            fontSize: "28px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
          })
          .setScrollFactor(0)
          .setDepth(999);

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
        this.player.setDepth(2);

        // SENSOR DE PISÃO
        this.pisaoSensor = this.add.rectangle(0, 0, this.player.width * 3, 45);
        this.physics.add.existing(this.pisaoSensor);
        this.pisaoSensor.body.allowGravity = false;
        this.pisaoSensor.body.setImmovable(true);

        this.player.setMaxVelocity(500, 1600);
        this.player.setDragX(2000);
        this.player.isAgachado = false;
        this.player.wasAgachado = false;
        this.player.isOlhandoFrente = true;
        this.geraChao();
        this.criaBill();
        this.criagoomba();

        this.physics.add.collider(this.goombaGroup, this.goombaGroup);

        this.physics.world.setBounds(0, 0, 4500, 600);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, this.chaoGroup);
        this.physics.add.collider(this.player, this.canoGroup);
        this.physics.add.collider(this.goombaGroup, this.canoGroup);
        this.physics.add.collider(this.goombaGroup, this.chaoGroup);

        //bandeira final
        this.poste = this.physics.add.staticImage(4400, 380, "PosteFinal");
        this.poste.setScale(2);
        this.poste.refreshBody();

        // Adiciona o overlap entre o jogador e o poste
        this.physics.add.overlap(
          this.player,
          this.poste,
          () => {
            this.physics.world.disable(this.player);
            Vitoria(this); 
          },
          null,
          this
        );

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

        //colisao com moedas
        this.physics.add.overlap(
          this.player,
          this.moedaGroup,
          this.coletarMoeda,
          null,
          this
        );

        //colilider com bill bala
        // PISAR no corpo principal (body) do Bill Bala → Bill morre
        this.physics.add.overlap(
          this.pisaoSensor,
          this.bill,
          this.matarBillPisado,
          null,
          this
        );

        // PISAR no sensor adicional (body2) → Bill morre
        this.bill.children.iterate((billBala) => {
          if (billBala.body2) {
            this.physics.add.overlap(
              this.pisaoSensor,
              billBala.body2,
              () => {
                if (!this.isGameOver) {
                  // remove o sensor extra
                  billBala.body2.destroy();
                  // desativa o Bill
                  billBala.disableBody(true, true);
                  // Mario quica
                  this.player.setVelocityY(-1000);
                }
              },
              null,
              this
            );
          }
        });

        // COLISÃO lateral com corpo principal → Mario morre
        this.physics.add.overlap(
          this.player,
          this.bill,
          (player, bill) => {
            const pisando = Phaser.Geom.Intersects.RectangleToRectangle(
              this.pisaoSensor.getBounds(),
              bill.getBounds()
            );

            if (!pisando && !this.isGameOver) {
              this.onPlayerHitObstacle();
            }
          },
          null,
          this
        );

        // COLISÃO lateral com sensor adicional (body2) → Mario morre
        this.bill.children.iterate((billBala) => {
          if (billBala.body2) {
            this.physics.add.overlap(
              this.player,
              billBala.body2,
              () => {
                const pisando = Phaser.Geom.Intersects.RectangleToRectangle(
                  this.pisaoSensor.getBounds(),
                  billBala.body2.getBounds()
                );

                if (!pisando && !this.isGameOver) {
                  this.onPlayerHitObstacle();
                }
              },
              null,
              this
            );
          }
        });

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 4500, 600);

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

      coletarMoeda(player, moeda) {
        moeda.disableBody(true, true);
        this.moedasColetadas += 1;
        this.pontuacao += 10;

        this.textoMoeda.setText("Moedas: " + this.moedasColetadas);

        const textoFormatado = String(this.pontuacao).padStart(3, "0");
        this.textoPontuacao.setText("SCORE: " + textoFormatado);
      }
      matarBillPisado(sensor, bill) {
        if (this.isGameOver) return;

        // Desativa Bill Bala
        bill.disableBody(true, true);

        // Se tiver sensor extra (body2), destrói também
        if (bill.body2 && bill.body2.destroy) {
          bill.body2.destroy();
          bill.body2 = null;
        }

        // Efeito do pulo do Mario
        this.player.setVelocityY(-1200);
      }

      onPlayerHitObstacle() {
        if (this.isGameOver) return;

        this.isGameOver = true;

        this.goombaGroup.children.iterate((goomba) => {
          if (goomba.body) {
            goomba.setVelocity(0, 0);
            goomba.body.moves = false;
          }
          this.bill.setVelocityX(0);
          GameOver(this);
          this.physics.world.removeCollider(this.goombaCollider);
        });
      }

      update() {
        if (this.player.y > 550) {
          GameOver(this);
        }
        if (!this.bill) return;

        this.bill.children.iterate((billBala) => {
          if (!billBala || !billBala.body) return;

          const body2 = billBala.body2;
          if (body2 && body2.body) {
            body2.x = billBala.x + 60;
            body2.y = billBala.y;
          }
        });

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
              goomba.setFlipX(true);
            } else if (touchingRight) {
              goomba.setVelocityX(-100);
              goomba.setFlipX(false);
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
          },
        },
        scene: [Preload, Menu, MainScene, Config, Pause],
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
