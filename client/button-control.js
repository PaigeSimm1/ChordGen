// Store the selected dropdown values
let selectedStyle = '';
let selectedScale = '';
let selectedTime = '';

document.addEventListener("DOMContentLoaded", () => {
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach(dropdown => {
        const dd_toggle = dropdown.querySelector(".dropdown-toggle");
        const dd_items = dropdown.querySelectorAll(".dropdown-item");

        dd_items.forEach(item => {
            item.addEventListener("click", function (event) {
                event.preventDefault();

                // Update button text
                const selectedText = this.textContent.trim();
                dd_toggle.textContent = selectedText;
                dd_toggle.classList.remove("error-field");

                // Store selected values based on which dropdown
                if (dd_toggle.classList.contains("style-button")) {
                    selectedStyle = selectedText;
                    document.getElementById("style-value").value = selectedStyle;
                    document.getElementById("error-style").innerHTML = "";
                }

                else if (dd_toggle.classList.contains("scale-button")) {
                    selectedScale = selectedText;
                    document.getElementById("scale-value").value = selectedScale;
                    document.getElementById("error-scale").innerHTML = "";
                }

                else if (dd_toggle.classList.contains("time-button")) {
                    selectedTime = selectedText;
                    document.getElementById("time-value").value = selectedTime;
                    document.getElementById("error-time").innerHTML = "";
                }
            });
        });
    });

    const bpmInput = document.getElementById("bpm-control");
    if (bpmInput) { // If it exists
        bpmInput.addEventListener("input", () => {
            bpmInput.classList.remove("error-field");
            const bpmError = document.getElementById("error-bpm");
            if (bpmError) bpmError.innerHTML = "";
        })
    }
});
