# Nano Banana Pro 提示词工程实战指南

> **实践指南** | 基于 12,000+ 真实提示词案例分析  
> **目标**: 掌握从入门到精通的提示词设计技能

---

## 1. 快速入门

### 1.1 什么是 Nano Banana Pro？

**Nano Banana Pro** 是 Google 的多模态 AI 图像生成模型，特点：
- ⚡ **快速迭代** — 秒级生成
- 🎨 **多样风格** — 从像素到油画
- 🔧 **精确控制** — 详细构图和光照
- 🌈 **多语言支持** — 16 种语言

### 1.2 基础提示词结构

```
[主体描述] + [风格/媒介] + [环境/背景] + [光照/氛围] + [技术规格]

示例:
"A young woman, portrait, soft natural lighting, photorealistic, 8k"
```

### 1.3 第一个提示词

**简单版**:
```
A cute cat sitting on a windowsill, sunlight, watercolor style
```

**进阶版**:
```
A fluffy orange tabby cat sitting on a vintage wooden windowsill,
soft morning sunlight streaming through lace curtains,
watercolor painting style, warm color palette,
peaceful and cozy atmosphere, 4k resolution
```

---

## 2. 提示词工程核心技巧

### 2.1 层次化描述法

```
Level 1: 主体（Who/What）
  → "A young Japanese woman in her 20s"

Level 2: 外貌（Appearance）
  → "long black hair with bangs, fair skin, natural makeup"

Level 3: 服装/道具（Outfit/Props）
  → "wearing a white summer dress, holding a book"

Level 4: 环境（Environment）
  → "standing in a sunflower field at golden hour"

Level 5: 风格（Style）
  → "anime style, soft pastel colors, dreamy atmosphere"

Level 6: 技术（Technical）
  → "8k resolution, sharp focus, detailed"
```

### 2.2 权重分配技巧

**自然强调**（通过重复或详细描述）:
```
"Very beautiful sunset, EXTREMELY detailed clouds, 
beautiful beautiful golden light"
```

**结构强调**（使用标点或格式）:
```
"【IMPORTANT】The character must be smiling.【/IMPORTANT】
Background: forest setting"
```

### 2.3 负面提示词

```
Style: photorealistic portrait
Positive: "Clear skin, natural lighting, sharp eyes"
Negative: "blurry, low quality, distorted face, extra fingers"
```

---

## 3. 分类实战：提示词模板

### 3.1 头像/肖像类 (Profile/Avatar)

**模板**:
```
[人物描述], [年龄/性别], [面部特征],
[表情/姿势], [服装风格],
[背景], [艺术风格], [光照],
[技术规格]
```

**示例**:
```
A professional headshot of a confident businesswoman in her 30s,
short brown hair, subtle smile, wearing a navy blazer,
clean white background, corporate photography style,
soft studio lighting, high-end retouching,
8k resolution, sharp focus on eyes
```

### 3.2 产品展示类 (Product)

**模板**:
```
[产品名称], [材质/质感], [颜色],
[展示角度], [背景风格], [光影效果],
[渲染质量]
```

**示例**:
```
Premium wireless earbuds, matte white finish with chrome accents,
floating in mid-air, 45-degree angle view,
minimalist gradient background from light gray to white,
soft product photography lighting with subtle reflections,
professional commercial photography, 8k resolution
```

### 3.3 信息图类 (Infographic)

**模板**:
```
System instruction: Create [图表类型] for [主题]
1) Data points: [数据点描述]
2) Color scheme: [颜色方案]
3) Layout: [布局说明]
4) Style: [风格定义]
```

**示例** (Bento Grid):
```
Create a premium liquid glass Bento grid infographic with 8 modules.
Product: Wireless headphones
Category: TECH

1) Color Palette:
   - Hero color: #3B82F6 (blue)
   - Secondary: #1E40AF (dark blue)
   - Accent: #60A5FA (light blue)

2) Layout:
   - Card 1 (Hero): Large product image
   - Cards 2-8: Feature highlights with icons

3) Style:
   - Glass morphism effect
   - Soft shadows
   - Rounded corners
   - Minimalist design
```

### 3.4 漫画/故事板类 (Comic)

**模板**:
```
Format: [格式类型]
Setting: [场景描述]
Characters: [角色设定]

[Panel 1]
Composition: [构图]
Action: [动作]
Dialogue: [对话]

[Panel 2]
...
```

**示例** (四格漫画):
```
Format: Japanese 4-panel manga (yonkoma), vertical layout,
grayscale, seinen manga style, exaggerated expressions

Setting: Office, modern cubicle environment

Characters:
- Salaryman: Tired office worker, suit and tie, messy hair
- Boss: Middle-aged manager, stern expression

[Panel 1]
Composition: Wide shot of office
Salaryman typing at computer, looking exhausted
Dialogue: "Just... 5 more minutes..."

[Panel 2]
Composition: Close-up of computer screen
Deadline notification flashing
Dialogue: System: "DEADLINE: TODAY 18:00"

[Panel 3]
Composition: Boss appears behind salaryman
Boss: "How's the project going?"
Salaryman: (sweating) "Almost... done..."

[Panel 4]
Composition: Salaryman's desperate face
Thought bubble: "I haven't even started!"
Expression: Panic, exaggerated sweat drops
```

### 3.5 游戏素材类 (Game Asset)

**模板**:
```
[资产类型], [风格参考], [详细描述],
[技术规格], [用途说明]
```

**示例**:
```
Game character design: Cute forest spirit companion
Style: Studio Ghibli meets Zelda: Breath of the Wild

Appearance:
- Small humanoid figure, 30cm tall
- Body made of moss and twigs
- Glowing amber eyes
- Small antlers with tiny flowers
- Translucent wings like dragonflies

Clothing:
- Leaf cape
- Acorn cap hat
- Vine belt with glowing berries

Pose: Floating mid-air, curious expression
Background: Clean white for game asset extraction
Style: 3D render, toon shader, vibrant colors
Technical: 4k resolution, character turnaround sheet
```

---

## 4. 高级技巧

### 4.1 Raycast 动态参数

**语法**:
```
{argument name="param_name" default="default_value"}
```

**示例**:
```
Create a motivational poster with the quote:
"{argument name="quote" default="Dream big, work hard"}"

Author: {argument name="author" default="Unknown"}

Style: {argument name="style" default="minimalist"}
Options: minimalist / vintage / modern / artistic
```

**使用场景**:
- 批量生成系列内容
- A/B 测试不同文案
- 客户定制化需求

### 4.2 JSON 结构化提示词

**适用场景**: 复杂角色设计、多条件生成

```json
{
  "character": {
    "name": "Luna",
    "age": "24",
    "gender": "Female",
    "species": "Elf",
    "appearance": {
      "hair": "Silver long hair with braids",
      "eyes": "Emerald green, glowing",
      "skin": "Pale with subtle shimmer",
      "features": "Pointed ears, delicate face"
    },
    "clothing": {
      "top": "Forest green tunic with gold embroidery",
      "bottom": "Leather leggings",
      "accessories": "Leaf crown, nature staff"
    }
  },
  "setting": "Ancient forest, rays of sunlight through canopy",
  "pose": "Standing confidently, holding staff",
  "style": "Fantasy illustration, detailed, magical atmosphere",
  "technical": {
    "resolution": "4k",
    "lighting": "Dramatic side lighting",
    "mood": "Mysterious yet welcoming"
  }
}
```

### 4.3 风格混合技巧

**公式**:
```
[基础风格] × [融合风格] + [强调元素] = [独特效果]
```

**示例**:
```
Style: Studio Ghibli meets Cyberpunk 2077

A cute robot companion in a neon-lit Tokyo street,
Ghibli's warm color palette + cyberpunk's neon aesthetics,
Studio Ghibli's emotional storytelling + cyberpunk's tech elements,
Soft rounded shapes mixed with sharp geometric patterns
```

**经典组合**:
| 组合 | 效果 |
|-----|------|
| 吉卜力 + 赛博朋克 | 温暖科技风 |
| 水墨 + 像素艺术 | 传统数字融合 |
| 油画 + 3D 渲染 | 质感立体 |
| 极简 + 巴洛克 | 对比冲击 |

---

## 5. 常见错误与解决方案

### 5.1 错误排行榜

| 排名 | 错误 | 后果 | 解决方案 |
|-----|------|------|---------|
| 1 | **过于宽泛** | 结果不可控 | 添加具体形容词 |
| 2 | **矛盾描述** | 风格混乱 | 明确优先级 |
| 3 | **忽视比例** | 构图失衡 | 指定画幅比例 |
| 4 | **缺失光照** | 效果平淡 | 添加光照描述 |
| 5 | **版权风险** | 法律问题 | 使用原创/开源 |

### 5.2 错误案例分析

#### ❌ 错误示例 1: 过于宽泛

**原提示词**:
```
A beautiful girl
```

**问题**:
- "Beautiful" 定义不明确
- 没有年龄、风格、场景
- AI 会随机生成

**改进**:
```
A young woman in her early 20s, East Asian features,
long straight black hair with curtain bangs,
wearing a cream-colored knit sweater,
soft natural lighting, warm color palette,
cozy autumn atmosphere, lifestyle photography style,
shallow depth of field, 85mm lens look
```

#### ❌ 错误示例 2: 矛盾描述

**原提示词**:
```
Photorealistic anime character in watercolor style
```

**问题**:
- "Photorealistic" 和 "anime" 矛盾
- "Anime" 和 "watercolor" 风格冲突

**改进** (三选一):
```
# 选项 1: 写实风格
Photorealistic portrait of a Japanese woman,
inspired by anime aesthetics but realistic rendering

# 选项 2: 动漫风格
Anime-style character illustration,
cel-shaded with detailed line work

# 选项 3: 水彩风格
Watercolor painting of an anime-inspired character,
soft washes and bleeding colors
```

#### ❌ 错误示例 3: 忽视技术参数

**原提示词**:
```
A product photo of headphones
```

**改进**:
```
Professional product photography of wireless headphones,
floating against a gradient background (#1a1a2e to #16213e),
studio lighting with soft shadows,
subtle reflection on surface,
macro lens perspective, commercial quality,
8k resolution, sharp focus on product details
```

---

## 6. 实战练习

### 6.1 练习 1: 头像生成

**任务**: 为自己创建一个专业头像

**步骤**:
1. 描述你的外貌特征（发型、面部特征、表情）
2. 选择服装风格（职业/休闲/创意）
3. 确定背景（纯色/环境/抽象）
4. 选择艺术风格（写实/插画/3D）
5. 添加光照和技术参数

**模板填空**:
```
A professional headshot of [你的描述],
[年龄] years old, [面部特征],
[表情], wearing [服装],
[背景描述], [艺术风格],
[光照条件], [技术规格]
```

### 6.2 练习 2: 产品展示

**任务**: 为一个虚构产品设计主图

**产品**: 智能保温杯
- 功能: 温度显示、APP 连接
- 设计: 极简、金属质感
- 目标: 电商平台主图

**思考点**:
- 如何展示功能？
- 什么角度最好？
- 背景如何衬托产品？
- 光线如何体现质感？

### 6.3 练习 3: 信息图设计

**任务**: 创建一个技能信息图

**要求**:
- 6 个技能模块
- Bento Grid 布局
- 个人品牌配色
- 包含图标和简短描述

**参考结构**:
```
Create a personal skills infographic with Bento Grid layout (6 modules).

Skills to include:
1. Frontend Development (React, Vue)
2. UI/UX Design (Figma)
3. AI Integration (LLM, RAG)
4. Data Analysis (Python, SQL)
5. Project Management (Agile)
6. Creative Writing (Content)

Style:
- Glass morphism
- Primary color: [你的主色]
- Modern, clean, professional
```

---

## 7. 工具与资源

### 7.1 推荐工具

| 工具 | 用途 | 链接 |
|-----|------|------|
| **YouMind Gallery** | 浏览提示词库 | youmind.com/nano-banana-pro-prompts |
| **Raycast** | 动态参数管理 | raycast.com |
| **Color Hunt** | 配色方案 | colorhunt.co |
| **Lexica** | AI 图像搜索 | lexica.art |

### 7.2 学习资源

- **官方文档**: [Nano Banana Pro 10 个真实案例](https://youmind.com/blog/nano-banana-pro-10-real-cases)
- **GitHub 库**: [awesome-nano-banana-pro-prompts](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts)
- **社区讨论**: GitHub Discussions

### 7.3 术语表

| 术语 | 解释 |
|-----|------|
| **Prompt** | 提示词，给 AI 的指令 |
| **Negative Prompt** | 负面提示，告诉 AI 避免什么 |
| **Aspect Ratio** | 画幅比例 (16:9, 1:1, 9:16) |
| **Resolution** | 分辨率 (4k, 8k, 1024x1024) |
| **Style** | 艺术风格 (写实、动漫、油画等) |
| **Composition** | 构图 (rule of thirds, centered) |
| **Lighting** | 光照 (natural, studio, dramatic) |

---

## 8. 进阶路径

### 阶段 1: 模仿者 (1-2 周)
- 复制提示词库中的示例
- 理解结构和方法
- 记录有效模式

### 阶段 2: 改编者 (3-4 周)
- 修改现有提示词
- 尝试不同组合
- 建立自己的提示词库

### 阶段 3: 创造者 (5-8 周)
- 编写原创提示词
- 开发个人风格
- 分享给社区

### 阶段 4: 专家 (2-3 个月)
- 系统化学方法论
- 教学和指导
- 参与工具开发

---

## 9. 快速参考卡

### 常用形容词库

**质量**: masterpiece, best quality, ultra-detailed, 8k, photorealistic

**光照**: soft lighting, dramatic lighting, golden hour, studio lighting, natural light

**风格**: anime style, cinematic, watercolor, oil painting, 3D render, pixel art

**氛围**: cozy, mysterious, cheerful, serene, epic, intimate

**技术**: sharp focus, depth of field, bokeh, HDR, ray tracing

### 画幅比例速查

| 比例 | 用途 |
|-----|------|
| 1:1 | 头像、Instagram |
| 16:9 | 横幅、YouTube 缩略图 |
| 9:16 | 手机壁纸、Stories |
| 4:3 | 文档、PPT |
| 21:9 | 电影感、超宽屏 |

### 结构化提示词检查清单

- [ ] 主体描述清晰
- [ ] 外貌/特征详细
- [ ] 服装/道具明确
- [ ] 环境/背景设定
- [ ] 艺术风格指定
- [ ] 光照条件描述
- [ ] 技术参数添加
- [ ] 画幅比例确认

---

## 10. 结语

> *"提示词是与 AI 对话的语言——掌握它，就掌握了创造的力量。"*

**下一步行动**:
1. 访问 [YouMind Gallery](https://youmind.com/en-US/nano-banana-pro-prompts) 浏览真实案例
2. 选择 3 个喜欢的提示词，理解其结构
3. 使用本指南的模板，创建你的第一个原创提示词
4. 记录效果，持续迭代优化

---

**相关研究**:
- [[nano-banana-pro-prompts-analysis]] — 项目深度分析
- [[decentralized-ai-landscape]] — AI 生态全景

---

## 标签

#nano-banana-pro #prompt-engineering #ai-image-generation #tutorial #practical-guide #google-gemini #content-creation
