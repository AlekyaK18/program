// Bike Racing Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gameState = {
    score: 0,
    speed: 0,
    bikeX: canvas.width / 2,
    bikeY: canvas.height - 60,
    gameActive: true,
    obstacles: [],
    coins: [],
    scrollOffset: 0
};

class Bike {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height - 60;
        this.width = 30;
        this.height = 40;
        this.speed = 0;
    }

    update() {
        if (keys['ArrowLeft'] || keys['a']) {
            this.x -= 8;
        }
        if (keys['ArrowRight'] || keys['d']) {
            this.x += 8;
        }

        // Keep bike in bounds
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    }

    draw() {
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // Draw wheels
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 5, this.y + this.height - 5, 8, 8);
        ctx.fillRect(this.x + this.width - 13, this.y + this.height - 5, 8, 8);
    }
}

class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 50;
        this.speed = gameState.speed + 3;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        ctx.fillStyle = '#3498db';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#2980b9';
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
    }

    isOffScreen() {
        return this.y > canvas.height;
    }
}

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 8;
        this.speed = gameState.speed + 2;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    isOffScreen() {
        return this.y > canvas.height;
    }
}

const bike = new Bike();
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

function drawRoad() {
    // Draw road background
    ctx.fillStyle = '#34495e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw lane markings
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 3, gameState.scrollOffset % 40);
    ctx.lineTo(canvas.width / 3, gameState.scrollOffset % 40 + canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((canvas.width * 2) / 3, gameState.scrollOffset % 40);
    ctx.lineTo((canvas.width * 2) / 3, gameState.scrollOffset % 40 + canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function update() {
    gameState.scrollOffset += gameState.speed;
    gameState.speed = Math.min(gameState.speed + 0.1, 8);

    bike.update();

    // Update obstacles and coins
    gameState.obstacles.forEach((obs, i) => {
        obs.update();
        if (obs.isOffScreen()) {
            gameState.obstacles.splice(i, 1);
            gameState.score += 10;
        }
    });

    gameState.coins.forEach((coin, i) => {
        coin.update();
        if (coin.isOffScreen()) {
            gameState.coins.splice(i, 1);
        }
    });

    // Check collisions with obstacles
    gameState.obstacles.forEach((obs) => {
        if (
            bike.x < obs.x + obs.width &&
            bike.x + bike.width > obs.x &&
            bike.y < obs.y + obs.height &&
            bike.y + bike.height > obs.y
        ) {
            endGame();
        }
    });

    // Check collisions with coins
    gameState.coins.forEach((coin, i) => {
        if (
            bike.x < coin.x + coin.radius * 2 &&
            bike.x + bike.width > coin.x &&
            bike.y < coin.y + coin.radius * 2 &&
            bike.y + bike.height > coin.y
        ) {
            gameState.coins.splice(i, 1);
            gameState.score += 50;
        }
    });

    // Spawn obstacles
    if (Math.random() < 0.02) {
        const x = Math.random() * (canvas.width - 40);
        gameState.obstacles.push(new Obstacle(x, -50));
    }

    // Spawn coins
    if (Math.random() < 0.01) {
        const x = Math.random() * (canvas.width - 16);
        gameState.coins.push(new Coin(x, -20));
    }
}

function draw() {
    drawRoad();

    gameState.coins.forEach((coin) => coin.draw());
    gameState.obstacles.forEach((obs) => obs.draw());
    bike.draw();

    // Update UI
    document.getElementById('score').textContent = `Score: ${gameState.score}`;
    document.getElementById('speed').textContent = `Speed: ${Math.floor(gameState.speed)}`;
}

function endGame() {
    gameState.gameActive = false;
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('finalScore').textContent = `Final Score: ${gameState.score}`;
}

function gameLoop() {
    if (gameState.gameActive) {
        update();
        draw();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();