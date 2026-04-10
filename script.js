/* ── Toast helper ── */
function showToast(msg, duration = 2400) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), duration);
}

/* ── Wishlist hearts ── */
document.querySelectorAll('.heart-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    btn.classList.toggle('liked');
    btn.textContent = btn.classList.contains('liked') ? '♥' : '♡';
    showToast(btn.classList.contains('liked')
      ? ' Added to wishlist!'
      : ' Removed from wishlist');
  });
});

/* ── Visit buttons ── */
document.querySelectorAll('.visit-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    showToast(` Opening ${btn.dataset.site}…`);
  });
});

/* ── Search / filter ── */
const searchInput = document.getElementById('searchInput');
const searchBtn   = document.getElementById('searchBtn');
const cards       = document.querySelectorAll('.product-card');
const noResults   = document.getElementById('noResults');

function filterCards() {
  const q = searchInput.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const match = !q || card.dataset.name.includes(q);
    card.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  noResults.style.display = visible === 0 ? 'block' : 'none';
}

searchBtn.addEventListener('click', () => {
  filterCards();
  if (searchInput.value.trim())
    showToast(` Comparing "${searchInput.value.trim()}"…`);
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') searchBtn.click();
});

searchInput.addEventListener('input', filterCards);

/* ── Sort buttons ── */
document.querySelectorAll('.sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.sort-btn.active').classList.remove('active');
    btn.classList.add('active');

    const grid  = document.getElementById('productsGrid');
    const items = [...cards].filter(c => c.style.display !== 'none');

    const sorters = {
      'price-asc':  (a, b) => +a.dataset.price  - +b.dataset.price,
      'price-desc': (a, b) => +b.dataset.price  - +a.dataset.price,
      'rating':     (a, b) => +b.dataset.rating - +a.dataset.rating,
      'default':    null
    };

    const fn = sorters[btn.dataset.sort];
    const sorted = fn ? items.sort(fn) : [...cards];

    sorted.forEach((card, i) => {
      card.style.animationDelay = `${i * 0.08}s`;
      card.style.animation = 'none';
      requestAnimationFrame(() => {
        card.style.animation = '';
        grid.appendChild(card);
      });
    });
    grid.appendChild(noResults);

    const labels = {
      'price-asc':  'Lowest price first',
      'price-desc': 'Highest price first',
      'rating':     'Top rated first',
      'default':    'Showing all'
    };
    showToast(` ${labels[btn.dataset.sort]}`);
  });
});

/* ── Card click highlight ── */
cards.forEach(card => {
  card.addEventListener('click', () => {
    cards.forEach(c => c.style.outline = '');
    card.style.outline = '2px solid #2563eb';
    card.style.outlineOffset = '3px';
    setTimeout(() => card.style.outline = '', 1200);
  });
});
