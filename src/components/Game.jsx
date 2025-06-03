import React, { useEffect, useRef } from "react";
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
        this.load.image("player", "/Mario.webp");
        this.load.image("chao", "/chao.webp");
      }

      geraChao() {
        this.chaoGroup = this.physics.add.staticGroup(); 

        for (let i = 0; i < 20; i++) {
          const bloco = this.chaoGroup.create(i * 62, 550, "chao");
          bloco.setScale(0.17).refreshBody();
        }
      }

      create() {
        this.player = this.physics.add.sprite(100, 100, "player");
        this.player.setScale(0.17);
        this.player.setCollideWorldBounds(true);

        this.geraChao();

        this.cursors = this.input.keyboard.createCursorKeys();


        this.physics.add.collider(this.player, this.chaoGroup);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 1600, 600);
        this.physics.world.setBounds(0, 0, 1600, 600);
      }

      update() {
        if (this.cursors.right.isDown && this.cursors.left.isDown) {
          this.player.setVelocityX(0);
        } else if (this.cursors.right.isDown) {
          this.player.setVelocityX(400);
          this.player.flipX = false;
        } else if (this.cursors.left.isDown) {
          this.player.setVelocityX(-400);
          this.player.flipX = true;
        } else {
          this.player.setVelocityX(0);
        }
        if (this.cursors.up.isDown && this.player.body.touching.down) {
          this.player.setVelocityY(-500);
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
            gravity: { y: 800 }, 
            debug: false,
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
