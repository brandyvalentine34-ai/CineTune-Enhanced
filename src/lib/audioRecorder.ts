export interface RecordingControls {
  stop: () => Promise<{ blob: Blob; base64: string; mimeType: string }>;
  getAudioLevel: () => number;
}

export async function startRecording(onVolumeChange?: (level: number) => void): Promise<RecordingControls> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Microphone access is not supported by your browser.");
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
  // Audio Context for volume analyzer
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  let animationFrameId: number;

  const checkVolume = () => {
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;
    if (onVolumeChange) {
      onVolumeChange(Math.min(100, Math.round((avg / 128) * 100)));
    }
    animationFrameId = requestAnimationFrame(checkVolume);
  };

  checkVolume();

  // Determine supported mime type
  let mimeType = 'audio/webm';
  if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
    mimeType = 'audio/webm;codecs=opus';
  } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
    mimeType = 'audio/mp4';
  } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
    mimeType = 'audio/ogg';
  }

  const mediaRecorder = new MediaRecorder(stream, { mimeType });
  const chunks: BlobPart[] = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  mediaRecorder.start(200); // collect 200ms chunks

  return {
    getAudioLevel: () => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      return Math.min(100, Math.round((sum / dataArray.length / 128) * 100));
    },
    stop: () => {
      return new Promise((resolve) => {
        cancelAnimationFrame(animationFrameId);
        
        mediaRecorder.onstop = async () => {
          // Stop stream tracks
          stream.getTracks().forEach((track) => track.stop());
          if (audioCtx.state !== 'closed') {
            await audioCtx.close();
          }

          const blob = new Blob(chunks, { type: mimeType });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            resolve({ blob, base64, mimeType });
          };
          reader.readAsDataURL(blob);
        };

        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      });
    }
  };
}

// Simple synth audio generator for melody preview
export function playSyntheticMelody(bpm: number = 110) {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C4 to C5
    const beatLength = 60 / bpm;

    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * beatLength);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime + idx * beatLength);
      gain.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + idx * beatLength + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (idx + 0.9) * beatLength);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime + idx * beatLength);
      osc.stop(audioCtx.currentTime + (idx + 1) * beatLength);
    });
  } catch (err) {
    console.warn("Audio synthesis not available", err);
  }
}
