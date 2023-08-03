// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Royale is Ownable {

    uint8 public constant MAX_PLAYERS = 4;
    uint8 public constant MAP_WIDTH = 10;
    uint8 public constant MAP_HEIGHT = 10;
    uint8 public constant TILE_COUNT = MAP_WIDTH * MAP_HEIGHT;
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


    struct GameInfo {
        uint8 playersCount;
        uint256 minStake;
        bool hasStarted;
        bool hasEnded;
        bool gamePaused;
        bool gameAbandoned;
    }

    struct Tile {
        uint8 occupantId; // 1 - 4 is player, > 4 is item, 0 is empty
    }

    struct PlayerOrItem {
        int8 id;
        int16 ft;
    }

    struct GameRoom {
        GameInfo info;
        Tile[TILE_COUNT] board;
        uint8[MAX_PLAYERS] playerIds;
        bool[MAX_PLAYERS] playerReady;
        bool[MAX_PLAYERS] playerPauseVote;
        uint256[MAX_PLAYERS] playerLastMoveBlock;
    }

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


    // getters
    function _allPlayersAreReady(uint256 _roomId) internal view returns (bool) {
        for (uint8 i = 0; i < games[_roomId].info.playersCount; i++) {
            if (games[_roomId].playerReady[i] == false) {
                return false;
            }
        }
        return true;
    }

    // setters


    // public functions
    function createGame(uint256 _minStake) external payable 
        worldFunctioning 
        enoughFunds(msg.value, _minStake) 
        playerNotInGame
        {
        GameRoom memory game;
        game.info.playersCount = 1;
        game.info.minStake = _minStake;
        game.playerIds[0] = 1;
        games.push(game);
    }

    function joinGame(uint256 _roomId) external payable 
        worldFunctioning 
        enoughFunds(msg.value, games[_roomId].info.minStake) 
        playerNotInGame
        joinable(_roomId)
    {
        games[_roomId].info.playersCount++;
        games[_roomId].playerIds[games[_roomId].info.playersCount - 1] = games[_roomId].info.playersCount;
    }

    function startGame(uint256 _roomId) external payable 
        worldFunctioning 
        enoughPlayers(_roomId)
        allPlayersReady(_roomId)
        gameNotStarted(_roomId)
    {   
        // spawn player positions

        // spawn items

        emit GameStarted(_roomId);
    }

}
