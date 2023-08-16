import Phaser from 'phaser';

const createPlayerAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: 'player1-idle-down',
        frames: anims.generateFrameNames(
            'hs-cyan', {prefix: 'tile00', start: 0, end: 4, suffix: '.png'}),
        repeat: -1,
        frameRate: 8
    });

};

export {
    createPlayerAnims
}