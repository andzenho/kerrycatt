# -*- coding: utf-8 -*-
"""Пересобирает HTML-страницы документов из markdown-исходников: python3 _src/build.py"""
import os, markdown
HERE = os.path.dirname(os.path.abspath(__file__))
D, RL = os.path.join(HERE, 'dokumenty'), os.path.dirname(HERE)
M = {'offer': 'oferta.md', 'offer-prilozhenie-1': 'prilozhenie-1-bolshaya-igra.md',
     'offer-prilozhenie-2': 'prilozhenie-2-razminka.md', 'privacy': 'politika-pd.md',
     'consent': 'soglasie-pd.md', 'consent-ads': 'soglasie-rassylki.md', 'terms': 'polzovatelskoe-soglashenie.md'}
for d, f in M.items():
    md = open(os.path.join(D, f), encoding='utf-8').read()
    h = markdown.markdown(md, extensions=['tables', 'sane_lists'])
    h = h.replace('<table>', '<div class="tbl"><table>').replace('</table>', '</table></div>')
    p = os.path.join(RL, d, 'index.html'); s = open(p, encoding='utf-8').read()
    a = s.index('<main>') + 6; b = s.index('</main>')
    open(p, 'w', encoding='utf-8').write(s[:a] + h + s[b:])
    print(d, 'ok')
