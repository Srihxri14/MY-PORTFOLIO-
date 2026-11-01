/**
 * SPATIAL BACKGROUND ENGINE - SRIHARI DOUNDE PORTFOLIO
 * Smooth 60fps Three.js Cosmic Dust, Ambient Spatial Waves & Interactive Depth
 */

class SpatialBackground {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 80;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    this.clock = new THREE.Clock();
    this.particles = null;
    this.nebulaMesh = null;

    this.init();
    this.bindEvents();
    this.animate();
  }

  init() {
    // 1. Cosmic Stardust Particle Cloud
    const particleCount = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const color1 = new THREE.Color(0x00f2fe); // Cyan neon
    const color2 = new THREE.Color(0x9d4edd); // Purple neon
    const color3 = new THREE.Color(0xd4e157); // Lime neon
    const color4 = new THREE.Color(0xffffff); // Star white

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Spread in a large 3D cylinder/sphere space
      const radius = 40 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i3 + 1] = radius * Math.sin(phi) * 0.7;
      positions[i3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      // Color distribution
      let chosenColor;
      const r = Math.random();
      if (r < 0.45) chosenColor = color1;
      else if (r < 0.75) chosenColor = color2;
      else if (r < 0.88) chosenColor = color3;
      else chosenColor = color4;

      colors[i3] = chosenColor.r;
      colors[i3 + 1] = chosenColor.g;
      colors[i3 + 2] = chosenColor.b;

      scales[i] = Math.random() * 2.0 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Particle Texture Generator (soft circular glow)
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const ctx = pCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(0, 242, 254, 0.8)');
    grad.addColorStop(0.5, 'rgba(157, 78, 221, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();

    const particleTexture = new THREE.CanvasTexture(pCanvas);

    const material = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    // 2. Spatial Nebula Rings / Geometric Shards
    const ringGeo = new THREE.TorusGeometry(55, 0.15, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.12,
      wireframe: true
    });
    this.ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    this.ringMesh1.rotation.x = Math.PI / 3;
    this.scene.add(this.ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(75, 0.12, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x9d4edd,
      transparent: true,
      opacity: 0.08,
      wireframe: true
    });
    this.ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.ringMesh2.rotation.y = Math.PI / 4;
    this.scene.add(this.ringMesh2);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('mousemove', (e) => {
      // Normalized device coords [-1, 1]
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Device orientation for mobile spatial movement
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          this.targetMouseX = (e.gamma / 45);
          this.targetMouseY = (e.beta / 45);
        }
      });
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Silky smooth mouse interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;

    // Gentle camera drift + parallax
    this.camera.position.x = this.mouseX * 6;
    this.camera.position.y = -this.mouseY * 6;
    this.camera.lookAt(0, 0, 0);

    // Rotate particles slowly
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.02 + this.mouseX * 0.15;
      this.particles.rotation.x = Math.sin(elapsedTime * 0.015) * 0.1 - this.mouseY * 0.1;
    }

    if (this.ringMesh1) {
      this.ringMesh1.rotation.z = elapsedTime * 0.03;
      this.ringMesh1.rotation.x = Math.PI / 3 + Math.cos(elapsedTime * 0.02) * 0.1;
    }

    if (this.ringMesh2) {
      this.ringMesh2.rotation.z = -elapsedTime * 0.02;
      this.ringMesh2.rotation.y = Math.PI / 4 + Math.sin(elapsedTime * 0.02) * 0.1;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate on load
window.addEventListener('DOMContentLoaded', () => {
  window.spatialBg = new SpatialBackground();
});

