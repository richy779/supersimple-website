document.getElementById('playButton').addEventListener('click', startGame);

function startGame() {
    const playButton = document.getElementById('playButton');
    const gameContainer = document.getElementById('gameContainer');
    
    playButton.style.display = 'none'; // Hide the play button
    gameContainer.style.display = 'block'; // Show the game container

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    gameContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let player = { x: 370, y: 500, width: 60, height: 20, speed: 5, bullets: [] };
    let enemies = Array.from({ length: 5 }, (_, i) => ({ x: i * 150 + 50, y: 50, width: 40, height: 20 }));

    function drawPlayer() {
        ctx.fillStyle = 'green';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawEnemies() {
        ctx.fillStyle = 'red';
        enemies.forEach(enemy => ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height));
    }

    function drawBullets() {
        ctx.fillStyle = 'yellow';
        player.bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, 5, 10));
    }

    function updateBullets() {
        player.bullets.forEach(bullet => bullet.y -= 5);
        player.bullets = player.bullets.filter(bullet => bullet.y > 0);
    }

    function detectCollision() {
        player.bullets.forEach((bullet, bIndex) => {
            enemies.forEach((enemy, eIndex) => {
                if (
                    bullet.x < enemy.x + enemy.width &&
                    bullet.x + 5 > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + 10 > enemy.y
                ) {
                    enemies.splice(eIndex, 1);
                    player.bullets.splice(bIndex, 1);
                }
            });
        });
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawEnemies();
        drawBullets();
        updateBullets();
        detectCollision();

        if (enemies.length > 0) {
            requestAnimationFrame(gameLoop);
        } else {
            alert('You Win!');
        }
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') player.x = Math.max(0, player.x - player.speed);
        if (event.key === 'ArrowRight') player.x = Math.min(canvas.width - player.width, player.x + player.speed);
        if (event.key === ' ') player.bullets.push({ x: player.x + player.width / 2, y: player.y });
    });

    gameLoop();
}
document.getElementById('playButton').addEventListener('click', startGame);

function startGame() {
    const playButton = document.getElementById('playButton');
    const gameContainer = document.getElementById('gameContainer');
    
    playButton.style.display = 'none'; // Hide the play button
    gameContainer.style.display = 'block'; // Show the game container

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    gameContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let player = { x: 370, y: 500, width: 60, height: 20, speed: 5, bullets: [], health: 100 };
    let enemies = createEnemies(5, 3);
    let score = 0;

    function createEnemies(rows, cols) {
        let enemiesArray = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                enemiesArray.push({
                    x: col * 150 + 50,
                    y: row * 50 + 50,
                    width: 40,
                    height: 20,
                    health: 2,
                    bullets: [],
                });
            }
        }
        return enemiesArray;
    }

    function drawPlayer() {
        ctx.fillStyle = 'green';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Health Bar
        ctx.fillStyle = 'red';
        ctx.fillRect(10, canvas.height - 20, player.health * 2, 10);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(10, canvas.height - 20, 200, 10);
    }

    function drawEnemies() {
        enemies.forEach(enemy => {
            ctx.fillStyle = enemy.health > 1 ? 'orange' : 'red';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    function drawBullets(bullets, color) {
        ctx.fillStyle = color;
        bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, 5, 10));
    }

    function updateBullets() {
        player.bullets.forEach(bullet => (bullet.y -= 5));
        player.bullets = player.bullets.filter(bullet => bullet.y > 0);

        enemies.forEach(enemy => {
            enemy.bullets.forEach(bullet => (bullet.y += 4));
            enemy.bullets = enemy.bullets.filter(bullet => bullet.y < canvas.height);
        });
    }

    function detectCollision() {
        // Player Bullets
        player.bullets.forEach((bullet, bIndex) => {
            enemies.forEach((enemy, eIndex) => {
                if (
                    bullet.x < enemy.x + enemy.width &&
                    bullet.x + 5 > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + 10 > enemy.y
                ) {
                    enemy.health -= 1;
                    player.bullets.splice(bIndex, 1);
                    if (enemy.health <= 0) {
                        enemies.splice(eIndex, 1);
                        score += 10;
                    }
                }
            });
        });

        // Enemy Bullets
        enemies.forEach(enemy => {
            enemy.bullets.forEach((bullet, bIndex) => {
                if (
                    bullet.x < player.x + player.width &&
                    bullet.x + 5 > player.x &&
                    bullet.y < player.y + player.height &&
                    bullet.y + 10 > player.y
                ) {
                    player.health -= 10;
                    enemy.bullets.splice(bIndex, 1);
                }
            });
        });
    }

    function fireEnemyBullets() {
        enemies.forEach(enemy => {
            if (Math.random() < 0.02) {
                enemy.bullets.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height });
            }
        });
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPlayer();
        drawEnemies();
        drawBullets(player.bullets, 'yellow');
        enemies.forEach(enemy => drawBullets(enemy.bullets, 'red'));

        updateBullets();
        detectCollision();
        fireEnemyBullets();

        // End Game Conditions
        if (player.health <= 0) {
            alert(`Game Over! Your score: ${score}`);
            location.reload();
        } else if (enemies.length === 0) {
            alert('Level Cleared! Prepare for the next challenge!');
            enemies = createEnemies(6, 4);
        } else {
            requestAnimationFrame(gameLoop);
        }
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') player.x = Math.max(0, player.x - player.speed);
        if (event.key === 'ArrowRight') player.x = Math.min(canvas.width - player.width, player.x + player.speed);
        if (event.key === ' ') player.bullets.push({ x: player.x + player.width / 2, y: player.y });
    });

    gameLoop();
}
// Loading sound effects
const shootSound = new Audio('assets/sounds/shoot.mp3');
const enemyHitSound = new Audio('assets/sounds/enemy_hit.mp3');
const playerHitSound = new Audio('assets/sounds/player_hit.mp3');
const levelUpSound = new Audio('assets/sounds/level_up.mp3');

document.getElementById('playButton').addEventListener('click', startGame);

function startGame() {
    const playButton = document.getElementById('playButton');
    const gameContainer = document.getElementById('gameContainer');
    
    playButton.style.display = 'none'; // Hide the play button
    gameContainer.style.display = 'block'; // Show the game container

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    gameContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let player = { x: 370, y: 500, width: 60, height: 20, speed: 5, bullets: [], health: 100 };
    let enemies = createEnemies(5, 3);
    let score = 0;
    let level = 1;

    function createEnemies(rows, cols) {
        let enemiesArray = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                enemiesArray.push({
                    x: col * 150 + 50,
                    y: row * 50 + 50,
                    width: 40,
                    height: 20,
                    health: 2,
                    bullets: [],
                });
            }
        }
        return enemiesArray;
    }

    function drawPlayer() {
        ctx.fillStyle = 'green';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Health Bar
        ctx.fillStyle = 'red';
        ctx.fillRect(10, canvas.height - 20, player.health * 2, 10);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(10, canvas.height - 20, 200, 10);
    }

    function drawEnemies() {
        enemies.forEach(enemy => {
            ctx.fillStyle = enemy.health > 1 ? 'orange' : 'red';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    function drawBullets(bullets, color) {
        ctx.fillStyle = color;
        bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, 5, 10));
    }

    function updateBullets() {
        player.bullets.forEach(bullet => (bullet.y -= 5));
        player.bullets = player.bullets.filter(bullet => bullet.y > 0);

        enemies.forEach(enemy => {
            enemy.bullets.forEach(bullet => (bullet.y += 4));
            enemy.bullets = enemy.bullets.filter(bullet => bullet.y < canvas.height);
        });
    }

    function detectCollision() {
        // Player Bullets
        player.bullets.forEach((bullet, bIndex) => {
            enemies.forEach((enemy, eIndex) => {
                if (
                    bullet.x < enemy.x + enemy.width &&
                    bullet.x + 5 > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + 10 > enemy.y
                ) {
                    enemy.health -= 1;
                    player.bullets.splice(bIndex, 1);
                    enemyHitSound.play(); // Play enemy hit sound
                    if (enemy.health <= 0) {
                        enemies.splice(eIndex, 1);
                        score += 10;
                    }
                }
            });
        });

        // Enemy Bullets
        enemies.forEach(enemy => {
            enemy.bullets.forEach((bullet, bIndex) => {
                if (
                    bullet.x < player.x + player.width &&
                    bullet.x + 5 > player.x &&
                    bullet.y < player.y + player.height &&
                    bullet.y + 10 > player.y
                ) {
                    player.health -= 10;
                    playerHitSound.play(); // Play player hit sound
                    enemy.bullets.splice(bIndex, 1);
                }
            });
        });
    }

    function fireEnemyBullets() {
        enemies.forEach(enemy => {
            if (Math.random() < 0.02) {
                enemy.bullets.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height });
            }
        });
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPlayer();
        drawEnemies();
        drawBullets(player.bullets, 'yellow');
        enemies.forEach(enemy => drawBullets(enemy.bullets, 'red'));

        updateBullets();
        detectCollision();
        fireEnemyBullets();

        // Score Display
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width - 120, 30);
        ctx.fillText(`Level: ${level}`, 10, 30);

        // End Game Conditions
        if (player.health <= 0) {
            alert(`Game Over! Your score: ${score}`);
            location.reload();
        } else if (enemies.length === 0) {
            levelUpSound.play(); // Play level-up sound
            level++;
            enemies = createEnemies(6 + level, 4 + level); // Increase difficulty with each level
        } else {
            requestAnimationFrame(gameLoop);
        }
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') player.x = Math.max(0, player.x - player.speed);
        if (event.key === 'ArrowRight') player.x = Math.min(canvas.width - player.width, player.x + player.speed);
        if (event.key === ' ') {
            player.bullets.push({ x: player.x + player.width / 2, y: player.y });
            shootSound.play(); // Play shooting sound
        }
    });

    gameLoop();
}
// Loading sound effects
const shootSound = new Audio('assets/sounds/shoot.mp3');
const enemyHitSound = new Audio('assets/sounds/enemy_hit.mp3');
const playerHitSound = new Audio('assets/sounds/player_hit.mp3');
const levelUpSound = new Audio('assets/sounds/level_up.mp3');

document.getElementById('playButton').addEventListener('click', startGame);

function startGame() {
    const playButton = document.getElementById('playButton');
    const gameContainer = document.getElementById('gameContainer');
    
    playButton.style.display = 'none'; // Hide the play button
    gameContainer.style.display = 'block'; // Show the game container

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    gameContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let player = { x: 370, y: 500, width: 60, height: 20, speed: 5, bullets: [], health: 100 };
    let enemies = createEnemies(5, 3);
    let score = 0;
    let level = 1;

    function createEnemies(rows, cols) {
        let enemiesArray = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                enemiesArray.push({
                    x: col * 150 + 50,
                    y: row * 50 + 50,
                    width: 40,
                    height: 20,
                    health: 2,
                    bullets: [],
                });
            }
        }
        return enemiesArray;
    }

    function drawPlayer() {
        ctx.fillStyle = 'green';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Health Bar
        ctx.fillStyle = 'red';
        ctx.fillRect(10, canvas.height - 20, player.health * 2, 10);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(10, canvas.height - 20, 200, 10);
    }

    function drawEnemies() {
        enemies.forEach(enemy => {
            ctx.fillStyle = enemy.health > 1 ? 'orange' : 'red';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    function drawBullets(bullets, color) {
        ctx.fillStyle = color;
        bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, 5, 10));
    }

    function updateBullets() {
        player.bullets.forEach(bullet => (bullet.y -= 5));
        player.bullets = player.bullets.filter(bullet => bullet.y > 0);

        enemies.forEach(enemy => {
            enemy.bullets.forEach(bullet => (bullet.y += 4));
            enemy.bullets = enemy.bullets.filter(bullet => bullet.y < canvas.height);
        });
    }

    function detectCollision() {
        // Player Bullets
        player.bullets.forEach((bullet, bIndex) => {
            enemies.forEach((enemy, eIndex) => {
                if (
                    bullet.x < enemy.x + enemy.width &&
                    bullet.x + 5 > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + 10 > enemy.y
                ) {
                    enemy.health -= 1;
                    player.bullets.splice(bIndex, 1);
                    enemyHitSound.play(); // Play enemy hit sound
                    if (enemy.health <= 0) {
                        enemies.splice(eIndex, 1);
                        score += 10;
                    }
                }
            });
        });

        // Enemy Bullets
        enemies.forEach(enemy => {
            enemy.bullets.forEach((bullet, bIndex) => {
                if (
                    bullet.x < player.x + player.width &&
                    bullet.x + 5 > player.x &&
                    bullet.y < player.y + player.height &&
                    bullet.y + 10 > player.y
                ) {
                    player.health -= 10;
                    playerHitSound.play(); // Play player hit sound
                    enemy.bullets.splice(bIndex, 1);
                }
            });
        });
    }

    function fireEnemyBullets() {
        enemies.forEach(enemy => {
            if (Math.random() < 0.02) {
                enemy.bullets.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height });
            }
        });
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPlayer();
        drawEnemies();
        drawBullets(player.bullets, 'yellow');
        enemies.forEach(enemy => drawBullets(enemy.bullets, 'red'));

        updateBullets();
        detectCollision();
        fireEnemyBullets();

        // Score Display
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width - 120, 30);
        ctx.fillText(`Level: ${level}`, 10, 30);

        // End Game Conditions
        if (player.health <= 0) {
            alert(`Game Over! Your score: ${score}`);
            location.reload();
        } else if (enemies.length === 0) {
            levelUpSound.play(); // Play level-up sound
            level++;
            enemies = createEnemies(6 + level, 4 + level); // Increase difficulty with each level
        } else {
            requestAnimationFrame(gameLoop);
        }
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') player.x = Math.max(0, player.x - player.speed);
        if (event.key === 'ArrowRight') player.x = Math.min(canvas.width - player.width, player.x + player.speed);
        if (event.key === ' ') {
            player.bullets.push({ x: player.x + player.width / 2, y: player.y });
            shootSound.play(); // Play shooting sound
        }
    });

    gameLoop();
}
let powerUps = [];

function spawnPowerUps() {
    if (Math.random() < 0.02) {
        let powerUpType = Math.random() < 0.5 ? 'health' : 'damage';
        powerUps.push({
            x: Math.random() * canvas.width,
            y: -20,
            width: 30,
            height: 30,
            type: powerUpType,
        });
    }
}

function drawPowerUps() {
    powerUps.forEach(powerUp => {
        ctx.fillStyle = powerUp.type === 'health' ? 'blue' : 'yellow';
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    });
}

function updatePowerUps() {
    powerUps.forEach(powerUp => (powerUp.y += 2));
    powerUps = powerUps.filter(powerUp => powerUp.y < canvas.height);
}

function detectPowerUpCollision() {
    powerUps.forEach((powerUp, pIndex) => {
        if (
            powerUp.x < player.x + player.width &&
            powerUp.x + powerUp.width > player.x &&
            powerUp.y < player.y + player.height &&
            powerUp.y + powerUp.height > player.y
        ) {
            if (powerUp.type === 'health') {
                player.health = Math.min(100, player.health + 20); // Heal the player
            } else if (powerUp.type === 'damage') {
                // Boost player damage for a limited time
                player.speed = 7; // Example of damage boost (speed can represent this)
                setTimeout(() => player.speed = 5, 5000); // Reset after 5 seconds
            }
            powerUps.splice(pIndex, 1);
        }
    });
}

// Update the game loop to include power-up handling
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawEnemies();
    drawBullets(player.bullets, 'yellow');
    enemies.forEach(enemy => drawBullets(enemy.bullets, 'red'));
    drawPowerUps();
    
    spawnPowerUps();
    updatePowerUps();
    detectCollision();
    detectPowerUpCollision();
    fireEnemyBullets();

    // Score Display
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 120, 30);
    ctx.fillText(`Level: ${level}`, 10, 30);

    // End Game Conditions
    if (player.health <= 0) {
        alert(`Game Over! Your score: ${score}`);
        location.reload();
    } else if (enemies.length === 0) {
        levelUpSound.play(); // Play level-up sound
        level++;
        enemies = createEnemies(6 + level, 4 + level); // Increase difficulty with each level
    } else {
        requestAnimationFrame(gameLoop);
    }
}
// Loading sound effects
const shootSound = new Audio('assets/sounds/shoot.mp3');
const enemyHitSound = new Audio('assets/sounds/enemy_hit.mp3');
const playerHitSound = new Audio('assets/sounds/player_hit.mp3');
const levelUpSound = new Audio('assets/sounds/level_up.mp3');
const gameOverSound = new Audio('assets/sounds/game_over.mp3');

document.getElementById('playButton').addEventListener('click', startGame);

function startGame() {
    const playButton = document.getElementById('playButton');
    const gameContainer = document.getElementById('gameContainer');
    
    playButton.style.display = 'none'; // Hide the play button
    gameContainer.style.display = 'block'; // Show the game container

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    gameContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let player = { x: 370, y: 500, width: 60, height: 20, speed: 5, bullets: [], health: 100 };
    let enemies = createEnemies(5, 3);
    let score = 0;
    let level = 1;
    let isPaused = false;
    let gameOver = false;

    function createEnemies(rows, cols) {
        let enemiesArray = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                enemiesArray.push({
                    x: col * 150 + 50,
                    y: row * 50 + 50,
                    width: 40,
                    height: 20,
                    health: 2,
                    bullets: [],
                });
            }
        }
        return enemiesArray;
    }

    function drawPlayer() {
        ctx.fillStyle = 'green';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Health Bar
        ctx.fillStyle = 'red';
        ctx.fillRect(10, canvas.height - 20, player.health * 2, 10);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(10, canvas.height - 20, 200, 10);
    }

    function drawEnemies() {
        enemies.forEach(enemy => {
            ctx.fillStyle = enemy.health > 1 ? 'orange' : 'red';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    function drawBullets(bullets, color) {
        ctx.fillStyle = color;
        bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, 5, 10));
    }

    function updateBullets() {
        player.bullets.forEach(bullet => (bullet.y -= 5));
        player.bullets = player.bullets.filter(bullet => bullet.y > 0);

        enemies.forEach(enemy => {
            enemy.bullets.forEach(bullet => (bullet.y += 4));
            enemy.bullets = enemy.bullets.filter(bullet => bullet.y < canvas.height);
        });
    }

    function detectCollision() {
        // Player Bullets
        player.bullets.forEach((bullet, bIndex) => {
            enemies.forEach((enemy, eIndex) => {
                if (
                    bullet.x < enemy.x + enemy.width &&
                    bullet.x + 5 > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + 10 > enemy.y
                ) {
                    enemy.health -= 1;
                    player.bullets.splice(bIndex, 1);
                    enemyHitSound.play(); // Play enemy hit sound
                    if (enemy.health <= 0) {
                        enemies.splice(eIndex, 1);
                        score += 10;
                    }
                }
            });
        });

        // Enemy Bullets
        enemies.forEach(enemy => {
            enemy.bullets.forEach((bullet, bIndex) => {
                if (
                    bullet.x < player.x + player.width &&
                    bullet.x + 5 > player.x &&
                    bullet.y < player.y + player.height &&
                    bullet.y + 10 > player.y
                ) {
                    player.health -= 10;
                    playerHitSound.play(); // Play player hit sound
                    enemy.bullets.splice(bIndex, 1);
                }
            });
        });
    }

    function fireEnemyBullets() {
        enemies.forEach(enemy => {
            if (Math.random() < 0.02) {
                enemy.bullets.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height });
            }
        });
    }

    function showGameOver() {
        gameOverSound.play();
        gameOver = true;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('GAME OVER', canvas.width / 2 - 90, canvas.height / 2 - 50);
        ctx.fillText(`Score: ${score}`, canvas.width / 2 - 70, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Press R to Restart', canvas.width / 2 - 80, canvas.height / 2 + 50);
    }

    function gameLoop() {
        if (gameOver) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPlayer();
        drawEnemies();
        drawBullets(player.bullets, 'yellow');
        enemies.forEach(enemy => drawBullets(enemy.bullets, 'red'));

        updateBullets();
        detectCollision();
        fireEnemyBullets();

        // Score Display
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width - 120, 30);
        ctx.fillText(`Level: ${level}`, 10, 30);

        // End Game Conditions
        if (player.health <= 0) {
            showGameOver();
        } else if (enemies.length === 0) {
            levelUpSound.play(); // Play level-up sound
            level++;
            enemies = createEnemies(6 + level, 4 + level); // Increase difficulty with each level
        } else {
            requestAnimationFrame(gameLoop);
        }
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') player.x = Math.max(0, player.x - player.speed);
        if (event.key === 'ArrowRight') player.x = Math.min(canvas.width - player.width, player.x + player.speed);
        if (event.key === ' ') {
            player.bullets.push({ x: player.x + player.width / 2, y: player.y });
            shootSound.play(); // Play shooting sound
        }
        if (event.key === 'P') {
            isPaused = !isPaused;
            if (isPaused) {
                cancelAnimationFrame(gameLoop);
            } else {
                gameLoop();
            }
        }
        if (event.key === 'R' && gameOver) {
            location.reload(); // Restart the game
        }
    });

    gameLoop();
}
