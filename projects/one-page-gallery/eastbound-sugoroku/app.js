(() => {
  "use strict";

  const STORAGE_KEY = "sugoroku-eastbound-v2";
  const PLAYER_COLORS = ["#a82e2a", "#233f71", "#24684f", "#b47d2b"];
  const DIE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

  const chapters = {
    1: {
      name: "第一章 · 横滨开港",
      short: "横滨开港",
      image: window.SUGOROKU_ASSETS?.yokohama || "assets/yokohama.webp",
      atlas: "assets/yokohama-atlas.webp"
    },
    2: {
      name: "第二章 · 北陆道中",
      short: "北陆道中",
      image: window.SUGOROKU_ASSETS?.hokuriku || "assets/hokuriku.webp",
      atlas: "assets/hokuriku-atlas.webp"
    },
    3: {
      name: "第三章 · 伊势狂欢",
      short: "伊势狂欢",
      image: window.SUGOROKU_ASSETS?.ise || "assets/ise.webp",
      atlas: "assets/ise-atlas.webp"
    },
    4: {
      name: "第四章 · 交通新世界",
      short: "交通新世界",
      image: window.SUGOROKU_ASSETS?.transport || "assets/transport.webp",
      atlas: "assets/transport-atlas.webp"
    }
  };

  const cells = [
    { chapter: 1, glyph: "振", title: "日本桥·振出", description: "五街道的起点。所有旅人从这枚“振出”印记开始东行。", effect: { type: "none" } },
    { chapter: 1, glyph: "道", title: "东海道启程", description: "沿东海道离开日本桥，旅行的顺序开始组织眼前的世界。", effect: { type: "none" } },
    { chapter: 1, glyph: "進", title: "神奈川宿", description: "海湾与宿场把旅人引向新兴港口，熟路相助前进一格。", effect: { type: "advance", amount: 1, label: "前进 1 格" } },
    { chapter: 1, glyph: "港", title: "港口初见", description: "桅杆、仓库与新式建筑构成横滨开港后的城市奇观。", effect: { type: "none" } },
    { chapter: 1, glyph: "再", title: "外国商馆", description: "在商馆中见到新货物与新知识，得到一次追加投掷。", effect: { type: "extra", label: "再掷一次" } },
    { chapter: 1, glyph: "進", title: "马车道", description: "新式道路和马车改变了穿越城市的速度，前进两格。", effect: { type: "advance", amount: 2, label: "前进 2 格" } },
    { chapter: 1, glyph: "戻", title: "海风误程", description: "港口海风骤起，旅人偏离道路，只得退回一格。", effect: { type: "back", amount: 1, label: "后退 1 格" } },
    { chapter: 1, glyph: "休", title: "横滨宴游", description: "城市宴游持续到深夜，下一回合暂停。", effect: { type: "skip", amount: 1, label: "暂停 1 回合" } },
    { chapter: 1, glyph: "進", title: "开港奇观", description: "开港带来的新景观让旅程加速，前进两格进入北陆。", effect: { type: "advance", amount: 2, label: "前进 2 格" } },

    { chapter: 2, glyph: "城", title: "金泽城下", description: "从金泽城下进入北陆道中，山河与驿站依旅行顺序展开。", effect: { type: "none" } },
    { chapter: 2, glyph: "休", title: "雪国驿站", description: "在雪国驿站歇脚，下一回合暂停一次。", effect: { type: "skip", amount: 1, label: "暂停 1 回合" } },
    { chapter: 2, glyph: "籤", title: "河川渡口", description: "渡船是否及时靠岸要看机缘，抽签决定行程。", effect: { type: "chance", label: "抽取机缘" } },
    { chapter: 2, glyph: "戻", title: "山路盘旋", description: "盘旋山路使人迷失方向，后退一格。", effect: { type: "back", amount: 1, label: "后退 1 格" } },
    { chapter: 2, glyph: "再", title: "温泉停驻", description: "温泉恢复了脚力，可以追加一次投掷。", effect: { type: "extra", label: "再掷一次" } },
    { chapter: 2, glyph: "戻", title: "豪雪阻道", description: "积雪封路，只得退回两格寻找安全道路。", effect: { type: "back", amount: 2, label: "后退 2 格" } },
    { chapter: 2, glyph: "進", title: "城下町", description: "食宿与道路消息齐备，前进两格。", effect: { type: "advance", amount: 2, label: "前进 2 格" } },
    { chapter: 2, glyph: "進", title: "日本桥在望", description: "远处已能看到日本桥的街市轮廓，前进一格。", effect: { type: "advance", amount: 1, label: "前进 1 格" } },
    { chapter: 2, glyph: "皆", title: "北陆巡览", description: "一路积累的道路知识惠及同行者，所有旅人前进一格。", effect: { type: "all", amount: 1, label: "全员前进 1 格" } },

    { chapter: 3, glyph: "宮", title: "伊势参宫", description: "第三章转向伊势参拜。神圣目的、旅途见闻与世俗娱乐交织在一起。", effect: { type: "none" } },
    { chapter: 3, glyph: "籤", title: "御札降临", description: "护符从天而降的传闻引发骚动。抽一支机缘签，结果吉凶未定。", effect: { type: "chance", label: "随机前进或后退" } },
    { chapter: 3, glyph: "再", title: "ええじゃないか", description: "众人跳舞欢呼，狂欢的节奏带来一次追加投掷。", effect: { type: "extra", label: "再掷一次" } },
    { chapter: 3, glyph: "進", title: "街头舞阵", description: "舞阵卷过街头，前进两格。", effect: { type: "advance", amount: 2, label: "前进 2 格" } },
    { chapter: 3, glyph: "休", title: "宴饮同乐", description: "宴饮持续整夜，下一回合暂停。", effect: { type: "skip", amount: 1, label: "暂停 1 回合" } },
    { chapter: 3, glyph: "籤", title: "乔装游行", description: "换上节庆装束加入队伍，抽签决定游行路线。", effect: { type: "chance", label: "抽取机缘" } },
    { chapter: 3, glyph: "戻", title: "狂欢失序", description: "人群拥挤、路线混乱，后退两格。", effect: { type: "back", amount: 2, label: "后退 2 格" } },
    { chapter: 3, glyph: "進", title: "神宫再会", description: "在参道重新会合，获得祝福并前进两格。", effect: { type: "advance", amount: 2, label: "前进 2 格" } },
    { chapter: 3, glyph: "皆", title: "御利益", description: "护符的祝愿惠及所有旅人，全员前进一格。", effect: { type: "all", amount: 1, label: "全员前进 1 格" } },

    { chapter: 4, glyph: "進", title: "人力车", description: "人力车灵活穿行于街巷，前进一格。", effect: { type: "advance", amount: 1, label: "前进 1 格" } },
    { chapter: 4, glyph: "進", title: "马车", description: "四轮马车沿新式道路奔驰，比步行更快抵达下一站。", effect: { type: "advance", amount: 2, label: "前进 2 格" } },
    { chapter: 4, glyph: "籤", title: "蒸汽船", description: "蒸汽动力突破风向限制，抽签决定本次航程。", effect: { type: "chance", label: "抽取机缘" } },
    { chapter: 4, glyph: "進", title: "铁路开通", description: "铁路把城市与港口压缩进新的时间尺度，前进三格。", effect: { type: "advance", amount: 3, label: "前进 3 格" } },
    { chapter: 4, glyph: "再", title: "邮便马车", description: "新的时间表带来额外一次投掷机会。", effect: { type: "extra", label: "再掷一次" } },
    { chapter: 4, glyph: "籤", title: "气球升空", description: "气球随风而行，抽签决定落点。", effect: { type: "chance", label: "抽取机缘" } },
    { chapter: 4, glyph: "皆", title: "交通博览", description: "新技术在展场集中亮相，所有旅人前进一格。", effect: { type: "all", amount: 1, label: "全员前进 1 格" } },
    { chapter: 4, glyph: "進", title: "世界相连", description: "船舶、铁路与邮路让世界变近，前进一格。", effect: { type: "advance", amount: 1, label: "前进 1 格" } },
    { chapter: 4, glyph: "上", title: "新世界·上り", description: "旅程终点。你已经穿过城市、道中、狂欢与技术图鉴构成的四个世界。", effect: { type: "finish", label: "抵达终点" } }
  ];

  const defaultState = () => ({
    started: false,
    players: [],
    currentIndex: 0,
    round: 1,
    totalRolls: 0,
    rolling: false,
    winnerIndex: null,
    logs: ["选择 1–4 名旅人后开始游戏。"],
    selectedCell: 0,
    showNumbers: true
  });

  let state = defaultState();
  let toastTimer = null;
  let resizeTimer = null;

  const board = document.getElementById("board");
  const boardStatus = document.getElementById("boardStatus");
  const playerList = document.getElementById("playerList");
  const gameLog = document.getElementById("gameLog");
  const rollDiceButton = document.getElementById("rollDice");
  const die = document.getElementById("die");
  const diceResult = document.getElementById("diceResult");
  const turnLabel = document.getElementById("turnLabel");
  const currentToken = document.getElementById("currentToken");
  const currentName = document.getElementById("currentName");
  const currentPosition = document.getElementById("currentPosition");
  const setupDialog = document.getElementById("setupDialog");
  const rulesDialog = document.getElementById("rulesDialog");
  const winnerDialog = document.getElementById("winnerDialog");
  const lightboxDialog = document.getElementById("lightboxDialog");
  const sceneDialog = document.getElementById("sceneDialog");
  const playerCount = document.getElementById("playerCount");
  const nameFields = document.getElementById("nameFields");
  const continueGameButton = document.getElementById("continueGame");
  const toggleNumbersButton = document.getElementById("toggleNumbers");
  const toast = document.getElementById("toast");

  function safeShowModal(dialog) {
    if (!dialog.open) {
      dialog.showModal();
    }
  }

  function safeClose(dialog) {
    if (dialog.open) {
      dialog.close();
    }
  }

  function getColumnCount() {
    return window.matchMedia("(max-width: 640px)").matches ? 4 : 6;
  }

  function getVisualOrder() {
    const columns = getColumnCount();
    const indices = cells.map((_, index) => index);
    const rows = [];

    for (let start = 0; start < indices.length; start += columns) {
      const row = indices.slice(start, start + columns);
      if (rows.length % 2 === 1) row.reverse();
      rows.push(row);
    }

    return { columns, indices: rows.flat() };
  }

  function effectText(effect) {
    if (!effect || effect.type === "none") return "普通格：无额外效果";
    if (effect.type === "finish") return "终点格：抵达或越过此格即获胜";
    return `特殊格：${effect.label}`;
  }

  function effectAria(effect) {
    if (!effect || effect.type === "none") return "普通格";
    return effect.label || "特殊格";
  }

  function artworkCrop(index) {
    const localIndex = index % 9;
    return {
      x: (localIndex % 3) * 50,
      y: Math.floor(localIndex / 3) * 50
    };
  }

  function renderBoard() {
    const { columns, indices } = getVisualOrder();
    board.style.setProperty("--cols", columns);
    board.classList.toggle("hide-numbers", !state.showNumbers);
    board.innerHTML = "";

    indices.forEach((index) => {
      const cell = cells[index];
      const cellButton = document.createElement("button");
      cellButton.type = "button";
      cellButton.className = `cell chapter-${cell.chapter}`;
      cellButton.dataset.index = String(index);
      cellButton.setAttribute("role", "gridcell");
      cellButton.setAttribute("aria-label", `第 ${index + 1} 格，${cell.title}，${effectAria(cell.effect)}`);
      const crop = artworkCrop(index);
      cellButton.style.setProperty("--cell-image", `url("${chapters[cell.chapter].atlas}")`);
      cellButton.style.setProperty("--cell-x", `${crop.x}%`);
      cellButton.style.setProperty("--cell-y", `${crop.y}%`);

      if (cell.effect.type !== "none" && cell.effect.type !== "finish") {
        cellButton.classList.add("is-special");
      }
      if (index === state.selectedCell) {
        cellButton.classList.add("is-selected");
      }
      if (state.started && state.players[state.currentIndex]?.position === index) {
        cellButton.classList.add("has-current-player");
      }

      const number = document.createElement("span");
      number.className = "cell-number";
      number.textContent = String(index + 1).padStart(2, "0");

      const title = document.createElement("span");
      title.className = "cell-title";
      title.textContent = cell.title;

      const symbol = document.createElement("span");
      symbol.className = "cell-symbol";
      symbol.textContent = cell.glyph;
      symbol.setAttribute("aria-hidden", "true");

      const tokens = document.createElement("span");
      tokens.className = "cell-tokens";
      tokens.setAttribute("aria-hidden", "true");

      state.players.forEach((player, playerIndex) => {
        if (player.position !== index) return;
        const token = document.createElement("span");
        token.className = "player-token";
        if (playerIndex === state.currentIndex && state.started && state.winnerIndex === null) {
          token.classList.add("is-current");
        }
        token.style.background = player.color;
        token.textContent = (player.name.trim()[0] || "旅").toUpperCase();
        token.title = player.name;
        tokens.appendChild(token);
      });

      cellButton.append(number, title, symbol, tokens);
      cellButton.addEventListener("click", () => {
        const wasSelected = state.selectedCell === index;
        selectCell(index);
        if (wasSelected && !window.matchMedia("(max-width: 930px)").matches) {
          openSceneViewer(index);
        }
      });
      board.appendChild(cellButton);
    });
  }

  function selectCell(index) {
    state.selectedCell = index;
    const cell = cells[index];
    document.getElementById("activeCellChapter").textContent = chapters[cell.chapter].name;
    document.getElementById("activeCellTitle").textContent = cell.title;
    document.getElementById("activeCellDescription").textContent = cell.description;
    document.getElementById("activeCellEffect").textContent = effectText(cell.effect);
    const crop = artworkCrop(index);
    const activeArtwork = document.getElementById("activeCellImage");
    activeArtwork.style.setProperty("--detail-image", `url("${chapters[cell.chapter].atlas}")`);
    activeArtwork.style.setProperty("--detail-x", `${crop.x}%`);
    activeArtwork.style.setProperty("--detail-y", `${crop.y}%`);
    activeArtwork.setAttribute("aria-label", `${cell.title}：${chapters[cell.chapter].short}高清木版画场景`);
    if (window.matchMedia("(max-width: 930px)").matches) {
      document.getElementById("activeCell").classList.add("is-open");
    }
    renderBoard();
    saveState();
  }

  function renderPlayers() {
    playerList.innerHTML = "";

    if (!state.players.length) {
      const empty = document.createElement("li");
      empty.className = "player-row";
      empty.textContent = "尚未选择旅人";
      playerList.appendChild(empty);
      return;
    }

    state.players.forEach((player, index) => {
      const item = document.createElement("li");
      item.className = "player-row";
      if (index === state.currentIndex && state.started && state.winnerIndex === null) {
        item.classList.add("is-current");
      }

      const dot = document.createElement("span");
      dot.className = "player-dot";
      dot.style.background = player.color;
      dot.setAttribute("aria-hidden", "true");

      const name = document.createElement("span");
      name.className = "player-name";
      name.textContent = player.name;

      const place = document.createElement("span");
      place.className = "player-place";
      const pause = player.skipTurns > 0 ? ` · 休 ${player.skipTurns}` : "";
      place.textContent = `${player.position + 1}/36${pause}`;

      item.append(dot, name, place);
      playerList.appendChild(item);
    });
  }

  function renderLog() {
    gameLog.innerHTML = "";
    const visibleLogs = state.logs.slice(-12).reverse();

    visibleLogs.forEach((entry) => {
      const item = document.createElement("li");
      item.textContent = entry;
      gameLog.appendChild(item);
    });
  }

  function renderStatus() {
    if (!state.started || !state.players.length) {
      boardStatus.textContent = "等待开始游戏";
      turnLabel.textContent = "尚未开局";
      currentName.textContent = "点击“开始新局”";
      currentPosition.textContent = "所有旅人将从“振出”出发";
      currentToken.textContent = "旅";
      currentToken.style.background = "#17213b";
      rollDiceButton.disabled = true;
      diceResult.textContent = "准备好了吗？";
      return;
    }

    const player = state.players[state.currentIndex];
    const cell = cells[player.position];

    if (state.winnerIndex !== null) {
      const winner = state.players[state.winnerIndex];
      boardStatus.textContent = `${winner.name} 已抵达“上り”`;
      turnLabel.textContent = "本局结束";
      currentName.textContent = winner.name;
      currentPosition.textContent = `共掷骰 ${state.totalRolls} 次`;
      currentToken.textContent = (winner.name[0] || "胜").toUpperCase();
      currentToken.style.background = winner.color;
      rollDiceButton.disabled = true;
      diceResult.textContent = "抵达新世界";
      return;
    }

    boardStatus.textContent = `第 ${state.round} 回合 · ${player.name} 行至第 ${player.position + 1} 格`;
    turnLabel.textContent = `第 ${state.round} 回合`;
    currentName.textContent = player.name;
    currentPosition.textContent = `${cell.title} · 第 ${player.position + 1} 格`;
    currentToken.textContent = (player.name[0] || "旅").toUpperCase();
    currentToken.style.background = player.color;
    rollDiceButton.disabled = state.rolling;
  }

  function renderAll() {
    renderBoard();
    renderPlayers();
    renderLog();
    renderStatus();
    toggleNumbersButton.setAttribute("aria-pressed", String(state.showNumbers));
    selectCellWithoutRender(state.selectedCell);
  }

  function selectCellWithoutRender(index) {
    const cell = cells[index] || cells[0];
    document.getElementById("activeCellChapter").textContent = chapters[cell.chapter].name;
    document.getElementById("activeCellTitle").textContent = cell.title;
    document.getElementById("activeCellDescription").textContent = cell.description;
    document.getElementById("activeCellEffect").textContent = effectText(cell.effect);
    const crop = artworkCrop(index);
    const activeArtwork = document.getElementById("activeCellImage");
    activeArtwork.style.setProperty("--detail-image", `url("${chapters[cell.chapter].atlas}")`);
    activeArtwork.style.setProperty("--detail-x", `${crop.x}%`);
    activeArtwork.style.setProperty("--detail-y", `${crop.y}%`);
    activeArtwork.setAttribute("aria-label", `${cell.title}：${chapters[cell.chapter].short}高清木版画场景`);
  }

  let sceneIndex = 0;

  function updateSceneViewer(index) {
    sceneIndex = (index + cells.length) % cells.length;
    const cell = cells[sceneIndex];
    const crop = artworkCrop(sceneIndex);
    const artwork = document.getElementById("sceneArtwork");
    artwork.style.setProperty("--scene-image", `url("${chapters[cell.chapter].atlas}")`);
    artwork.style.setProperty("--scene-x", `${crop.x}%`);
    artwork.style.setProperty("--scene-y", `${crop.y}%`);
    artwork.setAttribute("aria-label", `第 ${sceneIndex + 1} 格，${cell.title}，高清木版画场景`);
    document.getElementById("sceneMeta").textContent = `${chapters[cell.chapter].name} · 第 ${sceneIndex + 1} 景`;
    document.getElementById("sceneTitle").textContent = cell.title;
    document.getElementById("sceneDescription").textContent = cell.description;
    document.getElementById("sceneEffect").textContent = effectText(cell.effect);
  }

  function openSceneViewer(index = state.selectedCell) {
    updateSceneViewer(index);
    safeShowModal(sceneDialog);
  }

  function log(message) {
    state.logs.push(message);
    if (state.logs.length > 60) state.logs = state.logs.slice(-60);
    renderLog();
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, rolling: false }));
    } catch (error) {
      console.warn("无法保存游戏状态", error);
    }
  }

  function readSavedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.players) || typeof parsed.started !== "boolean") return null;
      return {
        ...defaultState(),
        ...parsed,
        rolling: false,
        players: parsed.players.map((player, index) => ({
          name: String(player.name || `旅人${index + 1}`).slice(0, 12),
          color: player.color || PLAYER_COLORS[index],
          position: Math.min(Math.max(Number(player.position) || 0, 0), cells.length - 1),
          skipTurns: Math.max(Number(player.skipTurns) || 0, 0)
        }))
      };
    } catch (error) {
      console.warn("无法读取游戏状态", error);
      return null;
    }
  }

  function clearSavedState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("无法清除游戏状态", error);
    }
  }

  function renderNameFields() {
    const count = Number(playerCount.value);
    const defaults = ["旅人一", "旅人二", "旅人三", "旅人四"];
    nameFields.innerHTML = "";

    for (let index = 0; index < count; index += 1) {
      const wrapper = document.createElement("div");
      wrapper.className = "name-field";

      const label = document.createElement("label");
      label.htmlFor = `playerName${index}`;

      const swatch = document.createElement("span");
      swatch.className = "name-color";
      swatch.style.background = PLAYER_COLORS[index];
      swatch.setAttribute("aria-hidden", "true");

      label.append(swatch, document.createTextNode(`旅人 ${index + 1}`));

      const input = document.createElement("input");
      input.id = `playerName${index}`;
      input.type = "text";
      input.maxLength = 12;
      input.value = defaults[index];
      input.autocomplete = "off";

      wrapper.append(label, input);
      nameFields.appendChild(wrapper);
    }
  }

  function openSetup() {
    renderNameFields();
    continueGameButton.hidden = !(state.started && state.players.length);
    safeShowModal(setupDialog);
  }

  function beginGame(names) {
    clearSavedState();
    state = defaultState();
    state.started = true;
    state.players = names.map((name, index) => ({
      name: name.trim() || `旅人${index + 1}`,
      color: PLAYER_COLORS[index],
      position: 0,
      skipTurns: 0
    }));
    state.logs = [`${state.players.map((player) => player.name).join("、")} 从“振出”出发。`];
    state.selectedCell = 0;
    die.textContent = DIE_FACES[0];
    die.setAttribute("aria-label", "骰子显示 1 点");
    diceResult.textContent = `${state.players[0].name} 先行`;
    safeClose(setupDialog);
    renderAll();
    saveState();
    showToast("新游戏已开始");
    document.getElementById("game").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function prepareTurn() {
    if (!state.started || state.winnerIndex !== null || !state.players.length) return;

    let inspected = 0;
    while (state.players[state.currentIndex].skipTurns > 0 && inspected < state.players.length * 2) {
      const skipped = state.players[state.currentIndex];
      skipped.skipTurns -= 1;
      log(`${skipped.name} 因“休”跳过本回合。`);
      advanceTurnIndex();
      inspected += 1;
    }

    state.selectedCell = state.players[state.currentIndex].position;
    renderAll();
    saveState();
  }

  function advanceTurnIndex() {
    const previous = state.currentIndex;
    state.currentIndex = (state.currentIndex + 1) % state.players.length;
    if (state.currentIndex <= previous) state.round += 1;
  }

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  async function animateMove(playerIndex, delta) {
    const player = state.players[playerIndex];
    const target = Math.min(Math.max(player.position + delta, 0), cells.length - 1);
    const direction = target >= player.position ? 1 : -1;

    while (player.position !== target) {
      player.position += direction;
      state.selectedCell = player.position;
      renderBoard();
      renderPlayers();
      renderStatus();
      selectCellWithoutRender(player.position);
      await sleep(150);
    }

    saveState();
  }

  function setDie(value) {
    const safeValue = Math.min(Math.max(value, 1), 6);
    die.textContent = DIE_FACES[safeValue - 1];
    die.setAttribute("aria-label", `骰子显示 ${safeValue} 点`);
  }

  async function checkWinner(playerIndex) {
    if (state.players[playerIndex].position < cells.length - 1) return false;

    state.players[playerIndex].position = cells.length - 1;
    state.winnerIndex = playerIndex;
    state.selectedCell = cells.length - 1;
    const winner = state.players[playerIndex];
    log(`${winner.name} 抵达“新世界·上り”，本局获胜。`);
    renderAll();
    saveState();

    document.getElementById("winnerMessage").textContent = state.players.length === 1
      ? `${winner.name} 用 ${state.totalRolls} 次掷骰完成了三十六景行旅。`
      : `${winner.name} 在第 ${state.round} 回合率先抵达终点，共完成 ${state.totalRolls} 次掷骰。`;

    await sleep(250);
    safeShowModal(winnerDialog);
    return true;
  }

  async function applyEffect(playerIndex) {
    const player = state.players[playerIndex];
    const cell = cells[player.position];
    const effect = cell.effect;

    if (!effect || effect.type === "none" || effect.type === "finish") {
      log(`${player.name} 停在“${cell.title}”。`);
      return { extraTurn: false };
    }

    if (effect.type === "advance") {
      log(`${player.name} 在“${cell.title}”${effect.label}。`);
      await animateMove(playerIndex, effect.amount);
      await checkWinner(playerIndex);
      return { extraTurn: false };
    }

    if (effect.type === "back") {
      log(`${player.name} 在“${cell.title}”${effect.label}。`);
      await animateMove(playerIndex, -effect.amount);
      return { extraTurn: false };
    }

    if (effect.type === "skip") {
      player.skipTurns += effect.amount;
      log(`${player.name} 在“${cell.title}”休整，下一回合暂停。`);
      return { extraTurn: false };
    }

    if (effect.type === "extra") {
      log(`${player.name} 在“${cell.title}”得到再掷机会。`);
      return { extraTurn: true };
    }

    if (effect.type === "all") {
      log(`“${cell.title}”席卷棋盘：所有旅人前进 ${effect.amount} 格。`);
      for (let index = 0; index < state.players.length; index += 1) {
        await animateMove(index, effect.amount);
        const won = await checkWinner(index);
        if (won) break;
      }
      return { extraTurn: false };
    }

    if (effect.type === "chance") {
      const draw = Math.floor(Math.random() * 6);
      setDie(draw + 1);
      const chapterEnd = Math.min(cell.chapter * 9 - 1, cells.length - 1);
      const chances = [
        { label: "顺风满帆：前进 3 格", move: 3 },
        { label: "山雪封路：后退 2 格", move: -2 },
        { label: "旅店相助：可以再掷一次", extra: true },
        { label: "护符落肩：前进 2 格", move: 2 },
        { label: "马车误点：暂停一回合", skip: 1 },
        { label: "蒸汽船提前靠岸：前进到本章末格", target: chapterEnd }
      ];
      const chance = chances[draw];
      diceResult.textContent = chance.label;
      log(`${player.name} 抽到机缘：${chance.label}。`);
      if (typeof chance.move === "number") await animateMove(playerIndex, chance.move);
      if (typeof chance.target === "number") await animateMove(playerIndex, chance.target - player.position);
      if (chance.skip) player.skipTurns += chance.skip;
      if (player.position >= cells.length - 1) await checkWinner(playerIndex);
      return { extraTurn: Boolean(chance.extra) };
    }

    return { extraTurn: false };
  }

  async function rollDice() {
    if (!state.started || state.rolling || state.winnerIndex !== null) return;

    const playerIndex = state.currentIndex;
    const player = state.players[playerIndex];
    state.rolling = true;
    rollDiceButton.disabled = true;
    die.classList.remove("is-rolling");
    void die.offsetWidth;
    die.classList.add("is-rolling");
    diceResult.textContent = "骰子滚动中……";

    const value = Math.floor(Math.random() * 6) + 1;
    let ticks = 0;
    const ticker = window.setInterval(() => {
      setDie(Math.floor(Math.random() * 6) + 1);
      ticks += 1;
      if (ticks >= 6) window.clearInterval(ticker);
    }, 70);

    await sleep(520);
    window.clearInterval(ticker);
    die.classList.remove("is-rolling");
    setDie(value);
    state.totalRolls += 1;
    diceResult.textContent = `${player.name} 掷出 ${value} 点`;
    log(`${player.name} 掷出 ${value} 点。`);

    await animateMove(playerIndex, value);
    const wonFromRoll = await checkWinner(playerIndex);

    if (!wonFromRoll) {
      const result = await applyEffect(playerIndex);
      if (state.winnerIndex === null) {
        if (result.extraTurn) {
          diceResult.textContent = `${player.name} 可以再掷一次`;
          state.selectedCell = state.players[playerIndex].position;
        } else {
          advanceTurnIndex();
        }
      }
    }

    state.rolling = false;
    renderAll();
    saveState();

    if (state.winnerIndex === null) {
      prepareTurn();
    }
  }

  function bindStartButton(id) {
    document.getElementById(id).addEventListener("click", () => {
      document.getElementById("game").scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(openSetup, 350);
    });
  }

  bindStartButton("headerStart");
  bindStartButton("heroStart");

  document.getElementById("newGame").addEventListener("click", openSetup);
  document.getElementById("closeSetup").addEventListener("click", () => safeClose(setupDialog));
  document.getElementById("closeRules").addEventListener("click", () => safeClose(rulesDialog));
  document.getElementById("openRules").addEventListener("click", () => safeShowModal(rulesDialog));
  document.getElementById("rulesStart").addEventListener("click", () => {
    safeClose(rulesDialog);
    if (!state.started) openSetup();
  });

  playerCount.addEventListener("change", renderNameFields);

  document.getElementById("confirmSetup").addEventListener("click", () => {
    const inputs = [...nameFields.querySelectorAll("input")];
    beginGame(inputs.map((input) => input.value));
  });

  continueGameButton.addEventListener("click", () => {
    safeClose(setupDialog);
    renderAll();
    showToast("已回到当前游戏");
  });

  rollDiceButton.addEventListener("click", rollDice);

  document.getElementById("clearLog").addEventListener("click", () => {
    state.logs = ["行旅记已清空。"];
    renderLog();
    saveState();
  });

  document.getElementById("closeCellDetail").addEventListener("click", () => {
    document.getElementById("activeCell").classList.remove("is-open");
  });

  document.getElementById("activeCellImage").addEventListener("click", () => openSceneViewer(state.selectedCell));
  document.getElementById("closeScene").addEventListener("click", () => safeClose(sceneDialog));
  document.getElementById("scenePrev").addEventListener("click", () => updateSceneViewer(sceneIndex - 1));
  document.getElementById("sceneNext").addEventListener("click", () => updateSceneViewer(sceneIndex + 1));

  toggleNumbersButton.addEventListener("click", () => {
    state.showNumbers = !state.showNumbers;
    toggleNumbersButton.setAttribute("aria-pressed", String(state.showNumbers));
    renderBoard();
    saveState();
  });

  const lightboxItems = [...document.querySelectorAll("[data-lightbox]")];
  let lightboxIndex = 0;

  function showLightboxItem(index) {
    lightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
    const button = lightboxItems[lightboxIndex];
    document.getElementById("lightboxImage").src = button.dataset.lightbox;
    document.getElementById("lightboxCaption").textContent = button.dataset.caption || "双六原作";
  }

  lightboxItems.forEach((button, index) => {
    button.addEventListener("click", () => {
      showLightboxItem(index);
      safeShowModal(lightboxDialog);
    });
  });

  document.querySelectorAll(".hero-strip").forEach((strip, index) => {
    strip.tabIndex = 0;
    strip.setAttribute("role", "button");
    strip.setAttribute("aria-label", `放大查看${lightboxItems[index]?.dataset.caption || "原作"}`);
    const openHeroArtwork = () => {
      showLightboxItem(index);
      safeShowModal(lightboxDialog);
    };
    strip.addEventListener("click", openHeroArtwork);
    strip.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openHeroArtwork();
      }
    });
  });

  document.getElementById("closeLightbox").addEventListener("click", () => safeClose(lightboxDialog));
  document.getElementById("lightboxPrev").addEventListener("click", () => showLightboxItem(lightboxIndex - 1));
  document.getElementById("lightboxNext").addEventListener("click", () => showLightboxItem(lightboxIndex + 1));
  document.getElementById("closeWinner").addEventListener("click", () => safeClose(winnerDialog));
  document.getElementById("playAgain").addEventListener("click", () => {
    safeClose(winnerDialog);
    openSetup();
  });

  document.getElementById("restartJourney").addEventListener("click", openSetup);

  document.querySelectorAll("[data-play-chapter]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.playChapter) || 0;
      selectCell(index);
      document.getElementById("game").scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        document.querySelector(`.cell[data-index="${index}"]`)?.classList.add("chapter-pulse");
      }, 500);
    });
  });

  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");
  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    primaryNav.classList.toggle("is-open", !open);
  });
  primaryNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    navToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  }));

  window.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName;
    const isTyping = tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA";
    if (isTyping) return;

    if (sceneDialog.open && event.key === "ArrowLeft") {
      event.preventDefault();
      updateSceneViewer(sceneIndex - 1);
      return;
    }

    if (sceneDialog.open && event.key === "ArrowRight") {
      event.preventDefault();
      updateSceneViewer(sceneIndex + 1);
      return;
    }

    if (event.code === "Space" && !sceneDialog.open && !lightboxDialog.open) {
      event.preventDefault();
      rollDice();
    }

    if (event.key.toLowerCase() === "r") {
      event.preventDefault();
      openSetup();
    }

    if (lightboxDialog.open && event.key === "ArrowLeft") showLightboxItem(lightboxIndex - 1);
    if (lightboxDialog.open && event.key === "ArrowRight") showLightboxItem(lightboxIndex + 1);
  });

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(renderBoard, 120);
  });

  const saved = readSavedState();
  if (saved && saved.started && saved.players.length) {
    state = saved;
    state.selectedCell = state.players[state.currentIndex]?.position ?? 0;
    showToast("已恢复上次游戏");
  }

  renderNameFields();
  renderAll();

  const gameSection = document.getElementById("game");
  const playNavLink = primaryNav.querySelector('a[href="#game"]');
  new IntersectionObserver(([entry]) => {
    playNavLink?.classList.toggle("is-active", entry.isIntersecting);
  }, { threshold: 0.12 }).observe(gameSection);
})();
