import "phaser";

export class SceneTutorial extends Phaser.Scene {
    characterKey: string;

    constructor() {
        super({
            key: "SceneTutorial"
        });
    }

    init(params: any) {
        this.characterKey = params.characterKey;
    }

    preload(): void {
        this.load.image("duckling_tutorial", "assets/duckling_tutorial.png");
        this.load.image("pigeon_tutorial", "assets/pigeon_tutorial.png");
        this.load.image("startButton", "assets/startButton.png");
    }

    create(): void {
        this.addTutorialImage();
        this.addTutorialText();
        this.addStartButton();
    }

    addTutorialImage(): void {
        this.physics.add.image(
            +this.game.config.width / 2,
            32,
            this.characterKey + "_tutorial"
        ).setOrigin(0.5, 0);
    }

    addTutorialText(): void {
        this.add.text(
            +this.game.config.width / 2, +this.game.config.height * 0.7,
            `Use LEFT and RIGHT to move.\nUse UP to jump.`,
            { font: "32px Courier, Monospace Bold", fill: "#FBFBAC", align: "center" })
            .setOrigin(0.5, 0.5);
    }

    addStartButton(): void {
        const startButton = this.add.image(+this.game.config.width / 2, +this.game.config.height - 64, "startButton").setOrigin(0.5, 1);
        startButton.setInteractive();
        startButton.on("pointerdown", () => {
            startButton.setTint(0x00FF00);
            this.startGame();
        });
        startButton.on("pointerover", () => {
            startButton.setTint(0x00FF00);
        });
        startButton.on("pointerout", () => {
            startButton.setTint(0xFFFFFF);
        });
    }

    startGame(): void {
        this.scene.start("SceneGame", { characterKey: this.characterKey });
    }
}