/* ═══════════════════════════════════════════════════════════════
   gallery.js — Logic specific to gallery.html
   ───────────────────────────────────────────────────────────────
   Handles:
     1. Category filter tabs
     2. Lightbox open / close / navigation
     3. Keyboard & swipe support for lightbox
     4. Footer year
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════════════════════════
     1. CATEGORY FILTER
     ─────────────────────────────────────────────────────────────
     Works the same as staff.js — see comments there.
     data-filter on buttons maps to data-cat on gallery items.
  ══════════════════════════════════════════════════════════════ */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        const cat = item.dataset.cat;
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      // Re-observe newly visible items so scroll-reveal triggers
      galleryItems.forEach(item => {
        if (!item.classList.contains('hidden') && !item.classList.contains('visible')) {
          revealObserver.observe(item);
        }
      });
    });
  });


  /* ══════════════════════════════════════════════════════════════
     2. SCROLL-REVEAL for gallery items
     (main.js handles generic .reveal-* classes;
      gallery items use a separate observer so filter works with it)
  ══════════════════════════════════════════════════════════════ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.dataset.delay || '0');
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  galleryItems.forEach(item => revealObserver.observe(item));


  /* ══════════════════════════════════════════════════════════════
     3. LIGHTBOX
     ─────────────────────────────────────────────────────────────
     Opens when a .gallery-item is clicked.
     Shows the image src (if a real <img> is inside) OR shows
     the placeholder hint when only a .gallery-placeholder exists.

     HOW TO ADD REAL IMAGES:
       Replace the .gallery-placeholder div inside a .gallery-item
       with: <img src="images/gallery/your-photo.jpg" alt="Caption" />
       The lightbox will automatically pick it up.
  ══════════════════════════════════════════════════════════════ */
  const lightbox        = document.getElementById('lightbox');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxPlaceholder = document.getElementById('lightboxPlaceholder');
  const btnClose        = document.getElementById('lightboxClose');
  const btnPrev         = document.getElementById('lightboxPrev');
  const btnNext         = document.getElementById('lightboxNext');

  // Build a list of currently VISIBLE (non-hidden) items for navigation
  function getVisibleItems() {
    return [...galleryItems].filter(item => !item.classList.contains('hidden'));
  }

  let currentIndex = 0; // index within getVisibleItems()

  /** Open the lightbox for a given gallery item */
  function openLightbox(item) {
    const visibleItems = getVisibleItems();
    currentIndex = visibleItems.indexOf(item);

    showItem(item);

    lightbox.classList.add('active');
    lightboxBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  /** Populate lightbox content from a gallery item */
  function showItem(item) {
    const title   = item.dataset.title || 'School Photo';
    const imgEl   = item.querySelector('img'); // real image if present

    if (imgEl) {
      // Real photo exists — show it
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = title;
      lightboxImg.classList.add('visible');
      lightboxPlaceholder.classList.add('hidden');
    } else {
      // No real photo yet — show placeholder with path hint
      lightboxImg.classList.remove('visible');
      lightboxImg.src = '';
      lightboxPlaceholder.classList.remove('hidden');
    }

    lightboxCaption.textContent = title;
  }

  /** Close the lightbox */
  function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxBackdrop.classList.remove('active');
    document.body.style.overflow = ''; // restore scroll
    lightboxImg.src = '';
    lightboxImg.classList.remove('visible');
  }

  /** Navigate to previous or next item */
  function navigate(dir) {
    const visibleItems = getVisibleItems();
    currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
    showItem(visibleItems[currentIndex]);
  }

  // Wire up click on each gallery item
  galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  // Close button & backdrop click
  btnClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);

  // Arrow navigation
  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
  btnNext.addEventListener('click', (e) => { e.stopPropagation(); navigate(+1); });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(+1);
  });

  // Touch/swipe support in lightbox
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
  }, { passive: true });


  /* ══════════════════════════════════════════════════════════════
     4. FOOTER YEAR
  ══════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.footerYear').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

});
