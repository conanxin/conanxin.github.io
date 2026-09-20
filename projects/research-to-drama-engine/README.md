# Research-to-Drama Engine

## 让每一段生成文本，都能说明自己的证据与权限

**[打开中文图文介绍页](https://conanxin.github.io/projects/research-to-drama-engine/)** · **[阅读开发纪事（P1–P10）](DEVELOPMENT.zh-CN.md)** · [查看网页源码](index.html)

> 本目录公开中文介绍页、方法图解和开发纪事。Engine 的 sanitized public source release 已发布到 **[`conanxin/research-to-drama-skills`](https://github.com/conanxin/research-to-drama-skills)**；私人扫描、往来邮件、凭据和完整私有研究 Git 历史不在公开发行树中。不要将名称相似的 `classic-to-drama-engine` 当成本项目。

## 项目是什么

Research-to-Drama Engine 是一套以史料为依据、按文本单元记录创作权限的研究协议与 Agent 工作流原型。它不把“读到材料”和“可以写成戏剧”视为同一件事，也不把用户接受的生成文本反向当成历史证据。

```mermaid
flowchart LR
  S["史料 / 文件资产"] --> C["命题 / 原文位置"]
  C --> E["证据评估 / 显式推断"]
  E --> W["历史世界准入"]
  W --> D["创作决策与权限"]
  D --> B["场景蓝图"]
  B --> T["逐单元授权的文本"]
  T --> A["用户验收"]
```

这张图说明工作流，不代表一条已经实现的全自动命令。真实执行包含 Agent、JSON Schema、研究判断和用户审批。

## 三个最容易越界的地方

| 材料或状态 | 必须保留的边界 | 不应自动写成 |
| --- | --- | --- |
| 决定修建小教堂 | 行动阶段是“决定” | 教堂已经建成 |
| 作者转述抢劫事件 | 转述不等于作者目击 | 作者视角的现场重演 |
| P. Hugo 告诉 Häring 一本赠书的消息 | 具名中介、一本、来源层级 | Häring 在现场接书，或把另外三本合并进来 |

有明确授权时可以使用对白、最小动作等创作补全；但这些内容仍是戏剧创作，不变成史料原话。没有授权时，`completion_slots=[]` 必须真的意味着不补写。

## 为什么两个来源编号仍然不够

```mermaid
flowchart TD
  F["Fogolla 底层报告"] --> P["S-0005：1896/1897 刊载"]
  P --> R["S-0001：1910 删节转述"]
  R --> X["不同出版物，共享同一底层来源链"]
  H["S-0002：Häring 手写信"] --> Q["第二来源候选：P2 Shadow 已验收"]
  Q --> G["人工核验与正式第二链仍待完成"]
```

S-0001 对 S-0005 的删节依赖，使“两个 Source ID 就是两条独立证据链”的早期判断被撤回。项目保留了这次纠错，而不是把开发过程改写为一路通过。

## 当前验证范围

整理基线：2026-09-19；最近研究回执 `6ff24a7`。以下为项目记录所支持的状态，不是本目录重新执行云端测试的结果。

- 五个正式 Scene Text 样本已验收，覆盖有补全、零补全、实践、多 WP、显式转述等不同形态；它们仍属于同一 Fogolla 底层来源链。
- S-0002 的 P2 Shadow 样本已完成生成、表层修订、复评和用户验收。它验证的是**这个样本的工作流与语义边界**，不是独立史料认证。
- 正式成熟度保持 `L2`，`L3=CONDITIONAL`。L2/L3 是项目内部验证等级，不是行业标准。
- P2 人工核验请求已经发出。发送请求不等于收到确认；文本读法确认也不等于独立证实赠书事件。

尚未证明：第二条 canonical 独立证据链端到端完成、所有 Evidence tier 的戏剧泛化、任意史料下的可靠性、完整剧本产品或通用自动执行服务。不使用未经测量的完成百分比，也不承诺“零幻觉”。

## Canonical 与 Shadow

| Canonical 正式研究层 | Shadow 验证实验层 |
| --- | --- |
| 有真实来源与正式准入记录 | 在未完成转写核验时模拟接口与语义传播 |
| 使用正式记录 ID 与审批 | 使用 `VALIDATION-…` 命名空间 |
| 正式文本必须走完整审批 | Shadow 验收不能替代正式审批 |
| 证据及来源独立性需要审查 | 两次模型读法一致不等于人工校读或独立佐证 |

不能通过改名或复制状态，把 Shadow 对象直接变成正式对象。

## 本目录

```text
projects/research-to-drama-engine/
├── index.html               # 中文介绍页；三张内联 SVG 图解、案例切换与时间线
├── README.md                # 项目入口与真实发布范围
└── DEVELOPMENT.zh-CN.md     # 开发纪事、关键纠错与历史提交索引
```

网页是静态 HTML/CSS/JavaScript，不需要后端、登录或数据库。下载本目录后可直接打开 `index.html`。Engine 的安装及测试命令必须从实际工程恢复；本目录不提供尚未核实的 CLI、pip 包名或启动参数。

## 开源源码

公开源码仓库：**https://github.com/conanxin/research-to-drama-skills**。该仓库由原 `research-to-drama-skills` 工作树导出为独立 sanitized release，保留实际 schemas、skills、docs、evals、测试和去隐私化 pilot；不公开私人邮件、个人地址、凭据、原始私人扫描、未筛选日志或完整私有研究 Git 历史。

源码仓库 README 已回链本中文项目页：**https://conanxin.github.io/projects/research-to-drama-engine/**。

网页公开、源码公开和史料核验仍是三个不同的完成条件；源码开源不使第二条 canonical 证据链或 L3 自动成立。
