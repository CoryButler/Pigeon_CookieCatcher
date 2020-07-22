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
        this.goodCookieKey = params.goodCookieKey;
        this.goodCookiesCaught = params.goodCookiesCaught;
    }

    preload(): void {
        this.load.image("restartButton", "assets/restartButton.png");
        this.load.image("cookie", "assets/cookie.png");
        this.load.image("cookie_nuts", "assets/cookie_nuts.png");
        this.load.image("duckling_results", "assets/duckling_results.png");
        this.load.image("pigeon_results", "assets/pigeon_results.png");
    }

    create(): void {
        this.addText();
        this.addCharacter();
        this.addCookies();
        this.addRestartButton();
    }

    addText(): void {
        this.add.text(
            +this.game.config.width / 2, 64, `Cookies Caught: ${this.goodCookiesCaught}`,
            { font: "46px Courier, Monospace Bold", fill: "#FBFBAC" })
            .setOrigin(0.5, 0.5);
    }

    addCookies(): void {
        var circle = new Phaser.Geom.Circle(+this.game.config.width / 2, +this.game.config.height / 2, 260);

        this.cookieGroup = this.physics.add.staticGroup({
            key: this.goodCookieKey,
            frameQuantity: this.goodCookiesCaught
        });
    
        Phaser.Actions.PlaceOnCircle(this.cookieGroup.getChildren(), circle);
    }

    addCharacter(): void {
        this.player = this.physics.add.image(
            +this.game.config.width / 2,
            +this.game.config.height / 2,
            this.characterKey + "_results"
        );
    }

    addRestartButton(): void {
        const restartButton = this.physics.add.image(
            +this.game.config.width / 2,
            +this.game.config.height * 0.7,
            "restartButton"
        );
        restartButton.setInteractive();
        restartButton.on("pointerdown", () => {
            restartButton.setTint(0x00FF00);
        });
        restartButton.on("pointerup", () => {
            this.restartGame();
        });
        restartButton.on("pointerover", () => {
            restartButton.setTint(0x00FF00);
        });
        restartButton.on("pointerout", () => {
            restartButton.setTint(0xFFFFFF);
        });
    }

    restartGame(): void {
        this.scene.start("SceneCharacterSelect");
    }
}