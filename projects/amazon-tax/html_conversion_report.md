# HTML Conversion Report｜Amazon Tax

## 转换概述

将 9 个 Markdown 阅读材料转换为独立 HTML 页面，使读者可直接在浏览器中阅读，而不必下载或查看 Markdown 源文件。

## 转换方式

| 工具 | 状态 | 说明 |
|------|------|------|
| pandoc | ❌ 不可用 | 系统中未安装 pandoc |
| Python 标准库 | ✅ 使用 | 使用自定义 Python 脚本进行基础 Markdown 解析 |

## 输入文件（Markdown）

| # | 文件名 | 大小（转换前） |
|---|--------|---------------|
| 1 | `full-translation.zh.md` | 15,795 bytes |
| 2 | `deep-reading.zh.md` | 13,797 bytes |
| 3 | `detailed-exegesis.zh.md` | 11,828 bytes |
| 4 | `paragraph-summary.zh.md` | 14,430 bytes |
| 5 | `wiki-reading-note.md` | 11,272 bytes |
| 6 | `wiki-evidence.md` | 13,614 bytes |
| 7 | `wiki-concept-amazon-tax.md` | 3,946 bytes |
| 8 | `wiki-concept-aws-primitives.md` | 4,265 bytes |
| 9 | `web-verification-report.md` | 15,436 bytes |

## 输出文件（HTML）

| # | 文件名 | 大小（转换后） | 标题 |
|---|--------|---------------|------|
| 1 | `full-translation.zh.html` | 19,244 bytes | 完整中文翻译｜《亚马逊税》 |
| 2 | `deep-reading.zh.html` | 17,774 bytes | 中文精读版｜《亚马逊税》 |
| 3 | `detailed-exegesis.zh.html` | 15,408 bytes | 详细释义版｜《亚马逊税》 |
| 4 | `paragraph-summary.zh.html` | 18,564 bytes | 段落级摘要｜《亚马逊税》 |
| 5 | `wiki-reading-note.html` | 14,954 bytes | Wiki 阅读笔记｜《亚马逊税》 |
| 6 | `wiki-evidence.html` | 18,365 bytes | Evidence 核心论证｜《亚马逊税》 |
| 7 | `wiki-concept-amazon-tax.html` | 6,184 bytes | 概念：亚马逊税 |
| 8 | `wiki-concept-aws-primitives.html` | 6,688 bytes | 概念：AWS 基础构件 |
| 9 | `web-verification-report.html` | 20,712 bytes | 2026 背景事实核验报告｜《亚马逊税》 |

## HTML 页面特性

每个生成的 HTML 页面均包含：
- 内联 CSS（不依赖外部 CDN/JS/字体）
- 返回目录链接（指向 `index.html`）
- 原文信息区（标题、作者、来源、发布时间、原文链接）
- YAML frontmatter 元信息展示
- 授权说明
- 版权信息
- 简洁清晰的排版风格（适合 GitHub Pages 静态浏览）

## 支持的 Markdown 元素

- 标题 `#` / `##` / `###` / `####`
- 段落
- 无序列表 `-` / `*`
- 有序列表 `1.`
- 链接 `[text](url)`
- 粗体 `**text**` / `__text__`
- 斜体 `*text*` / `_text_`
- 行内代码 `` `code` ``
- 代码块 ` ``` `
- 引用块 `> `
- 简单表格（`|` 分隔）
- 删除线 `~~text~~`
- 水平线 `---`

## 保留的原始 Markdown 文件

所有原始 `.md` 文件继续保留在目录中，未删除。

## index.html 链接更新

| 内容 | 旧链接 | 新链接 |
|------|--------|--------|
| 完整中文翻译 | `full-translation.zh.md` | `full-translation.zh.html` |
| 中文精读版 | `deep-reading.zh.md` | `deep-reading.zh.html` |
| 详细释义版 | `detailed-exegesis.zh.md` | `detailed-exegesis.zh.html` |
| 段落级摘要 | `paragraph-summary.zh.md` | `paragraph-summary.zh.html` |
| Wiki 阅读笔记 | `wiki-reading-note.md` | `wiki-reading-note.html` |
| Evidence 核心论证 | `wiki-evidence.md` | `wiki-evidence.html` |
| 概念：亚马逊税 | `wiki-concept-amazon-tax.md` | `wiki-concept-amazon-tax.html` |
| 概念：AWS 基础构件 | `wiki-concept-aws-primitives.md` | `wiki-concept-aws-primitives.html` |
| 2026 背景事实核验报告 | `web-verification-report.md` | `web-verification-report.html` |

未改变的链接：
- `web-verification-sources.json` — 保持指向 JSON 文件
- `local-wiki-commit-show.txt` — 保持指向 TXT 文件

## README.md 更新

- 新增 "HTML 阅读入口（推荐）" 小节
- 保留 "Markdown 原始文件" 小节
- 说明：Markdown 原始文件仍保留，HTML 页面为主要阅读入口

## 未发布原始英文全文确认

- `raw.html` — ❌ 未出现
- `article.md` — ❌ 未出现
- `article.txt` — ❌ 未出现
- 原始英文全文 — ❌ 未出现

## 文件数量

- 转换前（仅发布材料）：14 个文件
- 转换后（含 HTML）：23 个文件
- 新增 HTML 文件：9 个
- 保留原始 Markdown 文件：9 个

## Git 安全检查

- 仅修改 `projects/amazon-tax/` 目录
- 未触碰 `podcast/ep06-emotional-arena/`
- 未恢复 podcast stash
- 未修改 OpenClaw workspace
- 未修改 production wiki
- 未运行 promotion-orchestrator / nostr publish / solid-sync
- 未修改 OpenClaw 配置
- 未重启服务

---

*Report generated: 2026-05-07*  
*Conversion tool: Python standard library (custom markdown parser)*  
*Target: conanxin.github.io/projects/amazon-tax/*
