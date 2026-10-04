/* home.js — 首頁動態區塊：舞台三主角、目錄磚、主角卡、名場面、測驗呼籲 */
(function () {
  'use strict';
  document.addEventListener('app:ready', function () {
    var esc = App.esc;

    /* 舞台：八割、吉伊卡哇、兔兔，各自一句招牌對白 */
    var stage = document.querySelector('[data-home-trio-stage]');
    if (stage) {
      var cast = [
        { id: 'hachiware', say: 'なんとかなれーッ！' },
        { id: 'chiikawa',  say: 'ワッ…！', main: true },
        { id: 'usagi',     say: 'ヤハッ！' }
      ];
      stage.innerHTML = cast.map(function (x) {
        var c = App.char(x.id);
        if (!c) return '';
        return '<a class="stage__char' + (x.main ? ' stage__char--main' : '') + '" href="' + App.link(c.id) + '" aria-label="' + esc(c.name) + '">' +
          '<span class="bubble ja" aria-hidden="true">' + esc(x.say) + '</span>' +
          '<span class="stage__face">' + App.avatar(c) + '</span></a>';
      }).join('');
      App.deco(document.querySelector('[data-home-stage]'), { kinds: ['sparkle', 'sparkle', 'heart', 'note'], n: 7, full: true });
    }
    App.deco(document.querySelector('.home-hero'), { kinds: ['sparkle', 'heart', 'flower', 'dot'], n: 8 });

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

    /* 主角三人卡 */
    var trio = document.querySelector('[data-home-trio]');
    if (trio) {
      trio.innerHTML = ['chiikawa', 'hachiware', 'usagi'].map(function (id) {
        var c = App.char(id);
        if (!c) return '';
        return '<a class="lead-card" href="' + App.link(c.id) + '" style="--lead-tint:' + esc(c.tint) + '">' +
          App.face(c) +
          '<span><b>' + esc(c.name) + '</b><small class="ja">' + esc(c.nameJa) + '</small>' +
          '<p>' + esc(c.tagline) + '</p></span></a>';
      }).join('');
    }

    /* 名場面：全部八則放進橫向捲動帶 */
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

    /* 測驗呼籲：三張疊著的小臉 + 閃星 */
    var faces = document.querySelector('[data-cta-faces]');
    if (faces) {
      faces.innerHTML = ['momonga', 'kurimanju', 'rakko'].map(function (id) {
        return App.face(App.char(id));
      }).join('');
    }
    App.deco(document.querySelector('[data-cta]'), { kinds: ['sparkle', 'heart', 'note'], n: 7 });
  });
})();
