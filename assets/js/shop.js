(function () {
  const { $, $$, fmt, Wish, renderProducts, catName } = window.Aurelle;
  const params = new URLSearchParams(location.search);

  const state = {
    cat: params.get('cat') || 'all',
    q: params.get('q') || '',
    max: Number(params.get('max')) || 4000,
    rating: 0,
    sale: params.get('sale') === '1',
    wish: params.get('wish') === '1',
    sort: 'featured',
  };

  /* build static filter UI */
  const catsEl = $('#f-cats');
  function drawCats() {
    const all = [{ id: 'all', name: 'All products' }, ...window.CATEGORIES];
    catsEl.innerHTML = all.map((c) => {
      const n = c.id === 'all' ? window.PRODUCTS.length : window.PRODUCTS.filter((p) => p.cat === c.id).length;
      const on = state.cat === c.id;
      return `<button data-cat="${c.id}" class="group flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-300 hover:translate-x-1 hover:bg-blush-100 ${on ? 'bg-blush-500 !text-white hover:!bg-blush-500' : ''}">
        <span>${c.name}</span><span class="rounded-full px-2 py-0.5 text-xs ${on ? 'bg-white/25' : 'bg-plum/5 text-plum/60'}">${n}</span></button>`;
    }).join('');
  }
  const ratingEl = $('#f-rating');
  function drawRating() {
    ratingEl.innerHTML = [0, 4, 4.5, 4.8].map((r) => `<button class="chip !px-3 !py-1.5 !text-xs ${state.rating === r ? 'active' : ''}" data-rating="${r}">${r === 0 ? 'Any' : r + '★ & up'}</button>`).join('');
  }

  function apply() {
    let list = window.PRODUCTS.filter((p) => {
      if (state.cat !== 'all' && p.cat !== state.cat) return false;
      if (p.price > state.max) return false;
      if (p.rating < state.rating) return false;
      if (state.sale && !p.old) return false;
      if (state.wish && !Wish.has(p.id)) return false;
      if (state.q) {
        const hay = (p.name + ' ' + p.short + ' ' + p.desc + ' ' + catName(p.cat)).toLowerCase();
        if (!state.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });
    const s = state.sort;
    if (s === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (s === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (s === 'rating') list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    else if (s === 'popular') list.sort((a, b) => b.reviews - a.reviews);

    renderProducts('#shop-grid', list);
    $('#shop-empty').classList.toggle('hidden', list.length > 0);
    $('#shop-grid').classList.toggle('hidden', list.length === 0);
    $('#f-count').innerHTML = `Showing <b class="text-plum">${list.length}</b> of ${window.PRODUCTS.length} products`;

    /* heading */
    const cat = window.CATEGORIES.find((c) => c.id === state.cat);
    $('#shop-title').textContent = state.wish ? 'Your wishlist' : state.sale ? 'Sale picks' : cat ? cat.name : state.q ? `Results for “${state.q}”` : 'Shop all products';
    $('#shop-sub').textContent = cat ? cat.blurb : 'Clean, cruelty-free formulas for skin, hair, body and beyond.';
    document.title = $('#shop-title').textContent + ' — Aurelle Beauty';
    drawCats(); drawRating();
  }

  /* events */
  catsEl.addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (b) { state.cat = b.dataset.cat; apply(); closePanel(); } });
  ratingEl.addEventListener('click', (e) => { const b = e.target.closest('[data-rating]'); if (b) { state.rating = Number(b.dataset.rating); apply(); } });
  $('#f-price').addEventListener('input', (e) => { state.max = Number(e.target.value); $('#f-price-val').textContent = fmt(state.max); apply(); });
  $('#f-q').addEventListener('input', (e) => { state.q = e.target.value.trim(); apply(); });
  $('#f-sort').addEventListener('change', (e) => { state.sort = e.target.value; apply(); });
  $('#f-sale').addEventListener('change', (e) => { state.sale = e.target.checked; apply(); });
  $('#f-wish').addEventListener('change', (e) => { state.wish = e.target.checked; apply(); });
  const reset = () => {
    Object.assign(state, { cat: 'all', q: '', max: 4000, rating: 0, sale: false, wish: false, sort: 'featured' });
    $('#f-q').value = ''; $('#f-price').value = 4000; $('#f-price-val').textContent = fmt(4000);
    $('#f-sale').checked = false; $('#f-wish').checked = false; $('#f-sort').value = 'featured';
    apply();
  };
  $('#f-reset').onclick = $('#empty-reset').onclick = reset;
  document.addEventListener('wish:change', () => { if (state.wish) apply(); });

  /* mobile filter drawer */
  const wrap = $('#filter-wrap'), panel = $('#filter-panel'), bd = $('#filter-backdrop');
  function openPanel() { wrap.classList.remove('invisible'); requestAnimationFrame(() => { panel.classList.remove('-translate-x-full'); bd.classList.remove('opacity-0'); }); document.body.classList.add('overflow-hidden'); }
  function closePanel() {
    if (!window.matchMedia('(max-width:1023px)').matches) return;
    panel.classList.add('-translate-x-full'); bd.classList.add('opacity-0'); document.body.classList.remove('overflow-hidden');
    setTimeout(() => wrap.classList.add('invisible'), 400);
  }
  $('#open-filters').onclick = openPanel;
  $('#close-filters').onclick = bd.onclick = closePanel;

  /* initial UI sync */
  $('#f-price').value = state.max; $('#f-price-val').textContent = fmt(state.max);
  $('#f-q').value = state.q; $('#f-sale').checked = state.sale; $('#f-wish').checked = state.wish;
  apply();
})();
