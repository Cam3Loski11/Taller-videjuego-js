const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
let canvasSize;
let elementsSize;

window.addEventListener('load', renderCanvasSize);
window.addEventListener('resize', renderCanvasSize);


function renderCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.78;
    } else {
        canvasSize = window.innerHeight * 0.78;
    }     

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10.5;
    
    startGame();
}


function startGame() {
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'center';

    const map = maps[0];
    const mapRows = map.trim().split('\n');  // <-- trim sirve para quitar strings vacios, y split para separar por strings
    const mapRowsColumns = mapRows.map(value => value.trim().split(''));
    
    mapRowsColumns.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) =>{
            const emoji = emojis[column];
            const positionRow = elementsSize * (rowIndex + 1);
            const positionColumn = elementsSize * (columnIndex + 1);
            game.fillText(emoji, positionColumn, positionRow);
        });
    });            
}       