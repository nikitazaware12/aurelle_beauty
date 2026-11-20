(function () {
  const { $, $$, fmt, byId, catName, Cart, toast, icon, store, renderProducts, IMG, FREE_SHIP } = window.Aurelle;
  const root = $('#cart-root');
  const CODES = { AURELLE10: 0.1, GLOW20: 0.2 };

  const getPromo = () => store.get('aurelle_promo', '');
  function totals() {
    const sub = Cart.subtotal();
    const code = getPromo();
    const disc = CODES[code] ? Math.round(sub * CODES[code]) : 0;
    const ship = Cart.shipping(sub - disc > 0 ? sub : 0);
    return { sub, disc, ship, total: sub - disc + ship, code };
  }

  function draw() {
    const items = Cart.items().filter((i) => byId(i.id));
    if (!items.length) {
      root.innerHTML = `
      <div class="mx-auto max-w-lg rounded-[2rem] bg-white p-7 text-center shadow-soft" data-reveal>
        <div class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blush-100 text-blush-500">${icon('bag', 'h-12 w-12')}</div>
        <h2 class="mt-6 text-3xl font-semibold">Your bag is empty</h2>
        <p class="mt-3 text-plum/60">Looks like you haven’t added anything yet. Let’s find something you’ll love.</p>
        <a href="shop.html" class="btn btn-primary mt-8 !px-10">Start shopping ${icon('arrow', 'h-4 w-4 arrow')}</a>
      </div>`;
      window.Aurelle.observeReveal();
      return;
    }
    const t = totals();
    const pct = Math.min(100, (t.sub / FREE_SHIP) * 100);
    const left = FREE_SHIP - t.sub;

    root.innerHTML = `
    <div class="grid gap-8 lg:grid-cols-[1fr_380px] xl:gap-8">
      <div>
        <div class="mb-5 rounded-3xl bg-white p-5 shadow-soft">
          <p class="flex items-center gap-2 text-sm font-medium">${icon('truck', 'h-5 w-5 text-blush-600')}
            ${left > 0 ? `Add <b class="text-blush-600">${fmt(left)}</b> more for <b>free delivery</b>` : '<b class="text-emerald-700">You’ve unlocked free delivery! 🎉</b>'}</p>
          <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-blush-100"><div class="h-full rounded-full bg-gradient-to-r from-blush-400 to-blush-600 transition-all duration-700" style="width:${pct}%"></div></div>
        </div>

        <ul class="space-y-4">
          ${items.map((i) => {
            const p = byId(i.id);
            return `
            <li class="group flex gap-4 rounded-3xl bg-white p-4 shadow-soft transition-all duration-300 hover:shadow-lift sm:gap-4 sm:p-4" data-key="${i.key}">
              <a href="product.html?id=${p.id}" class="h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-sand sm:h-36 sm:w-32"><img src="${IMG + p.img}" alt="${p.name}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"></a>
              <div class="flex min-w-0 flex-1 flex-col">
                <div class="flex justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-xs font-semibold uppercase tracking-widest text-blush-600">${catName(p.cat)}</p>
                    <h3 class="mt-1 font-display text-lg font-semibold leading-snug sm:text-xl"><a href="product.html?id=${p.id}" class="hover:text-blush-600">${p.name}</a></h3>
                    ${i.opt ? `<p class="mt-1 text-sm text-plum/60">${p.options.label}: ${i.opt}</p>` : ''}
                  </div>
                  <button data-remove="${i.key}" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-plum/50 transition-all hover:rotate-12 hover:bg-blush-100 hover:text-blush-600" aria-label="Remove ${p.name}">${icon('trash', 'h-5 w-5')}</button>
                </div>
                <div class="mt-auto flex items-end justify-between pt-3">
                  <div class="flex items-center rounded-full border-2 border-plum/10 bg-cream p-0.5">
                    <button data-dec="${i.key}" class="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-white hover:text-blush-600 active:scale-90" aria-label="Decrease">${icon('minus', 'h-4 w-4')}</button>
                    <span class="w-8 text-center font-bold tabular-nums">${i.qty}</span>
                    <button data-inc="${i.key}" class="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-white hover:text-blush-600 active:scale-90" aria-label="Increase">${icon('plus', 'h-4 w-4')}</button>
                  </div>
                  <div class="text-right"><p class="text-lg font-bold">${fmt(p.price * i.qty)}</p>${i.qty > 1 ? `<p class="text-xs text-plum/50">${fmt(p.price)} each</p>` : ''}</div>
                </div>
              </div>
            </li>`;
          }).join('')}
        </ul>

        <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
          <a href="shop.html" class="link-u text-sm font-semibold">← Continue shopping</a>
          <button id="clear" class="text-sm font-medium text-plum/60 transition-colors hover:text-blush-600">Clear bag</button>
        </div>
      </div>

      <aside class="h-fit rounded-[2rem] bg-white p-6 shadow-soft sm:p-8 lg:sticky lg:top-28">
        <h2 class="text-2xl font-semibold">Order summary</h2>
        <form id="promo" class="mt-5 flex gap-2">
          <input id="promo-input" class="field !rounded-full uppercase" placeholder="Promo code" value="${t.code}" aria-label="Promo code">
          <button class="btn btn-dark !px-5">Apply</button>
        </form>
        <p class="mt-2 text-xs text-plum/50">Try <b>AURELLE10</b> for 10% off</p>
        <dl class="mt-6 space-y-3 text-sm">
          <div class="flex justify-between"><dt class="text-plum/70">Subtotal</dt><dd class="font-semibold">${fmt(t.sub)}</dd></div>
          ${t.disc ? `<div class="flex justify-between text-emerald-700"><dt>Discount (${t.code})</dt><dd class="font-semibold">−${fmt(t.disc)}</dd></div>` : ''}
          <div class="flex justify-between"><dt class="text-plum/70">Shipping</dt><dd class="font-semibold">${t.ship ? fmt(t.ship) : '<span class="text-emerald-700">Free</span>'}</dd></div>
          <div class="flex justify-between border-t border-plum/10 pt-4 text-lg"><dt class="font-bold">Total</dt><dd class="font-display text-2xl font-bold">${fmt(t.total)}</dd></div>
        </dl>
        <a href="checkout.html" class="btn btn-primary mt-6 w-full !py-4">Proceed to checkout ${icon('arrow', 'h-4 w-4 arrow')}</a>
        <p class="mt-4 flex items-center justify-center gap-2 text-xs text-plum/55">${icon('shield', 'h-4 w-4')} Secure checkout · 15-day returns</p>
      </aside>
    </div>`;
  }

  root.addEventListener('click', (e) => {
    const g = (a) => e.target.closest(`[${a}]`);
    let el;
    if ((el = g('data-inc'))) { const i = Cart.items().find((x) => x.key === el.dataset.inc); Cart.setQty(i.key, i.qty + 1); }
    else if ((el = g('data-dec'))) { const i = Cart.items().find((x) => x.key === el.dataset.dec); if (i.qty > 1) Cart.setQty(i.key, i.qty - 1); }
    else if ((el = g('data-remove'))) {
      const row = el.closest('li'); row.style.transition = 'all .4s'; row.style.opacity = '0'; row.style.transform = 'translateX(40px)';
      setTimeout(() => { Cart.remove(el.dataset.remove); toast('Item removed from bag', 'info'); }, 350);
    } else if (e.target.closest('#clear')) { Cart.clear(); }
  });
  root.addEventListener('submit', (e) => {
    if (e.target.id !== 'promo') return;
    e.preventDefault();
    const c = $('#promo-input').value.trim().toUpperCase();
    if (!c) { store.set('aurelle_promo', ''); draw(); return; }
    if (CODES[c]) { store.set('aurelle_promo', c); toast(`Code <b>${c}</b> applied!`); draw(); }
    else toast('That code isn’t valid', 'info');
  });

  document.addEventListener('cart:change', draw);
  draw();

  const inBag = Cart.items().map((i) => i.id);
  renderProducts('#cart-rec', window.PRODUCTS.filter((p) => !inBag.includes(p.id) && (p.badge === 'Best Seller' || p.badge === 'Trending' || p.price < 500)).slice(0, 4));
})();
