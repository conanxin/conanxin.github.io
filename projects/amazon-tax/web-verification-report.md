# 《亚马逊税》｜2026 背景事实人工核验报告

> 核验方式：用户提供外部联网核验 source packet，由本 agent 写回 staging  
> 核验时间：2026-05-07  
> 前置状态：2026-05-06 自动化核验全部 not_verified（web access 受限）  
> 本次状态：基于用户提供的 source packet 逐项人工录入  
> ⚠️ 所有 source URL 由用户提供，本 agent 未重新联网验证其有效性

---

## 1. 核验范围

对 `evidence.amazon-tax-core-arguments.verified.staging.md` 中标记为 `needs_web_verification` 的 8 项事实点进行人工核验：

1. Prime 全球会员数（2016 年原文：约 5400 万）
2. Prime 年费定价（2016 年原文：99 美元）
3. AWS 年收入规模（2016 年原文未给出具体数字）
4. Marketplace 在 Amazon 总销量 / GMV / paid units 中的占比（2016 年原文：约 40%）
5. Amazon Logistics 配送规模 vs UPS / FedEx
6. Echo / Alexa 智能音箱或智能家居市场份额
7. FBA 在第三方卖家中的渗透率
8. Amazon 电商业务利润结构

附加核验：
9. Amazon Supply Chain Services（2026-05-04 官方宣布，作为《亚马逊税》论点的 2026 例证）

---

## 2. 核验方法

- **来源来源**：用户提供的外部联网核验结果
- **来源类型**：官方 SEC 文件、Amazon 官方材料、第三方行业估计（CIRP、Marketplace Pulse、Pitney Bowes、ShipMatrix、Mordor Intelligence、Red Stag、Helium 10）
- **可信度标准**：
  - **VERIFIED**：单一官方来源或多个可信来源一致
  - **VERIFIED_QUALIFIED**：数据本身可信，但存在口径限定或需要上下文解释
  - **PARTIALLY_VERIFIED**：数据可得但存在不确定性、非官方估计、或口径模糊
  - **NOT_VERIFIED**：未能获取数据

---

## 3. 核验结果总表

| 编号 | 事实点 | 2016 原文数据 | 最新核验结果 | 时间口径 | 来源 | 可信度 | 是否可写入 wiki | 备注 |
|------|--------|---------------|--------------|----------|------|--------|-----------------|------|
| 01 | Prime 全球会员数 | 约 5400 万 | **PARTIALLY_VERIFIED** | 2021（全球）；2026 Q1（美国） | SEC shareholder letter; CIRP | medium | qualified | 全球 vs 美国口径差异大 |
| 02 | Prime 美国年费 | 99 美元 | **VERIFIED** | 2026 当前 | Amazon 官方帮助页 | high | yes | $139/年 或 $14.99/月 |
| 03 | AWS 收入规模 | 未给出 | **VERIFIED** | FY2025 + Q1 2026 | Amazon 10-K; Q1 earnings | high | yes | $128.725B FY2025; $37.6B Q1 2026 |
| 04 | Marketplace 占比 | 约 40% | **VERIFIED_QUALIFIED** | 2025-2026 | Amazon 官方; Marketplace Pulse | medium-high | qualified | paid units vs GMV vs 收入不同口径 |
| 05 | Amazon Logistics vs UPS/FedEx | — | **VERIFIED_QUALIFIED** | 2024-2025 | Pitney Bowes; ShipMatrix | medium-high | qualified | 按包裹量 vs 按收入维度差异 |
| 06 | Echo/Alexa 市场份额 | — | **PARTIALLY_VERIFIED** | 2025 | Mordor Intelligence; CIRP/GeekWire | medium | qualified | 口径极多，不可混用 |
| 07 | FBA 渗透率 | — | **PARTIALLY_VERIFIED** | 2025 | Red Stag; Helium 10 | medium | qualified | 第三方估计，非官方披露 |
| 08 | 电商利润结构 | — | **VERIFIED_QUALIFIED** | FY2025 | Amazon 10-K | high | qualified | 收入组已知，利润拆分不可精确得出 |
| 09 | Amazon Supply Chain Services | — | **VERIFIED** | 2026-05-04 | Amazon 官方; Business Wire | high | yes | 新基础设施外部化案例 |

---

## 4. 分项核验

### Fact 01：Prime 全球会员数
- **原文背景**：Thompson 引用约 5400 万 Prime 会员 × 99 美元 = 53 亿美元
- **最新公开数据**：Amazon 最后一次明确披露的全球 Prime 规模是 2021 年 "more than 200 million Prime members worldwide"；CIRP 估计截至 2026 年 3 月，美国有 201 million Amazon customers had a Prime membership
- **时间口径**：2021（全球官方）; 2026 Q1（美国估计）
- **来源链接**：
  - https://www.sec.gov/Archives/edgar/data/1018724/000110465921050346/tm216818d2_ex99-1.htm
  - https://cirpamazon.substack.com/p/us-amazon-prime-membership-saturation
- **可信度**：medium（官方全球数据较旧；美国数据为 CIRP 估计且口径为 shoppers 而非付费账户）
- **可写入方式**：qualified — 可写入但需明确标注口径差异
- **建议表述**："Amazon 最后一次明确披露的全球 Prime 规模是 2021 年超过 2 亿；到 2026 年，CIRP 估计美国使用 Prime 的 Amazon shoppers 约 2.01 亿，但这不是全球官方订阅账户数，且 shopper 口径（含家庭多个成员）高于实际付费家庭账户数。"
- **不确定性**：全球最新官方数据缺失；CIRP 统计口径不等于 Amazon 内部订阅数

### Fact 02：Prime 美国年费
- **原文背景**：99 美元/年
- **最新公开数据**：美国 Prime 价格为 $14.99/month 或 $139/year；Prime Video 单独为 $8.99/month；学生价 $7.49/month 或 $69/year
- **时间口径**：2026 当前
- **来源链接**：https://www.amazon.com/gp/help/customer/display.html?nodeId=G34EUPKVMYFW8N2U
- **可信度**：high（Amazon 官方帮助页）
- **可写入方式**：yes
- **建议表述**："美国 Prime 会员价格已从原文中的 $99/年上涨到 $139/年（或 $14.99/月）。"
- **不确定性**：无

### Fact 03：AWS 年收入规模
- **原文背景**：Thompson 引用 Palihapitiya 称 "AWS is a tax on the compute economy"，未给出具体营收数字
- **最新公开数据**：AWS FY2025 segment sales $128.725B；AWS FY2025 operating income $45.606B。2026 Q1：AWS segment sales $37.6B，YoY +28%；AWS operating income $14.2B
- **时间口径**：FY2025（截至 2025-12-31）; Q1 2026
- **来源链接**：
  - https://www.sec.gov/Archives/edgar/data/1018724/000101872426000004/amzn-20251231.htm
  - https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-First-Quarter-Results/
- **可信度**：high（官方 10-K 和季度财报）
- **可写入方式**：yes
- **建议表述**："AWS 已从 2016 年仍在高速扩张的云业务，成长为 2025 年收入约 $128.7B、经营利润约 $45.6B 的核心利润引擎；2026 Q1 AWS 单季收入已达 $37.6B，同比增长 28%。"
- **不确定性**：无

### Fact 04：Marketplace / 第三方卖家占比
- **原文背景**：Thompson 引用 40% 的 paid units 来自第三方卖家
- **最新公开数据**：Amazon 官方 2025 小企业报告："independent sellers today account for more than 60% of sales in Amazon's store"。Amazon 2025 10-K：Third-party seller services revenue = $172.162B。Marketplace Pulse 2026 Q1：第三方卖家占 paid units 的 60%，估计约占 69% GMV
- **时间口径**：2025-2026
- **来源链接**：
  - https://www.aboutamazon.com/news/small-business/amazon-2025-small-business-empowerment-report
  - https://www.sec.gov/Archives/edgar/data/1018724/000101872426000004/amzn-20251231.htm
  - https://www.marketplacepulse.com/articles/amazon-is-regaining-1p-unit-share
- **可信度**：medium-high（官方 + 行业估计，但口径需区分）
- **可写入方式**：qualified — 必须区分 paid units、GMV、服务收入三个口径
- **建议表述**："第三方卖家仍是 Amazon 商业系统的核心：Amazon 官方称独立卖家已占其商店销售额的 60% 以上；Marketplace Pulse 估计 2026 Q1 第三方卖家占 paid units 的 60%，估计约占 GMV 的 69%。但 paid units、GMV 与服务收入（$172.162B）是不同口径，不能混用。"
- **不确定性**：Amazon 官方"sales"口径未精确定义；Marketplace Pulse GMV 估计为推算

### Fact 05：Amazon Logistics vs UPS/FedEx
- **原文背景**：Thompson 预测物流将成为下一个 AWS
- **最新公开数据**：Pitney Bowes 2024：Amazon Logistics 2024 年处理 6.3B 包裹，按量美国第二，仅次于 USPS 6.9B；UPS 4.7B；FedEx 3.7B。ShipMatrix / Supply Chain Dive 2025：Amazon 2025 年递送 6.7B packages，超过 USPS 6.6B、UPS 4.4B、FedEx 3.6B，成为美国按包裹量第一
- **时间口径**：2024-2025
- **来源链接**：
  - https://www.investorrelations.pitneybowes.com/news-releases/news-release-details/pitney-bowes-parcel-shipping-index-us-carrier-disruption
  - https://www.supplychaindive.com/news/amazon-postal-service-delivery-rankings-shipmatrix/814866/
- **可信度**：medium-high（Pitney Bowes 为行业知名来源；ShipMatrix 为供应链分析来源）
- **可写入方式**：qualified — 必须区分包裹量 vs 收入
- **建议表述**："Amazon Logistics 已在美国包裹量维度超过 UPS/FedEx，并在 2025 年据 ShipMatrix 估计超过 USPS 成为按量第一；但按收入维度，UPS/FedEx 仍领先。"
- **不确定性**：不同来源数据略有差异；ShipMatrix 为估计而非官方数据

### Fact 06：Echo / Alexa 市场份额
- **原文背景**：Thompson 预测 Echo 将成为智能家居枢纽税
- **最新公开数据**：Mordor Intelligence：Amazon Alexa 2025 年保持 36.12% 智能音箱市场份额。GeekWire 引 CIRP：Echo smart speakers 在美国约 75% 市场份额；Amazon 称 Alexa-powered devices 全球约 6 亿
- **时间口径**：2025
- **来源链接**：
  - https://www.mordorintelligence.com/industry-reports/smart-speaker-market
  - https://www.geekwire.com/2025/what-alexas-ai-upgrade-means-for-amazons-business-and-alexa-users/
- **可信度**：medium（多个来源，但口径差异极大）
- **可写入方式**：qualified — 必须明确区分三个口径
- **建议表述**："Alexa/Echo 仍保持强势，但口径差异很大：行业报告估计 Alexa 在 2025 年智能音箱市场中约 36.12%；CIRP/GeekWire 口径下 Echo 在美国智能音箱中约 75%；Amazon 提到的约 6 亿 Alexa-powered devices 包括第三方设备，不能直接当成 Echo 市占率。"
- **不确定性**：三个数字不可直接比较；不同研究机构定义市场边界不同

### Fact 07：FBA 渗透率
- **原文背景**：原文指出多数第三方商家使用 FBA
- **最新公开数据**：Amazon 官方定义 FBA 为 "lets sellers outsource order fulfillment to Amazon"。第三方估计：Red Stag 估计 2025 年约 82% active Amazon marketplace sellers use FBA；Helium 10 称 2025 年 86% active sellers use FBA，82% prefer it over other fulfillment methods
- **时间口径**：2025
- **来源链接**：
  - https://sell.amazon.com/fulfillment-by-amazon
  - https://www.aboutamazon.com/news/small-business/amazon-2025-small-business-empowerment-report
  - https://redstagfulfillment.com/how-many-amazon-sellers-use-fba/
  - https://www.helium10.com/blog/how-many-sellers-on-amazon/
- **可信度**：medium（官方定义存在；渗透率数字来自第三方估计）
- **可写入方式**：qualified — 必须标注为 industry estimate
- **建议表述**："FBA 是商家接入 Amazon 物流和 Prime 体系的关键接口；第三方行业估计显示，2025 年大约 82%-86% 的活跃 Amazon 卖家使用 FBA，但这不是官方披露口径。"
- **不确定性**：82%-86% 为估计区间，非官方数据；"active seller"定义可能不同

### Fact 08：Amazon 电商业务利润结构
- **原文背景**：Thompson 提出 Prime 会员费 = 利润来源（类比 Costco）
- **最新公开数据**：Amazon 2025 10-K 披露收入组：Online stores $269.287B; Physical stores $22.561B; Third-party seller services $172.162B; Advertising services $68.635B; Subscription services $49.619B; AWS $128.725B。Segment operating income：North America $29.619B; International $4.750B; AWS $45.606B
- **时间口径**：FY2025
- **来源链接**：https://www.sec.gov/Archives/edgar/data/1018724/000101872426000004/amzn-20251231.htm
- **可信度**：high（官方 10-K）
- **可写入方式**：qualified — 收入组已知，但利润拆分不可精确得出
- **建议表述**："公开财报不能精确拆分 Amazon 电商利润来源（无法直接得出 Prime 会员费利润 vs 商品销售利润 vs 广告利润），但 2025 年收入结构显示，第三方卖家服务（$172.2B）、广告（$68.6B）、订阅服务（$49.6B）与 AWS（$128.7B）已经是 Amazon 商业模式中非常重要的服务型收入层。"
- **不确定性**：无法验证 Thompson 2016 年关于"Prime 会员费 = 电商利润核心"的类比在 2026 年是否仍然精确成立，因为财报不提供该级别的利润拆分

### Fact 09：Amazon Supply Chain Services（附加）
- **背景**：Amazon 2026-05-04 官方宣布 Amazon Supply Chain Services，将 freight, distribution, fulfillment, parcel shipping capabilities 开放给 all businesses，不限 Amazon sellers
- **意义**：这是《亚马逊税》论点的新例证——Amazon 不断把内部能力产品化为对外基础设施
- **时间口径**：2026-05-04
- **来源链接**：
  - https://www.aboutamazon.com/news/retail/amazon-supply-chain-services-for-business
  - https://www.businesswire.com/news/home/20260504242139/en/Amazon-Launches-Amazon-Supply-Chain-Services-Opening-Its-Logistics-Network-to-All-Businesses
- **可信度**：high（Amazon 官方 + Business Wire 新闻稿）
- **可写入方式**：yes
- **建议表述**："2026 年 Amazon Supply Chain Services 的推出，是《亚马逊税》论点的新例证：Amazon 不只是经营零售，而是不断把内部供应链基础设施产品化为对外服务，复制 AWS 路径。"
- **不确定性**：无

---

## 5. 不建议写入的内容

以下数据/表述即使来自用户提供的信息，也应谨慎处理或明确限定：

- **"Prime 全球会员 2 亿+"**：Amazon 官方最后一次披露是 2021 年，不应声称 2026 年全球会员仍为 2 亿+，除非有更新官方披露
- **"CIRP 2.01 亿 = Amazon 官方会员数"**：CIRP 统计的是 shoppers 而非付费账户，不应混用
- **"Marketplace 占 69% GMV"**：Marketplace Pulse 估计，非官方数据，应标注来源
- **"Amazon Logistics 全面超过 UPS/FedEx"**：仅按包裹量超过，按收入维度仍落后
- **"Echo 占 75% 市场份额"**：75% 是美国 Echo smart speaker 口径，不是全球，也不是 Alexa virtual assistant 口径
- **"FBA 渗透率 82%-86%"**：第三方估计，非官方
- **"Prime 会员费是电商利润核心"**：2026 年财报无法直接验证此判断；收入结构显示服务型收入重要，但不能精确拆分利润归属

---

## 6. 推荐写入 staging 草稿的修订

### evidence page 修订建议

对每项涉及 2026 年数据的证据 item，增加以下字段：

```markdown
- **verification_status**: [VERIFIED / VERIFIED_QUALIFIED / PARTIALLY_VERIFIED]
- **verified_statement**: [经过核验的表述]
- **caveats**: [必须标注的限定条件]
- **source_urls**:
  - [来源 1]
  - [来源 2]
```

### reading note 修订建议

增加 "2026 背景更新"小节，包含：
1. Prime 定价变化（$99 → $139）
2. AWS 成长为 $128.7B 收入/$45.6B 利润的核心引擎
3. Marketplace 第三方卖家占比上升（40% → 60%+）
4. Amazon Logistics 包裹量超过 USPS（按 ShipMatrix 估计）
5. Amazon Supply Chain Services 推出（2026-05-04）

每个数字后附来源标注和口径说明。未官方披露的数据标注为 "third-party estimate"。

---

*报告生成时间：2026-05-07*  
*数据来源：用户提供的外部联网核验结果*  
*处理原则：未重新联网；未覆盖已有 verified 文件；只写入 staging*
