# CP-5D Checkpoint — Cinematic Look Development

**Started:** 2026-06-10 17:38 (Asia/Shanghai)
**Status:** In Progress
**Base:** CP-5C-Hotfix-1 (commit b74dfdf)

## Goal
升级 immersive 页面从「可交互 3D 原型」→「低多边形电影化沉浸空间」。

## Hard Boundaries
- ✅ 只修改 `projects/conan-ai-project-cinema/immersive/`
- ❌ 不修改主页面
- ❌ 不修改 drafts
- ❌ 不修改 projects/data.json
- ❌ 不引入 React/Vue/Next/Vite/Tailwind
- ✅ 继续 Three.js + 原生 JS
- ✅ 保留所有 controls
- ❌ 不自动播放声音

## Tasks

### T1. Material Helpers
- [ ] `createGlassMaterial(color, opacity)`
- [ ] `createGlowMaterial(color)`
- [ ] `createPanelMaterial(color)`
- [ ] `createDarkMetalMaterial()`

### T2. Post-Processing
- [ ] toneMapping = ACESFilmicToneMapping
- [ ] exposure = 1.0-1.3
- [ ] fog tuning (FogExp2 density 0.018-0.025)
- [ ] vignette overlay (CSS, fixed)
- [ ] grain overlay (CSS, fixed, low opacity)

### T3. Scene 01 — Complex Ideas 重构
- [ ] 弱化/移除巨大竖板
- [ ] research desk 为主体
- [ ] 4-6 paper fragments
- [ ] idea core cyan glow
- [ ] paper → core 细发光线
- [ ] knowledge wall 改为低透明轮廓

### T4. Scene 02 — AI Beyond Chat 强化
- [ ] 三个面板 docs/browser/terminal 区分
- [ ] 顶部小图标/标题栏
- [ ] 流动 workflow ribbon
- [ ] 半透明玻璃感
- [ ] 轻微 bloom / glow

### T5. Scene 03 — Projects Become Artifacts 强化
- [ ] artifact gallery 风格
- [ ] 不同高度/角度的卡片
- [ ] display plinth / base light
- [ ] project stack / archive tag
- [ ] 层次感

### T6. Scene 04 — Agents Join the Workflow 重做
- [ ] central agent hub
- [ ] 4 节点: OpenClaw / Hermes / Codex / Phase Report
- [ ] 发光连线
- [ ] 脉冲点沿线移动
- [ ] 小型状态牌
- [ ] 不是一个大球

### T7. Scene 05 — Control Tower 重做
- [ ] tower base / core / beacon / rings
- [ ] 2-3 radar rings
- [ ] 顶部 signal beam
- [ ] 周围 system nodes
- [ ] 背景 constellation line
- [ ] 不是占位圆柱

### T8. Scene 06 — Artifact Archive 强化
- [ ] central gate / passage
- [ ] 两侧 shelves 纵深
- [ ] 微光边 archive blocks
- [ ] 中央 archive portal

### T9. 灯光
- [ ] per-scene key light
- [ ] per-scene rim light
- [ ] active object highlight

### T10. 镜头
- [ ] 主视觉居中
- [ ] mobile camera 更近更低

### T11. 验证
- [ ] node --check 全部通过
- [ ] grep 边界检查
- [ ] 真实浏览器检查（agent-browser）
- [ ] 6 幕视觉验证

### T12. 提交
- [ ] RELEASE_NOTES.md 更新
- [ ] FINAL_CLOSEOUT.md 更新
- [ ] git commit
- [ ] git push

## Files
- `immersive/immersive.js` (2184 lines)
- `immersive/scene-data.js` (95 lines)
- `immersive/scene-layout.js` (150 lines)
- `immersive/audio-engine.js` (300 lines)
- `immersive/styles.css` (836 lines)
- `immersive/index.html` (204 lines)
- `projects/conan-ai-project-cinema/RELEASE_NOTES.md`
- `projects/conan-ai-project-cinema/FINAL_CLOSEOUT.md`
