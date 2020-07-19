import "phaser";
import { SceneGame } from "./scene_game";

const config: Phaser.Types.Core.GameConfig = {
  title: "Pigeon—CookieCatcher",
  width: 600,
  height: 800,
  scene: [SceneGame],
  physics: {
      default: "arcade",
      arcade: {
          debug: false
      }
  },
  backgroundColor: "#8899CC"
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var game = new Game(config);
};