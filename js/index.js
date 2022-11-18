const numberColumns = document.getElementById("numberColumns");
const numberRows = document.getElementById("numberRows");
const btnCreateMinesList = document.getElementById("btnCreateMinesList");
const msGameContainer = document.getElementById("msGameContainer");


const pBaseElement = document.createElement("p");
pBaseElement.innerHTML = "?";
pBaseElement.class = "grid-item";
pBaseElement.style.fontSize = "1.5em";
pBaseElement.style.marginLeft = "0px";
pBaseElement.style.marginBottom = "0px";
pBaseElement.style.marginTop = "0px";
pBaseElement.style.marginRight = "0px";
//pBaseElement.style.height =  `100%`;
//pBaseElement.style.width = `100%`;
pBaseElement.style.fontFamily = "Sans-Serif";
pBaseElement.style.height = `40px`;
pBaseElement.style.width = `40px`;
pBaseElement.style.minWidth = `20px`;
pBaseElement.style.textAlign = "center";
pBaseElement.style.display = "table-cell";
pBaseElement.style.verticalAlign = "middle";
pBaseElement.style.zIndex = "1";

const trBaseElement = document.createElement("tr");

class msGameLogic {
    
    constructor(params) {
        this.lstMines = [];
        this.isGameOver = false;
    }


    restartGame() {
        this.isGameOver = false;
    }

    initMineList(x, y) {
        this.lstMines = [];
        for (let i = 0; i < x; i++) {
            this.lstMines.push([]);

            for (let j = 0; j < y; j++)
            this.lstMines[i].push(Math.round(Math.random() * 100) < 75);
        }
        
        let numberOfBombs = 0;
        let numberOfCounters = 8;
        
        for (let i = 0; i < x; i++)
            for (let j = 0; j < y; j++) {
                
                // console.log(" X: " + i + " Y: " +j + " Value: " + lstMines[i][j]);
                
                if (!this.lstMines[i][j])
                continue;
                
                numberOfBombs = 0;
                numberOfCounters = 8;
                
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

    validateSquare(x, y){

        if (!this.lstMines[x][y])
            this.isGameOver = true;

        return this.lstMines[x][y];
    } 
}

let gameLogic = new msGameLogic();

function appendBombs() {
    msGameContainer.innerHTML = "";
    for (let i = 0; i < gameLogic.lstMines.length; i++){

        const trElement_tmp = trBaseElement.cloneNode(true);

        for (let j = 0; j < gameLogic.lstMines[0].length; j++) {
            const pElement_tmp = pBaseElement.cloneNode(true);
            
            pElement_tmp.id = "bomb-" + (i.toString() + "-" + j.toString());
            pElement_tmp.addEventListener("mouseup", (e) =>{
                const id = e.target.id;
                const x = id.substring(5, id.lastIndexOf("-"));
                const y = id.substring(id.lastIndexOf("-") + 1);
                
                const squareValue = gameLogic.validateSquare(x, y);
                
                e.target.innerHTML = squareValue === false ? "💣" : squareValue === 0 ? " " : squareValue;

                e.target.classList.add("show");
            });
            
            trElement_tmp.append(pElement_tmp);
            msGameContainer.append(trElement_tmp);

        }
    }
}

btnCreateMinesList.addEventListener("click", (e) => {
    gameLogic.initMineList(numberRows.value, numberColumns.value);
    appendBombs();
    
    // console.log("ROWS: " + numberRows.getAttribute("value") + " COLUMNS: " + numberColumns.getAttribute("value"));
    console.log(gameLogic.lstMines);
});

numberColumns.addEventListener("change", (e) =>{
    if (numberColumns.value < 4)
    numberColumns.value = "4";
});

numberRows.addEventListener("change", (e) =>{
    
    if(numberRows.value < 4)
        numberRows.value = "4";

});



