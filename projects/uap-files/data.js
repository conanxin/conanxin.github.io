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
    source_url: "https://www.nasa.gov/mission_pages/gemini/gemini7.html",
    source_type: "official",
    source_status: "secondary_only",
    archive_label: "NASA Gemini VII Mission Documentation",
    caution_note: "NASA 官网提供任务概述页面，但具体\"bogey\"对话内容的原始 transcript 需查阅 NASA History Research Center 存档。现有描述基于 NASA 历史文献整理，非逐字引用。",
    evidence_level_note: "2/6 — 仅有宇航员口头报告 + 任务日志文字记录，无传感器同步数据",
    // Source verification note
    source_verification_note: "NASA 官网有 Gemini VII 任务主页，但'bogey'事件的具体舱段对话未在主站直接可查，需通过 NASA History Division 或 NTRS (NASA Technical Reports Server) 获取原始记录。此处标记为 secondary_only。",
    
    // v0.2.1: secondary narrative sources (not counted in source_status primary)
    secondary_sources: [
      {
        title: "NASA NTRS — Gemini VII Mission Transcripts",
        url: "https://www.nasa.gov/mission_pages/gemini/gemini7.html",
        type: "secondary",
        note: "主档案为 NASA 官网概述。此链接指向任务页面，原始舱音记录需在 NTRS 另行查询。"
      }
    ]
  },
  {
    id: "apollo-11-lunar-flash-1969",
    year: 1969,
    location: "Lunar surface, Mare Tranquillitatis",
    agency: "NASA / Apollo 11",
    category: "NASA",
    title: "Apollo 11 — Transient Lunar Flashes",
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
    caution_note: "NASA 官网 Apollo 11 页面概述任务全程。\"闪光\"现象（cosmic ray phosphenes）的医学解释在 NASA 技术报告系统中有记录，但非每个 Apollo 11 页面都直接讨论此现象。",
    evidence_level_note: "3/6 — 宇航员目视 + NASA 医学调查记录，但原始医学报告需查阅 NASA 技术报告 NTRS",
    source_verification_note: "宇宙射线光幻视（phosphenes）在 NASA 医学研究中有记录，但 Apollo 11 任务报告中对这一具体事件的描述需核实。标记为 secondary_only。"
  },
  {
    id: "apollo-12-occultation-1969",
    year: 1969,
    location: "Lunar orbit, Moon",
    agency: "NASA / Apollo 12",
    category: "NASA",
    title: "Apollo 12 — Point of Light / Object Near Moon",
    shape: "Bright point / starlike object",
    description: "During Apollo 12's lunar orbit, crew reported seeing a starlike object near the Moon. Similar reports occurred during Apollo 17. Speculation included debris in lunar orbit, reflected sunlight from mission hardware, or atmospheric effects. Records are incomplete and explanations are uncertain.",
    evidence_type: "Astronaut visual only",
    evidence_strength: 1,
    status: "Unresolved — insufficient data",
    status_label: "UNRESOLVED",
    note: "仅有口头报告，无仪器记录。在月球轨道无大气散射的条件下，小型碎片反射阳光可产生极其明亮的星点状目标。",
    date_raw: "1969-11-19",

    // v0.2 source fields
    source_title: "WAR.GOV / NASA — Apollo 12 Mission Transcript (PURSUE Release 1)",
    source_url: "https://www.war.gov/medialink/ufo/release_1/nasa-uap-d1-apollo-12-transcript-1969.pdf",
    source_type: "official",
    source_status: "verified",
    archive_label: "WAR.GOV PURSUE Release 01 / NASA UAP Document D1",
    caution_note: "官方 PDF 可验证该任务记录/转录文本存在，并包含舱内异常目击对话记录。但现象解释仍未定；不得据此推断外星来源。",
    evidence_level_note: "1/6 — 仅有宇航员口头报告，无任何仪器或书面记录佐证",
    source_verification_note: "WAR.GOV PURSUE Release 01 包含 NASA Apollo 12 舱音转录文本 PDF，可验证该目击事件在官方档案中正式记录。升级为 verified。",

    // v0.3: verification_hint
    verification_hint: {
      archive: "WAR.GOV / NASA",
      query_terms: ["Apollo 12", "transcript", "lunar orbit", "point of light"],
      target: "PURSUE Release 1 — NASA-UAP-D1-Apollo-12-Transcript-1969.pdf"
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
    caution_note: "该案例来自公开报道/转述；目前仍需 NARA 或 Blue Book 具体档案编号核实。v0.3.3 NARA streaming scan 结果：catalog-export-597821.json (NAID 597821，85.7 MB) 以 6–75 KB/s 速度分 2 次流式扫描，共读取 60,358,656 bytes（约 67.2% 文件），未在 case-file title/index 中发现 \"Pan Am\" 或 \"Pan American\" 关键词；关键词命中仅限 Alaska/Hawaii/1947-09/September（无 Pan Am 共现）。catalog-export-595466.json (8 KB) 和 40027753.json (24 KB) 同前次检查，未命中。最终判定：needs_review — 未找到精确条目；下一步建议：T-1206 microfilm roll 1 (July–September 1947 Alaska overflights) 或 NARA reading room finding aid 人工核查。不得将媒体报道/转述视为外星证据。",
    evidence_level_note: "2/6 — 飞行员口头报告转书面记录，无雷达、无残骸、无多传感器",
    source_verification_note: "无法确认此案例在 Project Blue Book 解密文件中的具体编号。NARA Project Blue Book 官方入口已列为此 source_url，但具体档案编号仍待核实。此案例保留 needs_review，不为降低 needs_review 数量而强行升级。",

    // v0.3: verification_hint — 协助用户自行核实
    verification_hint: {
      archive: "NARA / National Archives",
      query_terms: ["Pan Am", "Alaska", "1947", "blue book", "orange object"],
      target: "Project Blue Book case file number (e.g. BB case #XXXX)"
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

    // v0.3: verification_hint
    verification_hint: {
      archive: "UK National Archives",
      query_terms: ["Rendlesham", "Woodbridge", "DEFECEP 24/1948/1", "MOD UFO"],
      target: "DEFE 24/1948/1 — Rendlesham Forest incident correspondence"
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
    source_title: "DoD / UAP Task Force — Official Distribution of UAP Footage (2020)",
    source_url: "https://www.defense.gov/News/News-Stories/Article/Article/2329013/pentagon Releases-Footage-of-UAP/",
    source_type: "official",
    source_status: "verified",
    archive_label: "DoD Official UAP Footage Release (2020)",
    caution_note: "五角大楼于 2020 年正式发布三段 UAP 视频（GIMBAL / GOFAST / TIC TAC），确认视频真实性。此案例档案在官方 PURSUE 系统中被引用，但原始视频发布于 defense.gov 新闻稿。",
    evidence_level_note: "5/6 — 红外视频 + 雷达 + 多名飞行员目视，高度异常但无实物样本——跨传感器交叉验证强",
    source_verification_note: "DoD 官方新闻稿确认视频真实性（2020年）。PURSUE 档案引用了此案例。此案例为 v0.2 中来源最明确的 verified 级别。",
    
    // v0.2.1: secondary narrative sources (not counted in source_status primary)
    secondary_sources: [
      {
        title: "NYTimes / Politico — Nimitz Tic Tac Pilot Accounts",
        url: "https://www.nytimes.com/2019/05/26/us/ufo-pentagon.html",
        type: "media",
        note: "官方来源仅确认视频真实。飞行员叙述细节来自媒体报道，不代表官方立场。"
      }
    ]
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
    source_title: "DoD / UAP Task Force — Official Distribution of UAP Footage (2020)",
    source_url: "https://www.defense.gov/News/News-Stories/Article/Article/2329013/pentagon Releases-Footage-of-UAP/",
    source_type: "official",
    source_status: "verified",
    archive_label: "DoD Official UAP Footage Release (2020)",
    caution_note: "GOFAST 视频与 GIMBAL、TIC TAC 同期由 DoD 于 2020 年官方发布。与 TIC TAC 同来源，但物体解释方向不同。",
    evidence_level_note: "4/6 — 红外视频 + 雷达，部分分析师认为是气球，但官方未最终定性",
    source_verification_note: "与 USS Nimitz TIC TAC 同属 DoD 2020 年发布的三个视频之一。verified 来源。",

    // v0.2.1: secondary narrative sources
    secondary_sources: [
      {
        title: "To The Stars Academy — Gofast Full Video + Analysis",
        url: "https://thestarsacademy.com/",
        type: "media",
        note: "Gofast 的昵称和'高速海上飞行'叙事框架来自 To The Stars Academy (2019) 首发，不代表 DoD 官方分析。"
      }
    ]
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
    source_url: "https://www.aaro.mil/Reports/Annual-Reports/FY2023/UAP-Annual-Report-FY2023.aspx",
    source_type: "official",
    source_status: "verified",
    archive_label: "AARO FY2023 Annual Report (aaro.mil)",
    caution_note: "AARO FY2023 年报确实记录了'Orbs'类案例，并对部分案例做出了\"商业航班窗户反光\"的解释。报告明确区分了\"已解释\"与\"未解释\"案例，未声称任何异常为外星起源。",
    evidence_level_note: "3/6 — 目视 + 红外 + 用户描述混合，传感器质量参差不齐",
    source_verification_note: "AARO 年报为 aaro.mil 官方发布。PURSUE Release 01 引用了 AARO 数据。此案例为 verified。"
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
    source_title: "FBI FOIA Vault — UAP / UFO Files",
    source_url: "https://vault.fbi.gov/UAP%20/UAP%20Part%2001%20of%2001/",
    source_type: "official",
    source_status: "secondary_only",
    archive_label: "FBI FOIA Vault — UAP Files",
    caution_note: "FBI 在 vault.fbi.gov 设有 UFO/UAP FOIA 档案库，包含了历史上 FBI 收到的 UFO 报告。Louisville 1949 具体案例是否在此档案中编号，需要对照核实。FBI FOIA 档案编号和在线可查内容存在差异。",
    evidence_level_note: "2/6 — FBI 现场报告 + 目击者陈述，无技术传感器数据",
    source_verification_note: "FBI FOIA Vault 确认存在，但 Louisville 1949 具体案例在 FBI Vault 中的档案编号和在线可见性需要查证。此处标记 secondary_only。"
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
    source_title: "DIA — AATIP Background Statement (via DoD News)",
    source_url: "https://www.defense.gov/News/News-Stories/Article/Article/3459282/dod-takes-steps-to-safeguard-military-operations-from-uap-threats/",
    source_type: "official",
    source_status: "verified",
    archive_label: "DoD Official Statement on AATIP",
    caution_note: "AATIP 的存在已由 DIA 官方确认，但 AATIP 具体研究内容（案例细节）大部分仍为机密。路易·埃利松多（Luis Elizondo）2017 年向媒体公开披露了 AATIP，但他以个人身份发言，其声明不代表 DIA 官方立场。",
    evidence_level_note: "4/6 — 混合类型证据，来源为 AATIP 研究摘要和 PURSUE 档案引用",
    source_verification_note: "DoD 官方确认 AATIP 存在（via defense.gov 新闻稿）。具体案例内容在 PURSUE 档案中有引用。此案例为 verified——AATIP 项目本身有官方背书，但具体案例内容可信度差异较大。"
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
