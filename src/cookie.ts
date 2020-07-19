import "phaser";
import { SceneGame } from "./scene_game";

export class Cookie extends Phaser.Physics.Arcade.Image {
    constructor(scene: SceneGame, goodCookieKey: string, badCookieKey: string) {
        const isGoodCookie: boolean = !!Math.round(Math.random());
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

        this.setDisplaySize(64, 64);
        this.setVelocity(0, 100);
        this.setAngle(Phaser.Math.Between(0, 360));

        //TODO: collision with ground
        //TODO: collision with player
    }
}