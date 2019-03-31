// All code should be written in this file.
let playerOneMoveOneType;
let playerOneMoveOneValue;
let playerOneMoveTwoType;
let playerOneMoveTwoValue;
let playerOneMoveThreeType;
let playerOneMoveThreeValue;

let playerTwoMoveOneType;
let playerTwoMoveOneValue;
let playerTwoMoveTwoType;
let playerTwoMoveTwoValue;
let playerTwoMoveThreeType;
let playerTwoMoveThreeValue;

const TOTAL_VALUE = 99;

function setPlayerMoves(player, moveOneType, moveOneValue, moveTwoType, moveTwoValue, moveThreeType, moveThreeValue) {
    if (!MOVE_TYPES.includes(moveOneType) || !MOVE_TYPES.includes(moveTwoType) || !MOVE_TYPES.includes(moveThreeType)) {
        return;
    }
    if (moveOneValue < 1 || moveOneValue > 99 || moveTwoValue < 1 || moveTwoValue > 99 || moveThreeValue < 1 || moveThreeValue > 99) {
        return;
    }
    if (moveOneValue + moveTwoValue + moveThreeValue != TOTAL_VALUE) {
        return;
    }
    if (player.toLowerCase() === 'player one') {
        playerOneMoveOneType = moveOneType;
        playerOneMoveOneValue = moveOneValue;
        playerOneMoveTwoType = moveTwoType;
        playerOneMoveTwoValue = moveTwoValue;
        playerOneMoveThreeType = moveThreeType;
        playerOneMoveThreeValue = moveThreeValue;
    } else if (player.toLowerCase() === 'player two') {
        playerTwoMoveOneType = moveOneType;
        playerTwoMoveOneValue = moveOneValue;
        playerTwoMoveTwoType = moveTwoType;
        playerTwoMoveTwoValue = moveTwoValue;
        playerTwoMoveThreeType = moveThreeType;
        playerTwoMoveThreeValue = moveThreeValue;
    } else {
        return;
    }
}

function getRoundWinner(roundNumber) {
    let playerOneMoveType;
    let playerOneMoveValue;
    let playerTwoMoveType;
    let playerTwoMoveValue;
    if (roundNumber === 1) {
        playerOneMoveType = playerOneMoveOneType;
        playerOneMoveValue = playerOneMoveOneValue;
        playerTwoMoveType = playerTwoMoveOneType;
        playerTwoMoveValue = playerTwoMoveOneValue;
    } else if (roundNumber === 2) {
        playerOneMoveType = playerOneMoveTwoType;
        playerOneMoveValue = playerOneMoveTwoValue;
        playerTwoMoveType = playerTwoMoveTwoType;
        playerTwoMoveValue = playerTwoMoveTwoValue;
    } else if (roundNumber === 3) {
        playerOneMoveType = playerOneMoveThreeType;
        playerOneMoveValue = playerOneMoveThreeValue;
        playerTwoMoveType = playerTwoMoveThreeType;
        playerTwoMoveValue = playerTwoMoveThreeValue;
    } else {
        return;
    }
    const winner = getWinningPlayer(playerOneMoveType, playerTwoMoveType);
    if (winner === TIE) {
        if (playerOneMoveValue > playerTwoMoveValue) {
            return PLAYER_ONE;
        } else if (playerOneMoveValue < playerTwoMoveValue) {
            return PLAYER_TWO;
        } else {
            return TIE;
        }
    } else {
        return winner;
    }
}

function getWinningPlayer(playerOneMove, playerTwoMove) {
    const d = {
        'rock': 'scissors',
        'paper': 'rock',
        'scissors': 'paper'
    };
    if (d[playerOneMove] === playerTwoMove) {
        return PLAYER_ONE;
    } else if (playerOneMove === playerTwoMove) {
        return TIE;
    } else {
        return PLAYER_TWO;
    }
}

function getGameWinner() {
    let roundWinners = [];
    [1,2,3].forEach(round => {
        roundWinners.push(getRoundWinner(round));
    });
    const playerOneWins = roundWinners.filter(roundWinner => roundWinner===PLAYER_ONE).length;
    const playerTwoWins = roundWinners.filter(roundWinner => roundWinner===PLAYER_TWO).length;
    if (playerOneWins > playerTwoWins) {
        return PLAYER_ONE;
    } else if (playerOneWins < playerTwoWins) {
        return PLAYER_TWO;
    } else {
        return TIE;
    }
}

function setComputerMoves() {
    playerTwoMoveOneType = getRandomMove();
    debugger;
    playerTwoMoveTwoType = getRandomMove();
    playerTwoMoveThreeType = getRandomMove();

    playerTwoMoveOneValue = getRandomValue();
    playerTwoMoveTwoValue = getRandomValue();
    playerTwoMoveThreeValue = TOTAL_VALUE - playerTwoMoveOneValue - playerTwoMoveTwoValue;
}

function getRandomMove() {
    const rand = Math.random() * 100;
    debugger;
    if (rand < 34) {
        return MOVE_TYPES[0];
    } else if (rand > 34 && rand < 67) {
        return MOVE_TYPES[1];
    } else {
        return MOVE_TYPES[2];
    }
}

function getRandomValue() {
    while (true) {
        const rand = Math.floor(Math.random() * 100);
        if (rand < 1 || rand > (TOTAL_VALUE - 2)) {
            continue;
        }
        if (playerTwoMoveOneValue) {
            if (playerTwoMoveOneValue + rand > (TOTAL_VALUE - 1)) {
                continue;
            }
        }
        return rand;
    }
}
