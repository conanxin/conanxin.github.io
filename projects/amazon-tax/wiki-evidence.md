---
author: "Ben Thompson"
source: "Stratechery"
url: "https://stratechery.com/2016/the-amazon-tax/"
published: "2016-03-15"
original_published: "2016-03-15"
date: "2026-05-05"
extracted_at: "2026-05-05"
verified_at: "2026-05-07"
entry_type: "evidence"
tags:
  - 亚马逊
  - 平台税
  - 证据链
  - 聚合理论
related_topics:
  - "[亚马逊税（概念）](../concepts/amazon-tax.md)"
  - "[AWS 基础构件](../concepts/aws-primitives.md)"
  - "[亚马逊税（阅读笔记）](../reading-notes/amazon-tax-2016.md)"
target_production_path: "agent-idea-wiki/wiki/evidence/amazon-tax-core-arguments.md"
title: "亚马逊税核心论证证据"
title_en: "Amazon Tax Core Arguments Evidence"
status: "production_candidate"
production_ready: true
requires_human_review: false
do_not_publish_directly: false
reviewed: true
protected_check_passed: true
protected_check_status: "pass_with_warn"
---

# 亚马逊税核心论证证据（人工核验版本）

> 来源：The Amazon Tax, Ben Thompson, Stratechery, 2016-03-15  
> 证据提取时间：2026-05-05  
> 自动化核验时间：2026-05-06（因 web access 受限，全部 not_verified）  
> 人工核验时间：2026-05-07（基于用户提供的外部联网 source packet）  
> ⚠️ 本页 2026 年数据来源由用户提供，未经过本 agent 重新联网验证  
> ⚠️ 所有 2026 年数据均附来源链接和口径限定

---

## 证据 01：AWS 的本质是对计算经济的结构性收费

- **Claim**：AWS 不是传统的云计算服务销售，而是一种对全球计算经济的结构性收费机制。
- **Support from article**：Thompson 引用 Chamath Palihapitiya 的论断："AWS is a tax on the compute economy."
- **Source location**：原文 "The AWS Tax" 小节；paragraph_summary P013-P014
- **Confidence**：high（原文引用准确）
- **Verification status**：原文 verified；2026 数据 **VERIFIED**
- **Verified statement**：AWS 已从 2016 年仍在高速扩张的云业务，成长为 2025 年收入约 $128.7B、经营利润约 $45.6B 的核心利润引擎；2026 Q1 AWS 单季收入已达 $37.6B，同比增长 28%。
- **Caveats**：segment sales 不等于 AWS 全部收入（含 transfer pricing 等调整），但为 Amazon 官方披露的最可信口径。
- **Source urls**：
  - https://www.sec.gov/Archives/edgar/data/1018724/000101872426000004/amzn-20251231.htm
  - https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-First-Quarter-Results/

---

## 证据 02：Prime 会员费与 Costco 会员费模式的同构性

- **Claim**：Prime 会员费的经济本质与 Costco 会员费相同——真正的利润来自会员费，而非商品销售。
- **Support from article**：Thompson 引用 Costco 2015 年数据类比亚马逊：5400 万 Prime 会员 × 99 美元 = 53 亿美元。
- **Source location**：原文 "The Transformation of Amazon's E-Commerce Business" 小节；paragraph_summary P021-P022
- **Confidence**：high（原文数据准确）
- **Verification status**：原文 verified；2026 数据 — Prime 定价 **VERIFIED**，Prime 会员数 **PARTIALLY_VERIFIED**，利润结构 **VERIFIED_QUALIFIED**
- **Verified statement**：
  - Prime 定价：美国 Prime 年费已从 $99 上涨到 $139（或 $14.99/月）。
  - Prime 会员数：Amazon 最后一次官方披露全球 Prime 规模是 2021 年超过 2 亿；CIRP 估计 2026 年美国使用 Prime 的 shoppers 约 2.01 亿，但口径为 shoppers（含家庭多个成员），不等于付费账户数。
  - 利润结构：公开财报不能精确拆分 Prime 会员费利润 vs 商品销售利润，但订阅服务收入已达 $49.6B（FY2025）。
- **Caveats**：
  - 全球最新官方 Prime 数缺失（2021 年后 Amazon 停止披露）；
  - CIRP 为第三方估计；
  - 无法直接验证 Thompson 2016 年"会员费 = 利润核心"的类比在 2026 年是否仍然精确成立。
- **Source urls**：
  - https://www.sec.gov/Archives/edgar/data/1018724/000110465921050346/tm216818d2_ex99-1.htm
  - https://cirpamazon.substack.com/p/us-amazon-prime-membership-saturation
  - https://www.amazon.com/gp/help/customer/display.html?nodeId=G34EUPKVMYFW8N2U
  - https://www.sec.gov/Archives/edgar/data/1018724/000101872426000004/amzn-20251231.htm

---

## 证据 03：FBA 让第三方商家将库存置于亚马逊控制之下

- **Claim**：FBA 不仅是一项物流服务，更是一种让第三方商家将库存置于亚马逊控制之下的机制。
- **Source location**：paragraph_summary P025-P026
- **Confidence**：high（原文引用准确）
- **Verification status**：原文 verified；2026 数据 — FBA 渗透率 **PARTIALLY_VERIFIED**
- **Verified statement**：FBA 是商家接入 Amazon 物流和 Prime 体系的关键接口；第三方行业估计显示，2025 年大约 82%-86% 的活跃 Amazon 卖家使用 FBA。
- **Caveats**：82%-86% 为第三方估计（Red Stag、Helium 10），非 Amazon 官方披露；"active seller"定义可能不同；FBA 费用结构 2026 年可能有变化，原文中 Thompson 分析的 FBA 锁定效应仍然成立。
- **Source urls**：
  - https://sell.amazon.com/fulfillment-by-amazon
  - https://www.aboutamazon.com/news/small-business/amazon-2025-small-business-empowerment-report
  - https://redstagfulfillment.com/how-many-amazon-sellers-use-fba/
  - https://www.helium10.com/blog/how-many-sellers-on-amazon/

---

## 证据 04：亚马逊在 10-K 中首次称自己为"运输服务提供商"

- **Claim**：亚马逊在 2015 年 10-K 中首次称自己为"运输服务提供商"。
- **Source location**：paragraph_summary P028-P029
- **Confidence**：high（历史事实）
- **Verification status**：原文 verified；2026 延伸 — Amazon Logistics **VERIFIED_QUALIFIED**
- **Verified statement**：Amazon Logistics 已在美国包裹量维度超过 UPS/FedEx，并在 2025 年据 ShipMatrix 估计超过 USPS 成为按量第一（6.7B packages）；但按收入维度，UPS/FedEx 仍领先。
- **Caveats**：按包裹量 vs 按收入是两个维度；ShipMatrix 为供应链分析机构估计；Pitney Bowes 2024 数据与 ShipMatrix 2025 数据口径略有差异。
- **Source urls**：
  - https://www.investorrelations.pitneybowes.com/news-releases/news-release-details/pitney-bowes-parcel-shipping-index-us-carrier-disruption
  - https://www.supplychaindive.com/news/amazon-postal-service-delivery-rankings-shipmatrix/814866/

---

## 证据 05：贝佐斯的"原语"思想来自 Steve Grand《创生》

- **Claim**：贝佐斯提出 AWS 的"基础构件"设计哲学，灵感来自 Steve Grand 的《创生》。
- **Source location**：paragraph_summary P004-P005
- **Confidence**：high（传记引用）
- **Verification status**：verified（无时效性问题）
- **Notes**：无 2026 年数据需求。

---

## 证据 06：AWS 的"第一个客户是亚马逊自身"模式

- **Claim**：AWS 的建设成本合理，因为第一个也是最好的客户是亚马逊自身的电商业务。
- **Source location**：paragraph_summary P007-P008
- **Confidence**：high（商业模式分析）
- **Verification status**：verified（无时效性问题）
- **Notes**：无 2026 年数据需求。

---

## 证据 07：亚马逊的组织结构天然产生模块化产品

- **Claim**：亚马逊的"两个披萨团队"组织结构让公司天然倾向于生产可复用的模块化组件。
- **Source location**：paragraph_summary P035-P039
- **Confidence**：medium-high（组织行为学推断）
- **Verification status**：verified（无时效性问题）
- **Notes**：无 2026 年数据需求。

---

## 证据 08：Marketplace 占亚马逊单位销量 40%

- **Claim**：2016 年时，40% 的单位销量来自第三方商家。
- **Source location**：paragraph_summary P025
- **Confidence**：high（原文数据准确）
- **Verification status**：原文 verified；2026 数据 **VERIFIED_QUALIFIED**
- **Verified statement**：第三方卖家仍是 Amazon 商业系统的核心：Amazon 官方称独立卖家已占其商店销售额的 60% 以上；Marketplace Pulse 估计 2026 Q1 第三方卖家占 paid units 的 60%，估计约占 GMV 的 69%。
- **Caveats**：Amazon 官方"sales"口径未精确定义；Marketplace Pulse GMV 估计为推算；paid units、GMV、服务收入（$172.162B）是三个不同口径，不能混用。
- **Source urls**：
  - https://www.aboutamazon.com/news/small-business/amazon-2025-small-business-empowerment-report
  - https://www.sec.gov/Archives/edgar/data/1018724/000101872426000004/amzn-20251231.htm
  - https://www.marketplacepulse.com/articles/amazon-is-regaining-1p-unit-share

---

## 证据 09：消费者和商家"心甘情愿"接受亚马逊的收费结构

- **Claim**：亚马逊的收费结构之所以类似于"税"，是因为参与者心甘情愿接受。
- **Source location**：paragraph_summary P027
- **Confidence**：medium（定性判断）
- **Verification status**：原文 verified；2026 延伸 **NOT_VERIFIED**（未纳入本证据页）
- **Notes**：2026 年商家对亚马逊的依赖和不满程度（如 FTC 反垄断诉讼、卖家费用上涨争议）需要额外来源支持，不应直接混入本证据页。本证据页仅保留 2016 年原文判断。

---

## 证据 10：Echo 作为智能家居枢纽的"枢纽税"定位

- **Claim**：亚马逊计划在智能家居领域复制其"枢纽税"模式。
- **Source location**：paragraph_summary P032
- **Confidence**：medium（2016 年预测）
- **Verification status**：原文 verified；2026 数据 **PARTIALLY_VERIFIED**
- **Verified statement**：Alexa/Echo 仍保持强势，但口径差异很大：行业报告估计 Alexa 在 2025 年智能音箱市场中约 36.12%；CIRP/GeekWire 口径下 Echo 在美国智能音箱中约 75%；Amazon 提到的约 6 亿 Alexa-powered devices 包括第三方设备，不能直接当成 Echo 市占率。
- **Caveats**：三个数字不可直接比较；不同研究机构定义市场边界不同；Mordor Intelligence 和 CIRP 均为第三方估计。
- **Source urls**：
  - https://www.mordorintelligence.com/industry-reports/smart-speaker-market
  - https://www.geekwire.com/2025/what-alexas-ai-upgrade-means-for-amazons-business-and-alexa-users/

---

## 附加证据 11：Amazon Supply Chain Services（2026 年新案例）

- **Claim**：Amazon 于 2026-05-04 宣布 Amazon Supply Chain Services，将 freight, distribution, fulfillment, parcel shipping capabilities 开放给所有企业，不限 Amazon sellers。
- **Significance**：这是《亚马逊税》论点的新例证——Amazon 不断把内部能力产品化为对外基础设施，复制 AWS 路径。
- **Confidence**：high（官方宣布）
- **Verification status**：**VERIFIED**
- **Caveats**：服务刚推出，实际市场采纳率待观察。
- **Source urls**：
  - https://www.aboutamazon.com/news/retail/amazon-supply-chain-services-for-business
  - https://www.businesswire.com/news/home/20260504242139/en/Amazon-Launches-Amazon-Supply-Chain-Services-Opening-Its-Logistics-Network-to-All-Businesses

---

## 证据可信度与核验状态汇总（2026-05-07 更新）

| 证据 | 可信度 | 原文状态 | 2026 数据状态 | 类型 |
|------|--------|----------|---------------|------|
| 01 AWS = tax | high | verified | **VERIFIED** | 第三方专家论断 + 官方财报 |
| 02 Prime = Costco 模式 | high | verified | **VERIFIED / PARTIALLY_VERIFIED / VERIFIED_QUALIFIED** | 财务数据类比 |
| 03 FBA 库存控制 | high | verified | **PARTIALLY_VERIFIED** | 行业估计 |
| 04 10-K 运输服务提供商 | high | verified | **VERIFIED_QUALIFIED** | 行业来源 + 估计 |
| 05 原语思想来源 | high | verified | N/A | 传记引用 |
| 06 第一个客户模式 | high | verified | N/A | 商业模式分析 |
| 07 组织结构→产品 | medium-high | verified | N/A | 组织行为学推断 |
| 08 Marketplace 40% | high | verified | **VERIFIED_QUALIFIED** | 官方 + 行业估计 |
| 09 心甘情愿接受 | medium | verified | **NOT_VERIFIED**（未纳入） | 定性判断 |
| 10 Echo 枢纽税 | medium | verified | **PARTIALLY_VERIFIED** | 第三方估计 |
| 11 Supply Chain Services | high | — | **VERIFIED** | 官方宣布 |

---

## 2026 年事实核验状态（人工更新）

| 事实点 | 2016 原文 | 2026 状态 | 可写入 wiki |
|--------|-----------|-----------|-------------|
| Prime 全球会员数 | 5400 万 | **PARTIALLY_VERIFIED** | qualified |
| Prime 年费定价 | $99 | **VERIFIED** → $139 | yes |
| AWS 年收入规模 | 未给出 | **VERIFIED** → $128.7B | yes |
| Marketplace 占比 | ~40% | **VERIFIED_QUALIFIED** → ~60% paid units | qualified |
| Amazon Logistics vs UPS/FedEx | — | **VERIFIED_QUALIFIED** | qualified |
| Echo/Alexa 市场份额 | — | **PARTIALLY_VERIFIED** | qualified |
| FBA 渗透率 | — | **PARTIALLY_VERIFIED** | qualified |
| 利润结构 | — | **VERIFIED_QUALIFIED** | qualified |
| Supply Chain Services | — | **VERIFIED** | yes |

---

## 禁止写入的推断

以下推断属于**超出原文和已核验数据的推测性延伸**，不应写入本证据页面：

- 京东物流验证了亚马逊的物流模式
- Shopify 卖家仍然依赖亚马逊物流
- AI 时代的推理成本成为新的"税基"
- 亚马逊的"税"与封建时代的"什一税"有何异同
- 平台经济是否正在创造一种新的封建主义
- "Prime 会员费仍是电商利润唯一核心"（2026 年财报无法直接验证）

这些推断应保留在独立的 judgment 页面或阅读笔记中，并明确标注为"推测性延伸"。
