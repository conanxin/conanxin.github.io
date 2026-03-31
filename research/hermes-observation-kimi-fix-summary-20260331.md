# Hermes 观测系统与 Kimi Auxiliary 修复摘要

日期：2026-03-31

## 一、问题概览

本次修复覆盖两类问题：

1. 观测系统失效
   - 3/23 之后观测看起来“停止”
   - `interaction_observations` 大量记录停留在 pending，后续被批量标记为 timeout
   - `response_length` 长期为 0，无法反映真实响应情况

2. Kimi auxiliary 噪声
   - 日志持续出现 `resolve_provider_client: unknown provider 'kimi'`
   - auxiliary vision / summary 链路伴随 401/403 噪声
   - 影响诊断可信度，并污染错误日志

---

## 二、根因结论

### 1. 观测系统根因

核心根因不是数据库本身，而是 live 代码路径与退出路径管理问题叠加：

#### 根因 A：修错了代码路径
实际线上运行路径不是：
- `~/hermes-agent`

而是：
- `/mnt/c/WINDOWS/system32/hermes-agent`

因此，前期对 `~/hermes-agent` 的修复没有进入真实 gateway 运行时。

#### 根因 B：live `run_agent.py` 缺少 observation 收口逻辑
线上 `run_conversation()` 中：
- 会进入多种 early return / error / interrupted / partial 路径
- 但这些路径没有统一 finalize observation
- 导致 observation 记录创建后停在 pending

#### 根因 C：live `hermes_state.py` 缺少 `record_observation()`
即使 `run_agent.py` 尝试记录 observation，线上 `SessionDB` 实现里也没有对应方法。

#### 根因 D：更新 observation 时访问了错误属性名
修复过程中发现，live `SessionDB` 使用的是：
- `self.db_path`

而不是：
- `self._db_path`

这会导致更新 observation 时静默失败。

---

### 2. Kimi auxiliary 根因

`~/.hermes/config.yaml` 中 auxiliary vision 配置为：

```yaml
auxiliary:
  vision:
    provider: kimi
    model: kimi/kimi-for-coding
```

但 live auxiliary router 识别的是：
- `kimi-coding`
- 或 `auto`

不识别：
- `kimi`

于是持续触发：
- `resolve_provider_client: unknown provider 'kimi'`

另外，当前环境实际可用 vision backend 为：
- `openai-codex`

因此强行指定 `kimi` 既不稳定，也不符合 live resolver 的支持范围。

---

## 三、实施的修复

### 1. 修复 live 代码路径
修复文件：
- `/mnt/c/WINDOWS/system32/hermes-agent/run_agent.py`
- `/mnt/c/WINDOWS/system32/hermes-agent/hermes_state.py`

并保留备份：
- `/mnt/c/WINDOWS/system32/hermes-agent/run_agent.py.bak.20260330_232029`

### 2. 为 live `run_agent.py` 增加 observation 生命周期管理
已增加：
- turn 开始时写入 pending observation
- `_last_observation_id` 跟踪当前 observation
- `_update_interaction_observation()` 用于统一完成态写回
- 多个 early return / error / interrupted / partial 分支统一补 observation finalize
- 正常结束路径补 observation update

### 3. 为 live `hermes_state.py` 补充 `record_observation()`
实现内容：
- 若 `interaction_observations` 表不存在则自动创建
- 写入 pending observation 基础字段
- 返回 row id 供后续 finalize 使用

### 4. 修正 `db_path` 访问
将错误的：
- `self._session_db._db_path`

改为正确的：
- `str(self._session_db.db_path)`

### 5. 修正 auxiliary vision 配置
修改前：
```yaml
auxiliary:
  vision:
    provider: kimi
    model: kimi/kimi-for-coding
```

修改后：
```yaml
auxiliary:
  vision:
    provider: auto
    model: ''
```

配置备份：
- `/home/conanxin/.hermes/config.yaml.pre-kimi-fix.20260331_000702`

这样 auxiliary vision 会自动选择当前真实可用 backend，而不是落到 unsupported provider 名称。

---

## 四、验证证据

### 1. synthetic 验证
通过 live 路径直接构造会话，验证 observation 可写入 completed：
- synthetic session `test_obs_1774885158`
- observation 成功写入：
  - `action_type = completed`
  - `response_length = 22`
  - `latency_ms = 9527`

### 2. 真实 Telegram 流量验证
修复后，真实消息已连续完成 observation 回写：

#### id 179
- `user_message_preview = 继续`
- `action_type = completed`
- `response_length = 1876`
- `latency_ms = 114857`

#### id 180
- `user_message_preview = 你好，观测测试`
- `action_type = completed`
- `response_length = 1325`
- `latency_ms = 69591`

#### id 181
- `user_message_preview = 继续`
- `action_type = completed`
- `response_length = 702`
- `latency_ms = 72491`

#### id 182
- `user_message_preview = 愿意，请继续`
- 后续已完成为 `completed`
- `response_length = 1201`
- `latency_ms = 190902`

#### id 183
- `user_message_preview = 我愿意，做2`
- `action_type = completed`
- `response_length = 3076`

这说明真实线上 Telegram 流量已经恢复：
- pending 创建正常
- completed 回写正常
- response_length / latency_ms 正常

### 3. Kimi auxiliary 配置验证
修复后，通过 live resolver 验证：
- `resolved_provider = openai-codex`
- `model = gpt-5.2-codex`
- `client = true`

并且重启后日志中未再新增：
- `unknown provider 'kimi'`

---

## 五、历史事故回顾

timeout 历史分布：
- 2026-03-21：101 条
- 2026-03-22：59 条
- 2026-03-23：11 条
- 总计：171 条

说明“观测系统 finalize 缺失”在 3/21 就已经存在，
并不是 3/23 才开始坏。

3/23 当天确实叠加了 provider/auxiliary 问题：
- Kimi quota / 403
- auxiliary 401 `User not found`
- summary 不可用
- 多种工具环境噪声

这些问题放大了用户体感，但不是 observation 数据失真的唯一根因。

---

## 六、清理与整理

### 1. 数据库备份
已创建：
- `/home/conanxin/.hermes/state.db.pre-cleanup.20260330_235701`

### 2. synthetic 测试记录清理
已删除 `test_obs_*` synthetic 观测记录 2 条，避免污染统计。

### 3. 当前统计（清理后）
- `timeout = 171`
- `completed = 6`
- `pending = 1`（当时为会话进行中产生，属正常）

---

## 七、当前状态结论

当前可判定：

### 已修复
- 观测系统 live 路径修复完成
- pending 长期积压问题修复完成
- response_length 记录逻辑恢复
- latency_ms 记录逻辑恢复
- auxiliary vision 的 `unknown provider 'kimi'` 噪声修复完成

### 仍存在但不阻塞主链路
- 历史 timeout 记录仍保留，用于审计
- auxiliary 链路中更早的 401/403 历史日志仍在文件中，但不代表当前持续发生
- Telegram fallback IP 日志仍可能出现，属于网络回退，不是本次主故障

---

## 八、建议的后续加固

1. 给 observation 增加 watchdog
   - pending 超过阈值自动转 timeout/interrupted
   - 写入明确 `error_events`

2. 在 gateway 启动日志中固定输出：
   - live code root
   - python executable
   - state.db path

3. 对 auxiliary provider 名称做统一 alias 归一化
   - 避免 `kimi` / `kimi-coding` 在不同模块行为不一致

4. 为 observation finalize 增加回归测试
   - 覆盖 completed / error / interrupted / partial / early return 分支

---

## 九、最终一句话总结

本次问题的本质不是“数据库坏了”，而是：

- 修复最初打在错误代码路径上
- live observation 系统缺少统一 finalize 机制
- 同期 auxiliary Kimi 配置不兼容造成额外噪声

现已完成 live 修复、真实流量验证、测试脏数据清理，以及 Kimi auxiliary 噪声止血。
