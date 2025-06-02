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
      }
      create() {
        this.player = this.add.sprite(0, 400, "player");
        this.player.setOrigin(0, 0);
        this.player.setScale(0.17);
        this.cursors = this.input.keyboard.createCursorKeys();
      }
      update() {
        if (this.cursors.right.isDown) {
          this.player.x += 6;
          this.player.flipX = false; 
        } else if (this.cursors.left.isDown) {
          this.player.x -= 6;
          this.player.flipX = true; 
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
            gravity: { y: 0 },
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
