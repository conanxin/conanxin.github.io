#!/usr/bin/env python3
"""
将 Markdown 文章转换为现有网站风格的 HTML

使用方式:
    python convert_to_website.py
"""

import re
import html
from pathlib import Path
from datetime import datetime


def markdown_to_html(content):
    """简单 Markdown 转 HTML"""
    
    # 处理标题
    content = re.sub(r'^# (.+)$', r'<h1>\1</h1>', content, flags=re.MULTILINE)
    content = re.sub(r'^## (.+)$', r'<h2>\1</h2>', content, flags=re.MULTILINE)
    content = re.sub(r'^### (.+)$', r'<h3>\1</h3>', content, flags=re.MULTILINE)
    content = re.sub(r'^#### (.+)$', r'<h4>\1</h4>', content, flags=re.MULTILINE)
    
    # 处理粗体和斜体
    content = re.sub(r'\*\*\*(.+?)\*\*\*', r'<strong><em>\1</em></strong>', content)
    content = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', content)
    content = re.sub(r'\*(.+?)\*', r'<em>\1</em>', content)
    
    # 处理代码块
    content = re.sub(r'```(\w+)?\n(.+?)```', lambda m: f'<pre><code class="language-{m.group(1) or "text"}">{html.escape(m.group(2))}</code></pre>', content, flags=re.DOTALL)
    
    # 处理行内代码
    content = re.sub(r'`([^`]+)`', r'<code>\1</code>', content)
    
    # 处理链接
    content = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2" target="_blank">\1</a>', content)
    
    # 处理无序列表
    lines = content.split('\n')
    result = []
    in_list = False
    
    for line in lines:
        if line.startswith('- ') or line.startswith('* '):
            if not in_list:
                result.append('<ul>')
                in_list = True
            result.append(f'  <li>{line[2:]}</li>')
        else:
            if in_list:
                result.append('</ul>')
                in_list = False
            result.append(line)
    
    if in_list:
        result.append('</ul>')
    
    content = '\n'.join(result)
    
    # 处理有序列表
    lines = content.split('\n')
    result = []
    in_ol = False
    
    for line in lines:
        match = re.match(r'^(\d+)\. (.+)$', line)
        if match:
            if not in_ol:
                result.append('<ol>')
                in_ol = True
            result.append(f'  <li>{match.group(2)}</li>')
        else:
            if in_ol:
                result.append('</ol>')
                in_ol = False
            result.append(line)
    
    if in_ol:
        result.append('</ol>')
    
    content = '\n'.join(result)
    
    # 处理引用块
    content = re.sub(r'^> (.+)$', r'<blockquote>\1</blockquote>', content, flags=re.MULTILINE)
    
    # 处理水平线
    content = re.sub(r'^---+$', r'<hr>', content, flags=re.MULTILINE)
    
    # 处理段落（简单的空行分割）
    paragraphs = []
    current_para = []
    
    for line in content.split('\n'):
        stripped = line.strip()
        
        # 如果是 HTML 标签行，直接添加
        if stripped.startswith('<') and not stripped.startswith('<code>'):
            if current_para:
                paragraphs.append('<p>' + ' '.join(current_para) + '</p>')
                current_para = []
            paragraphs.append(line)
        elif stripped == '':
            if current_para:
                paragraphs.append('<p>' + ' '.join(current_para) + '</p>')
                current_para = []
        else:
            current_para.append(line)
    
    if current_para:
        paragraphs.append('<p>' + ' '.join(current_para) + '</p>')
    
    content = '\n\n'.join(paragraphs)
    
    return content


def extract_metadata(content):
    """提取文章元数据"""
    metadata = {
        'title': '',
        'date': '',
        'tags': [],
        'type': 'ESSAY',
        'read_time': '5 min'
    }
    
    lines = content.split('\n')
    
    # 尝试提取标题（第一个 H1）
    for line in lines:
        if line.startswith('# '):
            metadata['title'] = line[2:].strip()
            break
    
    # 尝试提取日期
    date_match = re.search(r'\d{4}-\d{2}-\d{2}', content)
    if date_match:
        metadata['date'] = date_match.group()
    
    return metadata


def create_html_template(title, subtitle, date, content_html, read_time='5 min', article_type='ESSAY'):
    """创建终端风格的 HTML 模板"""
    
    # 为内容添加终端风格的 section headers
    lines = content_html.split('\n')
    styled_content = []
    section_count = 0
    
    for line in lines:
        # 为 H2 添加 section header 样式
        if line.startswith('<h2>'):
            section_count += 1
            styled_content.append(f'''
                <div class="section-header">
                    <span class="cmd">$</span>
                    <span class="cmd-text">cat ./section-{section_count}.md</span>
                </div>
            ''')
            styled_content.append(line)
        else:
            styled_content.append(line)
    
    content_html = '\n'.join(styled_content)
    
    html_template = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Xin Conan</title>
    <meta name="description" content="{subtitle}">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="../styles/main.css">
    <link rel="stylesheet" href="../styles/post.css">
    
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>◆</text></svg>">
</head>
<body>
    <div class="terminal-container">
        <!-- Status Bar -->
        <div class="status-bar">
            <div class="status-left">
                <span class="status-dot"></span>
                <span>STATUS // ONLINE</span>
            </div>
            <div class="status-right">
                <span>XIN_CONAN</span>
                <span class="separator">|</span>
                <span>v1.0</span>
                <span class="separator">|</span>
                <span id="datetime">--</span>
            </div>
        </div>

        <!-- Header -->
        <header class="terminal-header">
            <div class="logo">
                <span class="prompt">></span>
                <span class="logo-text">xin-conan</span>
                <span class="cursor">_</span>
            </div>
        </header>

        <!-- Navigation -->
        <nav class="terminal-nav">
            <a href="/" class="nav-item">
                <span class="nav-num">01.</span>
                <span>HOME</span>
            </a>
            <a href="/posts/" class="nav-item active">
                <span class="nav-num">02.</span>
                <span>POSTS</span>
            </a>
            <a href="/about.html" class="nav-item">
                <span class="nav-num">03.</span>
                <span>ABOUT</span>
            </a>
            <a href="/feed.xml" class="nav-item">
                <span class="nav-num">04.</span>
                <span>RSS</span>
            </a>
        </nav>

        <!-- Article -->
        <article class="post-article">
            <header class="post-header">
                <div class="post-meta-header">
                    <span class="meta-date">{date}</span>
                    <span class="separator">//</span>
                    <span class="meta-tag">{article_type}</span>
                    <span class="separator">//</span>
                    <span class="meta-read">{read_time}</span>
                </div>
                <h1 class="post-title">{title}</h1>
                <p class="post-subtitle">{subtitle}</p>
            </header>

            <div class="post-content">
                <div class="section-header">
                    <span class="cmd">$</span>
                    <span class="cmd-text">cat ./article.md</span>
                </div>

                {content_html}
            </div>
        </article>

        <!-- Post Navigation -->
        <nav class="post-nav">
            <a href="/posts/" class="nav-link">
                <span class="nav-label">返回文章列表</span>
                <span class="nav-arrow">←</span>
            </a>
        </nav>

        <!-- Footer -->
        <footer class="terminal-footer">
            <div class="footer-line">
                <span class="prompt">$</span>
                <span class="footer-text">echo "感谢阅读"</span>
            </div>
            <p class="copyright">© 2026 Xin Conan. Built with HTML & CSS.</p>
        </footer>
    </div>

    <script>
        // Update datetime
        function updateTime() {{
            const now = new Date();
            const timeStr = now.toLocaleTimeString('zh-CN', {{
                hour: '2-digit',
                minute: '2-digit'
            }});
            document.getElementById('datetime').textContent = timeStr;
        }}
        updateTime();
        setInterval(updateTime, 60000);
    </script>
</body>
</html>
'''
    
    return html_template


def convert_article(md_file, output_dir, article_type='ESSAY'):
    """转换单个文章"""
    print(f"  转换: {md_file.name}")
    
    # 读取 Markdown
    content = md_file.read_text(encoding='utf-8')
    
    # 提取元数据
    metadata = extract_metadata(content)
    
    if not metadata['title']:
        metadata['title'] = md_file.stem.replace('-', ' ').title()
    
    if not metadata['date']:
        metadata['date'] = datetime.now().strftime('%Y-%m-%d')
    
    # 生成副标题（前200字符）
    subtitle = content[:200].replace('#', '').replace('\n', ' ').strip()
    if len(subtitle) > 150:
        subtitle = subtitle[:150] + '...'
    
    # 转换正文
    content_html = markdown_to_html(content)
    
    # 生成 HTML
    html = create_html_template(
        title=metadata['title'],
        subtitle=subtitle,
        date=metadata['date'],
        content_html=content_html,
        read_time=metadata['read_time'],
        article_type=article_type
    )
    
    # 保存 HTML
    output_file = output_dir / f"{md_file.stem}.html"
    output_file.write_text(html, encoding='utf-8')
    
    return {
        'slug': md_file.stem,
        'title': metadata['title'],
        'date': metadata['date'],
        'type': article_type
    }


def main():
    """主函数"""
    
    # 路径配置
    digital_garden = Path.home() / 'digital-garden'
    website_dir = Path.home() / 'conanxin.github.io'
    output_dir = website_dir / 'src' / 'posts'
    
    print("🚀 开始转换文章...")
    print(f"源目录: {digital_garden}")
    print(f"目标目录: {output_dir}")
    print()
    
    # 收集所有文章
    articles = []
    
    # 转换研究文章
    print("📚 转换研究文章:")
    research_dir = digital_garden / 'research'
    if research_dir.exists():
        for md_file in sorted(research_dir.glob('*.md')):
            if md_file.name != 'README.md':
                try:
                    info = convert_article(md_file, output_dir, 'RESEARCH')
                    articles.append(info)
                except Exception as e:
                    print(f"    错误: {e}")
    
    print()
    
    # 转换思考文章
    print("📝 转换思考文章:")
    articles_dir = digital_garden / 'articles'
    if articles_dir.exists():
        for md_file in sorted(articles_dir.glob('*.md')):
            if md_file.name != 'README.md':
                try:
                    info = convert_article(md_file, output_dir, 'ESSAY')
                    articles.append(info)
                except Exception as e:
                    print(f"    错误: {e}")
    
    print()
    print(f"✅ 转换完成! 共 {len(articles)} 篇文章")
    print()
    
    # 生成文章索引
    print("📋 生成文章索引...")
    generate_index(articles, output_dir)
    
    return articles


def generate_index(articles, output_dir):
    """生成文章列表页面"""
    
    # 按日期排序
    articles.sort(key=lambda x: x['date'], reverse=True)
    
    # 生成文章列表 HTML
    articles_html = []
    for i, article in enumerate(articles, 1):
        articles_html.append(f'''
                <article class="post-item">
                    <div class="post-meta">
                        <span class="post-date">{article['date']}</span>
                        <span class="separator">//</span>
                        <span class="post-tag">{article['type']}</span>
                    </div>
                    <h3 class="post-title">
                        <a href="/posts/{article['slug']}.html">{article['title']}</a>
                    </h3>
                </article>
        ''')
    
    articles_list = '\n'.join(articles_html)
    
    html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文章列表 | Xin Conan</title>
    <meta name="description" content="探索关于本地 AI、终端工具、人机交互的深度文章和思考">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="../styles/main.css">
    <link rel="stylesheet" href="../styles/post.css">
    
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>◆</text></svg>">
</head>
<body>
    <div class="terminal-container">
        <!-- Status Bar -->
        <div class="status-bar">
            <div class="status-left">
                <span class="status-dot"></span>
                <span>STATUS // ONLINE</span>
            </div>
            <div class="status-right">
                <span>XIN_CONAN</span>
                <span class="separator">|</span>
                <span>v1.0</span>
                <span class="separator">|</span>
                <span id="datetime">--</span>
            </div>
        </div>

        <!-- Header -->
        <header class="terminal-header">
            <div class="logo">
                <span class="prompt">></span>
                <span class="logo-text">xin-conan</span>
                <span class="cursor">_</span>
            </div>
        </header>

        <!-- Navigation -->
        <nav class="terminal-nav">
            <a href="/" class="nav-item">
                <span class="nav-num">01.</span>
                <span>HOME</span>
            </a>
            <a href="/posts/" class="nav-item active">
                <span class="nav-num">02.</span>
                <span>POSTS</span>
            </a>
            <a href="/about.html" class="nav-item">
                <span class="nav-num">03.</span>
                <span>ABOUT</span>
            </a>
            <a href="/feed.xml" class="nav-item">
                <span class="nav-num">04.</span>
                <span>RSS</span>
            </a>
        </nav>

        <!-- Content -->
        <main class="posts-list">
            <header class="page-header">
                <div class="section-header">
                    <span class="cmd">$</span>
                    <span class="cmd-text">ls ./posts/</span>
                </div>
                <p class="page-description">共 {len(articles)} 篇文章，关于 AI 研究、技术探索和深度思考</p>
            </header>

            <div class="posts-grid">
                {articles_list}
            </div>
        </main>

        <!-- Footer -->
        <footer class="terminal-footer">
            <div class="footer-line">
                <span class="prompt">$</span>
                <span class="footer-text">echo "感谢访问"</span>
            </div>
            <p class="copyright">© 2026 Xin Conan. Built with HTML & CSS.</p>
        </footer>
    </div>

    <script>
        function updateTime() {{
            const now = new Date();
            const timeStr = now.toLocaleTimeString('zh-CN', {{
                hour: '2-digit',
                minute: '2-digit'
            }});
            document.getElementById('datetime').textContent = timeStr;
        }}
        updateTime();
        setInterval(updateTime, 60000);
    </script>
</body>
</html>
'''
    
    # 保存文章列表页
    index_file = output_dir / 'index.html'
    index_file.write_text(html, encoding='utf-8')
    print(f"  ✅ 文章列表页: {index_file}")


if __name__ == "__main__":
    main()
