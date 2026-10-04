# -*- coding: utf-8 -*-
"""Собирает страницы для менеджеров из основного лендинга Большой Игры (bolshaya-igra/index.html).

Тариф «В команде» (условия оплаты другие, содержание то же):
  /bolshaya-igra-bron/             бронь
  /bolshaya-igra-rassrochka/       внутренняя рассрочка, первый платёж
Тариф «В своём темпе» (даунсейл: без куратора, группы и эфиров):
  /bolshaya-igra-sam/              полная оплата
  /bolshaya-igra-sam-rassrochka/   внутренняя рассрочка, первый платёж

После любой правки основного лендинга запусти: python3 _src/build_variants.py
Ссылки оплаты, суммы под кнопками и тексты формы лежат в bolshaya-igra/tariff-forms.js (VARIANTS)."""
import os
import re

RL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(RL, 'bolshaya-igra', 'index.html')

# Бандл экранирован: кавычки как \" , закрывающие теги как <\u002F , перенос строки как \n (два символа)
END = '<\\u002Fspan>'
MONO = ("font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.14em;"
        "text-transform:uppercase;color:rgba(246,238,226,.62);")
NOTE = "font-size:14px;line-height:1.45;color:rgba(246,238,226,.82);"
PRICE_ROW = '<div style=\\"display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;\\">'
ALT_MAIN = 'или $299 \\u002F €269 картой не из России'
FAQ_MAIN = ('Сейчас участие стоит 24 990 ₽, а если карта не из России, то $299 или €269. '
            'Оплатить можно сразу после заявки: всю сумму или в рассрочку до 12 месяцев. '
            'Если остались вопросы, моя команда ответит.')
NOWRAP = '<span style=\\"white-space:nowrap;\\">%s' + END

VARIANTS = {
    'bolshaya-igra-bron': {
        'title': 'Большая Игра: бронь — Карина',
        'label': 'бронь места',
        'price': '2&nbsp;000&nbsp;₽',
        'old': '',
        'alt': 'или $24 \\u002F €22 картой не из России',
        'note': 'Бронь входит в стоимость участия и закрепляет за тобой место. Цена '
                + NOWRAP % '{{ price }}&nbsp;₽' + ' сохраняется за тобой до ' + NOWRAP % '{{ riseDate }}' + '.',
        'faq': 'Участие стоит 24 990 ₽, а если карта не из России, то $299 или €269. '
               'Сейчас можно внести бронь 2 000 ₽ ($24 или €22). Она закрепляет за тобой место и входит в стоимость. '
               'Если остались вопросы, моя команда ответит.',
    },
    'bolshaya-igra-rassrochka': {
        'title': 'Большая Игра: оплата частями — Карина',
        'label': 'первый платёж из двух',
        'price': '12&nbsp;485&nbsp;₽',
        'old': '',
        'alt': 'или $150 \\u002F €135 картой не из России',
        'note': 'Оплата делится на два платежа. Сумму и дату второго платежа подтвердит менеджер.',
        'faq': 'Оплату можно разделить на два платежа. Первый платёж 12 485 ₽, а если карта не из России, то $150 или €135. '
               'Сумму и дату второго платежа подтвердит моя команда.',
    },
    'bolshaya-igra-sam': {
        'self': True,
        'title': 'Большая Игра: в своём темпе — Карина',
        'label': '',
        'price': '14&nbsp;990&nbsp;₽',
        'old': '29&nbsp;990&nbsp;₽',
        'alt': 'или $180 \\u002F €160 картой не из России',
        'note': '',
        'faq': 'Сейчас участие стоит 14 990 ₽, а если карта не из России, то $180 или €160. '
               'Оплатить можно сразу после заявки. Если остались вопросы, моя команда ответит.',
    },
    'bolshaya-igra-sam-rassrochka': {
        'self': True,
        'title': 'Большая Игра: в своём темпе, оплата частями — Карина',
        'label': 'первый платёж из двух',
        'price': '7&nbsp;495&nbsp;₽',
        'old': '',
        'alt': 'или $90 \\u002F €80 картой не из России',
        'note': 'Оплата делится на два платежа. Сумму и дату второго платежа подтвердит менеджер.',
        'faq': 'Оплату можно разделить на два платежа. Первый платёж 7 495 ₽, а если карта не из России, то $90 или €80. '
               'Сумму и дату второго платежа подтвердит моя команда.',
    },
}


class Page:
    def __init__(self, name):
        self.name = name
        self.s = open(SRC, encoding='utf-8').read()

    def once(self, a, b):
        assert self.s.count(a) == 1, (self.name, self.s.count(a), a[:80])
        self.s = self.s.replace(a, b)

    def cut(self, start, end, must=()):
        chunk = self.s[start:end]
        for m in must:
            assert m in chunk, (self.name, m, chunk[:120])
        self.s = self.s[:start] + self.s[end:]

    def drop_section(self, label):
        i = self.s.find('data-screen-label=\\"' + label + '\\"')
        assert i > 0, (self.name, label)
        a = self.s.rfind('<section', 0, i)
        tail = '<\\u002Fsection>'
        b = self.s.find(tail, i) + len(tail)
        while self.s.startswith('\\n', b):
            b += 2
        self.cut(a, b, (label,))

    def drop_wrapped(self, text, depth, tail):
        """Удаляет элемент с текстом text вместе с depth оборачивающими <span и хвостом tail."""
        i = self.s.find(text)
        assert i > 0 and self.s.count(text) == 1, (self.name, self.s.count(text), text)
        a = i
        for _ in range(depth):
            a = self.s.rfind('<span', 0, a)
        b = i + len(text)
        assert self.s.startswith(tail, b), (self.name, text, self.s[b:b + 60])
        self.cut(a, b + len(tail))

    def js_drop(self, pattern):
        """Удаляет элемент массива в коде страницы (вместе с запятой перед ним)."""
        self.s, n = re.subn(pattern, '', self.s)
        assert n == 1, (self.name, n, pattern)


def to_self(p):
    """Тариф «В своём темпе»: убираем всё про куратора, группу, чат и эфиры."""
    # Первый экран
    p.once('>🎬<', '>🎓<')
    p.once('>Куратор разбирает каждый твой выложенный рилс и&nbsp;говорит, что усилить<',
           '>20+ уроков от&nbsp;меня открываются по&nbsp;ходу игры<')
    p.once('>👥<', '>⏳<')
    p.once('>Идёшь в&nbsp;группе из&nbsp;50&nbsp;человек, которые снимают вместе с&nbsp;тобой<',
           '>Проходишь сама, когда удобно. Задания не&nbsp;сгорают<')
    # Блоки про куратора и группы целиком
    p.drop_section('08 Куратор')
    p.drop_section('11 Группы')
    # Как пройдут 40 дней
    p.drop_wrapped('Куратор разбирает и&nbsp;говорит, что усилить', 3, END + END + '\\n')
    i = p.s.find('К&nbsp;нужной неделе открывается урок')
    a = p.s.rfind('>04<', 0, i)
    assert 0 < i - a < 400, (p.name, 'шаг 04')
    p.s = p.s[:a] + '>03<' + p.s[a + 4:]
    p.once('которые ты снимаешь вместе со&nbsp;мной и&nbsp;моей командой', 'которые ты снимаешь по&nbsp;моим заданиям')
    # Что заберёшь, не для тебя, FAQ (массивы в коде страницы)
    p.js_drop(r",\\n\s*\['👥', 'Своих людей вокруг, близких по духу'\]")
    p.once('Не готова снимать себя. Мы разбираем только выложенные рилсы, снимать в стол тут не получится.',
           'Не готова снимать себя. Снимать в стол тут не получится.')
    p.js_drop(r",\\n\s*\['🗯️', 'Не готова слышать, что в ролике поправить\. Обратная связь тут каждую неделю\.'\]")
    p.once('Здесь каждое утро приходит задание, что снять сегодня, а твой выложенный рилс смотрит куратор. ',
           'Здесь каждое утро приходит задание, что снять сегодня. ')
    p.js_drop(r"\\n\s*\['Страшно выкладывать свой рилс в чат на 50 человек\.', '[^']*'\],")
    # Карточка тарифа
    p.drop_wrapped('50 мест', 1, END + '\\n')
    p.once('>В команде' + END, '>В своём темпе' + END)
    p.once('Куратор смотрит каждый твой рилс и&nbsp;говорит, что усилить. Рядом группа из&nbsp;50&nbsp;человек, '
           'которые снимают вместе с&nbsp;тобой.',
           'Все задания и&nbsp;уроки приходят в&nbsp;закрытый канал игры. Проходишь сама, когда удобно.')
    for item in ['Группа из&nbsp;50&nbsp;человек со&nbsp;своим чатом',
                 'Куратор разбирает каждый твой выложенный рилс',
                 '2 живых разбора в&nbsp;Zoom со&nbsp;мной']:
        i = p.s.find(END + item + END + '\\n')
        assert i > 0 and p.s.count(END + item + END + '\\n') == 1, (p.name, item)
        a = p.s.rfind('<span', 0, p.s.rfind('<span', 0, i))
        p.cut(a, i + len(END + item + END + '\\n'), ('✓',))
    p.once('20+ уроков и&nbsp;инструменты' + END + '\\n',
           '20+ уроков и&nbsp;инструменты' + END + '\\n<span style=\\"' + NOTE + '\\">Без куратора и&nbsp;группы.'
           + END + '\\n')
    p.once('Сорок дней рядом с&nbsp;тобой задание, <span', 'Сорок дней рядом с&nbsp;тобой <span')
    p.once('>куратор и группа' + END, '>задания и уроки' + END)
    # Финал
    p.once('отвечает на&nbsp;все вопросы, помогает определиться с&nbsp;группой, безопасно оплатить',
           'отвечает на&nbsp;все вопросы, помогает безопасно оплатить')


def build(name, v):
    p = Page(name)
    if v.get('self'):
        to_self(p)
    p.once('<script src="tariff-forms.js?v=', '<script src="../bolshaya-igra/tariff-forms.js?v=')
    p.once('<title>Большая Игра — Карина</title>',
           '<title>' + v['title'] + '</title>\n  <meta name="robots" content="noindex">')
    if v['label']:
        p.once(PRICE_ROW, '<span style=\\"margin-bottom:-10px;' + MONO + '\\">' + v['label'] + END + '\\n' + PRICE_ROW)
    p.once('{{ price }}&nbsp;₽' + END, v['price'] + END)
    p.once('>44&nbsp;990&nbsp;₽' + END, '>' + v['old'] + END)
    note = ('<span style=\\"' + NOTE + '\\">' + v['note'] + END + '\\n') if v['note'] else ''
    p.once(ALT_MAIN + END + '\\n', v['alt'] + END + '\\n' + note)
    p.once(FAQ_MAIN, v['faq'])

    for bad in (['куратор', 'Куратор', 'групп', 'Zoom', 'зум', '50 мест', 'В команде', 'чат на 50']
                if v.get('self') else []):
        # в коде страницы остаются служебные упоминания; проверяем только шаблон и тексты
        a = p.s.find('<x-dc'); b = p.s.find('<\\u002Fx-dc>')
        c = p.s.find('const pains'); d = p.s.find('].map(([q, a], i)')
        assert 0 < a < b and 0 < c < d, (name, 'границы проверки')
        text = re.sub(r'<[^>]+>', ' ', (p.s[a:b] + p.s[c:d]).replace('\\u002F', '/').replace('\\"', '"'))
        text = text.replace('Без куратора и&nbsp;группы.', '')  # эту строку добавляем сами
        assert bad not in text, (name, bad, text[max(0, text.find(bad) - 80):text.find(bad) + 80])

    out = os.path.join(RL, name)
    os.makedirs(out, exist_ok=True)
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(p.s)
    print(name, len(p.s))


if __name__ == '__main__':
    for name, v in VARIANTS.items():
        build(name, v)
