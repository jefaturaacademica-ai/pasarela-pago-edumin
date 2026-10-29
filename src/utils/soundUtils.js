// src/utils/soundUtils.js
// Audio synthesis using Web Audio API for payment confirmation chime
// Produces the unmistakable positive confirmation sound ("ding-dong" / triumphant chime)

export function playPaymentSuccessSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // --- Master Gain ---
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.4, now);
    masterGain.connect(ctx.destination);

    // Tone 1: E5 (659.25 Hz) - Bell sound start
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.5, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.start(now);
    osc1.stop(now + 0.45);

    // Tone 2: A5 / C6 (1046.50 Hz) - Higher triumphant bell note slightly offset
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1046.50, now + 0.11);
    gain2.gain.setValueAtTime(0.65, now + 0.11);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start(now + 0.11);
    osc2.stop(now + 0.95);

    // Tone 3: Harmonic shimmer E6 (1318.51 Hz) for warmth & richness
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(1318.51, now + 0.14);
    gain3.gain.setValueAtTime(0.25, now + 0.14);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
    osc3.connect(gain3);
    gain3.connect(masterGain);
    osc3.start(now + 0.14);
    osc3.stop(now + 0.75);

    // Auto close context after sound finishes to free audio resources
    setTimeout(() => {
      try {
        if (ctx.state !== 'closed') ctx.close();
      } catch (e) {
        // ignore
      }
    }, 1200);
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}
