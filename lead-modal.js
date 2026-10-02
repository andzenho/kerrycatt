/* global React, ReactDOM */
(function(){
const useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;

/* ── Формы/оплата GetCourse ────────────────────────────────────────────────
   Виджет ГК держится в попапе готовым → по клику открывается мгновенно.
   Отправка, платная сделка (willCreatePaidDeal) и оплата — на стороне ГК.

   ВАЖНО: страница формы ГК ставит себе html{overflow:hidden} — пользователь
   НЕ может прокручивать её внутри iframe (колесо/скроллбар мертвы). Поэтому
   на десктопе (ширина ≥700px) форма МАСШТАБИРУЕТСЯ под высоту попапа:
   видна целиком — поля, кнопка и галочки согласий — без прокрутки вовсе.
   Высоту контента ГК присылает через postMessage (uniqName). */
const GK_HOST = "https://kerrycatt1.getcourse.ru";

// widgetId — id виджета ГК; uniqName — id встраиваемого скрипта (для postMessage).
const RUBLE_CFG = {
  widgetId: "1632055", uniqName: "32505d6440058a3adaf8e327e50b3d7045e93618",
  openerName: "__openLeadModal", prewarm: true,
  title: "Занять место на Разминке", subtitle: "4 ноября · 4 дня · 990 ₽"
};
const FOREIGN_CFG = {
  widgetId: "1634983", uniqName: "28ba78ae65137e386fbc6d89aefd35d44b751249",
  openerName: "__openForeignModal", warmerName: "__warmForeignModal", prewarm: false,
  title: "Оплата зарубежной картой", subtitle: "4 ноября · 4 дня · $15 · €13"
};

function LeadModal(cfg) {
  function widgetSrc() {
    var qs = window.location.search ? window.location.search.substring(1) + "&" : "";
    return GK_HOST + "/pl/lite/widget/widget?" + qs +
      "id=" + cfg.widgetId +
      "&ref=" + encodeURIComponent(document.referrer) +
      "&loc=" + encodeURIComponent(document.location.href);
  }
  const [open, setOpen] = useState(false);
  const [warm, setWarm] = useState(false);   // форма подгружена в фоне
  const [loaded, setLoaded] = useState(false);
  const [innerH, setInnerH] = useState(0);   // высота контента формы (от ГК)
  const [box, setBox] = useState({ w: 0, h: 0 }); // доступная область под iframe
  const boxRef = useRef(null);

  useEffect(() => {
    window[cfg.openerName] = () => { setWarm(true); setOpen(true); };
    // прогрев по наведению/тапу на кнопку (для зарубежной) — форма готова к клику.
    if (cfg.warmerName) window[cfg.warmerName] = () => setWarm(true);
    // прогрев ~1.2с после загрузки (только для рублёвой) — к клику форма готова.
    const warmT = cfg.prewarm ? setTimeout(() => setWarm(true), 1200) : null;
    function onMsg(e) {
      const d = e.data;
      if (d && d.uniqName === cfg.uniqName) {
        setLoaded(true);
        if (d.height) {
          const h = parseInt(d.height, 10);
          if (h > 0) setInnerH(h);
        }
      }
    }
    window.addEventListener("message", onMsg);
    return () => { if (warmT) clearTimeout(warmT); window.removeEventListener("message", onMsg); };
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", onKey);
    // блокируем прокрутку фона надёжно — и html, и body
    const de = document.documentElement;
    const prevHtml = de.style.overflow, prevBody = document.body.style.overflow;
    de.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    // мерим доступную область под форму (и следим за ресайзом окна)
    function measure() {
      const el = boxRef.current;
      if (el) setBox({ w: el.clientWidth, h: el.clientHeight });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", measure);
      de.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [open, loaded]);

  // Масштаб: на десктопе, если контент выше доступной области — ужимаем так,
  // чтобы ВСЯ форма (включая галочки согласий) была видна без прокрутки.
  const fit = open && innerH > 0 && box.h > 0 && innerH > box.h && window.innerWidth >= 700
    ? box.h / innerH : 1;

  const iframeStyle = fit < 1
    ? { display: "block", border: "0", width: (box.w / fit) + "px", height: innerH + "px",
        transform: "scale(" + fit + ")", transformOrigin: "0 0",
        opacity: loaded ? 1 : 0, transition: "opacity .2s ease" }
    : { display: "block", border: "0", width: "100%", height: "100%",
        opacity: loaded ? 1 : 0, transition: "opacity .2s ease" };

  // Оверлей всегда в DOM (чтобы iframe не перезагружался), видимость — через стиль.
  return React.createElement("div", {
      style: { position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,20,15,0.6)", padding: "16px", overscrollBehavior: "contain", visibility: open ? "visible" : "hidden", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity .2s ease" },
      onClick: () => setOpen(false)
    },
    React.createElement("div", {
        onClick: e => e.stopPropagation(),
        style: { position: "relative", display: "flex", flexDirection: "column", width: "100%", maxWidth: "480px", height: "min(96vh, 940px)", overflow: "hidden", background: "var(--paper)", borderRadius: "var(--r-card)", padding: "clamp(18px, 4vw, 26px) clamp(16px, 4vw, 20px) 12px", boxShadow: "var(--shadow-lift)" }
      },
      React.createElement("button", {
        type: "button", onClick: () => setOpen(false), "aria-label": "Закрыть",
        style: { position: "absolute", top: "12px", right: "12px", width: "34px", height: "34px", border: "none", background: "var(--sand)", borderRadius: "999px", fontSize: "1.15rem", color: "var(--ink)", cursor: "pointer", lineHeight: 1, zIndex: 4 }
      }, "✕"),

      React.createElement("h2", { style: { flexShrink: 0, margin: "0 0 4px", fontSize: "var(--fs-h3)", lineHeight: 1.15, paddingRight: "40px", color: "var(--ink)" } }, cfg.title),
      React.createElement("p", { style: { flexShrink: 0, margin: "0 0 12px", fontFamily: "var(--font-mono)", fontSize: "var(--fs-mono)", letterSpacing: "var(--ls-mono-wide)", color: "var(--coral)" } }, cfg.subtitle),

      React.createElement("div", { ref: boxRef, style: { flex: "1 1 auto", minHeight: 0, position: "relative", overflow: "hidden" } },
        warm && React.createElement("iframe", {
          src: widgetSrc(),
          title: "Форма записи",
          onLoad: () => setLoaded(true),
          style: iframeStyle,
          allow: "clipboard-write"
        })
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById("lead-modal-root")).render(React.createElement(LeadModal, RUBLE_CFG));
ReactDOM.createRoot(document.getElementById("pay-foreign-root")).render(React.createElement(LeadModal, FOREIGN_CFG));
})();
