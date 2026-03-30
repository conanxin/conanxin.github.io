#!/usr/bin/env python3
"""
Prompt Generator 使用示例
展示如何程序化使用提示词生成器
"""

from prompt_generator import PromptLibrary, PromptGenerator, PromptTemplate

def example_1_direct_generation():
    """示例 1: 直接生成指定类别的提示词"""
    print("=" * 60)
    print("示例 1: 直接生成头像提示词")
    print("=" * 60)
    
    library = PromptLibrary()
    template = library.get_template("avatar")
    
    # 手动填充参数
    values = {
        "style": "Professional",
        "age": "28",
        "gender": "female",
        "profession": "software engineer",
        "appearance": "long black hair with bangs, fair skin, subtle makeup",
        "expression": "confident",
        "outfit": "navy blazer over white shirt",
        "background": "clean light gray background",
        "photography_style": "corporate photography style",
        "lighting": "soft studio lighting with rim light",
        "technical_specs": "8k resolution, sharp focus on eyes, shallow depth of field, high-end retouching",
        "mood": "confident and approachable vibe"
    }
    
    # 生成提示词
    generator = PromptGenerator()
    prompt = generator._generate_prompt(template, values)
    
    print("\n生成的提示词:\n")
    print(prompt)
    print("\n" + "=" * 60)


def example_2_batch_generation():
    """示例 2: 批量生成变体（不交互）"""
    print("\n" + "=" * 60)
    print("示例 2: 批量生成 3 个产品提示词变体")
    print("=" * 60)
    
    import random
    
    library = PromptLibrary()
    template = library.get_template("product")
    
    # 预定义一些选项
    products = [
        ("Premium wireless earbuds", "matte white finish with chrome accents"),
        ("Minimalist smartwatch", "brushed titanium with sapphire glass"),
        ("Artisan ceramic vase", "hand-glazed with blue gradient")
    ]
    
    backgrounds = [
        "minimalist gradient background from light gray to white",
        "soft pastel background matching product color",
        "clean infinity curve studio backdrop"
    ]
    
    for i in range(3):
        print(f"\n{'─' * 60}")
        print(f"变体 {i + 1}")
        print('─' * 60)
        
        product, finish = products[i]
        
        values = {
            "product_type": product,
            "material_finish": finish,
            "color": "elegant neutral tones",
            "floating_or_placed": "floating in mid-air",
            "angle_view": "45-degree angle view",
            "background_style": backgrounds[i],
            "lighting_setup": "soft product photography lighting with subtle reflections",
            "reflection_shadows": "subtle reflection on surface below",
            "photography_style": "professional commercial photography",
            "technical_quality": "8k resolution, macro lens perspective, sharp focus on product details, studio quality"
        }
        
        generator = PromptGenerator()
        prompt = generator._generate_prompt(template, values)
        print(prompt)


def example_3_custom_template():
    """示例 3: 展示如何创建自定义模板"""
    print("\n" + "=" * 60)
    print("示例 3: 自定义模板 - 书籍封面设计")
    print("=" * 60)
    
    custom_template = PromptTemplate(
        name="书籍封面设计",
        category="出版设计",
        base_template="""Book cover design for {genre} novel titled \"{title}\",
{visual_concept},
Color palette: {color_scheme},
Typography: {typography_style},
Mood: {mood_atmosphere},
{technical_specs}""",
        parameters={
            "genre": {
                "type": "select",
                "options": ["sci-fi", "fantasy", "thriller", "romance", "mystery"],
                "default": "fantasy"
            },
            "title": {
                "type": "text",
                "examples": ["The Last Star", "Shadows of Tomorrow"],
                "default": "Book Title"
            },
            "visual_concept": {
                "type": "text",
                "examples": [
                    "mysterious forest with glowing pathway",
                    "futuristic cityscape with neon lights",
                    "minimalist geometric abstract design"
                ],
                "default": "compelling visual concept"
            },
            "color_scheme": {
                "type": "text",
                "examples": ["deep purples and golds", "cool blues and silvers"],
                "default": "appropriate color scheme"
            },
            "typography_style": {
                "type": "select",
                "options": ["elegant serif", "bold sans-serif", "decorative fantasy"],
                "default": "elegant serif"
            },
            "mood_atmosphere": {
                "type": "text",
                "examples": ["mysterious and intriguing", "epic and adventurous"],
                "default": "engaging atmosphere"
            },
            "technical_specs": {
                "type": "fixed",
                "value": "high resolution, print-ready quality, balanced composition"
            }
        },
        examples=[
            "Book cover design for fantasy novel titled 'The Last Star', mysterious forest with glowing pathway, Color palette: deep purples and golds, Typography: elegant serif, Mood: mysterious and intriguing, high resolution, print-ready quality, balanced composition"
        ],
        tips=[
            "确保标题在缩略图尺寸下可读",
            "配色要符合书籍类型",
            "视觉焦点要突出"
        ]
    )
    
    # 使用自定义模板
    values = {
        "genre": "sci-fi",
        "title": "Neon Horizons",
        "visual_concept": "futuristic cityscape with flying vehicles and holographic ads",
        "color_scheme": "neon blues, purples, and hot pinks against dark background",
        "typography_style": "bold sans-serif",
        "mood_atmosphere": "dystopian yet hopeful",
        "technical_specs": "high resolution, print-ready quality, balanced composition"
    }
    
    generator = PromptGenerator()
    prompt = generator._generate_prompt(custom_template, values)
    
    print("\n生成的书籍封面提示词:\n")
    print(prompt)
    print("\n" + "=" * 60)


def example_4_template_inspection():
    """示例 4: 查看模板详情"""
    print("\n" + "=" * 60)
    print("示例 4: 查看所有可用模板")
    print("=" * 60)
    
    library = PromptLibrary()
    
    for category in library.list_categories():
        template = library.get_template(category)
        print(f"\n📦 {category}")
        print(f"   名称: {template.name}")
        print(f"   分类: {template.category}")
        print(f"   参数数量: {len(template.parameters)}")
        print(f"   示例数量: {len(template.examples)}")
        print("   使用技巧:")
        for tip in template.tips[:2]:  # 只显示前 2 个技巧
            print(f"      • {tip}")


if __name__ == "__main__":
    # 运行所有示例
    example_1_direct_generation()
    example_2_batch_generation()
    example_3_custom_template()
    example_4_template_inspection()
    
    print("\n" + "=" * 60)
    print("所有示例运行完成!")
    print("=" * 60)
    print("\n提示:")
    print("  • 使用 python3 prompt_generator.py 进入交互模式")
    print("  • 使用 python3 prompt_generator.py --help 查看所有选项")
    print("  • 查看 README.md 获取完整文档")
