import "phaser";
import { SceneGame } from "./scene_game";

export class Cookie extends Phaser.Physics.Arcade.Image {
    enabled: boolean;

    constructor(scene: SceneGame, goodCookieKey: string, badCookieKey: string) {
        const isGoodCookie = !!Math.round(Math.random());
        const x: number = Phaser.Math.Between(32, 568);
        const y: number = 0;
        super(scene, x, y, isGoodCookie ? goodCookieKey : badCookieKey);

        scene.add.existing(this);
        if (isGoodCookie) {
            scene.goodCookieGroup.add(this);
        }
        else {
            scene.badCookieGroup.add(this);
        }

        this.enabled = true;
        this.setDepth(-1);
        this.setVelocity(0, 100);
        this.setAngle(Phaser.Math.Between(0, 360));
    }
}