import "phaser";
import { SceneGame } from "./scene_game";

export class Hotdog extends Phaser.Physics.Arcade.Image {
    enabled: boolean;

    constructor(scene: SceneGame) {
        const x: number = Phaser.Math.Between(32, 568);
        const y: number = 0;
        super(scene, x, y, "hotdog");

        scene.add.existing(this);
        scene.hotdogGroup.add(this);
        
        this.enabled = true;
        this.setDepth(-1);
        this.setVelocity(0, 100);
        this.setAngle(Phaser.Math.Between(0, 360));
    }
}