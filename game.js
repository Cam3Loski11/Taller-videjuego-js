const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const playerActionUp = document.querySelector('#up');
const playerActionLeft = document.querySelector('#left');
const playerActionRight = document.querySelector('#right');
const playerActionDown = document.querySelector('#down');
const playerActions = {
    'ArrowUp': moveUp,
    'ArrowDown': moveDown,
    'ArrowLeft': moveLeft,
    'ArrowRight': moveRight
};
const playerPosition = {
    x: undefined,
    y: undefined,
}
let canvasSize;
let elementsSize;



window.addEventListener('load', renderCanvasSize);
window.addEventListener('resize', renderCanvasSize);
// Añade un event listener para el evento 'keydown' en el objeto window
window.addEventListener('keydown', (e) => {
    // Obtiene el valor de la tecla presionada y lo almacena en la variable 'tecla'
    let tecla = e.key;

    // Verifica si la tecla presionada está presente en el objeto 'playerActions'
    // 'playerActions' es un objeto que mapea teclas a funciones de movimiento
    if (playerActions[tecla]) {
        // Si la tecla está mapeada a una función, ejecuta esa función
        playerActions[tecla]();
    }
}); 
playerActionUp.addEventListener('click', moveUp);
playerActionLeft.addEventListener('click', moveLeft);
playerActionRight.addEventListener('click', moveRight);
playerActionDown.addEventListener('click', moveDown);



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
    
    game.clearRect(0, 0, canvasSize, canvasSize)

    mapRowsColumns.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => { 
            const emoji = emojis[column];
            const positionX = elementsSize * (rowIndex + 1);
            const positionY = elementsSize * (columnIndex + 1);

            if(column == 'O') {
                if(!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = positionX;                   // condicional para saber si ya no tiene undefined nuestro objeto
                    playerPosition.y = positionY;                   // de playerPosition
                }
            }

            game.fillText(emoji, positionY, positionX);
        });
    });
    drawPlayer();            
}


// Funcion para dibujar al jugador
function drawPlayer() {
    game.fillText(emojis['PLAYER'], playerPosition.y, playerPosition.x);
}


// Funciones para delimitar el canvas y que el player no se salga

function moveUp() {
    if ((playerPosition.x - elementsSize) < elementsSize) {
        return
    } else {
        playerPosition.x -= elementsSize;
        startGame();
    }
}
function moveLeft() {
    if ((playerPosition.y - elementsSize) < elementsSize) {
        return
    } else {
        playerPosition.y -= elementsSize;
        startGame();
    }
}
function moveRight() {
    if ((playerPosition.y + elementsSize) > canvasSize) {
        return
    } else {
        playerPosition.y += elementsSize;
        startGame();
    }
}
function moveDown() {
    if ((playerPosition.x + elementsSize) > canvasSize) {
        return
    }   else {
        playerPosition.x += elementsSize;
        startGame();
    }
}
