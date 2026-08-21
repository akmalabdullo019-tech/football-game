// Canvas va context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// O'yinchi va kompyuter
const player = {
    x: 50,
    y: canvas.height / 2 - 40,
    width: 30,
    height: 80,
    speed: 5,
    dy: 0,
    color: '#FF6B6B'
};

const computer = {
    x: canvas.width - 80,
    y: canvas.height / 2 - 40,
    width: 30,
    height: 80,
    speed: 4,
    dy: 0,
    color: '#4ECDC4'
};

// Shar
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 0,
    dy: 0,
    speed: 5,
    color: '#FFD700'
};

// O'yin holati
let gameRunning = false;
let playerScore = 0;
let computerScore = 0;
let ballOwner = 'neutral'; // 'player', 'computer', 'neutral'

// Tugmalar
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

// Tugma bosish holatlari
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    Space: false
};

// Tugma bosilganda
document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
        e.preventDefault();
    }
});

// Tugma bosilmasa
document.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
        e.preventDefault();
    }
});

// O'yinni boshlash
startBtn.addEventListener('click', () => {
    gameRunning = true;
    startBtn.disabled = true;
    resetBall();
});

// O'yinni qayta boshlash
resetBtn.addEventListener('click', () => {
    playerScore = 0;
    computerScore = 0;
    gameRunning = false;
    startBtn.disabled = false;
    resetBall();
    player.y = canvas.height / 2 - 40;
    computer.y = canvas.height / 2 - 40;
    updateScore();
});

// Sharni qayta boshlash
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 0;
    ball.dy = 0;
    ballOwner = 'neutral';
}

// O'yinchini harakat ettirish
function updatePlayer() {
    if (keys.ArrowUp && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }
    if (keys.Space) {
        kickBall('player');
    }
}

// Kompyuterni harakat ettirish (AI)
function updateComputer() {
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;
    
    // AI shart - agar shar kompyuter tomonga qarab ketayotgan bo'lsa
    if (ball.dx > 0) {
        if (computerCenter < ballCenter - 35) {
            computer.y += computer.speed;
        } else if (computerCenter > ballCenter + 35) {
            computer.y -= computer.speed;
        }
    }
    
    // Chegarani tekshirish
    if (computer.y < 0) computer.y = 0;
    if (computer.y > canvas.height - computer.height) {
        computer.y = canvas.height - computer.height;
    }
    
    // Tasodifiy uloq urish
    if (ballOwner === 'computer' && Math.random() < 0.02) {
        kickBall('computer');
    }
}

// Sharni uloq urish
function kickBall(kicker) {
    if (kicker === 'player' && Math.abs(ball.x - player.x) < 100) {
        ball.dx = 7;
        ball.dy = (Math.random() - 0.5) * 4;
        ballOwner = 'player';
    } else if (kicker === 'computer' && Math.abs(ball.x - computer.x) < 100) {
        ball.dx = -7;
        ball.dy = (Math.random() - 0.5) * 4;
        ballOwner = 'computer';
    }
}

// Sharni harakat ettirish
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Tepaga va pastga to'qnashish
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy *= -1;
        ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
    }
    
    // Chap tomon - gol (kompyuter yutdi)
    if (ball.x - ball.radius < 0) {
        computerScore++;
        updateScore();
        resetBall();
    }
    
    // O'ng tomon - gol (o'yinchi yutdi)
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        updateScore();
        resetBall();
    }
    
    // O'yinchi bilan to'qnashish
    if (
        ball.x > player.x &&
        ball.x < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.dx = Math.abs(ball.dx);
        ball.x = player.x + player.width;
    }
    
    // Kompyuter bilan to'qnashish
    if (
        ball.x > computer.x &&
        ball.x < computer.x + computer.width &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.dx = -Math.abs(ball.dx);
        ball.x = computer.x - ball.radius;
    }
    
    // Shart yo'qolib ketsa
    if (Math.abs(ball.dx) < 0.5 && Math.abs(ball.dy) < 0.5) {
        ball.dx = 0;
        ball.dy = 0;
    }
}

// Rasm chizish
function draw() {
    // Fon
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Maydon chizighlari
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Gol maydoni
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, canvas.height / 2 - 60, 20, 120);
    
    ctx.strokeStyle = '#4ECDC4';
    ctx.strokeRect(canvas.width - 20, canvas.height / 2 - 60, 20, 120);
    
    // O'yinchi chizish
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ME', player.x + player.width / 2, player.y + player.height / 2 + 5);
    
    // Kompyuter chizish
    ctx.fillStyle = computer.color;
    ctx.fillRect(computer.x, computer.y, computer.width, computer.height);
    ctx.fillStyle = 'white';
    ctx.fillText('AI', computer.x + computer.width / 2, computer.y + computer.height / 2 + 5);
    
    // Shar chizish
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Score yangilash
function updateScore() {
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
}

// O'yin siklasi
function gameLoop() {
    if (gameRunning) {
        updatePlayer();
        updateComputer();
        updateBall();
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}

// O'yinni boshlash
gameLoop();
updateScore();
