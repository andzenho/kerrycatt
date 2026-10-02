/* Попапы лид-форм для тарифов «Большой Игры».
   3 виджета GetCourse (kerrycatt.online) грузятся в фоне заранее и открываются
   мгновенно по клику на «Пройти отбор» в карточке тарифа. Не зависит от бандла. */
(function () {
  if (window.__bgTariffForms) return; window.__bgTariffForms = true;

  var HOST = "https://kerrycatt.online";
  // frag — по чему находим карточку тарифа; id/uniq — виджет GetCourse
  var T = [
    { key: "team", name: "В команде",     frag: "команде", id: "1637700", uniq: "bcb558421283eff466254ea6c7256bdc0c13c12b" },
    { key: "self", name: "В своём темпе", frag: "темпе",   id: "1637698", uniq: "e78bf612070cd57dd488414f42d0cae7d9f6d0cb" },
    { key: "solo", name: "Со мной лично", frag: "лично",   id: "1637705", uniq: "bf897ffb2127445974d01d989e1c605efb28ad6d" }
  ];
  function byKey(k){ for (var i=0;i<T.length;i++) if (T[i].key===k) return T[i]; return null; }
  function src(id){
    var qs = location.search ? location.search.substring(1) + "&" : "";
    return HOST + "/pl/lite/widget/widget?" + qs + "id=" + id +
      "&ref=" + encodeURIComponent(document.referrer) +
      "&loc=" + encodeURIComponent(location.href);
  }

  /* — стили попапа (фирменная палитра Разминки/Большой Игры) — */
  var css =
  ".bgl-overlay{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(31,31,31,.62);padding:20px;visibility:hidden;opacity:0;pointer-events:none;transition:opacity .2s ease}" +
  ".bgl-overlay.open{visibility:visible;opacity:1;pointer-events:auto}" +
  ".bgl-box{position:relative;display:flex;flex-direction:column;width:100%;max-width:480px;max-height:92vh;overflow:hidden;background:#F6EEE2;border-radius:6px;padding:clamp(22px,5vw,32px) clamp(16px,4vw,20px) 0;box-shadow:0 30px 80px -20px rgba(31,31,31,.5)}" +
  ".bgl-close{position:absolute;top:12px;right:12px;width:34px;height:34px;border:none;background:rgba(31,31,31,.08);border-radius:999px;font-size:1.15rem;color:#1F1F1F;cursor:pointer;line-height:1;z-index:4}" +
  ".bgl-title{flex-shrink:0;margin:0 0 6px;font-family:'Unbounded',system-ui,sans-serif;font-weight:800;font-size:1.35rem;line-height:1.15;padding-right:40px;color:#1F1F1F}" +
  ".bgl-sub{flex-shrink:0;margin:0 0 16px;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#C05B3B}" +
  ".bgl-scroller{flex:1 1 auto;min-height:0;overflow-y:auto;padding-bottom:20px;-webkit-overflow-scrolling:touch}" +
  ".bgl-pane{display:none}" +
  ".bgl-frame{display:block;width:100%;height:460px;border:0;overflow:hidden}" +
  ".bgl-fade{position:absolute;left:0;right:0;bottom:0;height:58px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:8px;background:linear-gradient(to top,#F6EEE2 38%,rgba(246,238,226,0));pointer-events:none;opacity:0;transition:opacity .2s ease;z-index:3}" +
  ".bgl-fade span{font-size:1.25rem;line-height:1;color:#C05B3B;animation:bglBounce 1.2s ease-in-out infinite}" +
  "@keyframes bglBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}";
  // стиль добавляем в <body> (не <head>) в init() — бандл при рендере переписывает head.
  var st = document.createElement("style"); st.textContent = css;
  function ensureStyle(){ if (!st.isConnected) document.body.appendChild(st); }

  /* — разметка попапа — */
  var overlay = document.createElement("div");
  overlay.className = "bgl-overlay";
  var panes = T.map(function (t) {
    return '<div class="bgl-pane" data-key="' + t.key + '">' +
      '<iframe class="bgl-frame" data-key="' + t.key + '" title="Тариф ' + t.name + '" allow="clipboard-write"></iframe></div>';
  }).join("");
  overlay.innerHTML =
    '<div class="bgl-box">' +
      '<button class="bgl-close" type="button" aria-label="Закрыть">✕</button>' +
      '<h2 class="bgl-title"></h2>' +
      '<p class="bgl-sub">старт 16 ноября · 40 дней</p>' +
      '<div class="bgl-scroller">' + panes + '</div>' +
      '<div class="bgl-fade" aria-hidden="true"><span>↓</span></div>' +
    '</div>';

  var frames = {}, active = null, scroller = null, fade = null;

  function warm() {
    T.forEach(function (t) {
      var f = overlay.querySelector('.bgl-frame[data-key="' + t.key + '"]');
      if (f && !f.getAttribute("src")) { f.setAttribute("src", src(t.id)); frames[t.key] = f; }
    });
  }

  function updateHint() {
    if (!scroller) return;
    fade.style.opacity = (scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight > 16) ? "1" : "0";
  }

  function open(key) {
    var t = byKey(key); if (!t) return;
    active = key;
    overlay.querySelector(".bgl-title").textContent = "Тариф «" + t.name + "»";
    T.forEach(function (x) {
      overlay.querySelector('.bgl-pane[data-key="' + x.key + '"]').style.display = (x.key === key ? "block" : "none");
    });
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    if (scroller) scroller.scrollTop = 0;
    setTimeout(updateHint, 60);
  }
  function close() { overlay.classList.remove("open"); document.body.style.overflow = ""; }
  window.__openTariff = open;

  /* — высота формы приходит postMessage'ем (свой uniq у каждого виджета) — */
  window.addEventListener("message", function (e) {
    var d = e.data; if (!d || !d.height || !d.uniqName) return;
    for (var i = 0; i < T.length; i++) {
      if (d.uniqName === T[i].uniq) {
        var h = parseInt(d.height, 10);
        if (h > 0 && frames[T[i].key]) frames[T[i].key].style.height = Math.max(320, h) + "px";
        if (active === T[i].key) updateHint();
        break;
      }
    }
  });

  /* — привязка кнопок «Пройти отбор» в карточках тарифов — */
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
      // привязка по номеру тарифа (однозначно): 01→team, 02→self, 03→solo
      var m = (el.textContent || "").match(/ТАРИФ\s*0*([123])/i);
      var num = m ? m[1] : "";
      var key = num === "1" ? "team" : num === "2" ? "self" : num === "3" ? "solo" : "";
      var t = byKey(key);
      if (!t) continue;
      var links = [].slice.call(card.querySelectorAll("a"));
      var cta = links.filter(function (a) { return /отбор/i.test(a.textContent || ""); })[0] || links[links.length - 1];
      if (cta && !cta.getAttribute("data-bg-tariff")) cta.setAttribute("data-bg-tariff", t.key);
    }
    return document.querySelectorAll("[data-bg-tariff]").length;
  }

  /* клик по CTA тарифа — в фазе перехвата, чтобы перебить скролл/переход бандла */
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
    setInterval(function(){ ensureStyle(); if (!overlay.isConnected) document.body.appendChild(overlay); }, 1000);
    scroller = overlay.querySelector(".bgl-scroller");
    fade = overlay.querySelector(".bgl-fade");
    overlay.querySelector(".bgl-close").addEventListener("click", close);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    scroller.addEventListener("scroll", updateHint);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    // прогрев форм в фоне (после рендера бандла), чтобы открывались мгновенно
    setTimeout(warm, 1800);
    // бандл рендерится через Babel асинхронно — ждём появления карточек тарифов
    var tries = 0;
    var iv = setInterval(function () { tries++; if (tagCtas() >= T.length || tries > 40) clearInterval(iv); }, 400);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
