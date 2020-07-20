import "phaser";

export class SceneTutorial extends Phaser.Scene {
    characterKey: string;
    badCookieKey: string;
    goodCookieKey: string;
    player: Phaser.Physics.Arcade.Image;

    constructor() {
        super({
            key: "SceneTutorial"
        });
    }

    init(params: any) {
        this.characterKey = params.characterKey;
        this.goodCookieKey = this.characterKey === "pigeon" ? "cookie_nuts" : "cookie";
        this.badCookieKey = this.characterKey === "pigeon" ? "cookie" : "cookie_nuts";
    }

    preload(): void {
        this.load.image("cookie", "assets/cookie.png");
        this.load.image("cookie_nuts", "assets/cookie_nuts.png");
        this.load.image("hotdog", "assets/hotdog.png");
        this.load.image("duckling", "assets/duckling_player.png");
        this.load.image("pigeon", "assets/pigeon_player.png");
    }

    create(): void {
        this.addText();
        this.addIcons();
        this.addPlayer();
    }

    addText(): void {
        this.add.text(
            96, 64, `catch these >`,
            { font: "32px Courier, Monospace Bold", fill: "#FBFBAC" })
            .setOrigin(0, 0.5);
        this.add.text(
            96, 160, `avoid these >`,
            { font: "32px Courier, Monospace Bold", fill: "#FBFBAC" })
            .setOrigin(0, 0.5);
        this.add.text(
            96, 256, `restore health >`,
            { font: "32px Courier, Monospace Bold", fill: "#FBFBAC" })
            .setOrigin(0, 0.5);
        this.add.text(
            +this.game.config.width / 2, +this.game.config.height * 0.66,
            `Click the\n${this.characterKey}\nto start.`,
            { font: "32px Courier, Monospace Bold", fill: "#FBFBAC" })
            .setOrigin(0.5, 0.5);
        this.add.text(
            +this.game.config.width / 2, +this.game.config.height * 0.9,
            `Use LEFT and RIGHT to move.\nUse UP to jump.`,
            { font: "32px Courier, Monospace Bold", fill: "#FBFBAC" })
            .setOrigin(0.5, 0.5);
    }

    addIcons(): void {
        this.add.image(+this.game.config.width - 128, 64, this.goodCookieKey).setAngle(Phaser.Math.Between(0, 360));
        this.add.image(+this.game.config.width - 128, 160, this.badCookieKey).setAngle(Phaser.Math.Between(0, 360));
        this.add.image(+this.game.config.width - 128, 256, "hotdog");
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
        this.scene.start("SceneGame", { characterKey: characterKey });
    }
}