/* Анкета предзаписи на Большую Игру 2.0: четыре шага в окне, как форма заявки (bolshaya-igra/tariff-forms.js).
   Ответы уходят в тот же Apps Script. При сбое анкета ждёт в браузере и уходит при следующем заходе. Оплаты после анкеты нет. */
(function () {
  if (window.__pzForm) return; window.__pzForm = true;
  var EP = "https://script.google.com/macros/s/AKfycbyHbXYMZMWX1belQqULpMz84rfmhP2LXmcIMzroqhr4PKjvNOxIR4lump3OfY04ZC4x/exec", STORE = "bg_lead_q", REV = "2026-10-04", CHANNEL = "https://t.me/+F5GJpvgqQGM4MDVi";
  var css =
  ".bgl-overlay{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(31,31,31,.62);padding:16px;visibility:hidden;opacity:0;pointer-events:none;transition:opacity .2s ease}" +
  ".bgl-overlay.open{visibility:visible;opacity:1;pointer-events:auto}" +
  ".bgl-box{position:relative;width:100%;max-width:480px;max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);overflow-y:auto;-webkit-overflow-scrolling:touch;background:#F6EEE2;color:#1F1F1F;border-radius:6px;padding:clamp(22px,5vw,32px) clamp(18px,4vw,28px) clamp(20px,4vw,26px);box-shadow:0 30px 80px -20px rgba(31,31,31,.5);font-family:'Manrope',system-ui,sans-serif}" +
  ".bgl-close{position:absolute;top:12px;right:12px;width:34px;height:34px;border:none;background:rgba(31,31,31,.08);border-radius:999px;font-size:1.05rem;color:#1F1F1F;cursor:pointer;line-height:1}" +
  ".bgl-title{margin:0 0 6px;font-family:'Unbounded',system-ui,sans-serif;font-weight:800;font-size:1.35rem;line-height:1.15;padding-right:40px}" +
  ".bgl-sub{margin:0 0 18px;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#C05B3B}" +
  ".bgl-lead{margin:0 0 18px;font-size:15px;line-height:1.45;color:rgba(31,31,31,.75)}" +
  ".bgl-label{display:block;margin:0 0 6px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(31,31,31,.6)}" +
  ".bgl-field{margin:0 0 14px}" +
  ".bgl-chips{display:flex;flex-wrap:wrap;gap:8px}" +
  ".bgl-chip{border:1.5px solid rgba(31,31,31,.25);background:transparent;border-radius:999px;padding:8px 14px;font:600 14px/1.2 'Manrope',system-ui,sans-serif;color:#1F1F1F;cursor:pointer}" +
  ".bgl-chip.on{background:#1F1F1F;border-color:#1F1F1F;color:#F6EEE2}" +
  ".bgl-input{display:block;width:100%;box-sizing:border-box;border:1.5px solid rgba(31,31,31,.25);border-radius:4px;background:#FFFDF8;padding:12px 14px;font:600 16px/1.3 'Manrope',system-ui,sans-serif;color:#1F1F1F;outline:none}" +
  ".bgl-input:focus{border-color:#1F1F1F}" +
  ".bgl-input.bad,.bgl-chips.bad{border-color:#C05B3B}" +
  ".bgl-hint{margin:5px 0 0;font-size:12px;color:rgba(31,31,31,.55)}" +
  ".bgl-err{margin:6px 0 0;font-size:13px;font-weight:700;color:#C05B3B}" +
  ".bgl-chk{display:flex;gap:10px;align-items:flex-start;margin:0 0 10px;font-size:13px;line-height:1.4;color:rgba(31,31,31,.75);cursor:pointer}" +
  ".bgl-chk input{flex:none;width:18px;height:18px;margin:1px 0 0;accent-color:#1F1F1F}" +
  ".bgl-chk a{color:#1F1F1F;text-decoration:underline}" +
  ".bgl-btn{display:block;width:100%;margin:16px 0 0;border:none;border-radius:4px;background:#C05B3B;color:#F6EEE2;padding:15px 18px;font:800 16px/1.2 'Unbounded',system-ui,sans-serif;cursor:pointer}" +
  ".bgl-btn:hover{background:#A44A2E}.bgl-btn[disabled]{opacity:.6;cursor:default}" +
  ".bgl-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}" +
  ".bgl-done{text-align:left}.bgl-done p{margin:0 0 14px;font-size:15px;line-height:1.5}" +
  ".bgl-done a{color:#1F1F1F;font-weight:700}" +
  "a.bgl-btn{box-sizing:border-box;text-align:center;text-decoration:none;color:#F6EEE2}" +
  ".bgl-btn2{background:#1F1F1F}.bgl-btn2:hover{background:#000}" +
  ".bgl-pay.off{opacity:.45}" +
  ".bgl-done .bgl-hint{margin:6px 0 0;font-size:12px;text-align:center}" +
  ".bgl-done .bgl-note{margin:18px 0 0;font-size:13px;line-height:1.45;color:rgba(31,31,31,.65)}";
  css += ".pz-step{margin:0 0 6px;font:800 11px/1.3 'Manrope',system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:.6}" +
    ".pz-bar{height:4px;margin:0 0 18px;border-radius:4px;background:rgba(128,128,128,.25);overflow:hidden}.pz-bar i{display:block;height:100%;background:#B8243A;transition:width .25s}" +
    ".pz-opts{display:flex;flex-wrap:wrap;gap:8px}.pz-opt{position:relative;cursor:pointer}.pz-opt input{position:absolute;opacity:0;pointer-events:none}" +
    ".pz-opt span{display:block;padding:10px 14px;border:1.5px solid rgba(128,128,128,.45);border-radius:14px;font:600 14.5px/1.25 'Manrope',system-ui,sans-serif}" +
    ".pz-opt input:checked+span{background:#B8243A;border-color:#B8243A;color:#FFF8EE}.pz-opt input:focus-visible+span{outline:2px solid currentColor;outline-offset:2px}" +
    ".pz-opts.bad .pz-opt span{border-color:#C05B3B}.pz-nav{display:flex;gap:10px;align-items:stretch}.pz-nav .bgl-btn{flex:1}.pz-back{flex:0 0 auto!important;width:auto!important;padding-inline:18px!important;background:transparent!important;color:inherit!important;border:1.5px solid rgba(128,128,128,.45)!important;box-shadow:none!important}" +
    "textarea.bgl-input{min-height:84px;resize:vertical}" +
    ".pz-get{margin:0 0 18px;padding:14px 16px;border-radius:16px;background:rgba(184,36,58,.1);border:1px solid rgba(184,36,58,.3)}.pz-get p{margin:0 0 8px;font:800 11px/1.3 'Manrope',system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:.7}" +
    ".pz-get ul{margin:0;padding:0;list-style:none;display:grid;gap:6px}.pz-get li{position:relative;padding-left:22px;font:500 14px/1.4 'Manrope',system-ui,sans-serif}.pz-get li::before{content:'✓';position:absolute;left:0;font-weight:800;color:#B8243A}";
  var st = document.createElement("style"); st.textContent = css;

  // t: text, area, one (один вариант), many (несколько). req: обязательный
  var STEPS = [
    { title: "Контакты", q: [
      { k: "name", l: "Имя", t: "text", req: 1, ac: "given-name" },
      { k: "age", l: "Возраст", t: "text", req: 1, mode: "numeric" },
      { k: "tg", l: "Ник в Телеграме", t: "text", req: 1, ph: "@nickname" },
      { k: "inst", l: "Ссылка на Инстаграм", t: "text", req: 1, ph: "instagram.com/…" },
      { k: "phone", l: "Номер телефона", t: "text", req: 1, mode: "tel", ph: "+7 900 000-00-00", ac: "tel" } ] },
    { title: "Блог", q: [
      { k: "blog", l: "Что сейчас с блогом?", t: "one", req: 1, o: ["Нет блога", "Только начинаю", "Веду, но не растёт", "Веду, и он растёт"] },
      { k: "subs", l: "Сколько подписчиков?", t: "one", req: 1, o: ["Нет", "До 1 000", "1–5 тыс", "5–20 тыс", "Больше 20 тыс"] },
      { k: "why", l: "Зачем тебе блог?", t: "one", req: 1, o: ["Для себя", "Чтобы приходили клиенты", "Хочу стать блогером и зарабатывать на этом"] },
      { k: "topic", l: "О чём твой блог или хотела бы?", t: "area", hint: "Необязательно" } ] },
    { title: "Что мешает", q: [
      { k: "stop", l: "Что останавливает снимать?", t: "many", req: 1, hint: "Можно несколько", o: ["Мой контент никому не нужен", "Кажется, что я кринж", "Нет идей, о чём снимать", "Тем много, не могу выбрать одну", "Боюсь, что осудят знакомые", "Переснимаю и удаляю", "Руки не доходят"] },
      { k: "courses", l: "Проходила курсы по блогингу?", t: "one", req: 1, o: ["Да, помогло", "Да, не помогло", "Нет"] },
      { k: "before", l: "Была с нами раньше?", t: "one", req: 1, o: ["На Разминке", "В Большой Игре", "Нет"] } ] },
    { title: "Готовность", q: [
      { k: "when", l: "Когда готова начать?", t: "one", req: 1, o: ["Прямо сейчас", "В ближайший месяц", "Позже, пока присматриваюсь"] },
      { k: "invest", l: "Готова вкладываться в обучение?", t: "one", req: 1, o: ["Да", "Зависит от цены", "Нет, ищу бесплатное"] },
      { k: "format", l: "Какой формат ближе?", t: "one", req: 1, o: ["Сама в своём темпе", "В группе с экспертом и чатом"] },
      { k: "result", l: "Какой результат хочешь через 40 дней?", t: "area", hint: "Необязательно" },
      { k: "consult", l: "Хочешь консультацию по твоему контенту и Большой Игре 2.0?", t: "one", req: 1, o: ["Да, хочу", "Пока нет"] } ] }
  ];
  // на первом шаге напоминаем, что человек получит за анкету
  var GET = '<div class="pz-get"><p>За анкету ты получишь</p><ul><li><b>Возможность получить самую низкую цену</b> на Большую Игру 2.0</li><li><b>Закрытый Телеграм-канал</b> про Большую Игру 2.0</li><li><b>Личную консультацию</b>. Разберём, какой блог тебе вести и что снимать</li><li><b>Команда подробно расскажет</b> про Игру и что в неё входит</li></ul></div>';
  var TARIFFS = { self: "В своём темпе", team: "В команде", close: "Ближний круг" }, tariff = "";
  var A = {}, step = 0, openedAt = 0, sending = false;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var overlay = document.createElement("div");
  overlay.className = "bgl-overlay"; overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-modal", "true");
  overlay.innerHTML = '<div class="bgl-box"><button class="bgl-close" type="button" aria-label="Закрыть">✕</button><div class="bgl-body"></div></div>';
  var body = overlay.querySelector(".bgl-body");

  function field(q) {
    var v = A[q.k], h = '<div class="bgl-field" data-f="' + q.k + '"><label class="bgl-label"' + (q.o ? "" : ' for="pz-' + q.k + '"') + ">" + esc(q.l) + "</label>";
    if (q.t === "text") h += '<input class="bgl-input" id="pz-' + q.k + '" name="' + q.k + '" maxlength="120" value="' + esc(v || "") + '"' + (q.ph ? ' placeholder="' + esc(q.ph) + '"' : "") + (q.mode ? ' inputmode="' + q.mode + '"' : "") + (q.ac ? ' autocomplete="' + q.ac + '"' : ' autocomplete="off"') + ">";
    else if (q.t === "area") h += '<textarea class="bgl-input" id="pz-' + q.k + '" name="' + q.k + '" maxlength="400">' + esc(v || "") + "</textarea>";
    else {
      h += '<div class="pz-opts">';
      q.o.forEach(function (o) {
        var on = q.t === "many" ? (v || []).indexOf(o) >= 0 : v === o;
        h += '<label class="pz-opt"><input type="' + (q.t === "many" ? "checkbox" : "radio") + '" name="' + q.k + '" value="' + esc(o) + '"' + (on ? " checked" : "") + "><span>" + esc(o) + "</span></label>";
      });
      h += "</div>";
    }
    if (q.hint) h += '<p class="bgl-hint">' + q.hint + "</p>";
    return h + "</div>";
  }
  function render() {
    var s = STEPS[step], last = step === STEPS.length - 1;
    body.innerHTML = '<p class="pz-step">Шаг ' + (step + 1) + " из " + STEPS.length + '</p><div class="pz-bar"><i style="width:' + ((step + 1) / STEPS.length * 100) + '%"></i></div>' +
      '<h2 class="bgl-title">' + s.title + "</h2>" + (tariff ? '<p class="bgl-sub">Предзапись на тариф «' + esc(tariff) + '»</p>' : "") + (step ? "" : GET) + '<form class="bgl-form" novalidate>' + s.q.map(field).join("") +
      (last ? '<div class="bgl-hp" aria-hidden="true"><input name="company" tabindex="-1" autocomplete="off"></div><div class="bgl-field" data-f="consent"><label class="bgl-chk"><input type="checkbox" name="consent_pd"' + (A.consent ? " checked" : "") + '><span>Даю <a href="../consent/" target="_blank" rel="noopener">согласие на обработку персональных данных</a></span></label></div>' : "") +
      '<div class="pz-nav">' + (step ? '<button class="bgl-btn pz-back" type="button" data-act="back">Назад</button>' : "") +
      '<button class="bgl-btn" type="submit">' + (last ? "Отправить анкету" : "Дальше") + "</button></div></form>";
    overlay.querySelector(".bgl-box").scrollTop = 0;
  }
  function mark(k, msg) {
    var box = body.querySelector('[data-f="' + k + '"]'); if (!box) return null;
    var el = box.querySelector(".bgl-input, .pz-opts"); if (el) el.classList.add("bad");
    if (!box.querySelector(".bgl-err")) box.insertAdjacentHTML("beforeend", '<p class="bgl-err">' + msg + "</p>");
    return box;
  }
  function unmark(box) { if (!box) return; var el = box.querySelector(".bad"); if (el) el.classList.remove("bad"); var er = box.querySelector(".bgl-err"); if (er) er.remove(); }
  function collect(form) {
    STEPS[step].q.forEach(function (q) {
      if (q.t === "many") A[q.k] = [].map.call(form.querySelectorAll('[name="' + q.k + '"]:checked'), function (i) { return i.value; });
      else if (q.t === "one") { var c = form.querySelector('[name="' + q.k + '"]:checked'); A[q.k] = c ? c.value : ""; }
      else A[q.k] = form[q.k].value.trim();
    });
    if (form.consent_pd) A.consent = form.consent_pd.checked;
  }
  function validate() {
    var bad = [];
    STEPS[step].q.forEach(function (q) {
      var v = A[q.k];
      if (q.req && (q.t === "many" ? !v.length : !v)) bad.push(mark(q.k, q.o ? "Выбери вариант" : "Заполни это поле"));
      else if (q.k === "phone" && v.replace(/\D/g, "").length < 10) bad.push(mark(q.k, "Похоже, в номере не хватает цифр"));
      else if (q.k === "age" && !/^\d{1,2}$/.test(v)) bad.push(mark(q.k, "Напиши возраст цифрами"));
    });
    if (step === STEPS.length - 1 && !A.consent) bad.push(mark("consent", "Без согласия на обработку данных анкету не отправить"));
    bad = bad.filter(Boolean);
    if (bad.length) bad[0].scrollIntoView({ behavior: "smooth", block: "center" });
    return !bad.length;
  }

  function marks() {
    var p = new URLSearchParams(location.search), out = [];
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src"].forEach(function (k) { var v = p.get(k); if (v) out.push(k.replace("utm_", "") + "=" + v); });
    if (!out.length && document.referrer) out.push("ref=" + document.referrer.split("?")[0]);
    return out.join("; ").slice(0, 300);
  }
  function post(b) {
    return fetch(EP, { method: "POST", body: b }).then(function (r) { return r.json(); })
      .then(function (j) { return { ok: !!(j && j.ok) }; }).catch(function () { return { ok: false }; });
  }
  function queue(b) { try { var q = JSON.parse(localStorage.getItem(STORE) || "[]"); q.push(b); localStorage.setItem(STORE, JSON.stringify(q.slice(-5))); } catch (e) {} }
  function flush() {
    var q; try { q = JSON.parse(localStorage.getItem(STORE) || "[]"); } catch (e) { return; }
    if (!q.length) return;
    try { localStorage.removeItem(STORE); } catch (e) {}
    q.forEach(function (b) { post(b).then(function (r) { if (!r.ok) queue(b); }); });
  }
  function send(form) {
    if (sending) return;
    var tg = A.tg; if (tg && !/^@/.test(tg) && !/t\.me\//.test(tg)) tg = "@" + tg;
    // таблица пишет фиксированные колонки, поэтому все ответы анкеты идут одной строкой рядом с метками
    var labels = [["age", "Возраст"], ["inst", "Инстаграм"], ["blog", "Блог"], ["subs", "Подписчики"], ["why", "Зачем блог"], ["topic", "О чём блог"], ["stop", "Останавливает"],
      ["courses", "Курсы"], ["before", "Была раньше"], ["when", "Когда начать"], ["invest", "Вкладываться"], ["format", "Формат"], ["result", "Результат за 40 дней"], ["consult", "Консультация"]];
    var text = labels.map(function (p) { var v = A[p[0]]; v = Array.isArray(v) ? v.join(", ") : v; return v ? p[1] + ": " + v : ""; }).filter(Boolean).join(" | ");
    var m = marks(), src = new URLSearchParams(location.search).get("src") || "";
    var lead = { tariff: tariff, type: "анкета предзаписи", name: A.name, phone: A.phone, tgNick: tg, instagram: A.inst, age: A.age,
      consent_pd: true, consent_ads: false, consent_ts: new Date().toISOString(), consent_rev: REV,
      utm: (m ? m + " || " : "") + (tariff ? "Тариф: " + tariff + " | " : "") + text, marks: m, src: src, answers: text, form: A };
    var payload = JSON.stringify({ kind: "bi", source: "bi_predzapis", lead: lead, answers: text, src: src,
      hp: form.company.value || (Date.now() - openedAt < 2500 ? "fast" : ""), page: location.href.split("#")[0].slice(0, 300), ua: navigator.userAgent.slice(0, 160) });
    sending = true;
    var btn = form.querySelector('[type="submit"]'); btn.disabled = true; btn.textContent = "Отправляю…";
    post(payload).then(function (r) {
      sending = false; if (!r.ok) queue(payload);
      try { if (r.ok && window.ym) window.ym("reachGoal", "bi_predzapis"); } catch (e) {}
      done();
    });
  }
  // экран с каналом показываем и при сбое: анкета уйдёт из очереди
  function done() {
    body.innerHTML = '<div class="bgl-done"><h2 class="bgl-title">Готово! Ты в предзаписи на Большую Игру 2.0</h2><p>Заходи в закрытый канал, там всё про Игру</p>' +
      '<a class="bgl-btn" href="' + CHANNEL + '" target="_blank" rel="noopener">Перейти в канал</a>' +
      '<p class="bgl-note">В тот же день тебе напишет моя команда в Телеграм. Проверь, что ник указан верно</p></div>';
    overlay.querySelector(".bgl-box").scrollTop = 0; A = {}; step = 0;
  }
  function open(k) { tariff = TARIFFS[k] || ""; openedAt = openedAt || Date.now(); render(); overlay.classList.add("open"); document.body.style.overflow = "hidden"; }
  function close() { overlay.classList.remove("open"); document.body.style.overflow = ""; }
  window.__openAnketa = open;

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay || e.target.closest(".bgl-close")) { close(); return; }
    if (e.target.closest('[data-act="back"]')) { collect(body.querySelector("form")); step--; render(); }
  });
  overlay.addEventListener("input", function (e) { unmark(e.target.closest(".bgl-field")); });
  overlay.addEventListener("change", function (e) { unmark(e.target.closest(".bgl-field")); });
  overlay.addEventListener("submit", function (e) {
    e.preventDefault(); collect(e.target);
    if (!validate()) return;
    if (step < STEPS.length - 1) { step++; render(); } else send(e.target);
  });
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("[data-pz-open]") : null;
    if (a) { e.preventDefault(); open(a.getAttribute("data-pz-tariff")); }
  }, true);
  function init() {
    document.body.appendChild(st); document.body.appendChild(overlay);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    flush();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
