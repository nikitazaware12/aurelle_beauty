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
    <div class="group flex items-center gap-4">
      <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blush-100 text-blush-600 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-blush-500 group-hover:text-white">${icon(i, 'h-6 w-6')}</span>
      <div><p class="text-sm font-bold">${t}</p><p class="text-xs text-plum/60">${s}</p></div>
    </div>`).join('');

  /* ----- category bento ----- */
  const spans = ['lg:row-span-2', '', 'lg:col-span-2', '', '', ''];
  const grid = $('#cat-grid');
  grid.innerHTML = window.CATEGORIES.map((c, i) => `
    <a href="shop.html?cat=${c.id}" class="group relative block overflow-hidden rounded-[1.75rem] shadow-soft ${spans[i]}" data-reveal style="transition-delay:${i * 70}ms">
      <img src="${IMG + c.img}" alt="${c.name}" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110">
      <span class="absolute inset-0 bg-gradient-to-t from-plum/80 via-plum/10 to-transparent transition-opacity duration-500 group-hover:from-blush-700/85"></span>
      <span class="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
        <span><span class="block font-display text-xl font-semibold sm:text-2xl">${c.name}</span>
        <span class="mt-1 hidden max-w-[16rem] text-xs text-white/80 opacity-0 transition-all duration-500 group-hover:opacity-100 sm:block">${c.blurb}</span></span>
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-plum transition-all duration-500 group-hover:-rotate-45 group-hover:bg-blush-500 group-hover:text-white">${icon('arrow', 'h-5 w-5')}</span>
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
      <div class="flex h-[4.5rem] w-16 flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur sm:h-20 sm:w-[4.5rem]">
        <span class="font-display text-2xl font-bold tabular-nums sm:text-3xl">${String(v).padStart(2, '0')}</span>
        <span class="text-[10px] uppercase tracking-widest text-white/60">${l}</span>
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
    <figure class="card relative p-7" data-reveal style="transition-delay:${i * 100}ms">
      <span class="absolute right-6 top-4 font-display text-7xl leading-none text-blush-200">”</span>
      <div class="flex">${window.Aurelle.stars(5)}</div>
      <blockquote class="mt-4 text-[15px] leading-relaxed text-plum/80">${t}</blockquote>
      <figcaption class="mt-6 flex items-center gap-3 border-t border-plum/10 pt-5">
        <span class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blush-400 to-blush-600 font-bold text-white">${n[0]}</span>
        <span><span class="block text-sm font-bold">${n} · <span class="font-medium text-plum/60">${c}</span></span><span class="text-xs text-blush-600">Bought: ${p}</span></span>
      </figcaption>
    </figure>`).join('');

  /* ----- gallery ----- */
  const g = ['img-22.jpg', 'img-03.jpg', 'img-23.jpg', 'img-08.jpg', 'img-20.jpg', 'img-05.jpg'];
  $('#gallery').innerHTML = g.map((f, i) => `
    <a href="shop.html" class="group relative block aspect-square overflow-hidden rounded-3xl ${i % 2 ? 'sm:translate-y-6' : ''}" data-reveal style="transition-delay:${i * 60}ms">
      <img src="${IMG + f}" alt="Aurelle community photo" loading="lazy" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110">
      <span class="absolute inset-0 flex items-center justify-center bg-blush-600/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100"><span class="flex h-14 w-14 scale-50 items-center justify-center rounded-full bg-white text-blush-600 transition-transform duration-500 group-hover:scale-100">${icon('heart', 'h-6 w-6')}</span></span>
    </a>`).join('');
  observeReveal();
})();
