---
title: "AWS 基础构件"
title_en: "AWS Primitives"
author: "Ben Thompson"
source: "Stratechery"
url: "https://stratechery.com/2016/the-amazon-tax/"
published: "2016-03-15"
date: "2026-05-05"
extracted_at: "2026-05-05"
entry_type: "concept"
tags:
  - AWS
  - 云计算
  - 基础设施
  - 原语
  - 模块化
  - 平台经济
related_topics:
  - "[亚马逊](../concepts/amazon.md)"
  - "[亚马逊税](../concepts/amazon-tax.md)"
  - "[平台经济](../concepts/platform-economy.md)"
  - "[云计算商业模式](../concepts/cloud-computing-business-model.md)"
  - "[微服务](../concepts/microservices.md)"
  - "[模块化](../concepts/modularity.md)"
target_production_path: "agent-idea-wiki/wiki/concepts/aws-primitives.md"
status: "production_candidate"
production_ready: true
requires_human_review: false
do_not_publish_directly: false
reviewed: true
protected_check_passed: true
protected_check_status: "pass_with_warn"
---

# AWS 基础构件 / AWS Primitives

## 这是什么

"基础构件"（primitives）是亚马逊/AWS 的核心设计哲学。Thompson 在《The Amazon Tax》中引用 Brad Stone《一网打尽》的描述：

贝佐斯受 Steve Grand《创生》（Creation）启发，提出亚马逊不应猜测开发者需要什么服务，而应创造计算的"基础构件"——存储、计算、数据库等最基础的原子化组件——然后"置身事外"，让开发者自由组合。

## 与具体产品的区别

| 基础构件（Primitives） | 具体产品/解决方案 |
|---------------------|----------------|
| S3（存储） | 照片备份服务 |
| EC2（计算） | 网站托管服务 |
| RDS（数据库） | CRM 系统 |
| Lambda（函数计算） | 消息推送服务 |

**关键区别**：基础构件不预设使用场景。开发者拿到的是"乐高积木"，而不是"已经拼好的模型"。

## 在文章中如何理解亚马逊模式

Thompson 指出，"基础构件"模型不仅解释了 AWS 的设计，也解释了亚马逊所有业务的底层逻辑：

- **AWS**：把数据中心拆成存储、计算、数据库等基础构件
- **Prime**：把消费者忠诚度拆成"快速配送 + 流媒体 + 优先选购"等权益构件
- **FBA**：把物流能力拆成"仓储 + 打包 + 配送 + 售后"等履约构件
- **Marketplace**：把商品供给拆成"上架 + 曝光 + 交易 + 评价"等交易构件

## 为什么是关键

Thompson 认为，"基础构件"思想是亚马逊能够不断把内部能力外部化的根本原因：

1. **不预测未来**：不需要猜测用户想要什么，只需要提供最基础的组件
2. **覆盖更多场景**：同一个基础构件可以被无数开发者用于完全不同的目的
3. **产生涌现性**（emergence）：用户会创造出亚马逊从未想象过的用法
4. **天然可复用**：每个团队开发的组件必须能被其他团队使用

## 组织层面的根源

亚马逊的"两个披萨团队"（不到十人的自治小组）天然产生可复用的模块。每个团队解决亚马逊的一个具体问题，但解决方案必须以"基础构件"的形式呈现，以便被其他团队复用。

> "如果亚马逊想要激发其开发者的创造力，它不应该试图猜测他们可能需要什么样的服务；这种猜测将基于过去的模式。相反，它应该创造原语——计算的构建模块——然后置身事外。"
> —— 贝佐斯，被 Thompson 引用

## 关联概念

- [亚马逊税](../concepts/amazon-tax.md)：基础构件是亚马逊税形成的技术机制
- [平台经济](../concepts/platform-economy.md)：基础构件化是平台扩展的核心策略
- [模块化](../concepts/modularity.md)：基础构件是模块化设计的一种具体实现
- [微服务](../concepts/microservices.md)：微服务架构可以追溯到 AWS 的基础构件思想

## 来源

- 原文：The Amazon Tax, Ben Thompson, Stratechery, 2016-03-15
- 引用来源：Brad Stone, The Everything Store
- 引用来源：Steve Grand, Creation

## 注意

本概念页面仅记录 2016 年原文中对"基础构件"的论述。关于 2026 年 AWS 的产品演进（如 Bedrock、Trainium/Inferentia 等）是否延续了"基础构件"哲学，属于需要后续验证的延伸内容，不应写入本概念页面。
