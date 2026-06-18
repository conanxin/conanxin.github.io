# 《Calvin and Hobbes》与完整性的代价

> Bill Watterson 的创作伦理、拒绝商品化与 1990 年 Kenyon 演讲

## 页面主题

本页面是一个中文专题阅读页，把两篇与 Bill Watterson 相关的核心文本放在一起完整呈现：

1. Matthew Morgan 写于 2026 年的长文《Calvin and Hobbes and the Price of Integrity》全文中文译本。
2. Bill Watterson 1990 年 5 月 20 日在 Kenyon College 毕业演讲《Some Thoughts on the Real World by One Who Glimpsed It and Fled》全文中文译本。

页面同时附上导读、时间线、主题分析、背景资料与参考资料链接，让不熟悉《Calvin and Hobbes》的中文读者也能读懂"完整性"在 Watterson 身上究竟意味着什么、代价又是什么。

## 公开 URL

```
https://conanxin.github.io/projects/calvin-hobbes-integrity-cn/
```

## 内容结构

| 区域 | 内容 |
| --- | --- |
| Hero | 标题、副标题、装饰漫画格子、两条译文入口 |
| 一、为什么这两篇文本要一起读 | 导读：1990 演讲 + 2026 文章的对称结构 |
| 二、时间线 | 1978 天花板 → 1985 开始连载 → 1990 演讲 → 1991/1994 长假 → 1995 停刊 → 2023《The Mysteries》 |
| 三、主题导读 | 完整性、商品化、玩耍、职业、退出 |
| 四、文章译文 | Matthew Morgan 全文中文译本（按 I–Ⅶ 七个章节呈现） |
| 五、演讲译文 | Watterson 1990 演讲全文中文译本 |
| 六、背景资料 | 8 个可折叠主题块（连载、创作观、反商品化、syndicate、Hobbes 暧昧性、演讲-停刊关系、1995 停刊、退隐与 The Mysteries） |
| 七、参考资料 | 原文链接、参考演讲源、关键书目 |

## 设计取向

- 静态 HTML + CSS + JS，零框架、零外部依赖。
- 纸张底色 + 手绘墨线 + 报纸分栏 + 大量留白。
- 所有装饰元素（漫画格子、雪堆、纸箱、树、星星、树枝、小脚印）均由 CSS / 内联元素绘制，不引用任何官方漫画图像或角色形象。
- 移动端响应式：导航横排自动换行、纸面卡片自动收紧、长文左对齐。
- 折叠区使用 `<details>` + 原生 JS，sessionStorage 保存展开状态。

## 本地维护方式

```bash
# 仓库根目录
cd /home/conanxin/conanxin.github.io

# 仅该项目
cd projects/calvin-hobbes-integrity-cn

# 文件清单
ls
# index.html  styles.css  script.js  README.md  sources.md

# 本地预览（任意端口）
cd /home/conanxin/conanxin.github.io
python3 -m http.server 8899
# 浏览器打开
# http://127.0.0.1:8899/projects/calvin-hobbes-integrity-cn/
```

修改建议：

- **改译文**：直接编辑 `index.html` 对应区块；保持原文段落顺序与小标题（Ⅰ、Ⅱ、Ⅲ……）。
- **加背景资料**：在 `#background` 区域追加新的 `<details class="bg-block">` 块，保持 CSS 类名一致即可继承折叠样式。
- **改样式**：所有装饰元素集中在 `styles.css` 中以注释分区，便于继续按"纸张 / 手绘 / 分栏 / 留白"四条线扩展。
- **不要**引入 jQuery、Vue、React 等外部框架；本页面刻意保持纯静态。
- **不要**使用任何官方漫画角色图像或品牌字体——避免版权风险。
- **不要**修改首页（`/`）或仓库内其他 `projects/` 子目录。

## 部署

```bash
cd /home/conanxin/conanxin.github.io

# 仅添加本项目文件
git add projects/calvin-hobbes-integrity-cn/index.html
git add projects/calvin-hobbes-integrity-cn/styles.css
git add projects/calvin-hobbes-integrity-cn/script.js
git add projects/calvin-hobbes-integrity-cn/README.md
git add projects/calvin-hobbes-integrity-cn/sources.md

git commit -m "Add Calvin and Hobbes integrity Chinese project page"
git push origin main
```

## 版权与转载

- 两篇译文均为整理者 Xin Conan 基于公开原文完成的完整中文译本，仅供个人学习与中文阅读推广。
- 文章原文版权归 Matthew Morgan / The Republic of Letters 所有。
- 演讲文本版权属于 Bill Watterson。
- 任何转载、改编或公开分发，请保留原作者署名及原文链接。