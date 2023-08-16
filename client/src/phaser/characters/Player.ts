import Phaser from 'phaser';

declare global
{
	namespace Phaser.GameObjects
	{
		interface GameObjectFactory
		{
			player(x: number, y: number, 
                texture: string, frame: string | number,
                entity:string): Player
		}
	}
}

enum Direction
    {
        DOWN, LEFT, UP, RIGHT  //using numpad 0, 1, 2, 3
    }


export default class Player extends Phaser.Physics.Arcade.Sprite {

    private direction: Direction = Direction.DOWN;

    constructor(scene: Phaser.Scene, x: number, y: number, 
        texture: string, frame: string | number, entity: string) {
        super(scene, x, y, texture, frame);
        // scene.add.existing(this);
        // scene.physics.add.existing(this);
        this.anims.play('player1-idle-down');   
    }

    // preUpdate(t:number, dt:number) {
    //     super.preUpdate(t, dt);
    // }
}

Phaser.GameObjects.GameObjectFactory.register('player', 
    function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, 
        texture: string, frame: string | number,  entity: string) {
	
        var sprite = new Player(this.scene, x, y, texture, frame, entity)

        this.displayList.add(sprite)
        this.updateList.add(sprite)

        this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

        // sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8)

        return sprite
})