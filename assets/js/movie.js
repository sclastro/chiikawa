/* movie.js — 劇場版專頁 */
(function () {
  'use strict';
  document.addEventListener('app:ready', function () {
    var esc = App.esc;
    var host = document.querySelector('[data-movie-page]');
    var m = window.CHIIKAWA_MOVIE;
    if (!host || !m) return;

    var cast = ['chiikawa', 'hachiware', 'usagi', 'momonga', 'rakko', 'seiren', 'shimajiro', 'hitoha-futaba'];

    host.innerHTML =
      '<section class="movie-hero"><div class="wrap">' +
        '<p class="crumbs"><a href="index.html">首頁</a><span>›</span><a href="stories.html">故事篇章</a><span>›</span>劇場版</p>' +
        '<div class="movie-hero__inner">' +
          '<div class="movie-poster"><img src="' + esc(m.poster) + '" alt="劇場版海報的圖片位" loading="lazy"></div>' +
          '<div>' +
            '<span class="eyebrow">劇場版</span>' +
            '<h1>' + esc(m.title) + '</h1>' +
            '<p class="char-hero__ja ja">' + esc(m.titleJa) + '</p>' +
            '<p class="lede">' + esc(m.release) + '公開。改編自原作長篇「セイレーン編」。</p>' +
            '<div class="card" style="margin-top:var(--s-5);max-width:560px"><dl class="datalist">' +
              m.facts.map(function (f) {
                return '<div><dt>' + esc(f.label) + '</dt><dd>' + esc(f.value) + '</dd></div>';
              }).join('') +
            '</dl></div>' +
          '</div>' +
        '</div>' +
      '</div></section>' +

      '<section class="section"><div class="wrap wrap--text reveal">' +
        '<span class="eyebrow">劇情介紹</span>' +
        '<h2>故事由一張太過吸引的傳單開始</h2>' +
        '<p>' + esc(m.synopsis) + '</p>' +
        '<div class="note" style="margin-top:var(--s-5)"><strong>觀影提示：</strong>' +
          '以下看點分析涉及原作「セイレーン編」的整體結構與結局處理方式。' +
          '若你打算先看電影，建議看完再回來讀。</div>' +
      '</div></section>' +

      '<section class="section section--alt"><div class="wrap">' +
        '<div class="section-head reveal">' +
          '<span class="eyebrow">看點分析</span>' +
          '<h2>為甚麼首部劇場版揀了最沉重的一個篇章</h2>' +
        '</div>' +
        '<div class="grid grid--2 reveal">' +
          m.points.map(function (p, i) {
            return '<article class="card">' +
              '<span class="eyebrow">看點 ' + (i + 1) + '</span>' +
              '<h3>' + esc(p.title) + '</h3>' +
              '<p style="margin:0">' + esc(p.body) + '</p>' +
            '</article>';
          }).join('') +
        '</div>' +
      '</div></section>' +

      '<section class="section"><div class="wrap">' +
        '<div class="section-head reveal">' +
          '<span class="eyebrow">登場角色</span>' +
          '<h2>牠們在這個故事裡的位置</h2>' +
          '<p>點擊角色卡查看完整檔案，包括牠在這個篇章中的名場面與解讀。</p>' +
        '</div>' +
        '<div class="grid grid--4 reveal">' +
          cast.map(function (id) {
            var c = App.char(id);
            if (!c) return '';
            return '<a class="char-card" href="' + App.link(c.id) + '" style="--char-tint:' + esc(c.tint) + '">' +
              '<span class="char-card__media">' + App.avatar(c) + '</span>' +
              '<span class="char-card__body">' +
                '<span class="char-card__name">' + esc(c.name) + '</span>' +
                '<span class="char-card__ja ja">' + esc(c.nameJa) + '</span>' +
                '<p class="char-card__line">' + esc(c.tagline) + '</p>' +
              '</span></a>';
          }).join('') +
        '</div>' +
      '</div></section>' +

      '<section class="section section--alt"><div class="wrap wrap--text reveal">' +
        '<h2>延伸閱讀</h2>' +
        '<p>原作篇章的完整脈絡整理，包括中段的轉折與結局的處理方式。</p>' +
        '<p><a class="btn btn--primary" href="stories.html#arc-seiren">讀「海妖之島篇」完整整理</a></p>' +
        '<div class="note" style="margin-top:var(--s-5)">' + esc(m.note) + '</div>' +
      '</div></section>';
  });
})();
