// snake-game.js
var canvas = document.getElementById('snake-game-canvas');
var ctx = canvas.getContext('2d');

var gridSize = 16;
var gameScore = 0;
var gameOver = true;

var snake = {
    x: 160,
    y: 160,
    xMove: gridSize,
    yMove: 0,
    cells: [],
    cell_count: 4
};

var apple = {
    name: "apple",
    color: "red",
    spawnCount: 1,
    action: function () {
        snake.cell_count++;
        gameScore++;
    }
};

var grape = {
    name: "grape",
    color: "purple",
    spawnCount: 6,
    action: function () {
        snake.cell_count++;
        gameScore++;
    }
};

var blueberry = {
    name: "blueberry",
    color: "blue",
    spawnCount: 1,
    action: function () {
        if (snake.cell_count > 4) {
            snake.cell_count = Math.floor(snake.cell_count / 2);
            for (var i = 0; i < snake.cell_count; i++) {
                snake.cells.pop();
            }
        }
    }
};

var pineapple = {
    name: "pineapple",
    color: "yellow",
    spawnCount: 3,
    snake_cell_add: 2,
    timer_reduce: 10,
    action: function () {
        gameTimer.value -= pineapple.timer_reduce;
        snake.cell_count += pineapple.snake_cell_add;
    }
};

var orange = {
    name: "orange",
    color: "orange",
    spawnCount: 1,
    timer_add: 20,
    action: function () {
        gameTimer.value += orange.timer_add;
    }
};

var bomb = {
    name: "bomb",
    color: "white",
    spawnCount: 4,
    action: function () {
        GameOver();
    }
};

var fruitOptions = [apple, grape, blueberry, pineapple, orange];
var fruit_on_board = [];

function CreateNewFruit(fruitType) {
    var new_fruit = {
        x: 0,
        y: 0,
        type: fruitType
    };

    var valid = true;

    new_fruit.x = gridSize * GetRandomInt(1, canvas.width / gridSize);
    new_fruit.y = gridSize * GetRandomInt(1, canvas.width / gridSize);

    snake.cells.forEach(function (cell) {
        if (new_fruit.x == cell.x && new_fruit.y == cell.y) {
            valid = false;
        }
    });

    fruit_on_board.forEach(function (f) {
        if (new_fruit.x == f.x && new_fruit.y == f.y) {
            valid = false;
        }
    });

    if (valid) {
        ctx.fillStyle = new_fruit.type.color;
        ctx.fillRect(new_fruit.x, new_fruit.y, gridSize - 1, gridSize - 1);
        fruit_on_board.push(new_fruit);
    } else {
        CreateNewFruit(fruitType);
    }
}

function SpawnNewFruit(type = null) {
    var new_fruit = type;
    if (new_fruit == null) {
        let randomIdx = Math.floor(Math.random() * fruitOptions.length);
        new_fruit = fruitOptions[randomIdx];
    }

    ctx.fillStyle = new_fruit.color;
    for (var i = 0; i < new_fruit.spawnCount; i++) {
        CreateNewFruit(new_fruit);
    }
}

function FruitUpdate() {
    if (fruit_on_board.length == 0) {
        SpawnNewFruit();
    } else {
        fruit_on_board.forEach(function (f) {
            ctx.fillStyle = f.type.color;
            ctx.fillRect(f.x, f.y, gridSize - 1, gridSize - 1);
        });
    }
}

var gameManager = {
    start: function () {
        setInterval(updateGameArea, 66.6666667);
    },
    clear: function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
};

var gameTimer = {
    value: 120,
    timer_interval: null,
    start: function () {
        gameTimer.timer_interval = setInterval(function () { gameTimer.update(); }, 1000);
    },
    stop: function () {
        clearInterval(gameTimer.timer_interval);
    },
    update: function () {
        gameTimer.value--;
        document.getElementById("timer").innerHTML = gameTimer.value;

        if (gameTimer.value <= 0) {
            GameOver();
        }
    }
};

function Start() {
    NewGame();
    gameManager.start();
}

function updateGameArea() {
    gameManager.clear();
    KeyDownListener();
    DrawGrid();
    SnakeUpdate();
    FruitUpdate();
    document.getElementById("score").innerHTML = "Score: " + gameScore;
}

function SnakeUpdate() {
    snake.x += snake.xMove;
    snake.y += snake.yMove;

    if (snake.x < 0) {
        snake.x = canvas.width - gridSize;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - gridSize;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    var snakeHeadPosition = { x: snake.x, y: snake.y };
    snake.cells.unshift(snakeHeadPosition);

    if (snake.cells.length > snake.cell_count) {
        snake.cells.pop();
    }

    ctx.fillStyle = '#e42069';
    snake.cells.forEach(function (cell) {
        ctx.fillRect(cell.x, cell.y, gridSize - 1, gridSize - 1);
    });

    fruit_on_board.forEach(function (fruit, index) {
        if (snakeHeadPosition.x == fruit.x && snakeHeadPosition.y == fruit.y) {
            fruit.type.action();
            fruit_on_board.splice(index, 1);
        }
    });

    snake.cells.forEach(function (cell, index) {
        if (snakeHeadPosition.x == cell.x && snakeHeadPosition.y == cell.y && index != 0) {
            GameOver();
        }
    });
}

function KeyDownListener() {
    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return;
        }

        if (!gameOver) {
            switch (event.key) {
                case "ArrowDown":
                case "s":
                    snake.xMove = 0;
                    snake.yMove = gridSize;
                    break;
                case "ArrowUp":
                case "w":
                    snake.xMove = 0;
                    snake.yMove = -gridSize;
                    break;
                case "ArrowLeft":
                case "a":
                    snake.xMove = -gridSize;
                    snake.yMove = 0;
                    break;
                case "ArrowRight":
                case "d":
                    snake.xMove = gridSize;
                    snake.yMove = 0;
                    break;
                default:
                    break;
            }
        } else {
            if (event.key === "Enter") {
                NewGame();
            }
        }

        event.preventDefault();
    }, true);
}

function DrawGrid() {
    for (var i = 0; i < canvas.width / gridSize; i++) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

function GetRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function NewGame() {
    this.snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.cell_count = 4;
    snake.xMove = gridSize;
    snake.yMove = 0;
    gameScore = 0;
    gameTimer.value = 120;
    gameOver = false;

    document.getElementById("gameover").style.display = "none";
    document.getElementById("resetbutton").style.display = "none";
    document.getElementById("timer").innerHTML = "120";

    fruit_on_board = [];
    SpawnNewFruit();
    gameTimer.start();
}

function GameOver() {
    snake.cell_count = 4;
    gameTimer.stop();
    gameOver = true;

    document.getElementById("gameover").style.display = "block";
    document.getElementById("resetbutton").style.display = "block";
}
