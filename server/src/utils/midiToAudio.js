import { exec } from "child_process";

export function exportMidiToWav(midiPath, outputPath) {
  return new Promise((resolve, reject) => {
    exec(`fluidsynth -ni soundfont.sf2 ${midiPath} -F ${outputPath} -r 44100`,
      err => err ? reject(err) : resolve()
    );
  });
}
