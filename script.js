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
            init: initializeHexGuessingGame // The new initialization function
        }
    };

    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const projectId = event.target.closest('.project-card').getAttribute('data-project-id');
            const project = projectContent[projectId];
            if (project) {
                // Hide the main portfolio view
                mainView.classList.add('hidden');
                
                // Show the project view
                projectView.classList.remove('hidden');
                
                // Set the project content
                projectContentDiv.innerHTML = project.content;

                // Call the initialization function if it exists
                if (project.init) {
                    project.init();
                }
            }
        });
    });

    backBtn.addEventListener('click', () => {
        // Show the main portfolio view
        mainView.classList.remove('hidden');
        
        // Hide the project view
        projectView.classList.add('hidden');
        
        // Clear the project content
        projectContentDiv.innerHTML = '';
    });
});
