# MISSING_SELF_PHOTOS

**Generated:** Phase 3A (2026-05-17)

## 现状

`assets/inbox/` 目录为空，用户尚未上传任何自摄照片。
所有自摄照片相关目录均不存在或为空：
- `assets/inbox/` — 空
- `assets/images/` — 空
- `assets/thumbs/` — 空
- `assets/processed/images/` — 不存在
- `assets/processed/thumbs/` — 不存在
- `assets/manifest.json` — 不存在

## 用户需要提供的照片

请将照片放入 `assets/inbox/`，文件名需标注内容和位置，例如：

```
assets/inbox/
├── ucca-exhibition-entrance-01.jpg      # 展厅入口 / UCCA 标志墙
├── ucca-floor-plan-01.jpg                # 官方展览平面图（手册内页）
├── ucca-floor-plan-second-01.jpg         # 二层平面图
├── fragrant-river-core-01.jpg           # 《香河》核心影像截帧 / 展厅现场
├── fragrant-river-space-01.jpg          # 香河空间 01（图书馆区域）
├── fragrant-river-space-04.jpg          # 香河空间 04（影像厅）
├── fragrant-river-space-07.jpg          # 香河空间 07
├── work-02-young-man-in-southern-bay-01.jpg  # 作品02《年轻男人①》展厅照
├── work-04-01.jpg                       # 作品04展厅环境
├── work-09-fragrant-river-01.jpg        # 作品09《香河》核心展品
├── work-11-01.jpg                       # 作品11展厅
├── work-14-01.jpg                       # 作品14展厅
├── exhibition-hall-overview-01.jpg       # 展厅全景 / 整体环境
└── exhibition-hall-detail-01.jpg        # 展厅细节 / 展签细节
```

## 最小公开版所需照片（5张）

在用户自摄照片补齐之前，以下是**最小可用版本**所需的最少照片集合：

| 优先级 | 内容 | 用途 |
|--------|------|------|
| 1 | 展览手册封面或展厅入口 | Hero 区域 |
| 2 | 官方展览平面图 | 交互式平面图 |
| 3 | 《香河》核心影像 / 展厅现场 | 作品09主图 |
| 4 | 展厅环境 / 全景图 | 展厅氛围 |
| 5 | 任意一件缺图作品展厅照 | 展示真实拍摄导入方式 |

## 下一步

1. 用户将照片放入 `assets/inbox/`
2. 运行 `python3 scripts/prepare_media_assets.py`（如果存在）
3. 更新 `assets/manifest.json`
4. 执行 Phase 3B：自摄图映射到各模块

## 备注

- 当前所有作品图片均使用原创 SVG 占位
- 在线参考图（`assets/online-reference/`）**不能**用于公开发布
- 页面当前为 `drafts/` + `noindex`，仅私人预览模式