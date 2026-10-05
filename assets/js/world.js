/* world.js — 世界觀設定頁：每個分類一個分頁 */
(function () {
  'use strict';
  document.addEventListener('app:ready', function () {
    var esc  = App.esc;
    var data = window.CHIIKAWA_WORLD || [];
    var host = document.querySelector('[data-world]');
    if (!host || !data.length) return;

    host.innerHTML =
      App.tabbarHTML(data.map(function (g) {
        return { id: g.id, label: g.name, count: g.entries.length, tint: g.tint };
      }), '世界觀分類') +
      '<div class="wrap">' +
      data.map(function (g, gi) {
        return '<section class="tabpanel" role="tabpanel" id="' + esc(g.id) + '" aria-labelledby="tab-' + esc(g.id) + '" tabindex="-1"' +
          (gi === 0 ? '' : ' hidden') + '>' +
          '<div class="panel-head">' +
            '<span class="eyebrow ja">' + esc(g.nameJa) + '</span>' +
            '<h2>' + esc(g.name) + '</h2>' +
            '<p>' + esc(g.lede) + '</p>' +
          '</div>' +
          '<div class="grid grid--2">' +
            g.entries.map(function (e, i) {
              return '<article class="card world-entry tape" id="' + esc(g.id) + '-' + (i + 1) + '" style="--tape:' + esc(g.tint) + ';--tape-r:' + (i % 2 ? '4deg' : '-4deg') + '">' +
                '<span class="world-entry__badge" style="--badge-tint:' + esc(g.tint) + '">' + esc(e.badge) + '</span>' +
                '<h3>' + esc(e.title) + '</h3>' +
                '<p>' + esc(e.body) + '</p>' +
              '</article>';
            }).join('') +
          '</div>' +
        '</section>';
      }).join('') +
      '</div>';

    App.initTabs(host.querySelector('.tabbar'));
  });
})();
