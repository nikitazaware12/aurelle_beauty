(function () {
  const { $, $$, icon, renderProducts, observeReveal, store, IMG } = window.Aurelle;

  /* ----- trust strip ----- */
  const trust = [
    ['truck', 'Free delivery', 'On orders above ₹999'],
    ['refresh', 'Easy returns', '15-day hassle-free policy'],
    ['shield', 'Secure payments', 'UPI, cards & COD'],
    ['leaf', 'Clean & cruelty-free', 'Dermatologist tested'],
  ];
  $('#trust').innerHTML = trust.map(([i, t, s]) => `
    <div class="flex items-center gap-3">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush-100 text-blush-600">${icon(i, 'h-4 w-4')}</span>
      <div class="leading-tight"><p class="text-[13px] font-medium">${t}</p><p class="hidden text-[11px] text-plum/55 sm:block">${s}</p></div>
    </div>`).join('');

  /* ----- category bento ----- */
  const spans = ['lg:row-span-2', '', 'lg:col-span-2', '', '', ''];
  const grid = $('#cat-grid');
  grid.innerHTML = window.CATEGORIES.map((c, i) => `
    <a href="shop.html?cat=${c.id}" class="group relative block overflow-hidden rounded-2xl ${spans[i]}" data-reveal style="transition-delay:${i * 70}ms">
      <img src="${IMG + c.img}" alt="${c.name}" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">
      <span class="absolute inset-0 bg-gradient-to-t from-plum/65 via-plum/5 to-transparent"></span>
      <span class="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 text-white sm:p-4">
        <span class="font-display text-base font-medium sm:text-lg">${c.name}</span>
        <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/90 text-plum transition-colors group-hover:bg-white">${icon('arrow', 'h-3.5 w-3.5')}</span>
      </span>
    </a>`).join('');

  /* ----- product tabs ----- */
  const tabs = [{ id: 'all', name: 'All' }, ...window.CATEGORIES];
  let current = 'all';
  const tabsEl = $('#tabs');
  function draw() {
    tabsEl.innerHTML = tabs.map((t) => `<button role="tab" class="chip shrink-0 ${t.id === current ? 'active' : ''}" data-tab="${t.id}" aria-selected="${t.id === current}">${t.name}</button>`).join('');
    const list = window.PRODUCTS
      .filter((p) => current === 'all' ? ['Best Seller', 'Trending', 'New'].includes(p.badge) : p.cat === current)
      .slice(0, 8);
    renderProducts('#home-products', list);
  }
  tabsEl.addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) { current = b.dataset.tab; draw(); } });
  draw();

  /* ----- countdown (3 days from first visit) ----- */
  let end = Number(store.get('aurelle_sale_end', 0));
  if (!end || end < Date.now()) { end = Date.now() + 3 * 24 * 3600 * 1000 + 5 * 3600 * 1000; store.set('aurelle_sale_end', end); }
  const cd = $('#countdown');
  function tick() {
    let s = Math.max(0, Math.floor((end - Date.now()) / 1000));
    const parts = [['Days', Math.floor(s / 86400)], ['Hours', Math.floor((s % 86400) / 3600)], ['Mins', Math.floor((s % 3600) / 60)], ['Secs', s % 60]];
    cd.innerHTML = parts.map(([l, v]) => `
      <div class="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-white sm:h-16 sm:w-16">
        <span class="font-display text-lg font-medium tabular-nums sm:text-xl">${String(v).padStart(2, '0')}</span>
        <span class="text-[9px] uppercase tracking-wider text-plum/55">${l}</span>
      </div>`).join('');
  }
  tick(); setInterval(tick, 1000);

  /* ----- reviews ----- */
  const reviews = [
    ['Priya S.', 'Mumbai', 'Vitamin C Glow Serum', 'Visible glow in just two weeks. Lightweight, no stickiness and the packaging feels so premium. Already on my third bottle!'],
    ['Ananya R.', 'Bengaluru', 'Velvet Rose Palette', 'The pigment is unreal and the shades blend beautifully. I get compliments every single time I wear it. Absolute must-have.'],
    ['Meera K.', 'Delhi', 'Himalayan Body Scrub', 'My skin has never been softer. The scent is so relaxing — it turns my shower into a mini spa. Delivery was super quick too.'],
  ];
  $('#reviews').innerHTML = reviews.map(([n, c, p, t], i) => `
    <figure class="card relative p-4 sm:p-5" data-reveal style="transition-delay:${i * 60}ms">
      <div class="flex">${window.Aurelle.stars(5)}</div>
      <blockquote class="mt-2 text-sm leading-relaxed text-plum/75">${t}</blockquote>
      <figcaption class="mt-3 flex items-center gap-3 border-t border-plum/[.07] pt-3">
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-blush-100 text-sm font-medium text-blush-700">${n[0]}</span>
        <span><span class="block text-sm font-medium">${n} · <span class="font-normal text-plum/55">${c}</span></span><span class="text-xs text-blush-600">Bought: ${p}</span></span>
      </figcaption>
    </figure>`).join('');

  /* ----- gallery ----- */
  const g = ['img-22.jpg', 'img-03.jpg', 'img-23.jpg', 'img-08.jpg', 'img-20.jpg', 'img-05.jpg'];
  $('#gallery').innerHTML = g.map((f, i) => `
    <a href="shop.html" class="group relative block aspect-square overflow-hidden rounded-xl" data-reveal style="transition-delay:${i * 60}ms">
      <img src="${IMG + f}" alt="Aurelle community photo" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">
    </a>`).join('');
  observeReveal();
})();


/* hero image: 3D tilt that follows the mouse (desktop pointers only) */
(function () {
  const art = document.getElementById('hero-art');
  const tilt = document.getElementById('hero-tilt');
  const card = document.getElementById('hero-card');
  if (!art || !tilt || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  art.addEventListener('mousemove', (e) => {
    const r = art.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
    card.style.translate = `${x * -14}px ${y * -10}px`;
  });
  art.addEventListener('mouseleave', () => {
    tilt.style.transform = '';
    card.style.translate = '';
  });
})();
