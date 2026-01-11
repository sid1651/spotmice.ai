import * as Tone from "tone";

export async function exportToWav(notes, tempo = 120) {
  if (!notes.length) {
    alert("No notes to export");
    return;
  }

  await Tone.start(); // 🔴 REQUIRED by browser

  const recorder = new Tone.Recorder();
  const synth = new Tone.PolySynth(Tone.Synth);
  synth.connect(recorder);
  synth.toDestination();

  Tone.Transport.stop();
  Tone.Transport.cancel();
  Tone.Transport.bpm.value = tempo;

  const CELL = 20;
  const pitchFromY = (y) => 84 - y / CELL;
  const timeFromX = (x) => (x / CELL) * 0.25;

  // Schedule notes
  notes.forEach((n) => {
    Tone.Transport.schedule((time) => {
      synth.triggerAttackRelease(
        Tone.Frequency(pitchFromY(n.y), "midi"),
        "8n",
        time
      );
    }, timeFromX(n.x));
  });

  // ⏱ Calculate total duration
  const lastTime =
    Math.max(...notes.map((n) => timeFromX(n.x))) + 1;

  console.log("🎙 Recording started");
  recorder.start();
  Tone.Transport.start();

  // 🔥 MANUAL STOP (CRITICAL)
  setTimeout(async () => {
    Tone.Transport.stop();

    const recording = await recorder.stop();
    console.log("✅ Recording finished");

    const url = URL.createObjectURL(recording);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.wav";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }, lastTime * 1000);
}
