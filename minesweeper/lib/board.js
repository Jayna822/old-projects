'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = exports.Board = function () {
    function Board(numberOfRows, numberOfColumns, numberOfBombs) {
        _classCallCheck(this, Board);

        this._numberOfBombs = numberOfBombs;
        this._numberOfTiles = numberOfRows * numberOfColumns;
        this._playerBoard = this.generatePlayerBoard(numberOfRows, numberOfColumns);
        this._bombBoard = this.generateBombBoard(numberOfRows, numberOfColumns, numberOfBombs);
    }

    _createClass(Board, [{
        key: 'flipTile',
        value: function flipTile(rowIndex, colIndex) {
            if (this._playerBoard[rowIndex][colIndex] === ' ') {
                if (this._bombBoard[rowIndex][colIndex] === 'B') {
                    this._playerBoard[rowIndex][colIndex] = 'X';
                } else {
                    this._playerBoard[rowIndex][colIndex] = this.getNumberOfNeighborBombs(rowIndex, colIndex);
                }
            } else {
                console.log('You already flipped this tile!');
                return;
            }
            this._numberOfTiles--;
        }
    }, {
        key: 'getNumberOfNeighborBombs',
        value: function getNumberOfNeighborBombs(rowIndex, columnIndex) {
            var neighborOffsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
            var numberOfRows = this._bombBoard.length;
            var numberOfColumns = this._bombBoard[0].length;
            var numberOfBombs = 0;
            for (var i = 0; i < neighborOffsets.length; i++) {
                var neighborRowIndex = rowIndex + neighborOffsets[i][0];
                var neighborColIndex = columnIndex + neighborOffsets[i][1];
                if (neighborRowIndex >= 0 && neighborRowIndex < numberOfRows && neighborColIndex >= 0 && neighborColIndex < numberOfColumns) {
                    if (this._bombBoard[neighborRowIndex][neighborColIndex] === 'B') {
                        numberOfBombs++;
                    }
                }
            }
            return numberOfBombs;
        }
    }, {
        key: 'hasSafeTiles',
        value: function hasSafeTiles() {
            return this._numberOfTiles !== this._numberOfBombs;
        }
    }, {
        key: 'print',
        value: function print() {
            console.log(this._playerBoard.map(function (row) {
                return row.join(' | ');
            }).join('\n'));
        }
    }, {
        key: '_generateBoard',
        value: function _generateBoard(numberOfRows, numberOfColumns, char) {
            var board = [];
            for (var row = 0; row < numberOfRows; row++) {
                var newRow = [];
                for (var col = 0; col < numberOfColumns; col++) {
                    newRow.push(char);
                }
                board.push(newRow);
            }
            return board;
        }
    }, {
        key: 'generatePlayerBoard',
        value: function generatePlayerBoard(numberOfRows, numberOfColumns) {
            return this._generateBoard(numberOfRows, numberOfColumns, ' ');
        }
    }, {
        key: 'generateBombBoard',
        value: function generateBombBoard(numberOfRows, numberOfColumns, numberOfBombs) {
            var board = this._generateBoard(numberOfRows, numberOfColumns, ' ');
            var numberOfBombsPlaced = 0;
            while (numberOfBombsPlaced < numberOfBombs) {
                var randomRowIndex = Math.floor(Math.random() * numberOfRows);
                var randomColIndex = Math.floor(Math.random() * numberOfColumns);
                if (board[randomRowIndex][randomColIndex] !== 'B') {
                    board[randomRowIndex][randomColIndex] = 'B';
                    numberOfBombsPlaced++;
                }
            }
            return board;
        }
    }, {
        key: 'playerBoard',
        get: function get() {
            return this._playerBoard;
        }
    }]);

    return Board;
}();
