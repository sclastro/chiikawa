/* ==========================================================================
   app.js — 全站共用：導航、頁尾、滾動淡入、共用工具
   導航與頁尾以 JS 注入，確保十個頁面永遠一致，改一處即全站生效。
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 站點結構 ---------- */
  var NAV = [
    { href: 'index.html',      label: '首頁' },
    { href: 'characters.html', label: '角色圖鑑' },
    { href: 'relations.html',  label: '關係圖' },
    { href: 'stories.html',    label: '故事篇章' },
    { href: 'movie.html',      label: '劇場版' },
    { href: 'world.html',      label: '世界觀' },
    { href: 'reference.html',  label: '人生參照' },
    { href: 'quiz.html',       label: '性格測驗' },
    { href: 'about.html',      label: '關於' }
  ];

  /* ---------- 共用工具 ---------- */
  var App = {
    /** 取得目前頁面檔名 */
    page: function () {
      var p = location.pathname.split('/').pop();
      return p === '' ? 'index.html' : p;
    },
    /** 取得網址參數 */
    param: function (key) {
      return new URLSearchParams(location.search).get(key);
    },
    /** HTML 逃逸，所有由資料寫入 DOM 的文字都要經過 */
    esc: function (s) {
      return String(s === undefined || s === null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },
    /** 依 id 取角色 */
    char: function (id) {
      var list = window.CHIIKAWA_CHARACTERS || [];
      for (var i = 0; i < list.length; i++) { if (list[i].id === id) return list[i]; }
      return null;
    },
    /** 角色頭像。data-tint 供載入失敗時的後備填色使用（見 initImageFallback） */
    avatar: function (c, cls) {
      if (!c) return '';
      return '<img src="' + App.esc(c.image) + '" alt="' + App.esc(c.name) +
             '（' + App.esc(c.nameJa) + '）的圖片位" loading="lazy"' +
             ' data-tint="' + App.esc(c.tint) + '"' +
             (cls ? ' class="' + cls + '"' : '') + '>';
    },
    /** 角色詳情頁連結 */
    link: function (id) { return 'character.html?id=' + encodeURIComponent(id); }
  };
  window.App = App;

  /* ---------- 注入導航 ---------- */
  function buildNav() {
    var host = document.querySelector('[data-nav]');
    if (!host) return;
    var cur = App.page();
    var items = NAV.map(function (n) {
      var active = n.href === cur ? ' aria-current="page"' : '';
      return '<li><a href="' + n.href + '"' + active + '>' + App.esc(n.label) + '</a></li>';
    }).join('');

    host.innerHTML =
      '<nav class="nav" aria-label="主導航">' +
        '<div class="wrap">' +
          '<div class="nav__inner">' +
            '<a class="nav__brand" href="index.html">' +
              '<span class="nav__brand-mark" aria-hidden="true">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8F4720" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M12 21s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.4-7 10-7 10z"/></svg>' +
              '</span>' +
              '<span>吉伊卡哇圖鑑</span>' +
            '</a>' +
            '<ul class="nav__links">' + items + '</ul>' +
            '<button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-drawer">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
              '<path d="M4 7h16M4 12h16M4 17h16"/></svg>選單' +
            '</button>' +
          '</div>' +
          '<div class="nav__drawer" id="nav-drawer"><ul>' + items + '</ul></div>' +
        '</div>' +
      '</nav>';

    var btn = host.querySelector('.nav__toggle');
    var drawer = host.querySelector('#nav-drawer');
    btn.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- 注入頁尾 ---------- */
  function buildFooter() {
    var host = document.querySelector('[data-footer]');
    if (!host) return;
    function col(title, links) {
      return '<div><h3>' + title + '</h3><ul>' + links.map(function (l) {
        return '<li><a href="' + l[0] + '">' + App.esc(l[1]) + '</a></li>';
      }).join('') + '</ul></div>';
    }
    host.innerHTML =
      '<footer class="footer"><div class="wrap">' +
        '<div class="footer__grid">' +
          '<div>' +
            '<h3>吉伊卡哇圖鑑</h3>' +
            '<p style="font-size:var(--t-small);color:var(--c-ink-soft);line-height:var(--lh-normal);max-width:38ch">' +
            '一個以繁體中文撰寫的非官方資料站，整理角色、故事、世界觀，並嘗試從中抽取可以應用在日常生活的思考。</p>' +
          '</div>' +
          col('內容', [['characters.html', '角色圖鑑'], ['stories.html', '故事篇章'], ['world.html', '世界觀'], ['movie.html', '劇場版']]) +
          col('互動', [['relations.html', '關係圖'], ['quiz.html', '性格測驗'], ['reference.html', '人生參照'], ['about.html', '關於本站']]) +
        '</div>' +
        '<p class="footer__note">' +
          '《ちいかわ》原作及所有角色之著作權屬 ナガノ 老師及其相關權利人所有。本站為非官方、非商業之愛好者資料站，' +
          '所有文字為原創撰寫之介紹與分析，並非官方文案；站內圖片位置預留予使用者自行放置合法取得之圖片。' +
          '本站與版權方並無任何關聯。若權利人認為內容有不妥之處，請聯絡以便移除。' +
        '</p>' +
      '</div></footer>';
  }

  /* ---------- 滾動淡入 ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 圖片載入失敗的後備顯示 ----------
     error 事件不會冒泡，所以在 document 上以 capture 模式監聽；
     這樣連日後動態插入的圖片都涵蓋得到。 */
  function initImageFallback() {
    document.addEventListener('error', function (e) {
      var t = e.target;
      if (!t || t.tagName !== 'IMG' || !t.hasAttribute('data-tint')) return;
      t.style.display = 'none';
      if (t.parentNode && t.parentNode.style) {
        t.parentNode.style.background = t.getAttribute('data-tint');
      }
    }, true);
  }

  /* ---------- 啟動 ---------- */
  function boot() {
    initImageFallback();
    buildNav();
    buildFooter();
    initReveal();
    document.dispatchEvent(new CustomEvent('app:ready'));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
