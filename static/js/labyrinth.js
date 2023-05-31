let labyrinth = [];
let playerPosition = { x: 0, y: 0 };
let exitPosition = { x: 0, y: 0 };
let score = 0;

const gridSize = 25; // You can adjust the size of the grid

function generateLabyrinth() {
    let isSolvable = false;

    while(!isSolvable) {
        for(let i = 0; i < gridSize; i++) {
            labyrinth[i] = [];
            for(let j = 0; j < gridSize; j++) {
                labyrinth[i][j] = Math.random() < 0.45 ? 'wall' : 'empty'; // 30% chance of a cell being a wall
            }
        }

        // Starting position for player and exit
        playerPosition = { x: 0, y: 0 };
        exitPosition = { x: gridSize - 1, y: gridSize - 1 };
        labyrinth[playerPosition.x][playerPosition.y] = 'player';
        labyrinth[exitPosition.x][exitPosition.y] = 'exit';

        // Check if the labyrinth is solvable using DFS
        isSolvable = dfs(playerPosition.x, playerPosition.y, []);
    }
}

function dfs(x, y, visited) {
    if(x < 0 || y < 0 || x >= gridSize || y >= gridSize || labyrinth[x][y] === 'wall') {
        return false;
    }

    // If we have already visited this cell, return
    for(let i = 0; i < visited.length; i++) {
        if(visited[i].x === x && visited[i].y === y) {
            return false;
        }
    }

    // Mark the cell as visited
    visited.push({ x: x, y: y });

    // If we have reached the exit, return true
    if(x === exitPosition.x && y === exitPosition.y) {
        return true;
    }

    // Try to find a path from the current cell to the exit
    return dfs(x - 1, y, visited) || dfs(x + 1, y, visited) || dfs(x, y - 1, visited) || dfs(x, y + 1, visited);
}



function movePlayer(dx, dy) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if(newX < 0 || newY < 0 || newX >= gridSize || newY >= gridSize || labyrinth[newX][newY] === 'wall') {
        // If the player tries to move out of the grid or into a wall, do nothing
        return;
    }

    labyrinth[playerPosition.x][playerPosition.y] = 'empty'; // Empty the previous player position
    playerPosition = { x: newX, y: newY };
    labyrinth[newX][newY] = 'player'; // Set new player position

    if(newX === exitPosition.x && newY === exitPosition.y) {
        score += 1;
        generateLabyrinth(); // Generate a new labyrinth when the player reaches the exit

        // Send score to server
        fetch('/leaderboard', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'score=' + score
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    renderGame(); // Re-render the game after moving the player
}


function renderGame() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = ''; // Clear the previous labyrinth

    const table = document.createElement('table');
    gameDiv.appendChild(table);

    for(let i = 0; i < gridSize; i++) {
        const row = document.createElement('tr');
        table.appendChild(row);

        for(let j = 0; j < gridSize; j++) {
            const cell = document.createElement('td');
            row.appendChild(cell);
            cell.className = labyrinth[i][j]; // The CSS class corresponds to the type of cell
        }
    }

    const scoreDiv = document.createElement('div');
    gameDiv.appendChild(scoreDiv);
    scoreDiv.id = 'score'; // Add id to the score div
    scoreDiv.textContent = 'Score: ' + score;
}


// Call these functions to start the game
generateLabyrinth();
renderGame(); // Render the game at the start

// Add event listeners for the arrow keys
window.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowUp':    movePlayer(-1, 0); break;
        case 'ArrowDown':  movePlayer(1, 0); break;
        case 'ArrowLeft':  movePlayer(0, -1); break;
        case 'ArrowRight': movePlayer(0, 1); break;
    }
});

document.getElementById('leaderboard-button').addEventListener('click', function() {
    window.location.href = '/leaderboard';
});