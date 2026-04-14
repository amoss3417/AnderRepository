(function initializeSolitaire() {
    const board = document.getElementById('solitaire-board');
    if (!board) return;

    const stockEl = document.getElementById('sol-stock');
    const wasteEl = document.getElementById('sol-waste');
    const tableauEls = Array.from(document.querySelectorAll('.pile.tableau'));
    const foundationEls = Array.from(document.querySelectorAll('.pile.foundation'));

    const newGameBtn = document.getElementById('sol-new-game');
    const undoBtn = document.getElementById('sol-undo');
    const themeBtn = document.getElementById('sol-theme');

    const scoreEl = document.getElementById('sol-score');
    const movesEl = document.getElementById('sol-moves');
    const timeEl = document.getElementById('sol-time');

    const SUITS = ['S', 'H', 'D', 'C'];
    const SUIT_SYMBOL = { S: '♠', H: '♥', D: '♦', C: '♣' };
    const SUIT_NAME = { S: 'spades', H: 'hearts', D: 'diamonds', C: 'clubs' };
    const RANK_LABEL = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
    const RED_SUITS = new Set(['H', 'D']);
    const CARD_ASSET_BASE = '../../assets/sprites/svg-cards/';
    const BACK_ASSET_FILE = 'blueBack.svg';

    const DRAW_COUNT = 1;

    let state = null;
    let history = [];
    let timerId = null;
    let dragPayload = null;
    let dropAnimatedIds = new Set();
    let flipAnimatedIds = new Set();

    function createDeck() {
        const deck = [];
        let idCounter = 0;
        for (const suit of SUITS) {
            for (let rank = 1; rank <= 13; rank++) {
                deck.push({ id: `c${idCounter++}`, suit, rank, faceUp: false });
            }
        }
        return deck;
    }

    function shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    function cloneState(input) {
        return JSON.parse(JSON.stringify(input));
    }

    function formatTime(seconds) {
        const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
        const ss = String(seconds % 60).padStart(2, '0');
        return `${mm}:${ss}`;
    }

    function rankLabel(rank) {
        return RANK_LABEL[rank] || String(rank);
    }

    function rankAssetLabel(rank) {
        if (rank === 1) return 'ace';
        if (rank === 11) return 'jack';
        if (rank === 12) return 'queen';
        if (rank === 13) return 'king';
        return String(rank);
    }

    function getCardAssetPath(card) {
        const rankPart = rankAssetLabel(card.rank);
        const suitPart = SUIT_NAME[card.suit];
        return `${CARD_ASSET_BASE}${rankPart}_of_${suitPart}.svg`;
    }

    function isRed(card) {
        return RED_SUITS.has(card.suit);
    }

    function setupNewGame() {
        stopTimer();
        history = [];

        const deck = shuffle(createDeck());

        const tableau = Array.from({ length: 7 }, () => []);
        for (let col = 0; col < 7; col++) {
            for (let row = 0; row <= col; row++) {
                const card = deck.pop();
                card.faceUp = row === col;
                tableau[col].push(card);
            }
        }

        state = {
            stock: deck,
            waste: [],
            foundations: { S: [], H: [], D: [], C: [] },
            tableau,
            score: 0,
            moves: 0,
            seconds: 0
        };

        startTimer();
        render();
    }

    function startTimer() {
        timerId = setInterval(() => {
            state.seconds += 1;
            timeEl.textContent = formatTime(state.seconds);
        }, 1000);
    }

    function stopTimer() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    function pushHistory() {
        history.push(cloneState(state));
        if (history.length > 200) history.shift();
    }

    function commitMove(scoreDelta) {
        state.moves += 1;
        state.score = Math.max(0, state.score + scoreDelta);
        render();
    }

    function markMovedCards(cards) {
        dropAnimatedIds = new Set(cards.map((card) => card.id));
    }

    function markFlippedCards(cards) {
        cards.forEach((card) => {
            flipAnimatedIds.add(card.id);
        });
    }

    function cardFromCardId(cardId) {
        const all = [
            ...state.stock,
            ...state.waste,
            ...SUITS.flatMap((s) => state.foundations[s]),
            ...state.tableau.flat()
        ];
        return all.find((c) => c.id === cardId) || null;
    }

    function renderCard(card, pileType, pileIndex, cardIndex) {
        const cardEl = document.createElement('div');
        cardEl.className = `card ${card.faceUp ? 'face-up' : 'face-down'} ${card.faceUp ? (isRed(card) ? 'red' : 'black') : ''}`;
        cardEl.dataset.cardId = card.id;
        cardEl.draggable = card.faceUp;

        cardEl.style.top = pileType === 'tableau' ? `${cardIndex * (card.faceUp ? 28 : 14)}px` : '0px';
        cardEl.style.left = '50%';
        cardEl.style.zIndex = String(cardIndex + 1);

        if (dropAnimatedIds.has(card.id)) {
            cardEl.classList.add('is-dropping');
        }

        if (card.faceUp && flipAnimatedIds.has(card.id)) {
            cardEl.classList.add('is-flipping');
        }

        if (card.faceUp) {
            const img = document.createElement('img');
            img.className = 'card-art';
            img.src = getCardAssetPath(card);
            img.alt = `${rankLabel(card.rank)} of ${SUIT_NAME[card.suit]}`;
            img.draggable = false;
            cardEl.classList.add('with-art');

            // Fallback to generated symbols if a specific SVG is missing.
            img.onerror = () => {
                img.remove();
                cardEl.classList.remove('with-art');
                if (!cardEl.querySelector('.corner')) {
                    const top = document.createElement('div');
                    top.className = 'corner top';
                    top.innerHTML = `<span>${rankLabel(card.rank)}</span><span>${SUIT_SYMBOL[card.suit]}</span>`;

                    const bottom = document.createElement('div');
                    bottom.className = 'corner bottom';
                    bottom.innerHTML = `<span>${rankLabel(card.rank)}</span><span>${SUIT_SYMBOL[card.suit]}</span>`;

                    const center = document.createElement('div');
                    center.className = 'suit-center';
                    center.textContent = SUIT_SYMBOL[card.suit];

                    cardEl.appendChild(top);
                    cardEl.appendChild(bottom);
                    cardEl.appendChild(center);
                }
            };

            cardEl.appendChild(img);
        } else {
            const backImg = document.createElement('img');
            backImg.className = 'card-art';
            backImg.src = `${CARD_ASSET_BASE}${BACK_ASSET_FILE}`;
            backImg.alt = 'Card back';
            backImg.draggable = false;
            cardEl.classList.add('with-art');
            backImg.onerror = () => {
                backImg.remove();
                cardEl.classList.remove('with-art');
            };
            cardEl.appendChild(backImg);
        }

        cardEl.addEventListener('dragstart', (event) => {
            if (!card.faceUp) {
                event.preventDefault();
                return;
            }

            let count = 1;
            if (pileType === 'tableau') {
                count = state.tableau[pileIndex].length - cardIndex;
            }

            dragPayload = {
                source: pileType,
                index: pileIndex,
                start: cardIndex,
                count,
                cardId: card.id
            };

            // Fade source cards so dragging doesn't look like duplicate copies.
            markDragPlaceholders(dragPayload);
            cardEl.classList.add('is-dragging');
            event.dataTransfer.effectAllowed = 'move';
        });

        cardEl.addEventListener('dragend', () => {
            cardEl.classList.remove('is-dragging');
            // Let drop handlers run first; immediate cleanup can cancel valid drops in some browsers.
            setTimeout(() => {
                clearDragPlaceholders();
                clearPileStates();
                dragPayload = null;
            }, 0);
        });

        cardEl.addEventListener('dblclick', () => {
            if (!card.faceUp) return;
            tryAutoFoundation(card.id, pileType, pileIndex, cardIndex);
        });

        return cardEl;
    }

    function clearPileStates() {
        [stockEl, wasteEl, ...tableauEls, ...foundationEls].forEach((pile) => {
            pile.classList.remove('drop-ok');
        });
    }

    function clearDragPlaceholders() {
        board.querySelectorAll('.card.drag-placeholder').forEach((card) => {
            card.classList.remove('drag-placeholder');
        });
    }

    function getSourcePileElement(source, index) {
        if (source === 'stock') return stockEl;
        if (source === 'waste') return wasteEl;
        if (source === 'tableau') return tableauEls[index] || null;
        if (source === 'foundation') return foundationEls.find((pile) => pile.dataset.suit === index) || null;
        return null;
    }

    function markDragPlaceholders(payload) {
        clearDragPlaceholders();

        const sourcePile = getSourcePileElement(payload.source, payload.index);
        if (!sourcePile) return;

        const cards = Array.from(sourcePile.querySelectorAll('.card'));
        if (!cards.length) return;

        if (payload.source === 'tableau') {
            for (let i = payload.start; i < cards.length; i++) {
                cards[i].classList.add('drag-placeholder');
            }
            return;
        }

        cards[cards.length - 1].classList.add('drag-placeholder');
    }

    function render() {
        scoreEl.textContent = String(state.score);
        movesEl.textContent = String(state.moves);
        timeEl.textContent = formatTime(state.seconds);

        clearDragPlaceholders();
        clearPileStates();

        stockEl.innerHTML = '';
        wasteEl.innerHTML = '';
        tableauEls.forEach((el) => { el.innerHTML = ''; });
        foundationEls.forEach((el) => { el.innerHTML = ''; });

        stockEl.classList.toggle('empty', state.stock.length === 0);
        wasteEl.classList.toggle('empty', state.waste.length === 0);

        if (state.stock.length > 0) {
            const topStock = renderCard({ ...state.stock[state.stock.length - 1], faceUp: false }, 'stock', -1, 0);
            stockEl.appendChild(topStock);
        }

        const wasteVisible = state.waste.slice(-DRAW_COUNT);
        wasteVisible.forEach((card, i) => {
            const cardEl = renderCard(card, 'waste', -1, i);
            const centeredOffset = (i - (wasteVisible.length - 1) / 2) * 24;
            cardEl.style.left = `calc(50% + ${centeredOffset}px)`;
            cardEl.style.zIndex = String(100 + i);
            wasteEl.appendChild(cardEl);
        });

        SUITS.forEach((suit) => {
            const pile = foundationEls.find((p) => p.dataset.suit === suit);
            const top = state.foundations[suit][state.foundations[suit].length - 1];
            pile.classList.toggle('empty', !top);
            if (top) pile.appendChild(renderCard(top, 'foundation', suit, 0));
        });

        tableauEls.forEach((pileEl, col) => {
            const pileCards = state.tableau[col];
            pileCards.forEach((card, idx) => {
                pileEl.appendChild(renderCard(card, 'tableau', col, idx));
            });
        });

        checkWin();
        dropAnimatedIds.clear();
        flipAnimatedIds.clear();
    }

    function canPlaceOnFoundation(card, suit) {
        if (card.suit !== suit) return false;
        const foundation = state.foundations[suit];
        if (foundation.length === 0) return card.rank === 1;
        const top = foundation[foundation.length - 1];
        return card.rank === top.rank + 1;
    }

    function canPlaceOnTableau(movingCard, targetPile) {
        const top = targetPile[targetPile.length - 1];
        if (!top) return movingCard.rank === 13;
        return top.faceUp && isRed(top) !== isRed(movingCard) && movingCard.rank === top.rank - 1;
    }

    function isValidTableauRun(cards) {
        for (let i = 0; i < cards.length - 1; i++) {
            const a = cards[i];
            const b = cards[i + 1];
            if (!a.faceUp || !b.faceUp) return false;
            if (isRed(a) === isRed(b)) return false;
            if (a.rank !== b.rank + 1) return false;
        }
        return true;
    }

    function moveWasteToFoundation(suit) {
        const card = state.waste[state.waste.length - 1];
        if (!card || !canPlaceOnFoundation(card, suit)) return false;
        pushHistory();
        state.waste.pop();
        state.foundations[suit].push(card);
        markMovedCards([card]);
        commitMove(10);
        return true;
    }

    function moveWasteToTableau(col) {
        const card = state.waste[state.waste.length - 1];
        if (!card || !canPlaceOnTableau(card, state.tableau[col])) return false;
        pushHistory();
        state.waste.pop();
        state.tableau[col].push(card);
        markMovedCards([card]);
        commitMove(5);
        return true;
    }

    function moveTableauRunToTableau(fromCol, startIndex, toCol) {
        const source = state.tableau[fromCol];
        const run = source.slice(startIndex);
        if (run.length < 1 || !isValidTableauRun(run)) return false;
        if (!canPlaceOnTableau(run[0], state.tableau[toCol])) return false;

        pushHistory();
        state.tableau[toCol].push(...run);
        state.tableau[fromCol] = source.slice(0, startIndex);

        const newTop = state.tableau[fromCol][state.tableau[fromCol].length - 1];
        if (newTop && !newTop.faceUp) {
            newTop.faceUp = true;
            state.score += 5;
            markFlippedCards([newTop]);
        }

        markMovedCards(run);
        commitMove(3);
        return true;
    }

    function moveTableauCardToFoundation(fromCol, cardIndex, suit) {
        const source = state.tableau[fromCol];
        const card = source[cardIndex];
        if (!card || cardIndex !== source.length - 1) return false;
        if (!canPlaceOnFoundation(card, suit)) return false;

        pushHistory();
        source.pop();
        state.foundations[suit].push(card);

        const newTop = source[source.length - 1];
        if (newTop && !newTop.faceUp) {
            newTop.faceUp = true;
            state.score += 5;
            markFlippedCards([newTop]);
        }

        markMovedCards([card]);
        commitMove(10);
        return true;
    }

    function moveFoundationToTableau(suit, toCol) {
        const foundation = state.foundations[suit];
        const card = foundation[foundation.length - 1];
        if (!card) return false;
        if (!canPlaceOnTableau(card, state.tableau[toCol])) return false;

        pushHistory();
        foundation.pop();
        state.tableau[toCol].push(card);
        markMovedCards([card]);
        commitMove(-15);
        return true;
    }

    function drawFromStock() {
        pushHistory();
        if (state.stock.length === 0) {
            if (state.waste.length === 0) {
                history.pop();
                return;
            }
            while (state.waste.length) {
                const card = state.waste.pop();
                card.faceUp = false;
                state.stock.push(card);
            }
            commitMove(0);
            return;
        }

        const take = Math.min(DRAW_COUNT, state.stock.length);
        const drawnCards = [];
        for (let i = 0; i < take; i++) {
            const card = state.stock.pop();
            card.faceUp = true;
            state.waste.push(card);
            drawnCards.push(card);
        }
        markFlippedCards(drawnCards);
        markMovedCards(drawnCards);
        commitMove(0);
    }

    function tryAutoFoundation(cardId, sourceType, sourceIndex, cardIndex) {
        const card = cardFromCardId(cardId);
        if (!card || !card.faceUp) return;

        for (const suit of SUITS) {
            if (!canPlaceOnFoundation(card, suit)) continue;

            if (sourceType === 'waste') {
                if (moveWasteToFoundation(suit)) return;
            }

            if (sourceType === 'tableau') {
                if (moveTableauCardToFoundation(sourceIndex, cardIndex, suit)) return;
            }

            if (sourceType === 'foundation') {
                return;
            }
        }
    }

    function onDrop(targetPile) {
        if (!dragPayload) return;
        const targetType = targetPile.dataset.pileType;

        let moved = false;

        if (targetType === 'foundation') {
            const suit = targetPile.dataset.suit;
            if (dragPayload.source === 'waste' && dragPayload.count === 1) {
                moved = moveWasteToFoundation(suit);
            } else if (dragPayload.source === 'tableau' && dragPayload.count === 1) {
                moved = moveTableauCardToFoundation(dragPayload.index, dragPayload.start, suit);
            }
        }

        if (targetType === 'tableau') {
            const toCol = Number(targetPile.dataset.index);
            if (dragPayload.source === 'waste' && dragPayload.count === 1) {
                moved = moveWasteToTableau(toCol);
            } else if (dragPayload.source === 'tableau') {
                moved = moveTableauRunToTableau(dragPayload.index, dragPayload.start, toCol);
            } else if (dragPayload.source === 'foundation' && dragPayload.count === 1) {
                moved = moveFoundationToTableau(dragPayload.index, toCol);
            }
        }

        clearDragPlaceholders();
        clearPileStates();
        dragPayload = null;

        if (!moved) {
            render();
        }
    }

    function bindDropTarget(pileEl) {
        pileEl.addEventListener('dragover', (event) => {
            event.preventDefault();
            pileEl.classList.add('drop-ok');
        });
        pileEl.addEventListener('dragleave', () => {
            pileEl.classList.remove('drop-ok');
        });
        pileEl.addEventListener('drop', (event) => {
            event.preventDefault();
            onDrop(pileEl);
        });
    }

    function checkWin() {
        const total = SUITS.reduce((sum, suit) => sum + state.foundations[suit].length, 0);
        if (total !== 52) return;
        stopTimer();
        board.classList.add('alt-felt');
        setTimeout(() => board.classList.remove('alt-felt'), 900);
    }

    function undoMove() {
        if (!history.length) return;
        state = history.pop();
        dropAnimatedIds.clear();
        flipAnimatedIds.clear();
        render();
    }

    stockEl.addEventListener('click', drawFromStock);

    wasteEl.addEventListener('click', () => {
        const top = state.waste[state.waste.length - 1];
        if (!top) return;

        if (tryMoveWasteToFirstValid()) {
            return;
        }

        const targetTableau = state.tableau.findIndex((pile) => canPlaceOnTableau(top, pile));
        if (targetTableau >= 0) {
            moveWasteToTableau(targetTableau);
        }
    });

    function tryMoveWasteToFirstValid() {
        const top = state.waste[state.waste.length - 1];
        if (!top) return false;
        for (const suit of SUITS) {
            if (canPlaceOnFoundation(top, suit)) {
                return moveWasteToFoundation(suit);
            }
        }
        return false;
    }

    newGameBtn.addEventListener('click', setupNewGame);
    undoBtn.addEventListener('click', undoMove);

    const savedFelt = localStorage.getItem('sol_felt_mode') || 'green';
    if (savedFelt === 'alt') board.classList.add('alt-felt');

    themeBtn.addEventListener('click', () => {
        board.classList.toggle('alt-felt');
        localStorage.setItem('sol_felt_mode', board.classList.contains('alt-felt') ? 'alt' : 'green');
    });

    bindDropTarget(wasteEl);
    tableauEls.forEach(bindDropTarget);
    foundationEls.forEach(bindDropTarget);

    foundationEls.forEach((foundationEl) => {
        foundationEl.addEventListener('dragstart', (event) => {
            const cardEl = event.target.closest('.card.face-up');
            if (!cardEl) return;
            const suit = foundationEl.dataset.suit;
            dragPayload = {
                source: 'foundation',
                index: suit,
                start: 0,
                count: 1,
                cardId: cardEl.dataset.cardId
            };
            markDragPlaceholders(dragPayload);
            event.dataTransfer.effectAllowed = 'move';
        });
    });

    setupNewGame();
})();
