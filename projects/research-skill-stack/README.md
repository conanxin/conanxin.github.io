# Research Skill Stack · 如何成为优秀的研究者

> 一个把 @itsreallyvivek 2026-06-10 的英文帖《how to be good at research》完整翻译为中文，
> 加上研究能力栈地图、11 张资料卡、实验日志模板、错误桶示例、7 天训练计划、Personal Takeaways
> 的中文交互式页面。

## 在线访问
https://conanxin.github.io/projects/research-skill-stack/

## 文件结构
```
research-skill-stack/
├── index.html         # 页面
├── styles.css         # 样式 (research notebook + dark lab accent)
├── app.js             # 交互 (TOC/进度/折叠/复制/勾选/主题)
├── assets/            # favicon 等
├── content/           # 源数据
│   ├── translation.zh.md    # 8 章节完整中文翻译
│   ├── background.json      # 11 张资料卡
│   ├── components.json      # 7 个交互组件数据
│   └── _sections.json       # 解析后的 8 章节 HTML
├── reports/           # 阶段报告
│   └── REPORT_20260615.md
├── 00_plan.md         # 计划
└── README.md
```

## 设计理由
- 页面不是“长文”，而是一个 8 层能力栈地图（颜色编码）+ 7 个交互组件。
- 引用核查：所有人物/作品都标 verified / need-verify / secondary / unverified-anecdote。
- 无外部 CDN / 无构建工具：双击 index.html 即可打开。
- 主题：明 = research notebook（米黄 + 衬线 + 红色高亮），暗 = dark lab（深色 + 强调琥珀）。
