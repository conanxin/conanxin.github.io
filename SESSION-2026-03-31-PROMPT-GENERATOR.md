# 会话总结：Nano Banana Pro 提示词生成器工具

> **日期**: 2026-03-31  
> **任务**: 创建智能提示词生成器工具  
> **产出**: Python CLI 工具 + 5 个模板 + 完整文档

---

## 🎯 任务目标

创建一个**智能提示词生成器工具**，能够：
1. 基于模板自动生成高质量的 Nano Banana Pro 提示词
2. 支持交互式参数输入
3. 支持批量生成变体
4. 提供完整的使用文档

---

## 🏗️ 工具架构

### 核心组件

```
prompt-generator/
├── prompt_generator.py      # 主程序 (800+ 行)
├── README.md                # 完整使用文档
├── example_usage.py         # 代码示例
└── examples_output.md       # 生成示例
```

### 类结构

```python
PromptTemplate          # 模板数据类
├── name                # 模板名称
├── category            # 所属分类
├── base_template       # 基础模板（带占位符）
├── parameters          # 参数定义
├── examples            # 示例提示词
└── tips                # 使用技巧

PromptLibrary           # 模板库
├── TEMPLATES           # 所有模板
├── get_template()      # 获取模板
└── list_categories()   # 列出类别

PromptGenerator         # 生成器主类
├── interactive_mode()  # 交互模式
├── batch_generate()    # 批量生成
├── _generate_prompt()  # 生成逻辑
└── _save_to_history()  # 历史记录
```

---

## 📦 功能特性

### 1. 5 个专业模板

| 模板 | 类别 | 参数数量 | 适用场景 |
|-----|------|---------|---------|
| **avatar** | 个人形象 | 11 | LinkedIn 头像、简历照片 |
| **product** | 电商/营销 | 9 | 产品主图、营销材料 |
| **infographic** | 信息可视化 | 9 | 技能展示、数据图表 |
| **social_post** | 社交媒体 | 7 | Instagram、YouTube 缩略图 |
| **game_character** | 游戏开发 | 9 | 角色设计、概念艺术 |

### 2. 4 种参数类型

- **Select** - 从选项中选择
- **Text** - 自由文本输入
- **Number** - 数值范围
- **Fixed** - 固定值（自动生成）

### 3. 3 种使用模式

- **交互模式** - 引导式问答
- **命令行模式** - 直接指定参数
- **批量模式** - 生成多个变体

---

## 🚀 使用方法

### 交互模式（推荐）

```bash
$ python3 prompt_generator.py

🎨 Nano Banana Pro 提示词生成器

📋 可用模板类别:
   avatar       - 专业头像 (个人形象)
   product      - 产品展示 (电商/营销)
   ...

请选择类别: avatar

📝 模板: 专业头像
💡 提示:
   • 眼神是关键 - 确保 'sharp focus on eyes'
   • 背景要简洁 - 避免分散注意力

📌 style:
   选项: Professional, Creative, Casual, Artistic
   默认: Professional
   输入值 (直接回车使用默认): 

... (后续参数输入)

✨ 生成的提示词:
Professional headshot of a 30-year-old female software engineer,
long black hair with bangs, confident expression,
navy blazer over white shirt, clean light gray background,
corporate photography style, soft studio lighting,
8k resolution, sharp focus on eyes...

💾 是否保存到文件? (y/n): y
✅ 已保存到: prompt.txt
```

### 批量生成

```bash
$ python3 prompt_generator.py --category avatar --batch 3

🔄 批量生成 3 个变体 - 专业头像

────────────────────────────────────────
🎲 变体 1/3
────────────────────────────────────────
Artistic headshot of a 55-year-old male designer...

────────────────────────────────────────
🎲 变体 2/3
────────────────────────────────────────
Creative headshot of a 28-year-old female artist...

💾 是否保存所有变体? (y/n): y
✅ 已保存到: batch_avatar_20260331_143022.txt
```

### 列出模板

```bash
$ python3 prompt_generator.py --list

📋 可用模板类别:
   avatar       - 专业头像 (个人形象)
   product      - 产品展示 (电商/营销)
   infographic  - Bento Grid 信息图 (信息可视化)
   social_post  - 社交媒体帖子 (社交媒体)
   game_character - 游戏角色设计 (游戏开发)
```

---

## 💡 生成示例

### 示例 1: 专业头像

**输入参数**:
- style: Professional
- age: 30
- gender: female
- profession: software engineer
- appearance: long black hair with bangs, fair skin
- expression: confident
- outfit: navy blazer over white shirt
- background: clean light gray background

**生成提示词**:
```
Professional headshot of a 30-year-old female software engineer,
long black hair with bangs, fair skin, subtle makeup,
confident expression,
navy blazer over white shirt,
clean light gray background,
corporate photography style,
soft studio lighting with rim light,
8k resolution, sharp focus on eyes, shallow depth of field, high-end retouching,
confident and approachable vibe
```

### 示例 2: 产品展示

**输入参数**:
- product_type: Premium wireless earbuds
- material_finish: matte white finish with chrome accents
- floating_or_placed: floating in mid-air
- angle_view: 45-degree angle view

**生成提示词**:
```
Premium wireless earbuds, matte white finish with chrome accents, elegant white,
floating in mid-air, 45-degree angle view,
minimalist gradient background from light gray to white,
soft product photography lighting with subtle reflections,
subtle reflection on surface below,
professional commercial photography,
8k resolution, macro lens perspective, sharp focus on product details, studio quality
```

### 示例 3: Bento Grid 信息图

**输入参数**:
- style: premium liquid glass
- module_count: 8
- purpose: personal skills showcase
- color_scheme: Deep navy #1e3a5f, Soft teal #4ecdc4, Coral accent #ff6b6b

**生成提示词**:
```
System: Create a premium liquid glass Bento grid infographic with 8 modules for personal skills showcase

Layout: 3x3 grid with center hero module merged
Content: Hero: Name and title. Cards 2-8: Individual skills with icons

Design Specs:
- Style: glass morphism with subtle gradients and transparency
- Color Palette: Deep navy #1e3a5f, Soft teal #4ecdc4, Coral accent #ff6b6b
- Effects: soft shadows (8px blur), rounded corners (16px radius), subtle glow effects

Quality: 4k resolution, professional infographic design, clean typography, balanced composition
```

---

## 📊 技术统计

| 指标 | 数值 |
|-----|------|
| **代码行数** | 800+ 行 |
| **模板数量** | 5 个 |
| **参数总数** | 45+ 个 |
| **示例数量** | 5+ 个 |
| **使用技巧** | 20+ 条 |
| **开发时间** | ~1 小时 |

---

## 🔧 扩展指南

### 添加新模板

```python
"my_template": PromptTemplate(
    name="我的模板",
    category="自定义",
    base_template="""{style} image of {subject},
{details},
{technical}""",
    parameters={
        "style": {
            "type": "select",
            "options": ["Realistic", "Artistic"],
            "default": "Realistic"
        },
        "subject": {
            "type": "text",
            "examples": ["a cat", "a landscape"],
            "default": "a subject"
        },
        "details": {
            "type": "text",
            "examples": ["vibrant colors"],
            "default": "detailed"
        },
        "technical": {
            "type": "fixed",
            "value": "8k resolution"
        }
    },
    examples=["Example prompt"],
    tips=["Tip 1", "Tip 2"]
)
```

---

## 📁 文件位置

```
~/digital-garden/tools/prompt-generator/
├── prompt_generator.py       # 主程序
├── README.md                 # 使用文档
├── example_usage.py          # 代码示例
└── examples_output.md        # 生成示例
```

---

## 🎓 学习价值

### 对 Python 开发者
- 学习了 `dataclass` 的使用
- 理解了命令行参数解析 (`argparse`)
- 掌握了交互式 CLI 设计

### 对提示词工程师
- 学习了模板化提示词设计
- 理解了参数化生成
- 掌握了层次化提示词结构

### 对产品经理
- 学习了 CLI 工具的用户体验设计
- 理解了自动化生成工作流
- 掌握了可扩展的架构设计

---

## 🔗 相关资源

- **提示词库研究**: [[nano-banana-pro-prompts-analysis]]
- **实战指南**: [[nano-banana-pro-prompt-engineering-guide]]
- **示例集**: [[nano-banana-pro-prompt-examples]]
- **GitHub 源项目**: https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts

---

## ✅ 完成清单

- [x] 设计工具架构
- [x] 实现核心类（PromptTemplate, PromptLibrary, PromptGenerator）
- [x] 创建 5 个专业模板
- [x] 实现交互式生成模式
- [x] 实现批量生成模式
- [x] 实现历史记录功能
- [x] 创建完整文档
- [x] 创建使用示例
- [x] 测试所有功能
- [x] 更新数字花园索引

---

## 💬 核心洞察

> **模板化是提示词工程的工业化**

通过将优秀提示词抽象为模板，我们可以：
1. **降低门槛** - 非专业用户也能生成高质量提示词
2. **保证质量** - 基于最佳实践的模板确保输出水平
3. **提升效率** - 批量生成多个变体，快速迭代
4. **知识传承** - 将专家经验编码到模板中

这个工具展示了**AI 工具链的完整闭环**：
- 研究（分析 12,000+ 提示词）
- 总结（提取最佳实践）
- 工具化（创建生成器）
- 应用（生成实际提示词）

---

**下一步**: 可以扩展 Web 界面、添加更多模板、集成 AI 优化建议
