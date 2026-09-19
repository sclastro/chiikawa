/* stories.js — 故事頁：長篇章、名場面、時間軸 */
(function () {
  'use strict';
  document.addEventListener('app:ready', function () {
    var esc = App.esc;

    /* ---- 長篇章 ---- */
    var arcsHost = document.querySelector('[data-arcs]');
    if (arcsHost && window.CHIIKAWA_ARCS) {
      arcsHost.innerHTML = window.CHIIKAWA_ARCS.map(function (a) {
        var cast = (a.cast || []).map(function (id) {
          var c = App.char(id);
          return c ? '<a class="tag" href="' + App.link(c.id) + '">' + esc(c.name) + '</a>' : '';
        }).join('');
        return '<article class="arc reveal" id="arc-' + esc(a.id) + '" style="border-top:5px solid ' + esc(a.tint) + '">' +
          '<div class="arc__head">' +
            '<h2>' + esc(a.name) + '</h2>' +
            '<span class="ja" style="color:var(--c-ink-soft);font-size:var(--t-small)">' + esc(a.nameJa) + '</span>' +
          '</div>' +
          '<p style="font-size:var(--t-tiny);color:var(--c-ink-soft);margin-top:-8px">' + esc(a.period) + '</p>' +
          '<p>' + esc(a.summary) + '</p>' +
          '<div class="arc__beats">' +
            (a.beats || []).map(function (b) {
              return '<div class="arc__beat"><h4>' + esc(b.label) + '</h4><p>' + esc(b.body) + '</p></div>';
            }).join('') +
          '</div>' +
          '<div class="arc__theme">' +
            '<h3 style="font-size:1.05rem">主題</h3>' +
            '<p>' + esc(a.theme) + '</p>' +
            '<p class="scene__why"><strong>可以帶走的一句：</strong>' + esc(a.reference) + '</p>' +
            (a.caveat ? '<div class="note" style="margin-top:var(--s-4)"><strong>資料說明：</strong>' + esc(a.caveat) + '</div>' : '') +
          '</div>' +
          (cast ? '<div style="margin-top:var(--s-5)"><p style="font-size:var(--t-tiny);color:var(--c-ink-soft);margin-bottom:var(--s-2)">登場角色</p><div class="tag-row">' + cast + '</div></div>' : '') +
        '</article>';
      }).join('');
    }

    /* ---- 名場面 ---- */
    var momHost = document.querySelector('[data-moments]');
    if (momHost && window.CHIIKAWA_MOMENTS) {
      momHost.innerHTML = window.CHIIKAWA_MOMENTS.map(function (m) {
        var who = (m.chars || []).map(function (id) {
          var c = App.char(id);
          return c ? '<a class="tag" href="' + App.link(c.id) + '">' + esc(c.name) + '</a>' : '';
        }).join('');
        return '<article class="card reveal" style="border-top:4px solid ' + esc(m.tint) + '">' +
          '<h3>' + esc(m.title) + '</h3>' +
          '<p class="ja" style="font-size:var(--t-tiny);color:var(--c-ink-soft);margin-top:-10px">' + esc(m.titleJa) + '</p>' +
          '<p>' + esc(m.body) + '</p>' +
          '<p class="scene__why"><strong>點解重要：</strong>' + esc(m.punch) + '</p>' +
          '<div class="tag-row" style="margin-top:var(--s-4)">' + who + '</div>' +
        '</article>';
      }).join('');
    }

    /* ---- 時間軸 ---- */
    var track = document.querySelector('[data-timeline]');
    if (track && window.CHIIKAWA_TIMELINE) {
      track.innerHTML = window.CHIIKAWA_TIMELINE.map(function (t) {
        return '<article class="timeline__item">' +
          '<span class="timeline__year">' + esc(t.year) + '</span>' +
          '<h3>' + esc(t.title) + '</h3>' +
          '<p>' + esc(t.body) + '</p>' +
        '</article>';
      }).join('');

      var step = function () {
        var item = track.querySelector('.timeline__item');
        return item ? item.getBoundingClientRect().width + 16 : 280;
      };
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      function scrollBy(dir) {
        track.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' });
      }
      var p = document.querySelector('[data-tl-prev]');
      var n = document.querySelector('[data-tl-next]');
      if (p) p.addEventListener('click', function () { scrollBy(-1); });
      if (n) n.addEventListener('click', function () { scrollBy(1); });
      track.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); scrollBy(1); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); scrollBy(-1); }
      });
    }
  });
})();
