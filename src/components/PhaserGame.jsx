import React, { useEffect } from "react";
import Phaser from "phaser";

const PhaserGame = () => {
  useEffect(() => {
    // Loading Scene
    class LoadingScene extends Phaser.Scene {
      constructor() {
        super({ key: "LoadingScene" });
      }

      preload() {
        // Load assets
        this.load.image("firstImage", "assets/images/download.png"); // First image
        this.load.image("secondImage", "assets/images/pl1.png"); // Second image
        this.load.audio("ping", "assets/sounds/background-music.mp3");
        this.load.json("gameData", "assets/data/game-data.json");

        // Display loading progress
        let loadingText = this.add.text(400, 300, "Loading...", {
          fontSize: "24px",
          fill: "#ffffff",
        });
        loadingText.setOrigin(0.5);
      }

      create() {
        // Switch to game scene when loading is complete
        this.scene.start("GameScene");
      }
    }

    // Game Scene
    class GameScene extends Phaser.Scene {
      constructor() {
        super({ key: "GameScene" });
        this.toggleTimer = 0;
        this.showImage = true;
      }

      create() {
        // Create a container
        this.container = this.add.container(400, 300);

        // Add the first image (star)
        this.firstImage = this.add.image(0, -100, "firstImage");
        this.container.add(this.firstImage);

        // Play sound
        this.sound.play("ping");

        // Add button to destroy first image
        const destroyButton = this.add.text(400, 500, "click here to drop", {
          fontSize: "20px",
          fill: "#000",
          backgroundColor: "#32e1f8",
          padding: { x: 10, y: 5 },
        });
        destroyButton.setInteractive();
        destroyButton.setOrigin(0.5);
        destroyButton.on("pointerdown", () => {
          this.firstImage.destroy(); // Destroy the first image
          destroyButton.destroy();   // Destroy the button

          // Show the second image (box)
          this.secondImage = this.add.image(400, 300, "secondImage");
        });
      }

      update(time, delta) {
        // Toggle box visibility every 2 seconds
        this.toggleTimer += delta;
        if (this.toggleTimer >= 2000) {
          this.showImage = !this.showImage;
          if (this.secondImage) {
            this.secondImage.setVisible(this.showImage);
          }
          this.toggleTimer = 0;
        }
      }
    }

    // Phaser game configuration
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: "#113",
      parent: "phaser-container",
      scene: [LoadingScene, GameScene],
    };

    // Create Phaser game instance
    const game = new Phaser.Game(config);

    // Cleanup on unmount
    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-container" style={{ width: "800px", height: "600px" }} />;
};

export default PhaserGame;
