# UAP Files Web — v0.4.1 Narrative Consistency Report

**STATUS:** PASS
**HOST_SCOPE:** local (cloud Hermes VM)
**PROJECT_DIR:** ~/projects/uap-files-web

---

## 执行摘要

v0.4.1 是叙事一致性修复版本，修复了 v0.4 证据阅读矩阵中的 3 处关键不一致表述：① "NASA 确认无法解释"过强；② Pan Am 1947 错误列为"Blue Book catalog 已确认条目"；③ "待核实记录"行"官方档案已闭合"与 needs_review 语义矛盾。

**所有变更不涉及 data.js 数据内容**，仅修复 HTML/JS 文本内容和 README 说明。

---

## FILES_BACKED_UP

备份目录：`.backup-v0_4_1-20260511_183736/`

| File | Size |
|------|------|
| index.html | 33,029 |
| style.css | 30,134 |
| app.js | 17,910 |
| data.js | 22,813 |
| README.md | 30,385 |
| uap_files_web_v0_4_curated_exhibition_report.md | 9,441 |

---

## FILES_MODIFIED

| File | Change |
|------|--------|
| `index.html` | 修复证据阅读矩阵 3 行（NASA 档案记录 / 官方目录入口 / 待核实记录） |
| `README.md` | 顶部新增 v0.4.1 changelog；修复 evidence matrix 表格；添加 source_status 语义澄清表 |

---

## CONSISTENCY_ISSUES_FOUND

### 问题 1：NASA 档案记录行——"NASA 确认无法解释"表述过强
**严重程度：** 中
**位置：** index.html matrix 第 4 行；README.md evidence matrix 表格第 4 行
**问题：** "NASA 确认该现象为异常或无法解释"暗示 NASA 做出了官方认定，但 PURSUE/WAR.GOV 实际立场是"unresolved — insufficient data"，NASA 从未正式使用该措辞。
**影响：** 读者可能将 source_status=verified 的 Apollo 12 解读为"NASA 官方认定异常"，而非"官方材料可验证"。

### 问题 2：官方目录条目行——Pan Am 1947 被列为 Blue Book catalog 已确认条目
**严重程度：** 高
**位置：** index.html matrix 第 5 行；README.md evidence matrix 表格第 5 行
**问题：** Pan Am 1947 是 needs_review，v0.3.3 streaming scan 结果是"exact_match=false，零 Pan Am 命中"。将其列为"官方目录条目已确认"案例，会让读者误以为该案例的 Blue Book 编号已确认。
**影响：** 与页面核心叙事"未解释≠外星；待核实≠虚假"矛盾，让 needs_review 失去意义。

### 问题 3：待核实记录行——"官方档案已闭合或结论已知"与 needs_review 语义矛盾
**严重程度：** 高
**位置：** index.html matrix 第 6 行；README.md evidence matrix 表格第 6 行
**问题：** needs_review 的含义恰恰相反——档案并未闭合，而是叙事存在但精确编号待查。"官方档案已闭合"暗示研究路径已穷尽，但 Pan Am 1947 的 research_path 明确指向 T-1206 microfilm / reading room。
**影响：** 误导读者以为 needs_review 是"关闭状态"，而非"开放研究路径"。

### 问题 4：README.md 残留旧版本内容
**严重程度：** 低
**位置：** README.md 尾部
**问题：** v0.4 README 尾部保留了 v0.3.2/v0.3.3 的旧 changelog，与 v0.4.1 顶部 changelog 产生版本混乱。
**处理：** v0.4.1 changelog 追加在顶部，旧 changelog 保留在历史备份中。

---

## MATRIX_FIXES

### 修复 1：NASA 档案记录行
**Before：**
- 能知道：航天任务期间存在特定目击或异常记录
- 不能推出：**NASA 确认该现象为异常或无法解释** ❌
- 对应案例：Gemini VII、Apollo 11/12/17

**After：**
- 能知道：航天任务期间存在特定目击或异常记录；WAR.GOV PURSUE 系统有官方 PDF 转录文本
- 不能推出：NASA / WAR.GOV 档案存在记录，不等于机构认定该现象为异常来源或无法解释 ✓
- 对应案例：Apollo 12（官方 PDF）/ Gemini VII、Apollo 11

### 修复 2：官方目录条目 → 官方目录入口
**Before：**
- 证据层级：官方目录条目
- 能知道：档案系统中存在对应条目或编号
- 对应案例：Pan Am 1947（Blue Book catalog）❌

**After：**
- 证据层级：官方目录入口 ✓（label 更准确）
- 能知道：档案系统中存在相关事件或系列的入口条目，具体在线可查性需核实
- 对应案例：Rendlesham Forest（UK National Archives）✓

### 修复 3：待核实记录行
**Before：**
- 能知道：公开叙事存在，进一步研究路径存在
- 不能推出：**官方档案已闭合或结论已知** ❌

**After：**
- 能知道：公开叙事存在，已有明确查档路径；但尚未找到精确官方 case file 编号 ✓
- 不能推出：叙事存在不等于档案已闭合；仍需 microfilm / finding aid / reading room 继续追溯 ✓
- 对应案例：Pan Am 1947（needs_review）✓（Pan Am 1947 现在仅出现在此行）

---

## PAN_AM_TREATMENT

### Pan Am 1947 在 v0.4.1 中的正确表述位置

| 位置 | 表述方式 | 状态 |
|------|---------|------|
| 策展导览第 05 小节 | "不是失败案例；已做 NARA probe + 597821 streaming scan，均未找到精确匹配；诚实保留 needs_review" | ✓ 正确 |
| 证据阅读矩阵"待核实记录"行 | "公开叙事存在，已有明确查档路径；但尚未找到精确官方 case file 编号" | ✓ 正确（修复后） |
| 证据阅读矩阵"官方目录条目"行 | ~~Pan Am 1947（Blue Book catalog）~~ | ❌ 已移除 |
| needs_review filter 显示 | "🔍 协助核实" + research_path 按钮 | ✓ 正确 |

**不变：**
- source_status = needs_review（不改变）
- caution_note 内容（v0.3.3 streaming scan 完整记录，已准确）
- source_url（NARA Project BLUE BOOK 入口页面）
- research_path（T-1206 microfilm / finding aid / reading room）

---

## NASA_WORDING_FIXES

### "NASA 确认该现象为异常或无法解释" → 已移除
**搜索结果：** index.html 和 README.md 中均无"NASA确认无法解释"或"NASA 确认无法解释"字符串（除 v0.3.x 旧 changelog 中的技术描述外）。
**修复后：** "NASA / WAR.GOV 档案存在记录，不等于机构认定该现象为异常来源或无法解释"

### source_status 语义澄清表（新增于 README.md）

| source_status | 含义 | 不等于 |
|--------------|------|--------|
| `verified` | 来源可追溯性——官方 .gov 或官方授权机构的原始材料可直接访问 | "现象被官方认定异常或外星" |
| `secondary_only` | 原始材料存在但在线可查性有限或需进一步核实 | "叙事不可信" |
| `needs_review` | 公开叙事存在且有查档路径，但尚未找到精确官方 case file 编号 | "案例虚假"或"档案已闭合" |

---

## DATA_NOTE_AUDIT

### 全部 10 个案例 caution_note 审计结果

| Case ID | Status | caution_note 评估 | 需要修改 |
|---------|--------|------------------|---------|
| gemini-vii-1965 | secondary_only | "bogey 对话需 NASA History Research Center 存档；现有描述基于历史文献整理" | 无需修改 ✓ |
| apollo-11-lunar-flash-1969 | secondary_only | "Apollo 11 具体事件描述需核实" | 无需修改 ✓ |
| apollo-12-occultation-1969 | verified | "官方 PDF 可验证；但现象解释仍未定；不得据此推断外星来源" | 无需修改 ✓（精确） |
| pan-am-1947 | needs_review | "需 NARA / Blue Book 编号核实；v0.3.3 streaming scan 零命中；T-1206 microfilm" | 无需修改 ✓（精确） |
| rendlesham-forest-1980 | secondary_only | "UK National Archives 入口存在；具体在线访问状态需逐一核实" | 无需修改 ✓ |
| uss-nimitz-tic-tac-2004 | verified | "DoD 2020 官方发布三段视频；PURSUE 引用；但原始视频发布于 defense.gov 新闻稿" | 无需修改 ✓ |
| gofast-2015 | verified | "与 TIC TAC 同来源；官方未最终定性；可能是气球" | 无需修改 ✓ |
| orbs-pacific-2023 | verified | "AARO FY2023 年报区分已解释与未解释案例；未声称任何异常为外星起源" | 无需修改 ✓ |
| fbi-louisville-1949 | secondary_only | "FBI FOIA Vault 存在入口；Louisville 1949 具体编号和在线可见性需查证" | 无需修改 ✓ |
| pentagon-2017-aatip | verified | "AATIP 项目有 DIA 官方背书；但具体案例内容可信度差异大；Elizondo 以个人身份发言" | 无需修改 ✓ |

**结论：data.js 所有 caution_note 无需修改，均已准确表达来源状态与局限性。**

---

## SOURCE_STATUS_COUNTS

| Status | Count | Cases |
|--------|-------|-------|
| `verified` | 5 | uss-nimitz-tic-tac-2004, gofast-2015, orbs-pacific-2023, pentagon-2017-aatip, apollo-12-occultation-1969 |
| `secondary_only` | 4 | gemini-vii-1965, apollo-11-lunar-flash-1969, rendlesham-forest-1980, fbi-louisville-1949 |
| `needs_review` | 1 | pan-am-1947 |
| **TOTAL** | **10** | |

**pan-am-1947 source_status: needs_review（未改变）✓**

---

## VALIDATION

### 数据完整性
```
CASE_COUNT=10, UNIQUE=10, SUM=10 ✓
verified=5, secondary_only=4, needs_review=1 ✓
pan-am-1947: status=needs_review ✓
```

### 语法检查
```
data.js node --check: PASS ✓
app.js node --check: PASS ✓
```

### HTTP 服务（python3 -m http.server 8765）
```
/ (index.html)  → 200 ✓
/style.css      → 200 ✓
/app.js         → 200 ✓
/data.js        → 200 ✓
/README.md      → 200 ✓
```

### 叙事内容验证
```
grep "NASA 确认无法解释" index.html README.md → 0 matches ✓
grep "NASA确认无法解释" index.html README.md  → 0 matches ✓
grep "NASA.*确认.*无法解释" index.html         → 0 matches ✓
grep "Pan Am.*Blue Book catalog" index.html     → 0 matches ✓
grep "needs_review" index.html                  → 3+ matches ✓
grep "exact match" index.html README.md         → 1+ match ✓
grep "T-1206" index.html README.md             → 1+ match ✓
```

### 叙事一致性确认
```
grep "NASA / WAR.GOV 档案存在记录，不等于机构认定" index.html → 1 match ✓
grep "Rendlesham Forest（UK National Archives）" index.html    → 1 match ✓
grep "Pan Am 1947（needs_review）" index.html                   → 1 match ✓
grep "待核实记录" index.html                                     → 1 match ✓
grep "官方目录入口" index.html                                   → 1 match ✓
```

### 死链检查
```
index.html: 0 '/home/' paths ✓
app.js: 0 '/home/' paths ✓
data.js: 0 '/home/' paths ✓
README.md: 0 '/home/' paths ✓
```

---

## REPORT_PATH

```
~/projects/uap-files-web/reports/uap_files_web_v0_4_1_narrative_consistency_report.md
```

---

## PREVIEW_COMMAND

```bash
cd ~/projects/uap-files-web
python3 -m http.server 8765
# 浏览器打开 http://localhost:8765
```

---

## NEXT_RECOMMENDED_ACTION

1. **视觉验证**：在真实浏览器（而非 HTTP server）打开 http://localhost:8765，重点确认：
   - 证据阅读矩阵在 390px 移动端下"不能推出"列和"对应案例"列正确换行
   - 三条阅读路线卡片 hover 状态正常
   - Pan Am 1947 只出现在"待核实记录"行，不出现在"官方目录入口"行

2. **阅读路线导航测试**：
   - 点击"档案边界"路线 → 应只显示 Historical+FBI 案例
   - Pan Am 1947 的"🔍 协助核实"按钮仍可展开 research_path

3. **长期维护**：如果未来增加新案例，注意：
   - 有 WAR.GOV/.gov 原始 PDF 的 → 可考虑 verified + 明确"官方 PDF 可验证"
   - 有官方 catalog 入口但在线可查性有限 → secondary_only + "入口存在但需核实"
   - 有公开叙事但精确编号待查 → needs_review + research_path
   - 绝不在 needs_review 案例的"你能知道什么"列写入"官方档案已闭合"
