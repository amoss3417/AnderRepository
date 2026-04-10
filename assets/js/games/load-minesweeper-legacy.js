document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('legacy-game-root');
    if (!root || typeof getMinesweeperHTML !== 'function' || typeof initializeMinesweeper !== 'function') return;
    root.innerHTML = getMinesweeperHTML();
    initializeMinesweeper();
});
