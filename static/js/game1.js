// Set up the maze dimensions
const mazeWidth = 1000;
const mazeHeight = 1000;

// Set up the colors
const backgroundColor = "#000000"; // Black
const mazeColor = "#00FF00"; // Green
const ballColor = "#FF0000"; // Red

// Set up the ball properties
const ballRadius = 10;
let ballX = mazeWidth / 2;
let ballY = mazeHeight / 2;
const ballSpeed = 4;

// Set up the maze structure
const maze = [
    "XXXXXXXXXXXXXXXXXXXXXXXXX",
    "X                     XXX",
    "X XXX XXXXXXXXXXX XXX XXX",
    "X X   X         X X X   X",
    "X X X XXXXXXX X X X X X X",
    "X X X     X X X X X X X X",
    "X X XXX X X X X X   X X X",
    "X X   X X X X X XXXXX X X",
    "X X X X X X   X     X X X",
    "X X X X X XXXXXXXXX X   X",
    "X X X X X           X XXX",
    "X X X X XXXXXXXXXXXXX XXX",
    "X X X                 XXX",
    "X X XXXXXXXX XXXXXXXX XXX",
    "X X                   X X",
    "X XXXXXXXXXXXXXXXXXXXXX X",
    "X                       X",
    "XXXXXXXXXXXXXXX XXXXXXXXX",
    "X                     X X",
    "X XXX XXXXXXXXXXX XXX X X",
    "X X   X         X X X X X",
    "X X X XXXXXXX X X X X X X",
    "X X X     X X X X X X X X",
    "X X XXX X X X X X X X   X",
    "X X X X X X X X XXX X X X",
    "X X X   X X   X       X X",
    "XXXXXXXXXXXXXXXXXXXXXXXXX"
]

// Set up the canvas
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
canvas.width = mazeWidth;
canvas.height = mazeHeight;

// Function to draw the maze
function drawMaze() {
  ctx.fillStyle = mazeColor;
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === "X") {
        ctx.fillRect(
          x * (mazeWidth / maze[y].length),
          y * (mazeHeight / maze.length),
          mazeWidth / maze[y].length,
          mazeHeight / maze.length
        );
      }
    }
  }
}

// Function to draw the ball
function drawBall() {
  ctx.fillStyle = ballColor;
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
}

// Function to check collision between the ball and maze walls
function checkCollision() {
  const colWidth = mazeWidth / maze[0].length;
  const rowHeight = mazeHeight / maze.length;
  const colIndex = Math.floor(ballX / colWidth);
  const rowIndex = Math.floor(ballY / rowHeight);
  return maze[rowIndex][colIndex] === "X";
}

// Main game loop
function gameLoop() {
  // Clear the canvas
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, mazeWidth, mazeHeight);

  // Move the ball
  if (keys.up && ballY - ballSpeed > ballRadius) {
    ballY -= ballSpeed;
    if (checkCollision()) {
      ballY += ballSpeed;
    }
  }
  if (keys.down && ballY + ballSpeed < mazeHeight - ballRadius) {
    ballY += ballSpeed;
    if (checkCollision()) {
      ballY -= ballSpeed;
    }
  }
  if (keys.left && ballX - ballSpeed > ballRadius) {
    ballX -= ballSpeed;
    if (checkCollision()) {
      ballX += ballSpeed;
    }
  }
  if (keys.right && ballX + ballSpeed < mazeWidth - ballRadius) {
    ballX += ballSpeed;
    if (checkCollision()) {
      ballX -= ballSpeed;
    }
  }

  // Draw the maze and the ball
  drawMaze();
  drawBall();

  requestAnimationFrame(gameLoop);
}

// Handle keyboard events
const keys = {
    up: false,
    down: false,
    left: false,
    right: false
  };
  
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      keys.up = true;
    } else if (event.key === "ArrowDown") {
      keys.down = true;
    } else if (event.key === "ArrowLeft") {
      keys.left = true;
    } else if (event.key === "ArrowRight") {
      keys.right = true;
    }
  });
  
  document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp") {
      keys.up = false;
    } else if (event.key === "ArrowDown") {
      keys.down = false;
    } else if (event.key === "ArrowLeft") {
      keys.left = false;
    } else if (event.key === "ArrowRight") {
      keys.right = false;
    }
  });
  
  // Start the game loop
  gameLoop();