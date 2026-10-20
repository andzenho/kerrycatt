/* Разминка: лесенка цены, окно продаж, заявка перед оплатой.
   Цена зависит от числа оплат: каждые 50 оплат +100 ₽. PAID пока вписывается руками, когда будет счётчик из платёжки, подставим его.
   Ссылки оплаты у каждой ступени свои (rub и intl). Пока ссылки не даны, кнопки оплаты на последнем шаге неактивны. */
(function () {
  var EP = "https://script.google.com/macros/s/AKfycbyHbXYMZMWX1belQqULpMz84rfmhP2LXmcIMzroqhr4PKjvNOxIR4lump3OfY04ZC4x/exec", STORE = "bg_lead_q", REV = "2026-10-04";
  var PAID = 0;                                     // сколько участниц уже оплатили
  var OPEN = "2026-10-26T10:00:00+03:00", CLOSE = "2026-11-03T23:59:59+03:00";
  var STEPS = [                                      // по 50 мест на ступень, последняя без потолка
    { rub: 490, usd: 7 }, { rub: 590, usd: 9 }, { rub: 690, usd: 10 }, { rub: 790, usd: 12 }, { rub: 890, usd: 13 }, { rub: 990, usd: 15 },
    { rub: 1090, usd: 17 }, { rub: 1190, usd: 18 }, { rub: 1290, usd: 20 }, { rub: 1390, usd: 21 }, { rub: 1490, usd: 23, last: true }
  ];
  // ссылки ступеней: STEPS[i].payRub / STEPS[i].payIntl
  function $$(s) { return [].slice.call(document.querySelectorAll(s)); }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  var i = Math.min(Math.floor(PAID / 50), STEPS.length - 1), step = STEPS[i], left = step.last ? 0 : 50 * (i + 1) - PAID;
  function apply() {
    $$("[data-rz-price]").forEach(function (e) { e.textContent = fmt(step.rub); });
    $$("[data-rz-left]").forEach(function (e) { e.textContent = left; });
    if (step.last) $$("[data-rz-leftline]").forEach(function (e) { e.hidden = true; });
    var now = Date.now(), closed = $$("[data-rz-closed]")[0], pay = $$("[data-rz-pay]")[0];
    if (now > new Date(CLOSE).getTime()) { pay.hidden = true; closed.hidden = false; closed.textContent = "Продажи закрыты"; }
    else if (now < new Date(OPEN).getTime()) { pay.hidden = true; closed.hidden = false; closed.textContent = "Продажи откроются 26 октября в 10:00 по Москве"; }
  }
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
  var st = document.createElement("style"); st.textContent = css;
  var overlay = document.createElement("div");
  overlay.className = "bgl-overlay"; overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-modal", "true");
  overlay.innerHTML = '<div class="bgl-box"><button class="bgl-close" type="button" aria-label="Закрыть">✕</button><div class="bgl-body"></div></div>';
  var body = overlay.querySelector(".bgl-body"), method = "rub", openedAt = 0, sending = false;
  function form() {
    body.innerHTML = '<h2 class="bgl-title">Занять место</h2><p class="bgl-sub">Разминка · 3–6 ноября · ' + (method === "rub" ? fmt(step.rub) + " ₽" : "$" + step.usd) + "</p>" +
      '<p class="bgl-lead">Оставь контакты, и откроется оплата. После оплаты Даша напишет тебе в Telegram и пришлёт доступ.</p>' +
      '<form class="bgl-form" novalidate>' +
      '<div class="bgl-field" data-f="name"><label class="bgl-label" for="rz-name">Имя</label><input class="bgl-input" id="rz-name" name="name" autocomplete="given-name" maxlength="80"></div>' +
      '<div class="bgl-field" data-f="phone"><label class="bgl-label" for="rz-phone">Телефон</label><input class="bgl-input" id="rz-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 900 000-00-00" maxlength="30"></div>' +
      '<div class="bgl-field" data-f="tg"><label class="bgl-label" for="rz-tg">Ник в Телеграме</label><input class="bgl-input" id="rz-tg" name="tg" autocomplete="off" placeholder="@nickname" maxlength="60"></div>' +
      '<div class="bgl-hp" aria-hidden="true"><input name="company" tabindex="-1" autocomplete="off"></div>' +
      '<div class="bgl-field" data-f="consent"><label class="bgl-chk"><input type="checkbox" name="consent_pd"><span>Даю <a href="../consent/" target="_blank" rel="noopener">согласие на обработку персональных данных</a> и принимаю <a href="../privacy/" target="_blank" rel="noopener">Политику</a></span></label>' +
      '<label class="bgl-chk"><input type="checkbox" name="consent_ads"><span>Согласна получать <a href="../consent-ads/" target="_blank" rel="noopener">рекламные и информационные сообщения</a>. Необязательно</span></label></div>' +
      '<button class="bgl-btn" type="submit">Перейти к оплате</button></form>';
  }
  function pay() {
    var link = method === "rub" ? step.payRub : step.payIntl;
    body.innerHTML = '<div class="bgl-done"><h2 class="bgl-title">Остался один шаг</h2><p class="bgl-sub">Разминка · 3–6 ноября</p>' +
      '<div class="bgl-field" data-f="offer"><label class="bgl-chk"><input type="checkbox" name="offer"><span>Принимаю <a href="../offer/" target="_blank" rel="noopener">оферту</a> и <a href="../offer-prilozhenie-2/" target="_blank" rel="noopener">Приложение № 2</a>, мне есть 18 лет</span></label></div>' +
      (link ? '<a class="bgl-btn bgl-pay off" href="' + link + '" target="_blank" rel="noopener">' + (method === "rub" ? "Оплатить " + fmt(step.rub) + " ₽" : "Оплатить $" + step.usd + " зарубежной картой") + "</a>"
            : '<p class="bgl-note">Ссылка на оплату появится здесь к старту продаж. Заявку мы сохранили, Даша напишет тебе в Telegram.</p>') + "</div>";
  }
  function mark(f, m) { var b = body.querySelector('[data-f="' + f + '"]'); if (!b) return null; var el = b.querySelector(".bgl-input"); if (el) el.classList.add("bad"); if (!b.querySelector(".bgl-err")) b.insertAdjacentHTML("beforeend", '<p class="bgl-err">' + m + "</p>"); return b; }
  function post(b) { return fetch(EP, { method: "POST", body: b }).then(function (r) { return r.json(); }).then(function (j) { return !!(j && j.ok); }).catch(function () { return false; }); }
  function queue(b) { try { var q = JSON.parse(localStorage.getItem(STORE) || "[]"); q.push(b); localStorage.setItem(STORE, JSON.stringify(q.slice(-5))); } catch (e) {} }
  function marks() { var p = new URLSearchParams(location.search), o = []; ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src"].forEach(function (k) { var v = p.get(k); if (v) o.push(k.replace("utm_", "") + "=" + v); }); if (!o.length && document.referrer) o.push("ref=" + document.referrer.split("?")[0]); return o.join("; ").slice(0, 300); }
  function submit(f) {
    if (sending) return;
    var name = f.name.value.trim(), phone = f.phone.value.trim(), tg = f.tg.value.trim(), bad = [];
    if (name.length < 2) bad.push(mark("name", "Напиши, как тебя зовут"));
    if (phone.replace(/\D/g, "").length < 10) bad.push(mark("phone", "Похоже, в номере не хватает цифр"));
    if (tg.replace("@", "").length < 2) bad.push(mark("tg", "Укажи ник, Даша напишет туда"));
    if (!f.consent_pd.checked) bad.push(mark("consent", "Без согласия на обработку данных заявку не отправить"));
    bad = bad.filter(Boolean); if (bad.length) { bad[0].scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    if (!/^@/.test(tg) && !/t\.me\//.test(tg)) tg = "@" + tg;
    var price = method === "rub" ? step.rub + " ₽" : "$" + step.usd;
    var payload = JSON.stringify({ kind: "bi", source: "razminka", lead: { tariff: "Разминка", type: "Разминка · " + price + " · " + (method === "rub" ? "рубли" : "зарубежная карта"),
      name: name, phone: phone, tgNick: tg, consent_pd: true, consent_ads: f.consent_ads.checked, consent_ts: new Date().toISOString(), consent_rev: REV, utm: marks() },
      hp: f.company.value || (Date.now() - openedAt < 2500 ? "fast" : ""), page: location.href.split("#")[0].slice(0, 300), ua: navigator.userAgent.slice(0, 160) });
    sending = true; var btn = f.querySelector(".bgl-btn"); btn.disabled = true; btn.textContent = "Отправляю…";
    post(payload).then(function (ok) { sending = false; if (!ok) queue(payload); pay(); });
  }
  function open(m) { method = m; openedAt = Date.now(); form(); overlay.classList.add("open"); document.body.style.overflow = "hidden"; }
  function close() { overlay.classList.remove("open"); document.body.style.overflow = ""; }
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay || e.target.closest(".bgl-close")) { close(); return; }
    var a = e.target.closest(".bgl-pay"); if (a) { var c = body.querySelector('[name="offer"]'); if (!c || !c.checked) { e.preventDefault(); mark("offer", "Отметь, что принимаешь оферту"); } }
  });
  overlay.addEventListener("change", function (e) { if (e.target.name === "offer") [].forEach.call(body.querySelectorAll(".bgl-pay"), function (a) { a.classList.toggle("off", !e.target.checked); }); });
  overlay.addEventListener("input", function (e) { var b = e.target.closest(".bgl-field"); if (b) { var er = b.querySelector(".bgl-err"); if (er) er.remove(); var x = b.querySelector(".bad"); if (x) x.classList.remove("bad"); } });
  overlay.addEventListener("submit", function (e) { e.preventDefault(); submit(e.target); });
  document.addEventListener("click", function (e) { var a = e.target.closest && e.target.closest("[data-rz-open]"); if (a) { e.preventDefault(); open(a.getAttribute("data-rz-open")); } }, true);
  function init() {
    document.body.appendChild(st); document.body.appendChild(overlay); apply();
    try { var q = JSON.parse(localStorage.getItem(STORE) || "[]"); if (q.length) { localStorage.removeItem(STORE); q.forEach(function (b) { post(b).then(function (ok) { if (!ok) queue(b); }); }); } } catch (e) {}
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
