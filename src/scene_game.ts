import "phaser";
import { Cookie } from "./cookie";
import { Hotdog } from "./hotdog";

export class SceneGame extends Phaser.Scene {
    characterKey: string;
    goodCookieKey: string;
    badCookieKey: string;
    goodCookiesCaught: number;
    badCookiesCaught: number;
    goodCookiesDropped: number;
    maxErrors: number;
    lastTimeTick: number;
    emitSpeed: number;
    emitSpeedLimit: number;
    emitSpeedUp: number;
    info: Phaser.GameObjects.Text;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    ground: Phaser.Physics.Arcade.StaticGroup;
    goodCookieGroup: Phaser.Physics.Arcade.Group;
    badCookieGroup: Phaser.Physics.Arcade.Group;
    hotdogGroup: Phaser.Physics.Arcade.Group;
    player: Phaser.Physics.Arcade.Image;
    canJump: boolean;
    isOnScreenLeftDown: boolean;
    isOnScreenRightDown: boolean;
    isOnScreenUpDown: boolean;

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
        this.canJump = false;
        this.isOnScreenLeftDown = false;
        this.isOnScreenRightDown = false;
        this.isOnScreenUpDown = false;
    }

    preload(): void {
        this.load.image("btnLeftUp", "assets/btnLeftUp.png");
        this.load.image("btnRightUp", "assets/btnRightUp.png");
        this.load.image("btnUpUp", "assets/btnUpUp.png");
        this.load.image("btnLeftDown", "assets/btnLeftDown.png");
        this.load.image("btnRightDown", "assets/btnRightDown.png");
        this.load.image("btnUpDown", "assets/btnUpDown.png");
        this.load.image("hud", "assets/hud.png");
        this.load.image("ground", "assets/ground.png");
        this.load.image("cookie", "assets/cookie.png");
        this.load.image("cookie_nuts", "assets/cookie_nuts.png");
        this.load.image("hotdog", "assets/hotdog.png");
        this.load.image("duckling", "assets/duckling_player.png");
        this.load.image("pigeon", "assets/pigeon_player.png");
    }

    create(): void {
        this.setupEmissionGroups();
        this.addPlayer();
        this.setupPlayerColliders();
        this.addGround();
        this.setupGroundColliders();
        this.addHud();
        this.setupHud();
        this.updateHud();
        this.setupKeyboardControls();
        if (!this.game.device.os.desktop) {
            this.setupOnScreenControls();
        }
    }

    update(time: number): void {
        this.manageEmissions(time);
        this.manageMovement();
    }

    setupEmissionGroups(): void {
        this.goodCookieGroup = this.physics.add.group();
        this.badCookieGroup = this.physics.add.group();
        this.hotdogGroup = this.physics.add.group();
    }

    manageEmissions(time): void {
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

        this.player.setGravityY(1600);
        this.player.setCollideWorldBounds(true);
    }

    setupPlayerColliders(): void {
        this.physics.add.overlap(this.player, this.badCookieGroup, this.onCaughtBadCookie, null, this);
        this.physics.add.overlap(this.player, this.goodCookieGroup, this.onCaughtGoodCookie, null, this);
        this.physics.add.overlap(this.player, this.hotdogGroup, this.onCaughtHotdog, null, this);
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

    addGround(): void {
        this.ground = this.physics.add.staticGroup({
            key: "ground",
            repeat: 9,
            setXY: { x: 32, y: +this.game.config.height - 53, stepX: 64 }
        });
    }

    setupGroundColliders(): void {
        this.physics.add.collider(this.ground, this.goodCookieGroup, this.onDroppedGoodCookie, null, this);
        this.physics.add.collider(this.ground, this.badCookieGroup, this.onDroppedBadCookie, null, this);
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
    
    enableJump(): void {
        this.canJump = true;
    }

    addHud(): void {
        this.physics.add.staticGroup({
            key: "hud",
            repeat: 9,
            setXY: { x: 32, y: 32, stepX: 64 }
        });
    }

    setupHud(): void {
        this.info = this.add.text(32, 32, ``, { font: "32px Courier, Monospace Bold", fill: "#FBFBAC" });
        this.info.setOrigin(0, 0.5);
    }

    updateHud(): void {
        const health = this.maxErrors - this.badCookiesCaught - this.goodCookiesDropped;
        this.info.text = `Health: ${health}   Cookies: ${this.goodCookiesCaught}`;

        if (health <= 0) {
            this.showResults();
        }
    }

    showResults(): void {
        this.scene.start("SceneResults", { characterKey: this.characterKey, goodCookieKey: this.goodCookieKey, goodCookiesCaught: this.goodCookiesCaught });
    }

    setupKeyboardControls(): void {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    setupOnScreenControls(): void {
        this.input.addPointer(1);

        const left = this.add.image(50, +this.game.config.height - 50, "btnLeftUp").setName("left").setInteractive();
        const right = this.add.image(140, +this.game.config.height - 50, "btnRightUp").setName("right").setInteractive();
        const up = this.add.image(+this.game.config.width - 50, +this.game.config.height - 50, "btnUpUp").setName("up").setInteractive();

        this.input.on("gameobjectover", (pointer, gameObject) => {
            if(gameObject.name === "left") {
                this.isOnScreenLeftDown = true;
                left.setTexture("btnLeftDown");
            }
            if(gameObject.name === "right") {
                this.isOnScreenRightDown = true;
                right.setTexture("btnRightDown");
            }
            if(gameObject.name === "up") {
                this.isOnScreenUpDown = true;
                up.setTexture("btnUpDown");
            }
        });

        this.input.on("gameobjectout", (pointer, gameObject) => {
            if(gameObject.name === "left") {
                this.isOnScreenLeftDown = false;
                left.setTexture("btnLeftUp");
            }
            if(gameObject.name === "right") {
                this.isOnScreenRightDown = false;
                right.setTexture("btnRightUp");
            }
            if(gameObject.name === "up") {
                this.isOnScreenUpDown = false;
                up.setTexture("btnUpUp");
            }
        });
    }

    manageMovement(): void {
        if (this.cursors.left.isDown || this.isOnScreenLeftDown) {
            this.player.setVelocityX(-200);
            this.player.setFlipX(false);
        }
        else if (this.cursors.right.isDown || this.isOnScreenRightDown) {
            this.player.setVelocityX(200);
            this.player.setFlipX(true);
        }
        else {
            this.player.setVelocityX(0);
        }

        if ((this.cursors.up.isDown || this.isOnScreenUpDown) && this.canJump) {
            this.canJump = false;
            this.player.setVelocityY(-800);
        }
    }
}