#!/usr/bin/env python3
"""
Generate SVG placeholders for missing works.
Lightweight, no external images, film grain aesthetic.
"""

import os

PLACEHOLDERS = {
    "work-02-placeholder.svg": {
        "number": "02",
        "title_zh": "乐郊私语",
        "title_en": "Private Notes from a Land of Bliss",
        "themes": "文人出行 · 绘画 · 长卷 · 迷宫",
    },
    "work-03-placeholder.svg": {
        "number": "03",
        "title_zh": "善意的谎言之一",
        "title_en": "White Lie I",
        "themes": "虚构 · 丙烯 · 摄影碎片 · 记忆",
    },
    "work-04-placeholder.svg": {
        "number": "04",
        "title_zh": "善意的谎言之二",
        "title_en": "White Lie II",
        "themes": "镜子 · 反射 · 塑料布 · 记忆",
    },
    "work-07-placeholder.svg": {
        "number": "07",
        "title_zh": "轻风不动",
        "title_en": "Unmoved by Gentle Breezes",
        "themes": "光影 · 静物 · 时间痕迹 · 瞬间",
    },
    "work-08-placeholder.svg": {
        "number": "08",
        "title_zh": "“香河”系列黑白摄影",
        "title_en": "“Fragrant River” Series, B&W Photograph",
        "themes": "摄影 · 黑白 · 档案 · 家乡风景",
    },
    "work-10-placeholder.svg": {
        "number": "10",
        "title_zh": "一二五六七纪录片",
        "title_en": "A Documentary on Fragrant River",
        "themes": "纪录片 · 幕后 · 创作过程 · 张京华",
    },
    "work-11-placeholder.svg": {
        "number": "11",
        "title_zh": "哺乳期",
        "title_en": "Breastfeeding",
        "themes": "家具 · 旧物 · CRT电视 · 记忆空间",
    },
    "work-12-placeholder.svg": {
        "number": "12",
        "title_zh": "青春",
        "title_en": "Youth",
        "themes": "档案 · 老照片 · 翻拍 · 时间",
    },
    "work-13-placeholder.svg": {
        "number": "13",
        "title_zh": "后房—嘿，天亮了",
        "title_en": "Backyard - Hey! Sun is Rising",
        "themes": "早期作品 · 黑白 · 军装 · 梦游",
    },
    "work-14-placeholder.svg": {
        "number": "14",
        "title_zh": "父亲的烟火",
        "title_en": "Father’s Fireworks",
        "themes": "父亲 · 烟火 · 家庭 · 春节",
    },
    "fragrant-river-space-placeholder.svg": {
        "number": "09·SP",
        "title_zh": "《香河》9空间节点",
        "title_en": "Fragrant River · 9 Spaces",
        "themes": "迷宫 · 15屏 · 嵌套空间 · 春节",
    },
    "hero-placeholder.svg": {
        "number": "H",
        "title_zh": "展览入口 / Hero",
        "title_en": "Exhibition Entrance / Hero",
        "themes": "UCCA · 入口墙 · Banner · 氛围",
    },
    "floor-plan-placeholder.svg": {
        "number": "FP",
        "title_zh": "展厅平面图",
        "title_en": "Floor Plan",
        "themes": "一层 · 二层 · 空间动线 · 作品分布",
    },
}

SVG_TEMPLATE = '''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
  <defs>
    <filter id="noise" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" result="noise"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0" in="noise" result="coloredNoise"/>
      <feBlend mode="overlay" in="SourceGraphic" in2="coloredNoise"/>
    </filter>
    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a1a1a"/>
      <stop offset="100%" stop-color="#0d0d0d"/>
    </linearGradient>
  </defs>
  <rect width="640" height="400" fill="url(#grad)" filter="url(#noise)"/>
  <!-- Frame border -->
  <rect x="20" y="20" width="600" height="360" fill="none" stroke="#333" stroke-width="1"/>
  <rect x="24" y="24" width="592" height="352" fill="none" stroke="#222" stroke-width="1"/>
  <!-- Work number -->
  <text x="60" y="100" font-family="'Courier New', monospace" font-size="64" font-weight="700" fill="#c4b5a0" opacity="0.25">{number}</text>
  <!-- Title -->
  <text x="60" y="170" font-family="'Noto Serif SC', 'Songti SC', Georgia, serif" font-size="22" fill="#eeeeee">{title_zh}</text>
  <text x="60" y="200" font-family="Georgia, serif" font-size="13" font-style="italic" fill="#999">{title_en}</text>
  <!-- Divider -->
  <line x1="60" y1="220" x2="200" y2="220" stroke="#444" stroke-width="1"/>
  <!-- Themes -->
  <text x="60" y="250" font-family="'Noto Sans SC', sans-serif" font-size="11" fill="#777">{themes}</text>
  <!-- Pending label -->
  <rect x="60" y="290" width="200" height="28" fill="none" stroke="#c4b5a0" stroke-width="0.5" rx="2"/>
  <text x="160" y="309" font-family="'Noto Sans SC', sans-serif" font-size="11" fill="#c4b5a0" text-anchor="middle">◫ Media pending · 待补充现场照片</text>
  <!-- Footer -->
  <text x="60" y="360" font-family="monospace" font-size="9" fill="#444">Yang Fudong: Fragrant River · Draft Placeholder · 2026</text>
</svg>'''

OUTDIR = "assets/placeholders"

for filename, data in PLACEHOLDERS.items():
    path = os.path.join(OUTDIR, filename)
    svg = SVG_TEMPLATE.format(**data)
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"Created {path} ({len(svg)} bytes)")

print(f"\nDone. Total placeholders: {len(PLACEHOLDERS)}")
