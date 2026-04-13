(function initializeArduinoSimulator() {
    const root = document.querySelector('.arduino-sim');
    if (!root) return;

    const digitEls = Array.from(root.querySelectorAll('.digit'));
    const indicatorEl = root.querySelector('#sim-scan-indicator');
    const stateTextEl = root.querySelector('#sim-state-text');
    const digitButtons = Array.from(root.querySelectorAll('[data-ir-digit]'));
    const clearButton = root.querySelector('[data-ir-clear]');

    const MAX_DIGITS = 4;

    // Mirrors the seven-segment mappings from the Arduino sketch.
    const digitToSegments = {
        0: ['a', 'b', 'c', 'd', 'e', 'f'],
        1: ['b', 'c'],
        2: ['a', 'b', 'd', 'e', 'g'],
        3: ['a', 'b', 'c', 'd', 'g'],
        4: ['b', 'c', 'f', 'g'],
        5: ['a', 'c', 'd', 'f', 'g'],
        6: ['a', 'c', 'd', 'e', 'f', 'g'],
        7: ['a', 'b', 'c'],
        8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
        9: ['a', 'b', 'c', 'd', 'f', 'g']
    };

    let receivedNumber = 0;
    let digitCount = 0;
    let scanIndex = 0;

    function mapCountToDigits(number) {
        return [
            Math.floor(number / 1000),
            Math.floor((number % 1000) / 100),
            Math.floor((number % 100) / 10),
            number % 10
        ];
    }

    function getDisplayValues() {
        if (digitCount === 0) {
            return [0, 0, 0, 0];
        }
        return mapCountToDigits(receivedNumber);
    }

    function updateStateText() {
        stateTextEl.textContent = `receivedNumber: ${receivedNumber} | digitCount: ${digitCount}`;
    }

    function paintDigit(digitEl, value) {
        const active = new Set(value === null ? [] : (digitToSegments[value] || []));
        const segs = Array.from(digitEl.querySelectorAll('.seg'));

        segs.forEach((segEl) => {
            const segmentName = segEl.className.match(/seg-([a-g])/);
            if (!segmentName) return;
            const isOn = active.has(segmentName[1]);
            segEl.classList.toggle('is-on', isOn);
        });
    }

    function renderDisplay() {
        const values = getDisplayValues();

        digitEls.forEach((digitEl, index) => {
            paintDigit(digitEl, values[index]);
            digitEl.classList.toggle('is-active-digit', index === scanIndex);
        });

        indicatorEl.textContent = `Scanning digit D${scanIndex + 1}`;
        updateStateText();
    }

    function onDigitPress(value) {
        if (digitCount >= MAX_DIGITS) return;
        receivedNumber = (receivedNumber * 10) + value;
        digitCount += 1;
        renderDisplay();
    }

    function clearInput() {
        receivedNumber = 0;
        digitCount = 0;
        renderDisplay();
    }

    digitButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const value = Number(button.getAttribute('data-ir-digit'));
            if (Number.isNaN(value)) return;
            onDigitPress(value);
        });
    });

    clearButton.addEventListener('click', clearInput);

    document.addEventListener('keydown', (event) => {
        if (event.key >= '0' && event.key <= '9') {
            onDigitPress(Number(event.key));
            return;
        }

        if (event.key === '=' || event.key === 'Enter' || event.key === 'Backspace') {
            clearInput();
        }
    });

    setInterval(() => {
        scanIndex = (scanIndex + 1) % 4;
        renderDisplay();
    }, 120);

    renderDisplay();
})();
