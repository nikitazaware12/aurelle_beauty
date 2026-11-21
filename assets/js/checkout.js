(function () {
  const U = window.Aurelle.Auth.user();
  if (!U) { location.replace('login.html?next=checkout.html'); return; }
  const { $, $$, fmt, byId, Cart, icon, store, IMG } = window.Aurelle;
  const root = $('#checkout-root');
  const CODES = { AURELLE10: 0.1, GLOW20: 0.2 };

  function totals() {
    const sub = Cart.subtotal();
    const code = store.get('aurelle_promo', '');
    const disc = CODES[code] ? Math.round(sub * CODES[code]) : 0;
    const ship = Cart.shipping(sub);
    return { sub, disc, ship, code, total: sub - disc + ship };
  }

  function draw() {
    const items = Cart.items().filter((i) => byId(i.id));
    if (!items.length) {
      root.innerHTML = `<div class="mx-auto max-w-lg rounded-2xl bg-white p-5 text-center shadow-soft"><h2 class="text-2xl font-medium">Nothing to check out</h2><p class="mt-3 text-plum/60">Your bag is empty.</p><a href="shop.html" class="btn btn-primary mt-6">Go shopping</a></div>`;
      return;
    }
    const t = totals();
    root.innerHTML = `
    <form id="co" class="grid gap-6 lg:grid-cols-[1fr_400px] xl:gap-6" novalidate>
      <div class="space-y-4">
        <fieldset class="rounded-2xl border border-plum/[.06] bg-white p-4 sm:p-5">
          <legend class="sr-only">Contact</legend>
          <h2 class="mb-5 flex items-center gap-3 text-xl font-medium"><span class="flex h-8 w-8 items-center justify-center rounded-full bg-blush-500 font-sans text-sm text-white">1</span> Contact details</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block text-sm font-medium">Full name<input name="name" required class="field mt-1.5" placeholder="Your name" autocomplete="name"></label>
            <label class="block text-sm font-medium">Phone<input name="phone" required pattern="[0-9+ ]{10,14}" class="field mt-1.5" placeholder="+91 98765 43210" autocomplete="tel"></label>
            <label class="block text-sm font-medium sm:col-span-2">Email<input name="email" type="email" required class="field mt-1.5" placeholder="you@email.com" autocomplete="email"></label>
          </div>
        </fieldset>

        <fieldset class="rounded-2xl border border-plum/[.06] bg-white p-4 sm:p-5">
          <legend class="sr-only">Shipping</legend>
          <h2 class="mb-5 flex items-center gap-3 text-xl font-medium"><span class="flex h-8 w-8 items-center justify-center rounded-full bg-blush-500 font-sans text-sm text-white">2</span> Shipping address</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block text-sm font-medium sm:col-span-2">Address<input name="address" required class="field mt-1.5" placeholder="House no., street, area" autocomplete="street-address"></label>
            <label class="block text-sm font-medium">City<input name="city" required class="field mt-1.5" autocomplete="address-level2"></label>
            <label class="block text-sm font-medium">State<input name="state" required class="field mt-1.5" autocomplete="address-level1"></label>
            <label class="block text-sm font-medium">PIN code<input name="pin" required pattern="[0-9]{6}" class="field mt-1.5" placeholder="400050" autocomplete="postal-code"></label>
          </div>
        </fieldset>

        <fieldset class="rounded-2xl border border-plum/[.06] bg-white p-4 sm:p-5">
          <legend class="sr-only">Payment</legend>
          <h2 class="mb-5 flex items-center gap-3 text-xl font-medium"><span class="flex h-8 w-8 items-center justify-center rounded-full bg-blush-500 font-sans text-sm text-white">3</span> Payment method</h2>
          <div class="grid gap-3 sm:grid-cols-3">
            ${[['upi', 'UPI', 'GPay, PhonePe, Paytm'], ['card', 'Card', 'Credit / debit'], ['cod', 'Cash on delivery', '+ ₹40 handling']].map(([v, n, s], i) => `
            <label class="group relative block cursor-pointer">
              <input type="radio" name="pay" value="${v}" class="peer sr-only" ${i === 0 ? 'checked' : ''}>
              <span class="block rounded-xl border border-plum/15 p-3 transition-colors duration-200 hover:border-blush-300 peer-checked:border-blush-500 peer-checked:bg-blush-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-blush-500">
                <span class="block font-semibold">${n}</span><span class="text-xs text-plum/60">${s}</span>
              </span>
            </label>`).join('')}
          </div>
          <p class="mt-4 text-xs text-plum/50">This is a demo store — no real payment is taken.</p>
        </fieldset>
      </div>

      <aside class="h-fit rounded-2xl border border-plum/[.06] bg-white p-4 sm:p-5 lg:sticky lg:top-28">
        <h2 class="text-xl font-medium">Your order</h2>
        <ul class="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1">
          ${items.map((i) => { const p = byId(i.id); return `
          <li class="flex items-center gap-4">
            <span class="relative"><img src="${IMG + p.img}" alt="" class="h-16 w-14 rounded-xl object-cover"><span class="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-plum px-1 text-[11px] font-semibold text-white">${i.qty}</span></span>
            <span class="flex-1 text-sm"><span class="block font-semibold leading-tight">${p.name}</span><span class="text-xs text-plum/60">${i.opt}</span></span>
            <span class="text-sm font-semibold">${fmt(p.price * i.qty)}</span>
          </li>`; }).join('')}
        </ul>
        <dl class="mt-6 space-y-3 border-t border-plum/10 pt-6 text-sm">
          <div class="flex justify-between"><dt class="text-plum/70">Subtotal</dt><dd class="font-semibold">${fmt(t.sub)}</dd></div>
          ${t.disc ? `<div class="flex justify-between text-emerald-700"><dt>Discount (${t.code})</dt><dd class="font-semibold">−${fmt(t.disc)}</dd></div>` : ''}
          <div class="flex justify-between"><dt class="text-plum/70">Shipping</dt><dd class="font-semibold">${t.ship ? fmt(t.ship) : '<span class="text-emerald-700">Free</span>'}</dd></div>
          <div class="flex justify-between border-t border-plum/10 pt-4 text-lg"><dt class="font-semibold">Total</dt><dd id="grand" class="font-display text-xl font-semibold">${fmt(t.total)}</dd></div>
        </dl>
        <button class="btn btn-primary mt-6 w-full !py-2.5" type="submit">${icon('shield', 'h-5 w-5')} Place order</button>
        <a href="cart.html" class="mt-4 block text-center text-sm font-semibold link-u w-fit mx-auto">← Edit bag</a>
      </aside>
    </form>`;

    const form = $('#co');
    /* COD handling fee */
    form.addEventListener('change', () => {
      const cod = form.elements.pay.value === 'cod';
      $('#grand').textContent = fmt(t.total + (cod ? 40 : 0));
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true, first = null;
      $$('input[required]', form).forEach((inp) => {
        const bad = !inp.checkValidity();
        inp.classList.toggle('!border-blush-600', bad);
        inp.classList.toggle('bg-blush-50', bad);
        if (bad && !first) first = inp;
        ok = ok && !bad;
      });
      if (!ok) { first.focus(); first.scrollIntoView({ behavior: 'smooth', block: 'center' }); window.Aurelle.toast('Please fill in the highlighted fields', 'info'); return; }
      const id = 'AUR' + Math.floor(100000 + Math.random() * 900000);
      $('#s-name').textContent = form.elements.name.value.split(' ')[0];
      $('#s-id').textContent = '#' + id;
      Cart.clear(); store.set('aurelle_promo', '');
      const m = $('#success'), box = $('#success-box');
      m.classList.remove('invisible', 'opacity-0'); requestAnimationFrame(() => box.classList.remove('scale-90'));
      document.body.classList.add('overflow-hidden');
    });
    form.addEventListener('input', (e) => { if (e.target.classList) e.target.classList.remove('!border-blush-600', 'bg-blush-50'); });
  }
  draw();
  const fe = document.getElementById('co');
  if (fe) { if (fe.elements.name) fe.elements.name.value = U.name; if (fe.elements.email) fe.elements.email.value = U.email; }

})();
