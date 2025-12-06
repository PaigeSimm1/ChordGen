let chordProgression = JSON.parse(localStorage.getItem("generatedChords")) || [];

document.getElementById("play-btn").addEventListener("click", playProgression);

async function playProgression() {
    if (!chordProgression.length) return alert("Generate a chord progression first!");

    await Tone.start(); // Needed to start the audio
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();

    let timeOffset = 0;

    chordProgression.forEach(({ chord, duration }) => {
        const notes = Tonal.Chord.get(chord).notes.map(n => n + "4");
        Tone.Transport.scheduleOnce(time => {
            synth.triggerAttackRelease(notes, duration, time);
        }, `+${timeOffset}`);

        const durSeconds = { "1n": 4, "2n": 2, "4n": 1, "8n": 0.5 }[duration] || 1;
        timeOffset += durSeconds;
    })

    Tone.Transport.start();
}

function changeChords() {
    document.getElementById("chord1").textContent = chordProgression[0].chord;
    document.getElementById("chord2").textContent = chordProgression[1].chord;
    document.getElementById("chord3").textContent = chordProgression[2].chord;
    document.getElementById("chord4").textContent = chordProgression[3].chord;
}

changeChords();