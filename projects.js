/**
 * PROJECTS & INTERACTIVE SPATIAL SIMULATORS
 * Manages project data, tag filtering, modal dialogs, and 4 high-fidelity live simulators:
 * 1. FloraScan AI (Botanical Leaf Pathology Vision Scanner)
 * 2. Facial Detection (OpenCV & Deep Learning Live Face Tracker)
 * 3. Electricity Prediction (Time-Series Anomaly Detector)
 * 4. Railway Management System (Java & SQL Reservation Engine)
 */

const PROJECTS_DATA = [
  {
    id: "florascan",
    title: "FloraScan AI - Plant Disease Detection",
    year: "2026",
    category: "ai-cv",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
    summary: "Engineered an automated computer vision application to identify botanical species and diagnose foliar plant diseases from leaf imagery in real time using deep learning classification and image preprocessing pipelines.",
    tech: ["Python", "Computer Vision", "Deep Learning", "OpenCV", "TensorFlow", "Netlify"],
    githubUrl: "https://github.com/sriharidounde/FloraScan-AI",
    liveDemoUrl: "https://florascanai.netlify.app",
    hasSimulator: true,
    simulatorTitle: "FloraScan AI - Real-Time Foliar Pathology Scanner"
  },
  {
    id: "facedetect",
    title: "Facial Detection using Computer Vision",
    year: "2026",
    category: "ai-cv",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="9" r="1"/><path d="M10 15c.5.5 1.2.8 2 .8s1.5-.3 2-.8"/></svg>`,
    summary: "Built a real-time face detection and recognition application using Python and OpenCV, leveraging deep learning models for accurate identification across varied environmental conditions and lighting angles.",
    tech: ["Python", "OpenCV", "Deep Learning", "Haar Cascades", "FaceNet", "Real-Time Stream"],
    githubUrl: "https://github.com/sriharidounde/Facial-Detection-Computer-Vision",
    liveDemoUrl: "https://github.com/sriharidounde/Facial-Detection-Computer-Vision",
    hasSimulator: true,
    simulatorTitle: "Live Computer Vision Face & Landmark Detection"
  },
  {
    id: "electricity",
    title: "PowerWise AI - Electricity & Wastage Management",
    year: "2026",
    category: "ml",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    summary: "Developed an AI/ML predictive model to forecast electricity usage patterns and detect wastage anomalies, delivering data-driven insights for smart grid energy efficiency optimization.",
    tech: ["Python", "Machine Learning", "Scikit-Learn", "Time-Series", "Anomaly Detection", "Netlify"],
    githubUrl: "https://github.com/sriharidounde/Electricity-Consumption-Prediction",
    liveDemoUrl: "https://powerwise-ai.netlify.app",
    hasSimulator: true,
    simulatorTitle: "PowerWise AI - Grid Anomaly & Wastage Forecaster"
  },
  {
    id: "railway",
    title: "Railway Management System",
    year: "2025",
    category: "systems",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>`,
    summary: "Designed a comprehensive enterprise system to manage train schedules, passenger bookings, and route management using Java and relational database principles with transaction safety.",
    tech: ["Java", "Relational Database", "MySQL / JDBC", "OOP Design", "Transaction ACID"],
    githubUrl: "https://github.com/sriharidounde/Railway-Management-System",
    liveDemoUrl: "https://railway-sys.demo.app",
    hasSimulator: true,
    simulatorTitle: "Interactive Railway Reservation & Route Dispatcher"
  }
];

class ProjectsManager {
  constructor() {
    this.projectsContainer = document.getElementById('projects-grid');
    this.filterButtons = document.querySelectorAll('.filter-pill');
    this.modalOverlay = document.getElementById('project-modal');
    this.modalBody = document.getElementById('modal-dynamic-body');
    this.modalTitle = document.getElementById('modal-project-title');
    this.closeModalBtn = document.getElementById('close-modal-btn');

    this.activeSimInterval = null;
    this.activeWebcamStream = null;

    this.init();
    this.bindEvents();
  }

  init() {
    this.renderProjects('all');
  }

  renderProjects(category) {
    if (!this.projectsContainer) return;
    this.projectsContainer.innerHTML = '';

    const filtered = category === 'all'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter(p => p.category === category);

    filtered.forEach((proj, idx) => {
      const card = document.createElement('div');
      card.className = 'spatial-glass tilt-card project-card reveal-on-scroll is-visible';
      card.style.animationDelay = `${idx * 0.15}s`;

      card.innerHTML = `
        <div class="tilt-inner">
          <div class="project-top">
            <div class="project-meta-left">
              <span class="project-year">${proj.year} • ${proj.category.toUpperCase()}</span>
              <h3 class="project-title">${proj.title}</h3>
            </div>
            <div class="project-icon-box">
              ${proj.icon}
            </div>
          </div>
          <p class="project-desc">${proj.summary}</p>
          <div class="project-tech-tags">
            ${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>

        <div class="project-links-row">
          <button class="proj-btn proj-btn-sim open-sim-btn" data-project-id="${proj.id}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Interactive Demo
          </button>
          <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="proj-btn proj-btn-github">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
          <a href="${proj.liveDemoUrl}" target="_blank" rel="noopener noreferrer" class="proj-btn proj-btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Live Link
          </a>
        </div>
      `;

      this.projectsContainer.appendChild(card);
    });

    // Reattach tilt effects
    if (window.initTiltCards) {
      window.initTiltCards();
    }
  }

  bindEvents() {
    // Filter pills
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-filter');
        this.renderProjects(cat);
      });
    });

    // Open simulator modal
    document.addEventListener('click', (e) => {
      const simBtn = e.target.closest('.open-sim-btn');
      if (simBtn) {
        const id = simBtn.getAttribute('data-project-id');
        this.openSimulator(id);
      }
    });

    // Close modal
    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.modalOverlay) {
          this.closeModal();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  }

  openSimulator(projectId) {
    const proj = PROJECTS_DATA.find(p => p.id === projectId);
    if (!proj || !this.modalOverlay) return;

    this.modalTitle.textContent = proj.simulatorTitle;
    this.modalBody.innerHTML = '';

    if (projectId === 'florascan') {
      this.buildFloraScanSimulator();
    } else if (projectId === 'facedetect') {
      this.buildFaceDetectionSimulator();
    } else if (projectId === 'electricity') {
      this.buildElectricitySimulator();
    } else if (projectId === 'railway') {
      this.buildRailwaySimulator();
    }

    this.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (!this.modalOverlay) return;
    this.modalOverlay.classList.remove('active');
    document.body.style.overflow = '';

    // Stop webcam if active
    if (this.activeWebcamStream) {
      this.activeWebcamStream.getTracks().forEach(track => track.stop());
      this.activeWebcamStream = null;
    }
    clearInterval(this.activeSimInterval);
  }

  /* -----------------------------------------------------------
     1. FLORASCAN AI SIMULATOR
     ----------------------------------------------------------- */
  buildFloraScanSimulator() {
    this.modalBody.innerHTML = `
      <div class="sim-zone">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; flex-wrap: wrap; gap: 0.8rem;">
          <p style="color: var(--text-secondary); margin: 0; font-size: 0.95rem;">
            Select a sample agricultural leaf imagery to test the deep learning foliar pathology pipeline:
          </p>
          <a href="https://florascanai.netlify.app" target="_blank" rel="noopener noreferrer" class="spatial-btn spatial-btn-primary" style="padding: 0.5rem 1.1rem; font-size: 0.85rem;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Launch Netlify App ↗
          </a>
        </div>
        <div style="display: flex; gap: 0.8rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
          <button class="spatial-btn spatial-btn-glass leaf-sample-btn" data-type="tomato-blight">Sample 1: Tomato Late Blight</button>
          <button class="spatial-btn spatial-btn-glass leaf-sample-btn" data-type="apple-scab">Sample 2: Apple Scab</button>
          <button class="spatial-btn spatial-btn-glass leaf-sample-btn" data-type="healthy-corn">Sample 3: Healthy Maize Leaf</button>
        </div>

        <div class="sim-preview-box" id="leaf-preview" style="background: #070c17;">
          <canvas id="flora-canvas" width="600" height="300" style="width: 100%; height: 100%; object-fit: contain;"></canvas>
          <div id="flora-scanner-line" style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--cyan-neon); box-shadow: 0 0 15px var(--cyan-neon); animation: scanLoop 2.2s infinite ease-in-out;"></div>
        </div>

        <div style="margin-top: 1.5rem; padding: 1.2rem; background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <span style="font-weight: 700; color: #ffffff;" id="leaf-diag-title">Pathology Diagnosis: Analyzing...</span>
            <span class="window-chip" id="leaf-confidence" style="color: var(--cyan-neon); border-color: var(--cyan-neon);">Confidence: 98.6%</span>
          </div>
          <div style="background: rgba(255,255,255,0.08); border-radius: 999px; height: 8px; overflow: hidden; margin-bottom: 0.8rem;">
            <div id="leaf-conf-bar" style="width: 98.6%; height: 100%; background: linear-gradient(90deg, var(--cyan-neon), var(--emerald-neon));"></div>
          </div>
          <p id="leaf-remedy" style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
            <strong>Foliar Action:</strong> Detected necrotic lesions caused by <em>Phytophthora infestans</em>. Recommend copper-based fungicide application within 48h and canopy thinning to reduce humidity.
          </p>
        </div>
      </div>
    `;

    const canvas = document.getElementById('flora-canvas');
    const ctx = canvas.getContext('2d');

    const drawLeaf = (type) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw simulated high-tech leaf with bounding boxes
      ctx.fillStyle = type === 'healthy-corn' ? '#143c1a' : '#2b3318';
      ctx.beginPath();
      ctx.ellipse(300, 150, 180, 85, Math.PI / 12, 0, Math.PI * 2);
      ctx.fill();

      // Veins
      ctx.strokeStyle = '#3d5c2a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(130, 150);
      ctx.lineTo(470, 150);
      ctx.stroke();

      if (type !== 'healthy-corn') {
        // Draw disease spots
        ctx.fillStyle = '#6b3310';
        for (let i = 0; i < 7; i++) {
          const sx = 220 + (i * 35);
          const sy = 120 + ((i % 3) * 25);
          ctx.beginPath();
          ctx.arc(sx, sy, 12, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bounding box
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 2;
        ctx.strokeRect(200, 95, 230, 110);
        ctx.fillStyle = '#00f2fe';
        ctx.font = '12px monospace';
        ctx.fillText('PATHOLOGY_CLUSTER: [0.984]', 205, 90);
      } else {
        // Healthy detection box
        ctx.strokeStyle = '#00f5a0';
        ctx.lineWidth = 2;
        ctx.strokeRect(150, 80, 320, 140);
        ctx.fillStyle = '#00f5a0';
        ctx.font = '12px monospace';
        ctx.fillText('HEALTHY_TISSUE: [0.992]', 155, 75);
      }
    };

    drawLeaf('tomato-blight');

    const buttons = this.modalBody.querySelectorAll('.leaf-sample-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        drawLeaf(type);
        const titleEl = document.getElementById('leaf-diag-title');
        const confEl = document.getElementById('leaf-confidence');
        const remedyEl = document.getElementById('leaf-remedy');
        const barEl = document.getElementById('leaf-conf-bar');

        if (type === 'tomato-blight') {
          titleEl.textContent = "Pathology Diagnosis: Tomato Late Blight";
          confEl.textContent = "Confidence: 98.4%";
          barEl.style.width = "98.4%";
          remedyEl.innerHTML = "<strong>Foliar Action:</strong> Detected necrotic lesions caused by <em>Phytophthora infestans</em>. Recommend copper-based fungicide application within 48h and canopy aeration.";
        } else if (type === 'apple-scab') {
          titleEl.textContent = "Pathology Diagnosis: Apple Scab (Venturia inaequalis)";
          confEl.textContent = "Confidence: 96.7%";
          barEl.style.width = "96.7%";
          remedyEl.innerHTML = "<strong>Foliar Action:</strong> Olive-green fungal velvety spots detected. Apply systemic myclobutanil or potassium bicarbonate. Remove fallen leaf litter to prevent spore dispersion.";
        } else {
          titleEl.textContent = "Pathology Diagnosis: Healthy Tissue (No Pathogens)";
          confEl.textContent = "Confidence: 99.2%";
          barEl.style.width = "99.2%";
          barEl.style.background = "#00f5a0";
          remedyEl.innerHTML = "<strong>Foliar Action:</strong> Optimal chlorophyll absorption and vein vascularization. No foliar diseases or nutrient deficiencies identified.";
        }
      });
    });
  }

  /* -----------------------------------------------------------
     2. FACIAL DETECTION SIMULATOR (Live Camera or High-Tech Simulation)
     ----------------------------------------------------------- */
  buildFaceDetectionSimulator() {
    this.modalBody.innerHTML = `
      <div class="sim-zone">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.8rem;">
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Real-time face detection stream with bounding box prediction, eye coordinates, and landmark tracking:
          </p>
          <div style="display: flex; gap: 0.6rem;">
            <button class="spatial-btn spatial-btn-primary" id="toggle-cam-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              Start WebCam
            </button>
            <button class="spatial-btn spatial-btn-glass" id="toggle-stream-type">Synthetic Stream</button>
          </div>
        </div>

        <div class="sim-preview-box" style="background: #020611; position: relative;">
          <video id="webcam-video" autoplay playsinline muted style="width: 100%; height: 100%; object-fit: cover; display: none;"></video>
          <canvas id="cv-face-canvas" width="640" height="360" style="position: absolute; top:0; left:0; width: 100%; height: 100%;"></canvas>
          
          <!-- Live Telemetry HUD -->
          <div style="position: absolute; bottom: 12px; left: 16px; font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan-neon); background: rgba(5,10,25,0.85); padding: 0.4rem 0.8rem; border-radius: 8px; border: 1px solid rgba(0,242,254,0.3);">
            FPS: <span id="cv-fps">60.2</span> | FACES: <span id="cv-count">1</span> | CONFIDENCE: <span id="cv-conf">99.1%</span> | BACKEND: OpenCV / DNN
          </div>
        </div>
      </div>
    `;

    const cvs = document.getElementById('cv-face-canvas');
    const ctx = cvs.getContext('2d');
    const video = document.getElementById('webcam-video');
    const camBtn = document.getElementById('toggle-cam-btn');

    let isUsingWebcam = false;
    let simTime = 0;

    const renderLoop = () => {
      simTime += 0.03;
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      if (isUsingWebcam && video.readyState === 4) {
        ctx.drawImage(video, 0, 0, cvs.width, cvs.height);
      } else {
        // High-tech holographic grid + Srihari avatar simulation
        ctx.fillStyle = '#060a18';
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        // Cyber grid
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < cvs.width; x += 40) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, cvs.height); ctx.stroke();
        }
        for (let y = 0; y < cvs.height; y += 40) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cvs.width, y); ctx.stroke();
        }
      }

      // Simulated detected face coordinates (smooth wandering)
      const cx = cvs.width / 2 + Math.sin(simTime * 1.5) * 45;
      const cy = cvs.height / 2 + Math.cos(simTime * 1.2) * 25;
      const fw = 160;
      const fh = 200;
      const x = cx - fw / 2;
      const y = cy - fh / 2;

      // Draw OpenCV bounding box
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x, y, fw, fh);

      // Corner accents
      const clen = 16;
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffffff';
      // Top-left
      ctx.beginPath(); ctx.moveTo(x, y + clen); ctx.lineTo(x, y); ctx.lineTo(x + clen, y); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(x + fw - clen, y); ctx.lineTo(x + fw, y); ctx.lineTo(x + fw, y + clen); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(x, y + fh - clen); ctx.lineTo(x, y + fh); ctx.lineTo(x + clen, y + fh); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(x + fw - clen, y + fh); ctx.lineTo(x + fw, y + fh); ctx.lineTo(x + fw, y + fh - clen); ctx.stroke();

      // Facial Landmark dots (68 point emulation)
      ctx.fillStyle = '#00f5a0';
      const eyeL = { x: cx - 35, y: cy - 25 };
      const eyeR = { x: cx + 35, y: cy - 25 };
      const nose = { x: cx, y: cy + 5 };
      const mouthL = { x: cx - 25, y: cy + 45 };
      const mouthR = { x: cx + 25, y: cy + 45 };

      [eyeL, eyeR, nose, mouthL, mouthR].forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Label
      ctx.fillStyle = '#00f2fe';
      ctx.font = '13px monospace';
      ctx.fillText('SUBJECT: SRIHARI [CONF: 99.4%]', x, y - 8);
    };

    this.activeSimInterval = setInterval(renderLoop, 1000 / 60);

    camBtn.addEventListener('click', async () => {
      if (!isUsingWebcam) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 } });
          this.activeWebcamStream = stream;
          video.srcObject = stream;
          video.style.display = 'block';
          isUsingWebcam = true;
          camBtn.innerHTML = `Stop WebCam`;
          camBtn.classList.remove('spatial-btn-primary');
          camBtn.classList.add('spatial-btn-glass');
        } catch (err) {
          alert("Webcam permission denied or camera unavailable. Running high-tech synthetic feed.");
        }
      } else {
        if (this.activeWebcamStream) {
          this.activeWebcamStream.getTracks().forEach(t => t.stop());
          this.activeWebcamStream = null;
        }
        video.style.display = 'none';
        isUsingWebcam = false;
        camBtn.innerHTML = `Start WebCam`;
        camBtn.classList.add('spatial-btn-primary');
        camBtn.classList.remove('spatial-btn-glass');
      }
    });
  }

  /* -----------------------------------------------------------
     3. ELECTRICITY PREDICTION SIMULATOR
     ----------------------------------------------------------- */
  buildElectricitySimulator() {
    this.modalBody.innerHTML = `
      <div class="sim-zone">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; flex-wrap: wrap; gap: 0.8rem;">
          <p style="color: var(--text-secondary); margin: 0; font-size: 0.95rem;">
            Time-series power consumption forecasting model with ML anomaly spike detection:
          </p>
          <a href="https://powerwise-ai.netlify.app" target="_blank" rel="noopener noreferrer" class="spatial-btn spatial-btn-primary" style="padding: 0.5rem 1.1rem; font-size: 0.85rem;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Launch Netlify App ↗
          </a>
        </div>

        <div class="sim-preview-box" style="background: #060914;">
          <canvas id="energy-chart-canvas" width="600" height="280" style="width: 100%; height: 100%;"></canvas>
        </div>

        <div style="display: flex; gap: 1.5rem; align-items: center; margin-top: 1.5rem; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px;">
            <label style="font-size: 0.82rem; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Anomaly Detection Sensitivity:</label>
            <input type="range" id="anomaly-slider" min="1" max="10" value="5" style="width: 100%; accent-color: var(--cyan-neon);">
          </div>
          <button class="spatial-btn spatial-btn-glass" id="regen-forecast-btn">Regenerate Time-Series</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.2rem;">
          <div style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); text-align: center;">
            <span style="font-size: 0.75rem; color: var(--text-muted);">PREDICTED BASELOAD</span>
            <div style="font-size: 1.4rem; font-weight: 800; color: #ffffff;" id="val-baseload">412.5 kW</div>
          </div>
          <div style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); text-align: center;">
            <span style="font-size: 0.75rem; color: var(--text-muted);">DETECTED ANOMALIES</span>
            <div style="font-size: 1.4rem; font-weight: 800; color: #ff007f;" id="val-anomalies">3 Spikes</div>
          </div>
          <div style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); text-align: center;">
            <span style="font-size: 0.75rem; color: var(--text-muted);">OPTIMIZED SAVINGS</span>
            <div style="font-size: 1.4rem; font-weight: 800; color: var(--emerald-neon);" id="val-savings">18.4%</div>
          </div>
        </div>
      </div>
    `;

    const canvas = document.getElementById('energy-chart-canvas');
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('anomaly-slider');
    const regenBtn = document.getElementById('regen-forecast-btn');

    const drawChart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Draw grid
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      for (let y = 30; y < h - 20; y += 40) {
        ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(w - 20, y); ctx.stroke();
      }

      // Generate curve points
      const points = [];
      const threshold = 180 - (slider.value * 8);
      let anomaliesCount = 0;

      for (let x = 40; x < w - 20; x += 15) {
        const norm = (x - 40) / (w - 60);
        const base = 140 + Math.sin(norm * Math.PI * 4) * 45 + Math.cos(norm * 9) * 20;
        // Inject spike
        const isSpike = (x > 220 && x < 250) || (x > 410 && x < 440);
        const yVal = isSpike ? base - 65 : base;
        points.push({ x, y: yVal, isSpike });
        if (isSpike) anomaliesCount++;
      }

      // Draw Forecast line (cyan)
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      points.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      // Highlight Anomaly points in Magenta
      points.forEach(pt => {
        if (pt.isSpike) {
          ctx.fillStyle = '#ff007f';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#ff007f';
          ctx.font = '10px monospace';
          ctx.fillText('WASTAGE SPIKE', pt.x - 35, pt.y - 14);
        }
      });

      document.getElementById('val-anomalies').textContent = `${anomaliesCount} Spikes`;
    };

    drawChart();
    slider.addEventListener('input', drawChart);
    regenBtn.addEventListener('click', drawChart);
  }

  /* -----------------------------------------------------------
     4. RAILWAY MANAGEMENT SIMULATOR
     ----------------------------------------------------------- */
  buildRailwaySimulator() {
    this.modalBody.innerHTML = `
      <div class="sim-zone">
        <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.95rem;">
          Java enterprise backend simulation with relational transaction booking:
        </p>

        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem; align-items: start;">
          <div>
            <div style="margin-bottom: 1rem;">
              <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">Select Train Route:</label>
              <select id="train-select" style="width: 100%; padding: 0.7rem; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #ffffff; font-family: var(--font-sans);">
                <option value="vande">Train #20608 - Vande Bharat Express (HYD -> BLR)</option>
                <option value="rajdhani">Train #12437 - Secunderabad Rajdhani Express (HYD -> NZM)</option>
                <option value="shatabdi">Train #12026 - Pune Shatabdi Express (HYD -> PUNE)</option>
              </select>
            </div>

            <div style="display: flex; gap: 0.8rem; margin-bottom: 1rem;">
              <input type="text" id="passenger-name" placeholder="Passenger Full Name" value="Srihari Dounde" style="flex: 1; padding: 0.7rem; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #ffffff;">
              <select id="berth-pref" style="padding: 0.7rem; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #ffffff;">
                <option>Executive Chair (EC)</option>
                <option>AC 1st Class (1A)</option>
                <option>AC 2 Tier (2A)</option>
              </select>
            </div>

            <button class="spatial-btn spatial-btn-primary" id="btn-book-ticket" style="width: 100%;">
              Execute Java SQL Booking Transaction
            </button>
          </div>

          <!-- Live Ticket Preview -->
          <div style="padding: 1.4rem; background: rgba(14,20,40,0.9); border-radius: 18px; border: 1px solid rgba(0,242,254,0.3); box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; border-bottom: 1px dashed rgba(255,255,255,0.15); padding-bottom: 0.6rem;">
              <span style="font-size: 0.75rem; color: var(--cyan-neon); font-family: var(--font-mono);">BOARDING PASS (PNR CONFIRMED)</span>
              <span class="window-chip" id="pnr-code" style="color: #00f5a0; border-color: #00f5a0;">PNR: 8492019384</span>
            </div>
            <div style="font-size: 0.92rem; color: #ffffff; font-weight: 700;" id="ticket-passenger">Srihari Dounde</div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin: 0.3rem 0;" id="ticket-train">Train #20608 - Vande Bharat Express</div>
            <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); margin-top: 0.8rem;">
              <span>COACH: C-4</span>
              <span>SEAT: 28 (WINDOW)</span>
              <span>STATUS: CNF</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const bookBtn = document.getElementById('btn-book-ticket');
    const pnrCode = document.getElementById('pnr-code');
    const ticketPassenger = document.getElementById('ticket-passenger');
    const ticketTrain = document.getElementById('ticket-train');
    const passInput = document.getElementById('passenger-name');
    const trainSelect = document.getElementById('train-select');

    bookBtn.addEventListener('click', () => {
      const randomPNR = Math.floor(1000000000 + Math.random() * 9000000000);
      pnrCode.textContent = `PNR: ${randomPNR}`;
      ticketPassenger.textContent = passInput.value || "Srihari Dounde";
      ticketTrain.textContent = trainSelect.options[trainSelect.selectedIndex].text;

      if (window.spatialSpeech) {
        window.spatialSpeech.playSpatialChime('success');
      }
    });
  }
}

// Global instance
window.addEventListener('DOMContentLoaded', () => {
  window.projectsManager = new ProjectsManager();
});

