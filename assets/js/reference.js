/* ==========================================================================
   reference.js — 人生參照專區
   四個領域各佔一個分頁；每個領域內的參照改為摺疊清單，
   先列出所有標題，要讀哪一條才展開。
   ========================================================================== */
(function () {
  'use strict';
  document.addEventListener('app:ready', function () {
    var esc  = App.esc;
    var data = window.CHIIKAWA_REFERENCE || [];
    var host = document.querySelector('[data-reference]');
    if (!host || !data.length) return;
    var chev = App.icon('chev', 16);

    function lessonHTML(d, l, i) {
      var c = App.char(l.charId);
      return '<details class="acc" id="' + esc(d.id) + '-' + (i + 1) + '">' +
        '<summary>' +
          (c ? App.face(c, 40, 'acc__lead') : '<span class="acc__lead">' + (i + 1) + '</span>') +
          '<span><span class="acc__kicker">' + (c ? esc(c.name) : '') + '</span>' +
            '<span class="acc__title">' + esc(l.title) + '</span></span>' +
          '<span class="acc__chev">' + chev + '</span>' +
        '</summary>' +
        '<div class="acc__body">' +
          '<div class="ref-step">' +
            '<span class="ref-step__label"><span>1</span>具體場景</span>' +
            '<p>' + esc(l.scene) + '</p>' +
          '</div>' +
          '<div class="ref-step">' +
            '<span class="ref-step__label"><span>2</span>背後道理</span>' +
            '<p>' + esc(l.principle) + '</p>' +
          '</div>' +
          '<div class="ref-step ref-step--do">' +
            '<span class="ref-step__label"><span>3</span>可行做法</span>' +
            '<ul>' + (l.actions || []).map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' +
          '</div>' +
          (c ? '<p style="margin-top:var(--s-4)"><a class="more" href="' + App.link(c.id) + '">看' + esc(c.name) + '的完整檔案 →</a></p>' : '') +
        '</div>' +
      '</details>';
    }

    function compareHTML(cmp) {
      if (!cmp) return '';
      return '<div class="compare">' +
        '<span class="eyebrow">橫向比較</span>' +
        '<h3>' + esc(cmp.question) + '</h3>' +
        '<div class="compare__grid">' +
          cmp.cols.map(function (col) {
            var c = App.char(col.charId);
            if (!c) return '';
            return '<div class="compare__col" style="--col-tint:' + esc(c.tint) + '">' +
              '<h4>' + App.face(c, 28) + '<a href="' + App.link(c.id) + '">' + esc(c.name) + '</a></h4>' +
              '<p>' + esc(col.approach) + '</p>' +
              '<p class="compare__cost"><strong>代價：</strong>' + esc(col.cost) + '</p>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<p style="margin:var(--s-4) 0 0;font-size:var(--t-small);color:var(--c-ink-soft);line-height:var(--lh-normal)">' +
          esc(cmp.note) + '</p>' +
      '</div>';
    }

    host.innerHTML =
      App.tabbarHTML(data.map(function (d) {
        return { id: d.id, label: d.label, count: d.lessons.length, tint: d.tint };
      }), '人生參照領域') +
      '<div class="wrap">' +
      data.map(function (d, di) {
        return '<section class="tabpanel" role="tabpanel" id="' + esc(d.id) + '" aria-labelledby="tab-' + esc(d.id) + '" tabindex="-1"' +
          (di === 0 ? '' : ' hidden') + '>' +
          '<div class="panel-head"><h2>' + esc(d.label) + '</h2><p>' + esc(d.lede) + '</p></div>' +
          '<div class="panel-tools"><span>' + d.lessons.length + ' 條參照・點標題展開</span>' +
            '<button class="linkish" type="button" data-acc-toggle="' + esc(d.id) + '-list">全部展開</button></div>' +
          '<div class="acc-list" id="' + esc(d.id) + '-list" style="max-width:860px">' +
            d.lessons.map(function (l, i) { return lessonHTML(d, l, i); }).join('') +
          '</div>' +
          compareHTML(d.compare) +
        '</section>';
      }).join('') +
      '</div>';

    App.initTabs(host.querySelector('.tabbar'));
  });
})();
