# Chaldean Syrian HSS — Website

A complete, single-page school website for **Chaldean Syrian Higher Secondary School, Thrissur**.

Access the website [here](https://glennpaulaby.github.io/chaldean-website/)
---

## 📁 File Structure

```
chaldean-hss/
│
├── index.html          ← Main webpage (all sections live here)
├── css/
│   └── styles.css      ← All styling (colours, layout, animations)
├── js/
│   └── main.js         ← Slider, scroll reveal, navbar, form logic
├── images/             ← Place your school photos here (see below)
│   ├── logo.png            ← School logo (recommended: 200×200 px, PNG with transparency)
│   ├── principal.jpg       ← Principal photo (recommended: 400×400 px)
│   ├── hero1.jpg           ← Slider image 1 (recommended: 1920×900 px)
│   ├── hero2.jpg           ← Slider image 2 (recommended: 1920×900 px)
│   └── hero3.jpg           ← Slider image 3 (recommended: 1920×900 px)
└── README.md           ← This file
```

---

## 🚀 How to Run

No server needed. Simply open `index.html` in any modern web browser.

For development, use [VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for auto-reload on save.

---

## 🖼️ Adding Real Images

### Hero Slider Photos
In `index.html`, find `.slide__bg--1`, `.slide__bg--2`, `.slide__bg--3` divs.
Replace the `<div class="slide__bg slide__bg--1"></div>` with:
```html
<img src="images/hero1.jpg" alt="School campus" class="slide__bg" />
```
Or in `css/styles.css`, update:
```css
.slide__bg--1 {
  background-image: url('../images/hero1.jpg');
  background-size: cover;
  background-position: center;
}
```

### School Logo
Find `<!-- Replace the SVG crest below with your actual logo image -->` in `index.html` and replace with:
```html
<img src="images/logo.png" alt="Chaldean Syrian HSS Logo" />
```

### Principal Photo
Find `.principal-photo__placeholder` and replace with:
```html
<img src="images/principal.jpg" alt="Dr. Aby Paul" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />
```

---

## 🎨 Changing Colours / Theme

All colours are CSS custom properties at the top of `css/styles.css`:
```css
:root {
  --maroon:  #7a1c2e;   /* Primary brand colour */
  --gold:    #c9a84c;   /* Accent colour */
  --cream:   #fdf8f0;   /* Background tone */
  ...
}
```
Edit these values to retheme the entire site instantly.

---

## ➕ Adding / Removing Sections

### Add a new nav link:
In `index.html` inside `.navbar__nav ul`:
```html
<li><a href="#new-section" class="nav-link">New Section</a></li>
```

### Add a new quick-link icon:
Copy an existing `.ql-item` block in the `#quicklinks` section and update the icon class, colour class, and label.

Available icon colour classes: `ql-icon--red`, `--green`, `--blue`, `--orange`, `--teal`, `--maroon`
Browse icons at: https://fontawesome.com/icons

### Add a new timeline entry (History section):
Copy a `.timeline__item` block and update the year, title, and description.

---

## 📧 Activating the Contact Form

The form currently simulates a submission. To make it real:

**Option A — Formspree (free, no backend needed):**
1. Sign up at https://formspree.io
2. Create a form → copy your Form ID
3. In `js/main.js`, find `handleFormSubmit()` and replace the `setTimeout` block with:
```js
fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message })
})
.then(res => {
  if (res.ok) {
    noteEl.textContent = '✓ Message sent!';
    noteEl.style.color = '#27ae60';
  }
});
```

---

## 🛠️ External Dependencies (CDN — no installation needed)

| Library | Purpose | Version |
|---------|---------|---------|
| Google Fonts (Playfair Display, Lato, Cinzel) | Typography | Latest |
| Font Awesome | Icons | 6.5.0 |

Both are loaded via CDN in `index.html` — no npm or build tools needed.

---

## 📱 Browser Support

Works on all modern browsers: Chrome, Firefox, Safari, Edge.
Responsive design adapts to: Desktop → Tablet → Mobile.

---

*Website created for Chaldean Syrian HSS, Thrissur, Kerala.*
