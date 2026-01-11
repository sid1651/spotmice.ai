import * as Tone from "tone";

const CELL = 20;

const pitchFromY = (y) => 84 - y / CELL;
const timeFromX = (x) => (x / CELL) * 0.25;

export default function Transport({ notes, tempo = 120 }) {
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();

  const play = async () => {
    await Tone.start();
    Tone.Transport.bpm.value = tempo;
    Tone.Transport.stop();
    Tone.Transport.cancel();

    notes.forEach(n => {
      Tone.Transport.schedule((time) => {
        synth.triggerAttackRelease(
          Tone.Frequency(pitchFromY(n.y), "midi"),
          "8n",
          time
        );
      }, timeFromX(n.x));
    });

    Tone.Transport.start();
  };

  const stop = () => {
    Tone.Transport.stop();
  };

  return (
    <div>
      <button onClick={play}>▶ Play</button>
      <button onClick={stop}>⏹ Stop</button>
    </div>
  );
}
