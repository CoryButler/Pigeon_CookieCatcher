import "phaser";
import { Cookie } from "./cookie";
import { Hotdog } from "./hotdog";

export class SceneGame extends Phaser.Scene {
    ground: Phaser.Physics.Arcade.StaticGroup;
    hud: Phaser.Physics.Arcade.StaticGroup;
    info: Phaser.GameObjects.Text;
    goodCookiesCaught: number;
    badCookiesCaught: number;
    goodCookiesDropped: number;
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
    hotdogGroup: Phaser.Physics.Arcade.Group;
    characterKey: string;
    player: Phaser.Physics.Arcade.Image;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    canJump: boolean;

    constructor() {
        super({
            key: "SceneGame"
        });
    }

    init(params: any) {
        this.characterKey = params.characterKey;
        this.goodCookieKey = this.characterKey === "pigeon" ? "cookie_nuts" : "cookie";
        this.badCookieKey = this.characterKey === "pigeon" ? "cookie" : "cookie_nuts";
        this.goodCookiesCaught = 0;
        this.badCookiesCaught = 0;
        this.goodCookiesDropped = 0;
        this.maxErrors = 3;
        this.emitSpeed = 2000;
        this.emitSpeedLimit = 500;
        this.emitSpeedUp = 20;
        this.lastTimeTick = 0;
        this.cookieSpeed = 100;
        this.canJump = false;
    }

    preload(): void {
        this.load.image("hud", "assets/hud.png");
        this.load.image("ground", "assets/ground.png");
        this.load.image("cookie", "assets/cookie.png");
        this.load.image("cookie_nuts", "assets/cookie_nuts.png");
        this.load.image("hotdog", "assets/hotdog.png");
        this.load.image("duckling", "assets/duckling_player.png");
        this.load.image("pigeon", "assets/pigeon_player.png");
    }

    create(): void {
        this.setupGroups();
        this.addGround();
        this.addHud();
        this.setupHud();
        this.updateHud();
        this.addPlayer();
        this.setupGroundColliders();
        this.setupControls();
    }

    update(time: number): void {
        let deltaTime: number = time - this.lastTimeTick;
        if (deltaTime > this.emitSpeed) {
            this.lastTimeTick = time;
            if (this.emitSpeed > this.emitSpeedLimit) {
                this.emitSpeed -= this.emitSpeedUp;
            }
            const isCookie = Math.random() > 0.1;
            if (isCookie) {
                this.emitCookie();
            }
            else {
                this.emitHotdot();
            }
        }

        this.manageMovement();
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

    setupGroundColliders(): void {
        this.physics.add.collider(this.ground, this.badCookieGroup, this.onDroppedBadCookie, null, this);
        this.physics.add.collider(this.ground, this.goodCookieGroup, this.onDroppedGoodCookie, null, this);
        this.physics.add.collider(this.ground, this.hotdogGroup, this.onDroppedBadCookie, null, this);
        this.physics.add.collider(this.ground, this.player, this.enableJump, null, this);
    }

    onDroppedGoodCookie(ground: Phaser.GameObjects.Image, cookie: Cookie): void {
            this.goodCookiesDropped++;
            this.updateHud();
            cookie.enabled = false;
            cookie.setTint(0xff0000);
            this.time.delayedCall(100, () => {
                cookie.destroy();
            });
    }

    onDroppedBadCookie(ground: Phaser.GameObjects.Image, cookie: Cookie): void {
        cookie.enabled = false;
        cookie.setAlpha(0.4);
        this.time.delayedCall(100, () => {
            cookie.destroy();
        });
    }

    onCaughtGoodCookie(player: Phaser.Physics.Arcade.Image, cookie: Cookie) {
        if (!cookie.enabled) return;

        this.goodCookiesCaught++;
        this.updateHud();
        cookie.enabled = false;
        cookie.setTint(0x00ff00);
        cookie.setVelocityY(-200);
        this.time.delayedCall(100, () => {
            cookie.destroy();
        });
    }

    onCaughtBadCookie(player: Phaser.Physics.Arcade.Image, cookie: Cookie) {
        if (!cookie.enabled) return;

        this.badCookiesCaught++;
        this.updateHud();
        cookie.enabled = false;
        cookie.setTint(0xff0000);
        cookie.setVelocityY(-200);
        this.time.delayedCall(100, () => {
            cookie.destroy();
        });
    }

    onCaughtHotdog(player: Phaser.Physics.Arcade.Image, hotdog: Hotdog) {
        if (!hotdog.enabled) return;

        this.badCookiesCaught--;
        this.updateHud();
        hotdog.enabled = false;
        hotdog.setTint(0x00ff00);
        hotdog.setVelocityY(-200);
        this.time.delayedCall(100, () => {
            hotdog.destroy();
        });
    }
    
    enableJump(): void {
        this.canJump = true;
    }

    setupPlayerColliders(): void {

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
        this.info = this.add.text(32, 32, ``, { font: "32px Courier, Monospace Bold", fill: "#FBFBAC" });
        this.info.setOrigin(0, 0.5);
    }

    updateHud(): void {
        const health = this.maxErrors - this.badCookiesCaught - this.goodCookiesDropped;
        this.info.text = `Health: ${health}   Cookies: ${this.goodCookiesCaught}`;

        if (health <= 0) {
            this.scene.start("SceneResults", { characterKey: this.characterKey, goodCookiesCaught: this.goodCookiesCaught });
        }
    }

    setupGroups(): void {
        this.goodCookieGroup = this.physics.add.group();
        this.badCookieGroup = this.physics.add.group();
        this.hotdogGroup = this.physics.add.group();
    }

    emitCookie(): void {
        new Cookie(this, this.goodCookieKey, this.badCookieKey);
    }

    emitHotdot(): void {
        new Hotdog(this);
    }

    addPlayer(): void {
        this.player = this.physics.add.image(
            +this.game.config.width / 2,
            +this.game.config.height / 2,
            this.characterKey
        );

        this.player.setGravityY(400);
        this.player.setCollideWorldBounds(true);

        this.physics.add.overlap(this.player, this.badCookieGroup, this.onCaughtBadCookie, null, this);
        this.physics.add.overlap(this.player, this.goodCookieGroup, this.onCaughtGoodCookie, null, this);
        this.physics.add.overlap(this.player, this.hotdogGroup, this.onCaughtHotdog, null, this);
    }

    setupControls(): void {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    manageMovement(): void {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.setFlipX(false);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            this.player.setFlipX(true);
        }
        else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.canJump) {
            this.canJump = false;
            this.player.setVelocityY(-400);
        }
    }
}