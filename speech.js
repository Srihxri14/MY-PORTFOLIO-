/**
 * SPATIAL AUDIO & SPEECH SYNTHESIS ENGINE
 * Handles "Say Hi, I am SRIHARI!", Web Audio SFX, and Lip-Sync Viseme Signals
 */

class SpatialSpeechEngine {
  constructor() {
    this.audioCtx = null;
    this.isSpeaking = false;
    this.speechAmplitude = 0;
    this.synth = window.speechSynthesis || null;
    this.soundEnabled = true;

    this.speechText = "Hi, I am SRIHARI! Welcome to my spatial universe. I am a Computer Science engineer at IFHE University, passionate about Artificial Intelligence, Machine Learning, and Computer Vision, as well as a State Rank 1 tennis champion. Explore my 3D world, test my project simulators, and let's connect!";

    this.bubbleEl = document.getElementById('speech-bubble');
    this.bubbleTextEl = document.getElementById('bubble-text');
    this.sayHiBtn = document.getElementById('say-hi-btn');
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');

    this.typewriterTimer = null;
    this.initAudioContext();
    this.bindEvents();
  }

  initAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.audioCtx = new AudioContext();
    }
  }

  ensureAudioReady() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Synthesizes spatial UI chimes directly via Web Audio API (Zero external MP3 dependencies!)
  playSpatialChime(type = 'click') {
    if (!this.soundEnabled) return;
    this.ensureAudioReady();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    if (type === 'boot') {
      // VisionOS Spatial Power-on Chord (Harmonic triad with smooth decay)
      const freqs = [440, 554.37, 659.25, 880]; // A major chord
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.08, now + i * 0.05 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + i * 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + 1.4);
      });
    } else if (type === 'hover') {
      // Soft high-frequency spatial bubble tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.04);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'click') {
      // Crisp glass click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'success') {
      // Futuristic positive ping
      [587.33, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.05, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
      });
    }
  }

  // "Say Hi, I am SRIHARI!"
  sayHi() {
    this.ensureAudioReady();
    this.playSpatialChime('boot');

    if (this.isSpeaking) {
      if (this.synth) this.synth.cancel();
      this.stopSpeakingAnimation();
      return;
    }

    this.startSpeakingAnimation();

    if (!this.synth) {
      // Fallback if browser speech synthesis is disabled
      this.simulateSpeechAudio();
      return;
    }

    // Cancel any prior speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(this.speechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick a natural clear voice if available
    const voices = this.synth.getVoices();
    const naturalVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.lang.startsWith('en')) && !v.name.includes('Bad'));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.simulateSpeechLipSync();
    };

    // Word boundary event for exact word-synchronized lip movement
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIdx = event.charIndex;
        const currentWord = this.speechText.substring(charIdx).split(/\s+/)[0].toLowerCase();

        // Detect rounded vowels (O / U / W)
        if (currentWord.includes('o') || currentWord.includes('u') || currentWord.includes('w')) {
          this.currentPhoneme = 'o';
        } else {
          this.currentPhoneme = 'vowel';
        }

        // Trigger syllable burst
        this.syllableEnergy = 1.0;
      }
    };

    utterance.onend = () => {
      this.stopSpeakingAnimation();
    };

    utterance.onerror = () => {
      this.stopSpeakingAnimation();
    };

    this.synth.speak(utterance);
  }

  startSpeakingAnimation() {
    this.isSpeaking = true;
    if (this.sayHiBtn) {
      this.sayHiBtn.classList.add('speaking');
      const textSpan = this.sayHiBtn.querySelector('.say-hi-text');
      if (textSpan) textSpan.textContent = "Speaking...";
    }

    // Show floating speech bubble
    if (this.bubbleEl) {
      this.bubbleEl.classList.add('active');
      this.typewriteText(this.speechText);
    }
  }

  stopSpeakingAnimation() {
    this.isSpeaking = false;
    this.speechAmplitude = 0;
    if (window.face3DEngine) {
      window.face3DEngine.setSpeechAmplitude(0);
    }

    if (this.sayHiBtn) {
      this.sayHiBtn.classList.remove('speaking');
      const textSpan = this.sayHiBtn.querySelector('.say-hi-text');
      if (textSpan) textSpan.textContent = "Say Hi (Hear Srihari)";
    }

    // Hide bubble after 4 seconds
    setTimeout(() => {
      if (!this.isSpeaking && this.bubbleEl) {
        this.bubbleEl.classList.remove('active');
      }
    }, 4500);
  }

  typewriteText(text) {
    if (!this.bubbleTextEl) return;
    this.bubbleTextEl.textContent = '';
    let i = 0;
    clearInterval(this.typewriterTimer);

    this.typewriterTimer = setInterval(() => {
      if (i < text.length) {
        this.bubbleTextEl.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(this.typewriterTimer);
      }
    }, 28);
  }

  simulateSpeechLipSync() {
    if (!this.isSpeaking) return;

    this.currentPhoneme = 'vowel';
    this.syllableEnergy = 0.8;
    let lastTime = performance.now();

    // Natural Syllabic Speech Cadence (~4 to 5 syllables per second)
    const updateLipSync = () => {
      if (!this.isSpeaking) {
        this.speechAmplitude = 0;
        if (window.face3DEngine) window.face3DEngine.setSpeechAmplitude(0, 'vowel');
        return;
      }

      const now = performance.now();
      const dt = (now - lastTime) * 0.001;
      lastTime = now;

      // Natural speech rhythm: continuous syllable modulation
      const t = now * 0.001;

      // Syllable carrier wave (between 3.5Hz and 5Hz)
      const carrier = Math.sin(t * 11.5) * 0.5 + 0.5;
      const variation = Math.sin(t * 4.2) * 0.3 + 0.7;

      // Brief natural closure between phrases (every ~2 seconds)
      const phrasePause = Math.sin(t * 1.8) < -0.85 ? 0.0 : 1.0;

      // Compute amplitude with attack/decay
      let targetAmp = Math.pow(carrier, 1.4) * variation * phrasePause;

      // Boost with word-boundary energy if triggered
      if (this.syllableEnergy > 0) {
        targetAmp = Math.max(targetAmp, this.syllableEnergy * 0.85);
        this.syllableEnergy = Math.max(0, this.syllableEnergy - dt * 4.5); // Decay in ~220ms
      }

      this.speechAmplitude = Math.max(0, Math.min(1.0, targetAmp));

      if (window.face3DEngine) {
        window.face3DEngine.setSpeechAmplitude(this.speechAmplitude, this.currentPhoneme || 'vowel');
      }

      requestAnimationFrame(updateLipSync);
    };

    updateLipSync();
  }

  simulateSpeechAudio() {
    // When no speech synthesis is available, animate for 7 seconds
    this.startSpeakingAnimation();
    this.simulateSpeechLipSync();
    setTimeout(() => {
      this.stopSpeakingAnimation();
    }, 6500);
  }

  bindEvents() {
    if (this.sayHiBtn) {
      this.sayHiBtn.addEventListener('click', () => this.sayHi());
    }

    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        this.soundToggleBtn.classList.toggle('active', this.soundEnabled);
        const icon = this.soundToggleBtn.querySelector('i, svg');
        if (this.soundEnabled) {
          this.playSpatialChime('success');
          this.soundToggleBtn.title = "Sound: ON";
        } else {
          this.soundToggleBtn.title = "Sound: OFF";
        }
      });
    }

    // Attach spatial sound to interactive glass cards and buttons
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('.spatial-btn, .dock-item, .filter-pill, .mode-btn, .proj-btn, .hero-stat-card');
      if (target) {
        this.playSpatialChime('hover');
      }
    });

    document.addEventListener('click', (e) => {
      const target = e.target.closest('.spatial-btn, .dock-item, .filter-pill, .mode-btn, .proj-btn');
      if (target && target !== this.sayHiBtn) {
        this.playSpatialChime('click');
      }
    });
  }
}

// Global instance
window.addEventListener('DOMContentLoaded', () => {
  window.spatialSpeech = new SpatialSpeechEngine();
});

