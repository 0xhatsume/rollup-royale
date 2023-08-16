import Phaser from 'phaser';
import { createPlayerAnims} from './anims/CreateAnims';
import Player from './characters/Player';
import './characters/Player'; //as typing
import { GridControls } from './movement/GridControls';

class GameSceneFlat extends Phaser.Scene {
    private player1!: Player
    private gridControls!: GridControls
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private scalefactor : number = 3
    static readonly SCALEFACTOR = 3;
    static readonly TILE_SIZE = 16;

    constructor(){
        super('GameSceneFlat')
        this.scalefactor = GameSceneFlat.SCALEFACTOR
    }

    preload(){
        this.load.image('tiles', '/tiles/groundtiles.png')
        this.load.tilemapTiledJSON('map10by10', '/maps/lr10by10.json')

        this.load.atlas('hs-cyan','/characters/hscyan.png', '/characters/hscyan.json')
        this.cursors= this.input.keyboard.createCursorKeys()
    }

    create(){
        createPlayerAnims(this.anims)
        const map = this.make.tilemap({key: 'map10by10'})
        const tileset = map.addTilesetImage('Pixelarium', 'tiles')

        const ground = map.createLayer('ground', tileset as Phaser.Tilemaps.Tileset,
        GameSceneFlat.TILE_SIZE*this.scalefactor, GameSceneFlat.TILE_SIZE*this.scalefactor
        )
        ground.scale = this.scalefactor

        this.player1 = this.add.player(
            9,0, 'hs-cyan', 'tile000.png', 'player1')
        this.player1.scale = this.scalefactor
        
        this.gridControls = new GridControls(this.player1)
        console.log(Phaser.Math.Vector2.DOWN)
    }

    update(t:number, dt:number){
        this.gridControls.update(this.cursors)
    }

}

export default GameSceneFlat