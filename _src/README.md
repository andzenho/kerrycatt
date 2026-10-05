# Исходники и сборка

- `dokumenty/` — markdown-исходники юридических документов. HTML-страницы (`/offer/`, `/privacy/` и другие) собираются из них: `python3 _src/build.py`. После правок обнови и Google Docs.
- `build_variants.py` — собирает страницы для менеджеров из основного лендинга Большой Игры. Запускай после любой правки `bolshaya-igra/index.html`: `python3 _src/build_variants.py`.
  - `/bolshaya-igra-bron/` — бронь, тариф «В команде»;
  - `/bolshaya-igra-rassrochka/` — внутренняя рассрочка, тариф «В команде»;
  - `/bolshaya-igra-sam/` — тариф «В своём темпе», полная оплата (даунсейл);
  - `/bolshaya-igra-sam-rassrochka/` — тариф «В своём темпе», внутренняя рассрочка;
  - `/bolshaya-igra-krug/` — тариф «Ближний круг», полная оплата;
  - `/bolshaya-igra-krug-rassrochka/` — тариф «Ближний круг», внутренняя рассрочка.
  - Полная оплата тарифа «В команде» идёт через основной лендинг `/bolshaya-igra/`.
- Ссылки оплаты, суммы и тексты формы для всех страниц лежат в `bolshaya-igra/tariff-forms.js` (блок `VARIANTS`).
- `bolshaya-igra-test/` — тестовая страница нового дизайна Большой Игры. Написана вручную (`index.html`, `style.css`, `page.js`), без бандла; на действующие страницы не влияет. Форма заявки та же: `../bolshaya-igra/tariff-forms.js`.
