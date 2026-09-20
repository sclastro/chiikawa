/* ==========================================================================
   relations.js — 互動式關係網絡圖
   節點座標固定（不用力導向演算法），確保在任何裝置上排位一致、不會亂跳。
   ========================================================================== */
(function () {
  'use strict';

  /* 固定座標，依敘事上的親疏安排：主角居中，鎧甲系統在下，島篇相關在右上 */
  var POS = {
    chiikawa:        [500, 360],
    hachiware:       [340, 270],
    usagi:           [660, 270],
    rakko:           [500, 150],
    momonga:         [215, 140],
    furuhonya:       [105, 265],
    kurimanju:       [215, 470],
    shisa:           [800, 455],
    'ro-yoroi':      [790, 620],
    'rodo-yoroi':    [500, 545],
    'pochette-yoroi':[355, 655],
    dekatsuyo:       [110, 605],
    anoko:           [250, 660],
    seiren:          [880, 175],
    shimajiro:       [935, 320],
    'hitoha-futaba': [740, 80]
  };

  var R = 30;

  document.addEventListener('app:ready', function () {
    var esc   = App.esc;
    var svg   = document.querySelector('[data-relmap]');
    var panel = document.querySelector('[data-relmap-panel]');
    if (!svg) return;

    var chars = (window.CHIIKAWA_CHARACTERS || []).filter(function (c) { return POS[c.id]; });

    /* ---- 由角色資料推導邊（去重）---- */
    var edges = [];
    var seen  = {};
    chars.forEach(function (c) {
      (c.relations || []).forEach(function (r) {
        if (!POS[r.id]) return;
        var key = [c.id, r.id].sort().join('|');
        if (seen[key]) return;
        seen[key] = true;
        edges.push({ a: c.id, b: r.id, type: r.type });
      });
    });

    /* ---- 繪製 ---- */
    var NS = 'http://www.w3.org/2000/svg';
    function el(name, attrs) {
      var n = document.createElementNS(NS, name);
      Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
      return n;
    }

    var gEdges = el('g', {});
    var gNodes = el('g', {});
    svg.appendChild(gEdges);
    svg.appendChild(gNodes);

    edges.forEach(function (e) {
      var a = POS[e.a], b = POS[e.b];
      var line = el('line', {
        x1: a[0], y1: a[1], x2: b[0], y2: b[1],
        stroke: '#D3C4AE', 'stroke-width': 2, 'stroke-linecap': 'round',
        class: 'relmap-edge'
      });
      line.dataset.a = e.a;
      line.dataset.b = e.b;
      gEdges.appendChild(line);
    });

    chars.forEach(function (c) {
      var p = POS[c.id];
      var g = el('g', {
        class: 'relmap-node', tabindex: '0', role: 'button',
        'aria-label': c.name + '（' + c.nameJa + '），查看關係'
      });
      g.dataset.id = c.id;
      g.appendChild(el('circle', {
        cx: p[0], cy: p[1], r: R,
        fill: c.tint, stroke: '#FFFFFF', 'stroke-width': 3
      }));
      var label = el('text', {
        x: p[0], y: p[1] + R + 17, 'text-anchor': 'middle'
      });
      label.textContent = c.name;
      g.appendChild(label);
      gNodes.appendChild(g);
    });

    /* ---- 互動 ---- */
    var focused = null;

    function defaultPanel() {
      panel.innerHTML =
        '<span class="eyebrow">未選取</span>' +
        '<h3 style="font-size:1.05rem">揀一個角色</h3>' +
        '<p style="font-size:var(--t-small);color:var(--c-ink-soft);line-height:var(--lh-normal);margin:0">' +
          '圖中共 ' + chars.length + ' 個角色、' + edges.length + ' 條關係線。' +
          '點選任何一個圓點，就會突顯牠的所有關係，並在這裡列出詳細說明。' +
        '</p>';
    }

    function showPanel(c) {
      var rels = (c.relations || []).map(function (r) {
        var o = App.char(r.id);
        if (!o) return '';
        return '<a class="rel-item" href="' + App.link(o.id) + '" style="--rel-tint:' + esc(o.tint) + ';padding:var(--s-3)">' +
          '<span class="rel-item__avatar" style="width:36px;height:36px">' + App.avatar(o) + '</span>' +
          '<span><span class="rel-item__name" style="font-size:var(--t-small)">' + esc(o.name) +
            '<span class="rel-item__type">' + esc(r.type) + '</span></span>' +
            '<p style="font-size:var(--t-tiny)">' + esc(r.body) + '</p></span></a>';
      }).join('');

      panel.innerHTML =
        '<span class="eyebrow">' + esc(c.tierLabel) + '</span>' +
        '<h3 style="font-size:1.15rem;margin-bottom:var(--s-1)">' + esc(c.name) + '</h3>' +
        '<p class="ja" style="font-size:var(--t-tiny);color:var(--c-ink-soft)">' + esc(c.nameJa) + '</p>' +
        '<p style="font-size:var(--t-small);line-height:var(--lh-normal)">' + esc(c.tagline) + '</p>' +
        '<div class="rel-list" style="margin:var(--s-4) 0">' + rels + '</div>' +
        '<a class="btn btn--primary" href="' + App.link(c.id) + '">睇完整檔案</a>';
    }

    function setFocus(id) {
      focused = id;
      var map = svg.classList;
      if (!id) {
        map.remove('is-focused');
        gNodes.querySelectorAll('.relmap-node').forEach(function (n) { n.classList.remove('is-active'); });
        gEdges.querySelectorAll('.relmap-edge').forEach(function (l) { l.classList.remove('is-active'); });
        defaultPanel();
        return;
      }
      map.add('is-focused');
      var neighbours = {};
      neighbours[id] = true;
      gEdges.querySelectorAll('.relmap-edge').forEach(function (l) {
        var hit = (l.dataset.a === id || l.dataset.b === id);
        l.classList.toggle('is-active', hit);
        if (hit) { neighbours[l.dataset.a] = true; neighbours[l.dataset.b] = true; }
      });
      gNodes.querySelectorAll('.relmap-node').forEach(function (n) {
        n.classList.toggle('is-active', !!neighbours[n.dataset.id]);
      });
      showPanel(App.char(id));
    }

    gNodes.querySelectorAll('.relmap-node').forEach(function (n) {
      function toggle() { setFocus(focused === n.dataset.id ? null : n.dataset.id); }
      n.addEventListener('click', toggle);
      n.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && focused) setFocus(null);
    });

    /* ---- 由網址參數預先聚焦 ---- */
    var pre = App.param('focus');
    if (pre && App.char(pre) && POS[pre]) { setFocus(pre); } else { defaultPanel(); }
  });
})();
