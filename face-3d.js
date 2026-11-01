/**
 * SPATIAL AVATAR & NATURAL LIP-SYNC ENGINE
 * Renders Srihari's portrait with high-definition clarity (no distortion),
 * photorealistic lip movement with seamless viseme blending,
 * natural breathing, eye blinks, and 3D spatial perspective tilt.
 */

class Face3DEngine {
  constructor() {
    this.canvas = document.getElementById('face-canvas');
    if (!this.canvas) return;

    this.container = this.canvas.parentElement;
    this.ctx = this.canvas.getContext('2d');

    // Native resolution of the portrait
    this.nativeWidth = 748;
    this.nativeHeight = 928;
    this.canvas.width = this.nativeWidth;
    this.canvas.height = this.nativeHeight;

    // Assets to load
    this.images = {
      base: null,
      restMouth: null,
      talk1: null,
      talk2: null,
      talk3: null,
      talkO: null,
      blink: null
    };

    // State
    this.isLoaded = false;
    this.speechAmplitude = 0;
    this.targetOpening = 0;
    this.currentOpening = 0;
    this.phonemeType = 'vowel'; // 'vowel', 'o', 'closed'
    
    // Natural eye blink state
    this.blinkAlpha = 0;
    this.lastBlinkTime = performance.now();
    this.nextBlinkInterval = 4000 + Math.random() * 3000;
    this.isBlinking = false;

    // Presentation Mode
    this.currentMode = 'natural'; // 'natural', 'hologram', 'cyber'

    // 3D Tilt & Parallax
    this.targetTilt = { x: 0, y: 0 };
    this.currentTilt = { x: 0, y: 0 };

    this.loadAssets();
    this.bindEvents();
    this.animate();
  }

  loadAssets() {
    const assetList = [
      { key: 'base', src: 'assets/srihari_clean.jpg' },
      { key: 'talk1', src: 'assets/mouth_talk_1.png' },
      { key: 'talk2', src: 'assets/mouth_talk_2.png' },
      { key: 'talk3', src: 'assets/mouth_talk_3.png' },
      { key: 'talkO', src: 'assets/mouth_talk_o.png' },
      { key: 'blink', src: 'assets/eyes_blink.png' }
    ];

    let loadedCount = 0;
    assetList.forEach(item => {
      const img = new Image();
      img.src = item.src;
      img.onload = () => {
        this.images[item.key] = img;
        loadedCount++;
        if (loadedCount === assetList.length) {
          this.isLoaded = true;
          this.renderFrame();
        }
      };
      img.onerror = () => {
        console.warn(`Asset ${item.src} fallback loading.`);
        loadedCount++;
        if (loadedCount === assetList.length) {
          this.isLoaded = true;
        }
      };
    });
  }

  setSpeechAmplitude(amp, phoneme = 'vowel') {
    this.speechAmplitude = Math.max(0, Math.min(1.0, amp));
    this.phonemeType = phoneme;
  }

  setMode(mode) {
    this.currentMode = mode;
    const scanline = document.querySelector('.hologram-scanline');
    if (scanline) {
      if (mode === 'natural') {
        scanline.style.opacity = '0';
      } else if (mode === 'hologram') {
        scanline.style.opacity = '0.5';
      } else {
        scanline.style.opacity = '0.35';
      }
    }
  }

  bindEvents() {
    // 3D Perspective Tilt tracking cursor
    window.addEventListener('mousemove', (e) => {
      if (!this.container) return;
      const rect = this.container.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);

      // Clamped gentle tilt
      this.targetTilt.x = Math.max(-12, Math.min(12, -y * 12));
      this.targetTilt.y = Math.max(-14, Math.min(14, x * 14));
    });

    // Reset angle on leave
    document.addEventListener('mouseleave', () => {
      this.targetTilt.x = 0;
      this.targetTilt.y = 0;
    });

    // Angle buttons
    const resetBtn = document.getElementById('reset-angle-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.targetTilt.x = 0;
        this.targetTilt.y = 0;
      });
    }

    const tiltBtn = document.getElementById('tilt-angle-btn');
    if (tiltBtn) {
      tiltBtn.addEventListener('click', () => {
        this.targetTilt.y = this.targetTilt.y > 0 ? -10 : 10;
        this.targetTilt.x = 4;
      });
    }

    // Mode Selector Buttons
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-mode');
        this.setMode(mode);
      });
    });
  }

  updateBlink(now) {
    if (!this.isBlinking && now - this.lastBlinkTime > this.nextBlinkInterval) {
      this.isBlinking = true;
      this.blinkStartTime = now;
      this.nextBlinkInterval = 3500 + Math.random() * 4000;
    }

    if (this.isBlinking) {
      const elapsed = now - this.blinkStartTime;
      const duration = 160; // 160ms quick natural blink
      if (elapsed < duration) {
        // Fast close, smooth reopen (parabolic bell)
        this.blinkAlpha = Math.sin((elapsed / duration) * Math.PI);
      } else {
        this.isBlinking = false;
        this.blinkAlpha = 0;
        this.lastBlinkTime = now;
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.isLoaded) return;

    const now = performance.now();
    const time = now * 0.001;

    // Smooth tilt interpolation
    this.currentTilt.x += (this.targetTilt.x - this.currentTilt.x) * 0.08;
    this.currentTilt.y += (this.targetTilt.y - this.currentTilt.y) * 0.08;

    if (this.container) {
      // Natural subtle breathing scale
      const breathScale = 1.0 + Math.sin(time * 2.0) * 0.003;
      this.container.style.transform = `perspective(1000px) rotateX(${this.currentTilt.x}deg) rotateY(${this.currentTilt.y}deg) scale(${breathScale})`;
    }

    // Smooth lip opening interpolation
    this.targetOpening = this.speechAmplitude;
    this.currentOpening += (this.targetOpening - this.currentOpening) * 0.35;

    // Check blink
    this.updateBlink(now);

    this.renderFrame();
  }

  renderFrame() {
    const ctx = this.ctx;
    const w = this.nativeWidth;
    const h = this.nativeHeight;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw base photorealistic portrait (100% sharp, zero distortion)
    if (this.images.base) {
      ctx.drawImage(this.images.base, 0, 0, w, h);
    }

    // 2. Draw Eye Blink if active
    if (this.images.blink && this.blinkAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = Math.min(1.0, this.blinkAlpha);
      // Eye coordinates: x=270, y=260, w=180, h=45
      ctx.drawImage(this.images.blink, 270, 260, 180, 45);
      ctx.restore();
    }

    // 3. Draw Perfect Lip Movement when speaking
    const open = this.currentOpening;
    if (open > 0.02) {
      const mx = 310;
      const my = 380;
      const mw = 130;
      const mh = 90;

      ctx.save();

      if (this.phonemeType === 'o' && this.images.talkO) {
        // Rounded "O" mouth shape
        ctx.globalAlpha = Math.min(1.0, open * 1.2);
        ctx.drawImage(this.images.talkO, mx, my, mw, mh);
      } else {
        // Natural speech mouth opening progression:
        // [0..0.33] -> talk1
        // [0.33..0.66] -> blend talk1 into talk2
        // [0.66..1.0] -> blend talk2 into talk3

        if (open < 0.35) {
          if (this.images.talk1) {
            ctx.globalAlpha = open / 0.35;
            ctx.drawImage(this.images.talk1, mx, my, mw, mh);
          }
        } else if (open < 0.7) {
          const t = (open - 0.35) / 0.35;
          if (this.images.talk1) {
            ctx.globalAlpha = 1.0 - t;
            ctx.drawImage(this.images.talk1, mx, my, mw, mh);
          }
          if (this.images.talk2) {
            ctx.globalAlpha = t;
            ctx.drawImage(this.images.talk2, mx, my, mw, mh);
          }
        } else {
          const t = Math.min(1.0, (open - 0.7) / 0.3);
          if (this.images.talk2) {
            ctx.globalAlpha = 1.0 - t;
            ctx.drawImage(this.images.talk2, mx, my, mw, mh);
          }
          if (this.images.talk3) {
            ctx.globalAlpha = t;
            ctx.drawImage(this.images.talk3, mx, my, mw, mh);
          }
        }
      }

      ctx.restore();
    }

    // 4. Mode Overlays
    if (this.currentMode === 'cyber') {
      // Subtle AI facial recognition reticle
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      // Face box
      ctx.strokeRect(210, 175, 335, 345);
      
      // Corner brackets
      ctx.setLineDash([]);
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 3;
      const bLen = 20;
      // TL
      ctx.beginPath(); ctx.moveTo(210, 175 + bLen); ctx.lineTo(210, 175); ctx.lineTo(210 + bLen, 175); ctx.stroke();
      // TR
      ctx.beginPath(); ctx.moveTo(545 - bLen, 175); ctx.lineTo(545, 175); ctx.lineTo(545, 175 + bLen); ctx.stroke();
      // BL
      ctx.beginPath(); ctx.moveTo(210, 520 - bLen); ctx.lineTo(210, 520); ctx.lineTo(210 + bLen, 520); ctx.stroke();
      // BR
      ctx.beginPath(); ctx.moveTo(545 - bLen, 520); ctx.lineTo(545, 520); ctx.lineTo(545, 520 - bLen); ctx.stroke();

      // Telemetry
      ctx.fillStyle = '#00f2fe';
      ctx.font = '14px monospace';
      ctx.fillText('TRACK: SRIHARI [LIP-SYNC: ACTIVE]', 214, 165);
      ctx.restore();
    }
  }
}

// Global instance
window.addEventListener('DOMContentLoaded', () => {
  window.face3DEngine = new Face3DEngine();
});
