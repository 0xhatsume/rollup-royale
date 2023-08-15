import React, {useEffect, useRef} from 'react';
import Phaser from 'phaser';
import GameSceneFlat from '../phaser/GameSceneFlat';
import usePhaserGame from '../phaser/usePhaserGame';

const GameRoom = () => {
  
  const gameConfig = {
      type: Phaser.AUTO,
      parent: "phaser-div",
      height: 400,
      scale:{
          
          mode: Phaser.Scale.ScaleModes.RESIZE,
          autoCenter: Phaser.Scale.Center.CENTER_BOTH,
          
      },
      physics:{
          default: 'arcade',
          arcade:{ gravity: { y: 0 } }
      },
      scene: [GameSceneFlat]
  }
  usePhaserGame(gameConfig);

  return (
    <div className="w-full md:w-[768px] mx-auto
            flex flex-col
            p-0 h-screen
            border border-green-400
        "
      id="phaser-div"
      >
          
      </div>
  )
}

export default GameRoom