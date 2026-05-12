'use strict';

// ==================== LOCATION DATABASE ====================
const LOCATIONS = [
  {
    id: 'changan',
    name: '长安',
    modern: '西安',
    theme: '盛唐裂缝',
    event: '杜甫困守长安十年，求官不得，目睹朝政腐败与社会不公。',
    poems: '《奉赠韦左丞丈二十二韵》《兵车行》《丽人行》',
    quote: '“骑驴十三载，旅食京华春”',
    articleMeaning: '杜甫困守长安的十年，是求仕不得的十年，也是目睹盛唐繁华背后裂缝的十年。这段经历让他对社会不公有了一线亲身认知，为后来的现实主义诗歌埋下伏笔。',
    travelTip: '大雁塔、大明宫遗址公园、回坊饮食',
    routeGroup: 'changan',
    siteType: '成熟景区+历史对应点'
  },
  {
    id: 'lianling',
    name: '骊山',
    modern: '临潼',
    theme: '宫廷与民间',
    event: '杜甫赴奉先途中经过华清宫、骊山，见证宫廷奢华与民间饥寒的强烈对照。',
    poems: '《自京赴奉先县咏怀五百字》（途经）',
    quote: '',
    articleMeaning: '骊山华清宫的奢华与路上民间的饥寒形成刺目对照，杜甫第一次在诗中并置了两个截然不同的世界。',
    travelTip: '华清宫、骊山风景区',
    routeGroup: 'fengxian',
    siteType: '成熟景区'
  },
  {
    id: 'fengxian',
    name: '奉先',
    modern: '蒲城',
    theme: '现实主义转折点',
    event: '杜甫探望家人，发现家人贫困、幼子饿死。写出“朱门酒肉臭，路有冻死骨”。',
    poems: '《自京赴奉先县咏怀五百字》',
    quote: '“朱门酒肉臭，路有冻死骨”',
    articleMeaning: '这是杜甫现实主义的真正起点。他把个人的家庭悲剧（幼子饿死）与社会的两极分化并置，突破了盛唐诗歌回避社会现实的传统。',
    travelTip: '蒲城杜甫纪念馆、桥陵',
    routeGroup: 'fengxian',
    siteType: '历史对应点+文学寻访点'
  },
  {
    id: 'baishui',
    name: '白水',
    modern: '白水/彭衙',
    theme: '安史逃亡起点',
    event: '安史之乱爆发，杜甫携家从这里开始逃难。',
    poems: '《彭衙行》',
    quote: '“痴女饥咬我，啼畏虎狼闻”',
    articleMeaning: '杜甫从士人变成逃难的父亲。孩子的饥饿、山路的艰险——个体的苦难不再是士大夫诗歌中的隐喻，而成为诗歌直接的书写对象。',
    travelTip: '白水彭衙古道遗址',
    routeGroup: 'anshi',
    siteType: '文学寻访点+考证提示点'
  },
  {
    id: 'pengxia',
    name: '彭衙',
    modern: '白水',
    theme: '逃难父亲',
    event: '安史之乱爆发后，杜甫携家从白水一带逃往鄜州羌村。山路艰险，孩子饥饿啼哭，杜甫在《彭衙行》中写下“痴女饥咬我，啼畏虎狼闻”。这里呈现的不是抽象乱世，而是一个父亲在逃亡路上的身体经验。',
    poems: '《彭衙行》',
    quote: '“痴女饥咬我，啼畏虎狼闻”',
    articleMeaning: '杜甫从士人变成了逃难的父亲。孩子的饥饿、山路的艰险、虎狼的威胁——个体的苦难不再是士大夫诗歌中的隐喻，而成为诗歌直接的书写对象。',
    travelTip: '彭衙故道',
    routeGroup: 'anshi',
    siteType: '文学寻访点+考证提示点'
  },
  {
    id: 'fuxian',
    name: '鄜州',
    modern: '富县',
    theme: '乱世家人',
    event: '杜甫家人避难地。',
    poems: '',
    quote: '',
    articleMeaning: '杜甫家人的避难地，后来杜甫回家团聚。',
    travelTip: '富县',
    routeGroup: 'qiangcun',
    siteType: '文学寻访点+历史对应点'
  },
  {
    id: 'qiangcun',
    name: '羌村',
    modern: '富县',
    theme: '劫后团聚',
    event: '杜甫回家与家人团聚，劫后重逢，写下《羌村三首》《北征》。',
    poems: '《羌村三首》《北征》',
    quote: '“妻孥怪我在，惊定还拭泪”',
    articleMeaning: '乱离中的一次重逢。杜甫把家庭团聚写入诗中——乱世中的普通人也有他们的悲欢，而不是只有帝王将相才值得被记录。',
    travelTip: '富县羌村杜甫故居、羌村古镇',
    routeGroup: 'qiangcun',
    siteType: '文学寻访点+历史对应点'
  },
  {
    id: 'lingwu',
    name: '沦陷长安',
    modern: '西安',
    theme: '战乱见证者',
    event: '杜甫被叛军俘获，困居沦陷长安近一年，写下《春望》《月夜》《哀江头》。',
    poems: '《春望》《月夜》《哀江头》《悲陈陶》《悲青坂》',
    quote: '“国破山河在，城春草木深”',
    articleMeaning: '杜甫不再是旁观者，而是战乱的直接见证者。他把沦陷长安的绝望、城春草木的荒凉、国家破碎的切肤之痛写入诗中——“诗史”的第一次真正出现。',
    travelTip: '西安城墙、大明宫遗址',
    routeGroup: 'changan',
    siteType: '历史对应点'
  },
  {
    id: 'fengxiang',
    name: '凤翔',
    modern: '凤翔',
    theme: '短暂入朝',
    event: '杜甫逃出长安投奔肃宗，被授左拾遗，进入朝廷中心。后因直谏被疏远。',
    poems: '《喜达行在所三首》《述怀》',
    quote: '“生还今日事，间道暂时人”',
    articleMeaning: '杜甫短暂进入朝廷中心，很快因为直谏而受挫。这段经历让他看清了朝廷内部的政治现实，也为他后来彻底转向民间埋下了伏笔。',
    travelTip: '凤翔东湖、唐遗址公园',
    routeGroup: 'fengxiang',
    siteType: '历史对应点'
  },
  {
    id: 'luoyang',
    name: '洛阳',
    modern: '洛阳',
    theme: '三吏三别起点',
    event: '杜甫从洛阳出发，一路向北，见证征兵、抓丁。',
    poems: '',
    quote: '',
    articleMeaning: '三吏三别路线的起点。',
    travelTip: '龙门石窟、白马寺',
    routeGroup: 'sanli',
    siteType: '历史对应点+文学寻访点'
  },
  {
    id: 'xinan',
    name: '新安',
    modern: '新安',
    theme: '征兵现场',
    event: '杜甫见官府征兵，连未成年人也不放过。',
    poems: '《新安吏》',
    quote: '“客行新安道，喧呼闻点兵”',
    articleMeaning: '杜甫亲眼看到征兵场景，官吏抓走年轻男子，留下无助的家人。普通人成为历史记载的主角——这是杜甫“诗史”最重要的突破。',
    travelTip: '新安古城',
    routeGroup: 'sanli',
    siteType: '历史对应点+文学寻访点'
  },
  {
    id: 'shihao',
    name: '石壕',
    modern: '石壕',
    theme: '夜抓壮丁',
    event: '杜甫夜投石壕村，见官吏抓壮丁，老妇被迫应征。',
    poems: '《石壕吏》',
    quote: '“暮投石壕村，有吏夜捉人”',
    articleMeaning: '《石壕吏》是“诗史”最经典的代表：官吏是历史推动者，但杜甫的镜头对准的是被官吏带走的老翁和留在家中哭泣的老妇。一个“无名”的普通人因杜甫的诗而永恒。',
    travelTip: '石壕村杜甫纪念馆',
    routeGroup: 'sanli',
    siteType: '历史对应点+文学寻访点'
  },
  {
    id: 'tongguan',
    name: '潼关',
    modern: '潼关',
    theme: '天险防御',
    event: '杜甫过潼关，见唐军设防准备迎敌。',
    poems: '《潼关吏》',
    quote: '“士卒何草草，筑城潼关道”',
    articleMeaning: '杜甫既写守关士兵的辛苦，也写潼关天险的地利——不是单纯的反战，也不是单纯的歌颂，而是记录战争中各个位置的普通人的真实处境。',
    travelTip: '潼关古城墙、黄河风陵渡',
    routeGroup: 'sanli',
    siteType: '历史对应点+文学寻访点'
  },
  {
    id: 'huazhou',
    name: '华州',
    modern: '华州',
    theme: '庙堂理想终结',
    event: '杜甫任华州司功参军，政治理想受挫，写《夏日叹》《夏夜叹》，后离开华州西行。',
    poems: '《发华州》《夏日叹》《夏夜叹》',
    quote: '',
    articleMeaning: '杜甫从“致君尧舜上”的庙堂理想，转向漂泊流寓的现实人生。这是他人生和诗歌的根本转折点，离开华州后再未长期回到体制内。',
    travelTip: '华州高铁可达西安',
    routeGroup: 'sanli',
    siteType: '历史对应点'
  },
  {
    id: 'qinzhou',
    name: '秦州',
    modern: '天水',
    theme: '草堂梦萌发',
    event: '杜甫流寓秦州约三个月，创作密集，写下大量纪行诗、怀人诗、忧国诗。',
    poems: '《秦州杂诗二十首》《月夜忆舍弟》《梦李白二首》',
    quote: '“露从今夜白，月是故乡明”',
    articleMeaning: '杜甫第一次明确产生“草堂”构想——找一个安静的地方，以著书为生，不再过问朝廷是非。秦州是他从“庙堂”彻底转向“民间”的过渡期，也是创作密度最高的时期之一。',
    travelTip: '天水古城、麦积山石窟、南郭寺',
    routeGroup: 'qinzhou',
    siteType: '成熟景区+历史对应点'
  },
  {
    id: 'dongke',
    name: '东柯谷',
    modern: '天水',
    theme: '草堂地寻觅',
    event: '赞公和尚带杜甫寻找草堂地，草堂梦第一次具体化但最终未能实现。',
    poems: '《西枝村寻置草堂地》',
    quote: '',
    articleMeaning: '杜甫在秦州时期，赞公和尚引导他寻找可以安居的地方（东柯谷/西枝村），草堂的概念第一次明确出现，但最终未能实现。这次失败为后来真正的成都草堂埋下了愿望。',
    travelTip: '东柯谷距天水市区约30公里，需包车',
    routeGroup: 'qinzhou',
    siteType: '文学寻访点+考证提示点'
  },
  {
    id: 'guozhi',
    name: '西枝村',
    modern: '天水',
    theme: '草堂地寻觅',
    event: '杜甫寻找置草堂地，最终未能成功。',
    poems: '《西枝村寻置草堂地》',
    quote: '',
    articleMeaning: '与东柯谷一起，是杜甫草堂梦的第一次尝试，为成都草堂做铺垫。',
    travelTip: '西枝村遗址',
    routeGroup: 'qinzhou',
    siteType: '文学寻访点+考证提示点'
  },
  {
    id: 'tonggu',
    name: '同谷',
    modern: '成县',
    theme: '理想居所破灭',
    event: '杜甫以为可以安居，实际更加贫病困顿，写下《同谷七歌》《万丈潭》。',
    poems: '《乾元中寓居同谷县作歌七首》《万丈潭》《凤凰台》《发同谷县》',
    quote: '“奈何迫物累，一岁四行役”',
    articleMeaning: '同谷是杜甫一生中最困顿的时期之一：贫病交迫，居无定所，理想居所再次破灭。他把个人的绝境写进诗里，但即便在这种处境下，他仍然在写作——绝境成就了更深沉的诗歌。',
    travelTip: '成县杜甫草堂遗址纪念馆、万丈潭',
    routeGroup: 'tonggu',
    siteType: '成熟景区+文学寻访点'
  },
  {
    id: 'guangyuan',
    name: '广元',
    modern: '广元/明月峡',
    theme: '嘉陵江与陇蜀道',
    event: '杜甫沿嘉陵江入蜀，写下连续纪行诗。',
    poems: '《木皮岭》《白沙渡》《水会渡》《五盘》',
    quote: '',
    articleMeaning: '杜甫携家沿嘉陵江上游入蜀，山水诗风从此改变——山水不再是文人观赏的对象，而成为逃难道路上的障碍和见证。',
    travelTip: '明月峡景区、昭化古城',
    routeGroup: 'longshu',
    siteType: '成熟景区+古道寻访'
  },
  {
    id: 'jianmenguan',
    name: '剑门',
    modern: '剑门关',
    theme: '天险入蜀',
    event: '杜甫过剑门关，天险之壮与政治地理之重在此交汇。',
    poems: '《剑门》',
    quote: '“惟天有设险，剑门天下壮”',
    articleMeaning: '剑门关是蜀道最险要处，也是杜甫入蜀的标志性路段。山水诗不再是闲适的审美对象，而是逃难路线上的真实艰险——自然与政治在此合一。',
    travelTip: '剑门关景区（需爬山，建议舒适鞋子）',
    routeGroup: 'longshu',
    siteType: '成熟景区'
  },
  {
    id: 'chengdu',
    name: '成都草堂',
    modern: '成都',
    theme: '草堂建成',
    event: '杜甫抵达成都，在严武等人帮助下营建草堂，获得相对安定的创作空间。',
    poems: '《成都府》《堂成》《春夜喜雨》《茅屋为秋风所破歌》',
    quote: '“安得广厦千万间，大庇天下寒士俱欢颜”',
    articleMeaning: '草堂是杜甫一生中难得的安定时期，但他并未停止写作和思考——《茅屋为秋风所破歌》中“安得广厦千万间”把个人困境与天下寒士的命运相连，完成了从个人到社会的终极关怀。',
    travelTip: '杜甫草堂博物馆、武侯祠、锦里古街',
    routeGroup: 'chengdu',
    siteType: '成熟景区'
  }
];

// ==================== TIMELINE DATA ====================
const TIMELINE = [
  {
    year: '755',
    title: '长安 → 奉先',
    locations: '长安、骊山、奉先（蒲城）',
    event: '杜甫自长安赴奉先探家，过骊山华清宫，到家后发现家人贫困、幼子饿死。写下《自京赴奉先县咏怀五百字》，发出“朱门酒肉臭，路有冻死骨”的千古一叹。',
    poems: '《自京赴奉先县咏怀五百字》',
    why: '杜甫现实主义的真正起点：个人家庭悲剧与社会两极分化并置，突破盛唐诗歌回避社会现实的传统。'
  },
  {
    year: '756',
    title: '安史之乱爆发，携家逃亡',
    locations: '白水、彭衙 → 鄜州羌村（富县）',
    event: '安史之乱爆发，杜甫携家从白水逃往鄜州羌村。山路艰险，饥寒交迫，孩子啼哭、虎狼威胁——杜甫从一个士人变成了逃难的父亲。《彭衙行》记录了这段历程：“痴女饥咬我，啼畏虎狼闻”。',
    poems: '《彭衙行》',
    why: '杜甫把个人在逃亡中的身体经验（饥饿、恐惧、父亲的无力感）直接写入诗中——个体的苦难不再是隐喻，而成为诗歌的直接对象。'
  },
  {
    year: '756/757',
    title: '投奔灵武，被俘，押回长安',
    locations: '沦陷长安（西安）',
    event: '杜甫投奔灵武途中被叛军俘获，押回沦陷的长安。困居城中近一年，写下《春望》《月夜》《哀江头》《悲陈陶》《悲青坂》。',
    poems: '《春望》《月夜》《哀江头》',
    why: '杜甫成为战乱的直接见证者——不再是旁观者，而是“诗史”的书写者。'
  },
  {
    year: '757',
    title: '长安 → 凤翔 → 鄜州',
    locations: '凤翔、鄜州羌村（富县）',
    event: '杜甫逃出长安，投奔肃宗行在，被授左拾遗，进入朝廷核心。因直谏被疏远，后被放还鄜州探家，写《羌村三首》《北征》。',
    poems: '《羌村三首》《北征》《喜达行在所三首》',
    why: '杜甫短暂进入朝廷又被迫离开，看清政治现实，视角彻底转向民间。劫后与家人重逢，写下“妻孥怪我在，惊定还拭泪”。'
  },
  {
    year: '758/759',
    title: '洛阳 → 新安 → 石壕 → 潼关 → 华州',
    locations: '洛阳、新安、石壕、潼关、华州',
    event: '杜甫从洛阳出发，一路向北，目睹征兵、抓丁、家庭离散。写下《三吏》（新安吏、石壕吏、潼关吏）和《三别》（新婚别、垂老别、无家别）。',
    poems: '《新安吏》《石壕吏》《潼关吏》《新婚别》《垂老别》《无家别》',
    why: '“诗史”正式成型：官吏、老翁、新娘、老妇——普通人在历史记载中从无名字，却因杜甫的诗成为永恒。'
  },
  {
    year: '759',
    title: '华州 → 秦州',
    locations: '华州 → 秦州（天水）',
    event: '杜甫任华州司功参军，政治理想受挫，写《夏日叹》《夏夜叹》，后离开华州，西行流寓秦州。约三个月，创作密集，写下《秦州杂诗二十首》《月夜忆舍弟》《梦李白二首》。',
    poems: '《秦州杂诗二十首》《月夜忆舍弟》《梦李白二首》《发华州》',
    why: '杜甫从“致君尧舜上”的庙堂理想彻底转向漂泊现实。草堂梦第一次明确出现——找一个安静的地方，以著书为生。'
  },
  {
    year: '759',
    title: '秦州 → 东柯谷/西枝村',
    locations: '秦州（天水）、东柯谷、西枝村',
    event: '赞公和尚带杜甫寻找草堂地。杜甫第一次具体规划自己的隐居之所，在东柯谷和西枝村寻找可以安居的地方，但最终未能实现。',
    poems: '《西枝村寻置草堂地》',
    why: '草堂概念第一次具体化——成都草堂的前奏。虽然失败，但为759年末的最终抵达成都埋下了愿望。'
  },
  {
    year: '759',
    title: '秦州 → 同谷',
    locations: '同谷（成县）',
    event: '杜甫离开秦州，南下同谷。以为可以安居，实际更加贫病困顿。写下《乾元中寓居同谷县作歌七首》《万丈潭》《凤凰台》。',
    poems: '《乾元中寓居同谷县作歌七首》《万丈潭》《凤凰台》',
    why: '杜甫一生最困顿的时期之一——贫病交迫，理想居所再次破灭。但即便在绝境中，他仍在写作；绝境成就了最深沉的诗歌。'
  },
  {
    year: '759',
    title: '同谷 → 广元 → 剑门 → 成都',
    locations: '同谷、广元、剑门、成都',
    event: '杜甫携家离开同谷，沿嘉陵江入蜀。写连续纪行诗《木皮岭》《白沙渡》《水会渡》《五盘》《剑门》。759年末抵达成都。',
    poems: '《木皮岭》《白沙渡》《水会渡》《五盘》《剑门》《成都府》',
    why: '山水不再是风景，而是逃难道路。杜甫的诗歌地理因此改变——自然、政治与个人命运在此合一。到成都后营建草堂，获得相对安定。'
  }
];

// ==================== ROUTE DATA ====================
const ROUTES = {
  '7day': [
    { day: 1, title: '天水秦州', theme: '流寓秦州，诗歌爆发', places: '天水城区、南郭寺、杜少陵祠', stay: '1天', transportTip: '适合以天水市区为基地，市内打车或公共交通结合步行；若延伸东柯谷、西枝村，建议单独安排半日或包车', poems: '《秦州杂诗》《月夜忆舍弟》《梦李白二首》', tip: '天水古城、麦积山石窟、南郭寺均可访古', liveQuestion: '杜甫为什么在秦州写得这么密集，却仍然没有留下来？', locs: ['qinzhou'] },
    { day: 2, title: '南郭寺、东柯谷', theme: '草堂梦的第一次出现', places: '南郭寺、东柯谷、西枝村', stay: '半天至1天', transportTip: '东柯谷距天水市区约30公里，需包车前往；西枝村需当地向导协助确认位置', poems: '《西枝村寻置草堂地》', tip: '南郭寺为成熟景区；东柯谷和西枝村属于文学寻访点，建议结合诗歌理解', liveQuestion: '杜甫的草堂梦是从什么时候开始清晰的？赞公为什么重要？', locs: ['dongke', 'guozhi'] },
    { day: 3, title: '成县同谷', theme: '理想居所破灭', places: '成县杜甫草堂遗址纪念馆、万丈潭', stay: '1天', transportTip: '成县城区内打车可达主要景点，万丈潭需自驾或包车前往郊外', poems: '《同谷七歌》《万丈潭》《凤凰台》', tip: '成县有杜甫草堂遗址纪念馆，万丈潭在郊外；现场感受“奈何迫物累，一岁四行役”', liveQuestion: '同谷比秦州更困顿，为什么杜甫还要来？这次失败对成都草堂意味着什么？', locs: ['tonggu'] },
    { day: 4, title: '成县 → 广元', theme: '陇蜀道与嘉陵江', places: '成县、广元城区', stay: '1天（赶路为主）', transportTip: '成县至广元建议自驾，沿途可感受嘉陵江上游地形；也可乘火车至广元', poems: '《发同谷县》《木皮岭》', tip: '建议自驾，途经陇蜀古道遗迹；广元城区可作中转休息点', liveQuestion: '杜甫的山水诗从什么时候开始不再是“观赏风景”，而是“逃难道路”？', locs: ['tonggu', 'guangyuan'] },
    { day: 5, title: '明月峡、昭化古城', theme: '古道与交通遗存', places: '明月峡景区、昭化古城', stay: '1天', transportTip: '明月峡和昭化古城相距较近，可安排在同一天；广元市区出发当日往返', poems: '《水会渡》《五盘》', tip: '明月峡景区、昭化古城均可参观；实地感受蜀道栈道的残存格局', liveQuestion: '明月峡的栈道和杜甫诗中写的“危途中”是什么关系？', locs: ['guangyuan'] },
    { day: 6, title: '剑门关', theme: '天险与政治地理', places: '剑门关景区', stay: '1天', transportTip: '广元至剑门关建议自驾或包车，车程约1.5小时；剑门关景区需爬山，建议穿舒适鞋子', poems: '《剑门》', tip: '剑门关景区是成熟景区，需要爬山，建议预留充足体力；可结合《剑门》诗句理解“惟天有设险”', liveQuestion: '剑门关的“政治地理”是什么意思？天险和杜甫的政治立场有什么关系？', locs: ['jianmenguan'] },
    { day: 7, title: '成都草堂', theme: '草堂终于成为现实', places: '杜甫草堂博物馆、武侯祠、锦里古街', stay: '2-3天', transportTip: '成都公共交通便利；杜甫草堂博物馆位于西郊，可乘地铁+步行到达', poems: '《成都府》《春夜喜雨》《茅屋为秋风所破歌》', tip: '杜甫草堂博物馆是必访之地，建议深度参观；武侯祠和锦里古街可作为晚间活动', liveQuestion: '杜甫在草堂终于安定了，为什么还在写“安得广厦千万间”？', locs: ['chengdu'] }
  ],
  '12day': [
    { day: 1, title: '西安（长安）', theme: '长安困守', places: '大雁塔、大明宫遗址公园、回坊', stay: '1-2天', transportTip: '西安地铁便利；适合以西安为起点，用公共交通串联主要景点', poems: '《奉赠韦左丞丈》《兵车行》《丽人行》', tip: '大雁塔、大明宫遗址公园、回坊；理解杜甫的困顿与盛唐繁华的关系', liveQuestion: '杜甫在长安十年求官不得，他的诗歌里如何反映这种挫败感？', locs: ['changan'] },
    { day: 2, title: '临潼、蒲城', theme: '奉先探家', places: '华清宫、骊山、蒲城杜甫纪念馆', stay: '1天', transportTip: '临潼和蒲城均在西安以东，可乘地铁至临潼，再转车至蒲城；建议自驾或包车', poems: '《自京赴奉先县咏怀五百字》', tip: '华清宫、骊山、蒲城杜甫纪念馆；体验宫廷奢华与民间疾苦的强烈对照', liveQuestion: '华清宫的奢华与杜甫家人的贫困之间是什么关系？这种对照如何进入他的诗？', locs: ['lianling', 'fengxian'] },
    { day: 3, title: '白水、彭衙', theme: '携家逃亡', places: '白水彭衙古道遗址', stay: '半天至1天', transportTip: '白水彭衙故道需自驾或包车；建议从西安驱车前往，沿途感受山区地形', poems: '《彭衙行》', tip: '白水彭衙故道，需自驾或包车；杜甫诗句“痴女饥咬我，啼畏虎狼闻”在此地有现场感', liveQuestion: '彭衙行中的“痴女”是杜甫的女儿，这首诗如何把个人家庭悲剧写进历史叙事？', locs: ['baishui', 'pengxia'] },
    { day: 4, title: '富县羌村', theme: '劫后团聚', places: '富县羌村杜甫故居、羌村古镇', stay: '1天', transportTip: '富县距西安约3小时车程，建议自驾或包车；羌村在富县郊外，需当地交通', poems: '《羌村三首》《北征》', tip: '富县羌村杜甫故居、羌村古镇；羌村三首在此地写成，有实地参照', liveQuestion: '“妻孥怪我在，惊定还拭泪”——杜甫回家时家人的反应为什么让他如此动容？', locs: ['fuxian', 'qiangcun'] },
    { day: 5, title: '凤翔', theme: '短暂入朝', places: '凤翔东湖、唐遗址公园', stay: '1天', transportTip: '凤翔距西安高铁约1.5小时；东湖和唐遗址公园均在凤翔城区内', poems: '《喜达行在所三首》《述怀》', tip: '凤翔东湖、唐遗址公园；这是杜甫唯一一次进入朝廷核心的经历', liveQuestion: '杜甫的左拾遗当得很短，他的直谏和他看到的朝廷政治是什么关系？', locs: ['fengxiang'] },
    { day: 6, title: '洛阳、新安、石壕、潼关', theme: '三吏三别', places: '石壕村杜甫纪念馆、三门峡周边遗址', stay: '2-3天', transportTip: '这一段建议自驾或包车；四县距离较远，高铁可至洛阳和新安，潼关有高铁站', poems: '《新安吏》《石壕吏》《潼关吏》《新婚别》《垂老别》《无家别》', tip: '石壕村有杜甫纪念馆；三门峡周边保存有古道和遗址；建议结合诗阅读现场', liveQuestion: '三吏三别中普通人的名字叫什么？为什么这些人能被写进历史？', locs: ['luoyang', 'xinan', 'shihao', 'tongguan'] },
    { day: 7, title: '华州、天水', theme: '离开庙堂', places: '华州城区、天水市区', stay: '1天', transportTip: '华州高铁可达西安；建议华州短暂停留后，乘高铁或自驾前往天水', poems: '《发华州》', tip: '华州高铁可达西安，转乘至天水；这是杜甫离开体制的节点', liveQuestion: '杜甫从华州离开意味着什么？他的“庙堂理想”是彻底破灭还是转化了？', locs: ['huazhou', 'qinzhou'] },
    { day: 8, title: '天水秦州', theme: '秦州杂诗', places: '天水古城、麦积山石窟、南郭寺', stay: '1-2天', transportTip: '适合以天水市区为基地，市内打车或公共交通结合步行；若延伸东柯谷、西枝村，建议单独安排半日或包车', poems: '《秦州杂诗二十首》《月夜忆舍弟》《梦李白二首》', tip: '天水古城、麦积山石窟、南郭寺；秦州是杜甫创作密度最高的地方之一', liveQuestion: '杜甫在秦州写得这么密集，三个月写了二十多首，他当时的处境是什么状态？', locs: ['qinzhou'] },
    { day: 9, title: '东柯谷、西枝村', theme: '寻置草堂', places: '东柯谷、西枝村遗址', stay: '半天', transportTip: '东柯谷距天水约30公里，需包车；西枝村需当地向导协助确认位置，建议与南郭寺安排在同一天', poems: '《西枝村寻置草堂地》', tip: '南郭寺为成熟景区；东柯谷和西枝村属于文学寻访点；草堂梦第一次具体化但最终未能实现', liveQuestion: '杜甫的草堂梦是从什么时候开始清晰的？赞公为什么重要？这次失败意味着什么？', locs: ['dongke', 'guozhi'] },
    { day: 10, title: '成县同谷', theme: '同谷困顿', places: '成县杜甫草堂遗址纪念馆、万丈潭', stay: '1天', transportTip: '天水至成县建议自驾，车程约3-4小时；也可乘火车至陇南站后转车', poems: '《乾元中寓居同谷县作歌七首》《万丈潭》《凤凰台》', tip: '成县杜甫草堂遗址纪念馆；万丈潭需包车前往郊外；杜甫在此地贫病交迫，是一生最低点', liveQuestion: '杜甫以为同谷可以安居，为什么反而比秦州更困顿？他的身体状态是什么样子？', locs: ['tonggu'] },
    { day: 11, title: '广元、剑门', theme: '入蜀古道', places: '明月峡景区、昭化古城、剑门关', stay: '1-2天', transportTip: '成县至广元建议自驾，沿途可感受嘉陵江上游地形；广元至剑门关自驾约1.5小时', poems: '《木皮岭》《白沙渡》《水会渡》《剑门》', tip: '明月峡、昭化古城、剑门关景区；建议分两天安排，先广元段，再剑门关', liveQuestion: '杜甫的山水诗从什么时候开始不再是“观赏风景”，而是“逃难道路”？剑门关的“政治地理”是什么意思？', locs: ['guangyuan', 'jianmenguan'] },
    { day: 12, title: '成都', theme: '成都草堂', places: '杜甫草堂博物馆、武侯祠、锦里古街', stay: '2-3天', transportTip: '成都公共交通便利；杜甫草堂博物馆位于西郊，可乘地铁+步行到达；武侯祠和锦里古街可作为晚间活动', poems: '《成都府》《堂成》《春夜喜雨》《茅屋为秋风所破歌》', tip: '杜甫草堂博物馆是必访之地，建议深度参观；武侯祠和锦里古街可作为晚间活动', liveQuestion: '杜甫在草堂终于安定了，为什么还在写“安得广厦千万间”？他的终极关怀是什么？', locs: ['chengdu'] }
  ],
  'thematic': [
    {
      id: 'changan',
      title: '长安奉先线',
      days: '2-3天',
      tags: ['历史溯源'],
      desc: '从长安困守到奉先探家，看杜甫如何从求官士人走向现实主义诗人。',
      route: ['西安', '临潼', '蒲城'],
      poems: '《奉赠韦左丞丈》《兵车行》《自京赴奉先县咏怀五百字》',
      tip: '大明宫遗址、华清宫、蒲城杜甫纪念馆',
      locs: ['changan', 'lianling', 'fengxian']
    },
    {
      id: 'anshi',
      title: '安史逃亡线',
      days: '3-4天',
      tags: ['流离见证'],
      desc: '杜甫从安史乱军中的逃亡路线，从白水到羌村，见证士人变流民。',
      route: ['蒲城', '白水', '富县羌村'],
      poems: '《彭衙行》《羌村三首》《北征》',
      tip: '白水彭衙古道、富县羌村杜甫故居',
      locs: ['fengxian', 'baishui', 'qiangcun']
    },
    {
      id: 'sanli',
      title: '三吏三别线',
      days: '3-4天',
      tags: ['诗史成型'],
      desc: '从洛阳到华州，三吏三别创作路线，普通人第一次成为历史主角。',
      route: ['洛阳', '新安', '石壕', '潼关', '华州'],
      poems: '《新安吏》《石壕吏》《潼关吏》《新婚别》《垂老别》《无家别》',
      tip: '石壕村杜甫纪念馆、三门峡周边遗址',
      locs: ['luoyang', 'xinan', 'shihao', 'tongguan', 'huazhou']
    },
    {
      id: 'qinzhou',
      title: '秦州入蜀线',
      days: '5-7天',
      tags: ['草堂之路'],
      desc: '从秦州流寓到成都草堂，杜甫诗歌最密集创作期，也是草堂梦实现之路。',
      route: ['天水', '成县', '广元', '剑门关', '成都'],
      poems: '《秦州杂诗》《同谷七歌》《剑门》《成都府》',
      tip: '天水古城、剑门关景区、杜甫草堂博物馆',
      locs: ['qinzhou', 'tonggu', 'guangyuan', 'jianmenguan', 'chengdu']
    }
  ]
};

// ==================== ROUTE METADATA ====================
const ROUTE_META = {
  '7day': {
    routeName: '7天精华线：从秦州到成都',
    days: '7天',
    season: '春秋优先；冬季有历史氛围但山路与天气需谨慎',
    transport: '高铁/飞机抵达天水或兰州中转；天水—成县—广元—剑门段建议包车或自驾；成都段公共交通便利',
    difficulty: '中等',
    nature: '文学现场+山水古道+草堂转折',
    crowd: '第一次深度体验杜甫诗路的人、唐诗爱好者、山水古道旅行者',
    note: '这条线强调地理连续性和文学现场感，部分地点属于寻访点，实际交通与开放状态需提前核实'
  },
  '12day': {
    routeName: '12天完整线：从长安到成都',
    days: '12天',
    season: '春秋最佳；夏季注意关中和豫西高温；冬季注意陇南和蜀道山区天气',
    transport: '高铁串联西安、洛阳、三门峡、天水、广元、成都；彭衙、羌村、东柯谷、同谷等点位建议包车或自驾',
    difficulty: '较高',
    nature: '历史路线复原+诗歌阅读+多省转场',
    crowd: '希望完整理解文章结构的人、安史之乱研究兴趣者、重度文化旅行者',
    note: '此线跨度大，适合分两次完成；不建议把所有地点压缩成走马观花式打卡'
  },
  'thematic-changan': {
    routeName: '长安奉先线',
    days: '2-3天',
    season: '全年可拆分执行；户外寻访点春秋更佳',
    transport: '以高铁城市节点+当地包车/打车为主',
    difficulty: '低到中等',
    nature: '主题阅读+短途文化旅行',
    crowd: '周末旅行者、城市文化游用户、想按主题分段理解杜甫的人',
    note: '短线适合先建立理解框架，之后再补完整线'
  },
  'thematic-anshi': {
    routeName: '安史逃亡线',
    days: '3-4天',
    season: '全年可拆分执行；户外寻访点春秋更佳',
    transport: '以高铁城市节点+当地包车/打车为主',
    difficulty: '低到中等',
    nature: '主题阅读+短途文化旅行',
    crowd: '周末旅行者、城市文化游用户、想按主题分段理解杜甫的人',
    note: '短线适合先建立理解框架，之后再补完整线'
  },
  'thematic-sanli': {
    routeName: '三吏三别线',
    days: '3-4天',
    season: '全年可拆分执行；户外寻访点春秋更佳',
    transport: '以高铁城市节点+当地包车/打车为主',
    difficulty: '低到中等',
    nature: '主题阅读+短途文化旅行',
    crowd: '周末旅行者、城市文化游用户、想按主题分段理解杜甫的人',
    note: '短线适合先建立理解框架，之后再补完整线'
  },
  'thematic-qinzhou': {
    routeName: '秦州入蜀线',
    days: '5-7天',
    season: '全年可拆分执行；户外寻访点春秋更佳',
    transport: '以高铁城市节点+当地包车/打车为主',
    difficulty: '低到中等',
    nature: '主题阅读+短途文化旅行',
    crowd: '周末旅行者、城市文化游用户、想按主题分段理解杜甫的人',
    note: '短线适合先建立理解框架，之后再补完整线'
  },
  'dual-city': {
    routeName: '西安+成都双城读诗线',
    days: '4-6天',
    season: '全年可行，春秋体验更佳',
    transport: '城市公共交通+高铁/飞机连接西安与成都',
    difficulty: '低',
    nature: '城市读诗+杜甫前后人生对照',
    crowd: '只想轻旅行、不想长途转场的人；第一次接触杜甫的人',
    note: '这不是文章中的完整历史路线，而是便于入门的轻量版本'
  }
};

// ==================== POEM-LOCATION MAPPING ====================
const POEM_MAP = [
  { poem: '《自京赴奉先县咏怀五百字》', loc: 'fengxian' },
  { poem: '《彭衙行》', loc: 'baishui' },
  { poem: '《羌村三首》', loc: 'qiangcun' },
  { poem: '《春望》', loc: 'lingwu' },
  { poem: '《月夜》', loc: 'lingwu' },
  { poem: '《石壕吏》', loc: 'shihao' },
  { poem: '《秦州杂诗二十首》', loc: 'qinzhou' },
  { poem: '《月夜忆舍弟》', loc: 'qinzhou' },
  { poem: '《乾元中寓居同谷县作歌七首》', loc: 'tonggu' },
  { poem: '《剑门》', loc: 'jianmenguan' },
  { poem: '《成都府》', loc: 'chengdu' },
  { poem: '《茅屋为秋风所破歌》', loc: 'chengdu' }
];

// ==================== MAP POSITIONS (SVG coordinates) ====================
const MAP_NODES = [
  { id: 'changan',   x: 680, y: 260, label: '长安/西安' },
  { id: 'lianling',  x: 660, y: 245, label: '骊山/临潼' },
  { id: 'fengxian',  x: 640, y: 220, label: '奉先/蒲城' },
  { id: 'baishui',   x: 610, y: 195, label: '白水' },
  { id: 'pengxia',   x: 600, y: 185, label: '彭衙' },
  { id: 'qiangcun',  x: 570, y: 165, label: '鄜州羌村' },
  { id: 'lingwu',    x: 695, y: 268, label: '沦陷长安' },
  { id: 'fengxiang', x: 555, y: 275, label: '凤翔' },
  { id: 'luoyang',   x: 780, y: 305, label: '洛阳' },
  { id: 'xinan',     x: 765, y: 295, label: '新安' },
  { id: 'shihao',    x: 745, y: 278, label: '石壕' },
  { id: 'tongguan',  x: 725, y: 258, label: '潼关' },
  { id: 'huazhou',   x: 705, y: 238, label: '华州' },
  { id: 'qinzhou',   x: 490, y: 205, label: '秦州/天水' },
  { id: 'dongke',    x: 478, y: 215, label: '东柯谷' },
  { id: 'guozhi',    x: 468, y: 222, label: '西枝村' },
  { id: 'tonggu',    x: 370, y: 245, label: '同谷/成县' },
  { id: 'guangyuan', x: 265, y: 305, label: '广元/明月峡' },
  { id: 'jianmenguan', x: 195, y: 295, label: '剑门关' },
  { id: 'chengdu',   x: 130, y: 330, label: '成都草堂' }
];

// Route lines connecting nodes in order
const ROUTE_LINES = [
  ['changan', 'lianling'],
  ['lianling', 'fengxian'],
  ['fengxian', 'baishui'],
  ['baishui', 'qiangcun'],
  ['changan', 'lingwu'],
  ['lingwu', 'fengxiang'],
  ['fengxiang', 'qiangcun'],
  ['changan', 'luoyang'],
  ['luoyang', 'xinan'],
  ['xinan', 'shihao'],
  ['shihao', 'tongguan'],
  ['tongguan', 'huazhou'],
  ['huazhou', 'qinzhou'],
  ['qinzhou', 'dongke'],
  ['dongke', 'guozhi'],
  ['qinzhou', 'tonggu'],
  ['tonggu', 'guangyuan'],
  ['guangyuan', 'jianmenguan'],
  ['jianmenguan', 'chengdu']
];

// ==================== APP INIT ====================
document.addEventListener('DOMContentLoaded', function() {
  initTabs();
  initTimeline();
  initMap();
  initRoutes();
  initPoemGrid();
  initCopyFallback();
});

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==================== TABS ====================
function initTabs() {
  // Article tabs
  document.querySelectorAll('#article .tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var tab = this.dataset.tab;
      document.querySelectorAll('#article .tab-btn').forEach(function(b) { b.classList.remove('active'); });
      document.querySelectorAll('#article .tab-content').forEach(function(c) { c.classList.remove('active'); });
      this.classList.add('active');
      document.getElementById('tab-' + tab).classList.add('active');
    });
  });

  // Route tabs
  document.querySelectorAll('.route-tabs .tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var rt = this.dataset.rt;
      document.querySelectorAll('.route-tabs .tab-btn').forEach(function(b) { b.classList.remove('active'); });
      document.querySelectorAll('.route-panel').forEach(function(p) { p.classList.remove('active'); });
      this.classList.add('active');
      document.getElementById('rt-' + rt).classList.add('active');
    });
  });
}

// ==================== TIMELINE ====================
function initTimeline() {
  var root = document.getElementById('timeline-root');
  if (!root) return;
  var html = '';
  TIMELINE.forEach(function(item) {
    html += '<div class="tl-item">';
    html += '<div class="tl-year">' + item.year + '</div>';
    html += '<div class="tl-title">' + item.title + '</div>';
    html += '<div class="tl-locations">📍 ' + item.locations + '</div>';
    html += '<div class="tl-event">' + item.event + '</div>';
    if (item.poems) {
      html += '<div class="tl-poems">' + item.poems + '</div>';
    }
    if (item.why) {
      html += '<div class="tl-why">' + item.why + '</div>';
    }
    html += '</div>';
  });
  root.innerHTML = html;
}

// ==================== MAP ====================
var activeLocationId = null;

function initMap() {
  drawMapNodes();
  drawMapRoutes();
  attachMapEvents();
}

function drawMapNodes() {
  var ns = document.getElementById('map-nodes');
  if (!ns) return;
  var html = '';
  MAP_NODES.forEach(function(node) {
    html += '<g class="map-node" data-id="' + node.id + '" transform="translate(' + node.x + ',' + node.y + ')">';
    html += '<circle class="node-circle" r="6" fill="#8b7355" stroke="#1a1814" stroke-width="2"/>';
    html += '<text class="node-label" x="10" y="4">' + node.label + '</text>';
    html += '</g>';
  });
  ns.innerHTML = html;
}

function drawMapRoutes() {
  var rg = document.getElementById('map-routes');
  if (!rg) return;
  var posMap = {};
  MAP_NODES.forEach(function(n) { posMap[n.id] = n; });
  var html = '';
  ROUTE_LINES.forEach(function(pair) {
    var a = posMap[pair[0]];
    var b = posMap[pair[1]];
    if (a && b) {
      html += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '"/>';
    }
  });
  rg.innerHTML = html;
}

function attachMapEvents() {
  document.querySelectorAll('.map-node').forEach(function(g) {
    g.addEventListener('click', function() {
      var id = this.dataset.id;
      setActiveLocation(id);
    });
    g.addEventListener('mouseenter', function() {
      var id = this.dataset.id;
      var ring = document.getElementById('map-active-ring');
      var node = MAP_NODES.find(function(n) { return n.id === id; });
      if (ring && node) {
        ring.setAttribute('cx', node.x);
        ring.setAttribute('cy', node.y);
        ring.setAttribute('opacity', '1');
      }
    });
    g.addEventListener('mouseleave', function() {
      var ring = document.getElementById('map-active-ring');
      if (ring) ring.setAttribute('opacity', '0');
    });
  });
}

function setActiveLocation(id) {
  // Remove previous
  document.querySelectorAll('.map-node').forEach(function(g) { g.classList.remove('active'); });
  var nodeEl = document.querySelector('.map-node[data-id="' + id + '"]');
  if (nodeEl) nodeEl.classList.add('active');

  var loc = LOCATIONS.find(function(l) { return l.id === id; });
  var card = document.getElementById('map-detail-card');
  if (!card || !loc) return;

  var quoteHtml = loc.quote
    ? '<div class="detail-quote">“' + loc.quote.replace(/"/g, '') + '”</div>'
    : '';

  var siteTypeHtml = loc.siteType
    ? '<div class="detail-site-type">📍 地点类型：' + loc.siteType + '</div>'
    : '';

  card.innerHTML =
    '<h3>' + loc.name + '</h3>' +
    '<div class="detail-mod">今日地点：' + loc.modern + '</div>' +
    '<div class="detail-theme">' + loc.theme + '</div>' +
    siteTypeHtml +
    '<p>' + loc.event + '</p>' +
    (loc.poems ? '<div class="detail-poems">📜 ' + loc.poems + '</div>' : '') +
    quoteHtml +
    '<div class="detail-meaning">' + loc.articleMeaning + '</div>' +
    '<div class="detail-tip">🗺 ' + loc.travelTip + '</div>';

  activeLocationId = id;
}

// ==================== ROUTES ====================
function initRoutes() {
  renderRouteDays('7day', document.getElementById('days-7day'));
  renderRouteDays('12day', document.getElementById('days-12day'));
  renderThematicGrid();
  renderRouteMetaHeaders();

  // Selector "查看路线" buttons — scroll to route planner and activate tab
  document.querySelectorAll('.selector-btn[data-rt]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var rt = this.dataset.rt;
      // Scroll to route planner
      var rp = document.getElementById('routes');
      if (rp) rp.scrollIntoView({ behavior: 'smooth' });
      // Activate tab
      document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
      document.querySelectorAll('.route-panel').forEach(function(p) { p.classList.remove('active'); });
      var tabBtn = document.querySelector('.tab-btn[data-rt="' + rt + '"]');
      var panel = document.getElementById('rt-' + rt);
      if (tabBtn) tabBtn.classList.add('active');
      if (panel) panel.classList.add('active');
      // dual-city: show info panel instead of tabs
      if (rt === 'dual-city') {
        var dc = document.getElementById('dual-city-info');
        if (dc) dc.style.display = 'block';
      }
    });
  });

  // Route copy buttons
  document.querySelectorAll('.copy-btn[data-route]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var route = this.dataset.route;
      var day = this.dataset.day;
      var text = day ? buildRouteText(route, day) : buildFullRouteText(route);
      copyText(text, this);
    });
  });

  document.querySelectorAll('.copy-route-full').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var route = this.dataset.route;
      var text = buildFullRouteText(route);
      copyText(text, this);
    });
  });
}

function renderRouteMetaHeaders() {
  ['7day', '12day'].forEach(function(key) {
    var container = document.getElementById('days-' + key);
    var meta = ROUTE_META[key];
    if (!container || !meta) return;
    var header = document.createElement('div');
    header.className = 'route-meta-header';
    header.innerHTML =
      '<div class="route-meta-row">' +
        '<span class="rmeta-item">⏱ ' + meta.days + '</span>' +
        '<span class="rmeta-item">👥 ' + meta.crowd + '</span>' +
        '<span class="rmeta-item">🌤 ' + meta.season + '</span>' +
      '</div>' +
      '<div class="route-meta-row">' +
        '<span class="rmeta-item">🚗 ' + meta.transport + '</span>' +
      '</div>' +
      '<div class="route-meta-row">' +
        '<span class="rmeta-item">📍 难度：' + meta.difficulty + ' · ' + meta.nature + '</span>' +
      '</div>' +
      '<div class="route-meta-note">⚠ ' + meta.note + ' · 出发前请核实开放时间、交通、住宿、景区政策与道路情况。</div>';
    container.insertBefore(header, container.firstChild);
  });
}

function renderRouteDays(routeKey, container) {
  if (!container) return;
  var days = ROUTES[routeKey];
  if (!days) return;
  var meta = ROUTE_META[routeKey] || {};
  var html = '';
  days.forEach(function(d) {
    var todayTheme = d.theme || '';
    var todayPlaces = d.places || (d.locs ? d.locs.map(function(lid) {
      var l = LOCATIONS.find(function(x) { return x.id === lid; });
      return l ? l.name : lid;
    }).join('、') : '');
    var stay = d.stay || '1天';
    var transportTip = d.transportTip || '';
    var liveQuestion = d.liveQuestion || '';

    html += '<div class="day-card" data-locations="' + d.locs.join(',') + '">';
    html += '<div class="day-header">';
    html += '<span class="day-n">Day ' + d.day + '</span>';
    html += '<span class="day-stay">🏨 推荐停留：' + stay + '</span>';
    html += '</div>';
    html += '<h4>' + d.title + '</h4>';
    if (todayTheme) html += '<div class="day-theme">📌 今日主题：' + todayTheme + '</div>';
    if (todayPlaces) html += '<div class="day-places">📍 今日地点：' + todayPlaces + '</div>';
    html += '<p>' + d.desc + '</p>';
    if (transportTip) html += '<div class="day-transport">🚗 ' + transportTip + '</div>';
    html += '<div class="day-poems">📜 ' + d.poems + '</div>';
    html += '<div class="day-tip">🗺 ' + d.tip + '</div>';
    if (liveQuestion) html += '<div class="day-question">❓ ' + liveQuestion + '</div>';
    html += '<button class="copy-btn" data-route="' + routeKey + '" data-day="' + d.day + '">复制行程</button>';
    html += '</div>';
  });
  container.innerHTML = html;
}

function renderThematicGrid() {
  var container = document.getElementById('thematic-grid');
  if (!container) return;
  var html = '';
  ROUTES.thematic.forEach(function(t) {
    var meta = ROUTE_META[t.id] || {};
    var days = meta.days || t.days;
    var difficulty = meta.difficulty || '';
    var season = meta.season || '';
    var nature = meta.nature || '';
    var note = meta.note || '';

    html += '<div class="thematic-card" data-locations="' + t.locs.join(',') + '">';
    html += '<h3>' + t.title + '</h3>';
    html += '<div class="route-meta-tags"><span class="rtag">' + days + '</span>';
    t.tags.forEach(function(tag) {
      html += '<span class="rtag">' + tag + '</span>';
    });
    if (difficulty) html += '<span class="rtag">难度：' + difficulty + '</span>';
    if (nature) html += '<span class="rtag">' + nature + '</span>';
    html += '</div>';
    if (season) html += '<div class="thematic-season">🌤 ' + season + '</div>';
    html += '<p class="route-desc">' + t.desc + '</p>';
    html += '<div class="thematic-route">';
    t.route.forEach(function(loc, i) {
      html += '<span class="tr-loc">' + loc + '</span>';
      if (i < t.route.length - 1) html += ' → ';
    });
    html += '</div>';
    if (note) html += '<div class="thematic-note">⚠ ' + note + '</div>';
    html += '<div class="day-poems">📜 ' + t.poems + '</div>';
    html += '<div class="day-tip">🗺 ' + t.tip + '</div>';
    html += '<button class="copy-btn" data-route="' + t.id + '">复制这条路线</button>';
    html += '</div>';
  });
  container.innerHTML = html;
}

function buildRouteText(routeKey, day) {
  var days = ROUTES[routeKey];
  if (!days) return '';
  var d = days.find(function(x) { return x.day === parseInt(day); });
  if (!d) return '';
  var theme = d.theme ? '📌 今日主题：' + d.theme + '\n' : '';
  var places = d.places ? '📍 今日地点：' + d.places + '\n' : '';
  var stay = d.stay ? '🏨 推荐停留：' + d.stay + '\n' : '';
  var transport = d.transportTip ? '🚗 ' + d.transportTip + '\n' : '';
  var question = d.liveQuestion ? '❓ ' + d.liveQuestion + '\n' : '';
  return '杜甫诗路 · Day ' + d.day + '：' + d.title + '\n' +
    theme + places + stay + transport +
    '\n📜 推荐阅读：' + d.poems + '\n' +
    '🗺 旅行建议：' + d.tip + '\n' +
    (question ? '\n' + question : '');
}

function buildFullRouteText(routeKey) {
  if (routeKey === 'thematic-changan') {
    var t = ROUTES.thematic.find(function(x) { return x.id === 'changan'; });
    return '杜甫诗路 · ' + t.title + '（' + t.days + '）\n' +
      t.desc + '\n路线：' + t.route.join(' → ') + '\n' +
      '📜 推荐阅读：' + t.poems + '\n🗺 旅行建议：' + t.tip;
  }
  if (routeKey === 'thematic-anshi') {
    var t = ROUTES.thematic.find(function(x) { return x.id === 'anshi'; });
    return '杜甫诗路 · ' + t.title + '（' + t.days + '）\n' +
      t.desc + '\n路线：' + t.route.join(' → ') + '\n' +
      '📜 推荐阅读：' + t.poems + '\n🗺 旅行建议：' + t.tip;
  }
  if (routeKey === 'thematic-sanli') {
    var t = ROUTES.thematic.find(function(x) { return x.id === 'sanli'; });
    return '杜甫诗路 · ' + t.title + '（' + t.days + '）\n' +
      t.desc + '\n路线：' + t.route.join(' → ') + '\n' +
      '📜 推荐阅读：' + t.poems + '\n🗺 旅行建议：' + t.tip;
  }
  if (routeKey === 'thematic-qinzhou') {
    var t = ROUTES.thematic.find(function(x) { return x.id === 'qinzhou'; });
    return '杜甫诗路 · ' + t.title + '（' + t.days + '）\n' +
      t.desc + '\n路线：' + t.route.join(' → ') + '\n' +
      '📜 推荐阅读：' + t.poems + '\n🗺 旅行建议：' + t.tip;
  }
  if (routeKey === 'dual-city') {
    var meta = ROUTE_META['dual-city'];
    return '杜甫诗路 · ' + meta.routeName + '\n' +
      '这不是文章中的完整历史路线，而是便于入门的轻量版本。\n' +
      '适合人群：' + meta.crowd + '\n' +
      '推荐季节：' + meta.season + '\n' +
      '交通方式：' + meta.transport + '\n' +
      '西安看点：大雁塔、大明宫遗址公园、回坊、曲江、少陵、杜陵\n' +
      '成都看点：杜甫草堂博物馆、浣花溪公园、武侯祠、锦里古街\n' +
      '⚠ 出发前请核实开放时间、交通、住宿、景区政策与道路情况。';
  }
  var days = ROUTES[routeKey];
  if (!days) return '';
  var title = ROUTE_META[routeKey] ? ROUTE_META[routeKey].routeName : (routeKey === '7day' ? '7天精华线：从秦州到成都' : '12天完整线：从长安到成都');
  var text = '杜甫诗路 · ' + title + '\n\n';
  days.forEach(function(d) {
    var theme = d.theme ? '📌 今日主题：' + d.theme + '\n' : '';
    var places = d.places ? '📍 今日地点：' + d.places + '\n' : '';
    var stay = d.stay ? '🏨 推荐停留：' + d.stay + '\n' : '';
    var transport = d.transportTip ? '🚗 ' + d.transportTip + '\n' : '';
    var question = d.liveQuestion ? '❓ ' + d.liveQuestion + '\n' : '';
    text += '━━━ Day ' + d.day + ' · ' + d.title + ' ━━━\n';
    text += theme + places + stay + transport;
    text += '\n📜 推荐阅读：' + d.poems + '\n';
    text += '🗺 旅行建议：' + d.tip + '\n';
    if (question) text += question;
    text += '\n';
  });
  return text;
}

// ==================== POEM GRID ====================
function initPoemGrid() {
  var grid = document.getElementById('poem-grid');
  if (!grid) return;
  var html = '';
  POEM_MAP.forEach(function(item) {
    var loc = LOCATIONS.find(function(l) { return l.id === item.loc; });
    var locName = loc ? loc.name + '（' + loc.modern + '）' : item.loc;
    html += '<div class="poem-item" data-loc="' + item.loc + '">';
    html += '<div class="poem-name">' + item.poem + '</div>';
    html += '<div class="poem-loc">📍 ' + locName + '</div>';
    html += '</div>';
  });
  grid.innerHTML = html;

  grid.querySelectorAll('.poem-item').forEach(function(el) {
    el.addEventListener('click', function() {
      var locId = this.dataset.loc;
      var wasActive = this.classList.contains('active');
      grid.querySelectorAll('.poem-item').forEach(function(p) { p.classList.remove('active'); });
      if (!wasActive) {
        this.classList.add('active');
        setActiveLocation(locId);
        highlightDayCards(locId);
        // Scroll to map
        document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        clearDayHighlights();
      }
    });
  });
}

function highlightDayCards(locId) {
  document.querySelectorAll('.day-card').forEach(function(card) {
    var locs = card.dataset.locations ? card.dataset.locations.split(',') : [];
    if (locs.indexOf(locId) !== -1) {
      card.classList.add('highlighted');
    } else {
      card.classList.remove('highlighted');
    }
  });
}

function clearDayHighlights() {
  document.querySelectorAll('.day-card').forEach(function(card) {
    card.classList.remove('highlighted');
  });
}

// ==================== COPY FALLBACK ====================
function copyText(text, btn) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      showCopySuccess(btn);
    }).catch(function() {
      fallbackCopy(text, btn);
    });
  } else {
    fallbackCopy(text, btn);
  }
}

function fallbackCopy(text, btn) {
  var fb = document.getElementById('copy-fallback');
  var ta = document.getElementById('copy-textarea');
  if (fb && ta) {
    ta.value = text;
    fb.style.display = 'block';
    ta.select();
    showCopySuccess(btn);
  }
}

function showCopySuccess(btn) {
  if (!btn) return;
  var original = btn.textContent;
  btn.textContent = '已复制 ✓';
  btn.classList.add('copied');
  setTimeout(function() {
    btn.textContent = original;
    btn.classList.remove('copied');
  }, 2000);
}

function initCopyFallback() {
  // Nothing needed here — handled in copyText
}
