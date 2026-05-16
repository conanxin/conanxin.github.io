# SELF_PHOTO_MAPPING_PLAN

**Generated:** Phase 3A (2026-05-17)

## 一、当前已检测到的自摄/本地图片

**状态：无自摄照片**

所有资产目录为空或不存在：
- `assets/inbox/` — 空
- `assets/images/` — 空  
- `assets/thumbs/` — 空
- `assets/processed/images/` — 不存在
- `assets/processed/thumbs/` — 不存在
- `assets/manifest.json` — 不存在

当前存在的图片仅为：
- `assets/placeholders/*.svg` — 原创 SVG 占位图（16个）
- `assets/online-reference/` — 网上下载参考图（**仅供内部学习，不能公开使用**）

---

## 二、建议映射到哪些模块

以下映射计划**在用户提供自摄照片后**执行：

### 2.1 Hero 区域
| 目标模块 | 建议文件 | 替代文件 |
|----------|----------|----------|
| Hero 主图 | `hero-exhibition-entrance-01.jpg` | 展览手册封面 |
| Hero 背景氛围 | `hero-hall-overview-01.jpg` | 展厅全景 |

### 2.2 交互式平面图
| 目标模块 | 建议文件 | 用途 |
|----------|----------|------|
| floor-plan-first | `floor-plan-first-01.jpg` | 一层平面图 |
| floor-plan-second | `floor-plan-second-01.jpg` | 二层平面图 |

### 2.3 《香河》九空间模块
| 空间模块 | 建议文件 |
|----------|----------|
| fragrant-river-space-01 | `fragrant-river-space-01-library-01.jpg` |
| fragrant-river-space-02 | `fragrant-river-space-02-01.jpg` |
| fragrant-river-space-03 | `fragrant-river-space-03-01.jpg` |
| fragrant-river-space-04 | `fragrant-river-space-04-video-01.jpg` |
| fragrant-river-space-05 | `fragrant-river-space-05-01.jpg` |
| fragrant-river-space-06 | `fragrant-river-space-06-01.jpg` |
| fragrant-river-space-07 | `fragrant-river-space-07-01.jpg` |
| fragrant-river-space-08 | `fragrant-river-space-08-01.jpg` |
| fragrant-river-space-09 | `fragrant-river-space-09-finale-01.jpg` |

### 2.4 缺图作品
| 作品编号 | 建议文件 | 备注 |
|----------|----------|------|
| work-02 | `work-02-young-man-01.jpg` | 《年轻男人①》展厅照 |
| work-04 | `work-04-01.jpg` | 展厅环境 |
| work-07 | `work-07-01.jpg` | |
| work-08 | `work-08-01.jpg` | |
| work-10 | `work-10-01.jpg` | |
| work-11 | `work-11-01.jpg` | |
| work-12 | `work-12-01.jpg` | |
| work-13 | `work-13-01.jpg` | |
| work-14 | `work-14-01.jpg` | |
| work-15 | `work-15-01.jpg` | |

---

## 三、最小可公开版需要的照片

如果暂时没有足够照片，以下是**最低限度5张**的建议：

| 优先级 | 内容 | 映射位置 |
|--------|------|----------|
| 1 | 展览手册封面或展厅入口照片 | Hero |
| 2 | 展览平面图（一层） | 交互式平面图 |
| 3 | 《香河》展厅现场 / 核心影像 | 作品09 / fragrant-river-space |
| 4 | 展厅环境全景 | 展览氛围图 |
| 5 | 任意一件缺图作品的真实展厅照 | 展示导入流程 |

---

## 四、文件命名建议

用户放入 `assets/inbox/` 的文件建议命名格式：

```
{ucca|exhibition|hall|work|fragrant|floor}_{内容简述}_{序号}.{jpg|webp}
```

示例：
```
ucca-hero-entrance-01.webp
exhibition-floor-plan-first-01.webp
work-02-young-man-southern-bay-01.webp
fragrant-river-space-01-library-01.webp
```

---

## 五、如何编辑 manifest.json 或 works.json

### 5.1 assets/manifest.json 格式

```json
{
  "version": "1.0",
  "lastUpdated": "2026-05-17",
  "selfPhotos": {
    "hero-entrance": {
      "file": "exhibition-entrance-01.webp",
      "source": "self",
      "caption": "UCCA 展厅入口",
      "usedIn": ["hero"]
    },
    "floor-plan-first": {
      "file": "floor-plan-first-01.webp",
      "source": "self",
      "caption": "一层展览平面图",
      "usedIn": ["floor-plan"]
    },
    "work-02": {
      "file": "work-02-young-man-01.webp",
      "source": "self",
      "caption": "《年轻男人①》展厅现场",
      "usedIn": ["work-02"]
    }
  }
}
```

### 5.2 works.json 中的 media 字段

现有作品数据中 `media` 字段结构：

```json
"media": {
  "type": "image",
  "src": "",  // 自摄照片路径
  "placeholder": "work-02-placeholder",  // SVG 占位符 ID
  "caption": ""
}
```

更新时只需将 `src` 填入，`placeholder` 保留作为 fallback。

---

## 六、执行流程

1. 用户将照片放入 `assets/inbox/`
2. 管理员创建/更新 `assets/manifest.json`
3. 如需要，运行 `python3 scripts/prepare_media_assets.py`
4. 更新 `data/works.json` 中的 `media.src` 字段
5. 刷新页面验证显示效果