/* home.js — 首頁動態區塊：目錄磚、主角三人、精選名場面 */
(function () {
  'use strict';
  document.addEventListener('app:ready', function () {
    var esc = App.esc;
    var trioIds = ['chiikawa', 'hachiware', 'usagi'];

    /* 目錄磚：直接取 app.js 的站點結構，與導航永遠一致 */
    var tiles = document.querySelector('[data-home-tiles]');
    if (tiles) {
      var items = [];
      App.SITE.forEach(function (g) {
        g.items.forEach(function (it) { if (it.href !== 'index.html') items.push(it); });
      });
      tiles.innerHTML = items.map(function (it) {
        return '<a class="tile" href="' + it.href + '" style="--tile-tint:' + esc(it.tint) + '">' +
          '<span class="tile__icon">' + App.icon(it.icon, 20) + '</span>' +
          '<span class="tile__title">' + esc(it.label) + '</span>' +
          '<span class="tile__meta">' + esc(it.meta || it.desc) + '</span>' +
        '</a>';
      }).join('');
    }

    /* 桌面版 hero 右側的三主角疊圖 */
    var heroTrio = document.querySelector('[data-home-hero-trio]');
    if (heroTrio) {
      heroTrio.innerHTML = ['hachiware', 'chiikawa', 'usagi'].map(function (id) {
        var c = App.char(id);
        return c ? '<a href="' + App.link(c.id) + '" aria-label="' + esc(c.name) + '">' + App.avatar(c) + '</a>' : '';
      }).join('');
    }

    /* 主角三人卡 */
    var trio = document.querySelector('[data-home-trio]');
    if (trio) {
      trio.innerHTML = trioIds.map(function (id) {
        var c = App.char(id);
        if (!c) return '';
        return '<a class="lead-card" href="' + App.link(c.id) + '">' +
          App.face(c) +
          '<span><b>' + esc(c.name) + '</b><small class="ja">' + esc(c.nameJa) + '</small>' +
          '<p>' + esc(c.tagline) + '</p></span></a>';
      }).join('');
    }

    /* 名場面：全部八則放進橫向捲動帶，手機上左右掃就看完 */
    var mom = document.querySelector('[data-home-moments]');
    if (mom && window.CHIIKAWA_MOMENTS) {
      mom.innerHTML = window.CHIIKAWA_MOMENTS.map(function (m) {
        var who = (m.chars || []).map(function (id) {
          var c = App.char(id); return c ? esc(c.name) : '';
        }).filter(Boolean).join('・');
        return '<a class="moment" href="stories.html#moment-' + esc(m.id) + '" style="--m-tint:' + esc(m.tint) + '">' +
          '<span class="moment__who">' + who + '</span>' +
          '<h3>' + esc(m.title) + '</h3>' +
          '<p class="moment__ja ja">' + esc(m.titleJa) + '</p>' +
          '<p class="moment__body moment__clamp">' + esc(m.punch) + '</p>' +
          '<span class="moment__more">讀全文 →</span>' +
        '</a>';
      }).join('');
    }
  });
})();
