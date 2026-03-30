#!/usr/bin/env python3
"""
Nano Banana Pro Prompt Generator
智能提示词生成器 - 根据用户需求自动生成高质量提示词

Usage:
    python prompt_generator.py                    # 交互模式
    python prompt_generator.py --category avatar  # 直接指定类别
    python prompt_generator.py --batch 5          # 批量生成 5 个变体
"""

import json
import random
import argparse
from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict


@dataclass
class PromptTemplate:
    """提示词模板结构"""
    name: str
    category: str
    base_template: str
    parameters: Dict[str, Dict[str, str]]
    examples: List[str]
    tips: List[str]


class PromptLibrary:
    """提示词模板库"""
    
    TEMPLATES = {
        "avatar": PromptTemplate(
            name="专业头像",
            category="个人形象",
            base_template="""{style} headshot of a {age}-year-old {gender} {profession},
{appearance},
{expression} expression,
{outfit},
{background},
{photography_style},
{lighting},
{technical_specs},
{mood}""",
            parameters={
                "style": {
                    "type": "select",
                    "options": ["Professional", "Creative", "Casual", "Artistic"],
                    "default": "Professional"
                },
                "age": {
                    "type": "number",
                    "range": [20, 60],
                    "default": "30"
                },
                "gender": {
                    "type": "select",
                    "options": ["male", "female", "non-binary"],
                    "default": "female"
                },
                "profession": {
                    "type": "text",
                    "examples": ["software engineer", "designer", "writer", "entrepreneur"],
                    "default": "professional"
                },
                "appearance": {
                    "type": "text",
                    "examples": [
                        "long black hair with bangs, fair skin, subtle makeup",
                        "short curly hair, glasses, warm smile",
                        "straight blonde hair, blue eyes, natural look"
                    ],
                    "default": "professional appearance"
                },
                "expression": {
                    "type": "select",
                    "options": ["confident", "friendly", "thoughtful", "warm", "neutral"],
                    "default": "confident"
                },
                "outfit": {
                    "type": "text",
                    "examples": [
                        "navy blazer over white shirt",
                        "creative casual with artistic accessories",
                        "modern business casual"
                    ],
                    "default": "professional attire"
                },
                "background": {
                    "type": "select",
                    "options": [
                        "clean light gray background",
                        "soft gradient background",
                        "minimalist studio backdrop",
                        "natural outdoor bokeh"
                    ],
                    "default": "clean light gray background"
                },
                "photography_style": {
                    "type": "select",
                    "options": [
                        "corporate photography style",
                        "lifestyle photography",
                        "high-end portrait",
                        "creative editorial"
                    ],
                    "default": "corporate photography style"
                },
                "lighting": {
                    "type": "select",
                    "options": [
                        "soft studio lighting with rim light",
                        "natural window light",
                        "dramatic side lighting",
                        "warm golden hour glow"
                    ],
                    "default": "soft studio lighting with rim light"
                },
                "technical_specs": {
                    "type": "fixed",
                    "value": "8k resolution, sharp focus on eyes, shallow depth of field, high-end retouching"
                },
                "mood": {
                    "type": "select",
                    "options": [
                        "confident and approachable vibe",
                        "creative and inspiring atmosphere",
                        "professional and trustworthy feel"
                    ],
                    "default": "confident and approachable vibe"
                }
            },
            examples=[
                "Professional headshot of a 30-year-old female software engineer, long black hair with bangs, fair skin, subtle makeup, confident expression, wearing a navy blazer over white shirt, clean light gray background, corporate photography style, soft studio lighting with rim light, 8k resolution, sharp focus on eyes, shallow depth of field, high-end retouching, confident and approachable vibe"
            ],
            tips=[
                "眼神是关键 - 确保 'sharp focus on eyes'",
                "背景要简洁 - 避免分散注意力",
                "服装要符合职业形象",
                "使用 8k 和 high-end retouching 提升质量"
            ]
        ),
        
        "product": PromptTemplate(
            name="产品展示",
            category="电商/营销",
            base_template="""{product_type}, {material_finish}, {color},
{floating_or_placed} {angle_view},
{background_style},
{lighting_setup},
{reflection_shadows},
{photography_style},
{technical_quality}""",
            parameters={
                "product_type": {
                    "type": "text",
                    "examples": ["Premium wireless earbuds", "Minimalist ceramic vase", "High-end mechanical keyboard"],
                    "default": "product"
                },
                "material_finish": {
                    "type": "select",
                    "options": [
                        "matte white finish with chrome accents",
                        "glossy ceramic with gold rim",
                        "brushed aluminum texture",
                        "transparent glass with subtle tint"
                    ],
                    "default": "premium finish"
                },
                "color": {
                    "type": "text",
                    "examples": ["midnight blue", "ivory white", "rose gold", "matte black"],
                    "default": "elegant color"
                },
                "floating_or_placed": {
                    "type": "select",
                    "options": ["floating in mid-air", "placed on marble surface", "resting on wooden table"],
                    "default": "floating in mid-air"
                },
                "angle_view": {
                    "type": "select",
                    "options": ["45-degree angle view", "front view", "three-quarter view", "top-down view"],
                    "default": "45-degree angle view"
                },
                "background_style": {
                    "type": "select",
                    "options": [
                        "minimalist gradient background from light gray to white",
                        "soft pastel background matching product color",
                        "clean infinity curve studio backdrop"
                    ],
                    "default": "minimalist gradient background"
                },
                "lighting_setup": {
                    "type": "select",
                    "options": [
                        "soft product photography lighting with subtle reflections",
                        "dramatic studio lighting emphasizing contours",
                        "natural window light creating soft shadows"
                    ],
                    "default": "soft product photography lighting"
                },
                "reflection_shadows": {
                    "type": "select",
                    "options": [
                        "subtle reflection on surface below",
                        "soft drop shadow for depth",
                        "realistic caustics and light play"
                    ],
                    "default": "subtle reflection on surface below"
                },
                "photography_style": {
                    "type": "select",
                    "options": [
                        "professional commercial photography",
                        "high-end catalog style",
                        "editorial product photography"
                    ],
                    "default": "professional commercial photography"
                },
                "technical_quality": {
                    "type": "fixed",
                    "value": "8k resolution, macro lens perspective, sharp focus on product details, studio quality"
                }
            },
            examples=[
                "Premium wireless earbuds, matte white finish with chrome accents, floating in mid-air, 45-degree angle view, minimalist gradient background from light gray to white, soft product photography lighting with subtle reflections, subtle reflection on surface below, professional commercial photography, 8k resolution, macro lens perspective, sharp focus on product details, studio quality"
            ],
            tips=[
                "悬浮效果增加高级感",
                "45度角是产品摄影的经典角度",
                "反射和阴影增加真实感",
                "使用 macro lens 强调细节"
            ]
        ),
        
        "infographic": PromptTemplate(
            name="Bento Grid 信息图",
            category="信息可视化",
            base_template="""System: Create a {style} Bento grid infographic with {module_count} modules for {purpose}

Layout: {layout_structure}

Content: {content_details}

Design Specs:
- Style: {visual_style}
- Color Palette: {color_scheme}
- Effects: {effects}

Quality: {technical_requirements}""",
            parameters={
                "style": {
                    "type": "select",
                    "options": ["premium liquid glass", "modern minimal", "glass morphism", "neumorphic"],
                    "default": "premium liquid glass"
                },
                "module_count": {
                    "type": "number",
                    "range": [4, 12],
                    "default": "8"
                },
                "purpose": {
                    "type": "text",
                    "examples": [
                        "personal skills showcase",
                        "product feature highlights",
                        "timeline of achievements"
                    ],
                    "default": "information display"
                },
                "layout_structure": {
                    "type": "text",
                    "examples": [
                        "3x3 grid with center hero module merged",
                        "asymmetric grid with one large hero and surrounding small cards"
                    ],
                    "default": "responsive grid layout"
                },
                "content_details": {
                    "type": "text",
                    "examples": [
                        "Hero: Name and title. Cards 2-8: Individual skills with icons",
                        "Hero: Product image. Cards 2-8: Feature descriptions"
                    ],
                    "default": "main content with supporting details"
                },
                "visual_style": {
                    "type": "select",
                    "options": [
                        "glass morphism with subtle gradients and transparency",
                        "flat design with bold colors",
                        "isometric 3D elements"
                    ],
                    "default": "glass morphism with subtle gradients"
                },
                "color_scheme": {
                    "type": "text",
                    "examples": [
                        "Deep navy #1e3a5f, Soft teal #4ecdc4, Coral accent #ff6b6b",
                        "Monochrome with electric blue accent",
                        "Warm earth tones with gold highlights"
                    ],
                    "default": "professional color palette"
                },
                "effects": {
                    "type": "fixed",
                    "value": "soft shadows (8px blur), rounded corners (16px radius), subtle glow effects"
                },
                "technical_requirements": {
                    "type": "fixed",
                    "value": "4k resolution, professional infographic design, clean typography, balanced composition"
                }
            },
            examples=[
                "System: Create a premium liquid glass Bento grid infographic with 8 modules for personal skills showcase\n\nLayout: 3x3 grid with center hero module merged\n\nContent: Hero: Name and title. Cards 2-8: Individual skills with icons and proficiency levels\n\nDesign Specs:\n- Style: glass morphism with subtle gradients\n- Color Palette: Deep navy #1e3a5f, Soft teal #4ecdc4, Coral accent #ff6b6b\n- Effects: soft shadows (8px blur), rounded corners (16px radius), subtle glow effects\n\nQuality: 4k resolution, professional infographic design, clean typography, balanced composition"
            ],
            tips=[
                "使用 System: 开头明确指令",
                "指定颜色十六进制代码确保准确性",
                "玻璃拟态效果提升现代感",
                "Bento Grid 适合展示多个相关内容"
            ]
        ),
        
        "social_post": PromptTemplate(
            name="社交媒体帖子",
            category="社交媒体",
            base_template="""{platform} post design, {aspect_ratio},
{visual_concept},
{text_overlay},
{style_elements},
{engagement_features},
{technical_specs}""",
            parameters={
                "platform": {
                    "type": "select",
                    "options": ["Instagram", "YouTube thumbnail", "Twitter/X banner", "LinkedIn"],
                    "default": "Instagram"
                },
                "aspect_ratio": {
                    "type": "select",
                    "options": ["1:1 square", "4:5 portrait", "9:16 story", "16:9 landscape"],
                    "default": "1:1 square"
                },
                "visual_concept": {
                    "type": "text",
                    "examples": [
                        "Split screen showing before/after transformation",
                        "Eye-catching flat lay of tools and materials",
                        "Bold typography with dynamic background"
                    ],
                    "default": "engaging visual composition"
                },
                "text_overlay": {
                    "type": "text",
                    "examples": [
                        "Title: '5 Tips for Better Sleep' in bold sans-serif font",
                        "Quote: 'Dream big, work hard' in elegant script"
                    ],
                    "default": "clear headline text"
                },
                "style_elements": {
                    "type": "select",
                    "options": [
                        "high contrast, saturated colors, modern aesthetic",
                        "minimalist, lots of negative space, elegant",
                        "trendy, bold patterns, Gen Z aesthetic"
                    ],
                    "default": "high contrast, saturated colors"
                },
                "engagement_features": {
                    "type": "text",
                    "examples": [
                        "Save button icon in corner, arrow pointing to key element",
                        "Swipe indicator, poll sticker style element"
                    ],
                    "default": "engagement optimized"
                },
                "technical_specs": {
                    "type": "fixed",
                    "value": "readable at small sizes, mobile-optimized, 4k resolution"
                }
            },
            examples=[
                "Instagram post design, 1:1 square, Bold typography 'Learn AI in 30 Days' over gradient background, text in large white font with soft shadow, high contrast, saturated colors with purple to pink gradient, Save icon in top corner with arrow pointing to title, readable at small sizes, mobile-optimized, 4k resolution"
            ],
            tips=[
                "移动端优先 - 确保小尺寸可读",
                "使用高对比度吸引注意力",
                "文字要简洁有力",
                "添加保存/分享引导元素"
            ]
        ),
        
        "game_character": PromptTemplate(
            name="游戏角色设计",
            category="游戏开发",
            base_template="""Game character concept art: {character_type},
Name: \"{character_name}\",

Appearance:
- Age: {age}, Gender: {gender}
{physical_features}

Outfit:
{clothing_description}

Pose: {pose_expression}
Background: {background}
Style: {art_style}
Technical: {technical_specs}""",
            parameters={
                "character_type": {
                    "type": "text",
                    "examples": ["Fantasy mage", "Cyberpunk hacker", "Medieval knight", "Sci-fi explorer"],
                    "default": "game character"
                },
                "character_name": {
                    "type": "text",
                    "examples": ["Lyra the Star Weaver", "Kael Shadowblade", "Nova-7"],
                    "default": "Character"
                },
                "age": {
                    "type": "number",
                    "range": [16, 50],
                    "default": "25"
                },
                "gender": {
                    "type": "select",
                    "options": ["Female", "Male", "Non-binary"],
                    "default": "Female"
                },
                "physical_features": {
                    "type": "text",
                    "examples": [
                        "- Hair: Long flowing silver hair with starlight shimmer\n- Face: Sharp features, purple eyes that glow when casting\n- Body: Slim build with ethereal presence",
                        "- Hair: Short spiky hair with neon highlights\n- Face: Sharp jawline, cybernetic eye implant\n- Body: Athletic build with visible muscle definition"
                    ],
                    "default": "distinctive physical features"
                },
                "clothing_description": {
                    "type": "text",
                    "examples": [
                        "- Style: Flowing celestial robes with constellation patterns\n- Colors: Deep purple, midnight blue, gold accents\n- Accessories: Star-shaped staff, floating crystal orb",
                        "- Style: Tactical cyberpunk gear with holographic displays\n- Colors: Black with neon green accents\n- Accessories: Holographic wrist device, utility belt"
                    ],
                    "default": "thematic outfit matching character concept"
                },
                "pose_expression": {
                    "type": "select",
                    "options": [
                        "Dynamic action pose, confident expression",
                        "Neutral standing pose, mysterious expression",
                        "Ready for battle stance, determined look"
                    ],
                    "default": "Dynamic action pose, confident expression"
                },
                "background": {
                    "type": "select",
                    "options": [
                        "Clean white for game asset extraction",
                        "Thematic environment matching character lore",
                        "Subtle gradient that doesn't distract from character"
                    ],
                    "default": "Clean white for game asset extraction"
                },
                "art_style": {
                    "type": "select",
                    "options": [
                        "Stylized 3D render, League of Legends aesthetic",
                        "Anime-inspired 2D art, Genshin Impact style",
                        "Semi-realistic concept art, AAA game quality"
                    ],
                    "default": "Stylized 3D render, League of Legends aesthetic"
                },
                "technical_specs": {
                    "type": "fixed",
                    "value": "Character turnaround sheet (front, side, back views), 4k resolution, game-ready quality, clean lineart"
                }
            },
            examples=[
                "Game character concept art: Fantasy mage, Name: \"Lyra the Star Weaver\",\n\nAppearance:\n- Age: 25, Gender: Female\n- Hair: Long flowing silver hair with starlight shimmer\n- Face: Sharp features, purple eyes that glow when casting\n\nOutfit:\n- Style: Flowing celestial robes with constellation patterns\n- Colors: Deep purple, midnight blue, gold accents\n- Accessories: Star-shaped staff, floating crystal orb\n\nPose: Dynamic casting pose, magical energy surrounding hands\nBackground: Clean white for game asset extraction\nStyle: Stylized 3D render, League of Legends aesthetic\nTechnical: Character turnaround sheet (front, side, back views), 4k resolution, game-ready quality"
            ],
            tips=[
                "使用角色转换表展示多角度",
                "详细描述服装和配饰增加特色",
                "白色背景方便游戏素材提取",
                "参考 AAA 游戏艺术风格"
            ]
        )
    }
    
    @classmethod
    def get_template(cls, name: str) -> Optional[PromptTemplate]:
        return cls.TEMPLATES.get(name)
    
    @classmethod
    def list_categories(cls) -> List[str]:
        return list(cls.TEMPLATES.keys())
    
    @classmethod
    def get_category_info(cls) -> Dict[str, str]:
        return {k: f"{v.name} ({v.category})" for k, v in cls.TEMPLATES.items()}


class PromptGenerator:
    """提示词生成器主类"""
    
    def __init__(self):
        self.library = PromptLibrary()
        self.history = []
    
    def interactive_mode(self):
        """交互式生成模式"""
        print("\n" + "=" * 60)
        print("🎨 Nano Banana Pro 提示词生成器")
        print("=" * 60 + "\n")
        
        # 显示可用类别
        print("📋 可用模板类别:")
        for key, info in self.library.get_category_info().items():
            print(f"   {key:12} - {info}")
        
        print("\n" + "-" * 60 + "\n")
        
        # 选择类别
        category = input("请选择类别 (输入名称): ").strip().lower()
        
        if category not in self.library.list_categories():
            print(f"❌ 未知类别: {category}")
            print(f"✅ 可用类别: {', '.join(self.library.list_categories())}")
            return
        
        template = self.library.get_template(category)
        
        print(f"\n📝 模板: {template.name}")
        print(f"📂 分类: {template.category}")
        print("\n💡 提示:")
        for tip in template.tips:
            print(f"   • {tip}")
        print()
        
        # 收集参数
        values = {}
        for param_name, param_config in template.parameters.items():
            value = self._get_parameter_value(param_name, param_config)
            if value:
                values[param_name] = value
        
        # 生成提示词
        prompt = self._generate_prompt(template, values)
        
        # 显示结果
        self._display_result(prompt, template)
        
        # 保存历史
        self._save_to_history(prompt, template.name, values)
    
    def _get_parameter_value(self, param_name: str, config: Dict) -> str:
        """获取单个参数值"""
        param_type = config.get("type", "text")
        
        if param_type == "fixed":
            return config.get("value", "")
        
        print(f"\n📌 {param_name}:")
        
        if param_type == "select":
            options = config.get("options", [])
            default = config.get("default", options[0] if options else "")
            
            print(f"   选项: {', '.join(options)}")
            print(f"   默认: {default}")
            
            value = input(f"   输入值 (直接回车使用默认): ").strip()
            return value if value else default
        
        elif param_type == "number":
            range_info = config.get("range", [0, 100])
            default = config.get("default", str(range_info[0]))
            
            print(f"   范围: {range_info[0]} - {range_info[1]}")
            print(f"   默认: {default}")
            
            value = input(f"   输入值: ").strip()
            return value if value else default
        
        else:  # text
            examples = config.get("examples", [])
            default = config.get("default", "")
            
            if examples:
                print(f"   示例:")
                for i, ex in enumerate(examples[:3], 1):
                    print(f"     {i}. {ex}")
            if default:
                print(f"   默认: {default}")
            
            value = input(f"   输入值: ").strip()
            return value if value else default
    
    def _generate_prompt(self, template: PromptTemplate, values: Dict) -> str:
        """根据模板和参数生成提示词"""
        prompt = template.base_template
        
        for key, value in values.items():
            placeholder = f"{{{key}}}"
            prompt = prompt.replace(placeholder, value)
        
        # 清理未替换的占位符
        import re
        prompt = re.sub(r"\{\w+\}", "", prompt)
        
        # 清理多余空格和空行
        lines = [line.strip() for line in prompt.split("\n") if line.strip()]
        prompt = "\n".join(lines)
        
        return prompt
    
    def _display_result(self, prompt: str, template: PromptTemplate):
        """显示生成结果"""
        print("\n" + "=" * 60)
        print("✨ 生成的提示词:")
        print("=" * 60)
        print()
        print(prompt)
        print()
        print("=" * 60)
        print(f"📊 字数统计: {len(prompt)} 字符")
        print("=" * 60)
        
        # 保存选项
        save = input("\n💾 是否保存到文件? (y/n): ").strip().lower()
        if save == 'y':
            filename = input("文件名 (默认: prompt.txt): ").strip()
            if not filename:
                filename = "prompt.txt"
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(f"# {template.name}\n")
                f.write(f"# 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write("-" * 60 + "\n\n")
                f.write(prompt)
            
            print(f"✅ 已保存到: {filename}")
    
    def _save_to_history(self, prompt: str, template_name: str, values: Dict):
        """保存到历史记录"""
        self.history.append({
            "timestamp": datetime.now().isoformat(),
            "template": template_name,
            "prompt": prompt,
            "parameters": values
        })
    
    def batch_generate(self, category: str, count: int = 3):
        """批量生成变体"""
        template = self.library.get_template(category)
        if not template:
            print(f"❌ 未知类别: {category}")
            return
        
        print(f"\n🔄 批量生成 {count} 个变体 - {template.name}\n")
        
        for i in range(count):
            print(f"\n{'─' * 60}")
            print(f"🎲 变体 {i + 1}/{count}")
            print('─' * 60)
            
            # 随机选择可选参数
            values = {}
            for param_name, param_config in template.parameters.items():
                param_type = param_config.get("type", "text")
                
                if param_type == "fixed":
                    values[param_name] = param_config.get("value", "")
                elif param_type == "select":
                    options = param_config.get("options", [])
                    values[param_name] = random.choice(options) if options else ""
                elif param_type == "number":
                    range_info = param_config.get("range", [0, 100])
                    values[param_name] = str(random.randint(range_info[0], range_info[1]))
                else:
                    examples = param_config.get("examples", [])
                    if examples:
                        values[param_name] = random.choice(examples)
                    else:
                        values[param_name] = param_config.get("default", "")
            
            prompt = self._generate_prompt(template, values)
            print(prompt)
            
            self._save_to_history(prompt, template.name, values)
        
        # 保存批量结果
        save = input("\n💾 是否保存所有变体? (y/n): ").strip().lower()
        if save == 'y':
            filename = f"batch_{category}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
            
            with open(filename, 'w', encoding='utf-8') as f:
                for i, item in enumerate(self.history[-count:], 1):
                    f.write(f"\n{'=' * 60}\n")
                    f.write(f"变体 {i}\n")
                    f.write('=' * 60 + "\n\n")
                    f.write(item["prompt"] + "\n")
            
            print(f"✅ 已保存到: {filename}")
    
    def show_history(self):
        """显示生成历史"""
        if not self.history:
            print("📭 暂无历史记录")
            return
        
        print(f"\n📚 生成历史 ({len(self.history)} 条):")
        print("-" * 60)
        
        for i, item in enumerate(self.history[-10:], 1):  # 显示最近 10 条
            print(f"\n{i}. {item['template']}")
            print(f"   时间: {item['timestamp'][:19]}")
            print(f"   预览: {item['prompt'][:80]}...")


def main():
    parser = argparse.ArgumentParser(
        description="Nano Banana Pro 提示词生成器",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  python prompt_generator.py                    # 交互模式
  python prompt_generator.py --category avatar  # 生成头像提示词
  python prompt_generator.py --batch 5          # 批量生成 5 个变体
  python prompt_generator.py --history          # 查看历史记录
        """
    )
    
    parser.add_argument(
        "--category", "-c",
        choices=PromptLibrary.list_categories(),
        help="直接指定生成类别"
    )
    
    parser.add_argument(
        "--batch", "-b",
        type=int,
        metavar="N",
        help="批量生成 N 个变体"
    )
    
    parser.add_argument(
        "--history", "-H",
        action="store_true",
        help="显示生成历史"
    )
    
    parser.add_argument(
        "--list", "-l",
        action="store_true",
        help="列出所有可用类别"
    )
    
    args = parser.parse_args()
    
    generator = PromptGenerator()
    
    if args.list:
        print("\n📋 可用模板类别:")
        for key, info in PromptLibrary.get_category_info().items():
            print(f"   {key:12} - {info}")
        print()
    
    elif args.history:
        generator.show_history()
    
    elif args.category and args.batch:
        generator.batch_generate(args.category, args.batch)
    
    elif args.category:
        # 直接生成指定类别
        template = PromptLibrary.get_template(args.category)
        if template:
            print(f"\n📝 模板: {template.name}")
            print("\n💡 示例提示词:")
            print("-" * 60)
            for example in template.examples:
                print(example)
                print()
        else:
            print(f"❌ 未知类别: {args.category}")
    
    else:
        # 交互模式
        generator.interactive_mode()


if __name__ == "__main__":
    main()
