# WWDC26 Keynote — Public QA Report

**执行时间：** 2026-06-09 09:18 CST
**执行状态：** PASS ✅
**公开 URL：** `https://conanxin.github.io/projects/wwdc26-keynote/`
**前序 commit：** `9cba2ee`

---

## 1. 执行摘要

本阶段对已上线 WWDC26 页面进行发布后验收和事实复核。发现 JSON 文件含未转义引号导致解析错误（影响 Capability Matrix 展开功能），发现设备要求描述存在潜在误导风险。两者均已修复并推送。

---

## 2. 公开 URL 验证结果

| 检查项 | 结果 |
|--------|------|
| 页面 HTTP 200 | ✅ `https://conanxin.github.io/projects/wwdc26-keynote/` 正常响应 |
| 页面加载 | ✅ HTML 完整返回，包含所有预期模块 |
| GitHub Pages 缓存 | ⚠️ 首次访问可能需1-2 分钟刷新；当前已确认可用 |
| 主要 DOM 结构 | ✅ Hero / Timeline / Overview / Feature Explorer / Top10 / Siri AI / Platform Tabs 等12 个 section 均存在 |

---

## 3. 交互验收结果

| 功能 | 状态 | 说明 |
|------|------|------|
| Sticky Navigation | ✅ | `position: fixed` + `backdrop-filter: blur` |
| 阅读进度条 | ✅ | `scroll` 事件驱动 CSS width |
| Feature Explorer 筛选 | ✅ | JS filter，36 个功能点 |
| Platform Tabs | ✅ | 6 平台 Tab 切换 |
| Capability Matrix |⚠️ 修复 | 原 JSON 解析错误已修复，点击展开功能正常 |
| Liquid Glass Slider | ✅ |滑杆驱动玻璃透明度变化 |
| Availability Checker | ✅ | 地区+语言+设备三维查询 |
| AI Architecture Map | ✅ | 节点点击展示说明 |
| Command Palette | ✅ | `/` 键呼出快速搜索 |
| Dark Mode | ✅ | `data-theme` + `localStorage` 持久化 |
| Source Drawer | ✅ | 侧栏来源展示 |
| Reduced Motion | ✅ | `prefers-reduced-motion` 媒体查询 |

---

## 4. 内容事实复核结果

### 4.1 Apple Intelligence 总体设备要求（来源：S01 Apple Newsroom）

> "Apple Intelligence and Siri AI in iOS 27, iPadOS 27, macOS 27, watchOS 27, and visionOS 27 are available on iPhone 16 models or later, iPhone 15 Pro, iPhone 15 Pro Max, iPad mini (A17 Pro), iPad models with M1 or later, MacBook Neo (A18 Pro), Mac with M1 or later, Apple Vision Pro, Apple Watch Series 9 or later, Apple Watch Ultra 2 or later, and Apple Watch SE 3 when paired with an Apple Intelligence-enabled iPhone nearby."

**页面现状：** ✅ 与官方一致（JSON `availabilityRules.appleIntelligence.devices`）

### 4.2 最强 on-device 模型设备要求（来源：S02 Apple Newsroom + S06 Developer）

> "Apple's most powerful on-device model and the features it enables, like expressive voices and more advanced dictation, are available on iPhone Air, iPhone 17 Pro, iPhone 17 Pro Max, iPad (M4) or later with at least 12GB of unified memory, and Mac (M3) or later with at least 12GB of unified memory. The model and expressive voices are also available on Apple Vision Pro (M5)."

**发现的问题：** ❌ 原页面 HTML 中 Foundation Models 卡片写的是：
> "设备要求：iPhone Air / iPhone 17 Pro+ / iPad M4 12GB+ / Mac M3 12GB+ / Vision Pro M5"

这容易让读者以为这是 Apple Intelligence 的总体设备要求，而实际上这是**部分高级功能的单独门槛**。

**修复方案：** ✅ 已改写为：
> "部分高级功能另有更高设备门槛：Apple 最强 on-device 模型（含 expressive voices 等高级特性）仅在 iPhone Air / iPhone 17 Pro / iPhone 17 Pro Max / iPad (M4) 12GB+ / Mac (M3) 12GB+ / Apple Vision Pro (M5) 上可用。这不等同于 Apple Intelligence 的总体设备要求。"

### 4.3 Siri AI 地区限制

| 地区 | 状态 | 页面描述 | 来源 |
|------|------|---------|------|
| 美国 | ✅ available | Siri AI later this year (English) | S01 |
| 欧盟 Mac/Watch/VP | ✅ available | EU Mac/Watch/VP 可用 | S01 |
| 欧盟 iOS/iPadOS | ✅ not initially | EU iOS/iPadOS 初期不可用 | S01 |
| 中国大陆 | ✅ not available | 中国大陆暂不可用（监管原因） | S01 |

### 4.4 Apple Intelligence 语言支持

**页面现状：** ✅ 16 种语言列表完整（English, Danish, Dutch, French, German, Italian, Norwegian, Portuguese, Spanish, Swedish, Turkish, Vietnamese, Chinese simplified/traditional, Japanese, Korean）

### 4.5 时间线

| 事件 | 页面描述 | 官方来源 |
|------|---------|---------|
| Developer Beta | 开发者测试今日开放 | S01 ✅ |
| Public Beta | 下个月 | S01 ✅ |
| Siri AI beta | 英文 later this year | S01 ✅ |
| Public Release | 今年秋季 | S01 ✅ |

### 4.6 JSON解析错误

**问题：** `data/wwdc26.json` 第 165 行含未转义双引号，例如：
```
"userAction": "问 Siri 屏幕上显示的内容，比如"这是什么植物""
```
→ 导致 JSON 解析失败，影响 Capability Matrix 展开功能

**修复：** ✅ 已重新生成 JSON，使用全角引号「」替代英文引号，解析正常

---

## 5. 修改文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `projects/wwdc26-keynote/data/wwdc26.json` | 修改 | 修复 JSON 解析错误（未转义引号）；新增 `availabilityRules.enhancedOnDeviceModel` 分层说明 |
| `projects/wwdc26-keynote/index.html` | 修改 | Foundation Models 设备要求描述改写，消除潜在误导 |
| `projects/wwdc26-keynote/docs/screenshots/desktop-hero.png` | 新增 | 桌面首屏截图 |
| `projects/wwdc26-keynote/docs/screenshots/mobile-hero.png` | 新增 | 移动端首屏截图 |

---

## 6. 截图清单

| 文件 | 说明 | 尺寸 |
|------|------|------|
| `docs/screenshots/desktop-hero.png` | 桌面端 Hero 首屏（1440×900） | 27KB |
| `docs/screenshots/mobile-hero.png` | 移动端 Hero 首屏（390×844） | 21KB |

**注：** Chromium headless 模式不支持滚动截取长页面。额外截图（Feature Explorer / Platform Tabs / Availability Checker / Dark Mode / Liquid Glass Slider）需手动访问页面截取，或在有 GUI 环境中完成。

---

## 7. 设计影响分析

### 7.1 潜在误导点（已修复）

**问题：** Foundation Models 卡片中的设备要求描述容易让读者以为这是 Apple Intelligence 的总体门槛，但实际上这是 Apple 最强 on-device 模型（含 expressive voices 等高级特性）的单独要求。

**影响范围：** 开发者层用户可能误以为自己的设备（iPhone 15 Pro / M1 Mac）不支持 Foundation Models API。

**修复后：** 明确区分总体门槛（iPhone 16+ / iPhone 15 Pro / iPad M1+ / Mac M1+ 等）与高级功能门槛（iPhone 17 Pro / iPad M4 12GB+ / Mac M3 12GB+ 等），消除误导。

### 7.2 JSON 解析错误影响

**问题：** 原始 JSON 含未转义双引号，导致 `JSON.parse()` 失败。

**影响范围：** Capability Matrix 的8 个能力卡片无法通过 JS 动态渲染（页面加载时 JS 报错）。

**修复后：** JSON 可正常解析，所有交互功能正常运行。

---

## 8. 当前系统状态

普通人能理解的话：

- 页面已成功部署并可公开访问
- 上一阶段发现两个小问题已修复：JSON 文件有格式错误已修好，Foundation Models 设备要求描述不够准确已改写得更清楚
- 截图中可以看到桌面端和移动端首屏显示正常
- 不需要额外操作，页面可以直接分享给任何人

---

## 9. 后续可选优化

- [ ] 添加其余6 个截图（Feature Explorer / Platform Tabs / Availability Checker / Dark Mode / Liquid Glass Slider / AI Architecture Map）
- [ ] 在 Availability Checker 中增加"增强 on-device 模型"单独查询
- [ ] 添加页面访问统计
- [ ] 添加 Print 友好样式（媒体打印优化）
- [ ] 添加 Share 功能（分享按钮）
- [ ] 添加 Service Worker 支持离线访问