import "phaser";

export class SceneResults extends Phaser.Scene {
    characterKey: string;
    goodCookieKey: string;
    goodCookiesCaught: number;
    cookieGroup: Phaser.Physics.Arcade.StaticGroup;
    player: Phaser.Physics.Arcade.Image;
    tween: Phaser.Tweens.Tween;

    constructor() {
        super({
            key: "SceneResults"
        });
    }

    init(params: any) {
        this.characterKey = params.characterKey;
        this.goodCookieKey = this.characterKey === "pigeon" ? "cookie_nuts" : "cookie";
        this.goodCookiesCaught = params.goodCookiesCaught;
    }

    preload(): void {
        this.load.image("cookie", "assets/cookie.png");
        this.load.image("cookie_nuts", "assets/cookie_nuts.png");
        this.load.image("hotdog", "assets/hotdog.png");
        this.load.image("duckling", "assets/duckling_player.png");
        this.load.image("pigeon", "assets/pigeon_player.png");
    }

    create(): void {
        this.addPlayer();
        this.addIcons();
        this.addText();
    }

    addText(): void {
        this.add.text(
            +this.game.config.width / 2, 64, `Cookies Caught: ${this.goodCookiesCaught}`,
            { font: "48px Courier, Monospace Bold", fill: "#FBFBAC" })
            .setOrigin(0.5, 0.5);
        this.add.text(
            +this.game.config.width / 2, +this.game.config.height * 0.66,
            `Click the\n${this.characterKey}\nto restart.`,
            { font: "32px Courier, Monospace Bold", fill: "#FBFBAC" })
            .setOrigin(0.5, 0.5);
    }

    addIcons(): void {
        var circle = new Phaser.Geom.Circle(+this.game.config.width / 2, +this.game.config.height / 2, 260);

        this.cookieGroup = this.physics.add.staticGroup({
            key: this.goodCookieKey,
            frameQuantity: this.goodCookiesCaught
        });
    
        Phaser.Actions.PlaceOnCircle(this.cookieGroup.getChildren(), circle);
    }

    addPlayer(): void {
        this.player = this.physics.add.image(
            +this.game.config.width / 2,
            +this.game.config.height / 2,
            this.characterKey
        );
    
        this.player.setInteractive();
        this.player.on("pointerdown", () => {
            this.player.setTint(0x00FF00);
            this.startGame(this.characterKey);
        });
        this.player.on("pointerover", () => {
            this.player.setTint(0x00FF00);
        });
        this.player.on("pointerout", () => {
            this.player.setTint(0xFFFFFF);
        });
    }

    startGame(characterKey: string): void {
        this.scene.start("SceneCharacterSelect", { characterKey: characterKey });
    }
}