/* ============================================================
   DREAM LINE PRODUCTION — MAIN JAVASCRIPT
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ─── PRELOADER ───────────────────────────────────────────────
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      triggerHeroAnimations();
    }, 2200);
  });
  document.body.style.overflow = 'hidden';

  function triggerHeroAnimations() {
    document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
      setTimeout(() => { el.classList.add('visible'); }, i * 200);
    });
  }

  // ─── CUSTOM CURSOR ───────────────────────────────────────────
  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');
  if (cursorDot && cursorOutline) {
    let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });
    function animateCursor() {
      outlineX += (mouseX - outlineX) * 0.12;
      outlineY += (mouseY - outlineY) * 0.12;
      cursorOutline.style.left = outlineX + 'px';
      cursorOutline.style.top = outlineY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    const hoverEls = document.querySelectorAll('a, button, .portfolio-card, .filter-btn, .pricing-card, .service-card');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ─── NAVBAR SCROLL ───────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Scrolled class
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    // Active nav link
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
    // Back to top
    const btt = document.getElementById('backToTop');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  });

  // ─── MOBILE MENU ─────────────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  navToggle?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('active');
    navToggle.classList.toggle('active', open);
    document.body.classList.toggle('menu-open', open);
  });
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // ─── SMOOTH SCROLL ───────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── REVEAL ON SCROLL (IntersectionObserver) ─────────────────
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => {
    // Skip hero reveals (handled by preloader)
    if (!el.closest('.hero')) revealObserver.observe(el);
  });

  // ─── COUNTER ANIMATION ───────────────────────────────────────
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current;
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  // ─── PORTFOLIO FILTER ─────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
          item.style.display = match ? '' : 'none';
          setTimeout(() => {
            if (match) {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }
          }, 50);
        }, 200);
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      });
    });
  });

  // ─── LIGHTBOX ─────────────────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxOverlay = document.getElementById('lightboxOverlay');

  document.querySelectorAll('.port-zoom').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgSrc = btn.dataset.img;
      const title = btn.dataset.title;
      lightboxImg.src = imgSrc;
      lightboxImg.alt = title;
      lightboxCaption.textContent = title;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxOverlay?.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // ─── VIDEO PLAYER ─────────────────────────────────────────────
  const videoPlayBtn = document.getElementById('videoPlayBtn');
  const showreelVideo = document.getElementById('showreelVideo');
  const videoPlayerWrap = document.getElementById('videoPlayerWrap');

  videoPlayBtn?.addEventListener('click', () => {
    if (showreelVideo.paused) {
      showreelVideo.play();
      videoPlayerWrap.classList.add('playing');
    }
  });
  showreelVideo?.addEventListener('click', () => {
    if (!showreelVideo.paused) {
      showreelVideo.pause();
      videoPlayerWrap.classList.remove('playing');
    }
  });

  // ─── REVIEWS SLIDER ───────────────────────────────────────────
  const slider = document.getElementById('reviewsSlider');
  const cards = slider ? slider.querySelectorAll('.review-card') : [];
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');

  let currentSlide = 0;
  const totalSlides = cards.length;

  // Build dots
  if (dotsContainer && totalSlides > 0) {
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Review ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(n) {
    currentSlide = (n + totalSlides) % totalSlides;
    if (slider) slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  prevBtn?.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn?.addEventListener('click', () => goToSlide(currentSlide + 1));

  // Auto advance
  let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
  slider?.addEventListener('mouseenter', () => clearInterval(autoSlide));
  slider?.addEventListener('mouseleave', () => { autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000); });

  // Touch swipe
  let touchStartX = 0;
  slider?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  slider?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
  });

  // ─── PRICING TOGGLE ───────────────────────────────────────────
  const pricingToggle = document.getElementById('pricingToggle');
  const prices = {
    photo: { basic: '1.500.000', standard: '3.500.000', premium: '6.500.000' },
    bundle: { basic: '2.500.000', standard: '5.500.000', premium: '9.500.000' }
  };
  const togglePhotoLabel = document.getElementById('togglePhoto');
  const toggleVideoLabel = document.getElementById('toggleVideo');

  pricingToggle?.addEventListener('change', () => {
    const isBundle = pricingToggle.checked;
    const set = isBundle ? prices.bundle : prices.photo;
    const priceEls = document.querySelectorAll('.price-amount');
    if (priceEls.length >= 3) {
      priceEls[0].textContent = set.basic;
      priceEls[1].textContent = set.standard;
      priceEls[2].textContent = set.premium;
    }
    togglePhotoLabel?.classList.toggle('active-label', !isBundle);
    toggleVideoLabel?.classList.toggle('active-label', isBundle);
  });

  // ─── CONTACT FORM ─────────────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('formName').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const service = document.getElementById('formService').value;
    const message = document.getElementById('formMessage').value.trim();
    const date = document.getElementById('formDate').value;

    if (!name || !phone) {
      showNotification('Mohon isi Nama dan No. WhatsApp terlebih dahulu.', 'error');
      return;
    }

    // Build WhatsApp message
    const wa = `*Halo Dream Line Production!* 👋\n\n` +
      `Saya ingin menanyakan informasi lebih lanjut:\n\n` +
      `👤 *Nama:* ${name}\n` +
      `📱 *No. HP:* ${phone}\n` +
      (service ? `📸 *Layanan:* ${service}\n` : '') +
      (date ? `📅 *Tanggal:* ${date}\n` : '') +
      (message ? `\n💬 *Pesan:*\n${message}` : '') +
      `\n\nMohon infonya, terima kasih! 🙏`;

    const waNumber = '628123456789'; // ← Ganti nomor WA Anda
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(wa)}`;
    window.open(waUrl, '_blank');
    contactForm.reset();
    showNotification('Terima kasih! Pesan Anda akan dikirim via WhatsApp.', 'success');
  });

  // ─── NOTIFICATION TOAST ───────────────────────────────────────
  function showNotification(msg, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position:fixed; bottom:100px; left:50%; transform:translateX(-50%) translateY(20px);
      background:${type === 'success' ? '#1a1505' : '#1a0505'};
      border:1px solid ${type === 'success' ? '#c9a84c' : '#ef4444'};
      color:${type === 'success' ? '#c9a84c' : '#ef4444'};
      padding:14px 28px; border-radius:8px; font-size:0.88rem;
      z-index:9999; opacity:0; transition:all 0.4s ease;
      white-space:nowrap; box-shadow:0 10px 30px rgba(0,0,0,0.5);
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)'; }, 10);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 3500);
  }

  // ─── BACK TO TOP ──────────────────────────────────────────────
  document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── PARALLAX HERO ────────────────────────────────────────────
  const heroVideo = document.querySelector('.hero-video');
  window.addEventListener('scroll', () => {
    if (heroVideo && window.scrollY < window.innerHeight) {
      heroVideo.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }
  }, { passive: true });

  // ─── NAVBAR LINK HOVER ANIMATION (stagger) ───────────────────
  document.querySelectorAll('.nav-link').forEach((link, i) => {
    link.style.transitionDelay = (i * 0.05) + 's';
  });

  console.log('%c✨ Dream Line Production', 'font-size:20px;font-weight:bold;color:#c9a84c;');
  console.log('%cWebsite berhasil dimuat!', 'color: #a09880;');
});
