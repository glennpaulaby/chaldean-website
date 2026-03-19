/* ═══════════════════════════════════════════════════════════════
   Chaldean Syrian HSS — main.js
   ───────────────────────────────────────────────────────────────
   Sections:
     1.  Navbar scroll behaviour
     2.  Mobile hamburger toggle
     3.  Hero image slider (auto-play + manual controls)
     4.  Scroll-reveal animations (IntersectionObserver)
     5.  Quick-link staggered entry
     6.  Active nav link on scroll (Scrollspy)
     7.  Back-to-top button
     8.  Footer year auto-update
     9.  Contact form handler (placeholder — wire up a backend here)
   ═══════════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────────────────────────────
   Wait for the DOM to be fully loaded before running any JS
   ──────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════════════════════════
     1. NAVBAR — add .scrolled class when page scrolls down
     This darkens/shadows the navbar for better contrast.
  ══════════════════════════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run once on load


  /* ══════════════════════════════════════════════════════════════
     2. MOBILE HAMBURGER TOGGLE
     Toggles the .open class on both the button and the nav.
     To extend: add more animations in CSS for .navbar__nav.open
  ══════════════════════════════════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('mainNav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mainNav.classList.toggle('open');
  });

  // Close nav when a link is clicked (smooth UX on mobile)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mainNav.classList.remove('open');
    });
  });


  /* ══════════════════════════════════════════════════════════════
     3. HERO SLIDER
     ─────────────────────────────────────────────────────────────
     Configuration:
       SLIDE_DURATION_MS  — time (ms) each slide is shown
     
     To add more slides:
       • Add a new .slide div in index.html (inside #slider)
       • Add a new .dot button in #sliderDots with the next data-index
     All JS below will work automatically.
  ══════════════════════════════════════════════════════════════ */
  /* ── SLIDER ONLY runs on pages that have a #slider element (index.html).
     On staff.html / gallery.html these elements don't exist, so we skip
     this entire block to avoid JS errors that would block the rest of the script. */
  const sliderEl = document.getElementById('slider');

  if (sliderEl) {
    const slides     = document.querySelectorAll('.slide');
    const dots       = document.querySelectorAll('.dot');
    const btnPrev    = document.getElementById('slidePrev');
    const btnNext    = document.getElementById('slideNext');

    const SLIDE_DURATION_MS = 5500; // ← Change this to adjust auto-play speed

    let currentSlide  = 0;
    let autoPlayTimer = null;

    /**
     * showSlide(index)
     * Moves the carousel to the given slide index.
     * Wraps around (0 → last, last → 0).
     */
    function showSlide(index) {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }

    function startAutoPlay() {
      clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(nextSlide, SLIDE_DURATION_MS);
    }

    function manualChange(fn) {
      fn();
      startAutoPlay();
    }

    btnNext.addEventListener('click', () => manualChange(nextSlide));
    btnPrev.addEventListener('click', () => manualChange(prevSlide));

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        manualChange(() => showSlide(parseInt(dot.dataset.index)));
      });
    });

    // Keyboard arrow support for accessibility
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') manualChange(nextSlide);
      if (e.key === 'ArrowLeft')  manualChange(prevSlide);
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;

    sliderEl.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderEl.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        manualChange(diff > 0 ? nextSlide : prevSlide);
      }
    }, { passive: true });

    sliderEl.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    sliderEl.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();

  } // end if(sliderEl)


  /* ══════════════════════════════════════════════════════════════
     4. SCROLL-REVEAL ANIMATIONS (IntersectionObserver)
     ─────────────────────────────────────────────────────────────
     Elements with .reveal-left, .reveal-right, or .reveal-up
     start invisible (set in CSS) and become visible when they
     enter the viewport. This is handled efficiently with
     IntersectionObserver — no scroll event listeners needed.
     
     To animate a new element: just add one of these classes to it
     in index.html, and optionally a data-delay="200" attribute
     to stagger the animation.
  ══════════════════════════════════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || '0');

        setTimeout(() => {
          el.classList.add('visible');
        }, delay);

        revealObserver.unobserve(el);
      });
    },
    { threshold: 0.05 } // ← Low threshold so elements near top of page trigger reliably
  );

  revealEls.forEach(el => revealObserver.observe(el));


  /* ══════════════════════════════════════════════════════════════
     5. QUICK LINK STAGGERED ENTRY
     Each .ql-item fades in sequentially using its data-delay.
     This runs as soon as the quicklinks section enters view.
  ══════════════════════════════════════════════════════════════ */
  const qlItems = document.querySelectorAll('.ql-item');

  const qlObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        qlItems.forEach(item => {
          const delay = parseInt(item.dataset.delay || '0');
          setTimeout(() => item.classList.add('visible'), delay);
        });

        qlObserver.disconnect(); // Only animate once
      });
    },
    { threshold: 0.2 }
  );

  const qlSection = document.querySelector('.quicklinks');
  if (qlSection) qlObserver.observe(qlSection);


  /* ══════════════════════════════════════════════════════════════
     6. SCROLLSPY — highlight active nav link as user scrolls
     ─────────────────────────────────────────────────────────────
     Each section's ID must match a nav link's href (e.g. #about).
     To add a new section: just give it an id="" and add a
     matching <a href="#your-id"> in the navbar.
  ══════════════════════════════════════════════════════════════ */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;

        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px', // Trigger when section is roughly centred
      threshold: 0
    }
  );

  sections.forEach(section => spyObserver.observe(section));


  /* ══════════════════════════════════════════════════════════════
     7. BACK TO TOP BUTTON
     Shows after scrolling 400px, hides above that threshold.
  ══════════════════════════════════════════════════════════════ */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ══════════════════════════════════════════════════════════════
     8. FOOTER YEAR — auto-updates so you never need to edit it
  ══════════════════════════════════════════════════════════════ */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


}); // end DOMContentLoaded


/* ══════════════════════════════════════════════════════════════
   9. CONTACT FORM HANDLER
   ─────────────────────────────────────────────────────────────
   This is defined globally (outside DOMContentLoaded) so it
   can be called from the onclick attribute in the HTML.

   TO WIRE UP A REAL BACKEND:
     Option A — Formspree (easy, free tier):
       1. Sign up at https://formspree.io
       2. Create a form and copy your endpoint ID
       3. Replace the fetch() URL below with:
          "https://formspree.io/f/YOUR_FORM_ID"
       4. Remove the fake success simulation

     Option B — Your own PHP/Node backend:
       Change the fetch URL to your server endpoint
       and handle the POST body accordingly.
══════════════════════════════════════════════════════════════ */
function handleFormSubmit(event) {
  event.preventDefault(); // Prevent default form navigation

  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();
  const noteEl  = document.getElementById('formNote');
  const btn     = document.getElementById('formSubmit');

  // Basic client-side validation
  if (!name || !email || !message) {
    noteEl.textContent = 'Please fill in all required fields.';
    noteEl.style.color = '#c0392b';
    return;
  }

  // Show loading state
  btn.textContent = 'Sending…';
  btn.disabled    = true;
  noteEl.textContent = '';

  /* ── REPLACE THIS BLOCK with a real fetch() to your backend ── */
  setTimeout(() => {
    // Simulated success — remove this block when connecting a backend
    noteEl.textContent = '✓ Message sent successfully! We will get back to you soon.';
    noteEl.style.color = '#27ae60';
    btn.textContent    = 'Send Message ✓';
    btn.disabled       = false;

    // Clear form fields
    ['fname', 'femail', 'fsubject', 'fmessage'].forEach(id => {
      document.getElementById(id).value = '';
    });
  }, 1500);
  /* ─────────────────────────────────────────────────────────── */
}