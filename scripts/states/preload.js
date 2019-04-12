import configManager from '../config';
import Base from './base';

/**
 * Preload state
 */
class Preload extends Base
{

    /**
     * Initialize
     * Part of the Phaser LifeCycle
     * https://phaser.io/docs/2.6.2/Phaser.State.html#init
     */
    init()
    {
        this.config = configManager.getConfig();
        this.game.add.text(0, this.game.height, "1.0", { font: `20px ${ this.config.fonts.primary }` });
        this.game.add.text(0, this.game.height, "First Voices", { font: `20px ${ this.config.fonts.secondary }` });
    }

    /**
     * Preload
     * Part of the Phaser LifeCycle
     * https://phaser.io/docs/2.6.2/Phaser.State.html#preload
     */
    preload()
    {
        this.fadeIn();
        super.preload();

        const configImages = this.config.images;

        this.load.image('fullscreen', configImages.fullscreen);
        this.load.image('unfullscreen', configImages.unfullscreen);
        this.load.image('mute', configImages.mute);
        this.load.image('unmute', configImages.unmute);
        this.load.image('quiz-logo', configImages.quizGuy);
        this.load.image('triangle', configImages.triangle);
        this.load.image('progress-dot', configImages.progressDot);
        this.load.image('progress-dot-correct', configImages.progressDotCorrect);
        this.load.image('progress-dot-incorrect', configImages.progressDotIncorrect);
        this.load.image('play-audio', configImages.playAudio);
        this.load.image('play-audio-overlay', configImages.playAudioOverlay);
        this.load.image('spinner', configImages.spinner);
        this.load.audio('click', this.config.sounds.click);

        this.load.spritesheet('rain', configImages.rain, 15, 15);
    }

    /**
     * Create
     * Part of the Phaser LifeCycle
     * https://phaser.io/docs/2.6.2/Phaser.State.html#create
     */
    create()
    {
        this.game.state.start("GameTitle");
    }
}

export default Preload;