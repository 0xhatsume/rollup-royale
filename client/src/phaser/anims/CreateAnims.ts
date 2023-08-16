import Phaser from 'phaser';

const createPlayerAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: 'player1-walk-down',
        frames: anims.generateFrameNames(
            'hs-cyan', {prefix: 'tile00', start: 0, end: 4, suffix: '.png'}),
        repeat: -1,
        frameRate: 8
    });

    anims.create({
        key: 'player1-walk-right',
        frames: anims.generateFrameNames(
            'hs-cyan', {prefix: 'tile0', start: 48, end: 52, suffix: '.png'}),
        repeat: -1,
        frameRate: 8
    });

    anims.create({
        key: 'player1-walk-up',
        frames: anims.generateFrameNames(
            'hs-cyan', {prefix: 'tile', start: 96, end: 100, zeroPad:3, suffix: '.png'}),
        repeat: -1,
        frameRate: 8
    });

    anims.create({
        key: 'player1-walk-left',
        frames: anims.generateFrameNames(
            'hs-cyan', {prefix: 'tile', start: 144, end: 148, zeroPad:3, suffix: '.png'}),
        repeat: -1,
        frameRate: 8
    });

    anims.create({
        key: 'player1-idle-down',
        frames: anims.generateFrameNames(
            'hs-cyan', {prefix: 'tile', start: 5, end: 23, zeroPad:3, suffix: '.png'}),
        repeat: -1,
        frameRate: 4
    });

};

export {
    createPlayerAnims
}