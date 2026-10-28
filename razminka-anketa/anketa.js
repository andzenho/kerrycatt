/* Анкета после оплаты Разминки: пять вопросов кнопками и ссылка на Инстаграм.
   Ответы уходят на лист «Анкета Разминки» (kind: rz_anketa), потом сразу открываем файл с подарками
   (50 идей рилсов и 100 хуков, ../razminka-podarki/razminka-2-podarki.pdf, решение Ильи 28.10, без Даши).
   Кнопка канала Разминки остаётся второй.
   Имя, телефон и ник берём из заявки на странице Разминки (rz.js кладёт их в rz_me). Нет заявки, спрашиваем ник. */
(function () {
  var EP = "https://script.google.com/macros/s/AKfycbyHbXYMZMWX1belQqULpMz84rfmhP2LXmcIMzroqhr4PKjvNOxIR4lump3OfY04ZC4x/exec";
  var CHANNEL = "https://t.me/+ZxE16oI_O7QzNTM6", STORE = "rz_anketa_q";
  var GIFTS = "../razminka-podarki/razminka-2-podarki.pdf";
  var QS = [
    { k: "goal", q: "Какую главную задачу ты хочешь решить на Разминке?", o: ["Перестать бояться камеры", "Найти, о чём снимать", "Сделать ролики интереснее", "Начать выкладывать регулярно"] },
    { k: "reels", q: "Ты уже снимала рилсы?", o: ["Ни разу", "Пробовала и бросила", "Снимаю, но мало просмотров"] },
    { k: "why", q: "Зачем тебе блог?", o: ["Найти своих людей", "Личный бренд", "Клиенты и доход", "Хочу просто говорить"] },
    { k: "since", q: "Как давно ты смотришь Карину?", o: ["Недавно узнала", "Несколько месяцев", "Больше года"] },
    { k: "game", q: "Ты уже знаешь про Большую Игру?", o: ["Впервые слышу", "Знаю, присматриваюсь", "Уже решила, что пойду"] }
  ];
  var TOTAL = QS.length + 1;
  var card = document.querySelector("[data-card]"), step = 0, ans = {}, openedAt = Date.now(), sending = false;
  var me = {};
  try { me = JSON.parse(localStorage.getItem("rz_me") || "{}") || {}; } catch (e) {}

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function head() {
    return '<div class="prog"><span>Вопрос ' + (step + 1) + " из " + TOTAL + '</span><button type="button" data-back' + (step ? "" : " hidden") + ">← Назад</button></div>" +
      '<div class="bar"><i style="width:' + Math.round(step / TOTAL * 100) + '%"></i></div>';
  }
  function render() {
    if (step < QS.length) {
      var s = QS[step];
      card.innerHTML = head() + '<p class="q">' + s.q + '</p><div class="opts">' +
        s.o.map(function (o) { return '<button type="button" class="opt' + (ans[s.k] === o ? " on" : "") + '" data-o="' + esc(o) + '">' + o + "</button>"; }).join("") + "</div>";
      return;
    }
    card.innerHTML = head() + '<form novalidate><p class="q">Пришли ссылку на свой Instagram</p>' +
      '<div class="f" data-f="ig"><input class="in" name="ig" inputmode="url" autocomplete="off" placeholder="instagram.com/твой_ник" maxlength="200" value="' + esc(ans.instagram || "") + '"></div>' +
      (me.tg ? "" : '<div class="f" data-f="tg"><label for="rz-tg">Ник в Телеграме, как в заявке на Разминку</label><input class="in" id="rz-tg" name="tg" autocomplete="off" placeholder="@nickname" maxlength="60"></div>') +
      '<div class="hp" aria-hidden="true"><input name="company" tabindex="-1" autocomplete="off"></div>' +
      '<p class="note">Отправляя ответы, соглашаюсь на обработку персональных данных по <a href="../consent/" target="_blank" rel="noopener">Согласию</a> и <a href="../privacy/" target="_blank" rel="noopener">Политике</a>. Мне есть 18 лет</p>' +
      '<button class="btn" type="submit">Отправить ответы</button></form>';
  }
  function bad(f, m) {
    var b = card.querySelector('[data-f="' + f + '"]'); if (!b) return;
    b.querySelector(".in").classList.add("bad");
    if (!b.querySelector(".err")) b.insertAdjacentHTML("beforeend", '<p class="err">' + m + "</p>");
  }
  function post(b) { return fetch(EP, { method: "POST", body: b }).then(function (r) { return r.json(); }).then(function (j) { return !!(j && j.ok); }).catch(function () { return false; }); }
  function done() {
    card.innerHTML = '<div class="done"><p class="kick">Готово</p><p class="q">Ответы у экспертов</p>' +
      "<p>Теперь забери подарки, 50&nbsp;идей рилсов и&nbsp;100&nbsp;хуков в&nbsp;одном файле</p>" +
      '<div class="sub"><i>!</i><span>Сохрани файл на&nbsp;телефон, чтобы он был под рукой, когда соберёшься снимать</span></div>' +
      '<a class="btn" href="' + GIFTS + '">Забрать подарки</a>' +
      '<a class="btn btn2" href="' + CHANNEL + '">Перейти в канал Разминки</a>' +
      '<p class="note" data-auto>Через несколько секунд откроем файл сами</p></div>';
    setTimeout(function () { location.href = GIFTS; }, 6000);
  }
  function submit(f) {
    if (sending) return;
    var ig = f.ig.value.trim(), tg = me.tg || (f.tg ? f.tg.value.trim() : ""), ok = true;
    if (ig.replace(/^@/, "").length < 2) { bad("ig", "Пришли ссылку или ник в Instagram"); ok = false; }
    if (!me.tg && tg.replace("@", "").length < 2) { bad("tg", "Укажи ник в Телеграме, по нему найдём твою оплату"); ok = false; }
    if (!ok) return;
    if (!/^@/.test(tg) && !/t\.me\//.test(tg)) tg = "@" + tg;
    ans.instagram = ig;
    var payload = JSON.stringify({ kind: "rz_anketa", anketa: { name: me.name || "", phone: me.phone || "", tgNick: tg,
      goal: ans.goal, reels: ans.reels, why: ans.why, since: ans.since, game: ans.game, instagram: ig },
      hp: f.company.value || (Date.now() - openedAt < 4000 ? "fast" : ""), page: location.href.split("#")[0].slice(0, 300) });
    sending = true; var btn = f.querySelector(".btn"); btn.disabled = true; btn.textContent = "Отправляю…";
    post(payload).then(function (sent) {
      sending = false;
      if (!sent) { try { var q = JSON.parse(localStorage.getItem(STORE) || "[]"); q.push(payload); localStorage.setItem(STORE, JSON.stringify(q.slice(-3))); } catch (e) {} }
      done();
    });
  }

  card.addEventListener("click", function (e) {
    var o = e.target.closest("[data-o]");
    if (o) { ans[QS[step].k] = o.getAttribute("data-o"); o.classList.add("on"); setTimeout(function () { step++; render(); window.scrollTo({ top: card.offsetTop - 16, behavior: "smooth" }); }, 160); return; }
    if (e.target.closest("[data-back]") && step > 0) { step--; render(); }
  });
  card.addEventListener("input", function (e) { var b = e.target.closest(".f"); if (b) { var er = b.querySelector(".err"); if (er) er.remove(); e.target.classList.remove("bad"); } });
  card.addEventListener("submit", function (e) { e.preventDefault(); submit(e.target); });

  // если в прошлый раз сеть подвела, досылаем
  try { var q = JSON.parse(localStorage.getItem(STORE) || "[]"); if (q.length) { localStorage.removeItem(STORE); q.forEach(function (b) { post(b); }); } } catch (e) {}
  render();
})();
