# Stage 2E — SHUGE 临时 work_id 与公开作品来源核验（第一轮）

> TASK_ID: `CONANXIN_SITE_DESIGN_STAGE2E_CONTINUATION`  
> 核查日期：2026-10-12 · 本文是**新的外部候选对照研究**，不是对冻结的 SHUGE v0.7 数据集的修正。

## 1. 证据层级与状态定义

| 层级 | 已完成工作 | 结论 |
|---|---|---|
| A. 冻结书目 | 直接读取 `projects/shuge-exhibition-v1.0/data/bibliography.json` 的 3 个 `work_id` | VERIFIED：确有此三条**内部记录** |
| B. 对照作品网页 | 分别读取公开书格作品介绍和其中的版本/责任人/所述馆藏 | VERIFIED：**独立作品网页存在且页面如此陈述** |
| C. 冻结 ID → 对照网页 | 检索数字 ID/查询 Shuge WordPress 公开路径，未取得稳定 ID→作品页绑定 | UNVERIFIED：**不能把候选书格作品页等同于冻结 work_id** |
| D. 本轮精确 ID 检索 | 精确标识 `168491`、`211203`、`44159` 与公开书格页面匹配结果未找到足够直接证据 | NOT_FOUND：**仅是本轮检索未取得；不能认定页面不存在** |
| E. 最终馆藏目录/具体扫描 | 未取得与冻结 ID 对应的一对一、可交叉验证的持有机构 catalog ID / IIIF / 扫描版心 | UNVERIFIED：不得声称已经验明原刊、同一版本或馆藏号 |

`VERIFIED` 只对所指定层级成立，不自动跨层继承；`NOT_FOUND` 是限定范围的查找结果，不是全网不存在。机器对照文件：`projects/site-design-lab/shuge-source-crosswalk/crosswalk.json`，前端入口：`/projects/site-design-lab/shuge-source-crosswalk/`。

## 2. 三个可查的候选作品页面（并非 ID 映射）

| 冻结 work_id | v0.7 临时标题 | 书格候选作品页 | 书格页面描述的版本/来源 | 数字 ID 与网页关系 |
|---|---|---|---|---|
| `work-shuge-168491` | 书海出版社文献 P168491 | [《水经注》](https://www.shuge.org/view/shui_jing_zhu/) | 明万历十三年（1585）吴琯校刊本；日本内阁文库藏 | **UNVERIFIED** |
| `work-shuge-211203` | 书海出版社文献 P211203 | [《天工开物》](https://www.shuge.org/view/tian_gong_kai_wu/) | 明崇祯十年（1637）涂绍煃刊本；法国国家图书馆藏 | **UNVERIFIED**，冻结 `dynasty=Song` 与候选页明代时代不一致 |
| `work-shuge-44159` | 书海出版社文献 P44159 | [《工程做法》](https://www.shuge.org/view/gong_cheng_zuo_fa/) | 清雍正十二年（1734）武英殿刊本；日本内阁文库藏 | **UNVERIFIED**，同属清代也不足以绑定 ID |

重要：以上「版本与馆藏」是**书格公开页面的陈述**，没有再次从法国国家图书馆或日本国立公文书馆内部目录取得对应的馆藏条目号。也没有在扫描书影中对刊记、牌记和序跋页实施逐页核验，因此不得用这些版本信息覆写冻结 `bibliography.json`。

## 3. 不能越过的冲突

1. v0.7 的 `title_zh` 是 post_id 临时占位，不是原刊版本学书名；`inst-shuge` 曾误标为 `publisher`，v1.0 `institution_roles_v1.0.json` 已指出书格的角色应为数字资源平台而非原刊出版社。
2. `work-shuge-211203` 的 `dynasty=Song` 不得与《天工开物》作者宋应星的姓氏混淆。书格的候选页列为**明代**；这一冲突进一步表明缺少可证明一致性的数字 ID 映射。
3. `CLAIM_SUPPORT_AUDIT.md` 中仅某个 Citation ID 在被检查的运行记录里可以 resolve，也**不能推定**它能语义支持目标候选史学论断。ID 存在 ≠ 实物作品身份、印本、引文都得到了验证。
4. 任何 `REVIEW` 研究文章或 OCR 片段，都不能因为候选作品网页存在而升级到 `PUBLISHED` 或 `VERIFIED`。

## 4. 下一阶段取证任务（此轮未完成）

- 逐一找到**原始 Shuge numeric post ID** → 正式作品页 URL 的可查链接、WordPress 对象或旧目录快照。搜索结果不够时，允许以 NOT_FOUND 记录本次范围，不推断不存在。
- 对确立了 ID 映射的对象，追踪官方原藏机构的稳定馆藏号/目录 URL、IIIF manifest 或数字藏品页，并比对书影封面、书口、题签、序、刊记和卷册组织。
- 在一份新的补充审计中记录 `source_url`、`catalog_id`、`scan_locator`、核验者/日期；只有一一对应且没有未解释冲突时才将**映射状态**标为 VERIFIED。
- 在本轮之前不得编辑原冻结 `bibliography.json`、`citations.json`、OCR、图片、SHUGE 展览源页面与发布状态。

## 5. 内容索引范围（不扩大）

Stage 2D 自动索引仅收录已生成、具有公开路由的根级文章、一级项目入口，以及显式声明为 `reference` / `exhibition` 的新导览。Stage 2E 对入口范围进行防护性检查，但不将 `drafts/`、`src/`、`source/`、`work/`、`reports/`、历史 `shuge-exhibition-v0.*` 公开为精选研究结果。索引是导航功能，不证明历史来源可靠性，也不改写旧手工文章/项目目录。
