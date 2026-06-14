# MINIMUM_PUBLIC_VERSION_PLAN

**Generated:** Phase 3A (2026-05-17)

## 1. 目标

用最少素材发布一个**安全、克制、仍然有价值的线上导览版**。

核心原则：
- 不依赖用户自摄照片（目前为空）
- 所有在线参考图（`assets/online-reference/`）**不可**用于公开版
- 作品图片继续使用原创 SVG 占位
- 保持页面交互功能和数据完整性
- 可以提供有价值的文字导览、交互平面图、时间线等

---

## 2. 最小素材要求

| 类别 | 最低数量 | 来源 | 状态 |
|------|----------|------|------|
| Hero 背景 | 0-1 | 纯 CSS/渐变 或 自摄 | **可选**，无则用纯色 |
| 展览平面图 | 1-2 张 | 官方手册 PDF | 可从手册提取或手绘简化版 |
| 《香河》核心图 | 0-1 | 官方视频截图 / 自摄 | **可选**，无则用 SVG 占位 |
| 缺图作品图 | 0 | 全部使用原创 SVG | 已有 16 个 SVG 占位 |
| 展厅环境图 | 0 | 自摄 或 不用 | **可选** |

**结论：当前状态下（无自摄照片）完全可以发布纯文字导览 + SVG 占位版。**

---

## 3. 公开版必须禁用的内容

以下内容**绝对不可**出现在公开版：

| 禁用项 | 原因 | 检查方式 |
|--------|------|----------|
| `?internalMedia=1` 入口 | 暴露内部参考图模式 | app.js 中移除该参数支持 |
| `assets/online-reference/` 图片 | 版权不清晰，仅供内部学习 | .gitignore 已排除，但需验证 |
| `data/online-media-shortlist.json` | 包含网上图片 URL | 不可在公开版被访问 |
| 远程网上图片 fallback | 可能有版权问题 | app.js 中移除远程 fallback |
| 无水印的 UCCA 官方高清图 | 需要授权 | 只用 SVG 占位或自摄 |
| 未经授权的展览现场图 | 版权归属复杂 | 只用 SVG 占位 |

---

## 4. 公开版可以保留的内容

| 内容 | 说明 |
|------|------|
| `data/works.json` 数据 | 16件作品的中英文信息、编号、位置 |
| `data/sections.json` 数据 | 4个策展章节结构 |
| `data/sources.json` 数据 | 官方来源链接 |
| 原创交互代码 | 平面图点击、时间线、主题筛选等 JS/CSS |
| 原创 SVG 占位图 | 16个作品占位，均为原创 |
| 展览文字介绍 | 来自官方资料改写整理 |
| 交互式导览功能 | 所有导航、筛选、游览模式 |
| 官方来源外链 | 链接回 UCCA 官网 |

---

## 5. 推荐发布路径

### 方案 A：继续 drafts/noindex（当前状态）

- **路径：** `/drafts/yang-fudong-fragrant-river/`
- **URL：** `https://conanxin.github.io/drafts/yang-fudong-fragrant-river/`
- **索引：** `noindex`，仅私人链接分享
- **图片：** 全部 SVG 占位 + 可能有内部参考图预览
- **前提：** 无需额外工作，立即可发布
- **适用场景：** 私人分享给朋友、收集反馈

### 方案 B：发布纯文字导览版（推荐下一步）

- **路径：** `/projects/yang-fudong-fragrant-river/`
- **URL：** `https://conanxin.github.io/projects/yang-fudong-fragrant-river/`
- **索引：** `index`（可被搜索）
- **图片：** 全部 SVG 占位，无任何网上参考图
- **前提：** 
  1. 移除 `?internalMedia=1` 支持
  2. 确认 `online-media-shortlist.json` 不可访问
  3. 确认无外部图片 fallback
- **适用场景：** 公开分享，但无实拍照片

### 方案 C：有 5+ 张自摄照片后

- **路径：** `/projects/yang-fudong-fragrant-river/`
- **URL：** `https://conanxin.github.io/projects/yang-fudong-fragrant-river/`
- **索引：** `index`
- **图片：** 自摄照片优先 + SVG 占位补充
- **前提：** 
  1. 用户提供 ≥5 张核心照片
  2. 照片已放入 `assets/inbox/` 并导入
  3. `assets/manifest.json` 已更新
- **适用场景：** 完整线上展览体验

### 方案 D：完整公开（有 12+ 张自摄照片）

- **路径：** `/projects/yang-fudong-fragrant-river/`
- **图片：** 自摄照片覆盖所有关键作品 + 部分占位
- **前提：** 用户提供 12+ 张照片，包含所有缺图作品
- **适用场景：** 高质量线上展览

---

## 6. 当前阶段推荐策略

**在用户补齐自摄照片之前：**

> 采用 **方案 A**（drafts/noindex 私人预览）

**有 5 张自摄核心图后：**

> 采用 **方案 C**（文字导览 + 部分自摄 + SVG 占位）

**有 12+ 张自摄图后：**

> 采用 **方案 D**（接近完整的线上展览体验）

---

## 7. 迁移步骤（从当前状态到方案 C）

1. 确认 `assets/online-reference/` 不被 GitHub Pages 收录（.gitignore 确认）
2. 创建 `public-release/` 子目录（或新 branch）
3. 复制以下文件：
   - `index.html`（移除 `internalMedia` 相关 UI 提示）
   - `styles.css`
   - `app.js`（移除远程 fallback 和 internalMedia 参数支持）
   - `data/works.json`
   - `data/sections.json`
   - `data/sources.json`
   - `assets/placeholders/*.svg`
4. **不复制：**
   - `assets/online-reference/`（整个目录）
   - `data/online-media-shortlist.json`
   - `data/online-media-candidates.json`
5. 用户自摄照片放入 `assets/inbox/`，运行导入脚本
6. 更新 `assets/manifest.json`
7. 更新 `data/works.json` 中的 `media.src` 字段
8. 部署到 `/projects/yang-fudong-fragrant-river/`
9. 移除页面底部 noindex（但保持版权说明）