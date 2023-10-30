const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

const playerActionUp = document.querySelector('#up');
const playerActionLeft = document.querySelector('#left');
const playerActionRight = document.querySelector('#right');
const playerActionDown = document.querySelector('#down');

const livesSpan = document.querySelector('#lives');
const timeSpan = document.querySelector('#time');

const playerActions = {
    'ArrowUp': moveUp,
    'ArrowDown': moveDown,
    'ArrowLeft': moveLeft,
    'ArrowRight': moveRight
};
const playerPosition = {
    x: undefined,
    y: undefined,
};
const giftPosition = {
    x: undefined,
    y: undefined,
};
let bombsPosition = [];

let canvasSize;
let elementsSize;

let timeStart;
let timePlayer;
let timeInterval;

let level = 0;
let lives = 3;



// Escuchadores de eventos
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



// Funcion para renderizar el size del canvas
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


// Funcion gigante para dar inicio al juego
function startGame() {
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'center';

    showLives();
    
    const map = maps[level];

    if(!map) {
        gameWin();
        return;
    }

    if(!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100); // <-- cada 100 milisegundos no segundos
    }

    const mapRows = map.trim().split('\n');  // <-- trim sirve para quitar strings vacios, y split para separar por strings
    const mapRowsColumns = mapRows.map(value => value.trim().split(''));
    
    bombsPosition = [];  // <--- volvemos a crear el array para que se 'resetee' o para que se limpie y no se dupliquen los datos

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
            } else if (column == 'I') {
                giftPosition.x = positionX;
                giftPosition.y = positionY;
            } else if (column == 'X') {
                bombsPosition.push({
                    x: positionX,
                    y: positionY,
                })
            }   
            
            game.fillText(emoji, positionY, positionX);
        });
    });
    drawPlayer();            
}


// Funcion para dibujar al jugador y detectar colisiones
function drawPlayer() {
    const giftColissionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3); // variables para detectar si se cumple la colision
    const giftColissionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3); // el toFixed sirve para limitar los numeros decimales

    if (giftColissionX && giftColissionY) {
        levelChange();
    }

    const bombColission = bombsPosition.find(bomb => {
        const bombColissionX = bomb.x.toFixed(3) == playerPosition.x.toFixed(3) ;
        const bombColissionY = bomb.y.toFixed(3) == playerPosition.y.toFixed(3);
        return bombColissionX && bombColissionY
    })

    if (bombColission) {
        liveLost();
    }

    game.fillText(emojis['PLAYER'], playerPosition.y, playerPosition.x);
}


// Funciones para cambiar nivel, o por si ganaste o perdiste
function levelChange() {
    level ++;
    startGame();
}

function gameWin() {
    clearInterval(timeInterval);
}

function liveLost() {
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    lives --;

    if(lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }

    startGame();
}


// Funciones para delimitar el canvas y que el player no se salga, y de movimiento del jugador
function moveUp() {
    if ((playerPosition.x - elementsSize) < elementsSize - 10) {
        return
    } else {
        playerPosition.x -= elementsSize;
        startGame();
    }
}
function moveLeft() {
    if ((playerPosition.y - elementsSize) < elementsSize - 1) {
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


// Funciones de manipulacion del DOM
function showLives() {
    livesSpan.innerHTML = emojis['HEART'].repeat(lives); // <-- repeat  es un método de las cadenas de texto en JavaScript que se utiliza para concatenar una cadena repetidas veces
    
    //   const heartsArray = Array(lives).fill(emojis['HEART']); // [1,2,3]             <------
    //   spanLives.innerHTML = "";   <-- Esto es para limpiar el span                <-----        Forma de JuanDc
    //   heartsArray.forEach(heart => spanLives.append(heart));                         <------
}

function showTime() {
    timeSpan.innerHTML = Date.now() - timeStart;
}


//Local storage para guardar el record del jugador