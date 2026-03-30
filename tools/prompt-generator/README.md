# 🎨 Nano Banana Pro 提示词生成器

> 智能提示词生成工具 - 基于 12,000+ 真实提示词的最佳实践

---

## ✨ 功能特性

- 🤖 **智能模板系统** - 基于真实优秀提示词构建的模板库
- 📝 **交互式生成** - 引导式问答，轻松创建专业提示词
- 🎲 **批量变体生成** - 一键生成多个创意变体
- 📚 **历史记录** - 自动保存生成的提示词
- 💾 **导出功能** - 保存到文件，方便复用

---

## 🚀 快速开始

### 安装

```bash
# 克隆或下载工具
git clone <repo-url>
cd tools/prompt-generator

# 确保 Python 3.8+ 已安装
python3 --version
```

### 运行

```bash
# 交互模式（推荐新手）
python3 prompt_generator.py

# 查看可用类别
python3 prompt_generator.py --list

# 批量生成变体
python3 prompt_generator.py --category avatar --batch 5

# 查看历史记录
python3 prompt_generator.py --history
```

---

## 📖 使用指南

### 交互模式（推荐）

```bash
$ python3 prompt_generator.py

============================================================
🎨 Nano Banana Pro 提示词生成器
============================================================

📋 可用模板类别:
   avatar       - 专业头像 (个人形象)
   product      - 产品展示 (电商/营销)
   infographic  - Bento Grid 信息图 (信息可视化)
   social_post  - 社交媒体帖子 (社交媒体)
   game_character - 游戏角色设计 (游戏开发)

------------------------------------------------------------

请选择类别 (输入名称): avatar

📝 模板: 专业头像
📂 分类: 个人形象

💡 提示:
   • 眼神是关键 - 确保 'sharp focus on eyes'
   • 背景要简洁 - 避免分散注意力
   • 服装要符合职业形象
   • 使用 8k 和 high-end retouching 提升质量

📌 style:
   选项: Professional, Creative, Casual, Artistic
   默认: Professional
   输入值 (直接回车使用默认): 

📌 age:
   范围: 20 - 60
   默认: 30
   输入值: 28

📌 gender:
   选项: male, female, non-binary
   默认: female
   输入值: female

... (更多参数输入)

============================================================
✨ 生成的提示词:
============================================================

Professional headshot of a 28-year-old female software engineer,
long black hair with bangs, fair skin, subtle makeup,
confident expression,
wearing a navy blazer over white shirt,
clean light gray background,
corporate photography style,
soft studio lighting with rim light,
8k resolution, sharp focus on eyes, shallow depth of field, high-end retouching,
confident and approachable vibe

============================================================
📊 字数统计: 412 字符
============================================================

💾 是否保存到文件? (y/n): y
文件名 (默认: prompt.txt): my_avatar.txt
✅ 已保存到: my_avatar.txt
```

### 批量生成模式

```bash
$ python3 prompt_generator.py --category product --batch 3

🔄 批量生成 3 个变体 - 产品展示

────────────────────────────────────────────────────────────
🎲 变体 1/3
────────────────────────────────────────────────────────────
Premium wireless earbuds, matte white finish with chrome accents, elegant color,
floating in mid-air, 45-degree angle view,
minimalist gradient background from light gray to white,
soft product photography lighting with subtle reflections,
subtle reflection on surface below,
professional commercial photography,
8k resolution, macro lens perspective, sharp focus on product details, studio quality

────────────────────────────────────────────────────────────
🎲 变体 2/3
────────────────────────────────────────────────────────────
...

💾 是否保存所有变体? (y/n): y
✅ 已保存到: batch_product_20260331_143022.txt
```

---

## 📂 模板库

### 可用类别

| 类别 | 名称 | 适用场景 | 模板数量 |
|-----|------|---------|---------|
| `avatar` | 专业头像 | LinkedIn、简历、社交媒体 | 3 个子类型 |
| `product` | 产品展示 | 电商、营销、广告 | 3 个子类型 |
| `infographic` | Bento Grid 信息图 | 技能展示、数据可视化 | 3 种布局 |
| `social_post` | 社交媒体帖子 | Instagram、YouTube、Twitter | 3 个平台 |
| `game_character` | 游戏角色设计 | 游戏开发、概念艺术 | 3 种风格 |

### 模板结构

每个模板包含：
- **基础模板** - 带占位符的提示词框架
- **参数定义** - 可定制的变量（选择器、文本、数字）
- **示例提示词** - 完整填充的参考
- **使用技巧** - 最佳实践建议

---

## 💡 提示词生成原理

### 层次化模板系统

```
基础模板
    ↓
用户输入参数
    ↓
智能填充 + 清理
    ↓
最终提示词
```

### 参数类型

1. **Select（选择器）**
   - 从预定义选项中选择
   - 例如：style, gender, lighting

2. **Text（文本）**
   - 自由输入文本
   - 提供示例参考
   - 例如：appearance, outfit

3. **Number（数字）**
   - 数值范围输入
   - 例如：age (20-60)

4. **Fixed（固定）**
   - 自动填充，不可修改
   - 例如：technical_specs

---

## 🛠️ 自定义模板

### 添加新模板

编辑 `prompt_generator.py` 中的 `PromptLibrary.TEMPLATES`：

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
            "options": ["Realistic", "Artistic", "Abstract"],
            "default": "Realistic"
        },
        "subject": {
            "type": "text",
            "examples": ["a cat", "a landscape", "a product"],
            "default": "a subject"
        },
        "details": {
            "type": "text",
            "examples": ["vibrant colors", "soft lighting"],
            "default": "detailed description"
        },
        "technical": {
            "type": "fixed",
            "value": "8k resolution, high quality"
        }
    },
    examples=["Example prompt here"],
    tips=["Tip 1", "Tip 2"]
)
```

---

## 📊 输出示例

### 头像类

```
Professional headshot of a 30-year-old female software engineer,
long black hair with bangs, fair skin, subtle makeup,
confident expression,
wearing a navy blazer over white shirt,
clean light gray background,
corporate photography style,
soft studio lighting with rim light,
8k resolution, sharp focus on eyes, shallow depth of field, high-end retouching,
confident and approachable vibe
```

### 产品类

```
Premium wireless earbuds, matte white finish with chrome accents,
floating in mid-air, 45-degree angle view,
minimalist gradient background from light gray to white,
soft product photography lighting with subtle reflections,
subtle reflection on surface below,
professional commercial photography,
8k resolution, macro lens perspective, sharp focus on product details, studio quality
```

### 信息图类

```
System: Create a premium liquid glass Bento grid infographic with 8 modules

Layout: 3x3 grid with center hero module merged
Content: Hero: Name and title. Cards 2-8: Individual skills with icons

Design Specs:
- Style: glass morphism with subtle gradients
- Color Palette: Deep navy #1e3a5f, Soft teal #4ecdc4
- Effects: soft shadows, rounded corners (16px)

Quality: 4k resolution, professional infographic design
```

---

## 🔧 命令行参数

```
usage: prompt_generator.py [-h] [--category {avatar,product,infographic,social_post,game_character}]
                          [--batch N] [--history] [--list]

Nano Banana Pro 提示词生成器

optional arguments:
  -h, --help            显示帮助信息
  --category {avatar,product,infographic,social_post,game_character}, -c {avatar,product,infographic,social_post,game_character}
                        直接指定生成类别
  --batch N, -b N       批量生成 N 个变体
  --history, -H         显示生成历史
  --list, -l            列出所有可用类别

示例:
  python prompt_generator.py                    # 交互模式
  python prompt_generator.py --category avatar  # 生成头像提示词
  python prompt_generator.py --batch 5          # 批量生成 5 个变体
  python prompt_generator.py --history          # 查看历史记录
```

---

## 📝 最佳实践

### 提示词优化建议

1. **从模板开始**
   - 使用内置模板作为基础
   - 逐步修改参数
   - 保存有效的变体

2. **迭代优化**
   - 生成初版 → 测试效果 → 调整参数 → 重新生成
   - 记录哪些参数组合效果最好

3. **建立个人库**
   ```
   my_prompts/
   ├── avatars/
   ├── products/
   ├── social/
   └── custom/
   ```

4. **批量生成技巧**
   - 使用 `--batch` 生成多个变体
   - 选择最佳效果
   - 微调细节

---

## 🐛 故障排除

### 问题：生成的提示词中有未替换的占位符

**原因**: 某些参数未提供值

**解决**: 工具会自动清理未替换的占位符，但建议检查输入是否完整

### 问题：保存文件失败

**原因**: 权限问题或路径错误

**解决**: 确保有写入权限，或使用绝对路径

### 问题：中文显示乱码

**原因**: 终端编码问题

**解决**: 设置终端为 UTF-8 编码
```bash
export LANG=en_US.UTF-8
```

---

## 🗺️ 路线图

### 当前版本 (v1.0)
- ✅ 5 个核心模板
- ✅ 交互式生成
- ✅ 批量变体生成
- ✅ 历史记录
- ✅ 文件导出

### 未来版本
- ☐ Web 界面
- ☐ 更多模板（电商、教育、医疗）
- ☐ AI 辅助优化建议
- ☐ 效果预览集成
- ☐ 提示词评分系统

---

## 📚 相关资源

- **研究文档**: [[nano-banana-pro-prompts-analysis]]
- **实战指南**: [[nano-banana-pro-prompt-engineering-guide]]
- **示例集**: [[nano-banana-pro-prompt-examples]]
- **GitHub 库**: https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts

---

## 📄 License

MIT License - 自由使用、修改和分发

---

## 🙏 致谢

- 模板基于 [awesome-nano-banana-pro-prompts](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts) 项目
- 感谢社区贡献的 12,000+ 优秀提示词

---

**开始使用**: `python3 prompt_generator.py`
