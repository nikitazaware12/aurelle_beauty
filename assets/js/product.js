(function () {
  const { $, $$, fmt, byId, catName, Cart, Wish, toast, icon, stars, renderProducts, IMG, observeReveal } = window.Aurelle;
  const id = Number(new URLSearchParams(location.search).get('id')) || 1;
  const p = byId(id) || window.PRODUCTS[0];

  document.title = `${p.name} — Aurelle Beauty`;
  $('#crumbs').innerHTML = `<a href="index.html" class="hover:text-blush-600">Home</a> / <a href="shop.html" class="hover:text-blush-600">Shop</a> / <a href="shop.html?cat=${p.cat}" class="hover:text-blush-600">${catName(p.cat)}</a> / <span class="text-plum">${p.name}</span>`;

  /* gallery: product images + a few lifestyle shots */
  const extra = { skincare: 'img-15.jpg', makeup: 'img-22.jpg', nails: 'img-24.jpg', hair: 'img-16.jpg', body: 'img-08.jpg', fragrance: 'img-03.jpg' }[p.cat];
  const gallery = [p.img, p.img2, extra].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
  const off = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
  const opts = p.options.values;
  let state = { img: gallery[0], opt: opts[0], qty: 1 };

  $('#product').innerHTML = `
  <div class="grid gap-7 lg:grid-cols-2 lg:gap-7">
    <!-- gallery -->
    <div class="lg:sticky lg:top-28 lg:self-start">
      <div class="grid gap-4 sm:grid-cols-[88px_1fr]">
        <div id="thumbs" class="order-2 flex gap-3 sm:order-1 sm:flex-col">
          ${gallery.map((g, i) => `<button data-img="${g}" class="thumb h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:border-blush-400 sm:h-[88px] sm:w-[88px] ${i === 0 ? 'border-blush-500 shadow-lift' : 'border-transparent opacity-70'}" aria-label="View image ${i + 1}"><img src="${IMG + g}" alt="" class="h-full w-full object-cover"></button>`).join('')}
        </div>
        <div id="zoom" class="group relative order-1 aspect-[4/5] cursor-zoom-in overflow-hidden rounded-[2rem] bg-sand shadow-soft sm:order-2">
          <img id="main-img" src="${IMG + gallery[0]}" alt="${p.name}" class="h-full w-full object-cover transition-transform duration-300 ease-out">
          ${p.badge ? `<span class="absolute left-4 top-4 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-soft">${p.badge}</span>` : ''}
          <span class="pointer-events-none absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">Hover to zoom</span>
        </div>
      </div>
    </div>

    <!-- info -->
    <div>
      <p class="text-xs font-semibold uppercase tracking-[.22em] text-blush-600">${catName(p.cat)}</p>
      <h1 class="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">${p.name}</h1>
      <div class="mt-4 flex flex-wrap items-center gap-3 text-sm">
        ${stars(p.rating)} <span class="font-semibold">${p.rating}</span> <a href="#details" class="text-plum/60 underline-offset-4 hover:text-blush-600 hover:underline">${p.reviews} reviews</a>
        <span class="hidden h-4 w-px bg-plum/20 sm:block"></span><span class="flex items-center gap-1 font-medium text-emerald-700">${icon('check', 'h-4 w-4')} In stock</span>
      </div>
      <div class="mt-6 flex items-baseline gap-3">
        <span class="text-4xl font-bold">${fmt(p.price)}</span>
        ${p.old ? `<span class="text-xl text-plum/40 line-through">${fmt(p.old)}</span><span class="rounded-full bg-blush-100 px-3 py-1 text-sm font-bold text-blush-700">Save ${off}%</span>` : ''}
      </div>
      <p class="mt-1 text-xs text-plum/50">Inclusive of all taxes</p>
      <p class="mt-6 leading-relaxed text-plum/75">${p.desc}</p>

      <div class="mt-8">
        <div class="mb-3 flex items-center justify-between"><h3 class="font-sans text-sm font-bold uppercase tracking-widest">${p.options.label}: <span id="opt-label" class="font-medium normal-case tracking-normal text-blush-600">${opts[0]}</span></h3></div>
        <div id="opts" class="flex flex-wrap gap-3">
          ${opts.map((o, i) => `<button class="chip ${i === 0 ? 'active' : ''}" data-opt="${o}" aria-pressed="${i === 0}">${o}</button>`).join('')}
        </div>
      </div>

      <div class="mt-8 flex flex-wrap items-center gap-4">
        <div class="flex items-center rounded-full border-2 border-plum/15 bg-white p-1">
          <button id="q-minus" class="flex h-11 w-11 items-center justify-center rounded-full transition-all hover:bg-blush-100 hover:text-blush-600 active:scale-90" aria-label="Decrease quantity">${icon('minus', 'h-4 w-4')}</button>
          <span id="qty" class="w-10 text-center text-lg font-bold tabular-nums" aria-live="polite">1</span>
          <button id="q-plus" class="flex h-11 w-11 items-center justify-center rounded-full transition-all hover:bg-blush-100 hover:text-blush-600 active:scale-90" aria-label="Increase quantity">${icon('plus', 'h-4 w-4')}</button>
        </div>
        <button id="add" class="btn btn-primary flex-1 !py-4 sm:flex-none sm:!px-10">${icon('bag', 'h-5 w-5')} Add to bag</button>
        <button id="wish" class="flex h-14 w-14 items-center justify-center rounded-full border-2 border-plum/15 bg-white transition-all duration-300 hover:scale-110 hover:border-blush-500 hover:bg-blush-500 hover:text-white" aria-label="Add to wishlist" data-wish="${p.id}">${icon('heart', 'h-6 w-6')}</button>
      </div>
      <button id="buy" class="btn btn-dark mt-4 w-full !py-4">Buy it now ${icon('arrow', 'h-4 w-4 arrow')}</button>

      <ul class="mt-8 grid gap-3 rounded-3xl bg-blush-50 p-5 text-sm sm:grid-cols-3">
        <li class="flex items-center gap-3">${icon('truck', 'h-6 w-6 text-blush-600')}<span>Free delivery<br><span class="text-xs text-plum/60">above ₹999</span></span></li>
        <li class="flex items-center gap-3">${icon('refresh', 'h-6 w-6 text-blush-600')}<span>15-day returns<br><span class="text-xs text-plum/60">no questions</span></span></li>
        <li class="flex items-center gap-3">${icon('shield', 'h-6 w-6 text-blush-600')}<span>100% authentic<br><span class="text-xs text-plum/60">dermat. tested</span></span></li>
      </ul>

      <!-- accordions -->
      <div id="details" class="mt-8 divide-y divide-plum/10 border-y border-plum/10">
        ${[
          ['Key benefits', `<ul class="grid gap-2 sm:grid-cols-2">${p.details.map((d) => `<li class="flex items-center gap-2">${icon('check', 'h-4 w-4 shrink-0 text-blush-500')}${d}</li>`).join('')}</ul>`],
          ['How to use', p.how],
          ['Shipping & returns', 'Orders ship within 24 hours and arrive in 2–5 business days across India. Unopened products can be returned within 15 days for a full refund.'],
        ].map(([t, c], i) => `
          <details class="group py-4" ${i === 0 ? 'open' : ''}>
            <summary class="flex cursor-pointer list-none items-center justify-between font-semibold transition-colors hover:text-blush-600 [&::-webkit-details-marker]:hidden">${t}<span class="transition-transform duration-300 group-open:rotate-180">${icon('chevron', 'h-5 w-5')}</span></summary>
            <div class="mt-3 text-sm leading-relaxed text-plum/70">${c}</div>
          </details>`).join('')}
      </div>
    </div>
  </div>

  <!-- mobile sticky bar -->
  <div id="sticky-bar" class="fixed inset-x-0 bottom-0 z-40 flex translate-y-full items-center justify-between gap-4 border-t border-plum/10 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur transition-transform duration-300 lg:hidden">
    <div><p class="line-clamp-1 text-sm font-semibold">${p.name}</p><p class="font-bold text-blush-600">${fmt(p.price)}</p></div>
    <button id="add2" class="btn btn-primary !py-3">Add to bag</button>
  </div>`;

  /* gallery interactions */
  const main = $('#main-img'), zoom = $('#zoom');
  $('#thumbs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-img]'); if (!b) return;
    main.style.opacity = '0';
    setTimeout(() => { main.src = IMG + b.dataset.img; main.style.opacity = '1'; }, 150);
    $$('.thumb').forEach((t) => { const on = t === b; t.classList.toggle('border-blush-500', on); t.classList.toggle('shadow-lift', on); t.classList.toggle('border-transparent', !on); t.classList.toggle('opacity-70', !on); });
  });
  zoom.addEventListener('mousemove', (e) => {
    const r = zoom.getBoundingClientRect();
    main.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    main.style.transform = 'scale(1.9)';
  });
  zoom.addEventListener('mouseleave', () => { main.style.transform = 'scale(1)'; });

  /* options + qty */
  $('#opts').addEventListener('click', (e) => {
    const b = e.target.closest('[data-opt]'); if (!b) return;
    state.opt = b.dataset.opt; $('#opt-label').textContent = state.opt;
    $$('#opts .chip').forEach((c) => { c.classList.toggle('active', c === b); c.setAttribute('aria-pressed', c === b); });
  });
  const setQty = (n) => { state.qty = Math.max(1, Math.min(10, n)); $('#qty').textContent = state.qty; };
  $('#q-minus').onclick = () => setQty(state.qty - 1);
  $('#q-plus').onclick = () => setQty(state.qty + 1);

  const add = () => { Cart.add(p.id, state.qty, state.opt); toast(`<b>${p.name}</b> (${state.opt}) × ${state.qty} added to bag`); };
  $('#add').onclick = $('#add2').onclick = add;
  $('#buy').onclick = () => { Cart.add(p.id, state.qty, state.opt); location.href = 'checkout.html'; };

  /* sticky mobile bar once main CTA is out of view */
  const bar = $('#sticky-bar');
  new IntersectionObserver(([en]) => bar.classList.toggle('translate-y-full', en.isIntersecting || en.boundingClientRect.top > 0), { threshold: 0 }).observe($('#add'));

  /* related */
  const related = window.PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id);
  const fill = window.PRODUCTS.filter((x) => x.cat !== p.cat && x.id !== p.id && (x.badge === 'Best Seller' || x.badge === 'Trending'));
  renderProducts('#related', [...related, ...fill].slice(0, 4));
  window.Aurelle.syncWishButtons();
  observeReveal();
})();
