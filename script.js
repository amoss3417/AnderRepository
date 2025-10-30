document.addEventListener('DOMContentLoaded', () => {
    const mainView = document.getElementById('main-view');
    const projectView = document.getElementById('project-view');
    const projectContentDiv = document.getElementById('project-content');
    const backBtn = document.getElementById('back-btn');

    // This function contains the HTML for the Dizzy Wheel game.
    function getDizzyWheelHTML() {
        return `
             <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Showcase Portfolio</title>
    <!-- Load Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom font import for Inter */
        html { font-family: 'Inter', sans-serif; }
        
        /* Custom styling for the code block look */
        pre {
            background-color: #1e293b; /* Slate 800 */
            color: #e2e8f0; /* Slate 200 */
            padding: 1rem;
            border-radius: 0.75rem;
            overflow-x: auto;
            font-family: monospace;
            font-size: 0.875rem;
        }
    </style>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'primary': '#4f46e5',
                        'secondary': '#6366f1',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-100 min-h-screen p-8">

    <!-- Header -->
    <header class="max-w-7xl mx-auto mb-10 text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-2">
            My Arduino Project: IR Remote to 7-Segment Display
        </h1>
        <p class="text-lg text-gray-600">
            A look into the concept, design, and source code.
        </p>
    </header>

    <!-- Main Content Grid -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Column 1: Project Image -->
        <div class="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 w-full text-center">
                Project Image
            </h2>
            <img 
                src="IMG_0378.JPG" ƒcon
                alt="A visual placeholder for the project."
                class="rounded-lg shadow-md w-full h-auto object-cover max-h-80"
                onerror="this.onerror=null; this.src='https://placehold.co/400x300/4f46e5/ffffff?text=Image+Not+Loaded'"
            >
            
        </div>

        <!-- Column 2: Project Description -->
        <div class="bg-white rounded-xl shadow-xl p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                Project Description
            </h2>
            <div class="text-gray-700 space-y-4">
                <p>
                    This project uses an arduino, an IR reciever and remote, as well as a 4 digit 7-segment display. 
                    It uses all of these components so that when a number is pressed on the IR remote, it will transfer it onto the 7-segment display.
                    When the EQ button is pressed, it solidifies the numbers onto the display, so they cannot be replaced when new numbers are pressed. 
                </p>
                <p>
                    This project helped me gain an understanding of how to use an IR reciever and remote with an arduino, as well as how to use a 4 digit 7-segment display.
                    These are concepts I did not know how to do previousl, and I learned how to implemetn each component through youtube videos and AI explanations.
                </p>
            </div>
        </div>

        <!-- Column 3: Project Code -->
        <div class="bg-white rounded-xl shadow-xl p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                Project Code Snippet
            </h2>
            <pre><code>
#include <IRremote.hpp> // Use .hpp for modern IRremote library

// --- 7-SEGMENT PIN CONFIGURATION (Common Anode assumed for your logic) ---
// Segment Pins: Define as OUTPUT
int pinA = 13; int pinB = 7; int pinC = 4; int pinD = 3;
int pinE = A2; int pinF = 10; int pinG = 5;

// Digit Pins (Control the Common Pin - LOW to activate, HIGH to deactivate)
int D1 = 12; int D2 = 9; int D3 = 8; int D4 = 6;
const int MULTIPLEX_DELAY_MS = 3; // Reduced for smoother display

// --- IR RECEIVER & DATA LOGIC ---
#define IR_RECEIVE_PIN 11

// WARNING: You must confirm the correct data type for your codes.
// Using uint64_t for the large raw codes you provided.
typedef uint64_t IR_CODE_TYPE; 

// Replace with the codes you found (Ensure these are correct!)
#define CODE_0 (IR_CODE_TYPE)0xE916FF00
#define CODE_1 (IR_CODE_TYPE)0xF30CFF00
#define CODE_2 (IR_CODE_TYPE)0xE718FF00
#define CODE_3 (IR_CODE_TYPE)0xA15EFF00
#define CODE_4 (IR_CODE_TYPE)0xF708FF00
#define CODE_5 (IR_CODE_TYPE)0xE31CFF00
#define CODE_6 (IR_CODE_TYPE)0xA55AFF00
#define CODE_7 (IR_CODE_TYPE)0xBD42FF00
#define CODE_8 (IR_CODE_TYPE)0xAD52FF00
#define CODE_9 (IR_CODE_TYPE)0xB54AFF00
#define CODE_EQ (IR_CODE_TYPE)0xE619FF00

long receivedNumber = 0; // Stores the number being entered (Max 9999)
int digitCount = 0;      // Tracks how many digits have been entered (max 4)
const int MAX_DIGITS = 4;
bool entryComplete = false; // Flag to stop accepting new digits after 4

// Variables for display
int d_thousands = 0;    
int d_hundreds = 0;     
int d_tens = 0;         
int d_ones = 0;         

void setup() {
  Serial.begin(9600);
  
  // Start the IR receiver
  IrReceiver.begin(IR_RECEIVE_PIN, DISABLE_LED_FEEDBACK);
  
  // Initialize all pins as OUTPUT
  pinMode(pinA, OUTPUT); pinMode(pinB, OUTPUT); pinMode(pinC, OUTPUT); pinMode(pinD, OUTPUT);
  pinMode(pinE, OUTPUT); pinMode(pinF, OUTPUT); pinMode(pinG, OUTPUT);
  pinMode(D1, OUTPUT); pinMode(D2, OUTPUT); pinMode(D3, OUTPUT); pinMode(D4, OUTPUT);

  // Deactivate all digits initially (Assuming Common Anode setup: HIGH = OFF)
  all4Digits(); 
  turnOffAllSegments();
  Serial.println("System Ready. Enter 4 digits, then press EQ.");
}

void loop() {
  // --- IR RECEIVE AND INPUT LOGIC ---
  if (IrReceiver.decode()) {
    
    IR_CODE_TYPE command = IrReceiver.decodedIRData.decodedRawData;
    Serial.print("Code: 0x");
    Serial.println((long)command, HEX); // Print as long for better visibility on Serial

    int number = -1; // -1 means it's not a number button

    // 1. Check for Number Buttons (0-9)
    switch (command) {
      case CODE_0: number = 0; break; case CODE_1: number = 1; break;
      case CODE_2: number = 2; break; case CODE_3: number = 3; break;
      case CODE_4: number = 4; break; case CODE_5: number = 5; break;
      case CODE_6: number = 6; break; case CODE_7: number = 7; break;
      case CODE_8: number = 8; break; case CODE_9: number = 9; break;
      default: break;
    }

    if (number != -1) {
      // A number button was pressed
      if (digitCount < MAX_DIGITS) {
        // Shift existing number left and add new digit
        receivedNumber = (receivedNumber * 10) + number;
        digitCount++;
        Serial.print("Entered: "); Serial.println(receivedNumber);
        // Map and display the current number as it's being entered
        mapCountToDigits(receivedNumber);
      } else {
        Serial.println("Max 4 digits entered. Press EQ or Clear.");
      }
    } 
    
    // 2. Check for EQ Button
    else if (command == CODE_EQ) {
      if (digitCount > 0) {
        Serial.print("EQ Pressed. Final Number: ");
        Serial.println(receivedNumber);
        // The number is already in receivedNumber and mapped.
        // Ready to reset for next entry.
        receivedNumber = 0;
        digitCount = 0;
      } else {
        Serial.println("Press numbers first.");
      }
    } else {
      Serial.println("Other key pressed (ignored).");
    }

    // Prepare the receiver for the next signal
    IrReceiver.resume(); 
  }

  
  // 1. Display Thousands Digit (D1)
  turnOffAllSegments();
  displayNumber(d_thousands); 
  digit1(); // Turn on D1
  delay(MULTIPLEX_DELAY_MS);
  
  // 2. Display Hundreds Digit (D2)
  turnOffAllSegments();
  displayNumber(d_hundreds);
  digit2(); // Turn on D2
  delay(MULTIPLEX_DELAY_MS);
  
  // 3. Display Tens Digit (D3)
  turnOffAllSegments();
  displayNumber(d_tens);
  digit3(); // Turn on D3
  delay(MULTIPLEX_DELAY_MS);
  
  // 4. Display Ones Digit (D4)
  turnOffAllSegments();
  displayNumber(d_ones);
  digit4(); // Turn on D4
  delay(MULTIPLEX_DELAY_MS);
}

void mapCountToDigits(long number) {
  d_thousands = number / 1000;         
  d_hundreds = (number % 1000) / 100;  
  d_tens = (number % 100) / 10;        
  d_ones = number % 10;                
}

void displayNumber(int num) {
  turnOffAllSegments(); 
  switch(num) {
    case 0: zero(); break; case 1: one(); break; case 2: two(); break; 
    case 3: three(); break; case 4: four(); break; case 5: five(); break; 
    case 6: six(); break; case 7: seven(); break; case 8: eight(); break; 
    case 9: nine(); break;
  }
}



void turnOffAllSegments(){
  digitalWrite(pinA, HIGH);
  digitalWrite(pinB, HIGH);
  digitalWrite(pinC, HIGH);
  digitalWrite(pinD, HIGH);
  digitalWrite(pinE, HIGH);
  digitalWrite(pinF, HIGH);
  digitalWrite(pinG, HIGH);
}

void zero(){
  digitalWrite(pinA, HIGH);
  digitalWrite(pinB, HIGH);
  digitalWrite(pinC, HIGH);
  digitalWrite(pinD, HIGH);
  digitalWrite(pinE, HIGH);
  digitalWrite(pinF, HIGH);
  digitalWrite(pinG, LOW); // Segment G is OFF
}
// ... (Your other number functions one() through nine() are assumed correct) ...

// --- Digit Selection Functions (D1-D4 control the COMMON pin) ---
void all4Digits(){
  digitalWrite(D1, HIGH); digitalWrite(D2, HIGH); digitalWrite(D3, HIGH); digitalWrite(D4, HIGH);
}
      
void digit1(){
  all4Digits(); 
  digitalWrite(D1, LOW); // Activate D1
}
      
void digit2(){
  all4Digits(); 
  digitalWrite(D2, LOW); // Activate D2
}
      
void digit3(){
  all4Digits();
  digitalWrite(D3, LOW); // Activate D3
}
      
void digit4(){
  all4Digits();
  digitalWrite(D4, LOW); // Activate D4
}
// (Your existing number functions one() through nine() go here)
// I am omitting them for brevity, but they are necessary for the code to compile. 
// Just ensure you paste them back into your sketch.

void one(){
digitalWrite(pinA, LOW);
digitalWrite(pinB, HIGH);
digitalWrite(pinC, HIGH);
digitalWrite(pinD, LOW);
digitalWrite(pinE, LOW);
digitalWrite(pinF, LOW);
digitalWrite(pinG, LOW);
}

void two(){
  digitalWrite(pinA, HIGH);
digitalWrite(pinB, HIGH);
digitalWrite(pinC, LOW);
digitalWrite(pinD, HIGH);
digitalWrite(pinE, HIGH);
digitalWrite(pinF, LOW);
digitalWrite(pinG, HIGH);
  }
  
  void three(){
    digitalWrite(pinA, HIGH);
digitalWrite(pinB, HIGH);
digitalWrite(pinC, HIGH);
digitalWrite(pinD, HIGH);
digitalWrite(pinE, LOW);
digitalWrite(pinF, LOW);
digitalWrite(pinG, HIGH);
    }
    
  void four(){
    digitalWrite(pinA, LOW);
digitalWrite(pinB, HIGH);
digitalWrite(pinC, HIGH);
digitalWrite(pinD, LOW);
digitalWrite(pinE, LOW);
digitalWrite(pinF, HIGH);
digitalWrite(pinG, HIGH);
    }
    
  void five(){
    digitalWrite(pinA, HIGH);
digitalWrite(pinB, LOW);
digitalWrite(pinC, HIGH);
digitalWrite(pinD, HIGH);
digitalWrite(pinE, LOW);
digitalWrite(pinF, HIGH);
digitalWrite(pinG, HIGH);
    }
    
  void six(){
    digitalWrite(pinA, HIGH);
digitalWrite(pinB, LOW);
digitalWrite(pinC, HIGH);
digitalWrite(pinD, HIGH);
digitalWrite(pinE, HIGH);
digitalWrite(pinF, HIGH);
digitalWrite(pinG, HIGH);
    }
    
  void seven(){
    digitalWrite(pinA, HIGH);
digitalWrite(pinB, HIGH);
digitalWrite(pinC, HIGH);
digitalWrite(pinD, LOW);
digitalWrite(pinE, LOW);
digitalWrite(pinF, LOW);
digitalWrite(pinG, LOW);
    }
    
  void eight(){
    digitalWrite(pinA, HIGH);
digitalWrite(pinB, HIGH);
digitalWrite(pinC, HIGH);
digitalWrite(pinD, HIGH);
digitalWrite(pinE, HIGH);
digitalWrite(pinF, HIGH);
digitalWrite(pinG, HIGH);
    }
    
  void nine(){
    digitalWrite(pinA, HIGH);
digitalWrite(pinB, HIGH);
digitalWrite(pinC, HIGH);
digitalWrite(pinD, LOW);
digitalWrite(pinE, LOW);
digitalWrite(pinF, HIGH);
digitalWrite(pinG, HIGH);
    }

    void allNumbers(int num){
one();delay(num);
two();delay(num);
three();delay(num);
four();delay(num);
five();delay(num);
six();delay(num);
seven();delay(num);
eight();delay(num);
nine();delay(num);
      }
            </code></pre>
        </div>

    </div>
</body>
</html>
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
                const startAngle = i * sectionAngle;
                const endAngle = (i + 1) * sectionAngle;
                ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
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
            
            // The hand's position is simply the current wheel angle
            const endX = centerX + radius * Math.cos(wheelAngle - Math.PI / 2);
            const endY = centerY + radius * Math.sin(wheelAngle - Math.PI / 2);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = colors[targetColorIndex];
            ctx.lineWidth = 10;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.closePath();
        }

        function getCurrentSectionIndex() {
            let normalizedAngle = (wheelAngle - Math.PI / 2) % (2 * Math.PI);
            if (normalizedAngle < 0) {
                normalizedAngle += 2 * Math.PI;
            }
            let index = Math.floor(normalizedAngle / sectionAngle);
            return (index + colors.length) % colors.length;
        }

        function update() {
            if (!isGameActive) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            wheelAngle += wheelSpeed;

            const currentSectionIndex = getCurrentSectionIndex();

            // Only check for passing if the hand is moving in the correct direction
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

            const currentSectionIndex = getCurrentSectionIndex();
            
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

        // Event listeners
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
        const GRID_HEIGHT = 25;
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
    
    // 💡 NEW CODE: Add the initial stationary base block 🧱
    stack.push({
        x: 5,
        y: 0,
        width: 5,
        perfect: false
    });
    score = 1; // Set initial score to 1 for the pre-placed block

    direction = 1;
    intervalTime = 150;
    scoreDisplay.textContent = score;
    gameOverScreen.style.display = 'none';
    
    // The visual drawing of the base block happens inside drawGame()
    createBlock(); 
    startAnimation();

    // Re-add event listeners for control (assuming they were removed in endGame)
    gameAreaContainer.addEventListener('click', placeBlock);
    document.addEventListener('keydown', handleKeyDown);
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

    // Function to get the HTML for the Minesweeper game
    function getMinesweeperHTML() {
        return `
            <div class="minesweeper-container">
                <div class="minesweeper-status-panel">
                    <span id="flag-count" class="minesweeper-status-text">040</span>
                    <button id="restart-btn" class="minesweeper-restart-btn">Restart</button>
                </div>
                <canvas id="game-canvas" class="minesweeper-canvas"></canvas>
            </div>
            <div id="message-box" class="minesweeper-message-box">
                <p id="message-text"></p>
                <button id="message-restart-btn">Play Again</button>
            </div>
        `;
    }

    // Function to initialize the Minesweeper game logic
    function initializeMinesweeper() {
        // Game Constants
        const ROWS = 16;
        const COLS = 16;
        const BOMBS = 40;
        const CELL_SIZE = 30; // Pixel size of each cell
        const FONT_SIZE = 18;

        // DOM elements
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');
        const restartBtn = document.getElementById('restart-btn');
        const flagCountElement = document.getElementById('flag-count');
        const messageBox = document.getElementById('message-box');
        const messageText = document.getElementById('message-text');
        const messageRestartBtn = document.getElementById('message-restart-btn');

        // Game State Variables
        let board = [];
        let revealed = [];
        let flags = [];
        let isGameOver = false;
        let firstClick = true;
        let revealedCount = 0;
        let flagCounter = BOMBS;

        // Colors for bomb counts
        const NUMBER_COLORS = [
            'transparent', '#0000ff', '#008000', '#ff0000', '#800080', '#800000', '#40e0d0', '#000000', '#808080'
        ];
        
        // Function to initialize or reset the game
        function initGame() {
            isGameOver = false;
            firstClick = true;
            revealedCount = 0;
            flagCounter = BOMBS;
            
            // Set canvas dimensions
            canvas.width = COLS * CELL_SIZE;
            canvas.height = ROWS * CELL_SIZE;

            // Hide message box
            messageBox.style.display = 'none';

            // Initialize 2D arrays
            board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
            revealed = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
            flags = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

            updateFlagCount();
            drawBoard();
        }

        // Places bombs on the board, avoiding the first clicked cell and its neighbors
        function placeBombs(firstClickRow, firstClickCol) {
            let bombsPlaced = 0;
            while (bombsPlaced < BOMBS) {
                const row = Math.floor(Math.random() * ROWS);
                const col = Math.floor(Math.random() * COLS);
                
                // Check if the cell is in the 3x3 area around the first click
                const isSafeZone = (Math.abs(row - firstClickRow) <= 1 && Math.abs(col - firstClickCol) <= 1);

                if (!isSafeZone && board[row][col] !== 'B') {
                    board[row][col] = 'B';
                    bombsPlaced++;
                }
            }
        }

        // Calculates the number of adjacent bombs for each cell
        function calculateBombCounts() {
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    if (board[r][c] === 'B') continue;

                    let count = 0;
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            const newR = r + dr;
                            const newC = c + dc;
                            if (newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS && board[newR][newC] === 'B') {
                                count++;
                            }
                        }
                    }
                    board[r][c] = count;
                }
            }
        }

        // Draws the entire board on the canvas
        function drawBoard() {
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    drawCell(r, c);
                }
            }
        }

        // Draws a single cell based on its state
        function drawCell(row, col) {
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;

            if (revealed[row][col]) {
                // Draw revealed cell with inset effect
                ctx.fillStyle = '#c0c0c0';
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
                ctx.strokeStyle = '#808080';
                ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

                if (board[row][col] === 'B') {
                    // Draw a more classic-looking bomb
                    ctx.fillStyle = '#000000';
                    ctx.beginPath();
                    ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE * 0.3, 0, 2 * Math.PI);
                    ctx.fill();
                    
                } else if (board[row][col] > 0) {
                    // Draw number
                    ctx.fillStyle = NUMBER_COLORS[board[row][col]];
                    ctx.font = `bold ${FONT_SIZE}px 'Courier New', Courier, monospace`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(board[row][col], x + CELL_SIZE / 2, y + CELL_SIZE / 2);
                }
            } else {
                // Draw unrevealed cell with outset effect
                ctx.fillStyle = '#c0c0c0';
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

                // Outset 3D border
                ctx.beginPath();
                ctx.moveTo(x, y + CELL_SIZE);
                ctx.lineTo(x, y);
                ctx.lineTo(x + CELL_SIZE, y);
                ctx.strokeStyle = '#ffffff';
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(x + CELL_SIZE, y);
                ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE);
                ctx.lineTo(x, y + CELL_SIZE);
                ctx.strokeStyle = '#808080';
                ctx.stroke();

                if (flags[row][col]) {
                    // Draw classic flag
                    ctx.fillStyle = '#000000';
                    ctx.font = `bold ${FONT_SIZE}px 'Courier New', Courier, monospace`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('🚩', x + CELL_SIZE / 2, y + CELL_SIZE / 2);
                }
            }
        }

        // Handles a mouse down event for the visual press effect
        function handleMouseDown(event) {
            if (isGameOver || event.button !== 0) return; // Only for left clicks

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const col = Math.floor(x / CELL_SIZE);
            const row = Math.floor(y / CELL_SIZE);

            if (!revealed[row][col] && !flags[row][col]) {
                // Draw the cell with an "inset" border to show it's pressed
                const cellX = col * CELL_SIZE;
                const cellY = row * CELL_SIZE;

                ctx.fillStyle = '#c0c0c0';
                ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
                
                // Inset 3D border
                ctx.beginPath();
                ctx.moveTo(cellX, cellY);
                ctx.lineTo(cellX + CELL_SIZE, cellY);
                ctx.lineTo(cellX + CELL_SIZE, cellY + CELL_SIZE);
                ctx.strokeStyle = '#808080';
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(cellX + CELL_SIZE, cellY + CELL_SIZE);
                ctx.lineTo(cellX, cellY + CELL_SIZE);
                ctx.lineTo(cellX, cellY);
                ctx.strokeStyle = '#ffffff';
                ctx.stroke();
            }
        }
        
        // Handles a mouse up event to run game logic and reset visuals
        function handleMouseUp(event) {
            if (isGameOver) return;

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const col = Math.floor(x / CELL_SIZE);
            const row = Math.floor(y / CELL_SIZE);
            
            if (firstClick) {
                placeBombs(row, col);
                calculateBombCounts();
                firstClick = false;
            }
            
            revealCell(row, col);
            drawBoard(); // Crucial to redraw all cells and fix the borders
        }


        // Handles a right-click on the canvas
        function handleRightClick(event) {
            event.preventDefault();
            if (isGameOver) return;

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const col = Math.floor(x / CELL_SIZE);
            const row = Math.floor(y / CELL_SIZE);

            toggleFlag(row, col);
        }

        // Reveals a cell and its neighbors if it's a zero
        function revealCell(row, col) {
            if (row < 0 || row >= ROWS || col < 0 || col >= COLS || revealed[row][col] || flags[row][col]) {
                return;
            }

            revealed[row][col] = true;

            if (board[row][col] === 'B') {
                // Game over
                isGameOver = true;
                showBombs();
                showMessage('Game Over! You hit a mine!');
                return;
            }

            revealedCount++;
            drawCell(row, col);
            checkWin();

            if (board[row][col] === 0) {
                // Recursively reveal adjacent cells if this cell is a zero
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        revealCell(row + dr, col + dc);
                    }
                }
            }
        }
        
        // Toggles a flag on a cell
        function toggleFlag(row, col) {
            if (revealed[row][col]) {
                return;
            }

            flags[row][col] = !flags[row][col];
            if (flags[row][col]) {
                flagCounter--;
            } else {
                flagCounter++;
            }

            updateFlagCount();
            drawCell(row, col);
        }
        
        // Updates the flag counter display
        function updateFlagCount() {
            // The classic counter is 2 digits, but we can do 3
            const displayCount = flagCounter.toString().padStart(3, '0');
            flagCountElement.textContent = displayCount;
        }

        // Reveals all bombs at the end of the game
        function showBombs() {
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    if (board[r][c] === 'B') {
                        revealed[r][c] = true;
                        drawCell(r, c);
                    }
                }
            }
        }

        // Checks for a win condition
        function checkWin() {
            if (revealedCount === (ROWS * COLS) - BOMBS) {
                isGameOver = true;
                showMessage('Congratulations! You found all the mines!');
            }
        }

        // Displays a custom message box
        function showMessage(message) {
            messageText.textContent = message;
            messageBox.style.display = 'block';
        }

        // Restarts the game (accessible via button click)
        function restartGame() {
            initGame();
        }

        // Event Listeners
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('contextmenu', handleRightClick);
        if (restartBtn) restartBtn.addEventListener('click', restartGame);
        if (messageRestartBtn) messageRestartBtn.addEventListener('click', restartGame);
        
        // Initial call to set up the game
        initGame();
    }
    
    // Function to get the HTML for the Flappy game
    function getFlappyHTML() {
        return `
            <div class="game-wrap">
                <canvas id="c" width="480" height="640" role="img" aria-label="Flappy-style game canvas"></canvas>
                <div class="ui">
                    <div class="left">
                        <div class="score" id="score">0</div>
                        <div class="small">High: <span id="high">0</span></div>
                    </div>
                    <div class="right">
                        <button class="btn" id="mute"></button>
                        <button class="ghost" id="restart">Restart</button>
                        <div class="touch-hint">Space / Click / Tap to flap — hold to rapid-flap</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Function to initialize the Flappy game logic
    function initializeFlappy() {
        // Game logic from the provided code
        const canvas = document.getElementById('c');
        const ctx = canvas.getContext('2d');
        let W = canvas.width, H = canvas.height;

        // device pixel ratio scaling
        function resizeCanvas(){
            const ratio = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
            const rect = canvas.getBoundingClientRect();
            canvas.width = Math.round(rect.width * ratio);
            canvas.height = Math.round(rect.height * ratio);
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.setTransform(ratio,0,0,ratio,0,0);
            W = rect.width; H = rect.height;
        }
        
        // This is a quick fix to make the game work on load.
        // It relies on the inline style defined in getFlappyHTML()
        canvas.style.width = '480px'; 
        canvas.style.height = '640px';
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Audio helpers (minimal, no external files)
        const audio = {enabled:true};
        try{ window.AudioContext = window.AudioContext || window.webkitAudioContext; audio.ctx = new AudioContext(); }catch(e){ audio.enabled = false }
        function beep(freq, time, type='sine', gain=0.07){ if(!audio.enabled) return; const ctxA = audio.ctx; const o = ctxA.createOscillator(); const g = ctxA.createGain(); o.type = type; o.frequency.value = freq; g.gain.value = gain; o.connect(g); g.connect(ctxA.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.0001, ctxA.currentTime + time); o.stop(ctxA.currentTime + time + 0.02); }

        // Constants (tweakable)
        const BASE_GRAV = 0.6; // increased gravity slightly
        const FLAP_V = -9.2;
        const BASE_pipeSpeed = 2.4;
        const PIPE_WIDTH = 72;
        const GAP_MIN = 120, GAP_MAX = 190;
        const SPAWN_MS = 1400;

        // Game state
        let bird, pipes, particles, lastSpawn, lastTime, running, score, highScore, muted=false;
        let holdFlap = false; let touchId = null;

        function newGame(){
            bird = {x: 90, y: H/2, r: 16, vy: 0, rot:0, wobble:0};
            pipes = [];
            particles = [];
            lastSpawn = performance.now() - 300;
            lastTime = performance.now();
            running = true;
            score = 0;
            highScore = Number(localStorage.getItem('fb_high')||0);
            document.getElementById('high').textContent = highScore;
            document.getElementById('score').textContent = score;
        }

        function spawnPipe(){
            const gap = GAP_MIN + Math.random()*(GAP_MAX - GAP_MIN);
            const top = 50 + Math.random()*(H - gap - 200);
            pipes.push({x: W + 40, top, bottom: top + gap, w: PIPE_WIDTH, passed:false});
        }

        function resetGame(){
            bird.y = H/2; bird.vy = 0; bird.rot = 0; pipes = []; score = 0; particles = []; lastSpawn = performance.now(); running = true; document.getElementById('score').textContent = score; 
        }

        // input
        function doFlap(){ 
            if(!running){ newGame(); return; } 
            bird.vy = FLAP_V; 
            bird.rot = -0.9; 
            bird.wobble = 0; 
            if(!muted) beep(880,0.06,'square',0.05); 
        }

        // Add event listeners within this function scope
        document.addEventListener('keydown', e=>{ 
            if(e.code==='Space'){ 
                e.preventDefault(); 
                doFlap(); 
                // holdFlap=true;
            } 
            if(e.code==='KeyM'){ 
                toggleMute();
            }
        });

        document.addEventListener('keyup', e=>{ 
            if(e.code==='Space'){ 
                holdFlap=false; 
            }
        });

        canvas.addEventListener('pointerdown', e=>{ 
            canvas.setPointerCapture(e.pointerId); 
            touchId = e.pointerId; 
            doFlap(); 
        });

        canvas.addEventListener('pointerup', e=>{ 
            if(e.pointerId===touchId){ 
                touchId=null; 
            } 
        });

        canvas.addEventListener('pointerleave', e=>{ 
            if(e.pointerId===touchId){ 
                touchId=null; 
            } 
        });

        document.getElementById('restart').addEventListener('click', ()=>{ resetGame(); });
        document.getElementById('mute').addEventListener('click', toggleMute);

        function toggleMute(){ 
            muted = !muted; 
            audio.enabled = !muted; 
            document.getElementById('mute').textContent = muted ? 'Unmute' : 'Mute'; // Update button text
            if(!audio.enabled && audio.ctx && audio.ctx.state!=='closed'){ 
                try{ audio.ctx.suspend() }catch(e){} 
            } else if(audio.ctx && audio.ctx.state!=='running'){ 
                try{ audio.ctx.resume() }catch(e){} 
            } 
        }
        
        // Initialize mute button text on load
        document.getElementById('mute').textContent = muted ? 'Unmute' : 'Mute';

        // collision
        function rectCircleColliding(cx,cy,r, rx,ry,rw,rh){ 
            const closestX = Math.max(rx, Math.min(cx, rx+rw)); 
            const closestY = Math.max(ry, Math.min(cy, ry+rh)); 
            const dx = cx - closestX; 
            const dy = cy - closestY; 
            return (dx*dx + dy*dy) < (r*r); 
        }

        // particles
        function spawnParticles(x,y, n=12){ 
            for(let i=0;i<n;i++){ 
                const a = Math.random()*Math.PI*2; 
                const s = 1+Math.random()*3; 
                particles.push({x,y,vx:Math.cos(a)*s, vy:Math.sin(a)*s - 1, life:60 + Math.random()*20, r:2+Math.random()*3}); 
            } 
            if(!muted) beep(140,0.18,'sine',0.06); 
        }

        function update(dt){
            // difficulty scale
            const speed = BASE_pipeSpeed + Math.min(2.2, score*0.08);
            const gravity = BASE_GRAV;

            if(holdFlap){ if(performance.now()%120 < 60) doFlap(); }

            bird.vy += gravity;
            bird.y += bird.vy * (dt/16);
            bird.rot += ( (bird.vy/10) - bird.rot) * 0.06; // smooth rotation

            // spawn pipes
            if(performance.now() - lastSpawn > SPAWN_MS - Math.min(500, score*15)) { 
                spawnPipe(); 
                lastSpawn = performance.now(); 
            }

            // move pipes
            for(let i=pipes.length-1;i>=0;i--){ 
                const p = pipes[i]; 
                p.x -= speed * (dt/16);
                if(!p.passed && p.x + p.w < bird.x - bird.r){ 
                    p.passed = true; 
                    score++; 
                    document.getElementById('score').textContent = score; 
                    if(score>highScore){ 
                        highScore=score; 
                        localStorage.setItem('fb_high', highScore); 
                        document.getElementById('high').textContent = highScore; 
                    } 
                }
                // collision
                if(rectCircleColliding(bird.x, bird.y, bird.r, p.x, 0, p.w, p.top) || rectCircleColliding(bird.x, bird.y, bird.r, p.x, p.bottom, p.w, H - p.bottom - 80)){
                    // hit
                    if(running){ 
                        spawnParticles(bird.x, bird.y, 18); 
                    }
                    running = false;
                }
                if(p.x + p.w < -60) pipes.splice(i,1);
            }

            // particles
            for(let i=particles.length-1;i>=0;i--){ 
                const par = particles[i]; 
                par.vy += 0.18; 
                par.x += par.vx * (dt/16); 
                par.y += par.vy * (dt/16); 
                par.life -= dt/16; 
                if(par.life <= 0) particles.splice(i,1); 
            }

            // ground collision
            const groundY = H - 80;
            if(bird.y + bird.r > groundY){ 
                bird.y = groundY - bird.r; 
                running = false; 
                spawnParticles(bird.x, bird.y+4, 22); 
            }
            if(bird.y - bird.r < 0){ 
                bird.y = bird.r; 
                bird.vy = 0; 
            }
        }

        function draw(){
            // clear
            ctx.clearRect(0,0,W,H);

            // sky
            const g = ctx.createLinearGradient(0,0,0,H);
            g.addColorStop(0,'#70c5ce'); 
            g.addColorStop(1,'#8ed0d8'); 
            ctx.fillStyle = g; 
            ctx.fillRect(0,0,W,H);

            // parallax clouds (simple moving shapes)
            drawClouds();

            // moving mid buildings for parallax
            drawMovingBuildings();

            // pipes
            for(const p of pipes){
                // body
                drawPipe(p.x, 0, p.w, p.top, false);
                drawPipe(p.x, p.bottom, p.w, H - p.bottom - 80, true);
            }

            // ground
            drawGround();

            // bird (slightly more detailed)
            ctx.save(); 
            ctx.translate(bird.x, bird.y); 
            ctx.rotate(bird.rot);
            // body
            ctx.beginPath(); 
            ctx.fillStyle = '#ffcb05'; 
            ctx.arc(0,0,bird.r,0,Math.PI*2); 
            ctx.fill();
            // wing (animated)
            ctx.save(); 
            ctx.translate(-2,6); 
            ctx.rotate(Math.sin(performance.now()/120)*0.6); 
            ctx.beginPath(); 
            ctx.ellipse(0,0,10,5, -0.6, 0, Math.PI*2); 
            ctx.fillStyle='#f0b800'; 
            ctx.fill(); 
            ctx.restore();
            // beak
            ctx.beginPath(); 
            ctx.fillStyle='#ff7b00'; 
            ctx.moveTo(10,0); 
            ctx.lineTo(18,-4); 
            ctx.lineTo(18,4); 
            ctx.closePath(); 
            ctx.fill();
            // eye
            ctx.beginPath(); 
            ctx.fillStyle='#222'; 
            ctx.arc(6,-4,4,0,Math.PI*2); 
            ctx.fill();
            ctx.restore();

            // particles
            for(const par of particles){ 
                ctx.beginPath(); 
                ctx.globalAlpha = Math.max(0, Math.min(1, par.life/80)); 
                ctx.fillStyle = '#ffcf66'; 
                ctx.arc(par.x, par.y, par.r,0,Math.PI*2); 
                ctx.fill(); 
            }
            ctx.globalAlpha = 1;

            // overlay messages
            if(!running){ 
                ctx.fillStyle = 'rgba(0,0,0,0.45)'; 
                ctx.fillRect(0,0,W,H); 
                ctx.fillStyle = '#fff'; 
                ctx.textAlign='center'; 
                ctx.font = '28px system-ui'; 
                ctx.fillText('Game Over', W/2, H/2 - 8); 
                ctx.font='16px system-ui'; 
                ctx.fillText('Click / Space to restart', W/2, H/2 + 20); 
            }
        }

        // drawing helpers
        function drawPipe(x,y,w,h,isBottom){ // pipe body with simple shading
            ctx.save(); 
            ctx.translate(x,y);
            ctx.fillStyle = '#2ea44f'; 
            ctx.fillRect(0,0,w,h);
            // darker inner edge
            ctx.fillStyle = '#1b6b34'; 
            ctx.fillRect(4,0,8,h);
            // cap
            ctx.fillStyle = '#1b6b34'; 
            ctx.fillRect(-6, isBottom? -10 : h, w+12, 12);
            ctx.restore();
        }

        // ground
        function drawGround(){ 
            ctx.fillStyle = '#DED895'; 
            ctx.fillRect(0,H-80,W,80); 
            for(let i=0;i<W;i+=22){ 
                ctx.fillStyle = i%44===0? '#d6cf86' : '#e6df9b'; 
                ctx.fillRect(i,H-80,12,80); 
            } 
        }

        // static cloud layers
        const cloudLayer = Array.from({length:6}).map((_,i)=>({x: Math.random()*W*1.5, y: 40 + i*18 + Math.random()*40, s: 30 + Math.random()*60, speed: 0.12 + Math.random()*0.18}));
        function drawClouds(){ 
            for(const c of cloudLayer){ 
                c.x -= c.speed; 
                if(c.x < -c.s*2) c.x = W + Math.random()*80; 
                ctx.beginPath(); 
                ctx.fillStyle = 'rgba(255,255,255,0.85)'; 
                ctx.ellipse(c.x, c.y, c.s, c.s*0.6, 0,0,Math.PI*2); 
                ctx.fill(); 
            } 
        }

        // moving buildings for parallax
        const moveBuildings = Array.from({length:8}).map((_,i)=>({x: i*110 + 20, w: 40 + (i%3)*20, h: 80 + (i%5)*30, speed: 0.4}));
        function drawMovingBuildings(){ 
            for(const b of moveBuildings){ 
                b.x -= b.speed; 
                if(b.x < -120) b.x = W + Math.random()*120; 
                ctx.save(); 
                ctx.globalAlpha = 0.22; 
                ctx.fillStyle = '#093b44'; 
                ctx.fillRect(b.x, H-80 - b.h - 8, b.w, b.h); 
                ctx.restore(); 
            } 
        }

        // main loop
        function loop(now){ 
            const dt = now - lastTime; 
            lastTime = now; 
            if(running) update(dt); 
            draw(); 
            requestAnimationFrame(loop); 
        }

        // start
        newGame(); 
        requestAnimationFrame(loop);

        // accessibility: expose score
        canvas.setAttribute('tabindex','0');
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
        },
        7: {
            title: 'Minesweeper',
            content: getMinesweeperHTML(),
            init: initializeMinesweeper
        },
        8: {
            title: 'Flappy',
            content: getFlappyHTML(),
            init: initializeFlappy
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
