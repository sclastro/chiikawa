/* ==========================================================================
   app.js — 全站共用：頂欄、底部分頁列、目錄與搜尋面板、頁內分頁、
   摺疊清單、錨點跳轉、滾動浮現、共用工具
   導航與頁尾以 JS 注入，確保各頁永遠一致，改一處即全站生效。
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 站點結構（目錄面板、首頁目錄磚、頁尾共用）---------- */
  var SITE = [
    { group: '角色', items: [
      { href: 'characters.html', label: '角色圖鑑', desc: '十六個角色的檔案、性格剖析與名場面', meta: '16 個角色', icon: 'users', tint: '#F4CFC6' },
      { href: 'relations.html',  label: '關係圖',   desc: '點選角色，看牠和誰有甚麼關係',     meta: '互動圖表',  icon: 'network', tint: '#C8D9E6' }
    ] },
    { group: '故事與世界', items: [
      { href: 'stories.html', label: '故事篇章', desc: '六個長篇、八個名場面、時間軸', meta: '6 長篇・8 名場面', icon: 'book',  tint: '#F7E3AC' },
      { href: 'movie.html',   label: '劇場版',   desc: '《人魚之島的秘密》資料與看點', meta: '2026 年 7 月',    icon: 'film',  tint: '#C8D9E6' },
      { href: 'world.html',   label: '世界觀',   desc: '勞動、資格、敵人、食物、鎧甲先生', meta: '20 項設定',   icon: 'globe', tint: '#C6DCCB' }
    ] },
    { group: '參照與互動', items: [
      { href: 'reference.html', label: '人生參照', desc: '交友、讀書、工作、情緒四個領域', meta: '22 條參照', icon: 'spark', tint: '#DCD0E6' },
      { href: 'quiz.html',      label: '性格測驗', desc: '十條問題，看看你最接近哪一個',   meta: '10 題',     icon: 'quiz',  tint: '#F8D7BC' }
    ] },
    { group: '其他', items: [
      { href: 'index.html', label: '首頁',     desc: '由這裡開始', icon: 'home', tint: '#F3EDE1' },
      { href: 'about.html', label: '關於本站', desc: '編寫原則、資料處理與版權', icon: 'info', tint: '#F3EDE1' }
    ] }
  ];

  /* 手機底部分頁列：五格，其餘頁面歸入最接近的一格 */
  var TABS = [
    { href: 'index.html',      label: '首頁', icon: 'home',  match: ['index.html'] },
    { href: 'characters.html', label: '角色', icon: 'users', match: ['characters.html', 'character.html', 'relations.html'] },
    { href: 'stories.html',    label: '故事', icon: 'book',  match: ['stories.html', 'movie.html', 'world.html'] },
    { href: 'reference.html',  label: '參照', icon: 'spark', match: ['reference.html', 'quiz.html'] },
    { sheet: true,             label: '目錄', icon: 'grid',  match: ['about.html'] }
  ];

  /* 桌面頂欄連結（首頁由品牌標誌負責，關於本站放頁尾與目錄） */
  var TOP = ['characters.html', 'relations.html', 'stories.html', 'movie.html', 'world.html', 'reference.html', 'quiz.html'];

  /* ---------- 圖示（24×24 線條）---------- */
  var ICONS = {
    home:    '<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9v10.5a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V9"/>',
    users:   '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M17 4a4 4 0 0 1 0 8"/><path d="M19 21a7 7 0 0 0-3-5.7"/>',
    network: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M10.8 7.2 6.2 15.8M13.2 7.2l4.6 8.6M7.5 18h9"/>',
    book:    '<path d="M4 5a2 2 0 0 1 2-2h5v18H6a2 2 0 0 1-2-2z"/><path d="M20 5a2 2 0 0 0-2-2h-5v18h5a2 2 0 0 0 2-2z"/>',
    film:    '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7.5 4v16M16.5 4v16M3 9.5h4.5M3 14.5h4.5M16.5 9.5H21M16.5 14.5H21"/>',
    globe:   '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"/>',
    spark:   '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3.4"/>',
    quiz:    '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14"/><path d="M12 17.5h.01"/>',
    info:    '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
    grid:    '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
    search:  '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    chev:    '<path d="m9 6 6 6-6 6"/>',
    arrow:   '<path d="M5 12h14M13 6l6 6-6 6"/>',
    filter:  '<path d="M4 6h16M7 12h10M10 18h4"/>',
    heart:   '<path d="M12 21s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.4-7 10-7 10z"/>',
    pin:     '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 共用工具 ---------- */
  var App = {
    SITE: SITE,
    page: function () {
      var p = location.pathname.split('/').pop();
      return p === '' ? 'index.html' : p;
    },
    param: function (key) { return new URLSearchParams(location.search).get(key); },
    /** HTML 逃逸，所有由資料寫入 DOM 的文字都要經過 */
    esc: function (s) {
      return String(s === undefined || s === null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },
    icon: function (name, size) {
      var s = size || 20;
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
             'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
             (ICONS[name] || '') + '</svg>';
    },
    char: function (id) {
      var list = window.CHIIKAWA_CHARACTERS || [];
      for (var i = 0; i < list.length; i++) { if (list[i].id === id) return list[i]; }
      return null;
    },
    /** 角色圖片。data-tint 供載入失敗時的後備填色使用（見 initImageFallback） */
    avatar: function (c, cls) {
      if (!c) return '';
      return '<img src="' + App.esc(c.image) + '" alt="' + App.esc(c.name) +
             '（' + App.esc(c.nameJa) + '）" loading="lazy" decoding="async"' +
             ' data-tint="' + App.esc(c.tint) + '"' +
             (cls ? ' class="' + cls + '"' : '') + '>';
    },
    /** 圓形頭像（含主題色圓環） */
    face: function (c, size, extra) {
      if (!c) return '';
      return '<span class="avatar' + (extra ? ' ' + extra : '') + '" style="--av-tint:' + App.esc(c.tint) +
             (size ? ';--av:' + size + 'px' : '') + '">' + App.avatar(c) + '</span>';
    },
    link: function (id) { return 'character.html?id=' + encodeURIComponent(id); }
  };
  window.App = App;

  function findSiteItem(href) {
    for (var g = 0; g < SITE.length; g++) {
      for (var i = 0; i < SITE[g].items.length; i++) {
        if (SITE[g].items[i].href === href) return SITE[g].items[i];
      }
    }
    return null;
  }

  /* ==========================================================================
     頂欄 + 底部分頁列
     ========================================================================== */
  function buildNav() {
    var host = document.querySelector('[data-nav]');
    if (!host) return;
    var cur = App.page();
    var esc = App.esc;

    var links = TOP.map(function (href) {
      var it = findSiteItem(href);
      var active = href === cur || (cur === 'character.html' && href === 'characters.html');
      return '<li><a href="' + href + '"' + (active ? ' aria-current="page"' : '') + '>' + esc(it.label) + '</a></li>';
    }).join('');

    host.innerHTML =
      '<nav class="nav" aria-label="主導航"><div class="wrap"><div class="nav__inner">' +
        '<a class="nav__brand" href="index.html" aria-label="吉伊卡哇圖鑑 首頁">' +
          '<span class="nav__mark"><img src="images/characters/chiikawa.png" alt="" data-tint="#FFD9E0"></span>' +
          '<span class="nav__name"><b>吉伊卡哇圖鑑</b><small>Chiikawa Archive</small></span>' +
        '</a>' +
        '<ul class="nav__links">' + links + '</ul>' +
        '<button class="nav__search" type="button" data-open-search aria-label="搜尋全站">' +
          App.icon('search', 18) + '<span class="nav__search-label">搜尋</span><kbd>/</kbd>' +
        '</button>' +
      '</div></div></nav>';

    var bar = document.createElement('nav');
    bar.className = 'tabnav';
    bar.setAttribute('aria-label', '快速導航');
    bar.innerHTML = '<ul>' + TABS.map(function (t) {
      var active = t.match.indexOf(cur) !== -1 ? ' aria-current="page"' : '';
      var inner = '<span class="tabnav__icon">' + App.icon(t.icon, 22) + '</span>' + esc(t.label);
      return '<li>' + (t.sheet
        ? '<button type="button" data-open-sheet' + active + '>' + inner + '</button>'
        : '<a href="' + t.href + '"' + active + '>' + inner + '</a>') + '</li>';
    }).join('') + '</ul>';
    document.body.appendChild(bar);
  }

  /* ==========================================================================
     頁尾
     ========================================================================== */
  function buildFooter() {
    var host = document.querySelector('[data-footer]');
    if (!host) return;
    var esc = App.esc;
    host.innerHTML =
      '<footer class="footer">' +
        '<div class="footer__flowers" aria-hidden="true">' + [0, 1, 2, 3, 4, 5, 6].map(function (i) {
          return DECO.flower(['#FFD9E0', '#FFEFB0', '#E9DEF7', '#D6EAF8'][i % 4]);
        }).join('') + '</div>' +
        '<div class="wrap">' +
        '<div class="footer__top">' +
          '<div class="footer__brand"><b>吉伊卡哇圖鑑</b>' +
            '<p>以繁體中文撰寫的非官方資料站，整理角色、故事、世界觀，並嘗試從中抽取可以應用在日常生活的思考。</p></div>' +
          '<div class="footer__cols">' + SITE.map(function (g) {
            return '<div><h3>' + esc(g.group) + '</h3><ul>' + g.items.map(function (it) {
              return '<li><a href="' + it.href + '">' + esc(it.label) + '</a></li>';
            }).join('') + '</ul></div>';
          }).join('') + '</div>' +
        '</div>' +
        '<p class="footer__note">' +
          '《ちいかわ》原作及所有角色之著作權屬 ナガノ 老師及其相關權利人所有。本站為非官方、非商業之愛好者資料站，' +
          '所有文字為原創撰寫之介紹與分析，並非官方文案。本站與版權方並無任何關聯；若權利人認為內容有不妥之處，請聯絡以便移除。' +
        '</p>' +
      '</div></footer>';
  }

  /* ==========================================================================
     資料按需載入
     各頁只載入自己用得着的資料檔。搜尋要用到全部，所以在第一次打開
     搜尋時才補載其餘檔案，平時不增加任何負擔。
     ========================================================================== */
  var DATA_FILES = [
    ['CHIIKAWA_CHARACTERS', 'data/characters.js'],
    ['CHIIKAWA_ARCS',       'data/stories.js'],
    ['CHIIKAWA_WORLD',      'data/world.js'],
    ['CHIIKAWA_REFERENCE',  'data/reference.js']
  ];
  function ensureData(cb) {
    var pending = 0;
    function done() { if (--pending === 0) cb(); }
    DATA_FILES.forEach(function (d) {
      if (window[d[0]]) return;
      pending++;
      var s = document.createElement('script');
      s.src = d[1];
      s.onload = done;
      s.onerror = done;
      document.head.appendChild(s);
    });
    if (!pending) cb();
  }

  /* ==========================================================================
     全站搜尋索引
     每條結果都有可直達的網址；頁內目標（某篇章、某條參照）由 goTo()
     負責切換分頁、展開摺疊，再捲到位置。
     ========================================================================== */
  var INDEX = null;
  var TYPE_ORDER = ['頁面', '角色', '長篇章', '名場面', '世界觀', '人生參照'];

  function buildIndex() {
    var idx = [];
    SITE.forEach(function (g) {
      g.items.forEach(function (it) {
        idx.push({ type: '頁面', title: it.label, sub: it.desc, href: it.href, text: it.desc, icon: it.icon, tint: it.tint });
      });
    });
    (window.CHIIKAWA_CHARACTERS || []).forEach(function (c) {
      idx.push({
        type: '角色', title: c.name, sub: c.nameJa + '・' + c.tagline, href: App.link(c.id), char: c, keepSub: true,
        text: [c.nameJa, c.tagline, c.tierLabel, c.facets.camp, c.facets.temperament, c.facets.group,
               (c.facets.arcs || []).join(' '),
               (c.profile || []).map(function (p) { return p.value; }).join(' ')].join(' ')
      });
    });
    (window.CHIIKAWA_ARCS || []).forEach(function (a) {
      idx.push({ type: '長篇章', title: a.name, sub: a.nameJa + '・' + a.period, href: 'stories.html#arc-' + a.id, tint: a.tint, icon: 'book',
                 text: [a.nameJa, a.summary, a.theme].join(' ') });
    });
    (window.CHIIKAWA_MOMENTS || []).forEach(function (m) {
      idx.push({ type: '名場面', title: m.title, sub: m.titleJa, href: 'stories.html#moment-' + m.id, tint: m.tint, icon: 'heart',
                 text: [m.titleJa, m.body, m.punch].join(' ') });
    });
    (window.CHIIKAWA_WORLD || []).forEach(function (g) {
      g.entries.forEach(function (e, i) {
        idx.push({ type: '世界觀', title: e.title, sub: g.name + '・' + e.badge, href: 'world.html#' + g.id + '-' + (i + 1), tint: g.tint, icon: 'globe',
                   text: [g.name, e.badge, e.body].join(' ') });
      });
    });
    (window.CHIIKAWA_REFERENCE || []).forEach(function (d) {
      d.lessons.forEach(function (l, i) {
        var c = App.char(l.charId);
        idx.push({ type: '人生參照', title: l.title, sub: d.label + (c ? '・' + c.name : ''), href: 'reference.html#' + d.id + '-' + (i + 1),
                   char: c, text: [d.label, l.scene, l.principle, (l.actions || []).join(' ')].join(' ') });
      });
    });
    idx.forEach(function (e) {
      e._t = e.title.toLowerCase();
      e._s = (e.sub || '').toLowerCase();
      e._x = (e.text || '').toLowerCase();
    });
    return idx;
  }

  function search(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    var hits = [];
    INDEX.forEach(function (e, order) {
      var score = 0;
      for (var i = 0; i < terms.length; i++) {
        var t = terms[i];
        var s = 0;
        if (e._t.indexOf(t) !== -1) s += (e._t.indexOf(t) === 0 ? 14 : 10);
        if (e._s.indexOf(t) !== -1) s += 4;
        if (e._x.indexOf(t) !== -1) s += 1;
        if (!s) return;                 // 每個詞都要命中
        score += s;
      }
      hits.push({ e: e, score: score, order: order });
    });
    hits.sort(function (a, b) { return b.score - a.score || a.order - b.order; });
    return hits.map(function (h) { return h.e; });
  }

  function highlight(text, terms) {
    var out = App.esc(text);
    terms.forEach(function (t) {
      var safe = App.esc(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!safe) return;
      out = out.replace(new RegExp('(' + safe + ')', 'gi'), '<mark>$1</mark>');
    });
    return out;
  }

  /** 標題沒有命中時，從內文截取命中處前後的片段作提示 */
  function snippet(e, terms) {
    if (e.keepSub || terms.some(function (t) { return e._t.indexOf(t) !== -1 || e._s.indexOf(t) !== -1; })) return e.sub || '';
    var pos = -1;
    terms.some(function (t) { pos = e._x.indexOf(t); return pos !== -1; });
    if (pos === -1) return e.sub || '';
    var start = Math.max(0, pos - 16);
    return (start > 0 ? '⋯' : '') + e.text.slice(start, pos + 46) + '⋯';
  }

  /* ==========================================================================
     目錄與搜尋面板
     ========================================================================== */
  var sheet, sheetInput, sheetBody, lastFocus;

  function itemHTML(e, terms) {
    var esc = App.esc;
    var lead = e.char
      ? '<span class="sheet-item__icon" style="--item-tint:' + esc(e.char.tint) + '">' + App.avatar(e.char) + '</span>'
      : '<span class="sheet-item__icon" style="--item-tint:' + esc(e.tint || '#F3EDE1') + '">' + App.icon(e.icon || 'pin', 18) + '</span>';
    var title = terms ? highlight(e.title, terms) : esc(e.title);
    var sub = terms ? highlight(snippet(e, terms), terms) : esc(e.sub || '');
    var cur = (!terms && e.href === App.page()) ? ' aria-current="page"' : '';
    return '<li><a class="sheet-item" href="' + esc(e.href) + '"' + cur + '>' + lead +
      '<span><span class="sheet-item__title">' + title + '</span>' +
      (sub ? '<span class="sheet-item__sub">' + sub + '</span>' : '') + '</span>' +
      '<span class="sheet-item__chev">' + App.icon('chev', 16) + '</span></a></li>';
  }

  function renderDirectory() {
    var esc = App.esc;
    var html = '';
    /* 本頁目錄：有分頁的頁面，把分頁列出來，方便直接跳 */
    var tabs = document.querySelectorAll('.tabbar [role="tab"]');
    if (tabs.length) {
      html += '<section class="sheet-group"><h2 class="sheet-group__title">本頁</h2><div class="sheet-quick">' +
        Array.prototype.map.call(tabs, function (t) {
          return '<a class="chip" href="#' + esc(t.getAttribute('aria-controls')) + '">' +
            esc(t.getAttribute('data-label') || t.textContent) + '</a>';
        }).join('') + '</div></section>';
    }
    html += SITE.map(function (g) {
      return '<section class="sheet-group"><h2 class="sheet-group__title">' + esc(g.group) + '</h2>' +
        '<ul class="sheet-list">' + g.items.map(function (it) {
          return itemHTML({ title: it.label, sub: it.desc, href: it.href, icon: it.icon, tint: it.tint });
        }).join('') + '</ul></section>';
    }).join('');
    sheetBody.innerHTML = html;
  }

  function renderResults(q) {
    var esc = App.esc;
    if (!INDEX) { sheetBody.innerHTML = '<p class="sheet-empty">載入資料中⋯⋯</p>'; return; }
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    var hits = search(q);
    if (!hits.length) {
      sheetBody.innerHTML = '<div class="sheet-empty"><p><strong>搵唔到「' + esc(q) + '」</strong></p>' +
        '<p>試吓換個字眼，例如角色名、日文原名（ハチワレ）、或者「考試」「緞帶」等關鍵字。</p></div>';
      return;
    }
    var groups = {};
    hits.forEach(function (e) { (groups[e.type] = groups[e.type] || []).push(e); });
    sheetBody.innerHTML = '<p class="sheet-hint">共 ' + hits.length + ' 項結果</p>' +
      TYPE_ORDER.filter(function (t) { return groups[t]; }).map(function (t) {
        var list = groups[t];
        return '<section class="sheet-group"><h2 class="sheet-group__title">' + esc(t) +
          '<span>' + list.length + '</span></h2><ul class="sheet-list">' +
          list.slice(0, 8).map(function (e) { return itemHTML(e, terms); }).join('') +
          '</ul></section>';
      }).join('');
  }

  function buildSheet() {
    sheet = document.createElement('dialog');
    sheet.className = 'sheet';
    sheet.setAttribute('aria-label', '目錄與搜尋');
    sheet.innerHTML =
      '<div class="sheet__panel">' +
        '<div class="sheet__grab" aria-hidden="true"></div>' +
        '<div class="sheet__head">' +
          '<label class="sheet__field">' + App.icon('search', 18) +
            '<span class="visually-hidden">搜尋全站</span>' +
            '<input type="search" placeholder="搜尋角色、篇章、設定、參照⋯⋯" autocomplete="off" enterkeyhint="search">' +
          '</label>' +
          '<button class="sheet__close" type="button" data-close>關閉</button>' +
        '</div>' +
        '<div class="sheet__body"></div>' +
      '</div>';
    document.body.appendChild(sheet);
    sheetInput = sheet.querySelector('input');
    sheetBody  = sheet.querySelector('.sheet__body');

    var timer;
    sheetInput.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var q = sheetInput.value.trim();
        if (q) { renderResults(q); } else { renderDirectory(); }
        sheetBody.scrollTop = 0;
      }, 80);
    });
    sheetInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var first = sheetBody.querySelector('.sheet-item');
        if (first) { e.preventDefault(); first.click(); }
      }
    });
    sheet.querySelector('[data-close]').addEventListener('click', closeSheet);
    /* 點面板外的半透明位置即關閉 */
    sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });
    sheet.addEventListener('close', function () {
      document.documentElement.classList.remove('has-sheet');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    });
    /* 面板內的連結：同頁錨點直接處理，不重新載入 */
    sheetBody.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href');
      var hashAt = href.indexOf('#');
      var path = hashAt === -1 ? href : href.slice(0, hashAt);
      if (hashAt !== -1 && (path === '' || path === App.page())) {
        e.preventDefault();
        sheet.close();
        var id = href.slice(hashAt + 1);
        history.replaceState(null, '', '#' + id);
        App.goTo(id, true);
      } else if (path === App.page() && hashAt === -1) {
        e.preventDefault();
        sheet.close();
      }
    });
  }

  function openSheet(focusSearch) {
    if (!sheet) buildSheet();
    lastFocus = document.activeElement;
    sheetInput.value = '';
    renderDirectory();
    if (typeof sheet.showModal === 'function') { sheet.showModal(); } else { sheet.setAttribute('open', ''); }
    document.documentElement.classList.add('has-sheet');
    if (focusSearch) { sheetInput.focus(); } else { sheet.querySelector('[data-close]').focus(); }
    if (!INDEX) {
      ensureData(function () {
        INDEX = buildIndex();
        if (sheetInput.value.trim()) renderResults(sheetInput.value.trim());
      });
    }
  }
  function closeSheet() {
    if (!sheet) return;
    if (typeof sheet.close === 'function' && sheet.open) { sheet.close(); } else { sheet.removeAttribute('open'); sheet.dispatchEvent(new Event('close')); }
  }
  App.openSearch = function () { openSheet(true); };

  function initSheetTriggers() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-open-search],[data-open-sheet]') : null;
      if (!t) return;
      e.preventDefault();
      openSheet(t.hasAttribute('data-open-search'));
    });
    /* 「/」快捷鍵開啟搜尋（輸入框內不攔截） */
    document.addEventListener('keydown', function (e) {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      e.preventDefault();
      openSheet(true);
    });
  }

  /* ==========================================================================
     頁內分頁
     標記：.tabbar 內的 [role=tab][aria-controls]，對應的 [role=tabpanel]。
     各頁渲染完內容之後呼叫 App.initTabs(tabbar)。
     ========================================================================== */
  function stickyOffset(bar) {
    var top = parseFloat(getComputedStyle(bar).top) || 0;
    return top + bar.offsetHeight;
  }

  function activate(tab, opts) {
    opts = opts || {};
    var list = tab.closest('[role="tablist"]');
    var tabs = list.querySelectorAll('[role="tab"]');
    Array.prototype.forEach.call(tabs, function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    /* 令選中的分頁在分頁列內可見（只捲分頁列，不捲整頁） */
    var scroller = list;
    var l = tab.offsetLeft, r = l + tab.offsetWidth;
    if (l < scroller.scrollLeft + 16) scroller.scrollLeft = l - 16;
    else if (r > scroller.scrollLeft + scroller.clientWidth - 16) scroller.scrollLeft = r - scroller.clientWidth + 16;

    if (opts.scroll) {
      /* 若已捲過分頁列原位，退回到分頁內容的開端，避免換分頁後停在半中間 */
      var bar = tab.closest('.tabbar');
      var panel = document.getElementById(tab.getAttribute('aria-controls'));
      var y = panel.getBoundingClientRect().top + window.pageYOffset - stickyOffset(bar);
      if (window.pageYOffset > y) window.scrollTo(0, y);
    }
    if (opts.hash) history.replaceState(null, '', '#' + tab.getAttribute('aria-controls'));
    document.dispatchEvent(new CustomEvent('app:tab', { detail: { id: tab.getAttribute('aria-controls') } }));
  }

  App.initTabs = function (bar) {
    if (!bar) return;
    var list = bar.querySelector('[role="tablist"]');
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { activate(t, { scroll: true, hash: true }); });
      t.addEventListener('keydown', function (e) {
        var j = null;
        if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft')  j = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') j = 0;
        if (e.key === 'End')  j = tabs.length - 1;
        if (j === null) return;
        e.preventDefault();
        tabs[j].focus();
        activate(tabs[j], { scroll: true, hash: true });
      });
    });
    var sel = list.querySelector('[aria-selected="true"]') || tabs[0];
    if (sel) activate(sel);
  };

  /** 產生分頁列 HTML：items = [{ id, label, count?, tint? }] */
  App.tabbarHTML = function (items, label) {
    var esc = App.esc;
    return '<div class="tabbar"><div class="wrap"><ul class="tabbar__list" role="tablist" aria-label="' + esc(label || '本頁分頁') + '">' +
      items.map(function (it, i) {
        return '<li role="presentation"><button type="button" role="tab" id="tab-' + esc(it.id) + '" aria-controls="' + esc(it.id) + '"' +
          ' aria-selected="' + (i === 0 ? 'true' : 'false') + '" data-label="' + esc(it.label) + '"' +
          (it.tint ? ' style="--tab-tint:' + esc(it.tint) + '"' : '') + '>' +
          (it.tint ? '<span class="tabbar__dot" aria-hidden="true"></span>' : '') +
          esc(it.label) +
          (it.count !== undefined ? '<span class="tabbar__count">' + esc(it.count) + '</span>' : '') +
          '</button></li>';
      }).join('') + '</ul></div></div>';
  };

  /* ==========================================================================
     跳到頁內任何一個 id：先切換到所屬分頁、展開所屬摺疊，再捲到位
     ========================================================================== */
  App.goTo = function (id, smooth) {
    if (!id) return false;
    var el = document.getElementById(id);
    if (!el) return false;

    var panel = el.getAttribute('role') === 'tabpanel' ? el : el.closest('[role="tabpanel"]');
    if (panel && panel.hidden) {
      var tab = document.querySelector('[role="tab"][aria-controls="' + panel.id + '"]');
      if (tab) activate(tab);
    }
    if (el.tagName === 'DETAILS') el.open = true;
    var det = el.parentElement && el.parentElement.closest('details');
    if (det) det.open = true;
    settle(el);

    var ownTab = el.getAttribute('role') === 'tabpanel'
      ? document.querySelector('[role="tab"][aria-controls="' + el.id + '"]') : null;
    var bar = ownTab ? ownTab.closest('.tabbar') : null;
    requestAnimationFrame(function () {
      if (!bar) {
        el.scrollIntoView({ block: 'start', behavior: smooth && !reduceMotion ? 'smooth' : 'auto' });
      } else {
        /* 目標是整個分頁：捲到分頁列剛好貼頂的位置 */
        var y = el.getBoundingClientRect().top + window.pageYOffset - stickyOffset(bar);
        window.scrollTo({ top: Math.max(0, y), behavior: smooth && !reduceMotion ? 'smooth' : 'auto' });
      }
      if (el.tagName === 'DETAILS') {
        var s = el.querySelector('summary');
        if (s) s.focus({ preventScroll: true });
      }
    });
    return true;
  };

  /** 把目標及其祖先的浮現動畫即時完成，避免捲動位置因位移而計錯 */
  function settle(el) {
    var n = el;
    while (n && n !== document.body) {
      if (n.classList && n.classList.contains('reveal') && !n.classList.contains('is-in')) {
        var touched = [n].concat(Array.prototype.slice.call(n.children));
        touched.forEach(function (x) { x.style.transition = 'none'; });
        n.classList.add('is-in', 'reveal-done');
        void n.offsetHeight;
        touched.forEach(function (x) { x.style.transition = ''; });
      }
      n = n.parentElement;
    }
  }

  function initAnchors() {
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a || (sheet && sheet.contains(a))) return;
      var id = decodeURIComponent(a.getAttribute('href').slice(1));
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      history.replaceState(null, '', '#' + id);
      App.goTo(id, true);
    });
    window.addEventListener('hashchange', function () {
      App.goTo(decodeURIComponent(location.hash.slice(1)), true);
    });
    if (location.hash.length > 1) App.goTo(decodeURIComponent(location.hash.slice(1)), false);
  }

  /* 釘頂分頁列的高度要計入 scroll-padding，否則跳轉後標題被遮 */
  function initScrollPadding() {
    var bar = document.querySelector('.tabbar');
    if (!bar) return;
    function apply() {
      document.documentElement.style.scrollPaddingTop = (Math.ceil(stickyOffset(bar)) + 12) + 'px';
    }
    apply();
    if ('ResizeObserver' in window) { new ResizeObserver(apply).observe(bar); }
    window.addEventListener('resize', apply);
  }

  /* ---------- 摺疊清單：「全部展開／收起」 ---------- */
  function initAccordionTools() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-acc-toggle]') : null;
      if (!b) return;
      var scope = document.getElementById(b.getAttribute('data-acc-toggle'));
      if (!scope) return;
      var items = scope.querySelectorAll('details.acc');
      var anyClosed = Array.prototype.some.call(items, function (d) { return !d.open; });
      Array.prototype.forEach.call(items, function (d) { d.open = anyClosed; });
      b.textContent = anyClosed ? '全部收起' : '全部展開';
    });
  }

  /* ---------- 滾動浮現 ---------- */
  function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('js-anim');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target;
        t.classList.add('is-in');
        io.unobserve(t);
        setTimeout(function () { t.classList.add('reveal-done'); }, 1300);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });

    function scan() {
      var list = document.querySelectorAll('.reveal:not([data-reveal-seen])');
      Array.prototype.forEach.call(list, function (el) {
        el.setAttribute('data-reveal-seen', '');
        if (el.classList.contains('grid') || el.classList.contains('tiles') || el.classList.contains('rail')) {
          el.classList.add('reveal--group');
          Array.prototype.forEach.call(el.children, function (child, i) {
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

  /* ==========================================================================
     裝飾：閃星、心心、小花、音符、雲（全部 aria-hidden）
     ========================================================================== */
  var OUT = '#6B5447';
  var DECO = {
    sparkle: function (c) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5c.9 5.6 4.9 9.6 10.5 10.5-5.6.9-9.6 4.9-10.5 10.5C11.1 16.9 7.1 12.9 1.5 12 7.1 11.1 11.1 7.1 12 1.5z" fill="' + c + '" stroke="' + OUT + '" stroke-width="1.3" stroke-linejoin="round"/></svg>';
    },
    heart: function (c) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-8-4.9-8-11a4.4 4.4 0 0 1 8-2.6 4.4 4.4 0 0 1 8 2.6c0 6.1-8 11-8 11z" fill="' + c + '" stroke="' + OUT + '" stroke-width="1.3" stroke-linejoin="round"/></svg>';
    },
    flower: function (c) {
      return '<svg viewBox="0 0 28 28" aria-hidden="true"><g stroke="' + OUT + '" stroke-width="1.4" fill="' + c + '">' +
        '<circle cx="14" cy="6.5" r="5"/><circle cx="21.5" cy="12" r="5"/><circle cx="18.5" cy="21" r="5"/>' +
        '<circle cx="9.5" cy="21" r="5"/><circle cx="6.5" cy="12" r="5"/></g>' +
        '<circle cx="14" cy="14" r="4" fill="#FFE58A" stroke="' + OUT + '" stroke-width="1.4"/></svg>';
    },
    note: function (c) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18.5a3 2.5 0 1 1-3-2.5 3 3 0 0 1 3 .6V4.5l10-2v12a3 2.5 0 1 1-3-2.5 3 3 0 0 1 3 .6" fill="' + c + '" stroke="' + OUT + '" stroke-width="1.3" stroke-linejoin="round"/></svg>';
    },
    dot: function (c) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="' + c + '" stroke="' + OUT + '" stroke-width="1.3"/></svg>';
    },
    bubble: function () {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="rgba(255,255,255,.55)" stroke="' + OUT + '" stroke-width="1.2"/><path d="M8 9.5a4.5 4.5 0 0 1 3.5-2.8" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>';
    }
  };
  var PASTELS = ['#FFD9E0', '#FFEFB0', '#D6EAF8', '#D9EFD2', '#E9DEF7', '#FFE2CF'];
  App.DECO = DECO;

  /** 以種子產生的偽隨機數：同一頁每次排位一樣，不會每次重新整理都亂跳 */
  function seeded(seed) {
    var x = 0;
    for (var i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) >>> 0;
    return function () { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; };
  }

  /**
   * 在容器內鋪一層飄浮裝飾。
   * opts.kinds：使用的圖形；opts.n：數量；opts.avoid：避開的區域（左側文字位置）
   */
  App.deco = function (host, opts) {
    if (!host || host.querySelector(':scope > .deco')) return;
    opts = opts || {};
    var kinds = opts.kinds || ['sparkle', 'sparkle', 'heart', 'flower', 'dot'];
    /* 手機上文字佔滿全幅，右邊一欄也會疊字，只用頂部與底部，數量減少 */
    var narrow = window.innerWidth < 760;
    var n = Math.round((opts.n || 9) * (narrow && !opts.full ? 0.6 : 1));
    var rnd = seeded((opts.seed || App.page()) + (host.className || ''));
    var layer = document.createElement('div');
    layer.className = 'deco';
    layer.setAttribute('aria-hidden', 'true');
    var html = '';
    for (var i = 0; i < n; i++) {
      var k = kinds[Math.floor(rnd() * kinds.length)];
      var color = PASTELS[Math.floor(rnd() * PASTELS.length)];
      if (k === 'sparkle' && rnd() < 0.5) color = '#FFE58A';
      /* 只放在邊緣地帶（右邊一欄、頂部一條、底部一條），不疊在文字上；
         full 用於本身沒有文字的舞台，可以全幅散佈 */
      var left, top, zone = rnd();
      if (opts.full) { left = rnd() * 94; top = rnd() * 60 + 2; }
      else if (zone < 0.5 && !narrow) { left = 88 + rnd() * 9; top = rnd() * 86 + 4; }
      else if (zone < 0.5) { left = 60 + rnd() * 36; top = 2 + rnd() * 6; }
      else if (zone < 0.8) { left = 30 + rnd() * 66; top = 2 + rnd() * 7; }
      else { left = rnd() * 96; top = 90 + rnd() * 5; }
      var size = (k === 'dot' ? 8 + rnd() * 8 : 14 + rnd() * (opts.big ? 22 : 14));
      var anim = k === 'sparkle' ? 'deco__twinkle' : 'deco__float';
      html += '<span class="' + anim + '" style="left:' + left.toFixed(1) + '%;top:' + top.toFixed(1) + '%;width:' + size.toFixed(0) +
        'px;height:' + size.toFixed(0) + 'px;animation-delay:-' + (rnd() * 4).toFixed(2) + 's">' +
        (DECO[k] ? DECO[k](color) : '') + '</span>';
    }
    layer.innerHTML = html;
    host.classList.add('has-deco');
    host.insertBefore(layer, host.firstChild);
  };

  /* 頁首吉祥物：<header class="page-head" data-mascot="角色id" data-say="對白"> */
  function initMascots() {
    var heads = document.querySelectorAll('.page-head');
    Array.prototype.forEach.call(heads, function (h) {
      App.deco(h, { n: 10 });
      var id = h.getAttribute('data-mascot');
      var inner = h.querySelector('.page-head__inner');
      if (!id || !inner) return;
      var img = h.getAttribute('data-mascot-img') || ('images/characters/' + id + '.png');
      var say = h.getAttribute('data-say');
      var m = document.createElement('div');
      m.className = 'mascot';
      m.setAttribute('aria-hidden', 'true');
      m.innerHTML = (say ? '<span class="bubble">' + App.esc(say) + '</span>' : '') +
        '<span class="mascot__face"><img src="' + App.esc(img) + '" alt="" data-tint="#fff"></span>';
      inner.appendChild(m);
    });
  }

  /* ==========================================================================
     圖片底色：角色圖都不是透明底，有的是白底、有的是草地或粉紅底。
     讀取圖片左上角的顏色，填到相框上，令圖與框融為一體，不會出現
     「白框裡面一塊綠色方塊」。以本機檔案開啟時 canvas 讀不到像素，
     就保持白色，不影響顯示。
     ========================================================================== */
  var bgCache = {};
  function frameColor(img) {
    var src = img.currentSrc || img.src;
    if (bgCache[src] !== undefined) return bgCache[src];
    var color = null;
    try {
      var c = document.createElement('canvas');
      c.width = 4; c.height = 4;
      var x = c.getContext('2d');
      x.drawImage(img, 0, 0, 4, 4, 0, 0, 4, 4);
      var d = x.getImageData(1, 1, 1, 1).data;
      if (d[3] > 200) color = 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')';
    } catch (err) { color = null; }
    bgCache[src] = color;
    return color;
  }
  function paintFrame(img) {
    if (!img || img.tagName !== 'IMG' || !img.hasAttribute('data-tint') || !img.naturalWidth) return;
    var color = frameColor(img);
    if (color && img.parentNode && img.parentNode.style) img.parentNode.style.backgroundColor = color;
  }
  function initFramePaint() {
    document.addEventListener('load', function (e) { paintFrame(e.target); }, true);
  }
  function paintLoaded() {
    Array.prototype.forEach.call(document.querySelectorAll('img[data-tint]'), function (img) {
      if (img.complete) paintFrame(img);
    });
  }

  /* ==========================================================================
     點擊閃星：按下按鈕、卡片時散出幾粒小星星
     ========================================================================== */
  App.burst = function (x, y, n, spread) {
    if (reduceMotion) return;
    var b = document.createElement('div');
    b.className = 'burst';
    b.style.left = x + 'px';
    b.style.top = y + 'px';
    var html = '';
    n = n || 7;
    spread = spread || 46;
    for (var i = 0; i < n; i++) {
      var a = (Math.PI * 2 * i) / n + Math.random() * 0.6;
      var r = spread * (0.6 + Math.random() * 0.6);
      html += '<i style="--bx:' + (Math.cos(a) * r).toFixed(0) + 'px;--by:' + (Math.sin(a) * r).toFixed(0) +
        'px;--bc:' + PASTELS.concat(['#FFE58A', '#E2768B'])[i % 8] + ';animation-delay:' + (Math.random() * 60).toFixed(0) + 'ms"></i>';
    }
    b.innerHTML = html;
    document.body.appendChild(b);
    setTimeout(function () { b.remove(); }, 900);
  };
  function initTapBurst() {
    var SEL = '.btn, .tile, .char-card, .chip, .tabnav a, .tabnav button, .searchbar, .quiz-option, [role="tab"], .lead-card, .pager a, .moment';
    document.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      var t = e.target.closest ? e.target.closest(SEL) : null;
      if (t) App.burst(e.clientX, e.clientY, 7, 40);
    }, { passive: true });
  }

  /* ---------- 圖片載入失敗的後備顯示 ---------- */
  function initImageFallback() {
    document.addEventListener('error', function (e) {
      var t = e.target;
      if (!t || t.tagName !== 'IMG' || !t.hasAttribute('data-tint')) return;
      t.style.display = 'none';
      if (t.parentNode && t.parentNode.style) t.parentNode.style.background = t.getAttribute('data-tint');
    }, true);
  }

  /* ---------- 啟動 ---------- */
  function boot() {
    initImageFallback();
    initFramePaint();
    initTapBurst();
    buildNav();
    buildFooter();
    initSheetTriggers();
    initAccordionTools();
    initReveal();
    initMascots();
    document.dispatchEvent(new CustomEvent('app:ready'));
    paintLoaded();
    // 必須在 app:ready 之後：分頁列與內容是各頁腳本在該事件內才注入的
    initScrollPadding();
    initAnchors();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
