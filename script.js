let size = 4
let game = Array()

for (let j = 0; j < size; j++){
    row = Array()
    for (let i = 1; i < size+1; i++){
        let box = document.querySelector(".row"+ (j+1) +" .box"+ i)
        box.innerHTML = ""
        row.push(box)
    }
    game.push(row)
}
generate();
generate();


function isFull() {
    let c = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (game[i][j].innerHTML != ""){
                c += 1;
            }
        }
    }
    return (c==size*size) ? true : false;
}

function isPlayable() {
    if (!isFull()) return true;
    for (let i = 0; i < size-1; i++) {
        for (let j = 0; j < size-1; j++) {
            if (game[i][j].innerHTML == game[i+1][j].innerHTML || game[i][j].innerHTML == game[i][j+1].innerHTML)
                return true
        }
    }
    return false
}

function generate() {
    if (isFull()) return false;
    let num = (Math.floor(Math.random()*2) == 0) ? 2 : 4;
    let x = Math.floor(Math.random()*4);
    let y = Math.floor(Math.random()*4);
    if (game[x][y].innerHTML == ""){
        game[x][y].innerHTML = num
    } else generate();
    return true;
}

function getGrid(){
    let grid = Array();
    for (let i = 0; i < size; i++){
        let row = Array();
        for (let j = 0; j < size; j++){
            let num = game[i][j].innerHTML
            row.push(num != "" ? parseInt(num) : 0)
        }
        grid.push(row)
    }
    return grid
}

function moveRight() {
    let moved = false
    let grid = getGrid();
    for (let i = 0; i < size; i++){
        let row = shiftRight(grid[i])
        if (!compareArrays(row, grid[i]))
            moved = true;
        grid[i] = shiftRight(combine(row))
    }

    writeGrid(grid)
    if (moved)
        generate()
}

function moveLeft() {
    let moved = false
    let grid = getGrid();
    for (let i = 0; i < size; i++){
        let row = shiftLeft(grid[i])
        if (!compareArrays(row, grid[i]))
            moved = true;
        
        let combined = combine(row.reverse()).reverse()
        grid[i] = shiftLeft(combined)
    }

    writeGrid(grid)
    if (moved)
        generate()
}

function moveDown() {
    let grid = getGrid()
    let moved = false
    for (let i = 0; i < size; i++){
        let col = Array()
        for (let j = 0; j < size; j++){
            col.push(grid[j][i])
        }
        let combined = combine(shiftRight(col))
        col = shiftRight(combined)

        for (let j = 0; j < size; j++){
            if (grid[j][i] != col[j]) {
                moved = true
            }
            grid[j][i] = col[j]
        }
    }
    writeGrid(grid)
    if (moved) generate()
}

function moveUp() {
    let grid = getGrid()
    let moved = false
    for (let i = 0; i < size; i++){
        let col = Array()
        for (let j = 0; j < size; j++){
            col.push(grid[j][i])
        }
        let combined = combine(shiftLeft(col).reverse()).reverse()
        col = shiftLeft(combined)

        for (let j = 0; j < size; j++){
            if (grid[j][i] != col[j]) {
                moved = true
            }
            grid[j][i] = col[j]
        }
    }
    writeGrid(grid)
    if (moved) generate()
}

function shiftRight(row) {
    let filtered = row.filter((n) => {return n!=0})
    let zeros = Array(size-filtered.length).fill(0)
    return zeros.concat(filtered)
}

function shiftLeft(row) {
    let filtered = row.filter((n) => {return n!=0})
    let zeros = Array(size-filtered.length).fill(0)
    return filtered.concat(zeros)
}

function compareArrays(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
};

function combine(row){
    for (let i = size-1; i > 0; i--){
        if (row[i] == row[i-1]) {
            row[i] += row[i]
            row[i-1] = 0
            i--
        }
    }
    return row
}

function writeGrid(grid) {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let box = document.querySelector(".row"+ (i+1) +" .box"+ (j+1))
            box.innerHTML = grid[i][j] == 0 ? "" : grid[i][j]
        }
    }
}

function colorGrid() {
    for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
        document.querySelector(`.box${i+1}${j+1}`).style.backgroundColor = colors[getGrid()[i][j]];
    score()
}

function endGame() {
    let done = document.querySelector(".overlay")
    if (!isPlayable()) {
        done.style.transform = "translate(0)";
    } else done.style.transform = "translate(-1000%)";
}

function score() {
    let count = 0
    let grid = getGrid()
    for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
        count += grid[i][j]
    document.getElementById("count").innerHTML = count
}

function control(e) {
    switch (e.keyCode) {
        case 37:
            moveLeft();
            break;
        case 38:
            moveUp();
            break;
        case 39:
            moveRight();
            break;
        case 40:
            moveDown();
            break;
    }
    colorGrid();
    endGame();
}
document.addEventListener('keyup', control);

// mobile swipe events
let touchstartX = 0
let touchendX = 0
let touchstartY = 0
let touchendY = 0

function checkDirection() {
    if (Math.abs(touchstartX-touchendX) < Math.abs(touchstartY-touchendY)){
        if (touchendY < touchstartY) moveUp();
        else moveDown();
    } else {
        if (touchendX < touchstartX) moveLeft();
        else moveRight();
    }
    colorGrid();
    endGame();
}

document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX
    touchstartY = e.changedTouches[0].screenY
})

document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX
    touchendY = e.changedTouches[0].screenY
    checkDirection()
})

let colors = {0: "#cdc1b4", 2: "#eee4da", 4: "#eee1c9", 8: "#f3b27a", 16: "#f69664", 32: "#f77c5f", 64: "#f75f3b", 128: "#edd073", 256: "#edcc61", 512: "#edc651", 1024: "#eec744", 2048: "#ecc230"}
colorGrid()