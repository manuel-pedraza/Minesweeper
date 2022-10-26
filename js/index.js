let lstMines = [];

function initMineList(x, y) {
    lstMines = [];
    for (let i = 0; i < x; i++) {
        lstMines.push([]);

        for (let j = 0; j < y; j++) {
            lstMines[i].push(Math.round(Math.random() * 100) < 75);
        }

    }


    let numberOfBombs = 0;
    let numberOfCounters = 8;

    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {

            // console.log(" X: " + i + " Y: " +j + " Value: " + lstMines[i][j]);

            if (!lstMines[i][j ])
                continue;

            numberOfBombs = 0;
            numberOfCounters = 8;


            for (let iNewPos = -1; iNewPos <= 1; iNewPos++) {
                for (let jNewPos = -1; jNewPos <= 1; jNewPos++) {
                    if( iNewPos == 0 && jNewPos == 0 ||
                        i + iNewPos < 0 || i + iNewPos >= x ||
                        j + jNewPos < 0 || j + jNewPos >= y)
                        continue;
                    
                    if(lstMines[i + iNewPos][j + jNewPos] === false)
                        numberOfBombs++;

                }                
            }


            lstMines[i][j] = numberOfBombs;
        }

    }

}

initMineList(4, 4);
console.log(lstMines);