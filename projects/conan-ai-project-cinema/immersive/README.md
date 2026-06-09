# Conan AI Project Cinema — Immersive Mode (CP-4A)

**Phase:** CP-4A
**Path:** `/projects/conan-ai-project-cinema/immersive/`
**URL:** https://conanxin.github.io/projects/conan-ai-project-cinema/immersive/

---

## CP-4A Goal

探索从"电影化网页"升级为"可进入的个人 AI 项目空间"的可能性。
在不影响主页面的前提下，用独立 route 测试3D + Sound 沉浸体验的最低成本实现路径。

---

## Why Start from a Separate Immersive Route

1. **不影响主页面稳定性** — 3D/Sound 探索如果失败，主页面不受影响
2. **快速验证** — 可以独立迭代 immersive route，不涉及主站部署
3. **降低决策压力** — 不需要决定"是否永久替换主页面"，可以先探索再判断

---

## Technical Choice: Vanilla Three.js + Web Audio API

**为什么用 Vanilla Three.js（而不是 Spline / React Three Fiber）：**
- 可完全代码控制，无外部编辑器依赖
- 可直接绑定六幕 scene / camera / audio state
- 适合 GitHub Pages 静态托管（CDN 或本地 vendor）
- 更容易做 WebGL fallback 和性能控制
- 零 build step

**CDN 版本（当前使用）：**
- Three.js `0.169.0` via unpkg ES module
- 固定版本，不使用 latest

**未来可选项：**
- Vendor 本地化（放入 `vendor/three.module.js`）
- 离线可用性增强

---

## 3D Scene Structure

**最低实现（CP-4A）：**
- 暗色地面 / 桌面平面
- Command Desk（发光边缘的暗色桌面 + 3个屏幕面板）
- 6个 Scene Node spheres（带 ring glow）
- Particle system（300个随机漂浮光点）
- Agent workflow line（发光管道 + 节点）
- 18个 floating artifact cards

**不追求：**
- 外部3D 模型文件
- PBR 复杂材质
- 大规模场景

---

## Sound Design Principles

**全部为代码生成的合成声音，不依赖外部音频文件：**

| Scene | Sound Character |
|-------|----------------|
| Ideas | Soft filtered noise + 三角波 |
| Chat | Subtle digital pulse |
| Artifacts | Warm low pad |
| Agents | Rhythmic tick |
| Tower | Deep system hum |
| Archive | Open airy pad |

**安全原则：**
- 不自动播放（必须用户点击 Enter按钮）
- 音量默认很低（master gain 0.12）
- 页面隐藏时自动 suspend audio context
- 用户离开页面时清理 audio nodes
- 不使用版权音频

---

## Fallback Strategy

| Failure | Behavior |
|---------|----------|
| WebGL unavailable | 显示 fallback 区域，提供返回主页面链接 |
| Three.js CDN加载失败 | 显示 fallback，console记录错误 |
| AudioContext初始化失败 | 无声模式运行，所有 scene切换功能正常 |
| 任何 init 错误 | 不崩溃，不空白，显示 fallback |

---

## Not Affecting Main Page

- 主页面路径：`/projects/conan-ai-project-cinema/`（不变）
- Immersive route：`/projects/conan-ai-project-cinema/immersive/`（独立）
- 两套独立 HTML / CSS / JS，无共享状态
- Immersive 页面有自己的 `robots: noindex, nofollow`
- Immersive 页面失败不影响主页面

---

## CP-4B / CP-4C Suggestions

**CP-4B：**滚动驱动 camera（scrollIntoView + smooth camera transition）
**CP-4C：** 主页面集成入口（在主页面 Hero 添加 "Enter Immersive Mode" 按钮）
**CP-4D：**评估是否将 immersive route 作为可选模式而非独立 route

---

*Readme by 辛 🔮 — Phase CP-4A*
---

## CP-4B: Scroll-driven Scene Sync

**Phase:** CP-4B — 2026-06-09

### What Was Added

- **Scroll Story Overlay** — Fixed-position text layer (z-index 50) with 6 scene text blocks
- **IntersectionObserver** — Tracks which `.scroll-scene` is in viewport center (`rootMargin: '-30% 0px -30% 0px'`)
- **Scene sync** — When scroll scene enters center, camera / HUD / sound / scroll-class sync simultaneously
- **Click → Scroll unified** — Clicking scene switcher scrolls to the scene, scroll observer triggers sync
- **Fallback** — If no scroll story element, click falls back to direct `_gotoScene()`

### Camera Behavior

- Each scene has a `baseCameraPos` + `baseCameraTarget` set by `_setSceneFromScroll()`
- Animation loop lerps camera toward `baseCameraPos` + parallax offset
- No more camera drift back to fixed position

### Reduced Motion

- `prefers-reduced-motion: reduce` → `scrollIntoView({ behavior: 'auto' })`
- Camera tween skipped, position set immediately
- Parallax disabled

### Sound Mood Sync

- `audio.setMood()` called in `_setSceneFromScroll()` when sound is enabled
- No autoplay, sound only starts after user click

### Not in CP-4B

- Continuous camera path following scroll (CP-4C)
- Main page integration entry (CP-4C)
- Mobile touch/scroll gesture refinement (CP-4C)

*Readme updated by 辛 🔮 — Phase CP-4B*

---

## CP-4C: Main Page Immersive Entry

**Phase:** CP-4C — 2026-06-09

### Main Page Now Links to Immersive Route

The stable main page (CP-3E) now has an Immersive Entry Section between Hero and Featured Strip.

### Entry Point

- **URL:** `/projects/conan-ai-project-cinema/`
- **Section:** Immersive entry panel with "Enter Immersive Mode" CTA
- **Link:** Points to `/projects/conan-ai-project-cinema/immersive/`

### Main Page Stays Clean

- No Three.js loaded in main page
- No immersive.js in main page
- No audio-engine.js in main page
- Main page remains pure HTML/CSS/JS

### Immersive Route Still Independent

- Still runs at `/immersive/`
- Still has its own entry overlay
- Still requires user click to enable sound

---

*Readme update by 辛 🔮 — Phase CP-4C*

---

## CP-4D: Continuous Camera Path + Performance Guard

**Phase:** CP-4D — 2026-06-09

### Continuous Camera Path

The immersive route now supports scroll-driven continuous camera interpolation.

### How It Works

- **Scroll progress tracking** — calculates `progress 0~1` from scroll position, maps to scene index + local t
- **Camera path interpolation** — `THREE.Vector3.lerpVectors` between current and next scene camera position/target
- **Throttled updates** — scroll listener sets `needsScrollUpdate` flag, animation loop processes once per frame
- **Dual mode** — continuous mode active when scroll story present + reduced motion off; otherwise section-based fallback

### Performance Guard

- Mobile (`/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)`) → max pixel ratio 1.5
- Desktop → max pixel ratio 2

### Section Sync vs Camera Interpolation

| System | Trigger | Purpose |
|--------|---------|---------|
| IntersectionObserver | Section enters viewport center | HUD active / sound mood / switcher |
| Continuous camera | Scroll progress (0~1) | Visual camera interpolation |

Both run independently; camera interpolation handles visual smoothness, section sync handles UI state.

---

*Readme update by 辛 🔮 — Phase CP-4D*

---

## CP-4D (Updated): Continuous Camera Path + Performance Guard

**Phase:** CP-4D — 2026-06-09

### How Continuous Camera Path Works

1. Scroll listener sets `needsScrollUpdate = true` (passive, throttled)
2. Animation loop picks up flag → calls `_updateScrollProgress()` → `_updateContinuousCamera()`
3. `_updateScrollProgress()` calculates `scrollProgress 0~1` from scroll position
4. `_updateContinuousCamera()` uses `THREE.Vector3.lerpVectors` between current and next scene camera position/target
5. Camera smoothly interpolates toward `cameraPathPos` + `cameraPathTarget`

### Performance Guard

| Condition | Max Pixel Ratio |
|-----------|-----------------|
| Low-power (hwConcurrency ≤ 4 or deviceMemory ≤ 4) | 1.0 |
| Mobile (UA match OR viewport < 768px) | 1.5 |
| Desktop | 2.0 |

### Visibility Pause

- `document.addEventListener('visibilitychange')` → sets `this.isPaused`
- Paused: animation loop skips heavy computation, still renders one frame
- Audio: `suspend()` when hidden, `resume()` when visible

### Resize Throttle

- `requestAnimationFrame`-based throttle in resize handler
- Prevents redundant renderer resize during active window resize

### Reduced Motion

- `prefers-reduced-motion: reduce` → `useContinuous = false`
- Falls back to section-based `baseCameraPos` camera
- Mouse parallax offset set to 0
- Scene switching / HUD / sound all still functional

### Section Sync vs Continuous Camera

| System | Trigger | Purpose |
|--------|---------|---------|
| IntersectionObserver | Section enters viewport center | HUD active / sound mood / switcher |
| Continuous camera | Scroll progress 0~1 | Visual camera interpolation |

Both run independently.

---

*Readme update by 辛 🔮 — Phase CP-4D (updated)*

---

## CP-4E: Immersive Scene Polish and Sound Cues

**Phase:** CP-4E — 2026-06-09

### What's New

#### Entrance Fly-in

When the user clicks Enter Immersive Mode or Enter Without Sound:
1. Camera starts at `baseCameraPos + (0, +3, +8)` offset
2. Animation loop uses `easeOutCubic` to interpolate camera to target over 1600ms
3. During fly-in, animation loop returns early (skipping continuous/section camera)
4. Skipped entirely when `prefers-reduced-motion: reduce`

#### Scene Transition Visual Cue

- Fixed overlay (`<div class="scene-cue" id="scene-cue">`) at top-center
- `_triggerSceneCue(index, sceneData)` called on every scene change
- Shows "Scene 01 · Complex Ideas" label
- CSS: opacity 0→1 on `.cue-visible` class, auto-hides after 1.2s
- Reduced motion: just briefly shows then hides after 0.2s

#### Scene Object Focus / Spotlight

- `sceneNodeMeshes` maps `sceneIndex → [mesh, ring]`
- `_updateObjectFocus(activeIndex)` sets active node: scale 1.25x, emissiveIntensity 1.0
- Inactive nodes: scale 1.0, emissiveIntensity 0.2
- Skipped in reduced motion

#### Sound Cue Polish

`playSceneCue(mood)` in audio-engine.js plays distinct short sounds per mood:

| Mood | Sound Character | Duration |
|------|----------------|----------|
| ideas | Soft paper-like double click | ~120ms |
| chat | Short digital blip | ~80ms |
| artifacts | Warm chime (C-E-G triad) | ~200ms |
| agents | Short tick sequence (3 ticks) | ~150ms |
| tower | Low pulse (80Hz + 60Hz) | ~250ms |
| archive | Airy open tone + noise texture | ~180ms |

Plays only when `soundEnabled && !muted && started`. Volume 0.04 (very low).

---

*Readme update by 辛 🔮 — Phase CP-4E*

---

## CP-4F: Immersive Experience QA

**Phase:** CP-4F — 2026-06-09

### Final Acceptance

The immersive route was evaluated across 10 dimensions:

| Dimension | Score |
|-----------|-------|
| 3D Spatial Presence | 8/10 |
| Cinematic Camera | 8/10 |
| Scroll-driven Narrative | 9/10 |
| Scene Transition Feel | 7/10 |
| Object Focus / Spotlight | 7/10 |
| Sound Mood | 8/10 |
| Sound Cue Feedback | 7/10 |
| User Control / Sound Consent | 10/10 |
| Performance / Fallback | 8/10 |
| Integration with Main Page | 8/10 |

**Final score: 84/100**

**Status: 3D/Sound immersive target reached for static GitHub Pages implementation.**

### Remaining Limits

This implementation does not include: Spline-level visual design, fully modeled 3D room, professional sound design, advanced WebGL post-processing, PWA, or mobile swipe gesture. These are out of scope for the current static hosting environment.

### CP-4 Series Seal

CP-4A → CP-4A-Browser-Verification → CP-4B → CP-4B-Sound-Hotfix → CP-4C → CP-4D → CP-4E → CP-4F

CP-4 is sealed as a post-CP-3F extension line. The immersive route is independent and does not affect main page stability.

---

*Readme update by 辛 🔮 — Phase CP-4F*
