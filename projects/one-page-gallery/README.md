# One Page Gallery / 单页设计馆

一个长期收藏独立单页设计实验的 GitHub Pages 项目。每件展品以独立目录保存，在一个连续页面内完成主题叙事、视觉表达与交互探索。

## 当前展品

- `america-250/` — 《250 / 250：美国如何成为美国》，包含 250 本书的中文专题书单、阅读路径、搜索筛选、详情抽屉与本地阅读进度。
- `eastbound-sugoroku/` — 《东行绘双六》，以四幅历史绘双六为线索制作的 1–4 人互动棋盘，包含 36 格 AI 重绘场景、格子事件、高清大图与原作档案。
- `the-odyssey/` — 《漂泊之后：诺兰的〈奥德赛〉》，融合电影资料、荷马史诗、十四站航海图、人物档案、制作技术与九组来源明确的影评全景。
- `naturalists-library/` — 《博物学家图书馆：1833—1843》，以 40 卷、1,347 幅历史动物图版为核心的中文版数字自然史浏览项目，包含分类筛选、四十卷目录、全屏缩放、连续浏览与公开实施规划。

## 目录规范

```text
projects/one-page-gallery/
├── index.html
├── README.md
└── <exhibit-slug>/
    └── index.html
```

每个展品使用唯一的小写短横线目录名，并以自包含的 `index.html` 作为入口。核心内容不依赖构建工具、后端服务或临时地址。

## 新增子页面

1. 在本目录下创建新的 `<exhibit-slug>/index.html`。
2. 确保页面可从 GitHub Pages 子路径直接加载，并提供返回 `../` 的入口。
3. 在收藏馆首页 `index.html` 中新增展品介绍与 `./<exhibit-slug>/` 链接。
4. 使用本地静态服务器检查桌面端、移动端和主要交互后再提交。

## GitHub Pages

- 收藏馆首页：https://conanxin.github.io/projects/one-page-gallery/
- America 250：https://conanxin.github.io/projects/one-page-gallery/america-250/
- 东行绘双六：https://conanxin.github.io/projects/one-page-gallery/eastbound-sugoroku/
- 漂泊之后：https://conanxin.github.io/projects/one-page-gallery/the-odyssey/
- 博物学家图书馆：https://conanxin.github.io/projects/one-page-gallery/naturalists-library/
