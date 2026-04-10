document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const output = document.getElementById("contact-output");

    if (!form || !output) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        output.textContent = "Thanks. Your message was captured locally for now. Next step is wiring this to email or a backend form service.";
        form.reset();
    });
});
