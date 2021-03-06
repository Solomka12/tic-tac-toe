export const getSplitArr = (arr, gridCount = 10) => {
    return new Array(Math.ceil(arr.length / gridCount))
        .fill(null)
        .map((item, i) => arr.slice(gridCount * i, gridCount * i + gridCount));
}

export const getWinnerRow = (board, boardSize, marksToWin) => {
    const fitsVertically = i => i + boardSize * (marksToWin - 1) < boardSize * boardSize;
    const fitsHorizontally = i => i % boardSize + marksToWin <= boardSize;
    const fitsBackHorizontally = i => i % boardSize - (marksToWin - 1) >= 0;

    const getHorizontalRow = (i, cell, board = []) => {
        if (!fitsHorizontally(i)) return null;

        let currWinnerRow = [i];
        let currRowCount = 1;

        for (let j = i + 1; currRowCount < marksToWin; j++) {
            if (board[j] === cell) {
                currWinnerRow.push(j);
                currRowCount++;
            } else {
                break;
            }
        }

        return currWinnerRow.length >= marksToWin ? currWinnerRow : null;
    };

    const getVerticalRow = (i, cell, board = []) => {
        if (!fitsVertically(i)) return null;

        let currWinnerRow = [i];
        let currRowCount = 1;

        for (let j = i + boardSize; currRowCount < marksToWin; j += boardSize) {
            if (board[j] === cell) {
                currWinnerRow.push(j);
                currRowCount++;
            } else {
                break;
            }
        }

        return currWinnerRow.length >= marksToWin ? currWinnerRow : null;
    };

    const getDiagonalLTRRow = (i, cell, board = []) => {
        if (!fitsHorizontally(i) || !fitsVertically(i)) return null;

        let currWinnerRow = [i];
        let currRowCount = 1;

        for (let j = i + boardSize + 1; currRowCount < marksToWin; j += boardSize + 1) {
            if (board[j] === cell) {
                currWinnerRow.push(j);
                currRowCount++;
            } else {
                break;
            }
        }

        return currWinnerRow.length >= marksToWin ? currWinnerRow : null;
    };

    const getDiagonalRTLRow = (i, cell, board = []) => {
        if (!fitsVertically(i) || !fitsBackHorizontally(i)) return null;

        let currWinnerRow = [i];
        let currRowCount = 1;

        for (let j = i + boardSize - 1; currRowCount < marksToWin; j += boardSize - 1) {
            if (board[j] === cell) {
                currWinnerRow.push(j);
                currRowCount++;
            } else {
                break;
            }
        }

        return currWinnerRow.length >= marksToWin ? currWinnerRow : null;
    };

    for (let i = 0; i < board.length; i++) {
        const cell = board[i];

        if (cell) {
            const horizontalRow = getHorizontalRow(i, cell, board);
            if (horizontalRow) return horizontalRow;

            const verticalRow = getVerticalRow(i, cell, board);
            if (verticalRow) return verticalRow;

            const diagonalLTRRow = getDiagonalLTRRow(i, cell, board);
            if (diagonalLTRRow) return diagonalLTRRow;

            const diagonalRTLRow = getDiagonalRTLRow(i, cell, board);
            if (diagonalRTLRow) return diagonalRTLRow;
        }
    }
};