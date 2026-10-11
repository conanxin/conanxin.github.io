# Conan Xin 数字花园 — 项目交接入口

> 更新：2026-10-12（UTC+8） · 下一阶段：`TASK_ID=CONANXIN_SITE_DESIGN_STAGE2F_CONTINUATION`  
> 先核对 GitHub `main` 当前 SHA、PR 和 Pages Actions，不能把本交接文件中记录的历史 SHA 当作永远最新的主分支状态。

## 1. 项目目标与边界

在文章、项目、展览和文献资料之间建立统一、可读、可访问的网站，同时保持可追溯研究证据和特殊专题的独立体验。

- 唯一视觉权威：`assets/site/design.css`；构建与发布：`scripts/build_site.py`、`scripts/personalize_site.py`、`.github/workflows/pages.yml`。
- Agent 入口：`AGENTS.md`、`CLAUDE.md`、`docs/SITE_DESIGN.md`、`.cursor/rules/site-design.mdc`。
- 历史研究正文、原始图片、OCR、引文、JSON、交互及保全分支保持不变；任何新开发需独立分支、PR、真实测试和审阅，不直接改写 `main`。

## 2. 已合并阶段

| 阶段 | PR | 合并 SHA | 实际交付 |
|---|---|---|---|
| Stage 1 | [#10](https://github.com/conanxin/conanxin.github.io/pull/10) | 见 PR | 跨 Agent 设计规范 |
| Stage 2A | [#11](https://github.com/conanxin/conanxin.github.io/pull/11) | `00fa798` | 四类完整模板、模板排除发布、`/site-guide/`、PR CI |
| Stage 2B | [#12](https://github.com/conanxin/conanxin.github.io/pull/12) | `3e3c929` | SpaceX 原生主题例外、手机断行、双视口回归、工程规则同步 |
| Stage 2C | [#13](https://github.com/conanxin/conanxin.github.io/pull/13) | `5d76e6f` | 两个真实文章/项目模板、四模板标签修复、发布后检查 |
| Stage 2C 文档 | [#14](https://github.com/conanxin/conanxin.github.io/pull/14) | `d8b0445` | 持久交接与设计规范 v1.2 |
| **Stage 2D** | [#15](https://github.com/conanxin/conanxin.github.io/pull/15) | **`671c31270aecdea3aee0930c260f29078b9c0bf4`** | SHUGE 展览/文献实页、自动内容索引、可验证来源边界 |
| **Stage 2E** | [#17](https://github.com/conanxin/conanxin.github.io/pull/17) | **`17ba656e3c1695624058ce00750b0cb1f7650734`** | 从旧 works.json 找到正确 ID/题名/URL；新独立审计与 reference 导览；收紧自动索引准入 |

生产验收证据：
- Stage 2B [Run 38142644340](https://github.com/conanxin/conanxin.github.io/actions/runs/38142644340)：19 Python 测试、32 浏览器检查、9 公网路径。
- Stage 2C [Run 38143831596](https://github.com/conanxin/conanxin.github.io/actions/runs/38143831596)：24 Python 测试、36 浏览器检查、12 公网路径。
- **Stage 2D [Run 38146608834](https://github.com/conanxin/conanxin.github.io/actions/runs/38146608834)：31/31 Python 测试、42/42 Playwright、15/15 真实公网路径（HTTP 200），JS 错误 0；自动索引 JSON 核验通过。**
- **Stage 2E [Run 38184465542](https://github.com/conanxin/conanxin.github.io/actions/runs/38184465542)：38/38 Python 测试、44/44 Playwright、16/16 公网路径（含来源对照页）、JS 错误 0；对照 JSON 状态检查通过。**

## 3. 已发布真实内容与索引

### Stage 2C

- [研究网站的正文、证据与技术日志](/posts/site-design-evidence-layers.html) — article 模板，证据限于真实设计规范、PR、Actions。
- [数字花园设计工程档案](/projects/site-design-lab/) — project 模板，阶段与技术记录可回溯。

### Stage 2D

- [SHUGE 数字生命展览导览](/projects/site-design-lab/shuge-evidence-exhibition/) — exhibition 模板：既有 SHUGE 展厅 2、页目数据及证据审计，不声称三个数字研究对象为已鉴定实体展品。
- [SHUGE 来源与引用核验索引](/projects/site-design-lab/shuge-source-register/) — reference 模板：保留三个 `work_id`、临时 `title_zh` 与未记录的作者/年份；不把候选 Citation ID 当作已经人工验过的原始引文。
- [自动内容索引](/content-index/) 与 [/assets/site/content-index.json](/assets/site/content-index.json)：从已成功构建、具有公开路由的页面生成。首次 Stage 2D 生产索引为 **72 篇文章 + 39 项项目 + 1 项展览 + 1 项文献 = 113 条入口**；随以后发布自动变化，并非固定目标数。只搜索标题/简介，不是全文检索；不按假定发布日期排序。
- 通过 `/site-map/`、旧 `/posts/` 和 `/projects/` 的共享外壳与全站页脚进入自动索引。**没有修改旧手工列表源文件或计数**。

### Stage 2E

- [SHUGE 三条作品 ID 来源核对](/projects/site-design-lab/shuge-source-crosswalk/) — 仍使用完整 **reference** 模板，通过旧 `works.json` 找到 P168491=《园冶》、P211203=《天工开物》、P44159=《工程做法》，另 P124575 才是《水经注》。[机器可读证据](../projects/site-design-lab/shuge-source-crosswalk/crosswalk.json) 保存 VERIFIED（内部映射与公开书格页面）、UNVERIFIED（原藏机构目录与扫描）及限定范围的 NOT_FOUND（额外 numeric permalink 检索）。

四种模板位于 `templates/site/{article,project,exhibition,reference}/index.html`，均为完整 HTML、不会进入公开构建；真实页面各有应用。唯一原生主题例外仍是 `projects/wbw-spacex-mars-cn/index.html`（`project-native`），其余完整页面默认 `unified-v1`。

## 4. SHUGE 史料状态与纠错边界

既有 `projects/shuge-exhibition-v1.0/data/bibliography.json` v0.7 中 `work-shuge-168491`、`work-shuge-211203`、`work-shuge-44159` 的 `title_zh` 是 **post_id 临时标签**。部分 Citation ID 在 `CLAIM_SUPPORT_AUDIT.md` 所检查的运行记录中未能解析，个别虽有解析记录却无法语义支持候选历史主张。因此：
- 不用这些临时标签证明《水经注》《天工开物》等原始作品身份、版本、作者或原刊年份；
- 不把 `REVIEW` 文章记为 `PUBLISHED`，不将 SHUGE OCR/索引状态等同于原件核验；
- 继续保留原版数据、引文、图像和项目级脚本，不静默修改研究资产。

## 5. Stage 2F 下一步（尚未执行）

1. 先读取 Stage 2E [来源核验方法](../docs/STAGE2E_SOURCE_RECONCILIATION.md) 与 `crosswalk.json`，以仓库已确认的 P168491/P211203/P44159 映射为检索起点，取得日本内阁文库与法国国家图书馆等原藏机构自身的**稳定馆藏条目 ID、目录 URL、卷册和扫描图像**，逐条记录证据；尚无一对一对应时不能把物理版本标为 VERIFIED。
2. 评估内容索引更大范围的准入标准：Stage 2E 已明确拒绝 `source`、`work`、`drafts`、`src`、历史展览快照等路径，但尚未扩大发现范围。新增长尾研究内容应先明确允许列表和去重策略。
3. 如果确需替代旧 `posts/index.html` 和 `projects/index.html` 的手工计数，先规划兼容旧功能和搜索交互的迁移方式，再在独立 PR 实施；**Stage 2D—2E 均没有改写旧目录源内容**。
4. 保持 CI 的移动端横向溢出、全文未修改断言、站点目录和生产公网校验。重要决策更新本文件，避免聊天达到长度上限时丢失项目上下文。

## 6. 实际经验

- HTML 字符串检测不能替代真实 DOM；`site-guide` 的主题识别已因此修复。
- CI 全绿不一定代表手机无横向溢出；Stage 2B 和 2D 都在浏览器检查中增加了滚动宽度断言，并修复来源 URL、索引网格溢出。
- Stage 2C 曾在部署后内联 Python 中漏引号，现由 PR 单元测试先编译生产专用脚本。
- Stage 2D 的 Codex P2 建议要求共享 `.visually-hidden` 样式与真正换行的 BibTeX 示例，已修复并验收。代码、PR 讨论、Actions 和本文件应共同成为下一轮 Agent 的恢复入口。


## 7. Stage 2E · 已合并并完成生产验证

此阶段基于当时主分支 `43e2f12` 建立独立分支 `review/stage2e-shuge-source-reconciliation`（现在已经合并），不再重新开发 Stage 1—2D。

- 新增 `projects/site-design-lab/shuge-source-crosswalk/crosswalk.json` 与同目录 `index.html`，供读者查看冻结的三个 `work_id`、同仓库 `works.json` 中已保存的 post_id/title/shuge_url 一对一对照、三个可查阅书格作品页面以及仍待核的原藏机构目录号和扫描页。
- **重要纠错**：现存 `projects/shuge-exhibition-v1.0/data/works.json` 的 `featured[]` 已直接保存三条 `post_id → title / shuge_url`：P168491 = **《园冶》**、P211203 = **《天工开物》**、P44159 = **《工程做法》**；另 P124575 才是**《水经注》**。因此内部归档 ID 映射可标为 **VERIFIED**；三个书格候选网页也已核对。但 **0/3** 得到原藏机构稳定馆藏号 + 扫描书影的独立验证，此层仍 **UNVERIFIED**；在线额外 numeric permalink 的 **NOT_FOUND** 仅限本轮查询，不能否认原档已有映射。
- v0.7 中 `work-shuge-168491` 的 `dynasty=Northern Wei` 与 `works.json` 所载《园冶》明代相冲突；P211203 的 `dynasty=Song` 与《天工开物》明代相冲突。这是冻结书目元数据质量问题，须在**新增审计**中说明，不回写原始 v0.7 数据。作品身份的内部归档映射已核，下一步缺的是原藏机构目录和真实扫描页版本比对。
- `docs/STAGE2E_SOURCE_RECONCILIATION.md` 记录查询方法、外部候选链接和下一步所需原始版本/馆藏号证据。保持 `projects/shuge-exhibition-v1.0/data/*` 和所有旧版 SHUGE 研究正文只读。
- 在 `scripts/content_index.py` 增加显式拒绝 `drafts/`、`future/`、`src/`、`source/`、`work/`、`reports/`、历史展览 v0.* 的路径保护，即使误加了分类 meta，也不能被公开精选索引收录。**Stage 2E 没有扩大自动索引的收录范围**。
- 增加 `tests/test_stage2e_source_reconciliation.py`、1440/390 浏览器验证和部署后公网 JSON 校验。

**验收结果**：PR [#17](https://github.com/conanxin/conanxin.github.io/pull/17) 已合并，SHA `17ba656e3c1695624058ce00750b0cb1f7650734`。GitHub Pages [Run 38184465542](https://github.com/conanxin/conanxin.github.io/actions/runs/38184465542) **Success**：38/38 单元测试、44/44 浏览器检查、16/16 公网路径；新 `crosswalk.json` 的内部映射 VERIFIED／原藏机构 UNVERIFIED 状态经过上线校验。网页原生视觉 1440/390 已核查，390px 无横向溢出。**下一阶段仍需馆藏实物与扫描页的独立验证；不要重做 PR #10—#17。**
