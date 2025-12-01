let dots = 0;
let genInterval;
let generatingText = document.getElementById("generating-chord");

function startGeneratingAnim() {
    genInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        generatingText.textContent = "Generating" + ".".repeat(dots);
    }, 400);
}

function stopGeneratingAnim() {
    clearInterval(genInterval);
    generatingText.textContent = "Generating";
    dots = 0;
}