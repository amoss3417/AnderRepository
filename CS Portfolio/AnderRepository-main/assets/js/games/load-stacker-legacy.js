document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('legacy-game-root');
    if (!root || typeof getStackerHTML !== 'function' || typeof initializeStacker !== 'function') return;
    root.innerHTML = getStackerHTML();
    initializeStacker();
});
