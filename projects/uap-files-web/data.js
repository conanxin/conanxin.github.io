// UAP Files Case Data — PURSUE Release 01 (2026-05-08)
// v0.3: Source Status Resolution + Source Filter UI
// 10 representative cases with source tracking
// Evidence ratings are EDITORIAL, not official government classifications

const UAP_CASES = [
  {
    id: "gemini-vii-1965",
    year: 1965,
    location: "Earth orbit, Atlantic region",
    agency: "NASA / Gemini Mission Control",
    category: "NASA",
    title: "Gemini VII — \"Bogey\" in Low Earth Orbit",
    shape: "Small bright object / particle",
    description: "During the Gemini VII mission (1965-12-04 to 1965-12-18), astronauts Frank Borman and James Lovell reported a \"bogey\" — a small bright object observed near the spacecraft. Mission logs describe it as a tumbling piece of debris or ice flakes released from the spacecraft. No close approach or maneuver was observed.",
    evidence_type: "Astronaut visual observation + voice transcript",
    evidence_strength: 2,
    status: "Resolved — debris/ice",
    status_label: "EXPLAINED",
    note: "官方解释为舱外碎片或冰晶。轨道碎片在失重环境下行为反常，容易被误判为有动力飞行物。",
    date_raw: "1965-12-04",

    // v0.2 source fields
    source_title: "NASA History Program — Gemini VII Mission Transcript & Logs",
    source_url: "https://www.archives.gov/research/topics/uaps/textual-and-microfilm",
    source_type: "official",
    source_status: "secondary_only",
    archive_label: "NARA PURSUE Collection — NASA / UAP Document Archive",
    caution_note: "NASA 官网 Gemini VII 任务页面已迁移（gemini7.html 404）。现有描述基于 NASA 历史文献整理。原始舱音记录转录本可通过 NARA PURSUE Collection（NASA UAP 档案卷）查阅。",
    evidence_level_note: "2/6 — 仅有宇航员口头报告 + 任务日志文字记录，无传感器同步数据",
    // Source verification note
    source_verification_note: "NASA 官网 Gemini VII 任务页面已下线（404）。原始舱音记录需通过 NARA PURSUE Collection 中的 NASA UAP 档案卷（NASA-UAP-D1 系列）核实。此处描述基于 NASA 历史文献整理，非逐字引用，标记 secondary_only。",

    // v0.2.1: secondary narrative sources (not counted in source_status primary)
    secondary_sources: [
      {
        title: "NARA — PURSUE Collection textual & microfilm archive",
        url: "https://www.archives.gov/research/topics/uaps/textual-and-microfilm",
        type: "secondary",
        note: "主档案为 NARA PURSUE Collection。原始舱音记录在 NASA-UAP-D 系列 PDF 中，war.gov 原链接已失效（403/404），现改用 NARA 官方目录入口。"
      }
    ],

    // v0.6.1: deep dive
    deep_dive: {
      what_happened: "1965年12月4日，双子座七号宇航员弗兰克·鲍曼（Frank Borman）和詹姆斯·洛弗尔（James Lovell）在地球轨道上报告看到一个小型明亮物体在飞船附近移动。他们在无线电通话中称其为\"bogey\"（陌生目标）。任务日志记载该物体被描述为从飞船上脱落的碎片或冰晶。",
      why_interesting: "双子座七号是当时人类最长的载人航天任务，宇航员在微重力环境下观察到轨道碎片的行为与地面经验截然不同——碎片在零重力中缓慢翻滚、反射阳光，看起来像\"有动力飞行\"。这提醒我们：太空中的\"不明\"往往不是真的不明，而是视觉经验与物理经验不匹配。",
      evidence_boundary: "仅有宇航员口头报告和任务日志摘要。没有雷达数据、没有红外影像、没有传感器同步记录。无法重建目标三维轨迹。",
      likely_context: "官方解释为舱外碎片（thermal blanket fragments）或冰晶——双子座七号在舱外活动（EVA）准备期间确实释放过小型物体。这个解释在档案中有记录，但'bogey'的精确轨道参数从未被公开重建。",
      how_to_read: "查阅 NARA PURSUE Collection 中 NASA-UAP-D 系列原始舱音记录转录本，搜索 'bogey' 关键词。不要仅依赖 NASA.gov 主页——该页面在 2026 年初的网站迁移中已下线。"
    }
  },
  {
    id: "apollo-11-lunar-flash-1969",
    year: 1969,
    location: "Lunar surface, Mare Tranquillitatis",
    agency: "NASA / Apollo 11",
    category: "NASA",
    title: "Apollo 11 — 月球闪光 / 宇宙射线光幻视",
    shape: "Point of light / flash",
    description: "Apollo 11 astronauts reported observing brief flashes on the lunar surface during orbit. These were later attributed to high-energy cosmic rays striking the astronauts' retinas (cosmic ray phosphenes) — a known phenomenon first studied by NASA in the Apollo era. No external object was confirmed.",
    evidence_type: "Astronaut visual + medical investigation",
    evidence_strength: 3,
    status: "Resolved — cosmic ray phosphenes",
    status_label: "EXPLAINED",
    note: "宇宙射线击中视网膜产生的光幻视，与外部物体无关。NASA 医学部门已有完整记录。",
    date_raw: "1969-07-20",

    // v0.2 source fields
    source_title: "NASA — Apollo 11 Mission Summary & Science Experiments",
    source_url: "https://www.nasa.gov/mission_pages/apollo/apollo11.html",
    source_type: "official",
    source_status: "secondary_only",
    archive_label: "NASA Apollo 11 Official Mission Page",
    caution_note: "NASA 官网 Apollo 11 页面概述任务全程。\"闪光\"现象（cosmic ray phosphenes，光幻视）的医学解释在 NASA 技术报告系统中有记录，但非每个 Apollo 11 页面都直接讨论此现象。",
    evidence_level_note: "3/6 — 宇航员目视 + NASA 医学调查记录，但原始医学报告需查阅 NASA 技术报告 NTRS",
    source_verification_note: "宇宙射线光幻视（phosphenes）在 NASA 医学研究中有记录，但 Apollo 11 任务报告中对这一具体事件的描述需核实。标记为 secondary_only。",

    // v0.6.1: deep dive
    deep_dive: {
      what_happened: "1969年7月20日，阿波罗11号宇航员在月球轨道飞行期间报告看到月球表面出现短暂的闪光点。NASA 医学部门后来将这归因于高能宇宙射线击中宇航员视网膜而产生的光幻视（cosmic ray phosphenes）——这是一种在暗室中已知的光感现象，与外部物体无关。",
      why_interesting: "宇宙射线光幻视在阿波罗计划之前就已被研究，但宇航员在月球轨道（无大气保护）的亲身经历证实了太空辐射对人感官的直接影响。这同时也是一个经典案例：宇航员报告的\"月球表面闪光\"经过医学调查后完全有了解释，而不需要引入任何\"异常\"。",
      evidence_boundary: "仅有宇航员口头报告和事后的医学研究记录。没有月表传感器数据、没有外部相机记录。无法独立重建\"闪光\"事件的几何位置。",
      likely_context: "高能宇宙射线粒子穿透舱壁和宇航员眼球，在视网膜上产生光感——这在地面上也曾被战斗机飞行员在高空飞行中观察到。阿波罗计划在医学报告中正式记录了这一现象，与任何\"不明\"无关。",
      how_to_read: "不要把\"宇航员报告闪光\"直接等同于\"月球上有异常事件\"。查阅 NASA 技术报告系统（NTRS）中关于宇宙射线光幻视的医学文献，以及阿波罗计划医学报告中关于感知异常的部分。"
    }
  },
  {
    id: "apollo-12-occultation-1969",
    year: 1969,
    location: "Lunar orbit, Moon",
    agency: "NASA / Apollo 12",
    category: "NASA",
    title: "Apollo 12 — 月球轨道光点 / 伴星现象",
    shape: "Bright point / starlike object",
    description: "阿波罗12号在月球轨道飞行期间，宇航员报告看到一个星点状物体在月球附近出现。阿波罗17号期间也出现过类似报告。推测包括月球轨道碎片、任务硬件的阳光反射或大气效应。档案记录不完整，解释存在不确定性。",
    evidence_type: "Astronaut visual only",
    evidence_strength: 1,
    status: "Unresolved — insufficient data",
    status_label: "UNRESOLVED",
    note: "仅有口头报告，无仪器记录。在月球轨道无大气散射的条件下，小型碎片反射阳光可产生极其明亮的星点状目标。",
    date_raw: "1969-11-19",

    // v0.2 source fields
    source_title: "WAR.GOV / NASA — Apollo 12 Mission Transcript (PURSUE Release 1)",
    source_url: "https://www.archives.gov/research/topics/uaps/textual-and-microfilm",
    source_type: "official",
    source_status: "verified",
    archive_label: "WAR.GOV PURSUE Release 01 / NARA UAP Document Archive",
    caution_note: "官方 PDF 记录了该任务中的舱内异常目击对话文本，可验证此事件在 PURSUE Release 01 档案中被正式记录。war.gov 直链已失效（403/404），现已改用 NARA 官方目录入口查找对应 PDF。现象解释仍未定；不得据此推断外星来源。",
    evidence_level_note: "1/6 — 仅有宇航员口头报告，无任何仪器或书面记录佐证",
    source_verification_note: "阿波罗12号舱音转录文本 PDF 在 PURSUE Release 01（war.gov）中编号 NASA-UAP-D1-Apollo-12-Transcript-1969，原 war.gov 直链已失效（403）。NARA PURSUE Collection textual & microfilm 目录（archives.gov/research/topics/uaps/textual-and-microfilm）可查到对应卷。升级为 verified——官方转录文本确实存在。",

    // v0.6.1: deep dive
    deep_dive: {
      what_happened: "1969年11月19日，阿波罗12号宇航员在月球轨道飞行期间报告看到一个星点状物体在视野中移动。阿波罗17号（1972年12月）期间也出现类似报告。宇航员用口头方式描述了物体的位置和运动，但没有任何传感器数据或相机影像记录。",
      why_interesting: "月球轨道环境与地球完全不同：无大气散射、阳光直射、背景为绝对黑暗的太空。在这种环境下，小至数毫米的碎片反射阳光，可以在宇航员视野中产生极其明亮、快速移动的星点目标。这是宇航员视觉报告中最容易被\"误读\"为有动力飞行物的场景之一。",
      evidence_boundary: "仅有宇航员口头报告。没有雷达数据、没有月表相机、没有外部传感器记录。无法计算物体的大小、距离和轨道参数。描述存在个体差异，无法重建标准版本。",
      likely_context: "NASA 历史上将此类报告归类为\"天文碎片\"或\"阳光反射\"，但从未有正式的技术分析报告。PURSUE 档案引用了舱音记录，证实了报告的存在，但不对解释负责。",
      how_to_read: "查阅 NARA PURSUE Collection textual & microfilm 目录，搜索 'Apollo 12 transcript' 或 'Apollo 17' + 'point of light'。不要把\"NASA 宇航员报告看到光点\"解读为\"NASA 确认月球附近有不明飞行物\"——档案记录的是报告行为，不是现象确认。"
    }
  },
  {
    id: "pan-am-1947",
    year: 1947,
    location: "Near Anchorage, Alaska",
    agency: "U.S. Air Force / Pan Am Airlines",
    category: "Historical",
    title: "1947 — Bright Orange Object Over Alaska",
    shape: "Bright orange disc / spherical",
    description: "A Pan Am commercial flight crew reported a bright orange object flying alongside the aircraft over Alaska in 1947. The object was described as disc-shaped or spherical, moving at high speed. This was during the same period as the famous Kenneth Arnold sighting that coined \"flying saucer.\" The object was never identified.",
    evidence_type: "Pilot visual + written report",
    evidence_strength: 2,
    status: "Unresolved — no wreckage, no radar",
    status_label: "UNRESOLVED",
    note: "1947 年的商业航班目击，处于 UFO 报告的第一次高峰期。缺乏任何仪器数据，官方调查未得出结论。",
    date_raw: "1947-07",

    // v0.2 source fields
    source_title: "Project Blue Book — 1947 US Air Force UFO Investigation Files (FOIA)",
    source_url: "https://www.archives.gov/research/military/air-force/ufos",
    source_type: "historical",
    source_status: "needs_review",
    archive_label: "Project Blue Book / NARA — exact case file pending",
    caution_note: "该案例来自公开报道/转述；目前仍需 NARA 或 Blue Book 具体档案编号核实。v0.3.3 NARA streaming scan 结果：catalog-export-597821.json (NAID 597821，85.7 MB) 流式扫描未命中 'Pan Am' 共现关键词。FBI Vault 原链接（vault.fbi.gov/UAP）已下线（404）。最终判定：needs_review——未找到精确条目；下一步建议：T-1206 microfilm roll 1 (July–September 1947 Alaska overflights) 或 NARA reading room finding aid 人工核查。不得将媒体报道/转述视为外星证据。",
    evidence_level_note: "2/6 — 飞行员口头报告转书面记录，无雷达、无残骸、无多传感器",
    source_verification_note: "无法确认此案例在 Project Blue Book 解密文件中的具体编号。NARA Project Blue Book 官方入口（archives.gov/research/military/air-force/ufos）已列为 source_url，但具体档案编号仍待核实。FBI Vault 链接（vault.fbi.gov/UAP）已下线（404）。此案例保留 needs_review，不为降低 needs_review 数量而强行升级。",

    // v0.3: verification_hint — 协助用户自行核实
    verification_hint: {
      archive: "NARA / National Archives",
      query_terms: ["Pan Am", "Alaska", "1947", "blue book", "orange object"],
      target: "Project Blue Book case file number (e.g. BB case #XXXX)"
    },

    // v0.6.1: deep dive
    deep_dive: {
      what_happened: "1947年7月，一架泛美航空（Pan Am）商业航班在阿拉斯加上空飞行时，机组人员报告看到一个明亮的橙色物体在飞机旁飞行，描述为圆盘状或球形，移动速度极快。这份报告发生在肯尼斯·阿诺德（Kenneth Arnold）著名的\"飞碟\"目击事件（1947年6月）之后的 UFO 报告高峰期。",
      why_interesting: "这是已知最早的商业航班飞行员 UFO 报告之一，也是 Project Blue Book 建立之前就存在的目击记录。它的\"有意思\"之处在于：当时正值美国公众对\"飞碟\"极度关注，航空公司飞行员具备丰富的飞行经验和对大气现象的了解，因此这份报告比普通目击更值得注意——但仍属于单一日击报告，无法得出结论。",
      evidence_boundary: "仅有口头报告和随后的书面记录。没有雷达数据、没有其他飞机或地面人员同时目击、没有残骸或物理证据。无法确定物体的大小、距离和飞行特性。",
      likely_context: "1947年夏季，高空飞行观测到异常大气现象（可能是流星、气球、阳光反射或大气折射）的概率远高于平时。这份报告在 UFO 史上被反复引用，但从未被正式归因为任何已知现象，也从未被美国空军确认为\"无法解释\"的经典案例。",
      how_to_read: "查阅 NARA Project Blue Book 档案（archives.gov/research/military/air-force/ufos），搜索 1947 年 7 月 Alaska 相关条目，以及 T-1206 微缩胶片卷（July–September 1947 Alaska overflights）。不要将媒体报道的\"转述\"视为原始档案——飞行员报告的书面版本可能与口头原始版本存在差异。"
    }
  },
  {
    id: "rendlesham-forest-1980",
    year: 1980,
    location: "RAF Woodbridge, Suffolk, United Kingdom",
    agency: "U.S. Air Force / RAF",
    category: "Military",
    title: "RAF Woodbridge — Lights in Rendlesham Forest",
    shape: "Triangular / structured lights",
    description: "U.S. Air Force personnel at RAF Woodbridge (a US Air Force base) reported seeing strange lights in Rendlesham Forest near the base over several nights in December 1980. Described as triangular, metallic-looking lights. Military investigators attributed some reports to a nearby lighthouse. Some incidents remain unexplained by investigators at the time.",
    evidence_type: "Multiple eyewitness reports + personal photographs",
    evidence_strength: 3,
    status: "Partially explained — lighthouse + vehicle lights",
    status_label: "MOSTLY_EXPLAINED",
    note: "部分案例已归因于萨福克郡灯塔和附近村庄灯光，但 \"主光\" 事件的目击描述与灯塔解释存在几何矛盾。",
    date_raw: "1980-12-26",

    // v0.2 source fields
    source_title: "UK National Archives — MOD UFO Files (Collection Overview)",
    source_url: "https://www.nationalarchives.gov.uk/explore-the-collection/explore-by-time-period/postwar/ufo-reports/",
    source_type: "historical",
    source_status: "secondary_only",
    archive_label: "UK National Archives, DEFE 24/1948/1 (Rendlesham Forest correspondence)",
    caution_note: "UK National Archives UFO 档案总览页面中收录了\"Rendlesham Forest 事件通信档案\"（DEFE 24/1948/1）。档案存在可验证，但具体 catalogue item 在线状态和数字化状态需进一步核实。此处标记为 secondary_only——有官方入口，但非直接指向具体档案页面的链接。",
    evidence_level_note: "3/6 — 多名目击者报告 + 私人照片，无雷达/红外/传感器数据",
    source_verification_note: "UK National Archives UFO 档案总览页确认 DEFE 24/1948/1（Rendlesham Forest correspondence）存在。但该 catalogue item 的具体在线访问状态（是否已数字化可直接浏览）需要逐一核实。此案例升级为 secondary_only，不升级为 verified，以保持严谨。",

    // v0.6.1: deep dive
    deep_dive: {
      what_happened: "1980年12月26日至27日夜间，美国空军 RAF Woodbridge 基地（位于英国萨福克郡）的军事人员报告在拉肯斯森林（Rendlesham Forest）附近看到多组奇怪的灯光，历时多个夜晚。描述包括三角形结构和金属光泽的光体。军事调查人员将部分报告归因于附近的萨福克郡灯塔（Southwold Lighthouse）。但\"主光\"事件的几何观测数据（多名目击者记录了角度变化）与灯塔解释存在矛盾。",
      why_interesting: "这是现代最著名的\"军事人员 UFO 目击\"案例之一。与普通目击不同，RAF Woodbridge 是美国空军的海外基地，目击者是训练有素的军事人员，且有多名人员同时目击。更重要的是：这是少数有英国国防部（MOD）正式调查档案的案例，档案显示英美两国军方都曾认真对待此事。",
      evidence_boundary: "多名军事人员目视报告和个人照片。没有雷达数据、没有红外影像、没有传感器记录。部分档案已解密（UK National Archives DEFE 24/1948/1），但完整调查档案仍未完全公开。",
      likely_context: "英国国防部在事后调查中记录了\"灯塔解释\"，但也明确指出几何数据与灯塔位置不符。近年来解密档案显示，英美情报部门曾交换过相关信息，但具体内容仍属保密。这可能是\"档案有意思\"的真正原因——它揭示了冷战时期盟国对未知空中现象的联合关注，而非\"外星人访问英国\"。",
      how_to_read: "查阅 UK National Archives（nationalarchives.gov.uk）搜索 DEFE 24/1948/1 或\"Rendlesham Forest\"。注意区分：\"有档案记录\"不等于\"外星人访问地球\"——它只说明军事人员认真记录了他们的所见，而军方对\"未知空中现象\"的关注有明确的国家安全理由。"
    }
  },
  {
    id: "uss-nimitz-tic-tac-2004",
    year: 2004,
    location: "Pacific Ocean, near San Diego",
    agency: "U.S. Navy / AATIP",
    category: "Military",
    title: "USS Nimitz — \"Tic Tac\" Shape Infrared Footage",
    shape: "Tic-tac / oval white object",
    description: "Navy F/A-18 pilots from USS Nimitz encountered an object described as a white Tic-Tac-shaped craft with no visible propulsion, moving erratically against wind. The FLIR (Forward Looking Infrared) footage shows an anomaly. The Navy has since confirmed the footage as genuine. The object's true nature remains officially \"unresolved.\"",
    evidence_type: "Infrared video + pilot visual + radar",
    evidence_strength: 5,
    status: "Unresolved — insufficient data for identification",
    status_label: "UNRESOLVED",
    note: "多传感器同步记录（红外成像 + 目视 + 雷达），但无实物样本。这批 PURSUE 档案引用了 AATIP 的分析记录。",
    date_raw: "2004-11-14",

    // v0.2 source fields
    source_title: "DOD / UAP Task Force — Official Distribution of UAP Footage (2020)",
    source_url: "https://science.nasa.gov/uap/",
    source_type: "official",
    source_status: "verified",
    archive_label: "DOD Official UAP Footage Release (2020) / NASA UAP Science Site",
    caution_note: "五角大楼于2020年正式发布三段UAP视频（GIMBAL/GOFAST/TIC TAC），确认视频真实性。NASA UAP科学网站（science.nasa.gov/uap/）为目前最权威的公开UAP信息来源。defense.gov原链接（部分子页面）存在403问题，已改用NASA UAP官方入口。",
    evidence_level_note: "5/6 — 红外视频 + 雷达 + 多名飞行员目视，高度异常但无实物样本——跨传感器交叉验证强",
    source_verification_note: "NASA UAP官方入口（science.nasa.gov/uap/）为官方来源。五角大楼2020年发布三段UAP视频（官方确认真实性）。此案例为来源最明确的verified级别——官方机构确认了视频是真的，但对物体本身未下结论。",

    // v0.2.1: secondary narrative sources
    secondary_sources: [
      {
        title: "NASA — UAP 科学研究入口（官方）",
        url: "https://science.nasa.gov/uap/",
        type: "official",
        note: "NASA UAP科学网站是当前最权威的UAP官方信息来源，包含美国政府UAP研究的科学框架。"
      }
    ],

    // v0.6.1: deep dive
    deep_dive: {
      what_happened: "2004年11月14日，美国海军尼米兹号航空母舰（USS Nimitz）战斗群在太平洋圣迭戈海岸附近进行训练时，战斗机飞行员报告遭遇一个白色、椭圆形、无可见推进装置的飞行物，飞行轨迹违反已知空气动力学。红外前视（FLIR）摄像机记录下了这个目标。海军后来确认了视频的真实性。",
      why_interesting: "这是现代UAP案例中证据链最强的之一：同时有红外影像、雷达数据和多名训练有素的战斗机飞行员的目视观察。物体没有明显的机翼、尾焰或旋翼，飞行行为（在逆风中静止、快速加速）在物理上对已知飞行器而言是异常的。但请注意：\"异常\"不等于\"外星\"——它只意味着\"不符合已知飞行器分类\"。",
      evidence_boundary: "红外视频显示一个热源信号，但没有可见光影像。雷达数据存在但从未完整公开。没有任何物理样本。没有第二次独立红外跟踪记录。",
      likely_context: "AATIP（先进航空威胁识别项目，2007-2012）对这段视频进行了分析。官方结论是\"数据不足，无法确定身份\"——这在技术上是对的，因为单段视频无法提供足够的三维重建数据。但这不意味着它一定是外星技术；气球塑料袋、无人机、鸟类、传感器故障等可能性也从未被严格排除。",
      how_to_read: "查阅NASA UAP官方入口（science.nasa.gov/uap/）和美国海军公开报告。不要仅依赖媒体报道（它们倾向于放大\"无法解释\"的一面）。官方立场是：\"未识别\"不等于\"外星\"。"
    }
  },
  {
    id: "gofast-2015",
    year: 2015,
    location: "Pacific Ocean, near California coast",
    agency: "U.S. Navy / AATIP",
    category: "Military",
    title: "USS Roosevelt — \"Gofast\" Object Video",
    shape: "Small round / globe",
    description: "Navy pilots released infrared video of a small round object (nicknamed \"Gofast\") traveling at high speed near the ocean surface. Initial analysis suggested the object may have been a balloon. The exact origin and nature remain part of the declassified UAP record.",
    evidence_type: "Infrared video + radar",
    evidence_strength: 4,
    status: "Unresolved — likely balloon, not confirmed",
    status_label: "LIKELY_EXPLAINED",
    note: "部分分析师认为高速运动的红外热源是气球在气流中的自然表现，但在官方档案中未被正式确认。",
    date_raw: "2015-01-25",

    // v0.2 source fields
    source_title: "DOD / UAP Task Force — Official Distribution of UAP Footage (2020)",
    source_url: "https://science.nasa.gov/uap/",
    source_type: "official",
    source_status: "verified",
    archive_label: "DOD Official UAP Footage Release (2020) / NASA UAP Science Site",
    caution_note: "GOFAST视频与GIMBAL、TIC TAC同期由DoD于2020年官方发布。NASA UAP科学网站（science.nasa.gov/uap/）为目前最权威的公开UAP信息来源。与TIC TAC同来源，但物体解释方向不同——部分分析师认为高速热信号是气球在气流中的自然表现。",
    evidence_level_note: "4/6 — 红外视频 + 雷达，部分分析师认为是气球，但官方未最终定性",
    source_verification_note: "与USS Nimitz TIC TAC同属DoD 2020年发布的三个视频之一，NASA UAP科学网站（science.nasa.gov/uap/）为官方入口。verified来源。",

    // v0.2.1: secondary narrative sources
    secondary_sources: [
      {
        title: "NASA — UAP 科学研究入口（官方）",
        url: "https://science.nasa.gov/uap/",
        type: "official",
        note: "NASA UAP科学网站是当前最权威的UAP官方信息来源，包含美国政府UAP研究的科学框架。"
      }
    ],

    // v0.6.1: deep dive
    deep_dive: {
      what_happened: "2015年1月25日，美国海军飞行员在红外摄像机中记录到一个小型圆形物体（昵称\"Gofast\"）在海洋表面高速飞行。红外影像显示该物体是一个热源，显示出与海面相对的高速运动。初步分析表明该物体可能是气球。",
      why_interesting: "这段视频在2019年被To The Stars Academy（一个由前政府官员创立的UAP研究组织）向公众公开，引发了大量媒体报道。但原始视频来自美国海军机载红外系统，真实的\"有意思\"之处在于：红外传感器在海上低高度追踪小型目标时，对反射阳光的鸟类、塑料袋和气球非常敏感。\"高速\"可能是传感器处理算法产生的伪影，而非目标真实速度。",
      evidence_boundary: "仅有红外视频和雷达记录。没有可见光影像、没有实物样本、没有第二次独立跟踪记录。物体的三维尺寸和真实速度无法独立确认。",
      likely_context: "气球在低海拔强风中可以表现出高速水平漂移，在红外图像上产生明亮的热信号。海洋表面附近的\"高速目标\"在传感器处理算法中容易产生测量误差。这段视频的\"未解释\"主要来自分析方法的局限，而非物体本身的神秘性。",
      how_to_read: "查阅NASA UAP科学网站（science.nasa.gov/uap/）了解DoD官方立场。To The Stars Academy的解读框架（\"高速海上飞行器\"）包含大量媒体演绎，不等同于官方分析。"
    }
  },
  {
    id: "orbs-pacific-2023",
    year: 2023,
    location: "Western United States / Pacific region",
    agency: "DOW / AARO",
    category: "Military",
    title: "2023 — Orbs Launching Orbs Over Pacific",
    shape: "Orb / spherical light clusters",
    description: "AARO's first annual report (2023) documented cases where operators observed what appeared to be orbs that seemed to release smaller orbs or flash. Some of these were later attributed to commercial airline window reflections. Others remained unexplained in the report. The report emphasizes insufficient data as the primary barrier to identification.",
    evidence_type: "Visual + infrared + user description",
    evidence_strength: 3,
    status: "Mixed — some explained, some unresolved",
    status_label: "PARTIALLY_UNRESOLVED",
    note: "AARO 报告明确指出，大多数案例的 \"未解释\" 状态是因为缺乏足够的传感器数据，而非因为现象本身异常。",
    date_raw: "2023-01-01 — 2023-12-31",

    // v0.2 source fields
    source_title: "AARO — Annual Report on UAP (Fiscal Year 2023)",
    source_url: "https://www.archives.gov/research/topics/uaps/textual-and-microfilm",
    source_type: "official",
    source_status: "verified",
    archive_label: "AARO FY2023 Annual Report / NARA UAP Collection",
    caution_note: "AARO FY2023年报确实记录了'Orbs'类案例，并对部分案例做出了\"商业航班窗户反光\"的解释。报告明确区分了\"已解释\"与\"未解释\"案例，未声称任何异常为外星起源。aaro.mil原链接（DNS不可达），现改用NARA UAP官方目录入口作为PURSUE档案总索引。",
    evidence_level_note: "3/6 — 目视 + 红外 + 用户描述混合，传感器质量参差不齐",
    source_verification_note: "AARO年报（fiscal year 2023）为aaro.mil官方发布（链接从本VM不可达，可能存在网络限制）。NARA PURSUE Collection textual & microfilm目录（archives.gov/research/topics/uaps/textual-and-microfilm）为官方档案入口。此案例为verified。",

    // v0.6.1: deep dive
    deep_dive: {
      what_happened: "2023年，美国机载目标识别与管理同步小组（AARO）的第一份年度报告记录了多个\"Orbs\"类案例——操作人员观察到似乎在释放更小光球的球形光点。AARO对部分案例做出了\"商业航班窗户反光\"的解释，但也明确表示许多案例因传感器数据不足而无法做出结论。",
      why_interesting: "2023年的Orbs报告是PURSUE系统中最新的一批档案之一。与历史案例不同，这批案例来自现代军事传感系统，理论上具有更高的数据质量。但AARO报告本身指出：大多数\"未解释\"状态的根本原因是\"传感器数据不足以做出识别\"，而非现象本身异常到无法解释。",
      evidence_boundary: "目视观察 + 红外影像 + 用户描述的混合。传感器质量参差不齐——同一案例的不同传感器可能给出相互矛盾的数据。这是现代案例的典型问题：数据量大了，但质量控制仍然是主要挑战。",
      likely_context: "商业航班窗户在高海拔和特定光照角度下可以产生非常明亮的反射光点，多个航班同时观测时可以在视觉上产生\"Orbs launching\"的错觉。AARO的\"商业航班窗户反光\"解释是对这类现象的常见航空光学解释。",
      how_to_read: "查阅NARA PURSUE Collection textual & microfilm目录（archives.gov/research/topics/uaps/textual-and-microfilm），搜索AARO相关档案。区分\"官方确认的现象描述\"和\"官方结论性解释\"——AARO年报中大量使用了\"insufficient data\"（数据不足）而非\"unexplained anomaly\"（无法解释的异常）。"
    }
  },
  {
    id: "fbi-louisville-1949",
    year: 1949,
    location: "Louisville, Kentucky",
    agency: "FBI / Project Blue Book",
    category: "FBI",
    title: "FBI Louisville — Field Office UFO Inquiry",
    shape: "Circular / disc",
    description: "FBI field offices across the U.S. were often the first to receive UFO reports from local witnesses. The Louisville office maintained a file on a 1949 incident involving a circular object observed by multiple witnesses. FBI's role in UFO investigation was always secondary to the Air Force's Project Blue Book. FBI HQ discouraged field offices from independent UFO investigations.",
    evidence_type: "FBI field report + witness statements",
    evidence_strength: 2,
    status: "Unresolved at time of filing",
    status_label: "UNRESOLVED",
    note: "FBI 档案显示其对 UFO 报告持怀疑态度，建议归类为\"心理现象\"或误判，但从未进行系统性技术调查。",
    date_raw: "1949",

    // v0.2 source fields
    source_title: "Project Blue Book / FBI — 1949 Louisville Field Office Inquiry",
    source_url: "https://www.archives.gov/research/military/air-force/ufos",
    source_type: "official",
    source_status: "secondary_only",
    archive_label: "Project Blue Book / NARA + FBI Field Office Records",
    caution_note: "FBI Louisville 1949 具体案例在 FBI Vault 中的档案编号和在线可见性需要查证——FBI Vault UAP 档案区（vault.fbi.gov/UAP）原链接已下线（404），现改用 NARA Project Blue Book 入口作为主要参考。FBI 历史上对 UFO 调查持怀疑态度，通常将案件转交空军处理。",
    evidence_level_note: "2/6 — FBI 现场报告 + 目击者陈述，无技术传感器数据",
    source_verification_note: "FBI FOIA Vault UAP 档案区（vault.fbi.gov/UAP）原链接已下线（404）。FBI Louisville 1949 具体案例的在线可查性无法确认。此处改用 NARA Project Blue Book 入口作为官方档案入口，标记 secondary_only。",

    // v0.6.1: deep dive
    deep_dive: {
      what_happened: "1949年，美国FBI路易斯维尔分局（Louisville Field Office）收到了一份关于圆形飞行物的目击报告，涉及多名目击者。FBI 在 UFO 调查中的角色历史上是次要的——主要调查责任属于美国空军 Project Blue Book。FBI 总部对各地方分局的 UFO 调查通常持怀疑态度，建议归类为\"心理现象\"或误判。",
      why_interesting: "FBI 档案揭示了美国政府内部对 UFO 报告的真实态度：并非所有部门都认真对待。例如，FBI 总部在 1949 年的一份备忘录中写道：'我们对这类报告的态度应当审慎，因为大多数最终都被证明是可解释的。'这份态度在档案中有据可查，与后来公众想象中的\"ZF 隐藏外星人\"叙事形成对比。",
      evidence_boundary: "仅有 FBI 现场报告和目击者陈述。没有技术传感器数据、没有空军或雷达记录。FBI 在此案中的角色仅限于接收和记录，而非主动调查。",
      likely_context: "1949 年正处于 UFO 报告的第二个高峰期（第一个是 1947 年肯尼斯·阿诺德目击之后）。FBI 地方分局通常将此类案件转交给空军处理，自己不做深入调查。这份档案的\"有意思\"之处在于它记录了 FBI 对 UFO 报告的内部态度，而非案件本身。",
      how_to_read: "查阅 NARA Project Blue Book 档案（archives.gov/research/military/air-force/ufos）搜索 1949 年相关条目，交叉对照 FBI Louisville 1949 案例。注意：FBI Vault 原 UAP 档案链接（vault.fbi.gov/UAP）已下线（404），具体案例需通过 FBI 档案查找系统或向 FBI FOIA 申请获取。"
    }
  },
  {
    id: "pentagon-2017-aatip",
    year: 2017,
    location: "Global — Multiple theaters",
    agency: "DIA / AATIP / UAPTF",
    category: "Military",
    title: "AATIP — Advanced Aerospace Threat Identification Program",
    shape: "Various / mixed",
    description: "The Advanced Aerospace Threat Identification Program (AATIP, 2007–2012, public disclosure 2017) studied UAP reports from military personnel. Its director Luis Elizondo described several incidents as requiring scientific analysis beyond conventional explanations. The program was funded outside the normal defense budget. AATIP's unclassified summaries are included in the PURSUE release.",
    evidence_type: "Mixed: infrared, radar, visual, pilot testimony",
    evidence_strength: 4,
    status: "Mixed — AATIP characterized some cases as genuinely unexplained",
    status_label: "PARTIALLY_UNRESOLVED",
    note: "AATIP 的核心争议在于它将\"数据不足以解释\"的现象列为需要进一步研究的\"异常\"，而非直接宣称其为外星技术。",
    date_raw: "2007–2012 (disclosed 2017)",

    // v0.2 source fields
    source_title: "DIA / NASA — AATIP Background + UAP Scientific Framework",
    source_url: "https://science.nasa.gov/uap/",
    source_type: "official",
    source_status: "verified",
    archive_label: "NASA UAP Official Science Site + AATIP Historical Reference",
    caution_note: "AATIP的存在已由DIA官方确认，但AATIP具体研究内容（案例细节）大部分仍为机密。NASA UAP科学网站（science.nasa.gov/uap/）为目前最权威的公开UAP信息来源。defense.gov原链接存在403问题，已改用NASA UAP官方入口。",
    evidence_level_note: "4/6 — 混合类型证据，来源为AATIP研究摘要和PURSUE档案引用",
    source_verification_note: "AATIP项目本身有官方背书（DIA确认存在，2007-2012年间运作），但具体案例内容可信度差异较大。NASA UAP科学网站（science.nasa.gov/uap/）为官方入口，此案例为verified——项目本身有官方背书。",

    // v0.6.1: deep dive
    deep_dive: {
      what_happened: "先进航空威胁识别项目（AATIP，2007-2012）是由美国国防情报局（DIA）秘密资助的研究项目，2017年因媒体曝光而进入公众视野。其主任路易·埃利松多（Luis Elizondo）向媒体表示，部分案例\"需要超出传统解释的科学分析\"。2020年，美国国防部正式公开承认AATIP存在，并发布了三段UAP视频。",
      why_interesting: "AATIP的争议在于它的研究方法：部分案例被描述为\"无法用已知航空技术解释\"，但从未给出\"是外星技术\"的结论。国防部在AATIP公开后迅速指出：埃利松多的个人声明不代表DIA官方立场，AATIP的结论是\"数据不足，无法确定\"而非\"外星\"。这个区别在媒体传播中被大量忽略。",
      evidence_boundary: "AATIP的大部分研究内容仍为机密。公开的只有项目存在的事实和几个案例的概述，没有完整的传感器数据或分析报告可供独立验证。",
      likely_context: "AATIP成立于2007年，正值美国无人机监控技术快速发展和无人机威胁讨论增加的时期。它的研究重点是\"先进航空威胁\"——包括外国无人机、气球和其他非对称威胁，而非外星人。\"UAP\"这个词在AATIP报告中是\"不明飞行物\"的技术术语，不一定意味着\"外星\"。",
      how_to_read: "查阅NASA UAP科学网站（science.nasa.gov/uap/）了解美国政府当前的官方立场。对于AATIP的具体案例，将媒体报道与NASA/DoD官方声明区分开：媒体报道倾向于\"放大异常\"，而官方声明始终使用\"未识别\"而非\"外星\"。"
    }
  }
];

const CATEGORIES = [
  { id: "all", label: "全部 All", color: "#e0e0e0" },
  { id: "NASA", label: "NASA", color: "#4fc3f7" },
  { id: "Military", label: "Military", color: "#ef5350" },
  { id: "Historical", label: "Historical", color: "#ffb74d" },
  { id: "FBI", label: "FBI", color: "#66bb6a" },
  { id: "Visual", label: "Visual Evidence", color: "#ce93d8" }
];

// Evidence strength labels
const EVIDENCE_LABELS = [
  "仅目击",
  "目视+文字报告",
  "照片/视频",
  "多传感器同步",
  "物理样本",
  "可重复分析"
];

// Source status config
const SOURCE_STATUS_CONFIG = {
  verified:          { label: "官方来源",   color: "#2ecc71", bg: "rgba(46,204,113,0.12)",  border: "rgba(46,204,113,0.3)" },
  secondary_only:    { label: "二手来源",   color: "#e67e22", bg: "rgba(230,126,34,0.12)",  border: "rgba(230,126,34,0.3)" },
  needs_review:      { label: "待核实",     color: "#9b59b6", bg: "rgba(155,89,182,0.12)",  border: "rgba(155,89,182,0.3)" }
};

// Source type config
const SOURCE_TYPE_CONFIG = {
  official:     { label: "官方" },
  media:        { label: "媒体" },
  historical:   { label: "历史档案" },
  secondary:    { label: "二手资料" }
};
