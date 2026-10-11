# projects/wbw-spacex-mars-cn/ 渲染基线审计

> **任务**: CONANXIN_SITE_DESIGN_STAGE2A_IMPLEMENTATION 第六节
> **范围**: 只读静态分析(无浏览器渲染)。基于 `index.html`、`styles.css` 与 `.cursor/rules/wbw-spacex-mars-cn-taste.mdc` 的源码比对, 未运行 Playwright。
> **本审计不修改任何文件**。

---

## 一、专题文件结构

```
projects/wbw-spacex-mars-cn/
├── index.html       (主入口, 深色主题)
├── styles.css       (专题自有样式, 深色背景)
├── app.js           (交互脚本)
├── assets/          (图像、字体)
├── content/         (翻译内容源)
├── source/          (原始材料)
├── work/            (工作区)
├── README.md
└── REPORT.md
```

## 二、专题设计意图 (来自 .mdc)

`.cursor/rules/wbw-spacex-mars-cn-taste.mdc` (本 commit 未触动):
- `globs: ['projects/wbw-spacex-mars-cn/**']` 保留不变
- 专题期望深色沉浸式阅读、火星背景、衬线/无衬线混排

## 三、专题源码关键标记

```html
<!-- projects/wbw-spacex-mars-cn/index.html line 1 -->
<html lang="zh-CN" data-theme="deep-space" data-reading-mode="immersive">
```

`data-theme="deep-space"` 是专题自有的主题标识, 与全站 `unified-v1` 并存。

## 四、与全站统一样式的潜在冲突 (静态分析)

### 4.1 背景颜色

| 层 | 期望 | 实际 (经全站 transform 处理后) |
|---|---|---|
| 专题期望 | 深色 (`#0a0e1a`, `#000`, 火星渐变) | — |
| 全站 `body.site-unified` 强制 | — | `background: var(--site-bg)!important` (`#f8f7f4` 暖白底) |

**结论**: `body.site-unified` 通过 `!important` 覆盖专题深色背景为暖白底。专题"深色沉浸"特性实际被破坏。

### 4.2 标题字体

| 层 | 期望 | 实际 |
|---|---|---|
| 专题期望 | 专题字体(由 `.hero-title` 等定义) | — |
| 全站 `body.site-unified h1` | — | `font-family: var(--site-serif)!important` |

**结论**: 全站 h1 字体规则覆盖专题 h1 字体(实际被替换为衬线)。

### 4.3 文字颜色

`body.site-unified [style*="color:#f0f6fc"]{color:var(--site-ink)!important}` — 专题深色文字 `#f0f6fc` 被覆盖为 `--site-ink` (`#29322e`)。在暖白底上可读, 但专题视觉风格丢失。

### 4.4 chrome 隐藏

- 专题使用 `<header class="hero">` 与 `<canvas class="starfield">`
- 这些类不在 build_site.py 的 `CHROME_CLASSES` 集合中, **不会被自动标记为 legacy chrome**
- 专题自身 chrome 与全站注入的 `<header class="site-header">`、`<footer class="site-footer">` 共存, 可能产生两套导航

### 4.5 移动端断点

- 专题 `styles.css` 自有响应式断点 (待运行时验证)
- 全站 `@media(max-width:800px)` 与 `@media(max-width:560px)`
- **潜在冲突**: 移动端表现可能不一致

## 五、问题清单与最小修复方案

### 问题 1: 全站 `!important` 覆盖专题核心视觉 (严重程度: 高)

**最小修复方案** (本 commit 不实施):
- `classify(path)` 识别 `projects/wbw-spacex-mars-cn/`, 返回新 kind 例如 `'mars-special'`
- `transform()` 在 `'mars-special'` 上不应用背景/字体的 `!important` 强制
- 或者专题页面使用 `data-site-theme="deep-space"` 作为检测信号, 全站样式空间基于该属性

### 问题 2: 专题 chrome 与全站 chrome 共存 (严重程度: 中)

**最小修复方案**:
- 专题的 `<header class="hero">` 添加 `data-site-chrome="legacy"` (人工编辑专题文件)
- 或者全站机制识别 `data-theme="deep-space"` 时跳过 chrome 隐藏步骤

### 问题 3: 移动端断点冲突 (严重程度: 中)

**最小修复方案**:
- 专题与全站使用一致断点 (800px / 560px)
- 或全站在 `data-theme="deep-space"` 时跳过自身 `@media` 规则

## 六、本 commit 不做的事

- ❌ 不修改 `projects/wbw-spacex-mars-cn/index.html`
- ❌ 不修改 `projects/wbw-spacex-mars-cn/styles.css`
- ❌ 不修改 `projects/wbw-spacex-mars-cn/app.js`
- ❌ 不修改 `.cursor/rules/wbw-spacex-mars-cn-taste.mdc` 的 globs (严禁收紧到 `source/**`, 否则该规则不再适用于正式页面)
- ❌ 不修改 `assets/site/design.css` 的全局规则
- ❌ 不修改 `scripts/build_site.py transform()` 的专题识别逻辑

## 七、Stage 2B 建议优先级

1. 评估 `classify()` 是否需要扩展支持专题路径
2. 在 `assets/site/design.css` 中加入专题化样式注入机制 (基于 `data-site-theme="deep-space"` 或路径条件)
3. 修复 chrome 标记与移动端断点冲突

## 八、当前实际状态

由于本审计为纯静态分析 (无 Playwright 实际渲染), 上述冲突仅为**设计意图层面的可能冲突**, 实际浏览器渲染表现需在 Stage 2B 通过浏览器测试验证。`projects/wbw-spacex-mars-cn/` 当前在 GitHub Pages 公开站点中可能存在已被全站规则覆盖的渲染, 需 Stage 2B 通过 PR 检查(浏览器测试)确认实际表现。