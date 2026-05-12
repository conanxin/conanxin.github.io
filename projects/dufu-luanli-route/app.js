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
    routeGroup: 'changan'
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
    routeGroup: 'fengxian'
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
    routeGroup: 'fengxian'
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
    routeGroup: 'anshi'
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
    routeGroup: 'anshi'
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
    routeGroup: 'qiangcun'
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
    routeGroup: 'qiangcun'
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
    routeGroup: 'changan'
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
    routeGroup: 'fengxiang'
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
    routeGroup: 'sanli'
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
    routeGroup: 'sanli'
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
    routeGroup: 'sanli'
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
    routeGroup: 'sanli'
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
    routeGroup: 'sanli'
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
    routeGroup: 'qinzhou'
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
    routeGroup: 'qinzhou'
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
    routeGroup: 'qinzhou'
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
    routeGroup: 'tonggu'
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
    routeGroup: 'longshu'
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
    routeGroup: 'longshu'
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
    routeGroup: 'chengdu'
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
    { day: 1, title: '天水秦州', desc: '流寓秦州，诗歌爆发。杜甫在秦州约三个月，创作《秦州杂诗二十首》《月夜忆舍弟》《梦李白二首》。', poems: '《秦州杂诗》《月夜忆舍弟》', tip: '天水古城、麦积山石窟、南郭寺均可访古', locs: ['qinzhou'] },
    { day: 2, title: '南郭寺、东柯谷', desc: '赞公和尚带杜甫寻找草堂地。杜甫第一次明确产生“草堂”构想。同谷时期的前奏。', poems: '《西枝村寻置草堂地》', tip: '东柯谷距天水市区约30公里，需包车前往', locs: ['dongke', 'guozhi'] },
    { day: 3, title: '成县同谷', desc: '杜甫以为可安居，实际更加贫病困顿。写下《乾元中寓居同谷县作歌七首》《万丈潭》《凤凰台》。', poems: '《同谷七歌》《万丈潭》', tip: '成县有杜甫草堂遗址纪念馆，万丈潭在郊外', locs: ['tonggu'] },
    { day: 4, title: '成县 → 广元', desc: '陇蜀道与嘉陵江。杜甫携家离开同谷，沿嘉陵江上游入蜀。连续纪行诗开始。', poems: '《发同谷县》《木皮岭》', tip: '建议自驾，途经陇蜀古道遗迹', locs: ['tonggu', 'guangyuan'] },
    { day: 5, title: '明月峡、昭化古城', desc: '古道与交通遗存。明月峡是嘉陵江重要航道，昭化古城保留有蜀道驿站格局。', poems: '《水会渡》《五盘》', tip: '明月峡景区、昭化古城均可参观', locs: ['guangyuan'] },
    { day: 6, title: '剑门关', desc: '天险与政治地理。剑门关是蜀道最险要处，杜甫过此时写下“惟天有设险，剑门天下壮”。', poems: '《剑门》', tip: '剑门关景区，需爬山，建议穿舒适鞋子', locs: ['jianmenguan'] },
    { day: 7, title: '成都草堂', desc: '草堂终于成为现实。杜甫在成都西郊营建草堂，后写《春夜喜雨》《茅屋为秋风所破歌》。', poems: '《成都府》《春夜喜雨》《茅屋为秋风所破歌》', tip: '杜甫草堂博物馆是必访之地，建议深度参观', locs: ['chengdu'] }
  ],
  '12day': [
    { day: 1, title: '西安（长安）', desc: '长安困守。杜甫在长安求官十年，见证盛唐繁华背后的裂缝。相关诗歌：《奉赠韦左丞丈二十二韵》《兵车行》《丽人行》。', poems: '《奉赠韦左丞丈》《兵车行》《丽人行》', tip: '大雁塔、大明宫遗址公园、回坊', locs: ['changan'] },
    { day: 2, title: '临潼、蒲城', desc: '奉先探家。杜甫赴奉先途中过华清宫、骊山，写下《自京赴奉先县咏怀五百字》，“朱门酒肉臭，路有冻死骨”。', poems: '《自京赴奉先县咏怀五百字》', tip: '华清宫、骊山、蒲城杜甫纪念馆', locs: ['lianling', 'fengxian'] },
    { day: 3, title: '白水、彭衙', desc: '携家逃亡。安史之乱爆发后，杜甫携家从白水逃往鄜州，孩子饥饿，山路艰险。', poems: '《彭衙行》', tip: '白水彭衙故道，需自驾或包车', locs: ['baishui', 'pengxia'] },
    { day: 4, title: '富县羌村', desc: '劫后团聚。杜甫家人避难地，羌村三首记录劫后重逢场景。“妻孥怪我在，惊定还拭泪”。', poems: '《羌村三首》《北征》', tip: '富县羌村杜甫故居、羌村古镇', locs: ['fuxian', 'qiangcun'] },
    { day: 5, title: '凤翔', desc: '短暂入朝。杜甫逃出长安投奔肃宗，被授左拾遗，进入朝廷中心。后因直谏被贬。', poems: '《喜达行在所三首》《述怀》', tip: '凤翔东湖、唐遗址公园', locs: ['fengxiang'] },
    { day: 6, title: '洛阳、新安、石壕、潼关', desc: '三吏三别。杜甫途中见征兵、抓丁、家庭离散，普通人第一次成为诗歌主角。', poems: '《新安吏》《石壕吏》《潼关吏》《新婚别》《垂老别》《无家别》', tip: '石壕村有杜甫纪念馆，三门峡周边遗迹', locs: ['luoyang', 'xinan', 'shihao', 'tongguan'] },
    { day: 7, title: '华州、天水', desc: '离开庙堂。杜甫任华州司功参军，政治理想受挫，离开华州西行流寓秦州。', poems: '《发华州》', tip: '华州高铁可达西安，转乘至天水', locs: ['huazhou', 'qinzhou'] },
    { day: 8, title: '天水秦州', desc: '秦州杂诗。杜甫在秦州约三个月，创作密度最高时期之一，怀友、忧国、贫病交织。', poems: '《秦州杂诗二十首》《月夜忆舍弟》《梦李白二首》', tip: '天水古城、麦积山石窟、南郭寺', locs: ['qinzhou'] },
    { day: 9, title: '东柯谷、西枝村', desc: '寻置草堂。赞公和尚带杜甫寻找草堂地，草堂梦第一次具体化但最终未能实现。', poems: '《西枝村寻置草堂地》', tip: '东柯谷距天水约30公里，需包车', locs: ['dongke', 'guozhi'] },
    { day: 10, title: '成县同谷', desc: '同谷困顿。杜甫以为可安居，实际更加贫病交迫，理想居所再次破灭。', poems: '《乾元中寓居同谷县作歌七首》《万丈潭》《凤凰台》', tip: '成县杜甫草堂遗址纪念馆', locs: ['tonggu'] },
    { day: 11, title: '广元、剑门', desc: '入蜀古道。杜甫携家沿嘉陵江入蜀，剑门天险写下“惟天有设险，剑门天下壮”。', poems: '《木皮岭》《白沙渡》《水会渡》《剑门》', tip: '明月峡、昭化古城、剑门关景区', locs: ['guangyuan', 'jianmenguan'] },
    { day: 12, title: '成都', desc: '成都草堂。杜甫抵达成都西郊，在严武等人帮助下营建草堂，获得相对安定的创作空间。', poems: '《成都府》《堂成》《春夜喜雨》《茅屋为秋风所破歌》', tip: '杜甫草堂博物馆、武侯祠、锦里古街', locs: ['chengdu'] }
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

  card.innerHTML =
    '<h3>' + loc.name + '</h3>' +
    '<div class="detail-mod">今日地点：' + loc.modern + '</div>' +
    '<div class="detail-theme">' + loc.theme + '</div>' +
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

function renderRouteDays(routeKey, container) {
  if (!container) return;
  var days = ROUTES[routeKey];
  if (!days) return;
  var html = '';
  days.forEach(function(d) {
    html += '<div class="day-card" data-locations="' + d.locs.join(',') + '">';
    html += '<span class="day-n">Day ' + d.day + '</span>';
    html += '<h4>' + d.title + '</h4>';
    html += '<p>' + d.desc + '</p>';
    html += '<div class="day-poems">📜 ' + d.poems + '</div>';
    html += '<div class="day-tip">🗺 ' + d.tip + '</div>';
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
    html += '<div class="thematic-card" data-locations="' + t.locs.join(',') + '">';
    html += '<h3>' + t.title + '</h3>';
    html += '<div class="route-tags"><span class="rtag">' + t.days + '</span>';
    t.tags.forEach(function(tag) {
      html += '<span class="rtag">' + tag + '</span>';
    });
    html += '</div>';
    html += '<p class="route-desc">' + t.desc + '</p>';
    html += '<div class="thematic-route">';
    t.route.forEach(function(loc, i) {
      html += '<span class="tr-loc">' + loc + '</span>';
      if (i < t.route.length - 1) html += ' → ';
    });
    html += '</div>';
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
  return '杜甫诗路 · Day ' + d.day + '：' + d.title + '\n' +
    d.desc + '\n' +
    '📜 推荐阅读：' + d.poems + '\n' +
    '🗺 旅行建议：' + d.tip;
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
  var days = ROUTES[routeKey];
  if (!days) return '';
  var title = routeKey === '7day' ? '7天精华线：从秦州到成都' : '12天完整线：从长安到成都';
  var text = '杜甫诗路 · ' + title + '\n\n';
  days.forEach(function(d) {
    text += 'Day ' + d.day + ' ' + d.title + '\n';
    text += d.desc + '\n';
    text += '📜 ' + d.poems + '\n';
    text += '🗺 ' + d.tip + '\n\n';
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
