/* ==========================================================================
   character.js — 角色詳情頁，由 ?id= 讀取資料渲染
   結構：精簡頁首 → 釘頂分頁（檔案／性格／名場面／關係／參照）→ 角色切換帶
   ========================================================================== */
(function () {
  'use strict';

  document.addEventListener('app:ready', function () {
    var esc  = App.esc;
    var main = document.querySelector('[data-char-page]');
    if (!main) return;

    var list = window.CHIIKAWA_CHARACTERS || [];
    var id   = App.param('id') || 'chiikawa';
    var c    = App.char(id);

    if (!c) {
      main.innerHTML =
        '<section class="section"><div class="wrap wrap--text">' +
          '<div class="empty-state">' +
            '<h1>搵唔到呢個角色</h1>' +
            '<p>網址中的 <code>id</code> 參數無法對應任何角色。可能是連結打錯，或者該角色尚未收錄。</p>' +
            '<p><a class="btn btn--primary" href="characters.html">返回角色圖鑑</a></p>' +
          '</div>' +
        '</div></section>';
      document.title = '搵唔到角色 — 吉伊卡哇圖鑑';
      return;
    }

    document.title = c.name + '（' + c.nameJa + '）— 吉伊卡哇圖鑑';
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', c.name + '（' + c.nameJa + '）：' + c.tagline);

    var idx  = list.indexOf(c);
    var prev = list[(idx - 1 + list.length) % list.length];
    var next = list[(idx + 1) % list.length];
    var domains = window.CHIIKAWA_DOMAINS || {};
    var chev = App.icon('chev', 16);

    function panel(pid, inner, first) {
      return '<section class="tabpanel" role="tabpanel" id="' + pid + '" aria-labelledby="tab-' + pid + '" tabindex="-1"' +
        (first ? '' : ' hidden') + '>' + inner + '</section>';
    }

    /* ---- 頁首 ---- */
    var html =
      '<section class="char-hero" style="--char-tint:' + esc(c.tint) + '">' +
        '<div class="wrap">' +
          '<p class="crumbs"><a href="index.html">首頁</a><span aria-hidden="true">／</span>' +
            '<a href="characters.html">角色圖鑑</a><span aria-hidden="true">／</span>' + esc(c.name) + '</p>' +
          '<div class="char-hero__inner">' +
            '<div class="char-hero__portrait">' + App.avatar(c) + '</div>' +
            '<div>' +
              '<span class="eyebrow">' + esc(c.tierLabel) + '</span>' +
              '<h1>' + esc(c.name) + '</h1>' +
              '<p class="char-hero__ja ja">' + esc(c.nameJa) + '</p>' +
            '</div>' +
            '<p class="char-hero__tagline">' + esc(c.tagline) + '</p>' +
            '<div class="tag-row">' +
              '<span class="tag tag--tint" style="--tag-tint:' + esc(c.tint) + '">' + esc(c.facets.camp) + '</span>' +
              '<span class="tag tag--tint" style="--tag-tint:' + esc(c.tint) + '">' + esc(c.facets.temperament) + '</span>' +
              (c.facets.arcs || []).map(function (a) { return '<span class="tag">' + esc(a) + '</span>'; }).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>';

    html += App.tabbarHTML([
      { id: 'profile',     label: '檔案' },
      { id: 'personality', label: '性格' },
      { id: 'scenes',      label: '名場面', count: (c.scenes || []).length },
      { id: 'relations',   label: '關係',   count: (c.relations || []).length },
      { id: 'reference',   label: '參照',   count: (c.reference || []).length }
    ], c.name + '的資料分頁');

    html += '<div class="wrap" style="--char-tint:' + esc(c.tint) + '">';

    /* ---- 基本檔案 ---- */
    html += panel('profile',
      '<div class="card tape profile-card" style="--tape:' + esc(c.tint) + '"><dl class="datalist">' +
        (c.profile || []).map(function (p) {
          return '<div><dt>' + esc(p.label) + '</dt><dd>' + esc(p.value) + '</dd></div>';
        }).join('') +
      '</dl></div>', true);

    /* ---- 性格深度剖析 ---- */
    html += panel('personality',
      '<div>' +
        (c.traits || []).map(function (t, i) {
          return '<div class="trait"><h3><span>' + (i < 9 ? '0' : '') + (i + 1) + '</span>' + esc(t.title) + '</h3>' +
            '<p>' + esc(t.body) + '</p></div>';
        }).join('') +
      '</div>' +
      '<div class="psyche">' +
        '<div class="psyche__item"><h4>恐懼</h4><p>' + esc(c.psyche.fear) + '</p></div>' +
        '<div class="psyche__item"><h4>渴望</h4><p>' + esc(c.psyche.desire) + '</p></div>' +
        '<div class="psyche__item"><h4>內在矛盾</h4><p>' + esc(c.psyche.conflict) + '</p></div>' +
      '</div>');

    /* ---- 名場面：先看標題，點開才讀全文 ---- */
    html += panel('scenes',
      '<div class="acc-list" style="max-width:820px">' +
        (c.scenes || []).map(function (s, i) {
          return '<details class="acc"' + (i === 0 ? ' open' : '') + '>' +
            '<summary><span class="acc__lead" style="--acc-tint:' + esc(c.tint) + '">' + (i + 1) + '</span>' +
              '<span><span class="acc__kicker">' + esc(s.arc) + '</span>' +
              '<span class="acc__title">' + esc(s.title) + '</span>' +
              '<span class="acc__sub ja">' + esc(s.titleJa) + '</span></span>' +
              '<span class="acc__chev">' + chev + '</span></summary>' +
            '<div class="acc__body">' +
              '<p>' + esc(s.body) + '</p>' +
              '<p class="callout"><strong>點解呢一幕重要</strong>' + esc(s.why) + '</p>' +
            '</div></details>';
        }).join('') +
      '</div>');

    /* ---- 關係 ---- */
    html += panel('relations',
      '<div class="rel-list rel-list--2">' +
        (c.relations || []).map(function (r) {
          var o = App.char(r.id);
          if (!o) return '';
          return '<a class="rel-item" href="' + App.link(o.id) + '">' +
            App.face(o, 48) +
            '<span><span class="rel-item__name">' + esc(o.name) +
              '<span class="rel-item__type">' + esc(r.type) + '</span></span>' +
              '<p>' + esc(r.body) + '</p></span></a>';
        }).join('') +
      '</div>' +
      '<p style="margin-top:var(--s-5)"><a class="btn btn--ghost" href="relations.html?focus=' +
        encodeURIComponent(c.id) + '">在關係圖中查看' + esc(c.name) + '</a></p>');

    /* ---- 可以參照甚麼 ---- */
    html += panel('reference',
      '<p class="lede" style="max-width:var(--w-text);margin-bottom:var(--s-5)">' +
        '從' + esc(c.name) + '身上可以抽取的具體做法。每條都連到「人生參照」的對應領域，' +
        '那裡有更完整的場景說明與可行步驟。</p>' +
      '<div class="grid grid--2">' +
        (c.reference || []).map(function (r) {
          var d = domains[r.domain] || { label: r.domain, tint: '#E5DACA' };
          return '<article class="card ref-card" style="--ref-tint:' + esc(d.tint) + '">' +
            '<a href="reference.html#' + esc(r.domain) + '" class="eyebrow eyebrow--plain" style="text-decoration:none">' +
              esc(d.label) + ' →</a>' +
            '<h3>' + esc(r.title) + '</h3>' +
            '<p>' + esc(r.body) + '</p>' +
          '</article>';
        }).join('') +
      '</div>');

    html += '</div>';

    /* ---- 上一個／下一個 + 全部角色快速切換 ---- */
    html +=
      '<section class="wrap" style="padding-bottom:var(--s-4)">' +
        '<div class="pager">' +
          '<a href="' + App.link(prev.id) + '"><small>← 上一個</small>' + esc(prev.name) + '</a>' +
          '<a href="' + App.link(next.id) + '"><small>下一個 →</small>' + esc(next.name) + '</a>' +
        '</div>' +
        '<div class="head-row" style="margin:var(--s-6) 0 var(--s-3)"><h2 style="font-size:1.1rem">其他角色</h2>' +
          '<a class="more" href="characters.html">角色圖鑑 →</a></div>' +
        '<nav class="char-strip" aria-label="切換角色">' +
          list.map(function (o) {
            return '<a href="' + App.link(o.id) + '"' + (o.id === c.id ? ' aria-current="page"' : '') + '>' +
              App.face(o) + esc(o.name) + '</a>';
          }).join('') +
        '</nav>' +
      '</section>';

    main.innerHTML = html;
    App.deco(main.querySelector('.char-hero'), { kinds: ['sparkle', 'sparkle', 'heart', 'flower', 'dot'], n: 10, seed: c.id });
    App.initTabs(main.querySelector('.tabbar'));

    /* 角色切換帶：把目前角色捲到可見處 */
    var strip = main.querySelector('.char-strip');
    var curA = strip && strip.querySelector('[aria-current]');
    if (curA) strip.scrollLeft = curA.offsetLeft - strip.clientWidth / 2 + curA.offsetWidth / 2;
  });
})();
