import "phaser";
import { Cookie } from "./cookie";

export class SceneGame extends Phaser.Scene {
    ground: Phaser.Physics.Arcade.StaticGroup;
    hud: Phaser.Physics.Arcade.StaticGroup;
    info: Phaser.GameObjects.Text;
    cookiesCaught: number;
    badCookiesCaught: number;
    cookiesDropped: number;
    maxErrors: number;
    goodCookieKey: string;
    badCookieKey: string;
    cookieSpeed: number;
    lastTimeTick: number;
    emitSpeed: number;
    emitSpeedLimit: number;
    emitSpeedUp: number;
    goodCookieGroup: Phaser.Physics.Arcade.Group;
    badCookieGroup: Phaser.Physics.Arcade.Group;

    constructor() {
        super({
            key: "SceneGame"
        });
    }

    init(params) {
        //TODO: params = Use selected character.
        //Assuming player is pigeon
        this.goodCookieKey = "cookie_nuts";
        this.badCookieKey = "cookie";
        this.cookiesCaught = 0;
        this.badCookiesCaught = 0;
        this.cookiesDropped = 0;
        this.maxErrors = 3;
        this.emitSpeed = 2000;
        this.emitSpeedLimit = 500;
        this.emitSpeedUp = 20;
        this.lastTimeTick = 0;
        this.cookieSpeed = 100;
    }

    preload(): void {
        this.load.image("hud", "assets/hud.png");
        this.load.image("ground", "assets/ground.png");
        this.load.image("cookie", "assets/cookie.png");
        this.load.image("cookie_nuts", "assets/cookie_nuts.png");
        this.load.image("duckling", "assets/duckling_player.png");
        this.load.image("pigeon", "assets/pigeon_player.png");
    }

    create(): void {
        this.setupCookieGroups();
        this.addGround();
        this.addHud();
        this.setupHud();
        this.updateHud();
    }

    update(time: number): void {
        let deltaTime: number = time - this.lastTimeTick;
        if (deltaTime > this.emitSpeed) {
            this.lastTimeTick = time;
            if (this.emitSpeed > this.emitSpeedLimit) {
                this.emitSpeed -= this.emitSpeedUp;
            }
            this.emitCookie();
        }
    }

    addGround(): void {
        this.ground = this.physics.add.staticGroup({
            key: "ground",
            frameQuantity: 10
        });

        Phaser.Actions.PlaceOnLine(
            this.ground.getChildren(), 
            new Phaser.Geom.Line(32, 768, 632, 768));

        this.ground.refresh();
    }

    addHud(): void {
        this.hud = this.physics.add.staticGroup({
            key: "hud",
            frameQuantity: 10
        });

        Phaser.Actions.PlaceOnLine(
            this.hud.getChildren(), 
            new Phaser.Geom.Line(32, 32, 632, 32));

        this.hud.refresh();
    }

    setupHud(): void {
        this.info = this.add.text(32, 32, ``, { font: "32px Courier Bold", fill: "#FBFBAC" });
        this.info.setOrigin(0, 0.5);
    }

    updateHud(): void {
        this.info.text = `Health: ${this.maxErrors - this.badCookiesCaught - this.cookiesDropped}   Cookies: ${this.cookiesCaught}`;
    }

    setupCookieGroups(): void {
        this.goodCookieGroup = this.physics.add.group();
        this.badCookieGroup = this.physics.add.group();
    }

    emitCookie(): void {
        new Cookie(this, this.goodCookieKey, this.badCookieKey);
    }
}