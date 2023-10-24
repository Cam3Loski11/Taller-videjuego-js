const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

window.addEventListener('load', startGame);

function startGame() {
    // game.fillRect(0,50,100,100);
    // game.clearRect(x, y, w, h);

    game.font = '25px Verdana'
    game.fillStyle = 'red';
    game.textAlign = 'left';
    game.fillText('Hola', 50, 50);
}