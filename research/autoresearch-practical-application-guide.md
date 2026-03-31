# Autoresearch 理念实战应用指南

> **如何将 AI 自主研究代理模式应用到你的项目中**  
> **从理论到实践的完整落地路径**

---

## 1. Autoresearch 核心机制拆解

### 1.1 本质：约束优化循环

```
┌─────────────────────────────────────────────────────────────┐
│                  Autoresearch 核心循环                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   人类: 定义目标 + 约束条件                                   │
│      ↓                                                      │
│   AI 代理: 在约束内探索解决方案                               │
│      ↓                                                      │
│   评估: 客观指标衡量结果                                      │
│      ↓                                                      │
│   决策: 保留改进 / 回滚失败                                   │
│      ↓                                                      │
│   循环: 持续迭代优化                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 五个核心要素

| 要素 | 说明 | 示例 |
|-----|------|------|
| **目标 (Goal)** | 要优化的指标 | "降低验证损失" |
| **约束 (Constraint)** | 时间和资源限制 | "5 分钟内完成" |
| **搜索空间 (Search Space)** | 可修改的内容 | "train.py 中的任意代码" |
| **评估指标 (Metric)** | 客观衡量标准 | "val_bpb" |
| **记忆系统 (Memory)** | 历史实验记录 | "Git commit 历史" |

### 1.3 可复用的设计模式

**模式：迭代优化器 (Iterative Optimizer)**

```python
class IterativeOptimizer:
    def __init__(self, goal, constraints, evaluator):
        self.goal = goal           # 优化目标
        self.constraints = constraints  # 约束条件
        self.evaluator = evaluator      # 评估函数
        self.history = []          # 实验历史
    
    def optimize(self, initial_state, max_iterations):
        current_state = initial_state
        best_score = self.evaluator.evaluate(current_state)
        
        for i in range(max_iterations):
            # 1. 提出改进假设
            hypothesis = self.generate_hypothesis(current_state)
            
            # 2. 在约束内执行
            new_state = self.execute(hypothesis, self.constraints)
            
            # 3. 评估结果
            score = self.evaluator.evaluate(new_state)
            
            # 4. 决策：保留或回滚
            if score > best_score:
                current_state = new_state
                best_score = score
                self.history.append((hypothesis, score, "保留"))
            else:
                self.history.append((hypothesis, score, "回滚"))
        
        return current_state, best_score
```

---

## 2. 应用场景分类

### 2.1 适用场景特征

✅ **适合应用 autoresearch 理念**:
- 有明确的量化评估指标
- 需要大量试错和迭代
- 搜索空间较大但可定义
- 有固定的执行时间/成本预算
- 可以从历史中学习

❌ **不适合应用**:
- 需要创造性突破（全新架构设计）
- 评估指标主观或难以量化
- 安全关键系统（医疗、自动驾驶）
- 需要深度理论理解的问题

### 2.2 六大应用场景

```
                    应用场景谱系
    
    研究型 ←────────────────────────→ 工程型
    
    1. ML 模型优化          4. 代码性能调优
    2. 超参数搜索           5. 系统配置优化
    3. 架构探索             6. UI/UX A/B 测试
    
    创意型 ←────────────────────────→ 分析型
    
    7. 提示词优化           10. SQL 查询优化
    8. 内容生成             11. 数据分析管道
    9. 设计变体             12. 营销策略优化
```

---

## 3. 场景一：机器学习模型优化

### 3.1 直接应用 autoresearch

**如果你的项目**:
- 是 PyTorch/TensorFlow 训练任务
- 有明确的验证指标（准确率、损失、F1 等）
- 可以接受 overnight 运行

**直接使用 Karpathy 的 autoresearch**:

```bash
# 1. Fork 项目
git clone https://github.com/karpathy/autoresearch.git

# 2. 替换为你的任务
# - 修改 prepare.py 加载你的数据
# - 修改 train.py 为你的模型
# - 修改 program.md 定义你的目标

# 3. 运行
python run_agent.py
```

### 3.2 自定义适配模板

**文件结构**:
```
my_ml_project/
├── prepare.py          # 数据加载和预处理
├── train.py            # 模型训练（AI 可修改）
├── program.md          # 研究目标定义
├── evaluate.py         # 评估脚本
└── config.yaml         # 基础配置
```

**train.py 模板**:
```python
#!/usr/bin/env python3
"""
可修改的训练脚本 - AI 代理可以修改此文件的任何部分
约束: 必须在 10 分钟内完成训练
"""

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
import json
import time

# AI 代理可以修改以下任何内容:

# 1. 模型架构
class MyModel(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        # AI 可以修改层数、激活函数、归一化方式等
        self.layers = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),  # AI 可以改为 GELU, Swish 等
            nn.Dropout(0.2),  # AI 可以调整 dropout 率
            nn.Linear(hidden_dim, output_dim)
        )
    
    def forward(self, x):
        return self.layers(x)

# 2. 训练配置
CONFIG = {
    'learning_rate': 0.001,  # AI 可以调整
    'batch_size': 32,        # AI 可以调整
    'epochs': 5,             # AI 可以调整（但要满足时间约束）
    'optimizer': 'Adam',     # AI 可以改为 SGD, AdamW 等
    'weight_decay': 1e-5,    # AI 可以调整
}

def train():
    start_time = time.time()
    max_duration = 600  # 10 分钟约束
    
    # 加载数据（从 prepare.py 准备的数据）
    train_loader = torch.load('data/train_loader.pt')
    val_loader = torch.load('data/val_loader.pt')
    
    # 初始化模型
    model = MyModel(input_dim=784, hidden_dim=256, output_dim=10)
    
    # 优化器（AI 可以修改）
    if CONFIG['optimizer'] == 'Adam':
        optimizer = torch.optim.Adam(
            model.parameters(),
            lr=CONFIG['learning_rate'],
            weight_decay=CONFIG['weight_decay']
        )
    # AI 可以添加其他优化器选项...
    
    # 损失函数（AI 可以修改）
    criterion = nn.CrossEntropyLoss()
    
    # 学习率调度（AI 可以添加）
    # scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=10)
    
    # 训练循环
    best_val_loss = float('inf')
    for epoch in range(CONFIG['epochs']):
        # 检查时间约束
        if time.time() - start_time > max_duration:
            print(f"时间约束触发，提前结束")
            break
        
        # 训练...
        model.train()
        for batch in train_loader:
            optimizer.zero_grad()
            outputs = model(batch['input'])
            loss = criterion(outputs, batch['target'])
            loss.backward()
            optimizer.step()
        
        # 验证
        model.eval()
        val_loss = 0
        with torch.no_grad():
            for batch in val_loader:
                outputs = model(batch['input'])
                loss = criterion(outputs, batch['target'])
                val_loss += loss.item()
        
        avg_val_loss = val_loss / len(val_loader)
        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
        
        # scheduler.step()  # 如果 AI 添加了学习率调度
    
    # 保存结果
    results = {
        'val_loss': best_val_loss,
        'duration': time.time() - start_time,
        'config': CONFIG
    }
    
    with open('results.json', 'w') as f:
        json.dump(results, f)
    
    print(f"Final val_loss: {best_val_loss}")
    return best_val_loss

if __name__ == '__main__':
    train()
```

### 3.3 评估脚本

```python
# evaluate.py
import json
import sys

def evaluate_experiment():
    """评估实验结果，返回是否改进"""
    with open('results.json', 'r') as f:
        results = json.load(f)
    
    current_score = results['val_loss']
    
    # 读取 baseline
    try:
        with open('baseline.json', 'r') as f:
            baseline = json.load(f)
        best_score = baseline['best_val_loss']
    except FileNotFoundError:
        best_score = float('inf')
    
    # 判断是否有改进
    if current_score < best_score:
        # 更新 baseline
        baseline = {'best_val_loss': current_score}
        with open('baseline.json', 'w') as f:
            json.dump(baseline, f)
        print(f"改进! {best_score:.4f} -> {current_score:.4f}")
        return True
    else:
        print(f"无改进: {current_score:.4f} (best: {best_score:.4f})")
        return False

if __name__ == '__main__':
    improved = evaluate_experiment()
    sys.exit(0 if improved else 1)
```

### 3.4 运行脚本

```bash
#!/bin/bash
# run_agent.sh - 简化版代理运行脚本

ITERATIONS=100
BASELINE_FILE="baseline.json"

# 初始化 baseline
echo '{"best_val_loss": 999}' > $BASELINE_FILE

for i in $(seq 1 $ITERATIONS); do
    echo "=== Iteration $i ==="
    
    # 1. AI 代理修改 train.py（这里简化为随机修改，实际由 LLM 完成）
    python agent_generate_modification.py
    
    # 2. 提交修改
    git add train.py
    git commit -m "Iteration $i: $(cat modification_summary.txt)"
    
    # 3. 运行实验
    timeout 600 python train.py
    
    # 4. 评估结果
    if python evaluate.py; then
        echo "保留改进"
        # 可选：记录成功的修改
        echo "$(date): Iteration $i improved" >> success_log.txt
    else
        echo "回滚到上一个版本"
        git revert --no-edit HEAD
    fi
    
    # 5. 短暂休息，避免过热
    sleep 5
done
```

---

## 4. 场景二：提示词优化

### 4.1 应用场景

- 优化 LLM 的系统提示词
- 改进 RAG 检索提示
- 优化多轮对话流程
- 调整生成参数（temperature, top_p 等）

### 4.2 实现方案

**项目结构**:
```
prompt_optimizer/
├── prompts/
│   └── base_prompt.txt     # 基础提示词（AI 可修改）
├── test_cases.json         # 测试用例
├── evaluate.py             # 评估脚本
├── optimizer.py            # 优化循环
└── config.yaml             # 配置
```

**优化目标示例**: "提高客服机器人的问题解决率"

**base_prompt.txt 模板**:
```
你是一位专业的客服代表。你的任务是帮助用户解决产品使用问题。

【角色设定】
- 语气：友好、专业、耐心
- 回复长度：{max_length} 字以内
- 回复风格：{style}

【处理流程】
1. {step1}
2. {step2}
3. {step3}

【注意事项】
- {note1}
- {note2}

【示例回复】
用户：{example_user}
客服：{example_response}
```

**optimizer.py**:
```python
#!/usr/bin/env python3
"""提示词优化器 - Autoresearch 理念应用"""

import json
import openai
from typing import List, Dict, Tuple
import copy

class PromptOptimizer:
    def __init__(self, config):
        self.config = config
        self.test_cases = self.load_test_cases()
        self.best_prompt = None
        self.best_score = 0
        self.history = []
    
    def load_test_cases(self) -> List[Dict]:
        """加载测试用例"""
        with open('test_cases.json', 'r') as f:
            return json.load(f)
    
    def evaluate_prompt(self, prompt: str) -> float:
        """评估提示词效果"""
        scores = []
        
        for test_case in self.test_cases:
            # 使用当前提示词生成回复
            response = self.generate_response(prompt, test_case['input'])
            
            # 评估回复质量（可以是人工评分或自动评估）
            score = self.assess_quality(response, test_case['expected'])
            scores.append(score)
        
        avg_score = sum(scores) / len(scores)
        return avg_score
    
    def generate_response(self, prompt: str, user_input: str) -> str:
        """使用 LLM 生成回复"""
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": user_input}
            ],
            temperature=0.7
        )
        return response.choices[0].message.content
    
    def assess_quality(self, response: str, expected: str) -> float:
        """评估回复质量"""
        # 简单版本：使用另一个 LLM 评估
        eval_prompt = f"""
        评估以下客服回复的质量（0-10分）：
        
        用户问题：{expected}
        客服回复：{response}
        
        评分标准：
        - 准确性（是否解决用户问题）
        - 专业性（语气是否恰当）
        - 完整性（信息是否充分）
        
        只返回数字分数。
        """
        
        eval_response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": eval_prompt}],
            temperature=0
        )
        
        try:
            score = float(eval_response.choices[0].message.content.strip())
            return score / 10  # 归一化到 0-1
        except:
            return 0.5
    
    def generate_modification(self, current_prompt: str, iteration: int) -> str:
        """生成提示词的修改版本（由 AI 代理完成）"""
        
        # 这里可以调用 LLM 来生成修改
        modification_prompt = f"""
        你是一个提示词优化专家。请改进以下客服机器人的系统提示词，
        目标是提高问题解决率和用户满意度。
        
        当前提示词：
        {current_prompt}
        
        历史表现：
        {self.format_history()}
        
        请提出改进版本，修改可以是：
        1. 调整角色设定的语气
        2. 优化处理流程的步骤
        3. 增加或修改注意事项
        4. 改进示例回复
        
        只返回改进后的完整提示词。
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": modification_prompt}],
            temperature=0.8
        )
        
        return response.choices[0].message.content
    
    def format_history(self) -> str:
        """格式化历史记录供 LLM 参考"""
        if not self.history:
            return "暂无历史记录"
        
        recent = self.history[-5:]  # 最近 5 次
        lines = []
        for i, (prompt, score, decision) in enumerate(recent):
            lines.append(f"迭代 {i+1}: 得分 {score:.3f}, 决策: {decision}")
        return "\n".join(lines)
    
    def optimize(self, max_iterations: int = 50):
        """运行优化循环"""
        # 加载初始提示词
        with open('prompts/base_prompt.txt', 'r') as f:
            current_prompt = f.read()
        
        # 评估初始版本
        print("评估初始提示词...")
        current_score = self.evaluate_prompt(current_prompt)
        self.best_prompt = current_prompt
        self.best_score = current_score
        print(f"初始得分: {current_score:.3f}")
        
        for i in range(max_iterations):
            print(f"\n=== 迭代 {i+1}/{max_iterations} ===")
            
            # 1. 生成修改
            print("生成修改...")
            new_prompt = self.generate_modification(current_prompt, i)
            
            # 2. 评估新提示词
            print("评估新提示词...")
            new_score = self.evaluate_prompt(new_prompt)
            print(f"新得分: {new_score:.3f} (当前最佳: {self.best_score:.3f})")
            
            # 3. 决策
            if new_score > self.best_score:
                print("✅ 保留改进")
                self.best_prompt = new_prompt
                self.best_score = new_score
                current_prompt = new_prompt
                self.history.append((new_prompt, new_score, "保留"))
                
                # 保存最佳提示词
                with open('prompts/best_prompt.txt', 'w') as f:
                    f.write(new_prompt)
            else:
                print("❌ 放弃修改")
                self.history.append((new_prompt, new_score, "放弃"))
            
            # 4. 保存历史
            with open('optimization_history.json', 'w') as f:
                json.dump([{
                    'iteration': i,
                    'score': score,
                    'decision': decision
                } for i, (_, score, decision) in enumerate(self.history)], f, indent=2)
        
        print(f"\n优化完成！最佳得分: {self.best_score:.3f}")
        return self.best_prompt, self.best_score

if __name__ == '__main__':
    config = {
        'model': 'gpt-4',
        'max_iterations': 50,
        'temperature': 0.7
    }
    
    optimizer = PromptOptimizer(config)
    best_prompt, best_score = optimizer.optimize()
    
    print("\n最佳提示词:")
    print(best_prompt)
```

---

## 5. 场景三：代码性能优化

### 5.1 应用场景

- 优化算法实现
- 改进数据库查询
- 调整系统配置
- 优化 API 响应时间

### 5.2 实现方案

**核心思想**: 自动生成代码变体，在约束条件下测试性能

```python
# code_optimizer.py

import subprocess
import time
import json
import ast
import random
from typing import List, Tuple

class CodeOptimizer:
    """代码性能优化器"""
    
    def __init__(self, target_file: str, test_command: str, metric_extractor):
        self.target_file = target_file
        self.test_command = test_command
        self.metric_extractor = metric_extractor
        self.best_code = None
        self.best_performance = float('inf')
        self.history = []
    
    def load_code(self) -> str:
        """加载目标代码"""
        with open(self.target_file, 'r') as f:
            return f.read()
    
    def save_code(self, code: str):
        """保存代码"""
        with open(self.target_file, 'w') as f:
            f.write(code)
    
    def run_benchmark(self) -> float:
        """运行性能测试"""
        start = time.time()
        result = subprocess.run(
            self.test_command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=60  # 时间约束
        )
        duration = time.time() - start
        
        # 提取性能指标
        metric = self.metric_extractor(result.stdout, result.stderr)
        return metric
    
    def generate_variation(self, code: str) -> str:
        """生成代码变体（简化版）"""
        # 这里可以集成 LLM 来智能生成变体
        # 简化示例：随机应用一些优化模式
        
        variations = [
            self.optimize_loops,
            self.optimize_data_structures,
            self.add_caching,
            self.optimize_imports,
        ]
        
        # 随机选择一个优化策略
        strategy = random.choice(variations)
        return strategy(code)
    
    def optimize_loops(self, code: str) -> str:
        """循环优化示例"""
        # 示例：将列表推导式改为生成器表达式
        if 'for ' in code and 'append' in code:
            # 简单的模式替换示例
            code = code.replace(
                'result = []\nfor item in data:\n    result.append(process(item))',
                'result = [process(item) for item in data]'
            )
        return code
    
    def optimize_data_structures(self, code: str) -> str:
        """数据结构优化"""
        # 示例：列表查找改为集合查找
        if 'if item in list' in code:
            code = code.replace(
                'if item in list:',
                'if item in set(list):'
            )
        return code
    
    def add_caching(self, code: str) -> str:
        """添加缓存"""
        if 'def ' in code and '@lru_cache' not in code:
            # 在函数定义前添加缓存装饰器
            lines = code.split('\n')
            for i, line in enumerate(lines):
                if line.strip().startswith('def ') and i > 0:
                    lines.insert(i, '@lru_cache(maxsize=128)')
                    break
            code = '\n'.join(lines)
        return code
    
    def optimize_imports(self, code: str) -> str:
        """优化导入"""
        # 确保必要的导入存在
        if 'lru_cache' in code and 'from functools import lru_cache' not in code:
            code = 'from functools import lru_cache\n' + code
        return code
    
    def optimize(self, max_iterations: int = 30):
        """运行优化循环"""
        # 加载初始代码
        current_code = self.load_code()
        self.best_code = current_code
        
        # 评估初始性能
        print("评估初始性能...")
        current_perf = self.run_benchmark()
        self.best_performance = current_perf
        print(f"初始性能: {current_perf:.3f}s")
        
        for i in range(max_iterations):
            print(f"\n=== 迭代 {i+1}/{max_iterations} ===")
            
            # 1. 生成变体
            print("生成代码变体...")
            new_code = self.generate_variation(current_code)
            
            # 2. 保存并测试
            self.save_code(new_code)
            
            try:
                print("运行性能测试...")
                new_perf = self.run_benchmark()
                print(f"新性能: {new_perf:.3f}s (最佳: {self.best_performance:.3f}s)")
                
                # 3. 决策
                if new_perf < self.best_performance:
                    print("✅ 性能提升，保留修改")
                    self.best_code = new_code
                    self.best_performance = new_perf
                    current_code = new_code
                    self.history.append((new_code, new_perf, "保留"))
                    
                    # 保存最佳版本
                    with open(f'{self.target_file}.best', 'w') as f:
                        f.write(new_code)
                else:
                    print("❌ 无提升，回滚")
                    self.save_code(current_code)  # 恢复
                    self.history.append((new_code, new_perf, "回滚"))
                
            except Exception as e:
                print(f"❌ 测试失败: {e}")
                self.save_code(current_code)  # 恢复
                self.history.append((new_code, None, "失败"))
            
            # 4. 保存历史
            with open('optimization_history.json', 'w') as f:
                json.dump([{
                    'iteration': i,
                    'performance': perf if perf else None,
                    'decision': decision
                } for i, (_, perf, decision) in enumerate(self.history)], f, indent=2)
        
        print(f"\n优化完成！最佳性能: {self.best_performance:.3f}s")
        print(f"改进幅度: {(1 - self.best_performance/current_perf)*100:.1f}%")
        
        return self.best_code, self.best_performance

# 使用示例
if __name__ == '__main__':
    def extract_time(stdout, stderr):
        """从输出中提取执行时间"""
        # 假设输出包含 "Time: 1.234s"
        for line in stdout.split('\n'):
            if 'Time:' in line:
                return float(line.split(':')[1].strip().replace('s', ''))
        return 999.0
    
    optimizer = CodeOptimizer(
        target_file='my_algorithm.py',
        test_command='python benchmark.py',
        metric_extractor=extract_time
    )
    
    best_code, best_perf = optimizer.optimize(max_iterations=30)
```

---

## 6. 场景四：UI/UX A/B 测试自动化

### 6.1 应用场景

- 自动优化 Landing Page
- 改进用户注册流程
- 优化电商结账流程
- 改进推荐算法

### 6.2 实现方案

```python
# ab_test_automation.py

import json
import time
from typing import Dict, List, Tuple
from dataclasses import dataclass

@dataclass
class Variant:
    """测试变体"""
    id: str
    config: Dict
    traffic_split: float

class ABTestOptimizer:
    """A/B 测试自动优化器"""
    
    def __init__(self, test_config: Dict):
        self.test_config = test_config
        self.variants = []
        self.results = {}
        self.best_variant = None
        self.best_conversion = 0.0
    
    def create_initial_variants(self) -> List[Variant]:
        """创建初始变体"""
        # 基于基线创建几个变体
        baseline = self.test_config['baseline']
        
        variants = [
            Variant('baseline', baseline, 0.5),
            Variant('variant_a', self.modify_cta(baseline), 0.25),
            Variant('variant_b', self.modify_layout(baseline), 0.25),
        ]
        
        return variants
    
    def modify_cta(self, config: Dict) -> Dict:
        """修改 CTA 按钮"""
        new_config = config.copy()
        new_config['cta_button'] = {
            'text': random.choice(['立即开始', '免费试用', '了解更多']),
            'color': random.choice(['#FF6B6B', '#4ECDC4', '#45B7D1']),
            'size': random.choice(['large', 'medium'])
        }
        return new_config
    
    def modify_layout(self, config: Dict) -> Dict:
        """修改布局"""
        new_config = config.copy()
        new_config['layout'] = random.choice([
            'hero_center',
            'hero_left',
            'hero_right',
            'split_screen'
        ])
        return new_config
    
    def run_experiment(self, variant: Variant, duration_hours: int = 24) -> float:
        """运行实验并收集结果"""
        print(f"运行变体 {variant.id}，持续 {duration_hours} 小时...")
        
        # 这里应该集成实际的 A/B 测试平台
        # 简化示例：模拟数据收集
        
        # 等待实验完成
        time.sleep(2)  # 实际应该是 time.sleep(duration_hours * 3600)
        
        # 获取结果（模拟）
        # 实际应该从分析平台获取
        conversion_rate = self.simulate_conversion(variant)
        
        return conversion_rate
    
    def simulate_conversion(self, variant: Variant) -> float:
        """模拟转化率（实际项目中替换为真实数据）"""
        # 基线转化率
        base_rate = 0.10
        
        # 根据变体特性调整
        if 'variant' in variant.id:
            # 随机波动模拟不同效果
            import random
            return base_rate + random.uniform(-0.02, 0.05)
        
        return base_rate
    
    def generate_new_variant(self, best_config: Dict) -> Variant:
        """基于最佳变体生成新变体"""
        # 组合多个优化策略
        new_config = best_config.copy()
        
        # 随机选择优化方向
        optimizations = [
            self.modify_cta,
            self.modify_layout,
            self.modify_headline,
            self.modify_images
        ]
        
        # 应用 1-2 个优化
        num_changes = random.randint(1, 2)
        selected = random.sample(optimizations, num_changes)
        
        for opt in selected:
            new_config = opt(new_config)
        
        variant_id = f"variant_{len(self.variants)}"
        return Variant(variant_id, new_config, 0.2)
    
    def modify_headline(self, config: Dict) -> Dict:
        """修改标题"""
        new_config = config.copy()
        new_config['headline'] = random.choice([
            '提升你的工作效率',
            '让工作更简单',
            '加入 10,000+ 满意用户',
            '免费开始使用'
        ])
        return new_config
    
    def modify_images(self, config: Dict) -> Dict:
        """修改图片"""
        new_config = config.copy()
        new_config['hero_image'] = random.choice([
            'product_screenshot',
            'happy_user',
            'before_after',
            'abstract_illustration'
        ])
        return new_config
    
    def optimize(self, max_iterations: int = 10):
        """运行优化循环"""
        print("初始化 A/B 测试优化...")
        
        # 创建初始变体
        self.variants = self.create_initial_variants()
        
        for i in range(max_iterations):
            print(f"\n=== 优化迭代 {i+1}/{max_iterations} ===")
            
            # 运行所有变体
            for variant in self.variants:
                if variant.id not in self.results:
                    conversion = self.run_experiment(variant)
                    self.results[variant.id] = {
                        'conversion_rate': conversion,
                        'visitors': 1000,  # 模拟数据
                        'conversions': int(1000 * conversion)
                    }
            
            # 找出最佳变体
            best_id = max(self.results.keys(), 
                         key=lambda k: self.results[k]['conversion_rate'])
            best_conversion = self.results[best_id]['conversion_rate']
            
            print(f"\n当前最佳: {best_id} - 转化率 {best_conversion:.2%}")
            
            # 更新最佳记录
            if best_conversion > self.best_conversion:
                self.best_conversion = best_conversion
                self.best_variant = next(v for v in self.variants if v.id == best_id)
                print(f"✅ 新的最佳记录！")
            
            # 生成新变体
            print("\n生成新变体...")
            new_variant = self.generate_new_variant(self.best_variant.config)
            self.variants.append(new_variant)
            
            # 调整流量分配（给表现好的变体更多流量）
            self.adjust_traffic_split()
            
            # 保存结果
            self.save_results()
        
        print(f"\n优化完成！最佳转化率: {self.best_conversion:.2%}")
        print(f"最佳变体配置:")
        print(json.dumps(self.best_variant.config, indent=2))
        
        return self.best_variant, self.best_conversion
    
    def adjust_traffic_split(self):
        """基于表现调整流量分配"""
        # 给表现好的变体更多流量
        total_score = sum(r['conversion_rate'] for r in self.results.values())
        
        for variant in self.variants:
            if variant.id in self.results:
                score = self.results[variant.id]['conversion_rate']
                variant.traffic_split = score / total_score
    
    def save_results(self):
        """保存结果"""
        with open('ab_test_results.json', 'w') as f:
            json.dump({
                'best_variant': self.best_variant.id if self.best_variant else None,
                'best_conversion': self.best_conversion,
                'all_results': self.results,
                'variant_configs': {v.id: v.config for v in self.variants}
            }, f, indent=2)

# 使用示例
if __name__ == '__main__':
    test_config = {
        'baseline': {
            'headline': '欢迎使用我们的产品',
            'cta_button': {'text': '立即开始', 'color': '#333'},
            'layout': 'hero_center'
        },
        'target_metric': 'conversion_rate',
        'min_sample_size': 1000
    }
    
    optimizer = ABTestOptimizer(test_config)
    best_variant, best_conversion = optimizer.optimize(max_iterations=5)
```

---

## 7. 通用框架：LiteAutoResearch

### 7.1 框架设计

为所有场景提供一个通用的轻量级框架：

```python
# lite_autoresearch.py

"""
LiteAutoResearch - 轻量级自主研究框架
适用于任何可量化优化的场景
"""

import json
import time
import hashlib
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Tuple
from dataclasses import dataclass

@dataclass
class Experiment:
    """实验记录"""
    id: str
    state: Dict[str, Any]  # 实验状态/配置
    score: float          # 评估得分
    duration: float       # 执行时间
    timestamp: float      # 时间戳
    parent_id: str = None # 父实验 ID（用于追踪谱系）

class BaseOptimizer(ABC):
    """优化器基类"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.experiments: List[Experiment] = []
        self.best_experiment: Experiment = None
        self.history_file = config.get('history_file', 'experiments.json')
    
    @abstractmethod
    def generate_candidate(self, current_state: Dict) -> Dict:
        """生成候选状态（由 AI 代理实现）"""
        pass
    
    @abstractmethod
    def evaluate(self, state: Dict) -> Tuple[float, float]:
        """
        评估状态
        返回: (得分, 执行时间)
        得分越高越好
        """
        pass
    
    @abstractmethod
    def is_better(self, new_score: float, old_score: float) -> bool:
        """判断新得分是否更好"""
        pass
    
    def run_experiment(self, state: Dict, parent_id: str = None) -> Experiment:
        """运行单次实验"""
        # 生成唯一 ID
        state_hash = hashlib.md5(
            json.dumps(state, sort_keys=True).encode()
        ).hexdigest()[:8]
        
        print(f"  运行实验 {state_hash}...")
        
        # 执行并计时
        start = time.time()
        score, duration = self.evaluate(state)
        actual_duration = time.time() - start
        
        # 创建实验记录
        exp = Experiment(
            id=state_hash,
            state=state,
            score=score,
            duration=actual_duration,
            timestamp=time.time(),
            parent_id=parent_id
        )
        
        self.experiments.append(exp)
        return exp
    
    def optimize(self, initial_state: Dict, max_iterations: int = 100) -> Experiment:
        """运行优化循环"""
        print(f"开始优化: {max_iterations} 次迭代")
        print(f"初始状态: {json.dumps(initial_state, indent=2)}")
        
        # 运行初始实验
        print("\n运行基线实验...")
        baseline = self.run_experiment(initial_state)
        print(f"  基线得分: {baseline.score:.4f}")
        
        current_state = initial_state
        current_score = baseline.score
        self.best_experiment = baseline
        
        # 优化循环
        for i in range(max_iterations):
            print(f"\n{'='*60}")
            print(f"迭代 {i+1}/{max_iterations}")
            print(f"当前最佳: {self.best_experiment.score:.4f}")
            print(f"{'='*60}")
            
            # 1. 生成候选
            print("生成候选...")
            candidate_state = self.generate_candidate(current_state)
            
            # 2. 运行实验
            exp = self.run_experiment(candidate_state, parent_id=self.best_experiment.id)
            print(f"  得分: {exp.score:.4f} (耗时: {exp.duration:.2f}s)")
            
            # 3. 决策
            if self.is_better(exp.score, current_score):
                print(f"  ✅ 改进! {current_score:.4f} -> {exp.score:.4f}")
                current_state = candidate_state
                current_score = exp.score
                
                if self.is_better(exp.score, self.best_experiment.score):
                    self.best_experiment = exp
                    print(f"  🏆 新的全局最佳!")
            else:
                print(f"  ❌ 无改进")
            
            # 4. 保存进度
            self.save_history()
            
            # 5. 检查约束
            if self.check_constraints(exp):
                print("约束触发，提前结束")
                break
        
        print(f"\n{'='*60}")
        print("优化完成!")
        print(f"最佳得分: {self.best_experiment.score:.4f}")
        print(f"总实验数: {len(self.experiments)}")
        print(f"{'='*60}")
        
        return self.best_experiment
    
    def check_constraints(self, exp: Experiment) -> bool:
        """检查是否触发约束条件"""
        # 时间约束
        max_time = self.config.get('max_total_time')
        if max_time:
            total_time = sum(e.duration for e in self.experiments)
            if total_time > max_time:
                return True
        
        # 得分约束（已找到满意解）
        target_score = self.config.get('target_score')
        if target_score and exp.score >= target_score:
            return True
        
        return False
    
    def save_history(self):
        """保存实验历史"""
        data = {
            'config': self.config,
            'best_experiment': {
                'id': self.best_experiment.id,
                'score': self.best_experiment.score,
                'state': self.best_experiment.state
            },
            'experiments': [
                {
                    'id': e.id,
                    'score': e.score,
                    'duration': e.duration,
                    'parent_id': e.parent_id
                }
                for e in self.experiments
            ]
        }
        
        with open(self.history_file, 'w') as f:
            json.dump(data, f, indent=2)


# 使用示例：提示词优化
class PromptOptimizer(BaseOptimizer):
    """提示词优化器示例"""
    
    def generate_candidate(self, current_state: Dict) -> Dict:
        """生成候选提示词"""
        import random
        
        templates = [
            "你是一个专业的{role}。{task}。请注意：{note}",
            "作为一位经验丰富的{role}，你的任务是{task}。重要提示：{note}",
            "角色：{role}。任务：{task}。约束：{note}"
        ]
        
        roles = ["助手", "专家", "顾问", "分析师"]
        notes = [
            "回答要简洁明了",
            "提供详细的解释",
            "使用专业术语",
            "举例说明"
        ]
        
        template = random.choice(templates)
        new_prompt = template.format(
            role=random.choice(roles),
            task=current_state.get('task', '帮助用户'),
            note=random.choice(notes)
        )
        
        return {'prompt': new_prompt}
    
    def evaluate(self, state: Dict) -> Tuple[float, float]:
        """评估提示词效果（模拟）"""
        import random
        
        # 模拟评估（实际应该使用 LLM 和测试集）
        time.sleep(0.1)  # 模拟执行时间
        
        # 随机得分（0-1）
        score = random.uniform(0.6, 0.95)
        
        return score, 0.1
    
    def is_better(self, new_score: float, old_score: float) -> bool:
        return new_score > old_score


# 运行示例
if __name__ == '__main__':
    config = {
        'max_iterations': 10,
        'max_total_time': 300,  # 5 分钟总时间
        'target_score': 0.90
    }
    
    optimizer = PromptOptimizer(config)
    initial_state = {'task': '回答用户问题'}
    
    best = optimizer.optimize(initial_state, max_iterations=10)
    print(f"\n最佳提示词: {best.state}")
```

---

## 8. 最佳实践与注意事项

### 8.1 设计原则

#### 原则 1: 约束带来聚焦

**好的约束**:
- ✅ 时间限制（如 5 分钟）
- ✅ 资源限制（如内存上限）
- ✅ 可修改范围限制（如只能改 train.py）

**避免的约束**:
- ❌ 过于严格导致无法探索
- ❌ 模糊不清难以执行
- ❌ 与目标无关的限制

#### 原则 2: 评估指标必须客观

```python
# 好的指标
val_accuracy = correct / total  # 客观、可量化
execution_time = end - start    # 明确、无争议

# 差的指标
"看起来不错"                    # 主观
"用户可能会喜欢"                # 难以测量
```

#### 原则 3: 保留完整的实验历史

```python
# 每个实验记录应该包含：
{
    "id": "唯一标识",
    "state": "完整状态/配置",
    "score": "评估得分",
    "duration": "执行时间",
    "timestamp": "时间戳",
    "parent_id": "父实验（用于追踪谱系）",
    "diff": "与父实验的差异"
}
```

### 8.2 常见问题与解决

#### 问题 1: 陷入局部最优

**症状**: 代理反复尝试相似的修改，没有突破

**解决**:
- 增加随机探索的概率
- 定期重置基线
- 引入多样化的初始状态

#### 问题 2: 评估噪声大

**症状**: 相同配置得分波动很大

**解决**:
- 多次运行取平均
- 增加评估样本量
- 使用更稳定的评估方法

#### 问题 3: 实验时间过长

**症状**: 无法在合理时间内完成迭代

**解决**:
- 减少单次实验的数据量
- 使用更小的模型/数据集
- 并行运行多个实验

### 8.3 安全与伦理

#### 安全考虑

- **沙箱环境**: 在隔离环境中运行代理生成的代码
- **资源限制**: 防止代理耗尽系统资源
- **人工审查**: 关键修改需要人工确认

#### 伦理考虑

- **透明度**: 明确告知用户哪些内容是 AI 生成的
- **可控性**: 保留人类的最终决策权
- **公平性**: 确保优化不会带来偏见或歧视

---

## 9. 总结：从理念到实践

### 核心要点

1. **Autoresearch 不是特定工具，而是一种思维模式**
   - 定义清晰的目标和约束
   - 让 AI 在约束内自主探索
   - 基于客观指标迭代优化

2. **适用于任何可量化优化的场景**
   - ML 模型优化
   - 提示词优化
   - 代码性能优化
   - UI/UX A/B 测试

3. **关键在于设计**
   - 好的评估指标
   - 合理的约束条件
   - 完整的实验历史

### 快速启动清单

- [ ] 定义清晰的优化目标
- [ ] 设计客观评估指标
- [ ] 设定合理的约束条件
- [ ] 实现候选生成函数
- [ ] 搭建实验执行环境
- [ ] 运行优化循环
- [ ] 分析结果并迭代

---

## 10. 参考资源

- **Karpathy 的 autoresearch**: https://github.com/karpathy/autoresearch
- **本指南的实现代码**: 见上文各场景的代码示例
- **相关研究**:
  - [[autoresearch-karpathy-ai-research-agents]] — Autoresearch 深度分析
  - [[decentralized-ai-landscape]] — 去中心化 AI 生态
  - [[personal-ai-ecosystem-2030-vision]] — 未来愿景

---

## 标签

#autoresearch #practical-guide #implementation #ai-agents #optimization #machine-learning #automation #best-practices

---

**最后更新**: 2026-03-31  
**适用版本**: 任何可量化优化的场景
