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

  /* ---------- 滾動淡入 ----------
     重要：各頁的內容是在 app:ready 之後才注入的，若只在啟動時掃描一次，
     動態產生的 .reveal 永遠不會被監看，會一直停在 opacity:0——畫面上
     完全看不見。故此以 MutationObserver 持續接手新加入的元素。

     另一重保險在 CSS：隱藏樣式只在 <html> 有 js-anim 時生效，而這個
     class 由下面的程式碼加上。萬一 JS 失效，內容照樣看得見。 */
  function initReveal() {
    var root = document.documentElement;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || !('IntersectionObserver' in window)) {
      return;   // 不加 js-anim，一切維持可見，毋須任何動畫
    }
    root.classList.add('js-anim');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.04 });

    /** 掃描並接手所有未處理的 .reveal */
    function scan(scope) {
      var list = (scope || document).querySelectorAll('.reveal:not([data-reveal-seen])');
      Array.prototype.forEach.call(list, function (el) {
        el.setAttribute('data-reveal-seen', '');
        // 網格類容器改為逐個子項交錯浮現，比整塊一次過淡入耐看
        if (el.classList.contains('grid')) {
          el.classList.add('reveal--group');
          Array.prototype.forEach.call(el.children, function (child, i) {
            // 上限 5：八張卡的網格若逐張全額遞增，最後一張要等超過一秒才現身
            child.style.setProperty('--reveal-i', Math.min(i, 5));
          });
        }
        io.observe(el);
      });
    }

    scan();

    if ('MutationObserver' in window) {
      new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          if (muts[i].addedNodes.length) { scan(); return; }
        }
      }).observe(document.body, { childList: true, subtree: true });
    }
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

  /* ---------- 錨點跳轉的頂部留白 ----------
     有 .anchor-nav 的頁面，該列會釘在畫面最頂。若不把它的高度算進
     scroll-padding-top，點連結之後目標標題會被它整條蓋住（實測被遮
     48–69px）。高度會因視窗闊度而變（窄屏文字換行），所以每次改變
     尺寸都重新量度，不寫死數值。 */
  function initScrollPadding() {
    var bar = document.querySelector('.anchor-nav');
    if (!bar) return;
    function apply() {
      document.documentElement.style.scrollPaddingTop =
        (Math.ceil(bar.getBoundingClientRect().height) + 16) + 'px';
    }
    apply();
    if ('ResizeObserver' in window) {
      new ResizeObserver(apply).observe(bar);
    } else {
      window.addEventListener('resize', apply);
    }
  }

  /* ---------- 頁內錨點 ----------
     兩個問題：
     一、浮現動畫未完成時元素仍帶 22px 位移，瀏覽器據此計算捲動位置，
         動畫結束後內容上移，標題就鑽到錨點列底下（實測被遮 10–12px）。
         所以跳轉前先把目標標記為已浮現，令版面在捲動前已經穩定。
     二、以 #hash 直接開啟時，瀏覽器在各頁腳本注入內容之前就嘗試捲動，
         結果甚麼都找不到，只停在頂部。內容到位後補做一次。 */
  function initAnchorLinks() {
    /* 把目標及其祖先立即定位。只加 is-in 不足夠：那只是啟動一條 720ms 的
       過渡，瀏覽器計算捲動目標時元素仍帶著 22px 位移與 0.985 縮放（合共
       約 26px），結果捲過了頭。必須暫停過渡並強制重排，令 transform 即時
       歸零，之後才還原過渡設定。 */
    function settle(el) {
      var n = el;
      while (n && n !== document.body) {
        if (n.classList && n.classList.contains('reveal') && !n.classList.contains('is-in')) {
          var touched = [n].concat(Array.prototype.slice.call(n.children));
          var prev = touched.map(function (x) { return x.style.transition; });
          touched.forEach(function (x) { x.style.transition = 'none'; });
          n.classList.add('is-in');
          void n.offsetHeight;                       // 強制重排
          touched.forEach(function (x, i) { x.style.transition = prev[i] || ''; });
        }
        n = n.parentElement;
      }
    }

    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var t = document.getElementById(id);
      if (t) settle(t);
    }, true);

    if (location.hash.length > 1) {
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) {
        settle(t);
        // 跳過本次繪製，等 scroll-padding 與版面都定下來再捲
        requestAnimationFrame(function () {
          t.scrollIntoView({ behavior: 'auto', block: 'start' });
        });
      }
    }
  }

  /* ---------- 啟動 ---------- */
  function boot() {
    initImageFallback();
    buildNav();
    buildFooter();
    initReveal();
    document.dispatchEvent(new CustomEvent('app:ready'));
    // 必須在 app:ready 之後：角色詳情頁的 .anchor-nav 是各頁腳本在該事件
    // 內才注入的，事件之前查不到。監聽器是同步執行，此時內容已經在場。
    initScrollPadding();
    initAnchorLinks();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
