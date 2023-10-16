class GameLogic {
    constructor(params) { this.restartGame(); }
    getMaxRows() { return this.lstMines.length; }
    getMaxColumns() { return this.lstMines[0].length; }
    canRevealSquare(x, y) { return this.lstMines[x][y] !== false; }

    validateIfGameHasEnded() {
        if (this.noBombZonesToDiscover === 0 && this.flagsPossibleInField === 0 &&
            this.bombsFlaged + this.bombsExploded === this.totalNumberOfBombs) {
            this.isGameOver = true;

            if (this.isFlawlessVictory === true && this.funFlawless !== undefined)
                setTimeout(this.funFlawless, 1000);
        }
    }

    restartGame() {
        this.isGameOver = false;
        this.isFirstReveal = true;
        this.isFlawlessVictory = true;
        this.noBombZonesToDiscover = 0;
        this.totalNumberOfBombs = 0;
        this.flagsPossibleInField = 0;
        this.bombsExploded = 0;
        this.bombsFlaged = 0;
        this.funFlawless = undefined;
    }

    addFlag(x, y) {
        if (!this.lstMines[x][y])
            this.bombsFlaged++;

        this.flagsPossibleInField--;
        this.validateIfGameHasEnded();
    }

    removeFlag(x, y) {
        if (!this.lstMines[x][y])
            this.bombsFlaged--;

        this.flagsPossibleInField++;
    }

    initMineList(x, y) {
        this.lstMines = [];
        for (let i = 0; i < x; i++) {
            this.lstMines.push([]);

            for (let j = 0; j < y; j++) {
                let isBomb = Math.round(Math.random() * 100) < 80;
                this.lstMines[i].push(isBomb);

                if (isBomb)
                    this.noBombZonesToDiscover++;
                else
                    this.totalNumberOfBombs++;
            }
        }
        this.flagsPossibleInField = this.totalNumberOfBombs;
    }

    setFirstRevealOfBombs(x, y) {
        if (this.isFirstReveal !== true)
            return

        let bombsToPlace = 0;

        for (let i = -1; i <= 1; i++)
            for (let j = -1; j <= 1; j++) {
                if (x + i < 0 || x + i >= this.getMaxRows() ||
                    y + j < 0 || y + j >= this.getMaxColumns())
                    continue;

                if (this.lstMines[x + i][y + j] === false) {
                    bombsToPlace++;
                    this.lstMines[x + i][y + j] = true;
                }
            }

        let buffer = 2;
        let iLimit = buffer;
        let jLimit = buffer * -1;

        while (bombsToPlace > 0) {
            let timesInLoop = 2;
            let change = 1;

            while (bombsToPlace > 0 && timesInLoop > 0) {

                for (let i = iLimit * -1; i <= iLimit && bombsToPlace > 0; i = i + change) {
                    if (x + i < 0 || x + i >= this.getMaxRows() ||
                        y + jLimit < 0 || y + jLimit >= this.getMaxColumns())
                        continue;

                    if (this.lstMines[x + i][y + jLimit] === true) {
                        bombsToPlace--;
                        this.lstMines[x + i][y + jLimit] = false;
                    }
                }

                iLimit *= -1;

                for (let j = jLimit * -1; j <= jLimit && bombsToPlace > 0; j = j + change * -1) {
                    if (x + iLimit < 0 || x + iLimit >= this.getMaxRows() ||
                        y + j < 0 || y + j >= this.getMaxColumns())
                        continue;

                    if (this.lstMines[x + iLimit][y + j] === true) {
                        bombsToPlace--;
                        this.lstMines[x + iLimit][y + j] = false;
                    }
                }

                jLimit *= -1;
                change *= -1;
                timesInLoop--;
            }

            buffer++;
            iLimit = buffer;
            jLimit = buffer * -1;
        }

        this.isFirstReveal = false;
    }

    setNumberSquare(x, y) {
        if (this.lstMines[x][y] !== true)
            return;

        let numberOfBombs = 0;

        for (let i = -1; i <= 1; i++)
            for (let j = -1; j <= 1; j++) {
                if (i == 0 && j == 0 ||
                    x + i < 0 || x + i >= this.getMaxRows() ||
                    y + j < 0 || y + j >= this.getMaxColumns())
                    continue;

                if (this.lstMines[x + i][y + j] === false)
                    numberOfBombs++;
            }
        this.lstMines[x][y] = numberOfBombs;
    }

    validateSquare(x, y) {

        if (this.lstMines[x][y] === false) {
            this.bombsExploded++;
            this.isFlawlessVictory = false;
            this.flagsPossibleInField--;

        } else
            this.noBombZonesToDiscover--;

        this.validateIfGameHasEnded();
        return this.lstMines[x][y];
    }
}