// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Royale is Ownable {

    uint8 public constant MAX_PLAYERS = 4;
    uint8 public constant MAP_WIDTH = 10;
    uint8 public constant MAP_HEIGHT = 10;
    uint8 public constant TILE_COUNT = MAP_WIDTH * MAP_HEIGHT;
    uint16 public constant STARTING_FT = 100;
    address public burnerWallet;

    event GameStarted(uint256 _roomId);

    constructor(address _burnerWallet) {
        burnerWallet = _burnerWallet;
    }

    //array of all game rooms
    GameRoom[] public games;
    bool public worldPaused = false;
    uint8 public houseFee = 2;
    mapping(address => uint256) public playerInGame;
    enum Dir { DOWN, LEFT, UP, RIGHT } //using numpad 0, 1, 2, 3

    struct GameInfo {
        uint8 playersCount;
        uint8 itemCount;
        uint256 minStake;
        bool hasStarted;
        bool hasEnded;
        bool gamePaused;
        bool gameAbandoned;
    }

    struct Tile {
        uint8 occupantId; // 1 - 4 is player, > 4 is item, 0 is empty
        bool isWall;
    }

    struct GameRoom {
        GameInfo info;
        Tile[TILE_COUNT] board;
        address[MAX_PLAYERS] playerIds;
        uint16[MAX_PLAYERS] playerFTs;
        uint8[MAX_PLAYERS*2-1] positions;
        bool[MAX_PLAYERS] playerAlive;
        bool[MAX_PLAYERS] playerReady;
        bool[MAX_PLAYERS] playerPauseVote;
        uint256[MAX_PLAYERS] playerLastMoveBlock;
    }

    /*
    Board Layout
    00 01 02 03 04 05 06 07 08 09
    10 11 12 13 14 15 16 17 18 19
    20 21 22 23 24 25 26 27 28 29
    30 31 32 33 34 35 36 37 38 39
    40 41 42 43 44 45 46 47 48 49
    50 51 52 53 54 55 56 57 58 59
    60 61 62 63 64 65 66 67 68 69
    70 71 72 73 74 75 76 77 78 79
    80 81 82 83 84 85 86 87 88 89
    90 91 92 93 94 95 96 97 98 99
    */

    /* Modifiers */
    /*
    E1 - World is paused
    E2 - Insufficient funds for transaction
    E3 - Player is already in a game
    E4 - Game player count full
    E5 - Game has already started
    E6 - Game has already ended
    E7 - Game has been abandoned
    E8 - Game has not started
    E9 - Not Enough Players in Game
    E10 - Not all players are ready
    E11 - Player not in this game
    E12 - Cannot find player's id in game
    E13 - Player is dead
    E14 - Move is Out Of Bounds
    E15 - Move is Obstructed
    */

    modifier validAddress(address _addr) {
        require(_addr != address(0), "Not valid address");
        _;
    }

    modifier worldFunctioning() {
        require(!worldPaused, "E1");
        _;
    }

    modifier enoughFunds(uint256 _fee, uint256 minStake) {
        require(msg.value >= minStake, "E2");
        _;
    }

    modifier playerNotInGame() {
        require(playerInGame[msg.sender] == 0, "E3");
        _;
    }

    modifier joinable(uint256 _roomId) {
        require(games[_roomId].info.playersCount > 0 && 
            games[_roomId].info.playersCount < MAX_PLAYERS, "E4");
        require(games[_roomId].info.hasStarted == false, "E5");
        require(games[_roomId].info.hasEnded == false, "E6");
        require(games[_roomId].info.gameAbandoned == false, "E7");
        _;
    }

    modifier gameNotStarted(uint256 _roomId) {
        require(games[_roomId].info.hasStarted == false, "E5");
        _;
    }

    modifier gameStarted(uint256 _roomId) {
        require(games[_roomId].info.hasStarted == true, "E8");
        _;
    }

    modifier enoughPlayers(uint256 _roomId) {
        require(games[_roomId].info.playersCount > 1, "E9");
        _;
    }

    modifier allPlayersReady(uint256 _roomId) {
        require(_allPlayersAreReady(_roomId), "E10");
        _;
    }

    modifier playerIsInGame(uint256 _roomId) {
        require(playerInGame[msg.sender] == _roomId, "E11");
        _;
    }

    modifier playerIsAlive(uint256 _roomId){
        require(_getCallingPlayerId(_roomId)>0, "E12");
        require(games[_roomId].playerAlive[_getCallingPlayerId(_roomId)-1] == true, "E13");
        _;
    }

    // getters
    function _allPlayersAreReady(uint256 _roomId) internal view returns (bool) {
        for (uint8 i = 0; i < games[_roomId].info.playersCount; i++) {
            if (games[_roomId].playerReady[i] == false) {
                return false;
            }
        }
        return true;
    }

    function _getCallingPlayerId(uint256 _roomId) internal view returns (uint8){
        for (uint8 i = 0; i < games[_roomId].playerIds.length; i++) {
            if (games[_roomId].playerIds[i] == msg.sender) {
                return i+1;
            }
        }
        return 0;
    }
    
    // setters

    // internal utils

    function _getRandomTile(uint256 _roomId, uint256 _seed) internal view returns (uint8) {
        // get random number
        uint8 random = uint8(
                uint256(keccak256(
                    abi.encodePacked(
                        block.timestamp, 
                        block.difficulty,
                        _seed
                        )
                        )) % TILE_COUNT
                    );

        // if tile is not a wall
        if (games[_roomId].board[random].isWall == false) {
            // return tile
            return random;
        } else {
            // else get another random tile
            return _getRandomTile(_roomId, _seed+8);
        }
    }

    function _getUnoccupiedTile(uint256 _roomId, uint256 _seed) internal view returns (uint8) {
        // get random tile
        uint8 random = _getRandomTile(_roomId, _seed);
        // if tile is unoccupied
        if (games[_roomId].board[random].occupantId == 0) {
            // return tile
            return random;
        } else {
            // else get another random tile
            return _getUnoccupiedTile(_roomId, _seed+8);
        }
    }

    function _spawnItems(uint256 _roomId) internal returns (bool) {
        // get item count in game
        uint8 itemCount = games[_roomId].info.itemCount;
        // get number of players alive
        uint8 playersAlive = games[_roomId].info.playersCount;
        // get number of items to spawn (1 less than number of players on board)
        uint8 itemsToSpawn = playersAlive - itemCount - 1;
        // correct if itemsToSpawn is negative
        itemsToSpawn = itemsToSpawn > 0 ? itemsToSpawn : 0;

        // for each item position in positions, look for empty item position to spawn item
        for (uint8 i = 4; i < MAX_PLAYERS*2-1; i++) {
            // if position is not max value
            if (games[_roomId].positions[i] == type(uint8).max) {
                // get random tile
                uint8 random = _getUnoccupiedTile(_roomId, i);
                // set tile to new item id
                games[_roomId].board[random].occupantId = i;
                // set position to tile index
                games[_roomId].positions[i] = random;
                
                // increment item count
                games[_roomId].info.itemCount++;
                itemsToSpawn--;
                // if itemsToSpawn hits 0, break loop
                if (itemsToSpawn == 0) {
                    break;
                }
            }
        }
        return true;
    }

    function _getIndexDiffFromDirection(Dir _direction) internal view returns (int8){
        if (_direction == Dir.Up) {
            return MAP_WIDTH;
        } else if (_direction == Dir.Down) {
            return MAP_WIDTH * -1;
        } else if (_direction == Dir.Left) {
            return -1;
        } else if (_direction == Dir.Right) {
            return 1;
        } else {
            return 0;
        }
    }

    function _getItemFtDiff(uint8 _seed) internal view returns (int8){
        // get random number between -50 to 50
        int8 random = int8(
                uint256(keccak256(
                    abi.encodePacked(
                        block.timestamp, 
                        block.difficulty,
                        _seed
                        )
                        )) % 100
                    ) - 50;
        return random;
    }

    function _updatePlayerFT(uint256 _roomId, uint8 _tile, uint8 _playerId, int8 _ftDiff) internal returns (uint16) {
        // get player ft
        uint16 playerFT = games[_roomId].playerFTs[_playerId-1];

        // get final ft
        int16 finalFT = int16(playerFT) + _ftDiff;
        finalFT = finalFT < 0 ? 0 : finalFT; // if final ft is less than 0, set to 0

        // set player ft
        games[_roomId].playerFTs[_playerId-1] = uint16(finalFT);

        // if finalFT is 0, player is dead
        if (finalFT == 0) {
            games[_roomId].playerAlive[_playerId-1] = false;
            games[_roomId].info.playersCount--;
            games[_roomId].board[_tile].occupantId = 0; // remove player from tile
        }

        return uint16(finalFT);
        
    }

    // public functions
    function createGame(uint256 _minStake) external payable 
        worldFunctioning 
        enoughFunds(msg.value, _minStake) 
        playerNotInGame
    {
        GameRoom memory game;
        game.info.playersCount = 1;
        game.info.minStake = _minStake;
        game.playerIds[0] = msg.sender;
        game.playerFTs[0] = STARTING_FT;
        games.push(game);

        uint8 roomId = uint8(games.length - 1);

        //initialize all postions to max
        for (uint8 i = 0; i < MAX_PLAYERS*2-1; i++) {
            games[roomId].positions[i] = type(uint8).max; // max value means not on board
        }

        // set player in game
        playerInGame[msg.sender] = roomId; // assume game length always game room id

        // set player at top left corner of board
        uint8 x = MAP_WIDTH / 3;
        uint8 y = MAP_HEIGHT / 3;
        uint8 spawnTile = (x - 1) + ((y-1) * MAP_WIDTH);
        // set player spawn
        games[roomId].board[spawnTile].occupantId = 1;
        games[roomId].positions[0] = spawnTile;
    }

    function joinGame(uint256 _roomId) external payable 
        worldFunctioning 
        enoughFunds(msg.value, games[_roomId].info.minStake) 
        playerNotInGame
        joinable(_roomId)
    {
        games[_roomId].info.playersCount++; // increment player count
        uint8 playerId = games[_roomId].info.playersCount; // get player id
        games[_roomId].playerIds[playerId-1] = msg.sender; // set player id
        games[_roomId].playerFTs[playerId-1] = STARTING_FT; // set player FT

        playerInGame[msg.sender] = _roomId; // set player in game

        uint8 x;
        uint8 y;
        uint8 spawnTile;

        // if player is 2 set player at bottom right corner of board
        if (playerId == 1) {
            x = MAP_WIDTH - (MAP_WIDTH / 3);
            y = MAP_HEIGHT - (MAP_HEIGHT / 3);
            spawnTile = (x - 1) + ((y-1) * MAP_WIDTH);
        }

        // if player is 3 set player at bottom left corner of board
        if (playerId == 2) {
            x = MAP_WIDTH / 3;
            y = MAP_HEIGHT - (MAP_HEIGHT / 3);
            spawnTile = (x - 1) + ((y-1) * MAP_WIDTH);
        }

        // if player is 4 set player at top right corner of board
        if (playerId == 3) {
            x = MAP_WIDTH - (MAP_WIDTH / 3);
            y = MAP_HEIGHT / 3;
            spawnTile = (x - 1) + ((y-1) * MAP_WIDTH);
        }

        // set player spawn
        games[_roomId].board[spawnTile].occupantId = playerId;
        games[_roomId].positions[0] = spawnTile;
    }

    function setReady(uint256 _roomId) external 
        worldFunctioning 
        playerIsInGame
    {
        // get player id
        uint8 playerId = _getCallingPlayerId(_roomId);
        require(playerId>0, "E11");

        // set player ready
        games[_roomId].playerReady[playerId-1] = true;
    }

    function setNotReady(uint256 _roomId) external 
        worldFunctioning 
        playerIsInGame
    {
        // get player id
        uint8 playerId = _getCallingPlayerId(_roomId);
        require(playerId>0, "E11");
        // set player not ready
        games[_roomId].playerReady[playerId-1] = false;
    }

    function startGame(uint256 _roomId) external payable 
        worldFunctioning 
        enoughPlayers(_roomId)
        allPlayersReady(_roomId)
        gameNotStarted(_roomId)
    {          
        // spawn items
        _spawnItems(_roomId);

        emit GameStarted(_roomId);
    }

    function movePlayer(uint256 _roomId, Dir _direction) external 
        worldFunctioning 
        gameStarted(_roomId)
        playerIsInGame(_roomId)
        playerIsAlive(_roomId)
    {   
        // get player id
        uint8 playerId = _getCallingPlayerId(_roomId); //already checked by playerIsInGame
        
        // get player position
        uint8 playerPosition = games[_roomId].positions[playerId-1];

        // get position difference from direction
        int8 indexDiff = _getIndexDiffFromDirection(_direction);

        // get new position
        uint8 newPosition = uint8(int8(playerPosition) + indexDiff);

        // revert if new position is out of bounds
        require(newPosition>=0 && newPosition <TILE_COUNT, "E14");

        // if playerPosition is at left edge of board and direction is left, revert
        if (playerPosition % MAP_WIDTH == 0 && _direction == Dir.Left) {
            require(newPosition % MAP_WIDTH != MAP_WIDTH - 1, "E14");
        }
        // if playerPosition is at right edge of board and direction is right, revert
        if (playerPosition % MAP_WIDTH == MAP_WIDTH - 1 && _direction == Dir.Right) {
            require(newPosition % MAP_WIDTH != 0, "E14");
        }

        // revert if new position is a wall
        require(games[_roomId].board[newPosition].isWall == false, "E15");

        // if new position is not occupied
        if (games[_roomId].board[newPosition].occupantId == 0) {
            // set new position to player id
            games[_roomId].board[newPosition].occupantId = playerId;
            // set old position to 0
            games[_roomId].board[playerPosition].occupantId = 0;
            // set player position to new position
            games[_roomId].positions[playerId-1] = newPosition;

        } else if (games[_roomId].board[newPosition].occupantId > 3){ 
            // if new position is occupied by item
            
                // get item id
                uint8 itemId = games[_roomId].board[newPosition].occupantId;
                // get item ft
                int8 itemFT = _getItemFtDiff(newPosition);
                // update player ft
                uint16 playerNewFT =_updatePlayerFT(_roomId, newPosition, playerId, itemFT);

                // if playerNewFT is 0, set Tile occupantId to 0 else set to player id
                games[_roomId].board[newPosition].occupantId = playerNewFT == 0 ? 0 : playerId;

                // reduce item count
                games[_roomId].itemCounts[itemId]--;

        } else if (games[_roomId].board[newPosition].occupantId <= 3) { 
            // if new position is occupied by player

                // get player id of occupant
                uint8 occupantId = games[_roomId].board[newPosition].occupantId;
                // get battle results
                (uint8 winnerId, uint16 winnerFT, uint16 loserFT) = _getBattleResults(
                    _roomId, playerId, occupantId);

        }
        

    }

}
