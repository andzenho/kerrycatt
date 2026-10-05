# -*- coding: utf-8 -*-
"""Собирает три рабочие страницы Большой Игры 2.0 в новом дизайне из тестовой страницы bolshaya-igra-test/.

  /bolshaya-igra-tarify/             полная оплата, три тарифа
  /bolshaya-igra-tarify-rassrochka/  внутренняя рассрочка, первый платёж из двух, три тарифа
  /bolshaya-igra-bron/               бронь 2 000 ₽ на любой тариф

Дизайн и тексты правим на тестовой странице, потом запускаем: python3 _src/build_bi2.py
Стили, скрипт и зерно копируются в assets/bi2/, поэтому правки тестовой страницы не попадают на рабочие без сборки.
Ссылки оплаты, суммы под кнопками и тексты формы лежат в bolshaya-igra/tariff-forms.js (VARIANTS и MULTI).
Старые версии этих трёх страниц собирал _src/build_variants.py, там они теперь пропускаются."""
import hashlib
import os
import re
import shutil

RL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(RL, 'bolshaya-igra-test')
SHARED = os.path.join(RL, 'assets', 'bi2')
FORMS_VER = '20261005d'

TITLE = '<title>Большая Игра 2.0 — Kerry Catt · тест дизайна</title>'
STEP3 = ('<span data-step3><b>Оплачиваешь</b>, сразу открываешь первый модуль и сохраняешь уроки навсегда</span>')
BANK = '    <p class="fine">Рассрочка до 12 месяцев, для России и СНГ</p>\n'
CARDS_OPEN = '    <div class="tcards">\n'
PRICE = re.compile(r'<p class="price"><b[^>]*>[\d.]+</b><span class="rub">₽</span>(?:<s>[^<]*</s>)?</p>')
ALT = re.compile(r'<b>\$\d+</b><b>€\d+</b>')
ACCESS = re.compile(r'<p class="tc__access">[^<]*</p>')
BUTTON = '>Принять участие</a>'

# Тариф: сумма первого платежа и валюта для оплаты частями, полная цена для строки про бронь, срок доступа без бонуса первого окна.
# «Навсегда» у тарифа «В команде» по оферте даётся за полную оплату в первом окне, поэтому при брони и оплате частями стоит срок из Приложения 1.
CARDS = {
    'self': dict(cls='tc tc--dark', half=('7.495', '$90', '€80'), full_price='<b>14.990 ₽</b>',
                 access='Доступ к урокам 2 месяца'),
    'team': dict(cls='tc tc--wine', half=('12.485', '$150', '€135'), full_price='<b><span data-price>24.990</span> ₽</b>',
                 access='Доступ к урокам 45 дней после Игры'),
    'close': dict(cls='tc tc--cream', half=('24.995', '$300', '€270'), full_price='<b>49.990 ₽</b>',
                  access='Доступ к урокам навсегда'),
}

PAGES = {
    'bolshaya-igra-tarify': dict(
        mode='full', title='Большая Игра 2.0: тарифы — Kerry Catt'),
    'bolshaya-igra-tarify-rassrochka': dict(
        mode='half', title='Большая Игра 2.0: тарифы, оплата частями — Kerry Catt',
        note='Оплата делится на два платежа. Сумму и дату второго платежа подтвердит менеджер.',
        step3='<span><b>Оплачиваешь первый платёж</b> и сразу открываешь первый модуль</span>'),
    'bolshaya-igra-bron': dict(
        mode='bron', title='Большая Игра 2.0: бронь места — Kerry Catt',
        note='Бронь 2.000 ₽ на любой тариф. Она входит в стоимость участия и фиксирует для тебя цену.',
        step3='<span><b>Вносишь бронь 2.000 ₽.</b> Она фиксирует цену и входит в стоимость участия</span>'),
}


def stamp(path):
    return hashlib.md5(open(path, 'rb').read()).hexdigest()[:8]


def once(s, a, b, name):
    assert s.count(a) == 1, (name, s.count(a), a[:70])
    return s.replace(a, b)


def sub1(rx, repl, s, name):
    s, n = rx.subn(lambda m: repl, s)
    assert n == 1, (name, n, rx.pattern[:50])
    return s


def card(s, key, mode, name):
    """Правит одну карточку тарифа под способ оплаты."""
    c = CARDS[key]
    a = s.find('<article class="%s">' % c['cls'])
    b = s.find('</article>', a)
    assert 0 < a < b, (name, key)
    chunk = s[a:b]
    assert chunk.count('data-bg-tariff="%s"' % key) == 1, (name, key, 'кнопка')
    if mode == 'half':
        price, usd, eur = c['half']
        chunk = sub1(PRICE, '<p class="tc__pre">первый платёж из двух</p>\n          '
                     '<p class="price"><b>%s</b><span class="rub">₽</span></p>' % price, chunk, name)
        chunk = sub1(ALT, '<b>%s</b><b>%s</b>' % (usd, eur), chunk, name)
    else:
        chunk = sub1(PRICE, '<p class="tc__pre">бронь места</p>\n          '
                     '<p class="price"><b>2.000</b><span class="rub">₽</span></p>', chunk, name)
        chunk = sub1(ALT, '<b>$24</b><b>€22</b>', chunk, name)
        alt_end = chunk.find('</p>', chunk.find('<p class="alt">')) + len('</p>')
        chunk = (chunk[:alt_end] + '\n          <p class="tc__note">Бронь входит в стоимость участия и фиксирует для тебя цену %s</p>'
                 % c['full_price'] + chunk[alt_end:])
        chunk = once(chunk, BUTTON, '>Забронировать место</a>', name)
    chunk = sub1(ACCESS, '<p class="tc__access">%s</p>' % c['access'], chunk, name)
    assert 'data-price' not in chunk or mode == 'bron', (name, key, 'цена по окнам')
    return s[:a] + chunk + s[b:]


def build(name, v, css_v, js_v):
    s = open(os.path.join(SRC, 'index.html'), encoding='utf-8').read()
    s = once(s, TITLE, '<title>%s</title>' % v['title'], name)
    s, n = re.subn(r'<link rel="stylesheet" href="style\.css\?v=\d+">',
                   '<link rel="stylesheet" href="../assets/bi2/style.css?v=%s">' % css_v, s)
    assert n == 1, (name, 'стили')
    s, n = re.subn(r'<script src="page\.js\?v=\d+"></script>', '<script src="../assets/bi2/page.js?v=%s"></script>' % js_v, s)
    assert n == 1, (name, 'скрипт страницы')
    s, n = re.subn(r'tariff-forms\.js\?v=[0-9a-z]+', 'tariff-forms.js?v=' + FORMS_VER, s)
    assert n == 1, (name, 'форма')
    s = re.sub(r'<!-- Картинок на странице пока нет\.[^\n]*-->\n\n?', '', s)

    if v['mode'] != 'full':
        for key in CARDS:
            s = card(s, key, v['mode'], name)
        s = once(s, CARDS_OPEN, '    <p class="tnote">%s</p>\n%s' % (v['note'], CARDS_OPEN), name)
        s = once(s, STEP3, v['step3'], name)
    if v['mode'] == 'half':
        s = once(s, BANK, '', name)

    for key in CARDS:
        assert s.count('data-bg-tariff="%s"' % key) == 1, (name, key)
    for bad in ['тест дизайна', 'href="style.css', 'src="page.js', 'здесь будет']:
        assert bad not in s, (name, bad)
    if v['mode'] == 'half':
        for bad in ['<s>', '14.990', '24.990', '49.990', 'data-price', 'уроки навсегда</span>']:
            assert bad not in s, (name, bad)
    out = os.path.join(RL, name)
    os.makedirs(out, exist_ok=True)
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(s)
    print(name, len(s))


if __name__ == '__main__':
    os.makedirs(SHARED, exist_ok=True)
    for f in ('style.css', 'page.js', 'grain.png'):
        shutil.copyfile(os.path.join(SRC, f), os.path.join(SHARED, f))
    css_v, js_v = stamp(os.path.join(SHARED, 'style.css')), stamp(os.path.join(SHARED, 'page.js'))
    for name, v in PAGES.items():
        build(name, v, css_v, js_v)
