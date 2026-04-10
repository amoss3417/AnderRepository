document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('legacy-game-root');
    if (!root || typeof getFlappyHTML !== 'function' || typeof initializeFlappy !== 'function') return;
    root.innerHTML = getFlappyHTML();
    initializeFlappy();
});
