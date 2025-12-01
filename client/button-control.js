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
                dd_toggle.textContent = this.textContent.trim();

                // Store selected values based on which dropdown
                if (dd_toggle.classList.contains("style-button")) {
                    selectedStyle = this.textContent.trim();
                } else if (dd_toggle.classList.contains("scale-button")) {
                    selectedScale = this.textContent.trim();
                } else if (dd_toggle.classList.contains("time-button")) {
                    selectedTime = this.textContent.trim();
                }
            });
        });
    });
});

// playButton.addEventListener("click", () => {
//     if (!isPlaying) {
//         playIcon.classList.remove("fa-play");
//         playIcon.classList.add("fa-stop");
//         isPlaying = true;
//     } else {
//         playIcon.classList.remove("fa-stop");
//         playIcon.classList.add("fa-play");
//         isPlaying = false;
//     }
// });

// volumeButton.addEventListener("click", () => {
//     if (!isMuted) {
//         volumeIcon.classList.remove("fa-volume-high");
//         volumeIcon.classList.add("fa-volume-xmark");
//         isMuted = true;
//     } else {
//         volumeIcon.classList.remove("fa-volume-xmark");
//         volumeIcon.classList.add("fa-volume-high");
//         isMuted = false;
//     }
// });
