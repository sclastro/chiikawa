/* ==========================================================================
   search.js — 角色圖鑑的搜尋與多重篩選
   ========================================================================== */
(function () {
  'use strict';

  document.addEventListener('app:ready', function () {
    var esc = App.esc;
    var chars = window.CHIIKAWA_CHARACTERS || [];
    var tiers = window.CHIIKAWA_TIERS || [];

    var input   = document.getElementById('char-search');
    var results = document.querySelector('[data-results]');
    var countEl = document.querySelector('[data-count]');
    var resetEl = document.querySelector('[data-reset]');
    if (!results) return;

    /* 目前的篩選狀態 */
    var state = { q: '', camp: null, group: null, arc: null };

    /* ---- 由資料抽出篩選選項，避免手動維護 ---- */
    function uniq(arr) { return arr.filter(function (v, i) { return v && arr.indexOf(v) === i; }); }
    var options = {
      camp:  uniq(chars.map(function (c) { return c.facets.camp; })),
      group: uniq(chars.map(function (c) { return c.facets.group; })),
      arc:   uniq([].concat.apply([], chars.map(function (c) { return c.facets.arcs || []; })))
    };

    /* ---- 建立 chip ---- */
    Object.keys(options).forEach(function (key) {
      var host = document.querySelector('[data-filter="' + key + '"]');
      if (!host) return;
      options[key].forEach(function (val) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip';
        b.textContent = val;
        b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () {
          state[key] = (state[key] === val) ? null : val;
          syncChips();
          render();
        });
        host.appendChild(b);
      });
    });

    function syncChips() {
      Object.keys(options).forEach(function (key) {
        var host = document.querySelector('[data-filter="' + key + '"]');
        if (!host) return;
        host.querySelectorAll('.chip').forEach(function (b) {
          b.setAttribute('aria-pressed', b.textContent === state[key] ? 'true' : 'false');
        });
      });
    }

    /* ---- 比對 ---- */
    function matches(c) {
      if (state.camp && c.facets.camp !== state.camp) return false;
      if (state.group && c.facets.group !== state.group) return false;
      if (state.arc && (c.facets.arcs || []).indexOf(state.arc) === -1) return false;
      if (!state.q) return true;
      var hay = [
        c.name, c.nameJa, c.tagline, c.tierLabel,
        c.facets.camp, c.facets.temperament, c.facets.group,
        (c.facets.arcs || []).join(' '),
        (c.profile || []).map(function (p) { return p.value; }).join(' ')
      ].join(' ').toLowerCase();
      return hay.indexOf(state.q) !== -1;
    }

    /* ---- 繪製 ---- */
    function cardHTML(c) {
      return '<a class="char-card" href="' + App.link(c.id) + '" style="--char-tint:' + esc(c.tint) + '">' +
        '<span class="char-card__media">' + App.avatar(c) + '</span>' +
        '<span class="char-card__body">' +
          '<span class="char-card__name">' + esc(c.name) + '</span>' +
          '<span class="char-card__ja ja">' + esc(c.nameJa) + '</span>' +
          '<p class="char-card__line">' + esc(c.tagline) + '</p>' +
          '<span class="tag-row" style="margin-top:auto;padding-top:var(--s-3)">' +
            '<span class="tag">' + esc(c.facets.camp) + '</span>' +
            '<span class="tag tag--accent">' + esc(c.facets.temperament) + '</span>' +
          '</span>' +
        '</span></a>';
    }

    function render() {
      var hits = chars.filter(matches);
      if (countEl) {
        countEl.textContent = hits.length === chars.length
          ? '共 ' + chars.length + ' 個角色'
          : '符合條件：' + hits.length + ' / ' + chars.length + ' 個角色';
      }

      if (!hits.length) {
        results.innerHTML =
          '<div class="empty-state">' +
            '<h3>搵唔到符合條件嘅角色</h3>' +
            '<p>試吓減少篩選條件，或者用日文原名搜尋（例如「ハチワレ」）。</p>' +
            '<p><button class="btn btn--ghost" type="button" data-reset-inner>清除所有條件</button></p>' +
          '</div>';
        var inner = results.querySelector('[data-reset-inner]');
        if (inner) inner.addEventListener('click', reset);
        return;
      }

      /* 有篩選或搜尋時不分組，直接排一個網格；否則按層級分組 */
      var filtering = state.q || state.camp || state.group || state.arc;
      if (filtering) {
        results.innerHTML = '<div class="grid grid--4">' + hits.map(cardHTML).join('') + '</div>';
        return;
      }

      results.innerHTML = tiers.map(function (t) {
        var group = hits.filter(function (c) { return c.tier === t.id; });
        if (!group.length) return '';
        return '<section style="margin-bottom:var(--s-8)">' +
          '<div class="section-head" style="margin-bottom:var(--s-4)">' +
            '<h2>' + esc(t.label) + '<span style="font-size:var(--t-small);color:var(--c-ink-soft);font-weight:400;margin-left:var(--s-3)">' + group.length + ' 個</span></h2>' +
            '<p>' + esc(t.desc) + '</p>' +
          '</div>' +
          '<div class="grid grid--4">' + group.map(cardHTML).join('') + '</div>' +
        '</section>';
      }).join('');
    }

    function reset() {
      state = { q: '', camp: null, group: null, arc: null };
      if (input) input.value = '';
      syncChips();
      render();
      if (input) input.focus();
    }

    if (input) {
      input.addEventListener('input', function () {
        state.q = input.value.trim().toLowerCase();
        render();
      });
    }
    if (resetEl) resetEl.addEventListener('click', reset);

    render();
  });
})();
