# Command Card｜Jobs Playboy 1985 中文音频档案

**一句话描述：** 102 分钟 Steve Jobs 1985 Playboy 访谈中文音频档案，含修复记录、金句锚点、章节导航与移动端听读体验。

---

## 访问

```
https://conanxin.github.io/drafts/jobs-playboy-1985-cn-audio/
```

---

## 核心文件

| 类型 | 路径 | 大小 |
|------|------|------|
| 完整音频 | `assets/audio/jobs_playboy_1985_cn_full_PHASE6J_FINAL.mp3` | 44 MB |
| 音频对应文本 | `assets/text/jobs_playboy_1985_cn_full_PHASE6J_FINAL_transcript.txt` | 83 KB |
| 中文对话 JSON | `assets/text/03_transcript_cn_literal_REPAIRED_FINAL_PHASE6J.json` | 287 KB |
| 页面入口 | `index.html` | 46 KB |

---

## 关键数据

- **272** 个对话单元 (units)
- **1082** 个 TTS segments
- **102.36** 分钟音频
- **0** 个失败 segments
- **SHA256**: `47317c68d977...ca460bf0`

---

## 页面功能速查

| 功能 | 操作 |
|------|------|
| 搜索文稿 | 页面搜索框，支持关键词高亮 |
| Speaker 过滤 | 下拉选择：全部 / 乔布斯 / Playboy |
| Unit 跳转 | 输入 `u0030` 等 unit ID，Enter 跳转 |
| 章节跳转 | 点击章节"跳转播放"按钮 |
| 金句播放 | 点击金句"跳转播放"按钮 |
| 继续收听 | 自动保存进度，刷新后恢复 |
| 复制时间链接 | 迷你播放器"复制时间链接"按钮 |
| URL 时间跳转 | `#t=1234` 秒数自动定位 |
| 区块折叠 | 点击标题右侧"收起/展开" |
| 回到顶部 | 右下角悬浮按钮 |
| 迷你播放器 | 滚动后底部固定，可拖拽进度 |

---

## 移动端要点

- 底部迷你播放器 (滚动后显示)
- 大区块默认可折叠
- 小屏隐藏"复制时间链接"按钮 (用系统分享替代)
- 页面底部预留 ~170px 空间给播放器

---

## 继续开发入口

```bash
# 本地项目
PROJECT_DIR="$HOME/projects/jobs-playboy-1985-cn-audio"
cd "$PROJECT_DIR"

# GitHub Pages 发布目录
PAGES_DIR="$HOME/conanxin.github.io"
TARGET="$PAGES_DIR/drafts/jobs-playboy-1985-cn-audio"
```

---

## 关键修复记录

| ID | 内容 |
|----|------|
| speaker_alignment | Playboy / 乔布斯说话人错位修复 |
| u0054_lisa | Lisa 失败原因段补全 |
| u0078_u0083_land | Edwin Land / Apple 公司使命段修复 |
| u0096_ibm | IBM / Frito-Lay / Dark Ages 段补回 |
| u0030_macintosh | Macintosh 开发经历补全 |

---

## 边界

- `noindex,nofollow` — 当前未公开索引
- 未加入正式 projects 列表
- 原访谈版权归原权利方所有
- 本页为学习研究与内部审阅用途

---

*Phase 6T 最终关闭 | Commit: 7a1b4a7 | 2026-05-16*
