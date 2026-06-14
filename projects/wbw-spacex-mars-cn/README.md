# SpaceX 如何以及为什么要殖民火星 · 中文版

> Wait But Why 长文 [How (and Why) SpaceX Will Colonize Mars](https://waitbutwhy.com/2015/08/how-and-why-spacex-will-colonize-mars.html)（Tim Urban, 2015-08-16）的完整中文版。

## 在线访问

- **本地开发**：在仓库根目录运行 `python3 -m http.server 8080`，访问 http://127.0.0.1:8080/projects/wbw-spacex-mars-cn/
- **生产 URL**：https://conanxin.github.io/projects/wbw-spacex-mars-cn/

## 内容

1. **完整中文翻译**（约 6 万中文字符 / 4.1 万英文词原文）
   - Part 1 · 人类与太空的故事
   - Part 2 · 马斯克的使命
   - Part 3 · 如何殖民火星（Phase 1/2/3）
   - 包含原文所有脚注、图片、链接

2. **背景资料**（`content/background.json`）
   - 文章与作者背景
   - SpaceX 公司与火箭谱系
   - 2015 愿景 vs 2026 现实对照
   - 火星殖民的 10 大技术挑战
   - 地球化改造争议
   - 32 个关键术语（可搜索）
   - 32 个时间线节点（可按类别筛选）
   - 资料与来源

3. **交互模块**（单文件原生 HTML/CSS/JS，无框架）
   - 阅读进度条（顶部）
   - 章节 sticky sidebar + 移动端可折叠
   - "为什么去火星？" 5 卡片可展开
   - "如何去火星？" 三阶段路线图
   - "火箭复用" 成本曲线 SVG
   - "单星球 → 多星球" 文明备份图
   - "2015 愿景 vs 2026 现实" 对照表
   - 关键术语实时搜索
   - 时间线多类别筛选
   - 资料与来源区
   - 阅读模式：沉浸 / 注释 / 紧凑
   - 主题切换：🌌 深空暗色 / 🪐 火星沙色
   - 全文搜索（Ctrl/Cmd+K）
   - 返回顶部按钮

## 文件结构

```
wbw-spacex-mars-cn/
├── index.html              # 主页
├── styles.css              # 样式（双主题 + 三阅读模式）
├── app.js                  # 渲染 + 交互逻辑
├── content/
│   ├── translation.zh.md          # 完整中文译文（130KB）
│   ├── translation-part2.md       # Part 2 分片
│   ├── translation-part3-phase1.md
│   ├── translation-part3-phase2.md
│   ├── translation-part3-phase3.md
│   ├── translation.sections.json  # 章节结构化索引
│   └── background.json           # 2015 vs 2026 背景
├── source/original/        # 原文抓取材料
│   ├── page-1.html ~ page-5.html
│   ├── original.full.md
│   ├── original.meta.json
│   ├── image_url_map.json
│   └── chunks/             # 切分后的英文 chunks
├── assets/images/original/ # 143 张原文图片
├── work/translation/       # 翻译工作目录
├── README.md
└── REPORT.md
```

## 数据来源

- **原文**：Wait But Why 官方（已抓取 5 个分页 HTML + Markdown）
- **图片**：原文 143 张图全部下载到 `assets/images/original/`
- **2015-2026 进展**：综合 SpaceX 官方更新、维基百科、NASA 公告、Starlink 状态

## 版权

- 原文版权归 Tim Urban / Wait But Why
- 本翻译为学术/粉丝用途，**请勿商用**
- 中文译文可能与原文有细微差异，建议对照原文阅读

## 部署

通过 `conanxin/conanxin.github.io` 仓库的 GitHub Pages 自动部署。本目录在仓库中的路径为 `projects/wbw-spacex-mars-cn/`，因此线上 URL 为 `https://conanxin.github.io/projects/wbw-spacex-mars-cn/`。

## 验证

```bash
# JSON 合法性
python3 -m json.tool content/background.json >/dev/null
python3 -m json.tool content/translation.sections.json >/dev/null

# 本地服务器
cd /home/ubuntu/conanxin.github.io
python3 -m http.server 8080
# 访问 http://127.0.0.1:8080/projects/wbw-spacex-mars-cn/
```

详细验证结果见 `REPORT.md`。
