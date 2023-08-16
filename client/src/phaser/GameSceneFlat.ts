import Phaser from 'phaser';
import { createPlayerAnims} from './anims/CreateAnims';
import Player from './characters/Player';
import './characters/Player'; //as typing

class GameSceneFlat extends Phaser.Scene {
    private player1!: Player;

    constructor(){
        super('GameSceneFlat')
    }

    preload(){
        this.load.image('tiles', '/tiles/groundtiles.png')
        this.load.tilemapTiledJSON('map10by10', '/maps/lr10by10.json')

        this.load.atlas('hs-cyan','/characters/hscyan.png', '/characters/hscyan.json')
    }

    create(){
        createPlayerAnims(this.anims)
        const map = this.make.tilemap({key: 'map10by10'})
        const tileset = map.addTilesetImage('Pixelarium', 'tiles')

        const ground = map.createLayer('ground', tileset as Phaser.Tilemaps.Tileset,
        32, 32
        )
        ground.scale = 3

        // the y-origin of the sprite is at its body's center
        // the x-origin is left of the sprite's body (so we need to shift by 32)
        // center of 1 tile of 16px and scale of 3 is 16/2 * 3 = 24
        // moving 1 tile is 16px * 3 = 48px
        this.player1 = this.add.player(
            32+(8*3)+(16*3),48, 'hs-cyan', 'tile000.png', 'player1')
        this.player1.scale = 3

        
    }



}

export default GameSceneFlat