document.addEventListener('DOMContentLoaded', () => {
    const mainView = document.getElementById('main-view');
    const projectView = document.getElementById('project-view');
    const projectContentDiv = document.getElementById('project-content');
    const backBtn = document.getElementById('back-btn');

    // This function contains the HTML for the Dizzy Wheel game.
    function getDizzyWheelHTML() {
        return `
            <div class="game-container">
                <h1 class="text-3xl font-bold mb-4">Dizzy Wheel</h1>
                <p class="text-gray-400 mb-6" id="instructions">Press space to start</p>
                <div id="gameScreen">
                    <div class="text-center mb-4">
                        Score: <span id="scoreDisplay" class="font-bold text-4xl">0</span>
                    </div>
                    <canvas id="gameCanvas" width="300" height="300"></canvas>
                </div>
                <div id="gameOverScreen" class="game-over-screen hidden">
                    <h2 class="text-2xl font-semibold mb-4">Game Over!</h2>
                    <p class="mb-6">Your final score is <span id="finalScoreDisplay" class="font-bold text-xl text-yellow-300">0</span>.</p>
                    <button id="restartButton" class="button">Play Again</button>
                </div>
            </div>
        `;
    }

    // This function contains the core logic for the Dizzy Wheel game.
    function initializeDizzyWheel() {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const gameScreen = document.getElementById('gameScreen');
        const gameOverScreen = document.getElementById('gameOverScreen');
        const scoreDisplay = document.getElementById('scoreDisplay');
        const finalScoreDisplay = document.getElementById('finalScoreDisplay');
        const restartButton = document.getElementById('restartButton');
        const instructions = document.getElementById('instructions');

        let wheelSpeed = 0.03;
        let wheelAngle = 0;
        let score = 0;
        let isGameActive = false;
        const colors = ['#3B82F6', '#EF4444', '#FACC15', '#22C55E'];
        let targetColorIndex = 0;
        let previousSectionIndex = -1;
        const sectionAngle = (2 * Math.PI) / colors.length;
        const handOffsetAngle = Math.PI / 2;
        const angleEpsilon = 0.001;

        function init() {
            score = 0;
            wheelSpeed = 0.03;
            wheelAngle = 0;
            targetColorIndex = Math.floor(Math.random() * colors.length);
            previousSectionIndex = -1;
            scoreDisplay.textContent = score;
            instructions.textContent = "Press space to start";
            gameScreen.classList.remove('hidden');
            gameOverScreen.classList.add('hidden');
            drawInitialState();
        }

        function startGame() {
            isGameActive = true;
            instructions.textContent = "Tap or press space to match the color!";
            requestAnimationFrame(update);
        }

        function endGame() {
            isGameActive = false;
            finalScoreDisplay.textContent = score;
            gameScreen.classList.add('hidden');
            gameOverScreen.classList.remove('hidden');
        }

        function drawInitialState() {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const outerRadius = 120;
            const innerRadius = 80;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawWheel();
            drawHand();
        }

        function drawWheel() {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const outerRadius = 120;
            const innerRadius = 80;

            for (let i = 0; i < colors.length; i++) {
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, outerRadius, i * sectionAngle, (i + 1) * sectionAngle);
                ctx.fillStyle = colors[i];
                ctx.fill();
                ctx.closePath();
            }
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
            ctx.fillStyle = '#2d3748';
            ctx.fill();
            ctx.closePath();
        }

        function drawHand() {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = 120;
            
            const handAngle = wheelAngle - handOffsetAngle;

            const endX = centerX + radius * Math.cos(handAngle);
            const endY = centerY + radius * Math.sin(handAngle);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = colors[targetColorIndex];
            ctx.lineWidth = 10;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.closePath();
        }

        function update() {
            if (!isGameActive) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            wheelAngle += wheelSpeed;

            const normalizedAngle = (wheelAngle - handOffsetAngle + 2 * Math.PI) % (2 * Math.PI);
            const currentSectionIndex = Math.floor((normalizedAngle + angleEpsilon) / sectionAngle);

            if (previousSectionIndex !== -1 && currentSectionIndex !== targetColorIndex && previousSectionIndex === targetColorIndex) {
                endGame();
                return;
            }

            previousSectionIndex = currentSectionIndex;

            drawWheel();
            drawHand();

            requestAnimationFrame(update);
        }

        function handleTap() {
            if (!isGameActive) return;

            const normalizedAngle = (wheelAngle - handOffsetAngle + 2 * Math.PI) % (2 * Math.PI);
            const currentSectionIndex = Math.floor((normalizedAngle + angleEpsilon) / sectionAngle);
            
            if (currentSectionIndex === targetColorIndex) {
                score++;
                scoreDisplay.textContent = score;
                wheelSpeed *= -1.05;
                
                let newTargetIndex;
                do {
                    newTargetIndex = Math.floor(Math.random() * colors.length);
                } while (newTargetIndex === targetColorIndex);
                targetColorIndex = newTargetIndex;
                
            } else {
                endGame();
            }
        }

        if (restartButton) restartButton.addEventListener('click', init);
        if (canvas) canvas.addEventListener('click', handleTap);

        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                if (!isGameActive) {
                    startGame();
                } else {
                    handleTap();
                }
            }
        });

        init();
    }

    // This function contains the HTML for the Stacker game.
    function getStackerHTML() {
        return `
            <div id="stacker-game-container">
                <div id="game-title">STACKER</div>
                <div id="game-grid"></div>
                <div id="score-display">0</div>
                <div id="game-over-screen" style="display:none;">
                    <h1 id="end-message"></h1>
                    <p style="font-size: 1.5em;">Score: <span id="final-score"></span></p>
                    <button id="playAgainButton" class="button">Play Again</button>
                </div>
            </div>
        `;
    }

    // This function contains the core logic for the Stacker game.
    function initializeStacker() {
        const gameGrid = document.getElementById('game-grid');
        const scoreDisplay = document.getElementById('score-display');
        const gameOverScreen = document.getElementById('game-over-screen');
        const finalScoreDisplay = document.getElementById('final-score');
        const gameAreaContainer = document.getElementById('stacker-game-container');
        const endMessage = document.getElementById('end-message');
        const playAgainButton = document.getElementById('playAgainButton');
        
        let gridCells = [];
        let currentBlock = null;
        let stack = [];
        let score = 0;
        let gameActive = false;
        let direction = 1;
        let animationInterval;
        let intervalTime = 150;
        
        const GRID_WIDTH = 15;
        const GRID_HEIGHT = 20;
        const BLOCK_WIDTH = 5;

        // Initialize grid cells
        for (let i = 0; i < GRID_WIDTH * GRID_HEIGHT; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            gameGrid.appendChild(cell);
            gridCells.push(cell);
        }

        function getCellIndex(x, y) {
            return (GRID_HEIGHT - 1 - y) * GRID_WIDTH + x;
        }

        function drawGame() {
            gridCells.forEach(cell => {
                cell.classList.remove('block-cell');
            });
            
            stack.forEach(block => {
                for (let i = 0; i < block.width; i++) {
                    const index = getCellIndex(block.x + i, block.y);
                    if (index >= 0 && index < gridCells.length) {
                        gridCells[index].classList.add('block-cell');
                    }
                }
            });

            if (currentBlock) {
                for (let i = 0; i < currentBlock.width; i++) {
                    const index = getCellIndex(currentBlock.x + i, currentBlock.y);
                    if (index >= 0 && index < gridCells.length) {
                        gridCells[index].classList.add('block-cell');
                    }
                }
            }
        }

        function startGame() {
            // Clear the grid visually
            gridCells.forEach(cell => {
                cell.classList.remove('block-cell');
            });
            
            gameActive = true;
            score = 0;
            stack = [];
            direction = 1;
            intervalTime = 150;
            scoreDisplay.textContent = score;
            gameOverScreen.style.display = 'none';
            createBlock();
            startAnimation();
        }

        function createBlock() {
            let initialWidth = stack.length > 0 ? stack[stack.length - 1].width : BLOCK_WIDTH;
            let initialX = Math.floor((GRID_WIDTH - initialWidth) / 2);
            let initialY = stack.length;
            
            currentBlock = {
                x: initialX,
                y: initialY,
                width: initialWidth,
                perfect: false
            };
        }
        
        function startAnimation() {
            animationInterval = setInterval(() => {
                const nextX = currentBlock.x + direction;
                const nextWidth = currentBlock.width;

                if (nextX + nextWidth > GRID_WIDTH || nextX < 0) {
                    direction *= -1;
                } else {
                    currentBlock.x = nextX;
                }
                drawGame();
            }, intervalTime);
        }

        function placeBlock() {
            if (!gameActive) {
                return;
            }
            clearInterval(animationInterval);
            
            let lastBlock = stack.length > 0 ? stack[stack.length - 1] : null;

            if (lastBlock) {
                const overlapStart = Math.max(currentBlock.x, lastBlock.x);
                const overlapEnd = Math.min(currentBlock.x + currentBlock.width, lastBlock.x + lastBlock.width);
                const overlap = overlapEnd - overlapStart;

                if (overlap <= 0) {
                    endGame(false);
                    return;
                }

                currentBlock.x = overlapStart;
                currentBlock.width = overlap;
                
                score += 1;
            } else {
                currentBlock.y = 0;
                score += 1;
            }

            scoreDisplay.textContent = score;
            stack.push(currentBlock);
            
            if (stack.length >= GRID_HEIGHT) {
                endGame(true);
            } else {
                intervalTime *= 0.90;
                createBlock();
                startAnimation();
            }
        }

        function handleKeyDown(event) {
            if (event.code === 'Space') {
                event.preventDefault();
                if (gameActive) {
                    placeBlock();
                }
            }
        }
        
        function endGame(won = false) {
            gameActive = false;
            clearInterval(animationInterval);
            finalScoreDisplay.textContent = score;

            if (won) {
                endMessage.textContent = "You Win!";
            } else {
                endMessage.textContent = "Game Over";
            }

            gameOverScreen.style.display = 'flex';
        }
        
        // Add event listeners for starting the game.
        gameAreaContainer.addEventListener('click', placeBlock);
        document.addEventListener('keydown', handleKeyDown);
        if (playAgainButton) playAgainButton.addEventListener('click', startGame);

        startGame();
    }
    
    // This function returns the HTML and scripts for the Hex Guessing Game.
    function getHexGuessingGameHTML() {
        return `
            <div class="hex-game-container">
                <div class="hex-header-text">WHAT THE HEX?</div>
                <div id="hex-code">#B08992</div>
                <div class="color-grid" id="color-grid">
                </div>
                <div id="message">GUESS THE COLOR</div>
                <button id="new-game-button" class="new-game-button">NEW GAME</button>

                <div class="difficulty-section">
                    DIFFICULTY: 
                    <span data-difficulty="2">2</span> 
                    <span data-difficulty="3">3</span> 
                    <span data-difficulty="4">4</span> 
                    <span data-difficulty="5">5</span> 
                    <span data-difficulty="6">6</span> 
                    <span data-difficulty="7">7</span> 
                    <span data-difficulty="8">8</span> 
                    <span data-difficulty="9">9</span> 
                    <span data-difficulty="10">10</span> 
                    <span data-difficulty="48">48</span> 
                    <span data-difficulty="100">100</span> 
                </div>
            </div>
        `;
    }

    // New function to initialize the Hex Guessing Game's logic
    function initializeHexGuessingGame() {
        const hexCodeElement = document.getElementById('hex-code');
        const colorGrid = document.getElementById('color-grid');
        const messageElement = document.getElementById('message');
        const newGameButton = document.getElementById('new-game-button');
        const difficultySpans = document.querySelectorAll('.difficulty-section span');

        let correctAnswerHex;
        let numberOfOptions = 5;

        function generateRandomHex() {
            const hexCharacters = '0123456789ABCDEF';
            let hex = '#';
            for (let i = 0; i < 6; i++) {
                hex += hexCharacters[Math.floor(Math.random() * 16)];
            }
            return hex;
        }

        function rgbToHex(rgb) {
            const rgbValues = rgb.match(/\d+/g);
            if (!rgbValues || rgbValues.length < 3) return "";

            let hex = "#";
            for (let i = 0; i < 3; i++) {
                let hexComponent = parseInt(rgbValues[i]).toString(16);
                hex += (hexComponent.length === 1) ? "0" + hexComponent : hexComponent;
            }
            return hex.toUpperCase();
        }

        function newRound() {
            correctAnswerHex = generateRandomHex();
            hexCodeElement.textContent = correctAnswerHex;
            hexCodeElement.style.color = '#333333';
            messageElement.textContent = 'GUESS THE COLOR';
            messageElement.style.color = '#333333';
            newGameButton.style.display = 'none';

            const optionsSet = new Set();
            optionsSet.add(correctAnswerHex);
            while (optionsSet.size < numberOfOptions) {
                optionsSet.add(generateRandomHex());
            }

            const allOptions = Array.from(optionsSet);
            allOptions.sort(() => Math.random() - 0.5);

            colorGrid.innerHTML = ''; 
            allOptions.forEach(color => {
                const button = document.createElement('button');
                button.classList.add('color-option');
                button.style.backgroundColor = color;
                button.addEventListener('click', handleGuess);
                colorGrid.appendChild(button);
            });
        }

        function handleGuess(event) {
            const userGuessButton = event.target;
            const userGuessRgb = userGuessButton.style.backgroundColor;
            const userGuessHex = rgbToHex(userGuessRgb);

            if (userGuessHex === correctAnswerHex) {
                messageElement.textContent = 'CORRECT!';
                messageElement.style.color = '#333333';
                hexCodeElement.style.color = correctAnswerHex;
                
                colorGrid.querySelectorAll('.color-option').forEach(button => {
                    if (button === userGuessButton) {
                        button.classList.add('winner-state');
                    } else {
                        button.classList.add('guessed-incorrectly');
                    }
                });
                
                newGameButton.style.display = 'block';
                
            } else {
                messageElement.innerHTML = `Wrong, that color was: <span style="color: ${userGuessHex};">${userGuessHex}</span>`;
                messageElement.style.color = '#333333';
                userGuessButton.classList.add('guessed-incorrectly');
            }
        }
        
        function init() {
            newGameButton.addEventListener('click', newRound);
            
            difficultySpans.forEach(span => {
                span.addEventListener('click', () => {
                    difficultySpans.forEach(s => s.classList.remove('active'));
                    span.classList.add('active');
                    
                    numberOfOptions = parseInt(span.dataset.difficulty);
                    
                    newRound();
                });
            });
            
            // Set the initial active difficulty and start the first round
            let initialDifficultySpan = document.querySelector(`[data-difficulty="5"]`);
            if (initialDifficultySpan) {
                initialDifficultySpan.classList.add('active');
            }
            
            newRound();
        }

        init();
    }

    // Function for the new Binary Odometer project's HTML
    function getBinaryOdometerHTML() {
        return `
            <div class="w-full max-w-xl mx-auto p-8 bg-gray-800 rounded-2xl shadow-2xl space-y-8 border border-gray-700">
                <h1 class="text-4xl sm:text-5xl font-bold text-center text-orange-400">Binary Odometer</h1>
                <p class="text-center text-gray-400 max-w-md mx-auto">Enter a binary number (up to 10 digits) to see its decimal conversion on the digital odometer display below.</p>
                <div id="odometer-display" class="flex justify-center items-center h-28 sm:h-32 bg-gray-900 rounded-xl p-4 sm:p-6 shadow-inner border border-gray-700">
                    <div id="odometer-d4" class="odometer-digit text-7xl sm:text-8xl font-mono text-lime-400 px-1 sm:px-2 rounded-lg bg-gray-900 shadow-md">0</div>
                    <div id="odometer-d3" class="odometer-digit text-7xl sm:text-8xl font-mono text-lime-400 px-1 sm:px-2 rounded-lg bg-gray-900 shadow-md">0</div>
                    <div id="odometer-d2" class="odometer-digit text-7xl sm:text-8xl font-mono text-lime-400 px-1 sm:px-2 rounded-lg bg-gray-900 shadow-md">0</div>
                    <div id="odometer-d1" class="odometer-digit text-7xl sm:text-8xl font-mono text-lime-400 px-1 sm:px-2 rounded-lg bg-gray-900 shadow-md">0</div>
                </div>
                <div class="flex flex-col items-center space-y-4">
                    <label for="binary-input" class="text-lg font-semibold text-gray-300">Enter Binary Number:</label>
                    <input type="text" id="binary-input" class="w-full sm:w-80 px-4 py-3 text-lg text-center bg-gray-900 text-lime-400 rounded-lg border-2 border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300" placeholder="e.g., 10110" maxlength="10">
                </div>
                <div id="message" class="text-center h-6 text-orange-300 font-semibold"></div>
            </div>
        `;
    }

    // Function for the new Binary Odometer project's JavaScript logic
    function initializeBinaryOdometer() {
        const binaryInput = document.getElementById('binary-input');
        const messageDiv = document.getElementById('message');
        const odometerDigits = [
            document.getElementById('odometer-d4'),
            document.getElementById('odometer-d3'),
            document.getElementById('odometer-d2'),
            document.getElementById('odometer-d1')
        ];

        function updateOdometer(decimalValue) {
            let decimalString = String(decimalValue).padStart(4, '0');
            
            for (let i = 0; i < odometerDigits.length; i++) {
                const digitElement = odometerDigits[i];
                const newDigit = decimalString.charAt(i);
                
                digitElement.style.transform = 'translateY(-100%)';
                digitElement.style.opacity = '0';

                setTimeout(() => {
                    digitElement.textContent = newDigit;
                    digitElement.style.transform = 'translateY(0)';
                    digitElement.style.opacity = '1';
                }, 200);
            }
        }

        binaryInput.addEventListener('input', (event) => {
            let binaryString = event.target.value.trim();
            messageDiv.textContent = '';

            if (binaryString === '') {
                updateOdometer(0);
                return;
            }

            const binaryRegex = /^[01]+$/;

            if (!binaryRegex.test(binaryString)) {
                messageDiv.textContent = 'Invalid input. Please enter only 0s and 1s.';
                updateOdometer(0);
                return;
            }

            const decimalValue = parseInt(binaryString, 2);

            if (isNaN(decimalValue)) {
                messageDiv.textContent = 'Conversion error. Please try again.';
                updateOdometer(0);
                return;
            }

            updateOdometer(decimalValue);
        });
    }
    
    // Function to get the HTML for the Tic-Tac-Toe game
    function getTicTacToeHTML() {
        return `
            <div class="game-container">
                <h1>Tic-Tac-Toe</h1>
                <div class="tictactoe-board" id="tictactoe-board">
                    <div class="tictactoe-cell" data-cell-index="0"></div>
                    <div class="tictactoe-cell" data-cell-index="1"></div>
                    <div class="tictactoe-cell" data-cell-index="2"></div>
                    <div class="tictactoe-cell" data-cell-index="3"></div>
                    <div class="tictactoe-cell" data-cell-index="4"></div>
                    <div class="tictactoe-cell" data-cell-index="5"></div>
                    <div class="tictactoe-cell" data-cell-index="6"></div>
                    <div class="tictactoe-cell" data-cell-index="7"></div>
                    <div class="tictactoe-cell" data-cell-index="8"></div>
                </div>
                <div id="game-status">Player X's turn</div>
                <button id="restart-tictactoe-btn" class="button">Restart Game</button>
            </div>
        `;
    }

    // Function to initialize the Tic-Tac-Toe game logic
    function initializeTicTacToe() {
        const statusDisplay = document.getElementById('game-status');
        const restartButton = document.getElementById('restart-tictactoe-btn');
        const cells = document.querySelectorAll('.tictactoe-cell');

        let currentPlayer = 'X';
        let gameState = ['', '', '', '', '', '', '', '', ''];
        let gameActive = true;

        const winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        function handleCellPlayed(cell, clickedCellIndex) {
            gameState[clickedCellIndex] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer);
        }

        function handlePlayerChange() {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        }

        function handleResultValidation() {
            let roundWon = false;
            for (let i = 0; i < winningConditions.length; i++) {
                const winCondition = winningConditions[i];
                let a = gameState[winCondition[0]];
                let b = gameState[winCondition[1]];
                let c = gameState[winCondition[2]];
                if (a === '' || b === '' || c === '') {
                    continue;
                }
                if (a === b && b === c) {
                    roundWon = true;
                    break;
                }
            }

            if (roundWon) {
                statusDisplay.textContent = `Player ${currentPlayer} has won!`;
                gameActive = false;
                return;
            }

            let roundDraw = !gameState.includes('');
            if (roundDraw) {
                statusDisplay.textContent = `Game ended in a draw!`;
                gameActive = false;
                return;
            }

            handlePlayerChange();
        }

        function handleCellClick(event) {
            const clickedCell = event.target;
            const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

            if (gameState[clickedCellIndex] !== '' || !gameActive) {
                return;
            }

            handleCellPlayed(clickedCell, clickedCellIndex);
            handleResultValidation();
        }

        function handleRestartGame() {
            gameActive = true;
            currentPlayer = 'X';
            gameState = ['', '', '', '', '', '', '', '', ''];
            statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
            cells.forEach(cell => {
                cell.textContent = '';
                cell.classList.remove('X', 'O');
            });
        }

        cells.forEach(cell => cell.addEventListener('click', handleCellClick));
        restartButton.addEventListener('click', handleRestartGame);
    }
    
    function get2048GameHTML() {
        return `
            <div id="game-container-2048" class="game-container-2048">
                <div id="header-2048" class="header-2048">
                    <h1 class="h1-2048">2048</h1>
                    <div class="score-box-2048" id="score-container">
                        <span class="score-label-2048">Score</span>
                        <span id="score">0</span>
                    </div>
                    <div class="score-box-2048" id="high-score-container">
                        <span class="score-label-2048">High Score</span>
                        <span id="high-score">0</span>
                    </div>
                </div>
                <canvas id="gameCanvas-2048" class="canvas-2048"></canvas>
                <button id="new-game-btn-2048" class="new-game-btn-2048">New Game</button>
            </div>
            <div id="message-box-2048" class="message-box-2048">
                <p id="message-text-2048">Game Over!</p>
                <div class="button-group-2048">
                    <button class="action-btn-2048" id="message-ok-2048">OK</button>
                    <button class="action-btn-2048" id="message-restart-2048">Restart</button>
                </div>
            </div>
        `;
    }
    
    function initialize2048Game() {
        const canvas = document.getElementById('gameCanvas-2048');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const highScoreElement = document.getElementById('high-score');
        const newGameBtn = document.getElementById('new-game-btn-2048');
        const messageBox = document.getElementById('message-box-2048');
        const messageText = document.getElementById('message-text-2048');
        const messageOkBtn = document.getElementById('message-ok-2048');
        const messageRestartBtn = document.getElementById('message-restart-2048');
        
        // Grid and Tile properties
        const gridSize = 4;
        const tileSize = 100;
        const tilePadding = 10;
        const canvasSize = gridSize * tileSize + (gridSize + 1) * tilePadding;
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        // Animation properties
        const animationDuration = 100; // in milliseconds
        let animationStartTime = 0;
        let animatedTiles = [];
        let isAnimating = false;
        let board = [];
        let nextBoardState = [];
        let score = 0;
        let highScore = 0;
        let isGameOver = false;

        // Tile color map
        const tileColors = {
            0: '#cdc1b4',
            2: '#eee4da',
            4: '#ede0c8',
            8: '#f2b179',
            16: '#f59563',
            32: '#f67c5f',
            64: '#f65e3b',
            128: '#edcf72',
            256: '#edcc61',
            512: '#edc850',
            1024: '#edc53f',
            2048: '#edc22e',
        };

        const textColors = {
            2: '#776e65',
            4: '#776e65',
            8: '#f9f6f2',
            16: '#f9f6f2',
            32: '#f9f6f2',
            64: '#f9f6f2',
            128: '#f9f6f2',
            256: '#f9f6f2',
            512: '#f9f6f2',
            1024: '#f9f6f2',
            2048: '#f9f6f2',
        };

        // Font sizes
        const fontSizes = {
            2: '50px',
            4: '50px',
            8: '50px',
            16: '45px',
            32: '45px',
            64: '45px',
            128: '40px',
            256: '40px',
            512: '40px',
            1024: '35px',
            2048: '35px',
        };

        // Function to show a message box
        function showMessageBox(message) {
            messageText.textContent = message;
            messageBox.style.display = 'block';
        }

        // Function to hide the message box
        function hideMessageBox() {
            messageBox.style.display = 'none';
        }

        // Initializes the game board
        function setup() {
            board = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
            score = 0;
            isGameOver = false;
            animatedTiles = [];
            spawnNewTile();
            spawnNewTile();
            drawBoard();
            updateScore();
            
            // Load high score from local storage
            const savedHighScore = localStorage.getItem('highScore2048');
            highScore = savedHighScore ? parseInt(savedHighScore) : 0;
            updateHighScore();
            
            hideMessageBox();
        }
        
        // Draw a single tile with a rounded rectangle
        function drawTile(x, y, value) {
            const color = tileColors[value] || '#cdc1b4';
            const textColor = textColors[value] || '#776e65';
            const fontSize = fontSizes[value] || '50px';

            ctx.beginPath();
            ctx.roundRect(x, y, tileSize, tileSize, 6);
            ctx.fillStyle = color;
            ctx.fill();

            if (value !== 0) {
                ctx.fillStyle = textColor;
                ctx.font = `bold ${fontSize} Inter`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(value, x + tileSize / 2, y + tileSize / 2);
            }
        }

        // Draw the entire board
        function drawBoard() {
            ctx.clearRect(0, 0, canvasSize, canvasSize);
            drawBackground();
            drawStaticTiles();
            drawMovingTiles();
        }
        
        // Draw the empty background grid
        function drawBackground() {
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    const x = tilePadding + j * (tileSize + tilePadding);
                    const y = tilePadding + i * (tileSize + tilePadding);
                    drawTile(x, y, 0); // Draw empty tile background
                }
            }
        }
        
        // Draw tiles directly from the board array, excluding animated ones
        function drawStaticTiles() {
            const animatedFrom = new Set(animatedTiles.map(t => `${t.from.i}-${t.from.j}`));
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    if (board[i][j] !== 0 && !animatedFrom.has(`${i}-${j}`)) {
                        const x = tilePadding + j * (tileSize + tilePadding);
                        const y = tilePadding + i * (tileSize + tilePadding);
                        drawTile(x, y, board[i][j]);
                    }
                }
            }
        }

        // Draw the moving tiles during animation
        function drawMovingTiles() {
            animatedTiles.forEach(tile => {
                const fromX = tilePadding + tile.from.j * (tileSize + tilePadding);
                const fromY = tilePadding + tile.from.i * (tileSize + tilePadding);
                const toX = tilePadding + tile.to.j * (tileSize + tilePadding);
                const toY = tilePadding + tile.to.i * (tileSize + tilePadding);

                const progress = performance.now() - animationStartTime;
                const t = Math.min(progress / animationDuration, 1);
                
                const currentX = fromX + (toX - fromX) * t;
                const currentY = fromY + (toY - fromY) * t;
                
                drawTile(currentX, currentY, tile.value);
            });
        }

        // Main animation loop
        function animate(timestamp) {
            if (animationStartTime === 0) {
                animationStartTime = timestamp;
            }
            const progress = timestamp - animationStartTime;
            
            drawBoard();

            if (progress < animationDuration) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete, reset state and update board
                isAnimating = false;
                animationStartTime = 0;
                animatedTiles = [];
                board = nextBoardState;
                
                if (checkGameOver()) {
                    isGameOver = true;
                    showMessageBox("Game Over!");
                } else {
                    spawnNewTile();
                    drawBoard();
                }
            }
        }
        
        // Spawn a new tile (2 or 4) on an empty spot
        function spawnNewTile() {
            let emptyCells = [];
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    if (board[i][j] === 0) {
                        emptyCells.push({ i, j });
                    }
                }
            }
            if (emptyCells.length > 0) {
                const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                board[i][j] = Math.random() < 0.9 ? 2 : 4;
            }
        }

        // Check if the board is full
        function isBoardFull() {
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    if (board[i][j] === 0) {
                        return false;
                    }
                }
            }
            return true;
        }

        // Check for game over
        function checkGameOver() {
            if (!isBoardFull()) {
                return false;
            }
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    const value = board[i][j];
                    if (j < gridSize - 1 && board[i][j+1] === value) return false;
                    if (i < gridSize - 1 && board[i+1][j] === value) return false;
                }
            }
            return true;
        }

        // Update the score display
        function updateScore() {
            scoreElement.textContent = score;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore2048', highScore);
                updateHighScore();
            }
        }

        // Update the high score display
        function updateHighScore() {
            highScoreElement.textContent = highScore;
        }

        // Core game logic: slide and merge
        function move(direction) {
            if (isGameOver || isAnimating) return;
            
            let moved = false;
            let prevBoard = JSON.parse(JSON.stringify(board));
            nextBoardState = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
            animatedTiles = [];
            
            let boardToProcess = JSON.parse(JSON.stringify(board));
            let tilesToMerge = new Set();

            if (direction === 'up' || direction === 'down') {
                boardToProcess = transpose(boardToProcess);
            }
            if (direction === 'right' || direction === 'down') {
                boardToProcess = boardToProcess.map(row => row.reverse());
            }

            // Main sliding and merging logic
            for (let i = 0; i < gridSize; i++) {
                let row = boardToProcess[i].filter(val => val !== 0);
                let mergedRow = [];
                let j = 0;
                while (j < row.length) {
                    let value = row[j];
                    if (j + 1 < row.length && row[j] === row[j + 1]) {
                        mergedRow.push(value * 2);
                        score += value * 2;
                        j += 2;
                    } else {
                        mergedRow.push(value);
                        j++;
                    }
                }
                
                let oldRow = boardToProcess[i];
                let oldRowIndex = 0;
                let newRowIndex = 0;
                
                // Generate animated tile data
                for (let k = 0; k < gridSize; k++) {
                    if (oldRow[k] !== 0) {
                        let value = oldRow[k];
                        let destinationValue = mergedRow[newRowIndex];
                        
                        // Handle merges
                        if (value * 2 === destinationValue) {
                            let mergedFrom = oldRow.indexOf(value, k + 1);
                            if (mergedFrom !== -1) {
                                animatedTiles.push({
                                    value: value,
                                    from: { i: i, j: k },
                                    to: { i: i, j: newRowIndex },
                                    isMerge: true
                                });
                                animatedTiles.push({
                                    value: value,
                                    from: { i: i, j: mergedFrom },
                                    to: { i: i, j: newRowIndex },
                                    isMerge: true
                                });
                                k = mergedFrom;
                                newRowIndex++;
                            }
                        } else {
                            // Simple slide
                            animatedTiles.push({
                                value: value,
                                from: { i: i, j: k },
                                to: { i: i, j: newRowIndex },
                                isMerge: false
                            });
                            newRowIndex++;
                        }
                    }
                }
                
                while (mergedRow.length < gridSize) {
                    mergedRow.push(0);
                }

                if (JSON.stringify(boardToProcess[i]) !== JSON.stringify(mergedRow)) {
                    moved = true;
                }
                
                boardToProcess[i] = mergedRow;
            }

            if (direction === 'right' || direction === 'down') {
                boardToProcess = boardToProcess.map(row => row.reverse());
            }
            if (direction === 'up' || direction === 'down') {
                boardToProcess = transpose(boardToProcess);
            }

            nextBoardState = boardToProcess;

            // Adjust animation coordinates based on transpose/reverse operations
            for (let tile of animatedTiles) {
                if (direction === 'right' || direction === 'down') {
                    tile.from.j = gridSize - 1 - tile.from.j;
                    tile.to.j = gridSize - 1 - tile.to.j;
                }
                if (direction === 'up' || direction === 'down') {
                    let temp = tile.from.i;
                    tile.from.i = tile.from.j;
                    tile.from.j = temp;

                    temp = tile.to.i;
                    tile.to.i = tile.to.j;
                    tile.to.j = temp;
                }
            }

            if (moved) {
                isAnimating = true;
                updateScore();
                requestAnimationFrame(animate);
            }
        }

        // Helper function to transpose the matrix
        function transpose(matrix) {
            return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
        }
        
        // Event listeners
        document.addEventListener('keydown', (e) => {
            if (!isAnimating) {
                switch (e.key) {
                    case 'ArrowUp':
                        move('up');
                        break;
                    case 'ArrowDown':
                        move('down');
                        break;
                    case 'ArrowLeft':
                        move('left');
                        break;
                    case 'ArrowRight':
                        move('right');
                        break;
                }
            }
        });

        newGameBtn.addEventListener('click', () => {
            setup();
        });

        messageOkBtn.addEventListener('click', hideMessageBox);
        messageRestartBtn.addEventListener('click', setup);
        
        // Initial setup on function call
        setup();
    }
    
    const projectContent = {
        1: {
            title: 'Dizzy Wheel',
            content: getDizzyWheelHTML(),
            init: initializeDizzyWheel
        },
        2: {
            title: 'Stacker Arcade',
            content: getStackerHTML(),
            init: initializeStacker
        },
        3: {
            title: 'WHAT THE HEX?',
            content: getHexGuessingGameHTML(),
            init: initializeHexGuessingGame
        },
        4: {
            title: 'Binary Odometer',
            content: getBinaryOdometerHTML(),
            init: initializeBinaryOdometer
        },
        5: {
            title: 'Tic-Tac-Toe',
            content: getTicTacToeHTML(),
            init: initializeTicTacToe
        },
        6: {
            title: '2048 Game',
            content: get2048GameHTML(),
            init: initialize2048Game
        }
    };

    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const projectId = event.target.closest('.project-card').getAttribute('data-project-id');
            const project = projectContent[projectId];
            if (project) {
                mainView.classList.add('hidden');
                projectView.classList.remove('hidden');
                projectContentDiv.innerHTML = project.content;

                if (project.init) {
                    project.init();
                }
            }
        });
    });

    backBtn.addEventListener('click', () => {
        mainView.classList.remove('hidden');
        projectView.classList.add('hidden');
        projectContentDiv.innerHTML = '';
    });
});
