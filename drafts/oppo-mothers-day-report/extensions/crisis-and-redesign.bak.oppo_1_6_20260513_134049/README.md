> ⚠️ **非索引审稿附录** · 研究型模拟方案 · 不是 OPPO 官方方案 · 不可直接公开发布 · 请勿用于骚扰、开盒、人肉或扩散个人信息

# OPPO 母亲节传播事件扩展包

**目录：** extensions/oppo_1_3_crisis_and_redesign/
**生成时间：** 2026-05-13
**研究性质：** 学术研究型模拟方案
**与主页面关系：** OPPO 母亲节文案事件研究页面的扩展研究材料，不修改主页面

---

## 一、本扩展包是什么

本扩展包包含两个独立的研究任务：

1. **任务 A：危机回应方案**（crisis_response/）
2. **任务 B：原活动重设计方案**（campaign_redesign/ + poster_mockups/）

所有内容均为**研究型模拟**，用于分析原事件中的传播问题，并提供假设性的优化方案。**不构成任何法律或商业建议，不代表 OPPO 官方立场。**

---

## 二、与主页面关系

- **不修改** index.html、style.css、data/*.json 等主页面文件
- **不发布** 到 GitHub Pages
- **不 git commit** 到任何仓库
- 作为独立的扩展研究材料存放在 extensions/ 目录

---

## 三、任务 A：危机回应方案

路径：crisis_response/

包含文件：
- **crisis_response_strategy.md** — 完整危机回应策略（原则、时间线、利益相关方矩阵、错误回应对照）
- **better_public_apology_draft.md** — 更优公开道歉声明草稿（约950字）
- **pinned_social_response.md** — 社交平台置顶短回应（约420字）
- **media_qa.md** — 媒体 Q&A（12个标准问题及回答）
- **internal_memo_employee_protection.md** — 内部员工保护备忘录
- **anti_doxxing_boundary_statement.md** — 反开盒/反网暴边界声明
- **crisis_response_checklist.json** — 危机应对行动清单（按阶段组织，5阶段×多行动）

---

## 四、任务 B：原活动重设计方案

路径：campaign_redesign/ + poster_mockups/

包含文件：
- **campaign_redesign_strategy.md** — 重设计策略（8个主题候选，推荐1个）
- **campaign_copy_system.md** — 完整文案系统（主Slogan/长文案/短文案/海报文案/社交文案/视频脚本/禁止词清单）
- **poster_concepts.md** — 5张海报概念（每张含设计目标/视觉/文案/风险避让）
- **campaign_risk_review.md** — 活动风险审核表（11项风险，全部🟢低风险）
- **revised_campaign_board.md** — 活动提案板（策略/受众/内容结构/传播路径/风控）

---

## 五、海报 mockup（5张原创 SVG）

路径：poster_mockups/

| 文件 | 主题 | 场景 |
|------|------|------|
| poster_01_concert_mom.svg | 演唱会前的妈妈 | 音乐 · 期待 |
| poster_02_running_mom.svg | 清晨跑步的妈妈 | 运动 · 清晨 |
| poster_03_writing_mom.svg | 深夜写作的妈妈 | 写作 · 夜深 |
| poster_04_travel_photo_mom.svg | 旅行摄影的妈妈 | 旅行 · 记录 |
| poster_05_friends_mom.svg | 朋友聚会中的妈妈 | 友情 · 笑声 |

视觉特点：
- 原创 SVG 矢量图（1080×1440 viewBox）
- 抽象人物剪影 + 生活场景
- 不使用真实照片、真实明星、OPPO logo
- 无外部 CDN、无外部字体、无外部图片
- 每张包含主文案 + 副文案 + 底部免责声明

---

## 六、本地预览海报展示页

打开方式（任选一）：

**方式1：直接打开 HTML 文件**
```bash
cd ~/projects/oppo-mothers-day-report-page/extensions/oppo_1_3_crisis_and_redesign/
open poster_gallery.html
# 或
xdg-open poster_gallery.html
```

**方式2：本地 HTTP 服务器**
```bash
cd ~/projects/oppo-mothers-day-report-page/extensions/oppo_1_3_crisis_and_redesign/
python3 -m http.server 8080
# 浏览器打开：http://localhost:8080/poster_gallery.html
```

**方式3：移动端预览**
将设备连接到同一网络，使用 `ifconfig` 查看本机 IP，然后访问：
`http://<本机IP>:8080/poster_gallery.html`

---

## 七、重要边界

- ⚠️ 所有内容为**研究型模拟**，不是 OPPO 官方发布物
- ⚠️ 不可直接用于商业发布或对外传播
- ⚠️ 不含个人隐私信息（无手机号/住址/私人账号/照片路径）
- ⚠️ 不含 OPPO 官方 logo 或真实广告原图
- ⚠️ 不使用真实明星、真实粉丝、真实个人照片
- ⚠️ 海报中所有人物均为原创抽象 SVG 矢量图形

---

## 八、文件清单

```
extensions/oppo_1_3_crisis_and_redesign/
├── README.md                              # 本文件
├── REPORT.md                              # 阶段报告
├── crisis_response/
│   ├── crisis_response_strategy.md       # 危机回应策略
│   ├── better_public_apology_draft.md    # 更优道歉声明
│   ├── pinned_social_response.md         # 社交置顶回应
│   ├── media_qa.md                       # 媒体Q&A
│   ├── internal_memo_employee_protection.md  # 员工保护备忘录
│   ├── anti_doxxing_boundary_statement.md # 反开盒声明
│   └── crisis_response_checklist.json     # 行动清单
├── campaign_redesign/
│   ├── campaign_redesign_strategy.md     # 重设计策略
│   ├── campaign_copy_system.md            # 文案系统
│   ├── poster_concepts.md                 # 海报概念
│   ├── campaign_risk_review.md            # 风险审核表
│   └── revised_campaign_board.md           # 提案板
├── poster_mockups/
│   ├── poster_01_concert_mom.svg         # 海报1
│   ├── poster_02_running_mom.svg         # 海报2
│   ├── poster_03_writing_mom.svg         # 海报3
│   ├── poster_04_travel_photo_mom.svg   # 海报4
│   └── poster_05_friends_mom.svg         # 海报5
├── poster_gallery.html                    # 海报展示页
└── poster_gallery.css                     # 展示页样式
```

---

*本扩展包由辛 🔮 生成（云端 OpenClaw），用于 OPPO 母亲节文案事件研究项目的学术研究模拟。*
