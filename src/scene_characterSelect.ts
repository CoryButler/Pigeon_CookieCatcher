import "phaser";

export class SceneCharacterSelect extends Phaser.Scene {
    constructor() {
        super({
            key: "SceneCharacterSelect"
        });
    }

    preload(): void {
        this.load.image("bg", "assets/title_bg.png");
        this.load.image("duckling_characterSelect", "assets/duckling_characterSelect.png");
        this.load.image("pigeon_characterSelect", "assets/pigeon_characterSelect.png");
    }

    create(): void {
        this.disableContextMenu();
        this.addBackground();
        this.addTitle();
        this.addInstructions();
        this.addCharacter(
            +this.game.config.width * 0.33,
            +this.game.config.height * 0.65,
            "pigeon"
        );
        this.addCharacter(
            +this.game.config.width * 0.66,
            +this.game.config.height * 0.65,
            "duckling"
        );
    }

    disableContextMenu(): void {
        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); } 
    }

    addBackground(): void {
        this.add.image(0, 0, "bg").setOrigin(0);
    }

    addTitle(): void {
        this.add.text(
            +this.game.config.width / 2,
            +this.game.config.height * 0.15,
            `Catch the\nCookies!`,
            { font: "90px Courier, Monospace Bold", fill: "#000000", align: "center" })
            .setOrigin(0.5);
    }

    addInstructions(): void {
        this.add.text(
            +this.game.config.width / 2,
            +this.game.config.height * 0.7,
            `Select a character.`,
            { font: "32px Courier, Monospace Bold", fill: "#FBFBAC" })
            .setOrigin(0.5);
    }

    addCharacter(x: number, y: number, key: string): void {
        const character = this.add.image(x, y, key + "_characterSelect").setOrigin(0.5, 1);
        character.setInteractive();
        character.on("pointerdown", () => {
            character.setTint(0x00FF00);
            this.showTutorial(key);
        });
        character.on("pointerover", () => {
            character.setTint(0x00FF00);
        });
        character.on("pointerout", () => {
            character.setTint(0xFFFFFF);
        });
    }

    showTutorial(characterKey: string): void {
        this.scene.start("SceneTutorial", { characterKey: characterKey });
    }
}