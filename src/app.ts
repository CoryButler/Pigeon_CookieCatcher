import "phaser";
import { SceneCharacterSelect } from "./scene_characterSelect";
import { SceneTutorial } from "./scene_tutorial";
import { SceneGame } from "./scene_game";
import { SceneResults } from "./scene_results";

const config: Phaser.Types.Core.GameConfig = {
  title: "Pigeon—CookieCatcher",
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 600,
      height: 800
  },
  scene: [SceneCharacterSelect, SceneTutorial, SceneGame, SceneResults],
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