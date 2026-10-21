/* ==========================================================================
   stories.js — 故事頁：長篇章／名場面／時間軸 三個分頁
   長篇章改為摺疊清單：先看六個標題與一句簡介，要讀才展開。
   ========================================================================== */
(function () {
  'use strict';
  document.addEventListener('app:ready', function () {
    var esc  = App.esc;
    var host = document.querySelector('[data-stories]');
    if (!host) return;

    var arcs = window.CHIIKAWA_ARCS || [];
    var moments = window.CHIIKAWA_MOMENTS || [];
    var timeline = window.CHIIKAWA_TIMELINE || [];
    var movie = window.CHIIKAWA_MOVIE;
    var chev = App.icon('chev', 16);

    function castTags(ids) {
      return (ids || []).map(function (id) {
        var c = App.char(id);
        return c ? '<a class="tag" href="' + App.link(c.id) + '">' + esc(c.name) + '</a>' : '';
      }).join('');
    }

    /* ---- 長篇章 ---- */
    var arcsHTML =
      '<div class="panel-tools"><span>' + arcs.length + ' 個長篇，按連載次序排列</span>' +
        '<button class="linkish" type="button" data-acc-toggle="arcs">全部展開</button></div>' +
      '<div class="acc-list">' +
      arcs.map(function (a, i) {
        var cast = castTags(a.cast);
        return '<details class="acc" id="arc-' + esc(a.id) + '">' +
          '<summary>' +
            '<span class="acc__lead" style="--acc-tint:' + esc(a.tint) + '">' + (i + 1) + '</span>' +
            '<span><span class="acc__kicker">' + esc(a.period) + '</span>' +
              '<span class="acc__title">' + esc(a.name) + '</span>' +
              '<span class="acc__sub ja">' + esc(a.nameJa) + '</span></span>' +
            '<span class="acc__chev">' + chev + '</span>' +
          '</summary>' +
          '<div class="acc__body">' +
            '<p>' + esc(a.summary) + '</p>' +
            '<div class="arc__beats">' +
              (a.beats || []).map(function (b) {
                return '<div class="arc__beat"><h4>' + esc(b.label) + '</h4><p>' + esc(b.body) + '</p></div>';
              }).join('') +
            '</div>' +
            '<div class="arc__theme"><h4>主題</h4><p>' + esc(a.theme) + '</p>' +
              '<p class="callout"><strong>可以帶走的一句</strong>' + esc(a.reference) + '</p>' +
              (a.caveat ? '<p class="note" style="margin-top:var(--s-3)"><span><strong>資料說明：</strong>' + esc(a.caveat) + '</span></p>' : '') +
            '</div>' +
            (cast ? '<div class="arc__cast"><h4>登場角色</h4><div class="tag-row">' + cast + '</div></div>' : '') +
            (a.id === 'seiren' && movie
              ? '<a class="promo" href="movie.html"><img src="' + esc(movie.poster) + '" alt="" loading="lazy">' +
                  '<span><small>劇場版</small><b>' + esc(movie.title) + '</b><small>' + esc(movie.release) + '</small></span>' +
                  '<span class="more">專頁 →</span></a>'
              : '') +
          '</div>' +
        '</details>';
      }).join('') +
      '</div>';

    /* ---- 名場面 ---- */
    var momentsHTML =
      '<div class="grid grid--2">' +
      moments.map(function (m) {
        return '<article class="moment" id="moment-' + esc(m.id) + '" style="--m-tint:' + esc(m.tint) + '">' +
          '<h3>' + esc(m.title) + '</h3>' +
          '<p class="moment__ja ja">' + esc(m.titleJa) + '</p>' +
          '<p class="moment__body">' + esc(m.body) + '</p>' +
          '<p class="callout"><strong>點解重要</strong>' + esc(m.punch) + '</p>' +
          '<div class="tag-row" style="margin-top:var(--s-2)">' + castTags(m.chars) + '</div>' +
        '</article>';
      }).join('') +
      '</div>';

    /* ---- 時間軸：手機上改為直排，比橫向捲動易讀 ---- */
    var timelineHTML =
      '<ol class="vtl">' +
      timeline.map(function (t) {
        return '<li><span class="vtl__year">' + esc(t.year) + '</span>' +
          '<h3>' + esc(t.title) + '</h3><p>' + esc(t.body) + '</p></li>';
      }).join('') +
      '</ol>' +
      '<p style="margin-top:var(--s-6)"><a class="btn btn--ghost" href="movie.html">劇場版專頁</a></p>';

    function panel(id, inner, first) {
      return '<section class="tabpanel" role="tabpanel" id="' + id + '" aria-labelledby="tab-' + id + '" tabindex="-1"' +
        (first ? '' : ' hidden') + '>' + inner + '</section>';
    }

    host.innerHTML =
      App.tabbarHTML([
        { id: 'arcs',     label: '長篇章',   count: arcs.length },
        { id: 'moments',  label: '名場面',   count: moments.length },
        { id: 'timeline', label: '時間軸' }
      ], '故事篇章分頁') +
      '<div class="wrap">' +
        panel('arcs', arcsHTML, true) +
        panel('moments', momentsHTML) +
        panel('timeline', timelineHTML) +
      '</div>';

    App.initTabs(host.querySelector('.tabbar'));
  });
})();
