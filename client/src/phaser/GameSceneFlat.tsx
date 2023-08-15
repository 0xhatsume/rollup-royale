import Phaser from 'phaser';

class GameSceneFlat extends Phaser.Scene {

    constructor(){
        super('GameSceneFlat')
    }

    preload(){
        this.load.image('tiles', '/tiles/groundtiles.png')
        this.load.tilemapTiledJSON('map10by10', '/maps/lr10by10.json')
    }

    create(){
        const map = this.make.tilemap({key: 'map10by10'})
        const tileset = map.addTilesetImage('Pixelarium', 'tiles')

        const ground = map.createLayer('ground', tileset as Phaser.Tilemaps.Tileset)
        ground.scale = 3.52
    }



}

export default GameSceneFlat