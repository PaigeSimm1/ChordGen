document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("chord-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearErrors();

        const formData = new FormData(form);

        try {
            const response = await fetch("http://localhost:3000", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400 && data.errors) {
                    showErrors(data.errors);
                    return;
                    
                }

                console.error("Server error:", data);
                return;
            }

            localStorage.setItem("generatedChords", JSON.stringify(data.progression));
            localStorage.setItem("pendingChordForm", JSON.stringify({
                style: formData.get("style"),
                scale: formData.get("scale"),
                time: formData.get("time"),
                bpm: formData.get("bpm")
            }));

            window.location.href = "generating.html";
        } catch (error) {
            console.error("Submit failed:", error);
        }
    });
});