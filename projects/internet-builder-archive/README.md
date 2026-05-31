# 旧互联网建设者资料库 / Internet Builder Archive

> 视频、访谈、创业材料与公司内部备忘录的中文化索引

## 项目说明

本项目整理互联网早期建设者的核心资料，包括视频、访谈、创业材料、公司内部备忘录、投资资料、产品史资料等。所有英文内容均翻译为中文，视频/音频附带中文介绍与嵌入播放器。

## 目录结构

```
projects/internet-builder-archive/
  index.html          # 主页面
  styles.css          # 样式表
  app.js              # 交互逻辑（筛选、搜索）
  data/
    items.json        # 条目数据
  docs/
    DATA_SCHEMA.md    # 数据字段说明
    CONTENT_GUIDE.md  # 录入规范
  README.md           # 本文件
```

## 条目分类

- 视频与演讲
- 访谈
- 创业材料
- 公司内部备忘录
- 投资与风投
- 产品与互联网史
- 其他

## 更新方式

1. 用户提供原帖截图或资料列表
2. 按 `docs/CONTENT_GUIDE.md` 规范录入每条资料
3. 更新 `data/items.json`
4. 提交前校验 JSON 格式：`python3 -c "import json; json.load(open('data/items.json'))"`
5. 本地预览后提交

## 发布方式

静态文件由 GitHub Pages 直接托管，`index.html` 为入口。

## 注意

- 当前所有条目均为 **placeholder** 状态，待用户提供真实资料后替换
- 未经确认的链接不得伪造，外链标注为 `[待补链接]`
- 不确定来源时不得臆造

---

## Launch Materials / 发布材料

本项目的对外传播材料存放于 `docs/launch/` 目录：

- [中文发布长文](docs/launch/LAUNCH_POST_ZH.md) — 适合发布在博客、微博、 newsletter 等平台
- [X 帖子串草稿](docs/launch/X_THREAD_ZH.md) — 10 条中文 X 帖子，适合直接发布于 X/Twitter
- [README 展示段落](docs/launch/README_SHOWCASE_BLOCK.md) — 可直接复制到项目 README 的 Markdown block
- [社交分享卡片 SVG](assets/iba-share-card.svg) — 1200×630 社交分享展示卡片，可用于 X/社交平台配图

---

*最后更新：2026-05-31 | 状态：Phase 2F 完成*
