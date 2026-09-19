/* home.js — 首頁動態區塊：主角三人卡、精選名場面 */
(function () {
  'use strict';
  document.addEventListener('app:ready', function () {
    var esc = App.esc;

    /* 主角三人卡 */
    var trio = document.querySelector('[data-home-trio]');
    if (trio) {
      trio.innerHTML = ['chiikawa', 'hachiware', 'usagi'].map(function (id) {
        var c = App.char(id);
        if (!c) return '';
        return '<a class="rel-item" href="' + App.link(c.id) + '" style="--rel-tint:' + esc(c.tint) + '">' +
          '<span class="rel-item__avatar">' + App.avatar(c) + '</span>' +
          '<span><span class="rel-item__name">' + esc(c.name) +
            '<span class="rel-item__type ja">' + esc(c.nameJa) + '</span></span>' +
            '<p>' + esc(c.tagline) + '</p></span></a>';
      }).join('');
    }

    /* 精選名場面（取前三） */
    var mom = document.querySelector('[data-home-moments]');
    if (mom && window.CHIIKAWA_MOMENTS) {
      mom.innerHTML = window.CHIIKAWA_MOMENTS.slice(0, 3).map(function (m) {
        var who = m.chars.map(function (id) {
          var c = App.char(id); return c ? esc(c.name) : '';
        }).filter(Boolean).join('、');
        return '<article class="card" style="border-top:4px solid ' + esc(m.tint) + '">' +
          '<span class="eyebrow">' + esc(who) + '</span>' +
          '<h3>' + esc(m.title) + '</h3>' +
          '<p class="ja" style="font-size:var(--t-tiny);color:var(--c-ink-soft);margin-top:-8px">' + esc(m.titleJa) + '</p>' +
          '<p style="font-size:var(--t-small);line-height:var(--lh-normal)">' + esc(m.body) + '</p>' +
          '<p class="scene__why" style="margin-bottom:0"><strong>點解重要：</strong>' + esc(m.punch) + '</p>' +
          '</article>';
      }).join('');
    }
  });
})();
