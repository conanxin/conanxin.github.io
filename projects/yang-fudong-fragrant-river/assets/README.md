# 媒体资产说明 · Media Assets

本目录存放与展览相关的媒体文件。**页面已预置支持这些路径的加载逻辑**，放入文件后刷新页面即可自动显示。

---

## 目录结构

```
assets/
├── images/           # 全尺寸现场照片（建议宽度 1200-2000px）
├── thumbs/           # 缩略图（建议宽度 400-600px）
├── audio/            # 合法音频或环境声片段
├── video-placeholders/  # 视频封面/占位图（不放置完整影片）
└── README.md         # 本文件
```

---

## 命名规则

| 类型 | 命名示例 | 说明 |
|------|---------|------|
| 作品照片 | `work-01-young-man.jpg` | 编号 + 英文简称 |
| 作品多图 | `work-09-fragrant-river-room-01.jpg` | 编号 + 房间/角度 |
| 平面图 | `floor-plan-first.jpg` | 楼层 + 内容 |
| 手册封面 | `booklet-cover.jpg` | 描述性名称 |
| 展厅环境 | `venue-lobby.jpg` | 地点 + 区域 |
| 音频 | `ambient-gallery.mp3` | 内容描述 |
| 视频封面 | `video-cover-fragrant-river.jpg` | 内容描述 |

**建议格式：**
- 照片：JPEG，质量 80-90%
- 缩略图：JPEG/WebP，宽度 400px
- 音频：MP3，码率 128-192kbps
- 封面：JPEG/PNG

---

## ⚠️ 版权与边界

### ✅ 可以放入
- **用户自己在展览现场拍摄的照片**（需遵守展馆拍照规定，UCCA 通常允许非闪光灯摄影）
- **UCCA 官网公开的作品缩略图/静帧外链**（页面中会以来源标注形式引用，非下载嵌入）
- **合法授权的音频片段**（例如展览现场录制的环境声，不涉及完整作品音轨）
- **展览手册封面/内页照片**（用户自己拍摄的手册照片）

### ❌ 不应放入
- **未经授权的完整影片**（不要下载或复制展览中的影像作品）
- **未经授权的高清官方图像**（不要从 UCCA 官网批量下载并嵌入页面）
- **其他媒体来源的版权图片**（例如艺术杂志、社交媒体上的他人拍摄照片）

---

## 接入方式

### 1. 放入文件
将图片放入 `assets/images/` 或 `assets/thumbs/`，按命名规则命名。

### 2. 更新 JSON 数据
在 `data/works.json` 中，为对应作品添加 `media` 字段：

```json
{
  "number": 1,
  "title_zh": "少年少年",
  ...,
  "media": {
    "thumbnail": "assets/thumbs/work-01-young-man.jpg",
    "images": ["assets/images/work-01-young-man-01.jpg", "assets/images/work-01-young-man-02.jpg"],
    "audio": "assets/audio/ambient-young-man.mp3",
    "videoPlaceholder": "assets/video-placeholders/work-01-cover.jpg",
    "credit": "Photo by Xin Conan, 2026-05-16",
    "rightsNote": "用户自摄，仅供个人导览回顾使用"
  }
}
```

### 3. 刷新页面
`app.js` 会自动检测 `media.thumbnail` 是否存在：
- **存在**：显示真实图片
- **不存在**：显示黑白胶片风格 CSS 占位图，文字标注 "待补充现场照片 / Media pending"

---

## 当前状态

| 资产 | 状态 | 数量 |
|------|------|------|
| images/ | 空 | 0 |
| thumbs/ | 空 | 0 |
| audio/ | 空 | 0 |
| video-placeholders/ | 空 | 0 |

**等待用户提供现场拍摄照片后填充。**
