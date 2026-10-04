# -*- coding: utf-8 -*-
"""Собирает страницы для менеджеров из основного лендинга Большой Игры:
   /bolshaya-igra-bron/ (бронь) и /bolshaya-igra-rassrochka/ (внутренняя рассрочка).
   Это копии bolshaya-igra/index.html с другими условиями оплаты. После правок основного лендинга
   запусти: python3 _src/build_variants.py
   Ссылки оплаты и тексты формы лежат в bolshaya-igra/tariff-forms.js (VARIANTS)."""
import os

RL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(RL, 'bolshaya-igra', 'index.html')

# Бандл экранирован: кавычки как \" , закрывающие теги и «/» в тексте как / , перенос строки как \n
MONO = ("font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.14em;"
        "text-transform:uppercase;color:rgba(246,238,226,.62);")
NOTE = "font-size:14px;line-height:1.45;color:rgba(246,238,226,.82);"

VARIANTS = {
    'bolshaya-igra-bron': {
        'title': 'Большая Игра: бронь — Карина',
        'label': 'бронь места',
        'price': '2&nbsp;000&nbsp;₽',
        'alt': 'или $24 \\u002F €22 картой не из России',
        'note': 'Бронь входит в стоимость участия и закрепляет за тобой место. '
                'Цена <span style=\\"white-space:nowrap;\\">{{ price }}&nbsp;₽<\\u002Fspan> сохраняется за тобой до <span style=\\"white-space:nowrap;\\">{{ riseDate }}<\\u002Fspan>.',
        'faq': 'Участие стоит 24 990 ₽, а если карта не из России, то $299 или €269. '
               'Сейчас можно внести бронь 2 000 ₽ ($24 или €22). Она закрепляет за тобой место и входит в стоимость. '
               'Если остались вопросы, моя команда ответит.',
    },
    'bolshaya-igra-rassrochka': {
        'title': 'Большая Игра: оплата частями — Карина',
        'label': 'первый платёж из двух',
        'price': '12&nbsp;485&nbsp;₽',
        'alt': 'или $150 \\u002F €135 картой не из России',
        'note': 'Оплата делится на два платежа. Сумму и дату второго платежа подтвердит менеджер.',
        'faq': 'Оплату можно разделить на два платежа. Первый платёж 12 485 ₽, а если карта не из России, то $150 или €135. '
               'Сумму и дату второго платежа подтвердит моя команда.',
    },
}

PRICE_ROW = '<div style=\\"display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;\\">'
ALT_MAIN = 'или $299 \\u002F €269 картой не из России'
FAQ_MAIN = ('Сейчас участие стоит 24 990 ₽, а если карта не из России, то $299 или €269. '
            'Оплатить можно сразу после заявки: всю сумму или в рассрочку до 12 месяцев. '
            'Если остались вопросы, моя команда ответит.')


def build(name, v):
    s = open(SRC, encoding='utf-8').read()

    def once(a, b):
        nonlocal s
        assert s.count(a) == 1, (name, s.count(a), a[:70])
        s = s.replace(a, b)

    once('<script src="tariff-forms.js?v=', '<script src="../bolshaya-igra/tariff-forms.js?v=')
    once('<title>Большая Игра — Карина</title>',
         '<title>' + v['title'] + '</title>\n  <meta name="robots" content="noindex">')
    once(PRICE_ROW,
         '<span style=\\"margin-bottom:-10px;' + MONO + '\\">' + v['label'] + '<\\u002Fspan>\\n' + PRICE_ROW)
    once('{{ price }}&nbsp;₽<\\u002Fspan>', v['price'] + '<\\u002Fspan>')
    once('>44&nbsp;990&nbsp;₽<\\u002Fspan>', '><\\u002Fspan>')
    once(ALT_MAIN + '<\\u002Fspan>\\n',
         v['alt'] + '<\\u002Fspan>\\n<span style=\\"' + NOTE + '\\">' + v['note'] + '<\\u002Fspan>\\n')
    once(FAQ_MAIN, v['faq'])

    out = os.path.join(RL, name)
    os.makedirs(out, exist_ok=True)
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(s)
    print(name, len(s))


if __name__ == '__main__':
    for name, v in VARIANTS.items():
        build(name, v)
