#!/usr/bin/env python3
"""Builds the game into one file. dist/tenmile.html is the page fragment that gets
published; index.html wraps it so it also opens straight from disk or a static host."""
import pathlib
root = pathlib.Path(__file__).parent
src = root / 'src'
page = (src / 'page.html').read_text()
js = '\n'.join((src / f).read_text() for f in ('plates.js', 'story.js', 'engine.js'))
page = page.replace('/*CSS*/', (src / 'style.css').read_text()).replace('/*JS*/', js)
(root / 'dist').mkdir(exist_ok=True)
(root / 'dist' / 'tenmile.html').write_text(page)
(root / 'index.html').write_text(
    '<!doctype html>\n<html lang="en"><head><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
    '<meta name="apple-mobile-web-app-capable" content="yes">'
    '<style>body{margin:0}[hidden]{display:none!important}</style></head><body>\n' + page + '\n</body></html>\n')
print('built', len(page), 'bytes')
