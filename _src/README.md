# Исходники и сборка

- `dokumenty/` — markdown-исходники юридических документов. HTML-страницы (`/offer/`, `/privacy/` и другие) собираются из них: `python3 _src/build.py`. После правок обнови и Google Docs.
- `build_variants.py` — собирает страницы для менеджеров из основного лендинга Большой Игры: `/bolshaya-igra-bron/` (бронь) и `/bolshaya-igra-rassrochka/` (внутренняя рассрочка). Запускай после любой правки `bolshaya-igra/index.html`: `python3 _src/build_variants.py`.
- Ссылки оплаты, суммы и тексты формы для всех трёх страниц лежат в `bolshaya-igra/tariff-forms.js` (блок `VARIANTS`).
