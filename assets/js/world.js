/* world.js — 世界觀設定頁 */
(function () {
  'use strict';
  document.addEventListener('app:ready', function () {
    var esc  = App.esc;
    var data = window.CHIIKAWA_WORLD || [];
    var host = document.querySelector('[data-world]');
    var nav  = document.querySelector('[data-world-nav]');
    if (!host) return;

    if (nav) {
      nav.innerHTML = data.map(function (g) {
        return '<li><a href="#' + esc(g.id) + '">' + esc(g.name) + '</a></li>';
      }).join('');
    }

    host.innerHTML = data.map(function (g) {
      return '<section class="reveal" id="' + esc(g.id) + '" style="margin-bottom:var(--s-8)">' +
        '<div class="section-head" style="margin-bottom:var(--s-5)">' +
          '<h2 style="display:flex;align-items:center;gap:var(--s-3);flex-wrap:wrap">' +
            '<span style="width:14px;height:34px;border-radius:999px;background:' + esc(g.tint) + ';flex-shrink:0" aria-hidden="true"></span>' +
            esc(g.name) +
            '<span class="ja" style="font-size:var(--t-small);color:var(--c-ink-soft);font-weight:400">' + esc(g.nameJa) + '</span>' +
          '</h2>' +
          '<p class="lede">' + esc(g.lede) + '</p>' +
        '</div>' +
        '<div class="grid grid--2">' +
          g.entries.map(function (e) {
            return '<article class="card world-entry" style="margin-bottom:0">' +
              '<h3 style="font-size:1.05rem;align-items:flex-start">' +
                '<span class="world-entry__badge" style="background:' + esc(g.tint) + '">' + esc(e.badge) + '</span>' +
                esc(e.title) +
              '</h3>' +
              '<p style="margin:0">' + esc(e.body) + '</p>' +
            '</article>';
          }).join('') +
        '</div>' +
      '</section>';
    }).join('');
  });
})();
