// Element that will be used
const numberColumns = document.getElementById("numberColumns");
const numberRows = document.getElementById("numberRows");
const btnCreateMinesList = document.getElementById("btnCreateMinesList");
const msGameContainer = document.getElementById("msGameContainer");
const pFlagsPossibles = document.getElementById("flagsPossibles");
const pBombsExploded = document.getElementById("bombsExploded");
const divPopOff = document.getElementById("game-state-pop-off");
const btnContinue = document.getElementById("btnContinue");
const btnEndGame = document.getElementById("btnEndGame");

// New Elements
const trBaseElement = document.createElement("tr");
const pBaseElement = document.createElement("p");
pBaseElement.innerHTML = "?";

// Main game class logic
let gameLogic = new GameLogic();

function addClassFlawlessToSquare({ x, y }) {
    const element = document.getElementById("bomb-" + ((x).toString() + "-" + (y).toString()));
    element.classList.add("flawless");
}

function flawlessVictoryAnimation() {
    let lstMinesTmp = [];

    for (let i = 0; i < gameLogic.getMaxRows(); i++)
        for (let j = 0; j < gameLogic.getMaxColumns(); j++) 
            if (!(gameLogic.lstMines[i][j] === false || gameLogic.lstMines[i][j] === true || gameLogic.lstMines[i][j] === 0))
                lstMinesTmp.push({ x: i, y: j });
            
    let addClassToSquareInterval = setInterval(takeRandomSquare, 100);

    function takeRandomSquare() {
        if (lstMinesTmp.length === 0) {
            clearInterval(addClassToSquareInterval);
            return;
        }

        const index = Math.round(Math.random() * (lstMinesTmp.length - 1));
        addClassFlawlessToSquare(lstMinesTmp[index]);
        lstMinesTmp.splice(index, 1);
    };
}

function recRevealBombSquare(x, y) {
    if (gameLogic.canRevealSquare(x, y)) {
        const element = document.getElementById("bomb-" + ((x).toString() + "-" + (y).toString()));
        revealBombSquare(element);
    }
    else
        return;
}

function revealBombSquare(element) {
    if (element === null || !element.classList.contains("bombSquare") || element.classList.contains("show") || element.innerHTML === "🚩")
        return;

    const x = element.x, y = element.y;
    
    // When the game is over, show all the remaining bombs
    if (gameLogic.isGameOver === true && !gameLogic.canRevealSquare(x, y)) {
        element.innerHTML = "💣";
        return;
    }
    
    gameLogic.setNumberSquare(x, y);
    const squareValue = gameLogic.validateSquare(x, y);

    let color = "";
    element.innerHTML = squareValue;

    switch (squareValue) {
        case false:
            element.innerHTML = "💥";
            pFlagsPossibles.innerHTML = gameLogic.flagsPossibleInField;
            pBombsExploded.innerHTML = gameLogic.bombsExploded;

            if (gameLogic.bombsExploded === 1)
                divPopOff.classList.add("show");
            break;
        case 0:
            color = "#ccc";
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
            color = "#ff2222"
            break;
        case 6:
            color = "#00cccc"
            break;
        case 7:
            color = "#cc4400"
            break;
        case 8:
            color = "#222"
            break;
        default:
            color = "#aaa";
            break;
    }

    element.style.color = color;
    element.classList.add("show");

    if (squareValue === 0) {
        const maxX = gameLogic.getMaxRows(), maxY = gameLogic.getMaxColumns();

        for (let i = -1; i < 2; i++)
            for (let j = -1; j < 2; j++) {
                if (i == 0 && j == 0 ||
                    x + i < 0 || x + i >= maxX ||
                    y + j < 0 || y + j >= maxY)
                    continue;

                recRevealBombSquare(x + i, y + j);
            }
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
                const x = e.target.x;
                const y = e.target.y;

                switch (e.which) {
                    case 1:
                        if (gameLogic.isFirstReveal)
                            gameLogic.setFirstRevealOfBombs(x, y);

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
    gameLogic.funFlawless = flawlessVictoryAnimation;
    pFlagsPossibles.innerHTML = gameLogic.flagsPossibleInField;
    pBombsExploded.innerHTML = gameLogic.bombsExploded;
});

numberColumns.addEventListener("change", (e) => {
    if (numberColumns.value < 8)
        numberColumns.value = "8";
});

numberRows.addEventListener("change", (e) => {
    if (numberRows.value < 8)
        numberRows.value = "8";
});

function showAllGame() {
    if (!gameLogic.isGameOver)
        return;

    for (let i = 0; i < gameLogic.getMaxRows(); i++)
        for (let j = 0; j < gameLogic.getMaxColumns(); j++)
            revealBombSquare(document.getElementById("bomb-" + ((i).toString() + "-" + (j).toString())));
}

function removePopOff() { divPopOff.classList.remove("show"); }

btnContinue.addEventListener("click", removePopOff);
btnEndGame.addEventListener("click", e => {
    gameLogic.isGameOver = true;
    removePopOff();
    showAllGame();
});
