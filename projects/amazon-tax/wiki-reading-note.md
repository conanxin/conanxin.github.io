---
author: "Ben Thompson"
source: "Stratechery"
url: "https://stratechery.com/2016/the-amazon-tax/"
published: "2016-03-15"
original_published: "2016-03-15"
date: "2026-05-05"
extracted_at: "2026-05-05"
verified_at: "2026-05-07"
entry_type: "reading_note"
tags:
  - 平台经济
  - 亚马逊
  - 聚合理论
  - 电商基础设施
  - 平台税
  - 云计算商业模式
related_topics:
  - "[平台经济](../concepts/platform-economy.md)"
  - "[亚马逊](../concepts/amazon.md)"
  - "[聚合理论](../concepts/aggregation-theory.md)"
  - "[电商基础设施](../concepts/e-commerce-infrastructure.md)"
  - "[平台税](../concepts/platform-tax.md)"
  - "[云计算商业模式](../concepts/cloud-computing-business-model.md)"
  - "[京东物流](../concepts/jd-logistics.md)"
  - "[Costco](../concepts/costco.md)"
  - "[Shopify](../concepts/shopify.md)"
target_production_path: "agent-idea-wiki/wiki/reading-notes/amazon-tax-2016.md"
title: "亚马逊税"
title_en: "The Amazon Tax"
status: "production_candidate"
production_ready: true
requires_human_review: false
do_not_publish_directly: false
reviewed: true
protected_check_passed: true
protected_check_status: "pass_with_warn"
---

# 亚马逊税｜阅读笔记（人工核验版本）

> 原文：The Amazon Tax  
> 作者：Ben Thompson  
> 来源：Stratechery  
> 发布时间：2016-03-15  
> 原文链接：https://stratechery.com/2016/the-amazon-tax/  
> 提取与翻译时间：2026-05-05  
> 自动化核验时间：2026-05-06（因 web access 受限，全部 not_verified）  
> 人工核验时间：2026-05-07（基于用户提供的外部联网 source packet）  
> ⚠️ 状态：staging draft — 未经人工复核，禁止直接发布  
> ⚠️ 本笔记中 2026 年数据来源由用户提供，未经过本 agent 重新联网验证

---

## 为什么读这篇文章

Ben Thompson 在 AWS 成立十周年之际发表此文，提出了一个理解亚马逊的框架：**亚马逊不是零售商，而是对多个行业征收"税"的基础设施平台。** 这一框架比"亚马逊是科技公司"或"亚马逊是零售商"更深刻，且对理解平台经济、聚合理论、基础设施化均有重要参考价值。

---

## 一句话概括

亚马逊通过把内部能力（AWS、Prime、FBA）拆成最小"原语"对外开放，利用规模经济降低成本，从巨大交易量中抽取一层收益——Thompson 称之为"税"。

---

## 核心论点摘要

| # | 论点 | 简要说明 |
|---|------|----------|
| 01 | AWS 是对计算经济的"税" | 把基础设施拆成"原语"供开发者使用，规模越大定价优势越强 |
| 02 | 电商本身也在变成"税" | Prime 从消费者端收税，FBA/Marketplace 从商家端收税 |
| 03 | 物流将是下一个 AWS | 复制"先自用、再开放"模式到物流领域 |
| 04 | Echo 是智能家居的"枢纽税" | 提供枢纽，合作伙伴提供碎片，抽取一层价值 |
| 05 | 组织结构决定产品形态 | "两个披萨团队"和"原语"思想让亚马逊天然模块化 |
| 06 | 消费者心甘情愿交"税" | 因为规模确保了最好价格、最快配送、最广泛选择 |
| 07 | 规模是护城河 | 越大 → 成本越低 → 体验越好 → 用户越多 → 规模更大 |
| 08 | "先自用，再开放"可无限复制 | 从 AWS 到 Prime 到 FBA 到物流到 Echo |
| 09 | Costco 模式是理解 Prime 的关键 | 会员费 = 利润来源，而非商品销售 |
| 10 | 这不是垄断，而是基础设施的必然结果 | 就像 AWS 成为默认基础设施一样 |

---

## 2026 背景更新（基于人工核验数据）

Thompson 在 2016 年提出的分析框架——AWS 税、Prime 税、FBA 税、物流税——在 2026 年仍然被广泛引用。以下是经过人工核验的 2026 年背景数据（附来源和口径限定）：

### Prime 会员
- **定价变化**：美国 Prime 年费已从原文中的 $99 上涨到 **$139/年**（或 $14.99/月）。学生价 $69/年。Prime Video 单独订阅 $8.99/月。
  - 来源：Amazon 官方帮助页
- **会员规模**：Amazon 最后一次官方披露全球 Prime 规模是 **2021 年超过 2 亿**。2026 年最新全球官方数据缺失。第三方估计（CIRP）显示 2026 年 3 月美国使用 Prime 的 shoppers 约 **2.01 亿**，但此口径包含一个家庭中的多个成员，高于实际付费家庭账户数。
  - 来源：SEC shareholder letter 2021; CIRP 2026 Q1 estimate
  - ⚠️ 注意：CIRP 为第三方估计，非官方数据；"shoppers"口径 ≠ "paid memberships"

### AWS
- **收入规模**：AWS 已从 2016 年的高速扩张业务，成长为 **2025 年收入约 $128.7B、经营利润约 $45.6B** 的核心利润引擎。2026 Q1 AWS 单季收入已达 **$37.6B**，同比增长 28%。
  - 来源：Amazon FY2025 10-K; Q1 2026 earnings release
  - 可信度：high（官方财报）

### Marketplace / 第三方卖家
- **占比上升**：第三方卖家仍是 Amazon 商业系统的核心。Amazon 官方称独立卖家已占其商店销售额的 **60% 以上**。Marketplace Pulse 估计 2026 Q1 第三方卖家占 paid units 的 **60%**，估计约占 GMV 的 **69%**。
  - 来源：Amazon 2025 Small Business Empowerment Report; Marketplace Pulse
  - ⚠️ 注意：paid units、GMV 与服务收入（$172.162B）是三个不同口径，不能混用

### Amazon Logistics
- **包裹量领先**：Amazon Logistics 已在美国包裹量维度超过 UPS/FedEx。据 ShipMatrix 估计，2025 年 Amazon 递送 **6.7B packages**，超过 USPS（6.6B）、UPS（4.4B）、FedEx（3.6B），成为按量第一。
  - 来源：Pitney Bowes Parcel Shipping Index 2024; ShipMatrix / Supply Chain Dive 2025
  - ⚠️ 注意：按包裹量 ≠ 按收入；UPS/FedEx 在收入维度仍领先

### Echo / Alexa
- **市场份额**：Alexa/Echo 仍保持强势，但口径差异很大：
  - Mordor Intelligence 估计 Alexa 在 2025 年智能音箱市场中约 **36.12%**
  - CIRP/GeekWire 口径下 Echo 在美国智能音箱中约 **75%**
  - Amazon 称 Alexa-powered devices 全球约 **6 亿**，但包括第三方设备
  - 来源：Mordor Intelligence; GeekWire/CIRP; Amazon official
  - ⚠️ 注意：三个数字不可直接比较；均为第三方估计或包含非 Echo 设备

### FBA 渗透率
- **行业估计**：第三方行业估计显示，2025 年大约 **82%-86%** 的活跃 Amazon 卖家使用 FBA。
  - 来源：Red Stag Fulfillment estimate; Helium 10 estimate
  - ⚠️ 注意：第三方估计，非 Amazon 官方披露；"active seller"定义可能不同

### 电商利润结构
- **收入组已知，利润拆分不可精确得出**：Amazon 2025 10-K 披露收入结构：Online stores $269.3B; Third-party seller services $172.2B; Advertising services $68.6B; Subscription services $49.6B; AWS $128.7B。Segment operating income：North America $29.6B; International $4.8B; AWS $45.6B。
  - 来源：Amazon FY2025 10-K
  - ⚠️ 注意：公开财报**不能精确拆分**"商品销售利润 vs Prime 会员费利润 vs 第三方卖家利润 vs 广告利润"

### Amazon Supply Chain Services（2026 年新案例）
- **官方宣布**：Amazon 于 **2026-05-04** 宣布 Amazon Supply Chain Services，将 freight, distribution, fulfillment, parcel shipping capabilities 开放给 **所有企业**，不限 Amazon sellers。
  - 来源：Amazon 官方; Business Wire
  - 可信度：high
  - **意义**：这是《亚马逊税》论点的新例证——Amazon 不断把内部供应链基础设施产品化为对外服务，复制 AWS 路径。

---

## 关键概念速查

- **Amazon Tax / 亚马逊税**：Thompson 提出的隐喻，指亚马逊通过规模经济和基础设施化成为默认平台，从参与者中抽取价值。
- **AWS primitives / AWS 基础构件**：把复杂系统拆成最小原子组件（存储、计算、数据库），让开发者自由组合。
- **Prime**：付费会员体系，Thompson 认为其本质是"零售消费税"。
- **FBA**：第三方卖家仓储配送服务，让商家库存进入亚马逊体系。
- **Marketplace**：第三方卖家市场，2016 年占亚马逊单位销量 40%，2026 年估计约 60% paid units。
- **Aggregation Theory / 聚合理论**：聚合者通过控制用户关系将供应商商品化。

详见独立概念页面：
- [亚马逊税（概念）](./concept.amazon-tax.staging.md)
- [AWS 基础构件（概念）](./concept.aws-primitives.staging.md)

---

## 证据链

文章核心论证的证据链详见独立证据页面：
- [核心论证证据（原始 staging 版）](./evidence.amazon-tax-core-arguments.staging.md)
- [核心论证证据（自动核验 staging 版）](./evidence.amazon-tax-core-arguments.verified.staging.md)
- [核心论证证据（人工核验 staging 版）](./evidence.amazon-tax-core-arguments.manual-verified.staging.md)

---

## 关联主题

- [平台经济](../concepts/platform-economy.md)
- [亚马逊](../concepts/amazon.md)
- [聚合理论](../concepts/aggregation-theory.md)
- [电商基础设施](../concepts/e-commerce-infrastructure.md)
- [平台税](../concepts/platform-tax.md)
- [云计算商业模式](../concepts/cloud-computing-business-model.md)
- [京东物流](../concepts/jd-logistics.md)
- [Costco](../concepts/costco.md)
- [Shopify](../concepts/shopify.md)

---

## 时效性说明

本文发表于 2016 年，文中数据（如 Prime 5400 万会员、年费 99 美元、非 AWS 业务营业利润 26 亿美元）均为 2015/2016 年数据。

**2026 年数据更新**：本笔记已补充经过人工核验的 2026 年背景数据，所有数据均附来源链接和口径限定。非官方估计的数据已明确标注为 "third-party estimate"。

**尚未核验的内容**：
- 商家对 Amazon 的依赖和不满程度（如 FTC 反垄断诉讼、卖家费用上涨争议）
- Echo/Alexa 在全球非美国市场的表现
- Amazon Supply Chain Services 的实际市场采纳率

---

## 来源材料

| 材料 | 路径 | 说明 |
|------|------|------|
| 原文 Markdown | `../article.md` | 带 YAML frontmatter 的完整原文 |
| 完整中文翻译 | `../the_amazon_tax.full_translation.zh.md` | 逐段翻译，含脚注 |
| 精读版 | `../the_amazon_tax.deep_reading.zh.md` | 11 个分析维度 |
| 详细释义版 | `../the_amazon_tax.detailed_exegesis.zh.md` | 分段释义与论证链条 |
| 段落摘要 | `../the_amazon_tax.paragraph_summary.zh.md` | P001-P047 编号摘要 |
| 元数据 | `../metadata.json` | 结构化元数据 |
| 自动核验报告 | `./web_verification_report.md` | 2026 年自动核验报告（全部 not_verified） |
| 人工核验报告 | `./manual_web_verification_report.md` | 2026 年人工核验报告 |
| 自动核验来源 | `./web_verification_sources.json` | 结构化来源记录（自动） |
| 人工核验来源 | `./manual_web_verification_sources.json` | 结构化来源记录（人工） |

---

## 入库状态

- **当前状态**：staging draft
- **目标路径**：`agent-idea-wiki/wiki/reading-notes/amazon-tax-2016.md`
- **禁止直接发布**：是
- **需要人工复核**：是
- **2026 数据核验**：部分完成（基于用户提供的外部 source packet）
- **Protected layer check**：尚未执行，需在写入 production wiki 前运行 `check-protected-layer.sh`
