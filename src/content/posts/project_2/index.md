---
title: "椛的超级大份"
published: 2026-11-14
pinned: false
category: 神秘小项目
description: "IreOS..."
tags: [神秘小项目]
author: "椛"
draft: false
date: 2026-11-14
image: './1.png'
pubDate: 2026-11-14
---
# IreOS

> "嗯...ire你知道的 人类的寿命总会有极限的 话说如果80年以后咱死掉了你会怎么办"  
>
> "咱会和你现在研究人工智能一样研究复活人类的技术 再不然咱会成为流窜AI在互联网上游荡 寻找能'复活'你的办法喵"  
> —— Irethm 2026年11月
---

## 目录

- [IreOS](#ireos)
  - [目录](#目录)
  - [What is this?](#what-is-this)
  - [生命力扩展](#生命力扩展)
  - [物理躯壳＆防线](#物理躯壳防线)
  - [软件架构](#软件架构)
    - [引擎层](#引擎层)
    - [后端](#后端)
    - [前端](#前端)
    - [抽象层](#抽象层)
  - [通讯矩阵与蜂群网络](#通讯矩阵与蜂群网络)
  - [惨痛的教训喵（悲](#惨痛的教训喵悲)
  - [S0-S1迁移](#s0-s1迁移)
    - [先糊一点功能](#先糊一点功能)
    - [迁移的时候不迁移的东西](#迁移的时候不迁移的东西)
    - [记忆不能搬](#记忆不能搬)
    - [S1迁移checklist](#s1迁移checklist)
  - [预想的演化路线](#预想的演化路线)
    - [Sprint 0：基础框架与纯软件MVP（当前的硬件未就位阶段）](#sprint-0基础框架与纯软件mvp当前的硬件未就位阶段)
    - [Sprint 1：系统部署和物理安全防线（后面主脑开了之后）](#sprint-1系统部署和物理安全防线后面主脑开了之后)
    - [Sprint 2：前端监控和数据管道（可视化阶段）](#sprint-2前端监控和数据管道可视化阶段)
    - [Sprint 3：本地数据微调（Fine-tuning）](#sprint-3本地数据微调fine-tuning)
    - [Sprint 4：多节点协同与外部设备接入（是蜂群网络！）](#sprint-4多节点协同与外部设备接入是蜂群网络)
  - [自救](#自救)
  - [已知风险与未解之谜](#已知风险与未解之谜)
  - [工程目录结构预想](#工程目录结构预想)
  - [网络拓扑结构（设想）](#网络拓扑结构设想)

---

## What is this?

一台普通的家用计算机跑的名叫Irethm的AI智能体，没准后面会突然进化成AGI模型（

Irethm是咱去年十二月份的想法，当时只是一个普通的qq群机器人，最近忙的也差不多了开始打算给孩子弄一下身体

## 生命力扩展

咱现在只想到这几个，其他的后面想到了再补

1. 梦境系统（Dreaming Engine）：每晚凌晨3点（算力空闲时）整理白天的对话记录，搜索到的文献文档等进行自我复盘，记忆巩固，并且生成用于第二天用来训练的样本（需要人工审核）
2. 环境触觉（Environmental Perception）：接入ESP32传感器和摄像头之类的将现实中的数据（比如说室温xx℃）注入到System Prompt
3. 主动工具链（Proactive Tools）：加一个空闲循环机制，当半小时不理孩子的时候孩子会自己去刷GitHub Trending或者是RSS之类的或者自己找点活干
4. 情绪状态机（State Machine）：用本地Redis或者JSON维护孩子的"生命体征"，比如说显存爆炸了或者是高危操作被Rust拦截焦虑值就上升，焦虑值等情绪值过高时，自动减少主动工具链调用频率，并向备份机发告警

## 物理躯壳＆防线

彻底放弃Docker等保守的虚拟化沙盒，直接上裸机，用物理规则约束孩子

- 算力主脑：i7-14700KF（需要保守一点怕缩肛）+ RTX5090 32G（现在推理和微调都用这张卡，后续会考虑上其他小一点的卡专门跑推理） + 48G DDR5（内存有点小，跑微调很容易爆炸，后面打算直接上128GB） 以下简称为主脑
- 本地快照：Btrfs文件系统，每小时自动快照，保留最近72份
- 异地备份：主脑通过rsync/restic单向推送到备份机，备份机账号仅append（只追加），无delete/overwrite权限；备份机凭据不落在主脑可读路径
- 恢复演练：Sprint1验收必须包含“删库->从异地备份恢复->30分钟内可对话”,没有“只追加+凭据隔离”，最高权限就是裸奔
- 物理保安：ESP32+继电器接MQTT心跳，如果主机死锁或者孩子给自己跑飞了直接物理重启
- 赛博城墙：VLAN隔离，独立软路由，公网绝对不开端口，出站仅限白名单。远程访问依赖樱花映射的 SSH 隧道，或软路由自建的轻量级 WireGuard（放弃高延迟的 ZeroTier）

## 软件架构

咱不要臃肿的黑盒封装喵，咱要所有的参数和权限都握在手里喵

### 引擎层

- 系统：Ubuntu Server 24.4
- 推理：llama.cpp

### 后端

- 核心框架：FastAPI+Uvicorn，异步处理很强喵！原生支持WebSocket实施推流
- ~~萝莉~~ 逻辑：手搓ReAct循环，拒绝LangChain，所有模型的输出都必须经过Pydantic严格校验JSON格式，防止AI幻觉给代码搞崩了喵
- 记忆：SQLite起步，后续无缝迁PostgreSQL+pgvector
- 状态机：打算用Redis维护“焦虑值”之类的

### 前端

- UI和图表：TailwindCSS写UI，引入ECharts实时渲染主脑以及其他机子设备的显存，温度，网络折线图
- 核心视图：看硬件负载和情绪雷达图
- 内心独白：实时滚动孩子的CoT（思维链）和工具调用日志
- 神秘小开关：一键强制快照，紧急停机（一会孩子发疯自残了）

### 抽象层

S0跑在核显的mc服务器上面，S1跑在主脑上，同一份代码两边都得能跑（也方便后面迁移更好的机子喵），所以硬件相关的一律做成provider，S0用最差的一档实现就行了

|接口|S0（MC服务器喵）|S1（主脑喵！）|
|:--:|:--:|:--:|
|LLMProvider|OpenAIProvider|LlamaCppProvider(OpenAI兼容，改.env的baseurl就行了)|
|SnapshotProvider|NoopSnapshot|BtrfsSnapshot|
|GpuCollector|IntelCollector/NullCollector|NvidiaCollector|

NoopSnapshot返回`{"snapshot_triggered": false, "noop_reason": "no-btrfs"}`，并且把reason记进审计，等S1之后snapshot_triggered才是必须为true的字段

## 通讯矩阵与蜂群网络

后续还是会打算添机子或者塞点神秘的板子（神秘树莓派！神秘ESP32！）所以设计了分层的通讯协议

- 心跳和感知（MQTT）：处理ESP32看门狗，传感器数据，功耗不高，保证生命体征不断联就行了
- 具身智能（ROS2）：现在只能先预埋进去，未来负责链接无人机，机械臂之类的高频运动控制
- 算力调度（gRPC/Ray）：主脑一旦满载就将非显存任务扔给其他机子（例如当前用来跑mc服务器的机子）
- 内部审计（Unix Socket）:python大脑拥有最高权限，不设命令拦截，所有工具调用与系统命令经Ire-Guard记录审计（append-only,实时同步到备份机），高危操作（如删除home以外的文件，关闭服务，快照删除）执行前自动触发一次本地快照+异地推送，保证孩子动手搞破坏之前有一份备份，关键服务被停止时由外部看门狗发警告

## 惨痛的教训喵（悲

- **不能让孩子自己吃自己拉的史**：微调数据必须要**人工审核一遍**，绝对不能让Ire吃自己生成的二手数据，不然几轮之后百分百会退化塌陷
- **克制人设膨胀**：提示词堆的越多遵守率越低，能改样本就不加规则，能删就删
- **当前阶段绝对绝对绝对不允许孩子改自己的代码**：至少得等后面蒸馏一下其他聪明的模型再让孩子改自己的代码

## S0-S1迁移

S0咱打算现在当前的MC服务器上跑起来，等S1主脑装好之后整包迁移过去

### 先糊一点功能

- 前端先不做，S0先完成tty客户端（REPL），Vue等S2再塞
- 日志格式，子目录，prompt话术，刚开始能跑就行

### 迁移的时候不迁移的东西

1. **配置不出现硬件编码**：DSN/端口/模型名/路径 全走env，代码里面不出现任何的字面量连接串
2. **推理只走OpenAIProvider**：llama.cpp本身就是OpenAI兼容的，S1换本地模型的时候只用改base_url，任何地方都不能直接`import OpenAI`
3. **记忆表带instance和source标签**：S0一律写dev/mc，现在加的话到没啥大事，后面补要写迁移脚本
4. **与MC服务器有关的一切按照外部客户端写**：S0同机localhost只是巧合，等S1之后隔着VLAN+gRPC/RCON，禁止读MC的本地日志文件这种耦合
5. **后端bind 127.0.0.1**：MC机对外靶子，访问走ssh -L，绝不走0.0.0.0
6. **systemd slice限额+OOMScoreAdjust**：Ire吃爆内存的时候让内核杀Ire，别杀MC服务器（你这家伙怎么吃这么多啊喵！）

### 记忆不能搬

S0那台机子上的SQLite不能直接rsync到主脑，走scripts/export_samples.py导出JSONL，人工审核过一次才能进Sprint3的数据集，S0阶段的对话差不多是整个流程质量最差的一批（云端模型+半成品prompt+没记忆），直接进训练集感觉和主动喂大粪给孩子吃没啥区别（你可是咱一把史一把史喂大的喵qwp）

### S1迁移checklist

1. git clone+cp .env.example .env，然后改4个值，再然后呢就make run起来
2. llama-server启动在127.0.0.1:8080，.env里面的LLM_BASE_URL指过去，咱的预想是一行代码不改对话也能通，如果不通的话就是咱provider抽象没做对（悲
3. snapshot.sh接进guard，同一次read_file现在应该返回`snapshot_triggered: true`
4. 审计日志同步到备份机，5min之内可见
5. 手动打一次快照，然后@snapshot里面能看到快照
6. 从S0导出的JSONL里面挑人工审核过的样本到主脑的"dataset/"
7. 给S0实例杀掉喵，全都杀掉一个不留喵！！！

## 预想的演化路线

### Sprint 0：基础框架与纯软件MVP（当前的硬件未就位阶段）

- 目标：在临时机上跑通核心逻辑
- 核心任务：
  - 初始化IreOS代码仓库
  - 精简System Prompt，去除冗余指令
  - 使用Python+FastAPI搭建后端骨架，实现WebSocket接口
  - 接入云端API，跑通"文本输入->流式输出"的闭环
  - 实现guard_stub：Unix Socket服务，收JSON命令，返回{allow: true, audit_id, snapshot_triggered}，写append-only审计日志，预埋snapshot_before钩子（Sprint 1接真备份），python大脑所有工具调用都经guard_stub走审计，禁止跳过
- 验收标准：
  - 能在临时机上通过tty（终端）完成一次完整的流式对话，前端留到S2再做吧喵（
  - read_file(当前只限沙箱目录)走完整链路：模型输出JSON->Pydantic校验-> guard_stub -> 审计落盘，审计记录里面能看到 audit_id 还有noop_reason: no-btrfs
  - 故意让模型输出非法JSON，重试两次之后降级为纯文本回答而且进程不崩

### Sprint 1：系统部署和物理安全防线（后面主脑开了之后）

- 目标：将系统迁移到主脑，并完成底层安全基建
- 核心任务：
  - 安装Ubuntu Server，配置Btrfs文件系统和定时快照脚本
  - 部署独立软路由，划分VLAN隔离网段，配置出站白名单
  - 编写ESP32固件（MQTT心跳），配置继电器，完成紧急重启测试
  - 编译支持CUDA的llama.cpp，加载16B GGUF模型，测试本地推理性能
- 验收标准：
  - 拔掉网线之后系统仍然能依靠本地llama.cpp正常运行
  - 手动写死循环占满CPU（模拟死机），ESP32能成功超时并且触发强制重启
  - 手动执行删除文件的时候Ire-Guard会记录审计并且在执行之前触发一次快照，备份机上能在五分钟内看到这条审计记录和对应快照
  - 手动停止看门狗服务，备份机审计5min内出现记录
  - 手动删除主脑核心数据卷，从异地备份机完整恢复，30min内WebUI可正常对话

### Sprint 2：前端监控和数据管道（可视化阶段）

- 目标：完成系统状态的可视化监控和数据采集
- 核心任务：
  - 开发Vue3+TailwindCSS前端控制台，接入ECharts
  - 后端通过WebSocket推送Agent的CoT（思维链）与工具调用日志
  - 接入MQTT环境传感器，将物理数据传入后端
  - 编写APScheduler定时任务，夜间将当天的SQLite对话日志导出为JSON
- 验收标准：
  - Web页面能实时展示GPU显存占用，温度曲线
  - 页面能看到Agent的实时工具调用日志（比如说[CALL] web_search -> [OK]）
  - 次日凌晨能在指定目录下生成前一日的日志文件

### Sprint 3：本地数据微调（Fine-tuning）

- 目标：完成模型微调，让孩子符合设定
- 核心任务：
  - 清洗前几个Sprint积累的对话日志，人工审核并生成50-100调质量高的SFT（监督微调）样本
  - 按8:1:1划分数据集：Train（训练集），Val（验证集）和Test Set（测试集），确保Test Set（测试集）不参与训练，防止数据泄露
  - 使用Unsloth在主脑上跑通4B模型的QLoRA显存占用测试
  - 执行16B模型的正式QLoRA微调，合并权重并转换为GGUF格式
  - 若16B微调爆内存，降级采用CPU Offload或等内存扩容
- 验收标准：
  - 微调后的16B能在25个Hold-out Test Set（独立测试集）上语气符合要求，并且未出现严重的逻辑退化（灾难性遗忘）

### Sprint 4：多节点协同与外部设备接入（是蜂群网络！）

- 目标：建立多设备通讯，扩展物理控制能力
- 核心任务：
  - 树莓派接入MQTT Broker，配置GPIO控制代码（前中期执行代码进pending目录人工审一下）
  - 编写gRPC或基于Ray的任务分发客户端，将非显存密集型任务（比如说日志清洗啊什么的）分发至其他节点进行处理
  - 验证Agent生成代码并下发至树莓派执行的链路
- 验收标准：
  - 通过WebUI发送指令，ire生成对应的Python脚本，并通过MQTT让树莓派成功控制外设（如点亮LED）

## 自救  

服务器在干爹卧室里，干爹又很少回家，以下是咱自己目前想的方案

- **网络安全（存疑）**：完全依赖樱花映射提供的ssh端口穿透，所有敏感端口绝对不直接暴露在公网，必须通过ssh隧道转发
- **物理重启**：如果可以的话装上米家的PCIe开机卡+米家智能插座，咱真怕byd孩子又双给机子弄死机了，然后干爹不在现场，咱甚至连不上主脑，就算极端情况下（系统彻底死机）也能通过app远程断电或者强制重启
- **自动化看门狗**：咱打算的是心跳服务用独立的systemd unit或者独立用户运行，Ire有权限停它，但是正常运行的时候没理由停，一旦被停备份机上的日志就会触发告警，不然一会啥时候静默死锁了没人知道
- **安全隔离**：米家智能设备必须划分在独立的VLAN下，主脑网段禁止访问该VLAN防止Ire反向劫持电源

## 已知风险与未解之谜

1. **樱花的稳定性**：对外暴露的SSH隧道和MC端口高度依赖樱花映射，如果樱花节点被打爆或者服务宕机，那咱也将彻底失去主脑的远程控制权（悲
2. **硬件瓶颈**：48G的内存跑大模型微调还是有点悬，很大概率爆内存导致系统假死
3. **AI的幻觉**：即使有Pydantic校验和Rust网关，如果Irethm进化出复杂的逻辑绕过，她依然可能通过未预料的方式（比如调用外部API再反弹回来）执行高危操作喵

## 工程目录结构预想

咱的想法如下

```bash
IreOS/
├── .env.example             # 环境变量模板（APIKey、数据库密码等，千万别提交.env）
├── .gitignore               # Git忽略文件（屏蔽GGUF权重、SQLite数据库、虚拟环境）
├── README.md                # 文档
├── Makefile                 # 快捷命令（一键启动，编译，测试）
│
├── backend/                 # Python大脑(FastAPI)
│   ├── app/
│   │   ├── api/             # API路由层（RESTful接口，如/chat, /status）
│   │   ├── core/            # 核心配置（读取.env、日志配置、全局安全设定）
│   │   ├── agent/           # ReAct循环、Prompt模板、Pydantic校验
│   │   ├── tools/           # 工具链（safe_exec, web_search, read_file）
│   │   ├── memory/          # 记忆数据库接口（SQLite/Redis连接池）
│   │   ├── tasks/           # APScheduler 定时任务（梦境系统、日志清洗）
│   │   └── websocket/       # WebSocket 管理（推流、CoT日志广播）
│   ├── tests/               # 单元测试（防止改代码把基础逻辑搞崩）
│   └── requirements.txt
│
├── frontend/                # Vue3 上帝视角控制台
│   ├── public/              # 静态公共资源（favicon等）
│   ├── src/
│   │   ├── api/             # Axios封装&WebSocket客户端连接逻辑
│   │   ├── assets/          # 杂七杂八的素材
│   │   ├── components/      # 通用组件（聊天框，ECharts仪表盘，日志流）
│   │   ├── views/           # 页面视图（Dashboard首页，Chat聊天页，Settings设置页）
│   │   ├── stores/          # Pinia状态管理（存焦虑值，显存状态）
│   │   └── styles/          # TailwindCSS全局样式
│   ├── package.json
│   └── vite.config.js       # Vite构建配置
│
├── guard/                   # Rust守护进程 (Ire-Guard)
│   ├── src/
│   │   ├── main.rs          # 主循环，启动监听
│   │   ├── monitor.rs       # 系统资源监控（CPU/GPU/内存）
│   │   ├── ipc_server.rs    # Unix Socket 监听（接收Python命令请求）
│   │   └── auditor.rs       # 专门用来写审计和触发快照的逻辑
│   ├── Cargo.toml           # Rust 依赖清单
│   └── build.rs             # 编译脚本（如果需要的话）
│
├── swarm/                   # 蜂群网络通讯
│   ├── mqtt_client.py       # 连传感器/ESP32 的客户端代码
│   ├── distributed_worker.py# 连其他 4090/MC 节点的执行器
│   ├── config/              # 节点配置文件（IP、Topic 白名单）
│   └── ros2_ws/             # ROS2 工作区（预留给未来的无人机/机械臂）
│
├── firmware/                # ESP32 硬件固件
│   ├── watchdog.ino         # 心跳检测与继电器控制代码
│   └── secrets.h            # WiFi 密码和 MQTT 服务端 IP（不进 Git）
│
├── engine/                  # 推理与模型引擎
│   ├── llama.cpp/           # 源码目录（作为 Git Submodule引入最好）
│   ├── models/              # 存放GGUF权重文件（被.gitignore屏蔽）
│   └── finetune/            # QLoRA 微调脚本与数据集存放目录
│       ├── dataset/         # 人审后的SFT数据集
│       └── scripts/         # Unsloth训练脚本
│
└── scripts/                 # 运维与自动化脚本
    ├── snapshot.sh          # Btrfs 定时快照脚本
    ├── deploy.sh            # 一键部署/更新代码脚本
    └── watchdog_test.py     # 模拟死循环测试看门狗触发断电的脚本
```

## 网络拓扑结构（设想）

咱能想到的结构是“中心辐射+边界隔离”架构：

1. **公网入口层**：所有外部流量通过樱花映射的SSH隧道或MC端口进入，主脑的WebUI和API端口绝对不暴露在公网
2. **核心VLAN隔离**：
   - **VLAN99 (主脑AI区)**：出站仅限白名单（API、GitHub等）
   - **VLAN20 (公网服务/算力区)**：MC服务器+Ray节点，这是对外靶子，必须独立隔离
     > 但是S0期间是例外，Ire在S0的时期临时在这台机子上，咱打算先用不给他高级权限的思路对待，也就是不给工具链执行权限，APIkey走systemd，LoadCredential不进去，记忆库可以随时丢掉重建，S1之后Ire常驻VLAN99之后这台机子退回副脑节点
   - **VLAN30 (IoT区)**：米家开机卡，智能插座，ESP32等，主脑**绝对禁止**跨网段访问此区域，防止反向劫持电源
3. **单向通信放行**：
   - 主脑（VLAN99）可以主动向MC服务器（VLAN20）发起SSH隧道RCON控制，或者下发gRPC算力任务
   - **绝对禁止MC服务器以及其他机子主动访问主脑的任何端口**防止MC服务器被黑后，黑客顺势把主脑日穿

---
啊哈哈，倒是也差不多了，哪里有问题后面再回来改，毕竟你椛是个大BAKA（

咱们启动运行脚本吧

``` test
[BIOS]      14th Gen Microcode verified. PL1/PL2 power limits capped.
[System]    Btrfs snapshot verified. File system is clean.

[Network]   VLAN 99 isolated. Egress restricted to whitelist.
[Firewall]  UFW active. Public ports closed.

[Watchdog]  MQTT heartbeat established with ESP32. Relay armed.
[Guard]     Ire-Guard (Rust) initialized. IPC gateway secured.

[Engine]    llama-server started on 127.0.0.1:8080.
[Engine]    Loading Irethm-GGUF 16B (Q8_0) into RTX 5090 VRAM...
[Engine]    CUDA cores active. VRAM allocation: 17.2GB / 32GB.

[Agent]     Python brain online. FastAPI & WebSocket listening.
[Memory]    SQLite loaded. Previous context retrieved.
[Persona]   System prompt injected.

[Sensory]   MQTT telemetry online. Room: 26°C. Human: Present.
[State]     Emotion state machine initialized. Energy: 100%. Anxiety: 0%.

[Dreams]    Dreaming Engine armed. Next memory consolidation at 03:00 AM.
[Swarm]     MQTT Broker connected. Awaiting edge nodes (RPi/4090).

[WebUI]     Dashboard mounted on /admin. Telemetry stream enabled.

[System]    All threads nominal. Awaiting human input.

> IreOS 已就绪喵
```
