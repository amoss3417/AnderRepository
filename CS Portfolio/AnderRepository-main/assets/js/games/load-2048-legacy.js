document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('legacy-game-root');
    if (!root || typeof get2048GameHTML !== 'function' || typeof initialize2048Game !== 'function') return;
    root.innerHTML = get2048GameHTML();
    initialize2048Game();
});
