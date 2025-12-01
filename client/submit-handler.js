document.getElementById("chord-form").addEventListener("submit", function (event) {
    event.preventDefault();

    let bpmValue = document.getElementById('bpm-control').value;

    let formObject = {
        style: selectedStyle,
        scale: selectedScale,
        time: selectedTime,
        bpm: bpmValue
    };

    localStorage.setItem("pendingChordForm", JSON.stringify(formObject));

    window.location.href = "Generating.html";
});