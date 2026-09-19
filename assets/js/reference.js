/* reference.js — 人生參照專區 */
(function () {
  'use strict';
  document.addEventListener('app:ready', function () {
    var esc  = App.esc;
    var data = window.CHIIKAWA_REFERENCE || [];
    var host = document.querySelector('[data-reference]');
    var nav  = document.querySelector('[data-ref-nav]');
    if (!host) return;

    if (nav) {
      nav.innerHTML = data.map(function (d) {
        return '<li><a href="#' + esc(d.id) + '">' + esc(d.label) + '</a></li>';
      }).join('');
    }

    function who(id) {
      var c = App.char(id);
      if (!c) return '';
      return '<a class="ref-lesson__who" href="' + App.link(c.id) + '" style="text-decoration:none;color:inherit">' +
        '<span class="ref-lesson__avatar">' + App.avatar(c) + '</span>' +
        '<span><span style="font-family:var(--f-heading);font-weight:700">' + esc(c.name) + '</span>' +
        '<span class="ja" style="font-size:var(--t-tiny);color:var(--c-ink-soft);margin-left:8px">' + esc(c.nameJa) + '</span></span>' +
        '</a>';
    }

    host.innerHTML = data.map(function (d) {
      var lessons = d.lessons.map(function (l) {
        return '<article class="ref-lesson">' +
          who(l.charId) +
          '<h3>' + esc(l.title) + '</h3>' +
          '<div class="ref-step">' +
            '<span class="ref-step__label">具體場景</span>' +
            '<p>' + esc(l.scene) + '</p>' +
          '</div>' +
          '<div class="ref-step">' +
            '<span class="ref-step__label">背後道理</span>' +
            '<p>' + esc(l.principle) + '</p>' +
          '</div>' +
          '<div class="ref-step ref-step--do">' +
            '<span class="ref-step__label">可行做法</span>' +
            '<ul>' + l.actions.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' +
          '</div>' +
        '</article>';
      }).join('');

      var cmp = d.compare;
      var compare = '<div class="compare">' +
        '<span class="eyebrow">橫向比較</span>' +
        '<h3 style="margin-bottom:0">' + esc(cmp.question) + '</h3>' +
        '<div class="compare__grid">' +
          cmp.cols.map(function (col) {
            var c = App.char(col.charId);
            if (!c) return '';
            return '<div class="compare__col" style="--col-tint:' + esc(c.tint) + '">' +
              '<h4><a href="' + App.link(c.id) + '" style="color:inherit;text-decoration:none">' + esc(c.name) + '</a></h4>' +
              '<p>' + esc(col.approach) + '</p>' +
              '<p class="compare__cost"><strong>代價：</strong>' + esc(col.cost) + '</p>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<p style="margin:var(--s-4) 0 0;font-size:var(--t-small);color:var(--c-ink-soft);line-height:var(--lh-normal)">' +
          esc(cmp.note) + '</p>' +
      '</div>';

      return '<section class="ref-domain reveal" id="' + esc(d.id) + '" style="--domain-tint:' + esc(d.tint) + '">' +
        '<div class="ref-domain__head">' +
          '<span class="ref-domain__icon" aria-hidden="true">' +
            '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8F4720" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M12 21s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.4-7 10-7 10z"/></svg>' +
          '</span>' +
          '<div><h2 style="margin-bottom:var(--s-2)">' + esc(d.label) + '</h2>' +
            '<p class="lede" style="margin:0">' + esc(d.lede) + '</p></div>' +
        '</div>' +
        lessons + compare +
      '</section>';
    }).join('');
  });
})();
