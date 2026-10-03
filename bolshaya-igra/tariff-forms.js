/* Лид-форма «Принять участие» для лендинга «Большой Игры».
   Открывается по кнопкам в карточках тарифов (тариф уже выбран) и по кнопке в блоке «Как попасть в игру?».
   Заявка уходит в Google Таблицу теста «Какой ты блогер» (лист «Анкета») через Apps Script.
   Если отправка не прошла, заявка сохраняется в браузере и уходит при следующем заходе. Не зависит от бандла. */
(function () {
  if (window.__bgTariffForms) return; window.__bgTariffForms = true;

  var CONFIG = {
    // URL веб-приложения Apps Script (yapping-test/backend/Code.js), тот же, что у мини-аппа теста.
    endpoint: "https://script.google.com/macros/s/AKfycbyHbXYMZMWX1belQqULpMz84rfmhP2LXmcIMzroqhr4PKjvNOxIR4lump3OfY04ZC4x/exec",
    docs: "../",
    docsRev: "2026-10-02",
    helper: "https://t.me/kerryhelper"
  };
  var STORE = "bg_lead_q";

  // num — номер тарифа на карточке («ТАРИФ 01»)
  var T = [
    { key: "team", name: "В команде",     num: "1" },
    { key: "self", name: "В своём темпе", num: "2" },
    { key: "solo", name: "Со мной лично", num: "3" },
    { key: "none", name: "Пока не решила", num: "" }
  ];
  function byKey(k) { for (var i = 0; i < T.length; i++) if (T[i].key === k) return T[i]; return null; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* — стили (палитра лендинга) — */
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
  ".bgl-done a{color:#1F1F1F;font-weight:700}";
  // стиль добавляем в <body> (не <head>) — бандл при рендере переписывает head.
  var st = document.createElement("style"); st.textContent = css;
  function ensureStyle() { if (!st.isConnected) document.body.appendChild(st); }

  var overlay = document.createElement("div");
  overlay.className = "bgl-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.innerHTML = '<div class="bgl-box"><button class="bgl-close" type="button" aria-label="Закрыть">✕</button><div class="bgl-body"></div></div>';
  var body = overlay.querySelector(".bgl-body");

  var S = { tariff: "", openedAt: 0, sending: false };

  function doc(path, text) { return '<a href="' + CONFIG.docs + path + '/" target="_blank" rel="noopener">' + text + "</a>"; }

  function renderForm() {
    var chips = T.map(function (t) {
      return '<button type="button" class="bgl-chip' + (S.tariff === t.key ? " on" : "") + '" data-tariff="' + t.key + '">' + esc(t.name) + "</button>";
    }).join("");
    body.innerHTML =
      '<h2 class="bgl-title">Принять участие</h2>' +
      '<p class="bgl-sub">старт 16 ноября · 40 дней</p>' +
      '<p class="bgl-lead">Оставь контакты. Моя команда свяжется с тобой, ответит на вопросы и поможет выбрать формат.</p>' +
      '<form class="bgl-form" novalidate>' +
        '<div class="bgl-field" data-f="tariff"><span class="bgl-label">Формат</span><div class="bgl-chips">' + chips + "</div></div>" +
        '<div class="bgl-field" data-f="name"><label class="bgl-label" for="bgl-name">Имя</label><input class="bgl-input" id="bgl-name" name="name" autocomplete="given-name" maxlength="80"></div>' +
        '<div class="bgl-field" data-f="phone"><label class="bgl-label" for="bgl-phone">Телефон</label><input class="bgl-input" id="bgl-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 900 000-00-00" maxlength="30"><p class="bgl-hint">С кодом страны</p></div>' +
        '<div class="bgl-field" data-f="tg"><label class="bgl-label" for="bgl-tg">Ник в Телеграме</label><input class="bgl-input" id="bgl-tg" name="tg" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="@nickname" maxlength="60"></div>' +
        '<div class="bgl-hp" aria-hidden="true"><input name="company" tabindex="-1" autocomplete="off"></div>' +
        '<div class="bgl-field" data-f="consent">' +
          '<label class="bgl-chk"><input type="checkbox" name="consent_pd"><span>Даю ' + doc("consent", "согласие на обработку персональных данных") + " и принимаю " + doc("privacy", "Политику обработки персональных данных") + "</span></label>" +
          '<label class="bgl-chk"><input type="checkbox" name="consent_ads"><span>Согласна получать ' + doc("consent-ads", "рекламные и информационные сообщения") + ". Необязательно</span></label>" +
        "</div>" +
        '<button class="bgl-btn" type="submit">Отправить заявку</button>' +
      "</form>";
  }

  function renderDone(ok) {
    body.innerHTML = ok
      ? '<div class="bgl-done"><h2 class="bgl-title">Заявка у нас</h2><p class="bgl-sub">старт 16 ноября · 40 дней</p>' +
        "<p>Моя команда свяжется с тобой, ответит на вопросы и поможет выбрать формат.</p>" +
        '<button class="bgl-btn" type="button" data-act="close">Хорошо</button></div>'
      : '<div class="bgl-done"><h2 class="bgl-title">Не получилось отправить</h2><p class="bgl-sub">мы сохранили заявку</p>' +
        "<p>Что-то со связью. Заявку отправим сами, как только получится. Чтобы не ждать, напиши команде в Телеграм: " +
        '<a href="' + CONFIG.helper + '" target="_blank" rel="noopener">@kerryhelper</a>.</p>' +
        '<button class="bgl-btn" type="button" data-act="close">Закрыть</button></div>';
  }

  function utm() {
    var p = new URLSearchParams(location.search), out = [];
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (k) {
      var v = p.get(k); if (v) out.push(k.replace("utm_", "") + "=" + v);
    });
    if (!out.length && document.referrer) out.push("ref=" + document.referrer.split("?")[0]);
    return out.join("; ").slice(0, 300);
  }

  function post(body) {
    return fetch(CONFIG.endpoint, { method: "POST", body: body })
      .then(function (r) { return r.json(); })
      .then(function (j) { return !!(j && j.ok); })
      .catch(function () { return false; });
  }
  function queue(body) {
    try { var q = JSON.parse(localStorage.getItem(STORE) || "[]"); q.push(body); localStorage.setItem(STORE, JSON.stringify(q.slice(-5))); } catch (e) {}
  }
  function flush() {
    var q; try { q = JSON.parse(localStorage.getItem(STORE) || "[]"); } catch (e) { return; }
    if (!q.length) return;
    try { localStorage.removeItem(STORE); } catch (e) {}
    q.forEach(function (b) { post(b).then(function (ok) { if (!ok) queue(b); }); });
  }

  function mark(f, msg) {
    var box = body.querySelector('[data-f="' + f + '"]'); if (!box) return null;
    var el = box.querySelector(".bgl-input, .bgl-chips"); if (el) el.classList.add("bad");
    if (!box.querySelector(".bgl-err")) box.insertAdjacentHTML("beforeend", '<p class="bgl-err">' + msg + "</p>");
    return box;
  }
  function unmark(box) {
    if (!box) return;
    var el = box.querySelector(".bad"); if (el) el.classList.remove("bad");
    var er = box.querySelector(".bgl-err"); if (er) er.remove();
  }

  function submit(form) {
    if (S.sending) return;
    var name = form.name.value.trim(), phone = form.phone.value.trim(), tg = form.tg.value.trim();
    var bad = [];
    if (!S.tariff) bad.push(mark("tariff", "Выбери формат или «Пока не решила»"));
    if (name.length < 2) bad.push(mark("name", "Напиши, как тебя зовут"));
    if (phone.replace(/\D/g, "").length < 10) bad.push(mark("phone", "Похоже, в номере не хватает цифр"));
    if (!form.consent_pd.checked) bad.push(mark("consent", "Без согласия на обработку данных заявку не отправить"));
    bad = bad.filter(Boolean);
    if (bad.length) { bad[0].scrollIntoView({ behavior: "smooth", block: "center" }); return; }

    if (tg && !/^@/.test(tg) && !/t\.me\//.test(tg)) tg = "@" + tg;
    var lead = {
      tariff: byKey(S.tariff).name, name: name, phone: phone, tgNick: tg,
      consent_pd: true, consent_ads: form.consent_ads.checked,
      consent_ts: new Date().toISOString(), consent_rev: CONFIG.docsRev,
      utm: utm()
    };
    var payload = JSON.stringify({
      kind: "bi", source: "bi_landing", lead: lead,
      hp: form.company.value || (Date.now() - S.openedAt < 2500 ? "fast" : ""),
      page: location.href.split("#")[0].slice(0, 300),
      ua: navigator.userAgent.slice(0, 160)
    });
    S.sending = true;
    var btn = form.querySelector(".bgl-btn"); btn.disabled = true; btn.textContent = "Отправляю…";
    post(payload).then(function (ok) {
      S.sending = false;
      if (!ok) queue(payload);
      renderDone(ok);
      try { if (ok && window.ym) window.ym("reachGoal", "bi_lead"); } catch (e) {}
    });
  }

  function open(key) {
    S.tariff = byKey(key) && key !== "none" ? key : "";
    S.openedAt = Date.now();
    renderForm();
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    overlay.querySelector(".bgl-box").scrollTop = 0;
    setTimeout(function () { var n = body.querySelector("#bgl-name"); if (n && window.innerWidth > 700) n.focus(); }, 60);
  }
  function close() { overlay.classList.remove("open"); document.body.style.overflow = ""; }
  window.__openTariff = open;

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay || e.target.closest(".bgl-close") || e.target.closest('[data-act="close"]')) { close(); return; }
    var chip = e.target.closest(".bgl-chip");
    if (chip) {
      S.tariff = chip.getAttribute("data-tariff");
      [].forEach.call(body.querySelectorAll(".bgl-chip"), function (c) { c.classList.toggle("on", c === chip); });
      unmark(chip.closest(".bgl-field"));
    }
  });
  overlay.addEventListener("input", function (e) { unmark(e.target.closest(".bgl-field")); });
  overlay.addEventListener("change", function (e) { if (e.target.name === "consent_pd") unmark(e.target.closest(".bgl-field")); });
  overlay.addEventListener("submit", function (e) { e.preventDefault(); submit(e.target); });

  /* — привязка кнопок: «Принять участие» в карточках тарифов и в финальном блоке — */
  function tagCtas() {
    var els = [].slice.call(document.querySelectorAll("*"));
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.children.length !== 0 || !/ТАРИФ\s*0[123]/i.test(el.textContent || "")) continue;
      var card = el;
      for (var j = 0; j < 8; j++) {
        if (!card.parentElement) break;
        if (/что входит/i.test(card.textContent) && card.textContent.length > 120) break;
        card = card.parentElement;
      }
      var m = (el.textContent || "").match(/ТАРИФ\s*0*([123])/i);
      var t = null;
      for (var k = 0; k < T.length; k++) if (m && T[k].num === m[1]) t = T[k];
      if (!t) continue;
      var links = [].slice.call(card.querySelectorAll("a"));
      var cta = links.filter(function (a) { return /участие|отбор/i.test(a.textContent || ""); })[0] || links[links.length - 1];
      if (cta && !cta.getAttribute("data-bg-tariff")) cta.setAttribute("data-bg-tariff", t.key);
    }
    var fin = document.getElementById("finish");
    if (fin) [].forEach.call(fin.querySelectorAll("a"), function (a) {
      if (/участие|отбор/i.test(a.textContent || "") && !a.getAttribute("data-bg-tariff")) a.setAttribute("data-bg-tariff", "none");
    });
    return document.querySelectorAll("[data-bg-tariff]").length;
  }

  /* клик по кнопке — в фазе перехвата, чтобы перебить скролл/переход бандла */
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("[data-bg-tariff]") : null;
    if (a) {
      e.preventDefault();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation(); else e.stopPropagation();
      open(a.getAttribute("data-bg-tariff"));
    }
  }, true);

  function init() {
    ensureStyle();
    document.body.appendChild(overlay);
    // бандл может переписать DOM после старта — держим стиль и оверлей на месте
    setInterval(function () { ensureStyle(); if (!overlay.isConnected) document.body.appendChild(overlay); }, 1000);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    flush();
    // бандл рендерится асинхронно — ждём появления карточек тарифов
    var tries = 0;
    var iv = setInterval(function () { tries++; if (tagCtas() >= 4 || tries > 40) clearInterval(iv); }, 400);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
