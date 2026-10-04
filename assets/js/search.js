/* ==========================================================================
   search.js — 角色圖鑑的搜尋與多重篩選
   篩選條件收在「篩選」按鈕之下，手機上不再一開頁就佔掉半個畫面。
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
    var toggle  = document.querySelector('[data-filter-toggle]');
    var panel   = document.getElementById('filter-panel');
    var badge   = document.querySelector('[data-filter-count]');
    var jump    = document.querySelector('[data-tier-jump]');
    if (!results) return;

    var state = { q: '', camp: null, group: null, arc: null };

    /* ---- 由資料抽出篩選選項，避免手動維護 ---- */
    function uniq(arr) { return arr.filter(function (v, i) { return v && arr.indexOf(v) === i; }); }
    var options = {
      camp:  uniq(chars.map(function (c) { return c.facets.camp; })),
      group: uniq(chars.map(function (c) { return c.facets.group; })),
      arc:   uniq([].concat.apply([], chars.map(function (c) { return c.facets.arcs || []; })))
    };

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

    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        var open = panel.hidden;
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    /* 分類快速跳轉 */
    if (jump) {
      jump.innerHTML = tiers.map(function (t) {
        var n = chars.filter(function (c) { return c.tier === t.id; }).length;
        return n ? '<a class="chip" href="#tier-' + esc(t.id) + '">' + esc(t.label) + '<b>' + n + '</b></a>' : '';
      }).join('');
    }

    function syncChips() {
      var active = 0;
      Object.keys(options).forEach(function (key) {
        if (state[key]) active++;
        var host = document.querySelector('[data-filter="' + key + '"]');
        if (!host) return;
        host.querySelectorAll('.chip').forEach(function (b) {
          b.setAttribute('aria-pressed', b.textContent === state[key] ? 'true' : 'false');
        });
      });
      if (badge) badge.textContent = active ? String(active) : '';
    }

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

    function cardHTML(c) {
      return '<a class="char-card" href="' + App.link(c.id) + '" style="--char-tint:' + esc(c.tint) + '">' +
        '<span class="char-card__media">' + App.avatar(c) + '</span>' +
        '<span class="char-card__body">' +
          '<span class="char-card__name">' + esc(c.name) + '</span>' +
          '<span class="char-card__ja ja">' + esc(c.nameJa) + '</span>' +
          '<p class="char-card__line">' + esc(c.tagline) + '</p>' +
        '</span></a>';
    }

    function render() {
      var hits = chars.filter(matches);
      var filtering = !!(state.q || state.camp || state.group || state.arc);
      if (countEl) {
        countEl.textContent = filtering
          ? '符合條件：' + hits.length + ' / ' + chars.length + ' 個角色'
          : '共 ' + chars.length + ' 個角色';
      }
      if (resetEl) resetEl.hidden = !filtering;
      if (jump) jump.hidden = filtering;

      if (!hits.length) {
        results.innerHTML =
          '<div class="empty-state">' +
            '<h3>搵唔到符合條件嘅角色</h3>' +
            '<p>試吓減少篩選條件，或者用日文原名搜尋（例如「ハチワレ」）。</p>' +
          '</div>';
        return;
      }

      /* 有篩選或搜尋時不分組，直接排一個網格；否則按層級分組 */
      if (filtering) {
        results.innerHTML = '<div class="grid grid--4">' + hits.map(cardHTML).join('') + '</div>';
        return;
      }

      results.innerHTML = tiers.map(function (t) {
        var group = hits.filter(function (c) { return c.tier === t.id; });
        if (!group.length) return '';
        return '<section class="tier" id="tier-' + esc(t.id) + '">' +
          '<div class="tier__head"><h2>' + esc(t.label) + '</h2><span>' + group.length + ' 個</span></div>' +
          '<p>' + esc(t.desc) + '</p>' +
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
