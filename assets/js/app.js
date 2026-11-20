/* Aurelle – shared components: header, footer, cart, wishlist, toast, product cards */
(function () {
  const IMG = 'assets/img/';
  const FREE_SHIP = 999;
  const SHIPPING = 79;

  /* ---------- tiny helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
  const byId = (id) => window.PRODUCTS.find((p) => p.id === Number(id));
  const catName = (id) => (window.CATEGORIES.find((c) => c.id === id) || {}).name || id;

  /* localStorage with in-memory fallback (private mode etc.) */
  const mem = {};
  const store = {
    get(k, d) {
      try { const v = localStorage.getItem(k); return v === null ? (k in mem ? mem[k] : d) : JSON.parse(v); }
      catch (e) { return k in mem ? mem[k] : d; }
    },
    set(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };

  /* ---------- icons ---------- */
  const P = {
    search: 'M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z',
    heart: 'M21 8.25c0-2.5-2-4.5-4.5-4.5-1.74 0-3.25 1-4 2.45A4.5 4.5 0 007.5 3.75C5 3.75 3 5.75 3 8.25c0 6.5 9 12 9 12s9-5.5 9-12z',
    bag: 'M6 7h12l1 13H5L6 7zm3 0V6a3 3 0 016 0v1',
    menu: 'M4 7h16M4 12h16M4 17h16',
    close: 'M6 6l12 12M18 6L6 18',
    arrow: 'M5 12h14m-6-6l6 6-6 6',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
    check: 'M5 13l4 4L19 7',
    truck: 'M3 6h11v10H3zM14 9h4l3 3v4h-7M7 19a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z',
    leaf: 'M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19c3-5 6-8 10-10',
    shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zm-3 9l2 2 4-4',
    sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16z',
    mail: 'M3 6h18v12H3zM3 7l9 7 9-7',
    phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
    pin: 'M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zm0-8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
    chevron: 'M6 9l6 6 6-6',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z',
    gift: 'M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-2 0-4-1-4-3s3-2 4 3zm0 0c2 0 4-1 4-3s-3-2-4 3z',
    refresh: 'M4 12a8 8 0 0114-5.3L20 9M20 4v5h-5M20 12a8 8 0 01-14 5.3L4 15M4 20v-5h5',
    up: 'M12 19V5M5 12l7-7 7 7',
    tag: 'M3 12V4h8l10 10-8 8L3 12zm5-4h.01',
  };
  const icon = (name, cls = 'h-5 w-5', extra = '') =>
    `<svg class="${cls}" ${extra} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[name]}"/></svg>`;
  const waIcon = (cls = 'h-6 w-6') => `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 00-8.5 14.9L2 22l5.2-1.4A9.9 9.9 0 1012.04 2zm5.8 14.1c-.25.7-1.4 1.3-1.9 1.35-.5.05-1.1.2-3.6-.8-3-1.2-4.9-4.3-5.05-4.5-.15-.2-1.2-1.6-1.2-3s.75-2.1 1-2.4c.25-.3.55-.35.75-.35h.55c.2 0 .4 0 .6.45.2.5.75 1.8.8 1.95.05.15.1.3 0 .5-.1.2-.15.3-.3.5l-.45.5c-.15.15-.3.3-.15.6.15.3.7 1.15 1.5 1.85 1 .9 1.9 1.2 2.2 1.3.3.15.45.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.25.65-.15.25.1 1.6.75 1.9.9.3.15.45.2.55.3.1.2.1.8-.15 1.5z"/></svg>`;
  const star = (cls = 'h-4 w-4') =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.5 6 20.9l1.3-6.7-5-4.7 6.8-.8L12 2.5z"/></svg>`;
  const stars = (r) => {
    let out = '';
    for (let i = 1; i <= 5; i++) out += `<span class="${i <= Math.round(r) ? 'text-gold' : 'text-plum/15'}">${star()}</span>`;
    return `<span class="inline-flex" aria-label="${r} out of 5 stars">${out}</span>`;
  };

  /* ---------- cart ---------- */
  const Cart = {
    items() { return store.get('aurelle_cart', []); },
    save(items) { store.set('aurelle_cart', items); document.dispatchEvent(new CustomEvent('cart:change')); },
    add(id, qty = 1, opt = '') {
      const items = this.items();
      const key = id + '|' + opt;
      const f = items.find((i) => i.key === key);
      if (f) f.qty += qty; else items.push({ key, id: Number(id), opt, qty });
      this.save(items);
    },
    setQty(key, qty) {
      let items = this.items();
      items = items.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i));
      this.save(items);
    },
    remove(key) { this.save(this.items().filter((i) => i.key !== key)); },
    clear() { this.save([]); },
    count() { return this.items().reduce((s, i) => s + i.qty, 0); },
    subtotal() { return this.items().reduce((s, i) => s + (byId(i.id) ? byId(i.id).price * i.qty : 0), 0); },
    shipping(sub) { return sub === 0 || sub >= FREE_SHIP ? 0 : SHIPPING; },
  };

  const Wish = {
    list() { return store.get('aurelle_wish', []); },
    has(id) { return this.list().includes(Number(id)); },
    toggle(id) {
      id = Number(id);
      let l = this.list();
      const on = !l.includes(id);
      l = on ? [...l, id] : l.filter((x) => x !== id);
      store.set('aurelle_wish', l);
      document.dispatchEvent(new CustomEvent('wish:change'));
      return on;
    },
  };

  /* ---------- toast ---------- */
  function toast(msg, type = 'ok') {
    let wrap = $('#toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'toast-wrap';
      wrap.className = 'fixed bottom-24 right-4 z-[100] flex flex-col gap-3 sm:right-6';
      wrap.setAttribute('aria-live', 'polite');
      document.body.appendChild(wrap);
    }
    const t = document.createElement('div');
    t.className = 'animate-slide-up flex max-w-xs items-center gap-3 rounded-2xl bg-plum px-4 py-3 text-sm text-white shadow-lift';
    t.innerHTML = `<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${type === 'ok' ? 'bg-blush-500' : 'bg-gold'}">${icon(type === 'ok' ? 'check' : 'sparkle', 'h-4 w-4')}</span><span>${msg}</span>`;
    wrap.appendChild(t);
    setTimeout(() => { t.style.transition = 'all .4s'; t.style.opacity = '0'; t.style.transform = 'translateX(30px)'; setTimeout(() => t.remove(), 400); }, 2800);
  }

  /* ---------- product card ---------- */
  function productCard(p, i = 0) {
    const off = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
    const badgeColor = p.badge === 'Sale' ? 'bg-blush-600 text-white' : p.badge === 'New' ? 'bg-plum text-white' : 'bg-white text-plum';
    return `
    <article class="card group relative flex flex-col overflow-hidden" data-reveal style="transition-delay:${(i % 4) * 70}ms">
      <div class="relative aspect-[1/1] overflow-hidden bg-sand">
        <a href="product.html?id=${p.id}" class="block h-full w-full" aria-label="View ${p.name}">
          <img src="${IMG + p.img}" alt="${p.name}" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 ${p.img2 ? 'group-hover:opacity-0' : ''}">
          ${p.img2 ? `<img src="${IMG + p.img2}" alt="" loading="lazy" class="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100">` : ''}
          <span class="absolute inset-0 bg-gradient-to-t from-plum/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        </a>
        ${p.badge ? `<span class="absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider shadow-soft ${badgeColor}">${p.badge}${off && p.badge === 'Sale' ? ' −' + off + '%' : ''}</span>` : ''}
        <button class="wish-btn absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-plum shadow-soft backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-blush-500 hover:text-white" data-wish="${p.id}" aria-label="Add ${p.name} to wishlist">
          ${icon('heart', 'h-5 w-5')}
        </button>
        <a href="product.html?id=${p.id}" class="absolute inset-x-4 bottom-4 flex translate-y-6 items-center justify-center gap-2 rounded-full bg-white/95 py-2.5 text-sm font-semibold text-plum opacity-0 shadow-soft backdrop-blur transition-all duration-500 hover:bg-plum hover:text-white group-hover:translate-y-0 group-hover:opacity-100 max-lg:hidden">
          ${icon('eye', 'h-4 w-4')} Quick view
        </a>
      </div>
      <div class="flex flex-1 flex-col gap-2 p-4 sm:p-4">
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold uppercase tracking-widest text-blush-600">${catName(p.cat)}</span>
          <span class="flex items-center gap-1 text-plum/70">${star('h-3.5 w-3.5 text-gold')} ${p.rating} <span class="text-plum/40">(${p.reviews})</span></span>
        </div>
        <h3 class="font-display text-lg font-semibold leading-snug transition-colors group-hover:text-blush-600"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <p class="line-clamp-1 text-sm text-plum/60">${p.short}</p>
        <div class="mt-auto flex items-center justify-between pt-2">
          <div class="flex items-baseline gap-2">
            <span class="text-lg font-bold">${fmt(p.price)}</span>
            ${p.old ? `<span class="text-sm text-plum/40 line-through">${fmt(p.old)}</span>` : ''}
          </div>
          <button class="add-btn group/add flex h-11 items-center gap-1 overflow-hidden rounded-full bg-plum px-3.5 text-white transition-all duration-300 hover:bg-blush-500 hover:shadow-lift active:scale-95" data-add="${p.id}" aria-label="Add ${p.name} to cart">
            ${icon('bag', 'h-5 w-5 shrink-0')}
            <span class="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover/add:max-w-[3rem] group-hover/add:pl-1">Add</span>
          </button>
        </div>
      </div>
    </article>`;
  }

  function renderProducts(target, list) {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    el.innerHTML = list.map((p, i) => productCard(p, i)).join('');
    syncWishButtons();
    observeReveal();
  }

  function syncWishButtons() {
    $$('[data-wish]').forEach((b) => {
      const on = Wish.has(b.dataset.wish);
      b.classList.toggle('!bg-blush-500', on);
      b.classList.toggle('!text-white', on);
      const svg = $('svg', b);
      if (svg) svg.setAttribute('fill', on ? 'currentColor' : 'none');
    });
    const c = Wish.list().length;
    $$('[data-wish-count]').forEach((n) => { n.textContent = c; n.classList.toggle('hidden', c === 0); });
  }

  function syncCartBadge() {
    const c = Cart.count();
    $$('[data-cart-count]').forEach((n) => {
      n.textContent = c;
      n.classList.toggle('hidden', c === 0);
      n.classList.remove('animate-pop'); void n.offsetWidth; n.classList.add('animate-pop');
    });
  }

  /* global click handlers (event delegation) */
  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) {
      e.preventDefault();
      const p = byId(add.dataset.add);
      const opt = p && p.options ? p.options.values[0] : '';
      Cart.add(p.id, 1, opt);
      toast(`<b>${p.name}</b> added to your bag`);
      return;
    }
    const w = e.target.closest('[data-wish]');
    if (w) {
      e.preventDefault();
      const p = byId(w.dataset.wish);
      const on = Wish.toggle(w.dataset.wish);
      toast(on ? `Saved <b>${p.name}</b> to wishlist` : 'Removed from wishlist', on ? 'ok' : 'info');
    }
  });
  document.addEventListener('cart:change', syncCartBadge);
  document.addEventListener('wish:change', syncWishButtons);

  /* ---------- reveal on scroll ---------- */
  let io;
  function observeReveal() {
    const els = $$('[data-reveal]:not(.reveal)');
    if (!('IntersectionObserver' in window)) return;
    io = io || new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
  }

  /* ---------- header ---------- */
  const NAV = [
    ['Home', 'index.html'],
    ['Shop', 'shop.html'],
    ['Categories', 'categories.html'],
    ['About', 'about.html'],
    ['Contact', 'contact.html'],
  ];
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isActive = (href) => href === page || (page === 'product.html' && href === 'shop.html');

  function header() {
    const el = $('#site-header');
    if (!el) return;
    el.innerHTML = `
    <div class="overflow-hidden bg-plum text-xs text-white">
      <div class="flex w-max animate-marquee whitespace-nowrap py-1.5">
        ${Array(2).fill(`<span class="flex items-center gap-7 px-5">
          <span class="flex items-center gap-2">${icon('truck', 'h-4 w-4 text-blush-300')} Free shipping above ₹999</span>
          <span class="flex items-center gap-2">${icon('tag', 'h-4 w-4 text-blush-300')} Use code <b class="text-blush-300">AURELLE10</b> for 10% off</span>
          <span class="flex items-center gap-2">${icon('leaf', 'h-4 w-4 text-blush-300')} 100% cruelty-free formulas</span>
          <span class="flex items-center gap-2">${icon('refresh', 'h-4 w-4 text-blush-300')} 15-day easy returns</span>
          <span class="flex items-center gap-2">${icon('gift', 'h-4 w-4 text-blush-300')} Complimentary samples with every order</span>
        </span>`).join('')}
      </div>
    </div>
    <div id="navbar" class="sticky top-0 z-50 border-b border-transparent bg-cream/80 backdrop-blur-xl transition-all duration-300">
      <div class="container-x flex h-16 items-center justify-between gap-4">
        <a href="index.html" class="group flex items-center gap-2" aria-label="Aurelle home">
          <span class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blush-400 to-blush-600 text-white shadow-lg shadow-blush-500/30 transition-transform duration-500 group-hover:rotate-[360deg]">${icon('sparkle', 'h-5 w-5')}</span>
          <span class="font-display text-2xl font-bold tracking-tight">Aurelle<span class="text-blush-500">.</span></span>
        </a>
        <nav class="hidden items-center gap-9 lg:flex" aria-label="Main">
          ${NAV.map(([n, h]) => `<a href="${h}" class="link-u text-sm font-medium transition-colors hover:text-blush-600 ${isActive(h) ? 'active text-blush-600' : ''}">${n}</a>`).join('')}
        </nav>
        <div class="flex items-center gap-1">
          <button id="open-search" class="icon-btn" aria-label="Search">${icon('search')}</button>
          <a href="shop.html?wish=1" class="icon-btn" aria-label="Wishlist">${icon('heart')}<span data-wish-count class="absolute right-0.5 top-0.5 hidden h-[18px] min-w-[18px] items-center justify-center rounded-full bg-plum px-1 text-[10px] font-bold text-white [&:not(.hidden)]:flex">0</span></a>
          <a href="cart.html" class="icon-btn" aria-label="Cart">${icon('bag')}<span data-cart-count class="absolute right-0.5 top-0.5 hidden h-[18px] min-w-[18px] items-center justify-center rounded-full bg-blush-500 px-1 text-[10px] font-bold text-white [&:not(.hidden)]:flex">0</span></a>
          <a href="shop.html" class="btn btn-primary ml-2 hidden !py-2.5 md:inline-flex">Shop now</a>
          <button id="open-menu" class="icon-btn lg:hidden" aria-label="Open menu">${icon('menu', 'h-6 w-6')}</button>
        </div>
      </div>
    </div>

    <!-- mobile menu -->
    <div id="mobile-menu" class="invisible fixed inset-0 z-[60] lg:hidden" aria-hidden="true">
      <div id="menu-backdrop" class="absolute inset-0 bg-plum/50 opacity-0 backdrop-blur-sm transition-opacity duration-300"></div>
      <aside id="menu-panel" class="absolute right-0 top-0 flex h-full w-[82%] max-w-sm translate-x-full flex-col bg-cream p-6 shadow-2xl transition-transform duration-500">
        <div class="mb-8 flex items-center justify-between">
          <span class="font-display text-2xl font-bold">Aurelle<span class="text-blush-500">.</span></span>
          <button id="close-menu" class="icon-btn" aria-label="Close menu">${icon('close', 'h-6 w-6')}</button>
        </div>
        <nav class="flex flex-col gap-1" aria-label="Mobile">
          ${NAV.map(([n, h]) => `<a href="${h}" class="flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-medium transition-all hover:translate-x-1 hover:bg-blush-100 ${isActive(h) ? 'bg-blush-100 text-blush-600' : ''}">${n}${icon('arrow', 'h-4 w-4 opacity-40')}</a>`).join('')}
        </nav>
        <div class="mt-auto grid grid-cols-2 gap-3 pt-8">
          <a href="shop.html?wish=1" class="btn btn-outline">Wishlist</a>
          <a href="cart.html" class="btn btn-primary">My bag</a>
        </div>
      </aside>
    </div>

    <!-- search overlay -->
    <div id="search-overlay" class="invisible fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh] opacity-0 transition-all duration-300" aria-hidden="true">
      <div id="search-backdrop" class="absolute inset-0 bg-plum/60 backdrop-blur-md"></div>
      <div class="relative w-full max-w-2xl -translate-y-6 rounded-3xl bg-cream p-5 shadow-2xl transition-transform duration-300 sm:p-6" id="search-box">
        <form id="search-form" class="flex items-center gap-3 rounded-full border-2 border-blush-200 bg-white px-5 transition-all focus-within:border-blush-500 focus-within:shadow-glow">
          ${icon('search', 'h-5 w-5 text-blush-500')}
          <input id="search-input" type="search" autocomplete="off" placeholder="Search serums, lipsticks, perfumes…" class="w-full bg-transparent py-4 text-base outline-none placeholder:text-plum/40">
          <button type="button" id="close-search" class="icon-btn !h-9 !w-9" aria-label="Close search">${icon('close', 'h-5 w-5')}</button>
        </form>
        <div id="search-results" class="mt-4 max-h-[50vh] overflow-y-auto"></div>
      </div>
    </div>`;

    /* sticky shadow */
    const nb = $('#navbar');
    const onScroll = () => { nb.classList.toggle('shadow-soft', scrollY > 10); nb.classList.toggle('!border-plum/5', scrollY > 10); };
    onScroll(); addEventListener('scroll', onScroll, { passive: true });

    /* mobile menu */
    const menu = $('#mobile-menu'), panel = $('#menu-panel'), bd = $('#menu-backdrop');
    const toggleMenu = (open) => {
      menu.classList.toggle('invisible', !open);
      menu.setAttribute('aria-hidden', String(!open));
      requestAnimationFrame(() => { panel.classList.toggle('translate-x-full', !open); bd.classList.toggle('opacity-0', !open); });
      document.body.classList.toggle('overflow-hidden', open);
    };
    $('#open-menu').onclick = () => toggleMenu(true);
    $('#close-menu').onclick = bd.onclick = () => toggleMenu(false);

    /* search */
    const ov = $('#search-overlay'), box = $('#search-box'), input = $('#search-input'), res = $('#search-results');
    const openS = () => { ov.classList.remove('invisible', 'opacity-0'); box.classList.remove('-translate-y-6'); document.body.classList.add('overflow-hidden'); setTimeout(() => input.focus(), 80); suggest(''); };
    const closeS = () => { ov.classList.add('opacity-0'); box.classList.add('-translate-y-6'); document.body.classList.remove('overflow-hidden'); setTimeout(() => ov.classList.add('invisible'), 300); };
    $('#open-search').onclick = openS;
    $('#close-search').onclick = $('#search-backdrop').onclick = closeS;
    addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeS(); toggleMenu(false); } if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openS(); } });
    function suggest(q) {
      q = q.trim().toLowerCase();
      const list = q
        ? window.PRODUCTS.filter((p) => (p.name + ' ' + p.short + ' ' + catName(p.cat)).toLowerCase().includes(q)).slice(0, 6)
        : window.PRODUCTS.filter((p) => p.badge === 'Best Seller').slice(0, 5);
      res.innerHTML = `<p class="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-plum/50">${q ? 'Results' : 'Popular right now'}</p>` +
        (list.length ? list.map((p) => `
        <a href="product.html?id=${p.id}" class="group flex items-center gap-4 rounded-2xl p-2 transition-all hover:translate-x-1 hover:bg-blush-100">
          <img src="${IMG + p.img}" alt="" class="h-14 w-14 rounded-xl object-cover" loading="lazy">
          <span class="flex-1"><span class="block font-semibold leading-tight">${p.name}</span><span class="text-xs text-plum/60">${catName(p.cat)}</span></span>
          <span class="font-bold">${fmt(p.price)}</span>
        </a>`).join('') : '<p class="p-4 text-center text-sm text-plum/60">No products found. Try “serum” or “lipstick”.</p>');
    }
    input.addEventListener('input', () => suggest(input.value));
    $('#search-form').addEventListener('submit', (e) => { e.preventDefault(); const q = input.value.trim(); location.href = 'shop.html' + (q ? '?q=' + encodeURIComponent(q) : ''); });
  }

  /* ---------- footer ---------- */
  function footer() {
    const el = $('#site-footer');
    if (!el) return;
    el.innerHTML = `
    <section class="container-x">
      <div class="relative -mb-20 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blush-500 to-blush-700 p-8 text-white shadow-lift sm:p-8" data-reveal>
        <div class="absolute -right-16 -top-16 h-64 w-64 animate-blob bg-white/10"></div>
        <div class="absolute -bottom-20 left-10 h-48 w-48 animate-blob bg-white/10"></div>
        <div class="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 class="text-3xl font-semibold sm:text-4xl">Join the glow club</h2>
            <p class="mt-3 max-w-md text-white/85">Get 10% off your first order plus early access to launches, beauty tips and members-only offers.</p>
          </div>
          <form id="newsletter" class="flex flex-col gap-3 sm:flex-row">
            <input type="email" required placeholder="Enter your email address" aria-label="Email address" class="w-full flex-1 rounded-full border-2 border-white/30 bg-white/15 px-6 py-3.5 text-white outline-none backdrop-blur transition-all placeholder:text-white/70 focus:border-white focus:bg-white/25">
            <button class="btn btn-light whitespace-nowrap !py-3.5">Subscribe ${icon('arrow', 'h-4 w-4 arrow')}</button>
          </form>
        </div>
      </div>
    </section>
    <footer class="bg-plum-950 pt-28 text-white/75">
      <div class="container-x grid gap-7 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <a href="index.html" class="flex items-center gap-2"><span class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blush-400 to-blush-600 text-white">${icon('sparkle', 'h-5 w-5')}</span><span class="font-display text-2xl font-bold text-white">Aurelle<span class="text-blush-400">.</span></span></a>
          <p class="mt-4 max-w-xs text-sm leading-relaxed">Clean, cruelty-free beauty & personal care, crafted to make every day feel a little more luminous.</p>
          <div class="mt-5 flex gap-3">
            ${['Instagram', 'Facebook', 'YouTube', 'Pinterest'].map((s) => `<a href="#" aria-label="${s}" class="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xs font-bold transition-all duration-300 hover:-translate-y-1 hover:border-blush-500 hover:bg-blush-500 hover:text-white">${s[0]}</a>`).join('')}
          </div>
        </div>
        <div>
          <h4 class="mb-4 font-sans text-sm font-bold uppercase tracking-widest text-white">Shop</h4>
          <ul class="space-y-2.5 text-sm">
            ${window.CATEGORIES.map((c) => `<li><a href="shop.html?cat=${c.id}" class="inline-block transition-all hover:translate-x-1 hover:text-blush-300">${c.name}</a></li>`).join('')}
          </ul>
        </div>
        <div>
          <h4 class="mb-4 font-sans text-sm font-bold uppercase tracking-widest text-white">Company</h4>
          <ul class="space-y-2.5 text-sm">
            <li><a href="about.html" class="inline-block transition-all hover:translate-x-1 hover:text-blush-300">Our story</a></li>
            <li><a href="categories.html" class="inline-block transition-all hover:translate-x-1 hover:text-blush-300">All categories</a></li>
            <li><a href="contact.html" class="inline-block transition-all hover:translate-x-1 hover:text-blush-300">Contact us</a></li>
            <li><a href="contact.html#faq" class="inline-block transition-all hover:translate-x-1 hover:text-blush-300">FAQs</a></li>
            <li><a href="cart.html" class="inline-block transition-all hover:translate-x-1 hover:text-blush-300">My bag</a></li>
          </ul>
        </div>
        <div>
          <h4 class="mb-4 font-sans text-sm font-bold uppercase tracking-widest text-white">Get in touch</h4>
          <ul class="space-y-3 text-sm">
            <li class="flex gap-3">${icon('pin', 'h-5 w-5 shrink-0 text-blush-400')} 21 Rosewood Lane, Bandra West, Mumbai 400050</li>
            <li class="flex gap-3">${icon('phone', 'h-5 w-5 shrink-0 text-blush-400')} +91 98765 43210</li>
            <li class="flex gap-3">${icon('mail', 'h-5 w-5 shrink-0 text-blush-400')} hello@aurelle.com</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10">
        <div class="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs sm:flex-row">
          <p>© ${new Date().getFullYear()} Aurelle Beauty. All rights reserved.</p>
          <p class="flex items-center gap-4"><span>UPI</span><span>Visa</span><span>Mastercard</span><span>COD</span></p>
        </div>
      </div>
    </footer>
    <button id="to-top" class="fixed bottom-5 left-4 z-40 flex h-12 w-12 translate-y-20 items-center justify-center rounded-full bg-plum text-white opacity-0 shadow-lift transition-all duration-300 hover:bg-blush-500 sm:left-6" aria-label="Back to top">${icon('up')}</button>`;

    if (page !== 'product.html') {
      const wa = document.createElement('a');
      wa.id = 'wa-float';
      wa.href = 'https://wa.me/' + window.AURELLE_WA + '?text=' + encodeURIComponent('Hello Aurelle! I need help with...');
      wa.target = '_blank'; wa.rel = 'noopener';
      wa.setAttribute('aria-label', 'Chat on WhatsApp');
      wa.className = 'group fixed bottom-5 right-4 z-40 flex h-12 items-center gap-2 overflow-hidden rounded-full bg-[#25D366] px-3 text-white shadow-lift transition-all duration-300 hover:-translate-y-1 hover:bg-[#128C7E] sm:right-6';
      wa.innerHTML = waIcon('h-6 w-6 shrink-0') + '<span class="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[8rem] group-hover:pr-1">Chat with us</span>';
      document.body.appendChild(wa);
    }
    const top = $('#to-top');
    addEventListener('scroll', () => { const s = scrollY > 600; top.classList.toggle('translate-y-20', !s); top.classList.toggle('opacity-0', !s); }, { passive: true });
    top.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
    $('#newsletter').addEventListener('submit', (e) => { e.preventDefault(); e.target.reset(); toast('Welcome to the glow club! Check your inbox.'); });
  }

  /* ---------- init ---------- */
  function init() {
    header(); footer(); syncCartBadge(); syncWishButtons(); observeReveal();
  }
  window.Aurelle = { waIcon, $, $$, fmt, byId, catName, Cart, Wish, toast, icon, star, stars, productCard, renderProducts, syncWishButtons, observeReveal, FREE_SHIP, SHIPPING, IMG, store };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
