/* ═══════════════════════════════════════════════════════════════
   staff.js — Logic specific to staff.html
   ───────────────────────────────────────────────────────────────
   Handles:
     1. Department filter tabs (All / Science / Commerce / etc.)
     2. Footer year (shared helper)
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════════════════════════
     1. DEPARTMENT FILTER
     ─────────────────────────────────────────────────────────────
     When a filter button is clicked:
       • The button gets .active styling
       • Cards that DON'T match the filter get .hidden (display:none)
       • Cards that DO match animate back in

     data-filter="all" shows everyone.
     Each .staff-card must have a matching data-dept="..." attribute.

     To add a new filter:
       1. Add a <button class="filter-btn" data-filter="your-dept">Label</button>
       2. Add data-dept="your-dept" to the relevant staff cards
  ══════════════════════════════════════════════════════════════ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const staffCards = document.querySelectorAll('.staff-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {

      // Highlight clicked button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter; // e.g. "science" or "all"

      staffCards.forEach((card, index) => {
        const dept = card.dataset.dept;

        if (filter === 'all' || dept === filter) {
          // Show card with a slight stagger for a smooth reveal
          card.classList.remove('hidden');
          card.style.animationDelay = `${index * 40}ms`;
        } else {
          // Hide card
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ══════════════════════════════════════════════════════════════
     2. FOOTER YEAR — update all .footerYear spans
  ══════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.footerYear').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

});
