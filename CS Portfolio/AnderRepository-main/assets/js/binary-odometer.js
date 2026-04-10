document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("binary-decimal-input");
    const bitMode = document.getElementById("binary-bit-mode");
    const button = document.getElementById("binary-convert-btn");
    const strip = document.getElementById("binary-strip");
    const groupedOut = document.getElementById("binary-grouped");
    const rawOut = document.getElementById("binary-raw");
    const errorOut = document.getElementById("binary-error");

    if (!input || !bitMode || !button || !strip || !groupedOut || !rawOut || !errorOut) return;

    function getBitCount() {
        return Number(bitMode.value) || 16;
    }

    function renderBits(value) {
        const bitCount = getBitCount();
        const bits = value.toString(2).padStart(bitCount, "0");
        strip.innerHTML = "";

        for (let i = 0; i < bits.length; i++) {
            const digit = document.createElement("div");
            const bit = bits[i];
            digit.className = `binary-digit ${bit === "1" ? "active" : ""}`.trim();
            digit.textContent = bit;
            strip.appendChild(digit);
        }

        const grouped = bits.match(/.{1,4}/g)?.join(" ") || bits;
        groupedOut.textContent = grouped;
        rawOut.textContent = bits;
    }

    function convert() {
        errorOut.textContent = "";
        const value = Number(input.value);
        const bitCount = getBitCount();
        const maxValue = Math.pow(2, bitCount) - 1;

        if (!Number.isInteger(value) || value < 0) {
            errorOut.textContent = "Enter a whole number 0 or greater.";
            return;
        }

        if (value > maxValue) {
            errorOut.textContent = `For ${bitCount}-bit mode, use numbers up to ${maxValue}.`;
            return;
        }

        renderBits(value);
    }

    button.addEventListener("click", convert);
    bitMode.addEventListener("change", convert);
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            convert();
        }
    });

    renderBits(0);
});
