
export class Board {
    constructor(numberOfRows, numberOfColumns, numberOfBombs){
        this._numberOfBombs = numberOfBombs;
        this._numberOfTiles = numberOfRows * numberOfColumns;
        this._playerBoard = this.generatePlayerBoard(numberOfRows, numberOfColumns);
        this._bombBoard = this.generateBombBoard(numberOfRows, numberOfColumns, numberOfBombs);
    }
    get playerBoard() {
        return this._playerBoard;
    }
    flipTile (rowIndex, colIndex) {
        if (this._playerBoard[rowIndex][colIndex] === ' '){
            if (this._bombBoard[rowIndex][colIndex] === 'B'){
                this._playerBoard[rowIndex][colIndex] = 'X'
            }
            else {
                this._playerBoard[rowIndex][colIndex] = this.getNumberOfNeighborBombs(rowIndex,colIndex);
            }
        }
        else {
            console.log('You already flipped this tile!');
            return
        }
        this._numberOfTiles--;
    }
    getNumberOfNeighborBombs (rowIndex, columnIndex) {
        let neighborOffsets = [[-1,-1],[-1,0],[-1,1],
                               [0,-1],[0,1],
                               [1,-1],[1,0],[1,1]];
        const numberOfRows = this._bombBoard.length;
        const numberOfColumns = this._bombBoard[0].length;
        let numberOfBombs = 0;
        for (let i=0; i<neighborOffsets.length; i++) {
            let neighborRowIndex = rowIndex + neighborOffsets[i][0];
            let neighborColIndex = columnIndex + neighborOffsets[i][1];
            if (neighborRowIndex >= 0 && neighborRowIndex < numberOfRows &&
                neighborColIndex >= 0 && neighborColIndex < numberOfColumns) {
                    if (this._bombBoard[neighborRowIndex][neighborColIndex] === 'B') {
                        numberOfBombs++;
                    }
                }
            }
        return numberOfBombs;
    }
    hasSafeTiles () {
        return this._numberOfTiles !== this._numberOfBombs;
    }
    print () {
        console.log(this._playerBoard.map(row => row.join(' | ')).join('\n'));
    }
    _generateBoard (numberOfRows, numberOfColumns, char) {
        let board = [];
        for (let row=0; row<numberOfRows; row++) {
            let newRow = [];
            for (let col=0; col<numberOfColumns; col++) {
                newRow.push(char);
            }
            board.push(newRow);
        }
        return board;
    }
    generatePlayerBoard (numberOfRows, numberOfColumns) {
        return this._generateBoard(numberOfRows, numberOfColumns, ' ');
    }
    generateBombBoard (numberOfRows, numberOfColumns, numberOfBombs) {
        let board = this._generateBoard(numberOfRows, numberOfColumns, ' ');
        let numberOfBombsPlaced = 0;
        while (numberOfBombsPlaced < numberOfBombs) {
            let randomRowIndex = Math.floor(Math.random() * numberOfRows);
            let randomColIndex = Math.floor(Math.random() * numberOfColumns);
            if (board[randomRowIndex][randomColIndex] !== 'B') {
                board[randomRowIndex][randomColIndex] = 'B';
                numberOfBombsPlaced++;
            }
        }
        return board;
    };
}
