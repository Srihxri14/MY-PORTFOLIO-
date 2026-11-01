/**
 * MAIN SPATIAL APPLICATION CONTROLLER
 * Coordinates UI transitions, 3D card tilts, dock navigation, and interactive behaviors.
 */

// 1. Interactive 3D Card Tilt Effect
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotX = ((y - centerY) / centerY) * -10; // Max tilt 10deg
      const rotY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}
window.initTiltCards = initTiltCards;

// 2. Cursor Ambient Spotlight
function initCursorGlow() {
  const glow = document.querySelector('.spatial-cursor-glow');
  if (!glow) return;

  window.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

// 3. Reveal on Scroll (Intersection Observer)
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  items.forEach(item => observer.observe(item));
}

// 4. VisionOS Floating Dock Active Indicator
function initDockNavigation() {
  const dockItems = document.querySelectorAll('.dock-item');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 250;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    dockItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentId}`) {
        item.classList.add('active');
      }
    });
  });
}

// 5. Contact Actions (Copy Email, Direct Mail)
function initContactActions() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('sriharidounde219@email.com').then(() => {
        const origText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Email Copied!
        `;
        copyBtn.style.borderColor = 'var(--emerald-neon)';
        copyBtn.style.color = 'var(--emerald-neon)';

        if (window.spatialSpeech) {
          window.spatialSpeech.playSpatialChime('success');
        }

        setTimeout(() => {
          copyBtn.innerHTML = origText;
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
        }, 3000);
      });
    });
  }
}

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
  initTiltCards();
  initCursorGlow();
  initScrollReveal();
  initDockNavigation();
  initContactActions();

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

