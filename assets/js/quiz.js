/* ==========================================================================
   quiz.js — 性格測驗
   計分後以「該角色的理論最高分」正規化，令冷門角色同樣有機會成為結果。
   ========================================================================== */
(function () {
  'use strict';

  document.addEventListener('app:ready', function () {
    var esc  = App.esc;
    var Q    = window.CHIIKAWA_QUIZ;
    var host = document.querySelector('[data-quiz]');
    if (!Q || !host) return;

    var introEl = document.querySelector('[data-quiz-intro]');
    if (introEl) introEl.textContent = Q.intro;

    /* 每個角色的理論最高分，用作正規化分母 */
    var maxScore = {};
    Q.questions.forEach(function (q) {
      var best = {};
      q.options.forEach(function (o) {
        Object.keys(o.scores).forEach(function (k) {
          best[k] = Math.max(best[k] || 0, o.scores[k]);
        });
      });
      Object.keys(best).forEach(function (k) {
        maxScore[k] = (maxScore[k] || 0) + best[k];
      });
    });

    var step   = 0;
    var totals = {};

    function progress() {
      var pct = Math.round((step / Q.questions.length) * 100);
      return '<div class="quiz-progress"><div class="quiz-progress__bar" style="width:' + pct + '%"></div></div>' +
             '<p style="font-size:var(--t-tiny);color:var(--c-ink-soft);margin-bottom:var(--s-4)">' +
             '第 ' + (step + 1) + ' 題／共 ' + Q.questions.length + ' 題</p>';
    }

    function renderQuestion() {
      var q = Q.questions[step];
      host.innerHTML = progress() +
        '<h2 class="quiz-q">' + esc(q.q) + '</h2>' +
        '<div class="quiz-options">' +
          q.options.map(function (o, i) {
            return '<button class="quiz-option" type="button" data-opt="' + i + '">' + esc(o.text) + '</button>';
          }).join('') +
        '</div>' +
        (step > 0
          ? '<p style="margin-top:var(--s-5)"><button class="btn btn--ghost" type="button" data-back>← 返回上一題</button></p>'
          : '');

      host.querySelectorAll('[data-opt]').forEach(function (b) {
        b.addEventListener('click', function () {
          var chosen = q.options[Number(b.dataset.opt)];
          Object.keys(chosen.scores).forEach(function (k) {
            totals[k] = (totals[k] || 0) + chosen.scores[k];
          });
          q._picked = Number(b.dataset.opt);
          step++;
          if (step >= Q.questions.length) { renderResult(); } else { renderQuestion(); }
          host.scrollIntoView({ block: 'nearest', behavior: 'auto' });
        });
      });

      var back = host.querySelector('[data-back]');
      if (back) {
        back.addEventListener('click', function () {
          step--;
          var prev = Q.questions[step];
          if (prev._picked !== undefined) {
            var s = prev.options[prev._picked].scores;
            Object.keys(s).forEach(function (k) { totals[k] = (totals[k] || 0) - s[k]; });
            delete prev._picked;
          }
          renderQuestion();
        });
      }
    }

    function renderResult() {
      /* 正規化後取最高 */
      var best = null, bestVal = -1;
      Q.results.forEach(function (id) {
        var v = (totals[id] || 0) / (maxScore[id] || 1);
        if (v > bestVal) { bestVal = v; best = id; }
      });

      var c = App.char(best);
      var v = Q.verdicts[best];
      var domains = window.CHIIKAWA_DOMAINS || {};
      var d = domains[v.domain] || { label: v.domain };

      /* 次高，作為補充 */
      var second = null, secondVal = -1;
      Q.results.forEach(function (id) {
        if (id === best) return;
        var val = (totals[id] || 0) / (maxScore[id] || 1);
        if (val > secondVal) { secondVal = val; second = id; }
      });
      var c2 = App.char(second);

      host.innerHTML =
        '<div class="quiz-result" style="text-align:center">' +
          '<span class="eyebrow">測驗結果</span>' +
          '<div class="quiz-result__avatar">' + App.avatar(c) + '</div>' +
          '<h2 style="margin-bottom:var(--s-1)">' + esc(c.name) + '</h2>' +
          '<p class="ja" style="color:var(--c-ink-soft);font-size:var(--t-small)">' + esc(c.nameJa) + '</p>' +
          '<p style="font-family:var(--f-heading);font-size:1.15rem;color:var(--c-ink-strong);line-height:var(--lh-normal);margin:var(--s-4) 0">' +
            esc(v.headline) + '</p>' +
        '</div>' +
        '<p style="text-align:left">' + esc(v.body) + '</p>' +
        '<div class="scene__why" style="text-align:left">' +
          '<strong>建議由這個領域入手：</strong>' + esc(d.label) +
          '　<a href="reference.html#' + esc(v.domain) + '">去睇對應嘅人生參照 →</a>' +
        '</div>' +
        (c2 ? '<p style="font-size:var(--t-small);color:var(--c-ink-soft);margin-top:var(--s-5);text-align:left">' +
              '你同時有唔少<a href="' + App.link(c2.id) + '">' + esc(c2.name) + '</a>嘅特質。' +
              '兩個角色嘅做法可以對照住睇。</p>' : '') +
        '<p style="margin-top:var(--s-6);display:flex;flex-wrap:wrap;gap:var(--s-3)">' +
          '<a class="btn btn--primary" href="' + App.link(c.id) + '">睇' + esc(c.name) + '嘅完整檔案</a>' +
          '<button class="btn btn--ghost" type="button" data-restart>再玩一次</button>' +
        '</p>';

      var again = host.querySelector('[data-restart]');
      if (again) {
        again.addEventListener('click', function () {
          step = 0; totals = {};
          Q.questions.forEach(function (q) { delete q._picked; });
          renderQuestion();
        });
      }
    }

    renderQuestion();
  });
})();
