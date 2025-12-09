document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d')
    const scoreElement = document.getElementById('score')
    const gameOverElement = document.getElementById('gameOver')
    const restartBtn = document.getElementById('restartBtn')

    const gridSize = 20
    const tileCount = canvas.width / gridSize

    let snake = [{ x: 10, y: 10 }]
    let food = {}
    let dx = 0
    let dy = 0
    let score = 0
    let gameRunning = true

    function randomFood() {
        food = {
            x: Math.floor(Math.random() * titleCount),
            y: Math.floor(Math.random() * titleCount)
        }
    }

    function drawGame() {
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = '#4CAF50'
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2)
        })

        ctx.fillStyle = '#81C784'
        ctx.fillrRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize - 2, gridSize - 2)

        ctx.fillStyle = '#FF5722'
        ctx.beginPath()
        ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 1, 0, Math.PI * 2)
        ctx.fill()
    }

    function update() {
        if (!gameRunning) return;

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }

        for (let segment of snake) {
            if (head.x === segment.x && head.y === segment.y) {
                gameOver();
                return;
            }
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElement.textContent = score;
            randomFood();
        } else {
            snake.pop();
        }
    }

    function gameOver() {
        gameRunning = false;
        gameOverElement.classList.remove('d-none');
        restartBtn.classList.remove('btn-success');
        restartBtn.classList.add('btn-warning');
    }

    function restart() {
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        score = 0;
        scoreElement.textContent = score;
        gameOverElement.classList.add('d-none');
        restartBtn.classList.remove('btn-warning');
        restartBtn.classList.add('btn-success');
        gameRunning = true;
        randomFood();
    }

    // Event listeners
    document.addEventListener('keydown', (e) => {
        if (!gameRunning && e.code === 'Space') {
            e.preventDefault();
            restart();
            return;
        }

        if ((e.code === 'ArrowUp' && dy === 0) ||
            (e.code === 'ArrowDown' && dy === 0) ||
            (e.code === 'ArrowLeft' && dx === 0) ||
            (e.code === 'ArrowRight' && dx === 0)) {

            dx = 0;
            dy = 0;

            switch (e.code) {
                case 'ArrowUp': dy = -1; break;
                case 'ArrowDown': dy = 1; break;
                case 'ArrowLeft': dx = -1; break;
                case 'ArrowRight': dx = 1; break;
            }
        }
    });

    restartBtn.addEventListener('click', restart);

    // Game loop
    function gameLoop() {
        update();
        drawGame();
    }

    randomFood();
    setInterval(gameLoop, 150);

    // Prevent scrolling
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            e.preventDefault();
        }
    });
})