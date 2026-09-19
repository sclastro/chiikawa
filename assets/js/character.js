/* ==========================================================================
   character.js — 角色詳情頁，由 ?id= 讀取資料渲染
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

    /* ---- 區段標題 ---- */
    function head(n, title) {
      return '<h2><span class="char-section__num" aria-hidden="true">' + n + '</span>' + esc(title) + '</h2>';
    }

    /* ---- 1. Hero ---- */
    var html =
      '<section class="char-hero" style="--char-tint:' + esc(c.tint) + '">' +
        '<div class="wrap">' +
          '<p class="crumbs"><a href="index.html">首頁</a><span>›</span>' +
            '<a href="characters.html">角色圖鑑</a><span>›</span>' + esc(c.name) + '</p>' +
          '<div class="char-hero__inner">' +
            '<div class="char-hero__portrait">' + App.avatar(c) + '</div>' +
            '<div>' +
              '<span class="eyebrow">' + esc(c.tierLabel) + '</span>' +
              '<h1>' + esc(c.name) + '</h1>' +
              '<p class="char-hero__ja ja">' + esc(c.nameJa) + '</p>' +
              '<p class="char-hero__tagline">' + esc(c.tagline) + '</p>' +
              '<div class="tag-row">' +
                '<span class="tag tag--accent">' + esc(c.facets.camp) + '</span>' +
                '<span class="tag tag--accent">' + esc(c.facets.group) + '</span>' +
                '<span class="tag tag--accent">' + esc(c.facets.temperament) + '</span>' +
                (c.facets.arcs || []).map(function (a) {
                  return '<span class="tag">' + esc(a) + '</span>';
                }).join('') +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<div class="anchor-nav"><div class="wrap"><ul>' +
        '<li><a href="#profile">基本檔案</a></li>' +
        '<li><a href="#personality">性格剖析</a></li>' +
        '<li><a href="#scenes">代表名場面</a></li>' +
        '<li><a href="#relations">關係與互動</a></li>' +
        '<li><a href="#reference">可以參照咩</a></li>' +
      '</ul></div></div>';

    /* ---- 2. 基本檔案 ---- */
    html +=
      '<section class="char-section" id="profile" style="--char-tint:' + esc(c.tint) + '"><div class="wrap">' +
        head(1, '基本檔案') +
        '<div class="card" style="max-width:var(--w-text)"><dl class="datalist">' +
          (c.profile || []).map(function (p) {
            return '<div><dt>' + esc(p.label) + '</dt><dd>' + esc(p.value) + '</dd></div>';
          }).join('') +
        '</dl></div>' +
      '</div></section>';

    /* ---- 3. 性格深度剖析 ---- */
    html +=
      '<section class="char-section" id="personality" style="--char-tint:' + esc(c.tint) + '"><div class="wrap">' +
        head(2, '性格深度剖析') +
        '<div style="max-width:var(--w-text)">' +
          (c.traits || []).map(function (t) {
            return '<div class="trait"><h3>' + esc(t.title) + '</h3><p>' + esc(t.body) + '</p></div>';
          }).join('') +
        '</div>' +
        '<div class="psyche">' +
          '<div class="psyche__item"><h4>恐懼</h4><p>' + esc(c.psyche.fear) + '</p></div>' +
          '<div class="psyche__item"><h4>渴望</h4><p>' + esc(c.psyche.desire) + '</p></div>' +
          '<div class="psyche__item"><h4>內在矛盾</h4><p>' + esc(c.psyche.conflict) + '</p></div>' +
        '</div>' +
      '</div></section>';

    /* ---- 4. 名場面 ---- */
    html +=
      '<section class="char-section" id="scenes" style="--char-tint:' + esc(c.tint) + '"><div class="wrap">' +
        head(3, '代表性名場面') +
        '<div style="max-width:var(--w-text)">' +
          (c.scenes || []).map(function (s) {
            return '<article class="scene">' +
              '<p class="scene__meta"><span class="ja">' + esc(s.titleJa) + '</span> ・ ' + esc(s.arc) + '</p>' +
              '<h3>' + esc(s.title) + '</h3>' +
              '<p>' + esc(s.body) + '</p>' +
              '<p class="scene__why"><strong>點解呢一幕重要：</strong>' + esc(s.why) + '</p>' +
            '</article>';
          }).join('') +
        '</div>' +
      '</div></section>';

    /* ---- 5. 關係 ---- */
    html +=
      '<section class="char-section" id="relations" style="--char-tint:' + esc(c.tint) + '"><div class="wrap">' +
        head(4, '關係與互動') +
        '<div class="rel-list" style="max-width:var(--w-text)">' +
          (c.relations || []).map(function (r) {
            var o = App.char(r.id);
            if (!o) return '';
            return '<a class="rel-item" href="' + App.link(o.id) + '" style="--rel-tint:' + esc(o.tint) + '">' +
              '<span class="rel-item__avatar">' + App.avatar(o) + '</span>' +
              '<span><span class="rel-item__name">' + esc(o.name) +
                '<span class="rel-item__type">' + esc(r.type) + '</span></span>' +
                '<p>' + esc(r.body) + '</p></span></a>';
          }).join('') +
        '</div>' +
        '<p style="margin-top:var(--s-5)"><a class="btn btn--ghost" href="relations.html?focus=' +
          encodeURIComponent(c.id) + '">喺關係圖睇' + esc(c.name) + '嘅位置</a></p>' +
      '</div></section>';

    /* ---- 6. 可以參照咩 ---- */
    html +=
      '<section class="char-section" id="reference" style="--char-tint:' + esc(c.tint) + '"><div class="wrap">' +
        head(5, '可以參照咩') +
        '<p class="lede" style="max-width:var(--w-text);margin-bottom:var(--s-5)">' +
          '從' + esc(c.name) + '身上可以抽取的具體做法。每條都連到「人生參照」專區的對應章節，' +
          '那裡有更完整的場景說明與可行步驟。</p>' +
        '<div class="grid grid--2">' +
          (c.reference || []).map(function (r) {
            var d = domains[r.domain] || { label: r.domain, tint: '#E5DACA' };
            return '<article class="card" style="border-left:4px solid ' + esc(d.tint) + '">' +
              '<a href="reference.html#' + esc(r.domain) + '" class="eyebrow" style="text-decoration:none">' +
                esc(d.label) + ' →</a>' +
              '<h3 style="font-size:1.05rem">' + esc(r.title) + '</h3>' +
              '<p style="font-size:var(--t-small);line-height:var(--lh-normal);margin:0">' + esc(r.body) + '</p>' +
            '</article>';
          }).join('') +
        '</div>' +
      '</div></section>';

    /* ---- 7. 上一個 / 下一個 ---- */
    html +=
      '<section class="section"><div class="wrap">' +
        '<div class="grid grid--2">' +
          '<a class="card card--link" href="' + App.link(prev.id) + '">' +
            '<span class="eyebrow">← 上一個角色</span>' +
            '<h3 style="margin:0">' + esc(prev.name) + '<span class="ja" style="font-size:var(--t-small);color:var(--c-ink-soft);margin-left:8px">' + esc(prev.nameJa) + '</span></h3></a>' +
          '<a class="card card--link" href="' + App.link(next.id) + '" style="text-align:right">' +
            '<span class="eyebrow">下一個角色 →</span>' +
            '<h3 style="margin:0">' + esc(next.name) + '<span class="ja" style="font-size:var(--t-small);color:var(--c-ink-soft);margin-left:8px">' + esc(next.nameJa) + '</span></h3></a>' +
        '</div>' +
      '</div></section>';

    main.innerHTML = html;
  });
})();
