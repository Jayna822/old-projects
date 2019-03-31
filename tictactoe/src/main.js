class Board {
    constructor(size) {
        this.board = this._makeBoard(size);
        this.playerMark = 'O';
        this.computerMark = 'X';
    }
    markPlayerChoice(rowIndex, colIndex) {
        this.board[rowIndex][colIndex] = this.playerMark;
    }
    markComputerChoice() {
        //TODO: add some logic here rather than having it be random
        while (true) {
            const randomRowIndex = Math.floor(Math.random()*this.board.length);
            const randomColIndex = Math.floor(Math.random()*this.board.length);
            if (this.board[randomRowIndex][randomColIndex] === ' ') {
                this.board[randomRowIndex][randomColIndex] = this.computerMark;
                return;
            }
            else {
                continue;
            }
        }
    }
    checkWin() {
        for (let i=0; i<this.board.length; i++) {
            if (this._checkEqual(this.board[i])) {
                return true;
            }
            let col = [];
            for (let j=0; j<this.board.length; j++) {
                col.push(this.board[i][j]);
            }
            if (this._checkEqual(col)) {
                return true;
            }
        }
        // TODO: check diagonals
        return false;
    }
    _checkEqual(a) {
        return a.every(x => x === this.playerMark || x === this.computerMark);
    }
    print() {
        let underscores = '';
        for (let i=0; i<this.board.length; i++) {
            underscores += '__';
        }
        for (let i=0; i<this.board.length-1; i++) {
            console.log(this.board[i].join('|'));
            console.log(underscores);
        }
        console.log(this.board[this.board.length-1].join('|') + '\n');
    }
    _makeBoard (size) {
        let board = [];
        for (let i=0; i<size; i++) {
            let row = [];
            for (let j=0; j<size; j++) {
                row.push(' ');
            }
            board.push(row);
        }
        return board;
    }
}

class Game {
    constructor(sizeOfBoard) {
        this.board = new Board(sizeOfBoard);
    }
    playMove(rowIndex, colIndex) {
        console.log('inside playMove');
        if (this.board.board[rowIndex][colIndex] !== ' ') {
            console.log('This space has already been marked!')
            return;
        }
        this.board.markPlayerChoice(rowIndex, colIndex);
        this.board.print();
        if (this.board.checkWin()) {
            console.log('You won!');
            return;
        }
        this.board.markComputerChoice();
        this.board.print();
        if (this.board.checkWin()) {
            console.log('Computer won!');
        }
    }
}
