const numberColumns = document.getElementById("numberColumns");
const numberRows = document.getElementById("numberRows");
const btnCreateMinesList = document.getElementById("btnCreateMinesList");
const msGameContainer = document.getElementById("msGameContainer");
const pFlagsPossibles = document.getElementById("flagsPossibles");
const pBombsExploded = document.getElementById("bombsExploded");

const trBaseElement = document.createElement("tr");
const pBaseElement = document.createElement("p");
pBaseElement.innerHTML = "?";

class msGameLogic {

    constructor(params) {
        this.restartGame();
    }

    validateIfGameHasEnded(){
        if (this.noBombZonesToDiscover === 0 && this.flagsPossibleInField === 0 && 
            this.bombsFlaged + this.bombsExploded === this.totalNumberOfBombs) {
            this.isGameOver = true;
        }
    }

    getMaxRows() {
        return this.lstMines.length;
    }

    getMaxColumns() {
        return this.lstMines[0].length;
    }

    restartGame() {
        this.isGameOver = false;
        this.isFlawlessVictory = true;
        this.noBombZonesToDiscover = 0;
        this.totalNumberOfBombs = 0;
        this.flagsPossibleInField = 0;
        this.bombsExploded = 0;
        this.bombsFlaged = 0;
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
                let isBomb = Math.round(Math.random() * 100) < 75;
                this.lstMines[i].push(isBomb);

                if (isBomb)
                    this.noBombZonesToDiscover++;
                else
                    this.totalNumberOfBombs++;

            }
        }

        this.flagsPossibleInField = this.totalNumberOfBombs;
        let numberOfBombs = 0;

        for (let i = 0; i < x; i++)
            for (let j = 0; j < y; j++) {

                // console.log(" X: " + i + " Y: " +j + " Value: " + lstMines[i][j]);

                if (!this.lstMines[i][j])
                    continue;

                numberOfBombs = 0;

                for (let iNewPos = -1; iNewPos <= 1; iNewPos++)
                    for (let jNewPos = -1; jNewPos <= 1; jNewPos++) {
                        if (iNewPos == 0 && jNewPos == 0 ||
                            i + iNewPos < 0 || i + iNewPos >= x ||
                            j + jNewPos < 0 || j + jNewPos >= y)
                            continue;

                        if (this.lstMines[i + iNewPos][j + jNewPos] === false)
                            numberOfBombs++;

                    }

                this.lstMines[i][j] = numberOfBombs;
            }
    }

    canRevealSquare(x, y) {
        return this.lstMines[x][y] !== false;
    }

    validateSquare(x, y) {

        if (this.lstMines[x][y] === false) {
            this.bombsExploded++;
            this.isFlawlessVictory = false;
            this.flagsPossibleInField--;
            
        } else {
            this.noBombZonesToDiscover--;
        }

        this.validateIfGameHasEnded();

        return this.lstMines[x][y];
    }
}

let gameLogic = new msGameLogic();

function recRevealBombSquare(x, y) {

    if (gameLogic.canRevealSquare(x, y))
        revealBombSquare(document.getElementById("bomb-" + ((x).toString() + "-" + (y).toString())));
    else
        return;

}

function revealBombSquare(element) {

    if (element === null || !element.classList.contains("bombSquare") || element.classList.contains("show"))
        return;

    const x = element.x, y = element.y, maxX = gameLogic.getMaxRows(), maxY = gameLogic.getMaxColumns();

    const squareValue = gameLogic.validateSquare(x, y);

    let color = "";

    element.innerHTML = squareValue;

    switch (squareValue) {
        case false:
            element.innerHTML = "💥";
            pFlagsPossibles.innerHTML = gameLogic.flagsPossibleInField;
            pBombsExploded.innerHTML = gameLogic.bombsExploded;

            break;
        case 0:
            element.innerHTML = " ";
            break;
        case 1:
            color = "#2222bb"
            break;
        case 2:
            color = "#22bb22"
            break;
        case 3:
            color = "#999900"
            break;
        case 4:
            color = "#aa22ff"
            break;
        case 5:
            color = "#ff6666"
            break;
        case 6:
            color = "#ff3333"
            break;
        case 7:
            color = "#ff6b00"
            break;
        case 8:
            color = "#222"
            break;
        default:
            break;
    }

    element.style.color = color;
    element.classList.add("show");

    if (squareValue === 0)
        for (let i = -1; i < 2; i++)
            for (let j = -1; j < 2; j++) {
                if (i == 0 && j == 0 ||
                    x + i < 0 || x + i >= maxX ||
                    y + j < 0 || y + j >= maxY)
                    continue;

                recRevealBombSquare(x + i, y + j);

            }
}

function appendBombs() {
    msGameContainer.innerHTML = "";
    for (let i = 0; i < gameLogic.getMaxRows(); i++) {

        const trElement_tmp = trBaseElement.cloneNode(true);

        for (let j = 0; j < gameLogic.getMaxColumns(); j++) {
            const pElement_tmp = pBaseElement.cloneNode(true);

            pElement_tmp.id = "bomb-" + (i.toString() + "-" + j.toString());
            pElement_tmp.classList.add("bombSquare");
            pElement_tmp.x = i;
            pElement_tmp.y = j;

            pElement_tmp.addEventListener("contextmenu", e => e.preventDefault());
            pElement_tmp.addEventListener("mouseup", (e) => {

                if (gameLogic.isGameOver)
                    return;

                const id = e.target.id;
                // const x = id.substring(5, id.lastIndexOf("-"));
                const x = e.target.x;
                // const y = id.substring(id.lastIndexOf("-") + 1);
                const y = e.target.y;

                switch (e.which) {
                    case 1:
                        if (e.target.innerHTML == "🚩")
                            return

                        revealBombSquare(e.target);
                        break;
                    case 3:
                        if (!e.target.classList.contains("show"))
                            e.target.innerHTML = e.target.innerHTML == "?" ? "🚩" : "?";

                        if (e.target.innerHTML == "?")
                            gameLogic.removeFlag(x, y);
                        else if (e.target.innerHTML == "🚩")
                            gameLogic.addFlag(x, y);

                        pFlagsPossibles.innerHTML = gameLogic.flagsPossibleInField;

                        break
                    default:
                        return;
                }


                // Add smth
            });

            trElement_tmp.append(pElement_tmp);
            msGameContainer.append(trElement_tmp);

        }
    }
}

btnCreateMinesList.addEventListener("click", (e) => {
    gameLogic.restartGame();
    gameLogic.initMineList(numberRows.value, numberColumns.value);
    appendBombs();
    pFlagsPossibles.innerHTML = gameLogic.flagsPossibleInField;


});

numberColumns.addEventListener("change", (e) => {
    if (numberColumns.value < 8)
        numberColumns.value = "8";
});

numberRows.addEventListener("change", (e) => {
    if (numberRows.value < 8)
        numberRows.value = "8";
});
