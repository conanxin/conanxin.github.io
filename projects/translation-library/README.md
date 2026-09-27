# 译文馆 · THE TRANSLATION LIBRARY

一个独立的中文长篇译文收藏项目。收录值得完整阅读、反复阅读和长期保存的文章译本。

## 项目地址

- 项目首页：<https://conanxin.github.io/projects/translation-library/>
- 第一篇文章：<https://conanxin.github.io/projects/translation-library/cybernetics-library-interview/>

## 项目定位

译文馆专门收录优秀单篇文章的中文译本，主要收藏对象包括：

- 长篇访谈
- 评论文章
- 思想随笔
- 文化研究
- 科技与社会文章
- 艺术、设计、建筑与媒介文章
- 值得完整保存和反复阅读的网络长文

每篇文章提供：

- 完整中文译文
- 原文标题
- 中文标题
- 原作者或受访者信息
- 原文来源
- 原文链接
- 原文发布日期
- 中文译文整理日期
- 译文说明
- 完整图片（与原文相对应的段落、问答和图片顺序）
- 独立、适合沉浸阅读的文章页面

## 目录结构

```
projects/translation-library/
├── README.md
├── index.html         # 项目首页
└── cybernetics-library-interview/    # 第一篇文章
    ├── index.html     # 文章页面
    ├── article-zh.md  # Markdown 存档
    └── assets/        # 文章图片
```

## 当前收录

| 编号 | 中文标题 | 英文标题 | 来源 | 路径 |
|---|---|---|---|---|
| 001 | 与「控制论图书馆」幕后成员的对谈 | An Interview with the People Behind the Cybernetics Library | Are.na Editorial | `cybernetics-library-interview/` |

## 新增一篇文章的目录规范

每新增一篇文章，在 `projects/translation-library/` 下建立独立目录，命名规范：

- 使用小写字母与连字符
- 简洁能反映文章主题
- 例如 `an-essay-on-something/`、`some-interview-name/`

每个文章目录应包含：

```
<article-slug>/
├── index.html       # 文章页面（必须有）
├── article-zh.md    # Markdown 存档（建议保留）
└── assets/          # 文章相关图片与资源
    └── img-*.jpg
```

## 图片与路径规则

- 所有内部资源使用相对路径，例如 `assets/img-01-xxx.jpg`
- 项目首页 → 文章使用 `./<article-slug>/`
- 文章页 → 返回首页使用 `../`
- 原文链接使用完整 HTTPS 地址
- 不使用绝对路径、`file://`、WSL 路径或本地临时地址

## 技术约束

- 纯静态 HTML + 少量原生 CSS
- 不引入框架（React、Vue、Next.js、Astro 等）
- 不依赖构建工具
- 不需要数据库
- 不需要服务端 API
- 可由 GitHub Pages 直接托管

## 与 One-Page Gallery 的关系

译文馆与 [One-Page Gallery](../one-page-gallery/) 是两个相互独立的项目。

- 不修改 One-Page Gallery 项目
- 不将译文馆的文章加入 One-Page Gallery
- 不创建 One-Page Gallery 子目录或镜像

## 编辑约定

- 优先完整翻译，而不是摘要
- 尽量保留原文章结构（段落顺序、问答节奏、图片位置）
- 保留图片与上下文（说明、替代文字、相对位置）
- 标明原文出处、发布日期与链接
- 为中文长篇阅读重新排版（字号、行距、行宽）
- 不擅自补充原文之外的背景内容
- 不删除口语化、过渡性或看似重复的句子
- 不合并不同人物的发言

## 许可

译文馆为个人阅读项目。文章译文的版权归原文作者与原文发布平台所有；译文整理由 conanxin 完成。如需转载，请保留原文链接与来源标注。
