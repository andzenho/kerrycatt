# -*- coding: utf-8 -*-
"""Собирает страницы для менеджеров из основного лендинга Большой Игры (bolshaya-igra/index.html).

Тариф «В команде» (условия оплаты другие, содержание то же):
  /bolshaya-igra-bron/             бронь
  /bolshaya-igra-rassrochka/       внутренняя рассрочка, первый платёж
Тариф «В своём темпе» (даунсейл: задания и уроки, без куратора, эфиров и новых пунктов командного тарифа):
  /bolshaya-igra-sam/              полная оплата
  /bolshaya-igra-sam-rassrochka/   внутренняя рассрочка, первый платёж
Тариф «Ближний круг» (всё из «В команде» плюс закрытый чат с Кариной, продюсеры и модуль по UGC; меняется карточка тарифа):
  /bolshaya-igra-krug/             полная оплата
  /bolshaya-igra-krug-rassrochka/  внутренняя рассрочка, первый платёж
Полная оплата тарифа «В команде» идёт через основной лендинг /bolshaya-igra/.
Все три тарифа на одной странице (карточки по макету тарифов от 05.10, тариф выбирают кнопкой в карточке):
  /bolshaya-igra-tarify/             полная оплата
  /bolshaya-igra-tarify-rassrochka/  внутренняя рассрочка, первый платёж

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
        'note': 'Бронь входит в стоимость участия и фиксирует для тебя цену ' + NOWRAP % '{{ price }}&nbsp;₽' + '.',
        'faq': 'Участие стоит 24 990 ₽, а если карта не из России, то $299 или €269. '
               'Сейчас можно внести бронь 2 000 ₽ ($24 или €22). Она фиксирует цену и входит в стоимость. '
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
    'bolshaya-igra-krug': {
        'close': True,
        'title': 'Большая Игра: ближний круг — Карина',
        'label': '',
        'price': '49&nbsp;990&nbsp;₽',
        'old': '69&nbsp;990&nbsp;₽',
        'alt': 'или $599 \\u002F €539 картой не из России',
        'note': '',
        'faq': 'Сейчас участие стоит 49 990 ₽, а если карта не из России, то $599 или €539. '
               'Оплатить можно сразу после заявки. Если остались вопросы, моя команда ответит.',
    },
    'bolshaya-igra-krug-rassrochka': {
        'close': True,
        'title': 'Большая Игра: ближний круг, оплата частями — Карина',
        'label': 'первый платёж из двух',
        'price': '24&nbsp;995&nbsp;₽',
        'old': '',
        'alt': 'или $300 \\u002F €270 картой не из России',
        'note': 'Оплата делится на два платежа. Сумму и дату второго платежа подтвердит менеджер.',
        'faq': 'Оплату можно разделить на два платежа. Первый платёж 24 995 ₽, а если карта не из России, то $300 или €270. '
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


ITEM = ('<span style=\\"display:flex;gap:12px;align-items:flex-start;font-size:16px;line-height:1.45;'
        'color:rgba(246,238,226,.9);\\"><span style=\\"flex:0 0 auto;width:20px;height:20px;background:#F6EEE2;'
        'color:#1F1F1F;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;'
        'margin-top:2px;\\">✓' + END + '%s' + END + '\\n')
BADGE_CSS = ('display:inline-block;margin-left:4px;padding:1px 6px;border:1px solid rgba(227,118,139,.55);'
             "border-radius:999px;color:#E3768B;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;"
             'letter-spacing:.1em;line-height:1.4;text-transform:uppercase;white-space:nowrap;vertical-align:middle;'
             'position:relative;top:-1px;')


def badge(text, extra=''):
    return '<span style=\\"' + BADGE_CSS + extra + '\\">' + text + END


BADGE = badge('новинка')


def new_item(text, mark=BADGE):
    """Пункт карточки с маленькой меткой справа от текста (по умолчанию «новинка»); метка держится за последнее слово."""
    nb = '&nbsp;'
    i = max(text.rfind(' '), text.rfind(nb))
    j = i + (len(nb) if text.startswith(nb, i) else 1)
    return ITEM % ('<span>' + text[:j] + '<span style=\\"white-space:nowrap;\\">' + text[j:] + ' ' + mark + END + END)


CARD_FIRST = new_item('Неделя погружения до&nbsp;старта: как дойти до&nbsp;30&nbsp;роликов и&nbsp;не&nbsp;слиться')
CARD_LAST = ITEM % 'Чат участниц: лайфстайл и&nbsp;экспертный блог отдельно'


def drop_bonus(p):
    """Бонус первого окна даётся только за полную оплату тарифа «В команде»."""
    a = p.s.find('<sc-if value=\\"{{ firstWindow }}\\"')
    tail = '<\\u002Fsc-if>\\n'
    b = p.s.find(tail, a) + len(tail)
    assert a > 0, (p.name, 'бонус')
    p.cut(a, b, ('Доступ к&nbsp;урокам навсегда',))


def to_self(p):
    """Тариф «В своём темпе»: убираем всё про куратора, эфиры и новые пункты тарифа «В команде»."""
    # Первый экран
    p.once('>🎬<', '>🎓<')
    p.once('>Куратор разбирает каждый твой выложенный рилс и&nbsp;говорит, что усилить<',
           '>Уроки от&nbsp;меня открываются по&nbsp;ходу игры<')
    p.once('>🗓️<', '>⏳<')
    p.once('>Каждый понедельник записываю кружок с&nbsp;планом недели<',
           '>Проходишь сама, когда удобно. Задания не&nbsp;сгорают<')
    # Блок про куратора и эфиры целиком
    p.drop_section('08 Куратор')
    # Как пройдут 40 дней
    i = p.s.find('до старта · неделя погружения')
    assert i > 0, (p.name, 'неделя погружения')
    a = p.s.rfind('<div style=', 0, i)
    tail = '<\\u002Fdiv>\\n'
    p.cut(a, p.s.find(tail, i) + len(tail), ('Как дойти до&nbsp;30&nbsp;роликов',))
    p.once(' Тему утверждает куратор: пока она не&nbsp;утверждена, дальше не&nbsp;идёшь.', '')
    p.drop_wrapped('Куратор разбирает и&nbsp;говорит, что усилить', 3, END + END + '\\n')
    i = p.s.find('К&nbsp;нужной неделе открывается урок')
    a = p.s.rfind('>04<', 0, i)
    assert 0 < i - a < 400, (p.name, 'шаг 04')
    p.s = p.s[:a] + '>03<' + p.s[a + 4:]
    p.drop_wrapped('По&nbsp;понедельникам мой кружок с&nbsp;планом недели', 1, END + '\\n')
    p.once('которые ты снимаешь вместе со&nbsp;мной и&nbsp;моей командой', 'которые ты снимаешь по&nbsp;моим заданиям')
    # Что ещё внутри
    p.once(' Доступ к&nbsp;урокам остаётся ещё 45&nbsp;дней после игры.', '')
    for tool in ['ИИ-ассистент по&nbsp;моему методу: тема, идеи, первая фраза, план ролика',
                 'Шаблоны профиля: шапка, закреп, обложки',
                 'Шаблон контент-плана на&nbsp;месяц после игры',
                 'Банк хуков и&nbsp;трендов, обновляем по&nbsp;ходу потока']:
        chip = 'line-height:1.2;\\">' + tool + END + '\\n'  # именно плашка в «Инструментах», не пункт карточки
        i = p.s.find(chip)
        assert i > 0 and p.s.count(chip) == 1, (p.name, tool)
        p.cut(p.s.rfind('<span', 0, i), i + len(chip))
    # Что заберёшь, не для тебя, FAQ (массивы в коде страницы)
    p.js_drop(r",\\n\s*\['👥', 'Своих людей вокруг, близких по духу'\]")
    p.once('Не готова снимать себя. Мы разбираем только выложенные рилсы, снимать в стол тут не получится.',
           'Не готова снимать себя. Снимать в стол тут не получится.')
    p.js_drop(r",\\n\s*\['🗯️', 'Не готова слышать, что в ролике поправить\. Обратная связь тут каждую неделю\.'\]")
    p.once('Здесь каждое утро приходит задание, что снять сегодня, а твой выложенный рилс смотрит куратор. ',
           'Здесь каждое утро приходит задание, что снять сегодня. ')
    # Карточка тарифа
    p.drop_wrapped('50 мест', 1, END + '\\n')
    p.once('>В команде' + END, '>В своём темпе' + END)
    p.once('Проходишь Игру с&nbsp;куратором и&nbsp;потоком, без&nbsp;шанса слиться',
           'Все задания и&nbsp;уроки приходят в&nbsp;закрытый канал игры. Проходишь сама, когда удобно.')
    a = p.s.find(CARD_FIRST)
    b = p.s.find(CARD_LAST)
    assert 0 < a < b, (p.name, 'список тарифа')
    p.s = (p.s[:a] + ITEM % '30 заданий, что и&nbsp;как снять' + ITEM % 'Уроки и&nbsp;инструменты'
           + '<span style=\\"' + NOTE + '\\">Без куратора и&nbsp;группы.' + END + '\\n' + p.s[b + len(CARD_LAST):])


# Карточка тарифа «Ближний круг», тексты по макету тарифов от 05.10. Пункт: текст и метка (NEW, ONLY или пусто).
NEW = badge('новое')
ONLY = badge('только здесь', 'background:#E3768B;border-color:#E3768B;color:#1F1F1F;')
CLOSE_ITEMS = [
    ('30 заданий и&nbsp;уроки по&nbsp;методу яппинга', ''),
    ('Модуль «Дисциплина»: как дойти до&nbsp;30&nbsp;роликов и&nbsp;не&nbsp;слиться', NEW),
    ('ИИ-ассистент: подскажет тему, идеи и&nbsp;первую фразу ролика', NEW),
    ('Шаблоны профиля и&nbsp;контент-плана, банк хуков', NEW),
    ('Первая неделя: куратор помогает найти и&nbsp;утвердить твою тему', NEW),
    ('Куратор разбирает каждый твой ролик', ''),
    ('По&nbsp;понедельникам&nbsp;— план работы на&nbsp;неделю', NEW),
    ('2&nbsp;эфира с&nbsp;Кариной: она отвечает на&nbsp;ваши вопросы', ''),
    ('Чат участниц потока: отдельно для&nbsp;экспертного и&nbsp;лайфстайл-блога', ''),
    ('Модуль «Ритм на&nbsp;год»: как снимать после Игры весь год без&nbsp;выгорания', NEW),
    ('Закрытый чат с&nbsp;Кариной: раз в&nbsp;неделю она голосом отвечает на&nbsp;ваши вопросы', NEW),
    ('Продюсеры Карины отвечают в&nbsp;чате между её&nbsp;голосовыми', NEW),
    ('Модуль по&nbsp;UGC: заработок на&nbsp;контенте для&nbsp;брендов', ONLY),
]
CLOSE_PILL = ('<span style=\\"display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:999px;'
              "background:#F6EEE2;color:#1F1F1F;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;"
              'letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;\\">UGC + максимум связи' + END)


def to_close(p):
    """Тариф «Ближний круг»: страница та же, что у «В команде», меняется карточка тарифа. Доступ к урокам навсегда."""
    p.once(' Доступ к&nbsp;урокам остаётся ещё 45&nbsp;дней после игры.', '')
    p.once('>50 мест' + END, '>20 мест' + END + '\\n' + CLOSE_PILL)
    p.once('>В команде' + END, '>Ближний круг' + END)
    p.once('Проходишь Игру с&nbsp;куратором и&nbsp;потоком, без&nbsp;шанса слиться',
           'Три уровня обратной связи: Карина, её&nbsp;продюсеры и&nbsp;куратор. '
           'Плюс модуль о&nbsp;заработке на&nbsp;контенте для&nbsp;брендов.')
    a = p.s.find(CARD_FIRST)
    b = p.s.find(CARD_LAST)
    assert 0 < a < b, (p.name, 'список тарифа')
    items = ''.join(new_item(t, m) if m else ITEM % t for t, m in CLOSE_ITEMS)
    p.s = p.s[:a] + items + p.s[b + len(CARD_LAST):]
    # Плашка «Доступ к урокам навсегда» здесь часть тарифа, а не бонус первого окна: показываем всегда
    head = '<sc-if value=\\"{{ firstWindow }}\\" hint-placeholder-val=\\"{{ true }}\\">\\n'
    tail = '<\\u002Fsc-if>\\n'
    a = p.s.find(head)
    b = p.s.find(tail, a)
    assert 0 < a < b and 'Доступ к&nbsp;урокам навсегда' in p.s[a:b], (p.name, 'плашка доступа')
    p.s = p.s[:a] + p.s[a + len(head):b] + p.s[b + len(tail):]


BAD_SELF = ['куратор', 'Куратор', 'групп', 'Zoom', 'зум', '50 мест', 'В команде', 'ИИ-ассистент', 'планёрк', 'кружок',
            'погружени', 'Розыгрыш', 'Чат участниц', 'урокам навсегда', '45&nbsp;дней', 'новинка']
BAD_CLOSE = ['50 мест', 'В команде', '45&nbsp;дней', 'новинка', '$299', '24 990']


def build(name, v):
    p = Page(name)
    if v.get('self'):
        to_self(p)
    if v.get('close'):
        to_close(p)
    else:
        drop_bonus(p)
    p.once('<script src="tariff-forms.js?v=', '<script src="../bolshaya-igra/tariff-forms.js?v=')
    p.once('<title>Большая Игра — Карина</title>',
           '<title>' + v['title'] + '</title>\n  <meta name="robots" content="noindex">')
    if v['label']:
        p.once(PRICE_ROW, '<span style=\\"margin-bottom:-10px;' + MONO + '\\">' + v['label'] + END + '\\n' + PRICE_ROW)
    p.once('{{ price }}&nbsp;₽' + END, v['price'] + END)
    p.once('>{{ oldPrice }}' + END, '>' + v['old'] + END)
    note = ('<span style=\\"' + NOTE + '\\">' + v['note'] + END + '\\n') if v['note'] else ''
    p.once(ALT_MAIN + END + '\\n', v['alt'] + END + '\\n' + note)
    p.once(FAQ_MAIN, v['faq'])

    for bad in BAD_SELF if v.get('self') else BAD_CLOSE if v.get('close') else []:
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


# ---------- Страницы с тремя тарифами ----------
# Карточки пишем обычным HTML и экранируем под бандл функцией J. Тексты по макету тарифов от 05.10.
# Суммы в валюте стоят по страницам оплаты Lava (у «В своём темпе» $180, в макете было $179).

def J(html):
    return html.replace('"', '\\"').replace('/', '\\u002F').replace('\n', '\\n')


MONO11 = "font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;"
TAG = ("display:inline-block;margin-left:4px;padding:2px 6px;border-radius:4px;font-family:'JetBrains Mono',monospace;"
       'font-size:9px;font-weight:700;letter-spacing:.1em;line-height:1.4;text-transform:uppercase;white-space:nowrap;'
       'vertical-align:middle;position:relative;top:-1px;')
PILL = ('display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:999px;'
        "font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.1em;"
        'text-transform:uppercase;white-space:nowrap;')

# Пункт: текст и метка ('' нет, 'new' «новое», 'only' «только здесь»). Тариф получает первые N пунктов, остальные зачёркнуты.
ALL_ITEMS = [
    ('30 заданий и&nbsp;уроки по&nbsp;методу яппинга', ''),
    ('Модуль «Дисциплина»: как дойти до&nbsp;30&nbsp;роликов и&nbsp;не&nbsp;слиться', 'new'),
    ('ИИ-ассистент: подскажет тему, идеи и&nbsp;первую фразу ролика', 'new'),
    ('Шаблоны профиля и&nbsp;контент-плана, банк хуков', 'new'),
    ('Первая неделя: куратор помогает найти и&nbsp;утвердить твою тему', 'new'),
    ('Куратор разбирает каждый твой ролик', ''),
    ('По&nbsp;понедельникам&nbsp;— план работы на&nbsp;неделю', 'new'),
    ('2&nbsp;эфира с&nbsp;Кариной: она отвечает на&nbsp;ваши вопросы', ''),
    ('Чат участниц потока: отдельно для&nbsp;экспертного и&nbsp;лайфстайл-блога', ''),
    ('Модуль «Ритм на&nbsp;год»: как снимать после Игры весь год без&nbsp;выгорания', 'new'),
    ('Закрытый чат с&nbsp;Кариной: раз в&nbsp;неделю она голосом отвечает на&nbsp;ваши вопросы', 'new'),
    ('Продюсеры Карины отвечают в&nbsp;чате между её&nbsp;голосовыми', 'new'),
    ('Модуль по&nbsp;UGC: заработок на&nbsp;контенте для&nbsp;брендов', 'only'),
]

DARK = dict(soft='rgba(246,238,226,.62)', line='rgba(246,238,226,.16)', text='rgba(246,238,226,.92)',
            off='rgba(246,238,226,.36)', box='background:#F6EEE2;color:#1F1F1F;',
            new='background:#E3768B;color:#1F1F1F;', only='background:#F6EEE2;color:#1F1F1F;')
LIGHT = dict(soft='rgba(31,31,31,.62)', line='rgba(31,31,31,.16)', text='rgba(31,31,31,.92)',
             off='rgba(31,31,31,.36)', box='background:#1F1F1F;color:#F6EEE2;',
             new='background:#C05B3B;color:#F6EEE2;', only='background:#1F1F1F;color:#F6EEE2;')

# Порядок карточек как в макете. full и half: цена, зачёркнутая цена, сумма для карт не из России.
CARDS = [
    dict(key='self', n=4, bg='#1F1F1F', fg='#F6EEE2', th=DARK,
         kicker='в&nbsp;своём темпе', pill='', title='Самостоятельно',
         desc='Проходишь Игру по&nbsp;урокам и&nbsp;заданиям сама, без&nbsp;куратора и&nbsp;чата.',
         full=('14&nbsp;990&nbsp;₽', '', '$180 / €160'), half=('7&nbsp;495&nbsp;₽', '', '$90 / €80'),
         access=dict(full='Доступ к&nbsp;урокам 2&nbsp;месяца', half='Доступ к&nbsp;урокам 2&nbsp;месяца'),
         btn='background:transparent;border:1.5px solid rgba(246,238,226,.7);color:#F6EEE2;',
         hover='background:rgba(246,238,226,.14);'),
    dict(key='team', n=10, bg='#8A2E3E', fg='#F6EEE2', th=DARK,
         kicker='50&nbsp;мест', pill=('выбирают чаще', 'background:#F6EEE2;color:#1F1F1F;'), title='В&nbsp;команде',
         desc='Куратор смотрит каждый твой ролик и&nbsp;говорит, что усилить. Каждый понедельник&nbsp;— план на&nbsp;неделю.',
         full=('24&nbsp;990&nbsp;₽', '44&nbsp;990&nbsp;₽', '$299 / €269'), half=('12&nbsp;485&nbsp;₽', '', '$150 / €135'),
         # «навсегда» по оферте даётся за полную оплату в первом окне; при оплате частями действует срок из Приложения 1
         access=dict(full='Доступ к&nbsp;урокам навсегда', half='Доступ к&nbsp;урокам 45&nbsp;дней после Игры'),
         first_window_only=True,
         btn='background:#F6EEE2;color:#1F1F1F;', hover='background:#FFFFFF;'),
    dict(key='close', n=13, bg='#F6EEE2', fg='#1F1F1F', th=LIGHT,
         kicker='20&nbsp;мест', pill=('UGC + максимум связи', 'background:#8A2E3E;color:#F6EEE2;'), title='Ближний круг',
         desc='Три уровня обратной связи: Карина, её&nbsp;продюсеры и&nbsp;куратор. '
              'Плюс модуль о&nbsp;заработке на&nbsp;контенте для&nbsp;брендов.',
         full=('49&nbsp;990&nbsp;₽', '69&nbsp;990&nbsp;₽', '$599 / €539'), half=('24&nbsp;995&nbsp;₽', '', '$300 / €270'),
         access=dict(full='Доступ к&nbsp;урокам навсегда', half='Доступ к&nbsp;урокам навсегда'),
         btn='background:#8A2E3E;color:#F6EEE2;', hover='background:#6F2331;'),
]


def card_item(text, mark, on, th):
    row = 'display:flex;gap:12px;align-items:flex-start;font-size:16px;line-height:1.45;'
    box = ('flex:0 0 auto;width:20px;height:20px;display:flex;align-items:center;justify-content:center;'
           'font-size:12px;font-weight:800;margin-top:2px;')
    if not on:
        return ('<span style="%scolor:%s;"><span style="%sbox-sizing:border-box;border:1px solid %s;">×</span>'
                '<span style="text-decoration:line-through;">%s</span></span>\n' % (row, th['off'], box, th['off'], text))
    if mark:
        nb = '&nbsp;'
        i = max(text.rfind(' '), text.rfind(nb))
        j = i + (len(nb) if text.startswith(nb, i) else 1)
        label = 'новое' if mark == 'new' else 'только здесь'
        text = ('%s<span style="white-space:nowrap;">%s <span style="%s%s">%s</span></span>'
                % (text[:j], text[j:], TAG, th[mark], label))
    return ('<span style="%scolor:%s;"><span style="%s%s">✓</span><span>%s</span></span>\n'
            % (row, th['text'], box, th['box'], text))


def card(c, mode):
    th = c['th']
    price, old, alt = c[mode]
    out = ('<div style="flex:1 1 320px;position:relative;display:flex;flex-direction:column;gap:18px;background:%s;color:%s;'
           'border-radius:18px;padding:clamp(24px,3vw,32px);box-shadow:0 24px 50px -26px rgba(31,31,31,.8);">\n'
           % (c['bg'], c['fg']))
    pill = '<span style="%s%s">%s</span>' % (PILL, c['pill'][1], c['pill'][0]) if c['pill'] else ''
    out += ('<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:24px;">'
            '<span style="%scolor:%s;">%s</span>%s</div>\n' % (MONO11, th['soft'], c['kicker'], pill))
    out += ("<span style=\"font-family:'Unbounded',sans-serif;font-size:clamp(22px,5.6vw,26px);font-weight:800;"
            'line-height:1.1;letter-spacing:-.02em;">%s</span>\n' % c['title'])
    if mode == 'half':
        out += '<span style="margin-bottom:-10px;%scolor:%s;">первый платёж из двух</span>\n' % (MONO11, th['soft'])
    out += ('<div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;">'
            "<span style=\"font-family:'Unbounded',sans-serif;font-weight:800;font-size:clamp(26px,6vw,32px);"
            'letter-spacing:-.03em;white-space:nowrap;">%s</span>' % price)
    if old:
        out += ('<span style="font-weight:700;font-size:clamp(15px,3.8vw,18px);text-decoration:line-through;'
                'color:%s;white-space:nowrap;">%s</span>' % (th['soft'], old))
    out += '</div>\n'
    # когда три карточки встают в ряд (экран от 1084px), строку с валютой и описание выравниваем по высоте,
    # чтобы списки во всех карточках начинались с одной линии
    row3 = 'min-height:clamp(0px,(100vw - 1083px)*999,%s);'
    out += ("<span style=\"display:block;margin-top:-8px;font-family:'JetBrains Mono',monospace;font-size:12px;"
            'line-height:1.6;letter-spacing:.1em;text-transform:uppercase;color:%s;%s">или %s картой не из России</span>\n'
            % (th['soft'], row3 % '3.2em', alt))
    out += ('<p style="margin:0;font-size:clamp(16px,4.2vw,17px);line-height:1.5;font-weight:600;%s">%s</p>\n'
            % (row3 % '6em', c['desc']))
    out += ('<div style="display:flex;flex-direction:column;gap:10px;padding-top:16px;border-top:1px solid %s;">\n'
            % th['line'])
    for i, (text, mark) in enumerate(ALL_ITEMS):
        out += card_item(text, mark, i < c['n'], th)
    out += '</div>\n'
    plaque = ('<span style="display:block;padding:12px 14px;border:1.5px solid %s;border-radius:12px;font-size:15px;'
              'font-weight:700;line-height:1.4;">%s</span>\n' % (th['soft'], c['access'][mode]))
    if mode == 'full' and c.get('first_window_only'):
        plaque = '<sc-if value="{{ firstWindow }}" hint-placeholder-val="{{ true }}">\n' + plaque + '</sc-if>\n'
    # обёртка прижимает плашку доступа и кнопку к низу карточки, чтобы в ряду они стояли на одной линии
    out += '<div style="margin-top:auto;display:flex;flex-direction:column;gap:12px;">\n' + plaque
    out += ('<a href="#finish" data-bg-tariff="%s" style="display:flex;width:100%%;box-sizing:border-box;align-items:center;'
            "justify-content:center;min-height:58px;padding:0 26px;border-radius:999px;%sfont-family:'Unbounded',sans-serif;"
            'font-size:clamp(15px,4vw,18px);font-weight:700;letter-spacing:-.01em;text-align:center;" '
            'style-hover="%s">Принять участие</a>\n' % (c['key'], c['btn'], c['hover']))
    return out + '</div>\n</div>\n'


CARDS_OPEN = ('<div style=\\"display:flex;flex-wrap:wrap;justify-content:center;gap:clamp(16px,2.4vw,22px);'
              'align-items:stretch;\\">')
CARDS_AFTER = ('<div style=\\"display:flex;flex-wrap:wrap;gap:14px;align-items:center;background:#F6EEE2;color:#1F1F1F;'
               'border-radius:18px;padding:clamp(20px,3vw,30px);\\">')
HALF_NOTE = ('<div style="background:#F6EEE2;color:#1F1F1F;border-radius:18px;padding:clamp(16px,3vw,22px) '
             'clamp(16px,3vw,20px);font-size:clamp(15px,4vw,17px);line-height:1.45;font-weight:600;">'
             'Оплата делится на&nbsp;два платежа. Сумму и&nbsp;дату второго платежа подтвердит менеджер.</div>\n')

MULTI = {
    'bolshaya-igra-tarify': {
        'mode': 'full',
        'title': 'Большая Игра: тарифы — Карина',
        'faq': 'Зависит от тарифа: «В своём темпе» 14 990 ₽, «В команде» 24 990 ₽, «Ближний круг» 49 990 ₽. '
               'Если карта не из России, цена в долларах и евро стоит в карточке тарифа. '
               'Оплатить можно сразу после заявки. Если остались вопросы, моя команда ответит.',
    },
    'bolshaya-igra-tarify-rassrochka': {
        'mode': 'half',
        'title': 'Большая Игра: тарифы, оплата частями — Карина',
        'faq': 'Оплату можно разделить на два платежа. Первый платёж: «В своём темпе» 7 495 ₽, «В команде» 12 485 ₽, '
               '«Ближний круг» 24 995 ₽. Если карта не из России, сумма в долларах и евро стоит в карточке тарифа. '
               'Сумму и дату второго платежа подтвердит моя команда.',
    },
}


def build_multi(name, v):
    p = Page(name)
    mode = v['mode']
    # сроки доступа у тарифов разные, они стоят в карточках
    p.once(' Доступ к&nbsp;урокам остаётся ещё 45&nbsp;дней после игры.', '')
    # шапка блока тарифов
    sec = p.s.find('id=\\"tariffs\\"')
    old = '>старт 16 ноября' + END
    k = p.s.find(old, sec)
    assert 0 < k - sec < 1500, (name, 'надзаголовок тарифов')
    p.s = p.s[:k] + '>Большая игра · второй поток · старт 16&nbsp;ноября' + END + p.s[k + len(old):]
    p.once('>Участие в <span style=\\"white-space:nowrap;\\">Большой игре' + END,
           '>Твоё место <span style=\\"white-space:nowrap;\\">в&nbsp;игре' + END)
    # три карточки вместо одной
    a = p.s.find(CARDS_OPEN)
    b = p.s.find(CARDS_AFTER)
    assert 0 < a < b and p.s.count(CARDS_OPEN) == 1 and p.s.count(CARDS_AFTER) == 1, (name, 'блок карточек')
    box = ('<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:clamp(16px,2.4vw,22px);'
           'align-items:stretch;">\n\n' + '\n'.join(card(c, mode) for c in CARDS) + '</div>\n\n')
    p.s = p.s[:a] + J((HALF_NOTE if mode == 'half' else '') + box) + p.s[b:]

    p.once('<script src="tariff-forms.js?v=', '<script src="../bolshaya-igra/tariff-forms.js?v=')
    p.once('<title>Большая Игра — Карина</title>',
           '<title>' + v['title'] + '</title>\n  <meta name="robots" content="noindex">')
    p.once(FAQ_MAIN, v['faq'])

    a = p.s.find('<x-dc'); b = p.s.find('<\\u002Fx-dc>')
    assert 0 < a < b, (name, 'границы шаблона')
    tpl = p.s[a:b]
    for key in ('self', 'team', 'close'):
        assert tpl.count('data-bg-tariff=\\"%s\\"' % key) == 1, (name, 'кнопка тарифа', key)
    for bad in ['новинка', '{{ price }}', '{{ oldPrice }}', 'остаётся ещё 45', '$179', '34 990']:
        assert bad not in tpl, (name, bad)

    out = os.path.join(RL, name)
    os.makedirs(out, exist_ok=True)
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(p.s)
    print(name, len(p.s))


if __name__ == '__main__':
    for name, v in VARIANTS.items():
        build(name, v)
    for name, v in MULTI.items():
        build_multi(name, v)
