import React, {useEffect, useRef} from 'react';
import Phaser from 'phaser';
import GameSceneFlat from '../phaser/GameSceneFlat';
import usePhaserGame from '../phaser/usePhaserGame';

const GameRoom = () => {
  
  const gameConfig = {
      type: Phaser.AUTO,
      parent: "phaser-div",
      backgroundColor: '#34222E',
      render: {
        antialias: false,
      },
      scale:{
          //width: 600,
          //height: 600,
          mode:  Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
          autoCenter: Phaser.Scale.Center.CENTER_BOTH,
          width: '100%',
          height: '100%',
          zoom: 3
          
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
            items-center
        "
      >
          <div id="phaser-div" className="
          App
          h-[60vh] aspect-square mt-8
          border-2 border-blue-500 rounded-lg
          overflow-hidden
          ">

          </div>
      </div>
  )
}

export default GameRoom