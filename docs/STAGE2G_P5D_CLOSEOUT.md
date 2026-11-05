# Stage 2G-P5D｜古籍原图校勘阶段性收尾（2026-11-05）

> 状态：**研究阶段性收尾（HOLD scholarly publication）**。不是完成古籍全文校订；本独立分支不合并、不部署、不修改 SHUGE SQLite、原始图像、OCR、冻结引文或历史论文。

## 1. 交付追踪

| 阶段 | GitHub | 实际状态 |
|---|---|---|
| P5A | [PR #37](https://github.com/conanxin/conanxin.github.io/pull/37) | 旧基线上的未合并锚点排序报告 |
| P5B | [PR #47](https://github.com/conanxin/conanxin.github.io/pull/47) | 已通过 [CI Run 41624692522](https://github.com/conanxin/conanxin.github.io/actions/runs/41624692522)，尚未合并 |
| P5C | [PR #48](https://github.com/conanxin/conanxin.github.io/pull/48) | 已通过 [CI Run 41736208683](https://github.com/conanxin/conanxin.github.io/actions/runs/41736208683)，尚未合并 |
| P5D | 本独立审阅分支 | 四疑点复核、两邻页归档、收尾清单与复现门槛 |

各 PR 不能误写成 main 正式发布，本 P5D 同样不合并、不触发生产部署。

## 2. 第380页：四处疑点复核结果

P5C 有九列正文初稿、一条跨栏小注与三处书口。实际归档原图 SHA-256 为 `db7422280e2a051ea2beea3cff0f5fb46d74163ee8a107b4c0dc60941cbcf838`，对应 `page_object_id=1338`，书内页序380，OCR行1018，QA=`NOT_CHECKED`。本轮只从已有归档图像做缩放裁图，不重新OCR。

| 疑点 | 暂定处理 | 本轮等级 |
|---|---|---|
| U1（C01）塗抹／塗抺 | 继续用 P5C 的「塗抹」作为阅读草稿；手旁细笔尚不能判为原刻异体 | **未定** |
| U2（C02）蛆蠅 | 放大图中的虫旁字形较支持「蛆蠅」 | **AI辅助图证支持，不是人工审定** |
| U3（C06）出離／出甑 | 句末字形较支持「出離」；旧候选「出甑」暂不采用 | **AI辅助图证支持，不是人工审定** |
| U4（N01）跨栏小注 | 图见「流水」「必用山河」及「者不可用」等成分；整段接续还不能严谨定为已校 | **未定** |

注意：**两项有较强原图支持，不等于两项已通过人工定本审核；四项均保留 P5C 的状态边界。** 某处选字若不能从这张原图完整辨认，则不能单凭电子平行文本套用。

## 3. 第220、362页：工作范围已整理，不伪造全文校勘

本轮承接 P5B [已保存的原图坐标比对](../projects/site-design-lab/shuge-source-crosswalk/visual-collation-p5b-audit.json)（位于未合并 PR #47 的分支），并再次针对这些图文关系作收尾判断：

- **第220页，`SHUGE:p211203:1178`**：属《天工开物》水路航运段落，原 OCR「镇汇」「侯風静淡词」与原图选字「鎮江」「候風靜涉過」有差异。不能引用为《水经注》原文或作为其命题的直接证据。
- **第362页，`SHUGE:p211203:1320`**：属《天工开物》卷下颜料矿物段落，「册青第十六卷」「静火紅而至黑」与图上「丹青第十六卷」「離火紅而至黑」存在选段差异；不能作为旧砖瓦工艺命题的直接论据。

**两页均未完成全列精校，0/2 页正式全文校订。** 不把本轮的主题筛查自动升级为 6 条历史研究论断的学术认证。

## 4. 数据链和不可混淆的四层状态

`Citation ID → page_objects.id → work_id/page_index → JPEG SHA → OCR row/layout → transcription draft → human review → scholarly claim`。

此链目前仅局部建立在真实数据、归档图像和有坐标的 OCR/转录建议层。P5C 的整页结构草稿不是已完成的人审定本。两份 BnF Gallica ARK `btv1b525104776` 与 `btv1b52505781g` 同一实体藏本/同一扫描关系继续 **UNVERIFIED**，不能自动交换馆方 canvas 或 f 页。

## 5. 可重复性与质量门槛

- [机器收尾台账](../projects/site-design-lab/shuge-source-crosswalk/p5d-phase-closeout.json) 明确每个疑点的草稿、证据位置和未解决状态。
- [P5C 原图逐列工作稿](https://github.com/conanxin/conanxin.github.io/blob/research/stage2g-p5c-page380-transcription/projects/site-design-lab/shuge-source-crosswalk/page380-p5c-transcription.json) 是位置/版面来源，**未合并**。
- 原研究 SQLite：`/home/conanxin/shuge-research-db/data/shuge.db`，只读连接 `mode=ro` + `PRAGMA query_only=ON`；旧 SHA `4e28174734737d902ba70b83f901e44e9e8f094ce6d43521b3bb4ec7c65052a8`。
- 本 P5D 数据校验只检查证据编号、来源哈希、原图范围和等级门槛，并不能取代逐字人工校读。

## 6. 经验教训

1. **不要用自动 SU​PPORTED 状态代替史料语义认证。** 检索命中与历史论断之间必须有人工语义核对。
2. **不能把 Citation ID 后缀当页码。** `1338` 是主键，实际本库书内页序 `380`。
3. **不要简单反转 OCR 的全部行。** 纵排正文、跨栏夹注、书口、标题混在一起，须按 OCR bbox 重建阅读层。
4. **先核对原始文本范围。** P2 部分 `ocr.excerpt` 150 字展示截断不能冒充全文；188 与 202 则是换行计数口径差异。
5. **复用 SHA 与不可变旁路。** 新稿、建议和冲突记录另存，不覆盖原 SQLite、JPEG、OCR 和原论断。
6. **CI PASS 和学术 VERIFIED 分开记。** 前者验证工程结构，后者需逐字、逐图、版本与论断逐条审定。

## 7. 阶段性关闭与后续恢复入口

**本阶段停止扩展，不安排自动持续任务。** GitHub 保留独立审阅 PR，不进行 main 合并及 Pages 发布。已建立一页结构完整但人审未通过的校勘草稿，另两页保留有定位的选段线索。

若以后主动恢复，顺序为：先人工裁定 U1/U4 → 人工复核 U2/U3 → 针对第220/362页建立完整逐列稿 → 独立核查 BnF 两 ARK 的馆藏/画布 → 六条历史 claim 逐一升降级。所有门槛在获得相应直接证据之前维持未核，不用工期或测试数推断学术完成。
