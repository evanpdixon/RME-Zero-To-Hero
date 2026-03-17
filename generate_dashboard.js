// generate_dashboard.js
// Reads book_doc.js chapter data and generates an interactive HTML dashboard
// Usage: node generate_dashboard.js

const fs = require('fs');
const Module = require('module');
const path = require('path');

// ─── Step 1: Extract chapter content by hijacking require('docx') ───

const chapters = [];
let currentChapter = null;

// Stub docx module
const fakeDocx = {
  Document: function() {},
  Packer: { toBuffer: () => Promise.resolve(Buffer.from('')) },
  Paragraph: function(o) { return o || {}; },
  TextRun: function(o) { return o || {}; },
  AlignmentType: { CENTER: 'center', LEFT: 'left' },
  LevelFormat: { BULLET: 'bullet' },
  BorderStyle: { SINGLE: 'single' },
  PageNumber: { CURRENT: '' },
  Footer: function() { return {}; },
  PageBreak: function() { return {}; }
};

// Hook into require so that when book_doc.js does require('docx'), it gets our stubs
const origRequire = Module.prototype.require;
Module.prototype.require = function(id) {
  if (id === 'docx') return fakeDocx;
  return origRequire.apply(this, arguments);
};

// Read and transform book_doc.js
const bookPath = path.join(__dirname, 'book_doc.js');
let bookSrc = fs.readFileSync(bookPath, 'utf-8');

// Replace content functions with data extractors
bookSrc = bookSrc
  .replace(
    /function chapterHead\(text\)\s*\{[\s\S]*?\n\}/,
    `function chapterHead(text) {
  if (__currentChapter) __chapters.push(__currentChapter);
  __currentChapter = { title: text, paragraphs: [] };
  return {};
}`
  )
  .replace(
    /\/\/ Evan's words - plain text\nfunction body\(text\)\s*\{[\s\S]*?\n\}/,
    `function body(text) {
  if (__currentChapter) __currentChapter.paragraphs.push({ type: 'body', text });
  return {};
}`
  )
  .replace(
    /\/\/ AI-added paragraph - yellow highlight\nfunction bodyAI\(text\)\s*\{[\s\S]*?\n\}/,
    `function bodyAI(text) {
  if (__currentChapter) __currentChapter.paragraphs.push({ type: 'bodyAI', text });
  return {};
}`
  )
  .replace(
    /\/\/ Mixed paragraph - array of \[text, isAI\] pairs\nfunction bodyMixed\(segments\)\s*\{[\s\S]*?\n\}/,
    `function bodyMixed(segments) {
  if (__currentChapter) __currentChapter.paragraphs.push({ type: 'bodyMixed', segments });
  return {};
}`
  )
  .replace(
    /function expandNote\(text\)\s*\{[\s\S]*?\n\}/,
    `function expandNote(text) {
  if (__currentChapter) __currentChapter.paragraphs.push({ type: 'expand', text });
  return {};
}`
  )
  .replace(/function divider\(\)\s*\{[\s\S]*?\n\}/, 'function divider() { return {}; }')
  .replace(/function legendNote\(\)\s*\{[\s\S]*?\n\}/, 'function legendNote() { return {}; }')
  .replace(/function pageBreak\(\)\s*\{[\s\S]*?\n\}/, 'function pageBreak() { return {}; }')
  .replace(/function makeFooter[\s\S]*?\n\}/, 'function makeFooter() { return {}; }')
  // Remove Document construction and file writing
  .replace(/const bookDoc\s*=\s*new Document\([\s\S]*?\)\s*;/, '')
  .replace(/Packer\.toBuffer[\s\S]*$/, '// end');

// Inject chapter collectors
bookSrc = `var __chapters = [], __currentChapter = null;\n` + bookSrc +
  `\nif (__currentChapter) __chapters.push(__currentChapter);\n` +
  `module.exports = __chapters;\n`;

// Write temp file, require it, delete it
const tmpPath = path.join(__dirname, '_tmp_extract.js');
fs.writeFileSync(tmpPath, bookSrc);

let extractedChapters;
try {
  extractedChapters = require(tmpPath);
  console.log(`Extracted ${extractedChapters.length} chapters:`);
  extractedChapters.forEach((ch, i) => console.log(`  ${i + 1}. ${ch.title} (${ch.paragraphs.length} paragraphs)`));
} catch (e) {
  console.error('Extraction error:', e.message);
  console.error(e.stack);
  extractedChapters = [];
} finally {
  Module.prototype.require = origRequire;
  try { fs.unlinkSync(tmpPath); } catch(e) {}
}

// ─── Step 2: Book outline (full plan including unwritten chapters) ───

const outline = [
  { part: "Part I: The Story", chapters: [
    "Ch 1: The Conversation That Started Everything",
    "Ch 2: The Internet Was Not Very Helpful",
    "Ch 3: First Contact",
    "Ch 4: Allowed versus Able",
    "Ch 5: 413 Slides"
  ]},
  { part: "Part II: Understanding Radio", chapters: [
    "Ch 6: Why Radio",
    "Ch 7: How Radio Works",
    "Ch 8: Radio Theory"
  ]},
  { part: "Part III: Getting on the Air", chapters: [
    "Ch 9: Your First Radio",
    "Ch 10: Programming",
    "Ch 11: Principles of Use",
    "Ch 12: How to Talk on a Radio",
    "Ch 13: Communication Strategies"
  ]},
  { part: "Part IV: Going Further", chapters: [
    "Ch 14: Setting Up Comms for a Group",
    "Ch 15: HF Radio",
    "Ch 16: Power",
    "Ch 17: Gear Recommendations"
  ]},
  { part: "Part V: Putting It Together", chapters: [
    "Ch 18: Mission Planning",
    "Ch 19: Licensing",
    "Ch 20: Resources"
  ]}
];

// ─── Step 3: Generate HTML ───

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderParagraph(p, idx) {
  switch (p.type) {
    case 'body':
      return `<p class="book-para" data-idx="${idx}">${escHtml(p.text)}</p>`;
    case 'bodyAI':
      return `<p class="book-para ai-added" data-idx="${idx}">${escHtml(p.text)}</p>`;
    case 'bodyMixed': {
      const spans = p.segments.map(([text, isAI]) =>
        isAI ? `<span class="ai-added">${escHtml(text)}</span>` : escHtml(text)
      ).join('');
      return `<p class="book-para mixed" data-idx="${idx}">${spans}</p>`;
    }
    case 'expand':
      return `<div class="expand-note" data-idx="${idx}"><strong>EXPAND:</strong> ${escHtml(p.text)}</div>`;
    default:
      return '';
  }
}

function renderChapter(ch, chIdx) {
  const id = `ch${chIdx + 1}`;
  const paras = ch.paragraphs.map((p, i) => renderParagraph(p, i)).join('\n      ');
  return `
    <section id="${id}" class="chapter">
      <h2 class="chapter-title">${escHtml(ch.title)}</h2>
      <div class="legend">plain text = Evan&#39;s words <span class="ai-added">yellow = AI-added prose</span></div>
      ${paras}
    </section>`;
}

function renderSidebar() {
  let html = '';
  outline.forEach(part => {
    html += `<div class="nav-part">${escHtml(part.part)}</div>\n`;
    part.chapters.forEach(ch => {
      const num = ch.match(/Ch (\d+)/)[1];
      const idx = parseInt(num);
      const written = idx <= extractedChapters.length;
      const label = ch.replace(/^Ch \d+: /, '');
      html += `      <a href="#ch${num}" data-target="ch${num}" class="${written ? '' : 'unwritten'}">${escHtml(label)}${written ? '' : ' <span class="draft-badge">planned</span>'}</a>\n`;
    });
  });
  return html;
}

function renderChapters() {
  let html = '';
  extractedChapters.forEach((ch, i) => {
    html += renderChapter(ch, i);
  });
  // Placeholder sections for unwritten chapters
  for (let i = extractedChapters.length + 1; i <= 20; i++) {
    const outlineCh = outline.flatMap(p => p.chapters).find(c => c.startsWith(`Ch ${i}:`));
    if (outlineCh) {
      html += `
    <section id="ch${i}" class="chapter placeholder-chapter">
      <h2 class="chapter-title">${escHtml(outlineCh)}</h2>
      <p class="placeholder-text">This chapter has not been written yet.</p>
    </section>`;
    }
  }
  return html;
}

const pct = Math.round((extractedChapters.length / 20) * 100);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Zero to Hero Radio Operator — Book Dashboard</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: Georgia, 'Times New Roman', serif;
    background: #0d0d0d;
    color: #d8d0c4;
    line-height: 1.8;
  }

  /* ── SIDEBAR ── */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 260px;
    height: 100vh;
    overflow-y: auto;
    background: #0a0a0a;
    border-right: 1px solid #1a1a1a;
    padding: 24px 16px 40px;
    z-index: 200;
    scrollbar-width: thin;
    scrollbar-color: #333 transparent;
    transition: transform 0.25s ease;
  }

  .sidebar-header {
    text-align: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #222;
  }

  .sidebar-header h1 {
    font-size: 1.1em;
    color: #B8860B;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .sidebar-header .subtitle {
    font-family: 'Courier New', monospace;
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #555;
    margin-top: 4px;
  }

  .nav-part {
    font-family: 'Courier New', monospace;
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #B8860B;
    margin: 18px 0 8px;
    padding-left: 8px;
  }

  .sidebar a {
    display: block;
    font-family: Georgia, serif;
    font-size: 0.78em;
    color: #777;
    text-decoration: none;
    padding: 4px 8px;
    border-left: 2px solid transparent;
    line-height: 1.4;
    margin-bottom: 1px;
    transition: color 0.1s, border-color 0.1s;
  }

  .sidebar a:hover,
  .sidebar a.active {
    color: #d8d0c4;
    border-left-color: #B8860B;
  }

  .sidebar a.unwritten {
    color: #444;
    font-style: italic;
  }

  .sidebar a.unwritten:hover {
    color: #666;
    border-left-color: #444;
  }

  .draft-badge {
    font-family: 'Courier New', monospace;
    font-size: 8px;
    color: #555;
    letter-spacing: 0.05em;
    margin-left: 4px;
  }

  /* ── HAMBURGER ── */
  .menu-toggle {
    display: none;
    position: fixed;
    top: 12px;
    left: 12px;
    z-index: 300;
    background: #1a1a1a;
    border: 1px solid #333;
    color: #B8860B;
    font-size: 20px;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    cursor: pointer;
    line-height: 40px;
    text-align: center;
  }

  .menu-toggle:hover {
    background: #222;
    border-color: #B8860B;
  }

  /* ── MAIN CONTENT ── */
  .main {
    margin-left: 260px;
    max-width: 780px;
    padding: 48px 40px 120px;
  }

  /* ── COVER ── */
  .cover {
    text-align: center;
    padding: 80px 0 60px;
    border-bottom: 1px solid #222;
    margin-bottom: 48px;
  }

  .cover h1 {
    font-size: 2.8em;
    color: #1F3C6E;
    font-weight: 700;
    line-height: 1.1;
  }

  .cover h2 {
    font-size: 1.8em;
    color: #1F3C6E;
    font-weight: 700;
    margin-top: 8px;
  }

  .cover .byline {
    font-size: 1em;
    color: #666;
    font-style: italic;
    margin-top: 20px;
  }

  .cover .brand {
    font-size: 0.9em;
    color: #4A90D9;
    margin-top: 32px;
  }

  .cover .brand-url {
    font-family: 'Courier New', monospace;
    font-size: 0.75em;
    color: #555;
    margin-top: 4px;
  }

  /* ── PROGRESS BAR ── */
  .progress-bar {
    margin: 0 0 48px;
    padding: 16px 20px;
    background: #111;
    border: 1px solid #1a1a1a;
    border-radius: 4px;
  }

  .progress-bar .label {
    font-family: 'Courier New', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #666;
    margin-bottom: 8px;
  }

  .progress-track {
    background: #1a1a1a;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    background: linear-gradient(90deg, #B8860B, #d4a020);
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-stats {
    font-family: 'Courier New', monospace;
    font-size: 10px;
    color: #555;
    margin-top: 6px;
    display: flex;
    justify-content: space-between;
  }

  /* ── CHAPTERS ── */
  .chapter {
    margin-bottom: 64px;
    padding-bottom: 48px;
    border-bottom: 1px solid #1a1a1a;
  }

  .chapter:last-child { border-bottom: none; }

  .chapter-title {
    font-size: 1.5em;
    color: #1F3C6E;
    font-weight: 700;
    padding-bottom: 10px;
    border-bottom: 2px solid #4A90D9;
    margin-bottom: 20px;
  }

  .legend {
    font-family: 'Courier New', monospace;
    font-size: 10px;
    color: #555;
    margin-bottom: 24px;
  }

  .legend .ai-added {
    background: rgba(255, 255, 0, 0.15);
    color: #b8a040;
    padding: 1px 4px;
  }

  .book-para {
    font-size: 1em;
    color: #c8c0b4;
    text-indent: 2em;
    margin-bottom: 16px;
  }

  .book-para.ai-added,
  .book-para .ai-added {
    background: rgba(255, 255, 0, 0.08);
    color: #b8a040;
    border-left: 2px solid rgba(184, 134, 11, 0.3);
    padding-left: 6px;
  }

  p.ai-added {
    text-indent: 0;
    padding: 4px 8px 4px 12px;
  }

  .expand-note {
    font-family: 'Courier New', monospace;
    font-size: 0.82em;
    color: #B8860B;
    background: rgba(255, 243, 205, 0.08);
    border-left: 3px solid #B8860B;
    padding: 10px 14px;
    margin: 16px 0 20px;
    line-height: 1.5;
  }

  .placeholder-chapter {
    opacity: 0.4;
  }

  .placeholder-text {
    font-style: italic;
    color: #555;
    padding: 20px 0;
  }

  /* ── OVERLAY for mobile ── */
  .sidebar-overlay {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.6);
    z-index: 150;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .sidebar {
      transform: translateX(-100%);
    }

    .sidebar.open {
      transform: translateX(0);
    }

    .sidebar-overlay.open {
      display: block;
    }

    .menu-toggle {
      display: block;
    }

    .main {
      margin-left: 0;
      padding: 60px 20px 100px;
    }
  }

  @media (max-width: 600px) {
    .cover h1 { font-size: 2em; }
    .cover h2 { font-size: 1.3em; }
    .main { padding: 56px 16px 80px; }
    .book-para { font-size: 0.95em; }
  }
</style>
</head>
<body>

<button class="menu-toggle" id="menuToggle">&#9776;</button>
<div class="sidebar-overlay" id="sidebarOverlay"></div>

<nav class="sidebar" id="sidebar">
  <div class="sidebar-header">
    <h1>Zero to Hero</h1>
    <div class="subtitle">Radio Operator &mdash; Book Draft</div>
  </div>
  ${renderSidebar()}
</nav>

<div class="main">
  <div class="cover">
    <h1>Zero to Hero</h1>
    <h2>Radio Operator</h2>
    <div class="byline">by Evan Dixon</div>
    <div class="brand">Radio Made Easy</div>
    <div class="brand-url">radiomadeeasy.com</div>
  </div>

  <div class="progress-bar">
    <div class="label">Book Progress</div>
    <div class="progress-track">
      <div class="progress-fill" style="width: ${pct}%"></div>
    </div>
    <div class="progress-stats">
      <span>${extractedChapters.length} of 19 chapters drafted</span>
      <span>${pct}%</span>
    </div>
  </div>

  ${renderChapters()}
</div>

<script>
  // ── Sidebar toggle (mobile) ──
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebarOverlay');
  var toggle = document.getElementById('menuToggle');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  }

  toggle.addEventListener('click', function() {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  overlay.addEventListener('click', closeSidebar);

  // Close sidebar on nav click (mobile)
  sidebar.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      if (window.innerWidth <= 900) closeSidebar();
    });
  });

  // ── Scroll-based active link tracking ──
  var links = document.querySelectorAll('.sidebar a[data-target]');
  var targets = Array.from(links).map(function(a) {
    return document.getElementById(a.dataset.target);
  });

  function onScroll() {
    var scrollY = window.scrollY + 140;
    var active = 0;
    for (var i = 0; i < targets.length; i++) {
      if (targets[i] && targets[i].getBoundingClientRect().top + window.scrollY <= scrollY) {
        active = i;
      }
    }
    links.forEach(function(a, i) {
      a.classList.toggle('active', i === active);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
</script>

</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'dashboard.html'), html);
console.log('Dashboard written to dashboard.html');
