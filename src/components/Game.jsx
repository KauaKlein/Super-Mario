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
        this.load.image("chao", "/chao.webp")
      }

      geraChao(){
        this.chaoGroup = this.physics.add.staticGroup();

        for(let i = 0; i < 20; i++){
          this.chao = this.add.sprite(0, 400, "chao");
          this.chao.setOrigin(-i, -1.68);
          this.chao.setScale(0.17);
        }
      }

      create() {
        this.player = this.add.sprite(0, 400, "player");
        this.player.setOrigin(0, 0);
        this.player.setScale(0.17);
        this.geraChao()
        this.cursors = this.input.keyboard.createCursorKeys();

        //segue o mario ai 
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 1600, 600);
      }
      update() {
        if(this.cursors.right.isDown && this.cursors.left.isDown){
           this.player.x += 0;
        }else if (this.cursors.right.isDown) {
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
