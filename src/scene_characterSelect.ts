import "phaser";

export class SceneCharacterSelect extends Phaser.Scene {
    constructor() {
        super({
            key: "SceneCharacterSelect"
        });
    }

    preload(): void {
        this.load.image("duckling", "assets/duckling_player.png");
        this.load.image("pigeon", "assets/pigeon_player.png");
    }

    create(): void {
        this.addTitle();
        this.addInstructions();
        this.addCharacter(
            +this.game.config.width * 0.33,
            +this.game.config.height / 2,
            "pigeon"
        );
        this.addCharacter(
            +this.game.config.width * 0.66,
            +this.game.config.height / 2,
            "duckling"
        );
    }

    addTitle(): void {
        this.add.text(
            +this.game.config.width / 2,
            +this.game.config.height * 0.2,
            `Catch the\nCookies!!`,
            { font: "64px Courier, Monospace Bold", fill: "#FBFBAC" })
            .setOrigin(0.5);
    }

    addInstructions(): void {
        this.add.text(
            +this.game.config.width / 2,
            +this.game.config.height * 0.7,
            `Select a Character`,
            { font: "32px Courier, Monospace Bold", fill: "#FBFBAC" })
            .setOrigin(0.5);
    }

    addCharacter(x: number, y: number, key: string): void {
        const character = this.add.image(x, y, key);
        character.setScale(2);

        character.setInteractive();
        character.on("pointerdown", () => {
            character.setTint(0x00FF00);
            this.startGame(key);
        });
        character.on("pointerover", () => {
            character.setTint(0x00FF00);
        });
        character.on("pointerout", () => {
            character.setTint(0xFFFFFF);
        });
    }

    startGame(characterKey: string): void {
        this.scene.start("SceneTutorial", { characterKey: characterKey });
    }
}