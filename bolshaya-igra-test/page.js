/* Большая Игра 2.0 — тест нового дизайна: таймер и тексты по окнам продаж.
   Форма заявки и оплата подключаются отдельно: ../bolshaya-igra/tariff-forms.js */
(function () {
  function $$(sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function plural(n, f) {
    var a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return f[2];
    if (b > 1 && b < 5) return f[1];
    if (b === 1) return f[0];
    return f[2];
  }
  function set(sel, text) { $$(sel).forEach(function (el) { el.textContent = text; el.hidden = !text; }); }

  /* — Окна продаж. Первое окно стоит в разметке, остальные подставляются по дате.
       С 20.10 по 03.11 страница показывает следующую публичную цену, как действующий лендинг:
       что там должно быть, команда ещё не решила. Окно участниц Разминки (04–09.11) сюда не входит. — */
  var WINDOWS = [
    { until: "2026-10-19T23:59:59+03:00", first: true },
    { until: "2026-11-14T23:59:59+03:00", price: "29 990", inst: "Платишь целиком или берёшь рассрочку от 2 500 ₽ в месяц",
      due: "С 15 ноября 34 990 ₽", hero: "14 ноября цена вырастет", label: "До повышения цены" },
    { until: "2026-11-22T23:59:59+03:00", price: "34 990", inst: "Платишь целиком или берёшь рассрочку от 2 916 ₽ в месяц",
      due: "", hero: "Продажи закрываются 22 ноября", label: "До закрытия продаж" }
  ];
  var applied = null;
  function apply(w) {
    if (applied === w) return;
    applied = w;
    $$("[data-first]").forEach(function (el) { el.hidden = !w.first; });   // выгоды первого окна
    $$("[data-later]").forEach(function (el) { el.hidden = !!w.first; });  // строка про 45 дней доступа
    if (w.first) return;
    set("[data-price]", w.price);
    set("[data-alt]", "");            // цены в валюте для следующих окон не заданы
    set("[data-inst]", w.inst);
    set("[data-due]", w.due);
    set("[data-hero-line]", w.hero);
    set("[data-timer-label]", w.label);
    set("[data-bar-label]", w.label);
    set("[data-step3]", "Оплачиваешь и получаешь доступ к Игре");
  }

  function tick() {
    var now = Date.now(), w = WINDOWS[WINDOWS.length - 1], i;
    for (i = 0; i < WINDOWS.length; i++) if (new Date(WINDOWS[i].until).getTime() > now) { w = WINDOWS[i]; break; }
    apply(w);
    var ms = Math.max(0, new Date(w.until).getTime() - now);
    var d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
    var vals = { d: String(d), h: pad(h), m: pad(m), s: pad(s) };
    var words = {
      d: plural(d, ["день", "дня", "дней"]), h: plural(h, ["час", "часа", "часов"]),
      m: plural(m, ["минута", "минуты", "минут"]), s: plural(s, ["секунда", "секунды", "секунд"])
    };
    $$("[data-t]").forEach(function (el) { el.textContent = vals[el.getAttribute("data-t")]; });
    $$("[data-w]").forEach(function (el) { el.textContent = words[el.getAttribute("data-w")]; });
    $$("[data-bar-timer]").forEach(function (el) { el.textContent = d + "д " + pad(h) + ":" + pad(m) + ":" + pad(s); });
  }

  /* — Висячие предлоги: короткое слово приклеиваем к следующему — */
  function nbsp(root) {
    var short = "а|и|в|о|у|к|с|я|не|но|то|за|на|по|из|от|до|со|во|же|ли|бы|их|мы|ты|он|про|для|это|как|что|чем|или";
    var re1 = new RegExp("(^|[\\s(«—])(" + short + ")\\s+", "gi"), re2 = /(\s)(\d+)\s+/g;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      if (!n.nodeValue.trim() || /^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName)) continue;
      n.nodeValue = n.nodeValue.replace(re1, "$1$2 ").replace(re1, "$1$2 ").replace(re2, "$1$2 ");
    }
  }

  function init() {
    nbsp(document.body);
    tick();
    setInterval(tick, 1000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
