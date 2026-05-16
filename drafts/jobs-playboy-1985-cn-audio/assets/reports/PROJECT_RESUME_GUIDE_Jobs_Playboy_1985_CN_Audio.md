# Resume Guide｜Jobs Playboy 1985 中文音频档案

**项目状态:** COMPLETE (如需继续，从这里开始)
**入口 URL:** https://conanxin.github.io/drafts/jobs-playboy-1985-cn-audio/
**GitHub Pages 目录:** `~/conanxin.github.io/drafts/jobs-playboy-1985-cn-audio/`
**项目目录:** `~/projects/jobs-playboy-1985-cn-audio/`

---

## 快速导航

```bash
# 本地项目
PROJECT_DIR="$HOME/projects/jobs-playboy-1985-cn-audio"
cd "$PROJECT_DIR"

# GitHub Pages 发布目录
PAGES_DIR="$HOME/conanxin.github.io"
TARGET_REL="drafts/jobs-playboy-1985-cn-audio"
TARGET_DIR="$PAGES_DIR/$TARGET_REL"
```

---

## 核心文件索引

### 音频文件 (不要修改)
- `working/phase6k_final_audio/final/jobs_playboy_1985_cn_full_PHASE6J_FINAL.mp3`
  - SHA256: `47317c68d977dcd84d361c413c96c3672454f1502aeeeffc9251e9a7ca460bf0`
  - 44 MB, 102.36 分钟, 24000 Hz mono MP3

### 源数据文件 (只读参考)
- `working/06_repair/03_transcript_cn_literal_REPAIRED_FINAL_PHASE6J.json`
  - 272 units 的完整中文对话 JSON
- `working/06_repair/04_tts_queue_REPAIRED_PHASE6J.jsonl`
  - 1082 行 TTS segment 队列
- `working/06_repair/phase6j_affected_tts_segments.jsonl`
  - 受影响 segment 列表 (如有后续修复)

### 发布文件 (可直接编辑)
- `~/conanxin.github.io/drafts/jobs-playboy-1985-cn-audio/index.html`
  - 主页面 (46 KB)
- `~/conanxin.github.io/drafts/jobs-playboy-1985-cn-audio/assets/data/*.json`
  - 章节、金句、时间线、审计、文稿预览等数据
- `~/conanxin.github.io/drafts/jobs-playboy-1985-cn-audio/assets/text/*.txt|md|json`
  - 最终中文对话稿

---

## 如需继续的常见场景

### 场景 A: 发现新的文本删节，需要补充

```bash
# 1. 编辑 transcript JSON
cd "$PROJECT_DIR"
# 修改 working/06_repair/03_transcript_cn_literal_REPAIRED_FINAL_PHASE6J.json

# 2. 生成新的 audio-ready 队列
# (参考 scripts/phase6k_selective_u0030_tts.py 中的逻辑)

# 3. 选择性重跑 TTS
# 只修改受影响的 segments，复用其余

# 4. 重新拼接 MP3
# ffmpeg concat

# 5. 同步到 GitHub Pages
# 替换 assets/audio/ 下的文件
```

### 场景 B: 改进 TTS 音色或语速

```bash
# edge-tts 参数在 scripts/phase6k_selective_u0030_tts.py 中
# VOICE_MAP = {
#   "jobs_cn": "zh-CN-YunjianNeural",
#   "interviewer_cn": "zh-CN-YunyangNeural",
# }
# 替换音色后选择性重跑
```

### 场景 C: 页面功能增强

直接编辑 `~/conanxin.github.io/drafts/jobs-playboy-1985-cn-audio/index.html`：

- CSS 在 `<style>` 标签内
- JS 在 `<script>` 标签内
- 静态内容预渲染在各 `<div>` 容器内
- 数据 JSON 在 `assets/data/` 目录

编辑后：

```bash
cd ~/conanxin.github.io
git add drafts/jobs-playboy-1985-cn-audio
git commit -m "Enhance: ..."
git push origin main
# 等待 15-20 秒 GitHub Pages 缓存更新
```

### 场景 D: 转为正式公开项目

**⚠️ 注意：需要处理版权问题**

当前设置为 `noindex,nofollow`。如需公开：

1. 确认已获得原始访谈的引用/使用授权
2. 移除或修改 `<meta name="robots" content="noindex,nofollow">`
3. 添加 `robots.txt` 允许索引
4. 考虑从 `drafts/` 移到正式 projects 路径
5. 更新 `projects/data.json` (如有项目列表系统)

---

## 关键边界

| 边界 | 状态 | 说明 |
|------|------|------|
| 音频本体 | ❌ 不修改 | 如需修改，走选择性 TTS 重跑流程 |
| TTS 重跑 | ❌ 不随便全量 | 只重跑受影响的 segments |
| noindex | ✅ 保持 | 除非获得版权授权 |
| 正式 projects | ❌ 不加入 | 除非明确授权 |
| 版权说明 | ✅ 保留 | 页面必须保留来源与边界说明 |

---

## 历史 Phase 参考

如需了解某个功能的实现细节：

| Phase | 功能 | 参考文件 |
|-------|------|----------|
| 6J | u0030 文本修复 | `reports/PHASE6J_U0030_FINAL_TRANSCRIPT_PATCH_REPORT.txt` |
| 6K | 选择性 TTS 重跑 | `reports/PHASE6K_U0030_SELECTIVE_TTS_REPORT.txt` |
| 6M | 首次发布 | `reports/PHASE6M_PUBLISH_REPORT.txt` |
| 6N | 页面增强 (样片/章节/预览) | `reports/PHASE6N_PAGE_OPTIMIZATION_REPORT.txt` |
| 6O | 来源与叙事增强 | `reports/PHASE6O_NARRATIVE_TRUST_PATCH_REPORT.txt` |
| 6P | 搜索/过滤/跳转 | `reports/PHASE6P_SEARCH_FILTER_ONLINE_CONSISTENCY_REPORT.txt` |
| 6Q | 强制部署一致性 | `reports/PHASE6Q_HARD_DEPLOY_CONSISTENCY_REPORT.txt` |
| 6R | 静态回填 | `reports/PHASE6R_STATIC_FALLBACK_ARCHIVE_READABILITY_REPORT.txt` |
| 6S | 移动端 UX | `reports/PHASE6S_MOBILE_LISTENING_UX_REPORT.txt` |
| 6T | 最终 QA/关闭 | `reports/PHASE6T_FINAL_QA_CLOSEOUT_REPORT.txt` (本阶段) |

---

## 已知限制

1. **GitHub Pages 缓存延迟** — push 后 15-20 秒才生效 (Phase 6Q 已验证)
2. **Telegram 文件大小限制** — 完整 MP3 44MB 无法直接发送 (已通过 GitHub Pages 托管解决)
3. **TTS 音色** — edge-tts 免费音色，质量有限
4. **无后端** — 所有交互均为前端 JS，无用户系统/无统计

---

*上次更新: 2026-05-16*
*项目完成: 7a1b4a7*
