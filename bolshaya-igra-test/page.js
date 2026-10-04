/* Большая Игра — тестовая страница дизайна: таймеры, счётчик REC, календарь потока, лента ниш.
   Форма заявки и оплата подключаются отдельно: ../bolshaya-igra/tariff-forms.js */
(function () {
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function plural(n, f) {
    var a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return f[2];
    if (b > 1 && b < 5) return f[1];
    if (b === 1) return f[0];
    return f[2];
  }

  /* — Лестница цен: та же, что на основном лендинге — */
  var LADDER = [
    { until: "2026-10-19T23:59:59+03:00", price: "24 990", date: "19 октября" },
    { until: "2026-11-14T23:59:59+03:00", price: "29 990", date: "14 ноября" },
    { until: "2026-11-22T23:59:59+03:00", price: "34 990", date: "22 ноября" }
  ];
  function tick() {
    var now = Date.now(), step = LADDER[LADDER.length - 1], i;
    for (i = 0; i < LADDER.length; i++) if (new Date(LADDER[i].until).getTime() > now) { step = LADDER[i]; break; }
    var last = step === LADDER[LADDER.length - 1];
    var ms = Math.max(0, new Date(step.until).getTime() - now);
    var d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
    var vals = { d: String(d), h: pad(h), m: pad(m), s: pad(s) };
    var words = {
      d: plural(d, ["день", "дня", "дней"]), h: plural(h, ["час", "часа", "часов"]),
      m: plural(m, ["минута", "минуты", "минут"]), s: plural(s, ["секунда", "секунды", "секунд"])
    };
    $$("[data-t]").forEach(function (el) { el.textContent = vals[el.getAttribute("data-t")]; });
    $$("[data-w]").forEach(function (el) { el.textContent = words[el.getAttribute("data-w")]; });
    $$("[data-price]").forEach(function (el) { el.textContent = step.price; });
    $$("[data-rise-a]").forEach(function (el) { el.textContent = last ? "Запись закроется " : "После "; });
    $$("[data-rise-date]").forEach(function (el) { el.textContent = step.date; });
    $$("[data-rise-b]").forEach(function (el) { el.textContent = last ? "" : " цена вырастет"; });
    $$("[data-bonus]").forEach(function (el) { el.hidden = step !== LADDER[0]; });  // бонус только в первом окне цены
    $$("[data-old]").forEach(function (el) { el.hidden = last; });                  // на последней ступени зачёркивать нечего
    $$("[data-rise-label]").forEach(function (el) { el.textContent = last ? "до закрытия записи" : "до повышения цены"; });
    $$("[data-bar-label]").forEach(function (el) { el.textContent = last ? "До закрытия записи" : "До повышения цены"; });
    $$("[data-bar-timer]").forEach(function (el) { el.textContent = d + "д " + pad(h) + ":" + pad(m) + ":" + pad(s); });
  }

  /* — Счётчик REC: идёт с момента открытия страницы — */
  var t0 = Date.now();
  function rec() {
    var s = Math.floor((Date.now() - t0) / 1000);
    $$("[data-rec]").forEach(function (el) { el.textContent = pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60); });
  }

  /* — Календарь потока: 16 ноября — 25 декабря 2026, 40 дней.
       Дни 1–5 фундамент, дальше задание каждый день, кроме воскресений (30 заданий). — */
  function calendar(box) {
    var html = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map(function (w) { return '<span class="cal__wd">' + w + "</span>"; }).join("");
    var start = new Date(2026, 10, 16);
    for (var i = 0; i < 40; i++) {
      var dt = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      var kind = i < 5 ? "base" : dt.getDay() === 0 ? "off" : "task";
      var mark = dt.getDate() === 16 && dt.getMonth() === 10 ? "16.11" : dt.getDate() === 1 ? "1.12" : i === 39 ? "25.12" : "";
      var title = dt.getDate() + (dt.getMonth() === 10 ? " ноября" : " декабря") + ": " +
        (kind === "base" ? "фундамент" : kind === "off" ? "воскресенье, заданий нет" : "задание и ролик");
      html += '<span class="cal__d cal__d--' + kind + '" title="' + title + '">' + (mark ? "<small>" + mark + "</small>" : "") +
        (kind === "off" ? "·" : i + 1) + "</span>";
    }
    box.innerHTML = html;
  }

  /* — Лента ниш — */
  var NICHES = [
    ["🤱", "мама в декрете"], ["🧠", "психолог"], ["✈️", "путешествия"], ["👁️", "мастер ресниц"],
    ["🍳", "готовка"], ["🏋️", "тренер"], ["🧵", "шитьё и рукоделие"], ["🔮", "таролог"],
    ["🌍", "переехала в другую страну"], ["📸", "фотограф"], ["💪", "спорт и зал"], ["📚", "учитель"],
    ["🐈", "животные"], ["✂️", "парикмахер"], ["🏡", "дом и уют"], ["⭐", "астролог"],
    ["🏃", "похудение"], ["🎨", "дизайнер"], ["🍽️", "еда и рестораны"], ["🥗", "нутрициолог"],
    ["👗", "шмотки и стиль"], ["🧳", "турагент"], ["👶", "материнство"], ["🩺", "медицина"],
    ["🔨", "ремонт"], ["💼", "предприниматель"], ["🎬", "книги и кино"], ["🔄", "сменила профессию"],
    ["🌱", "сад и дача"], ["🚪", "вышла из найма"], ["💃", "танцы"], ["🕊️", "заново после сорока"],
    ["🚗", "машины"], ["🧩", "особенный ребёнок"], ["🎣", "рыбалка и походы"], ["📋", "юрист"],
    ["❤️", "отношения"], ["🏘️", "маленький город"], ["🐓", "жизнь в деревне"], ["💄", "бьюти-мастер"],
    ["🖌️", "творчество"], ["📊", "маркетинг"], ["🧿", "эзотерика"], ["👨‍👩‍👧‍👦", "многодетная семья"],
    ["🗽", "жизнь за границей"], ["🗺️", "гид"]
  ];
  function marquee(box) {
    var rows = [[], [], []];
    NICHES.forEach(function (n, i) { rows[i % 3].push("<span>" + n[0] + " " + n[1] + "</span>"); });
    box.innerHTML = rows.map(function (r) { return '<div class="marquee__row">' + r.join("") + r.join("") + "</div>"; }).join("");
    var txt = $("[data-niches-text]");
    if (txt) txt.textContent = NICHES.map(function (n) { return n[1]; }).join(", ");
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
    var cal = $("[data-cal]"); if (cal) calendar(cal);
    var mq = $("[data-marquee]"); if (mq) marquee(mq);
    nbsp(document.body);
    tick(); rec();
    setInterval(function () { tick(); rec(); }, 1000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
