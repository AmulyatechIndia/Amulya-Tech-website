/* ========================================================================
   Amulyatech — Premium Animations & Interactivity
   Scroll reveals, animated counters, carousel, 3D tilt, navbar effects
   ======================================================================== */

(function () {
  'use strict';

  // ── Utility ──────────────────────────────────────────────────────────
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ── Theme Toggle (Light / Dark Mode) ─────────────────────────────────
  const THEME_KEY = 'amulyatech-theme';
  const themeToggle = $('#theme-toggle');
  const root = document.documentElement;

  function applyTheme(theme) {
    root.classList.toggle('light-mode', theme === 'light');
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'light');
    }
  }

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = root.classList.contains('light-mode');
      const nextTheme = isLight ? 'dark' : 'light';
      applyTheme(nextTheme);
      localStorage.setItem(THEME_KEY, nextTheme);
    });
  }

  // ── Year ─────────────────────────────────────────────────────────────
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Mobile Menu ──────────────────────────────────────────────────────
  const menuToggle = $('#menu-toggle');
  const navLinks = $('#nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    $$('a', navLinks).forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Navbar Scroll Effect ─────────────────────────────────────────────
  const header = $('#header');

  function onScroll() {
    const scrollY = window.scrollY;

    // Glassmorphism intensifies on scroll
    if (header) {
      header.classList.toggle('scrolled', scrollY > 50);
    }

    // Active nav link highlighting
    const sections = $$('section[id]');
    const scrollPos = scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = $(`a[href="#${id}"]`, navLinks);

      if (link && !link.classList.contains('nav-cta')) {
        if (scrollPos >= top && scrollPos < top + height) {
          $$('a', navLinks).forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load

  // ── Smooth Scroll with Offset ────────────────────────────────────────
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = $(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── Scroll Reveal (IntersectionObserver) ─────────────────────────────
  const revealElements = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Don't unobserve — keeps it simple and reveals are one-shot anyway
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ── Animated Counters ────────────────────────────────────────────────
  const counters = $$('.stat-number[data-target]');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const duration = 2000; // ms
      const startTime = performance.now();

      function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      }

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const current = Math.floor(easedProgress * target);

        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          // Final value with suffix
          counter.textContent = target + (target > 100 ? '+' : target === 99 ? '.9' : '+');
        }
      }

      requestAnimationFrame(update);
    });
  }

  // Observe stats section
  const statsSection = $('.stats-bar');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    statsObserver.observe(statsSection);
  }

  // ── Product Card 3D Tilt Effect ──────────────────────────────────────
  const productCards = $$('.product-card');

  productCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });

  // ── Testimonial Carousel ─────────────────────────────────────────────
  const track = $('#testimonial-track');
  const dots = $$('.carousel-dot');
  let currentSlide = 0;
  let slideCount = dots.length;
  let autoplayTimer = null;

  function goToSlide(index) {
    currentSlide = index;
    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slideCount);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.slide, 10));
      startAutoplay(); // Reset timer
    });
  });

  // Pause on hover
  const carousel = $('.testimonial-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  // Touch/swipe support
  if (track) {
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentSlide < slideCount - 1) {
          goToSlide(currentSlide + 1);
        } else if (diff < 0 && currentSlide > 0) {
          goToSlide(currentSlide - 1);
        }
      }
      startAutoplay();
    }, { passive: true });
  }

  startAutoplay();

  // ── Hero Entrance Animation ──────────────────────────────────────────
  // Stagger hero elements in on page load; the heading gets its own
  // heavier blur+slide entrance so it reads as the focal point.
  function animateHero() {
    const heading = $('.hero h1');
    if (heading) {
      heading.style.opacity = '0';
      heading.style.transform = 'translateY(40px)';
      heading.style.filter = 'blur(10px)';
      heading.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.12s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.12s, filter 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.12s';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          heading.style.opacity = '1';
          heading.style.transform = 'translateY(0)';
          heading.style.filter = 'blur(0)';
        });
      });
    }

    const heroFadeElements = [
      { selector: '.hero-badge', delay: 0 },
      { selector: '.hero-text', delay: 0.24 },
      { selector: '.hero-buttons', delay: 0.36 },
      { selector: '.hero-visual', delay: 0.48 }
    ];

    heroFadeElements.forEach(({ selector, delay }) => {
      const el = $(selector);
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;

        // Trigger reflow then animate
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
        });
      }
    });
  }

  // Run hero animation after a tiny delay for fonts to load
  if (document.readyState === 'complete') {
    animateHero();
  } else {
    window.addEventListener('load', animateHero);
  }

  // ── Gradient Cursor Glow on Service Cards ────────────────────────────
  $$('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--glow-x', `${x}px`);
      card.style.setProperty('--glow-y', `${y}px`);
      card.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(0, 212, 255, 0.04), transparent 40%), rgba(17, 24, 39, 0.45)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

})();