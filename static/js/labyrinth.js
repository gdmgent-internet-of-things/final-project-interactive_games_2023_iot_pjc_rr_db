let labyrinth = [];
let playerPosition = { x: 0, y: 0 };
let exitPosition = { x: 0, y: 0 };
let score = 0;

const gridSize = 8;

function generateLabyrinth() {
    let isSolvable = false;

    while(!isSolvable) {
        for(let i = 0; i < gridSize; i++) {
            labyrinth[i] = [];
            for(let j = 0; j < gridSize; j++) {
                labyrinth[i][j] = Math.random() < 0.28 ? 'wall' : 'empty';
            }
        }

        playerPosition = { x: 0, y: 0 };
        exitPosition = { x: gridSize - 1, y: gridSize - 1 };
        labyrinth[playerPosition.x][playerPosition.y] = 'player';
        labyrinth[exitPosition.x][exitPosition.y] = 'exit';

        isSolvable = dfs(playerPosition.x, playerPosition.y, []);
    }
}

function dfs(x, y, visited) {
    if(x < 0 || y < 0 || x >= gridSize || y >= gridSize || labyrinth[x][y] === 'wall') {
        return false;
    }

    for(let i = 0; i < visited.length; i++) {
        if(visited[i].x === x && visited[i].y === y) {
            return false;
        }
    }

    
    visited.push({ x: x, y: y });

    
    if(x === exitPosition.x && y === exitPosition.y) {
        return true;
    }

    
    return dfs(x - 1, y, visited) || dfs(x + 1, y, visited) || dfs(x, y - 1, visited) || dfs(x, y + 1, visited);
}



function movePlayer(dx, dy) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if(newX < 0 || newY < 0 || newX >= gridSize || newY >= gridSize || labyrinth[newX][newY] === 'wall') {
        return;
    }

    labyrinth[playerPosition.x][playerPosition.y] = 'empty'; 
    playerPosition = { x: newX, y: newY };
    labyrinth[newX][newY] = 'player'; 

    if(newX === exitPosition.x && newY === exitPosition.y) {
        score += 1;
        generateLabyrinth(); 

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

    renderGame(); 
}


function renderGame() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = '';

    const table = document.createElement('table');
    gameDiv.appendChild(table);

    for(let i = 0; i < gridSize; i++) {
        const row = document.createElement('tr');
        table.appendChild(row);

        for(let j = 0; j < gridSize; j++) {
            const cell = document.createElement('td');
            row.appendChild(cell);
            cell.className = labyrinth[i][j]; 
        }
    }

    const scoreDiv = document.createElement('div');
    gameDiv.appendChild(scoreDiv);
    scoreDiv.id = 'score'; 
    scoreDiv.textContent = 'Score: ' + score;
}



generateLabyrinth();
renderGame(); 


window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new window.SpeechRecognition();
recognition.lang = 'nl-NL';

recognition.start();

recognition.addEventListener('result', (e) => {
    const command = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');

    switch(command.toLowerCase()) {
        case 'diederik':
            movePlayer(-1, 0);
            break;
        case 'peter':
            movePlayer(1, 0);
            break;
        case 'ruben':
            movePlayer(0, -1);
            break;
        case 'jan':
            movePlayer(0, 1);
            break;
    }

    recognition.start();
});

recognition.addEventListener('end', recognition.start);

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