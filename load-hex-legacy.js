document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('legacy-game-root');
    if (!root || typeof getHexGuessingGameHTML !== 'function' || typeof initializeHexGuessingGame !== 'function') return;
    root.innerHTML = getHexGuessingGameHTML();
    initializeHexGuessingGame();
});
