import { Math } from '../../components/Math';
import type { TParams, TValue } from '../types';

/**
 * Traditional Chinese (zh-Hant) — the CANONICAL dictionary and source of truth.
 * `Dictionary` and `TKey` are derived from this object, so every other locale is
 * compile-checked against it.
 *
 * Conventions:
 *  - flat dotted keys, namespaced by view: app.*, overview.*, case.*, export.*, …
 *  - keys read through tStr() (svg.*, *.toast.*, meta.*) MUST resolve to a string
 *  - function-valued keys returning JSX must only be read through t()
 */
export const zh = {
  // ── metadata ──────────────────────────────────────────────────────────
  'meta.title': 'QUBO Model Explorer',
  'meta.description':
    'QUBO Model Explorer — 互動重現 Glover, Kochenberger & Du 的 QUBO 建模教學論文。',

  // ── app shell ─────────────────────────────────────────────────────────
  'app.title': 'QUBO Model Explorer',
  'app.subtitle': 'A Tutorial on Formulating and Using QUBO Models',
  'app.nav.overview': '總覽',
  'app.nav.hello': 'Hello World',
  'app.nav.natural': 'A · 自然形式',
  'app.nav.knownPenalty': 'B · 已知懲罰',
  'app.nav.general': 'C · 通用變換',
  'app.nav.appendix': '附錄',
  'app.prev': '上一頁',
  'app.next': '下一頁',
  'app.footer': (p: TParams) => `© ${p.year} QUBO Model Explorer`,

  // ── presenter notes ───────────────────────────────────────────────────
  'notes.title': '講者提示',
  'notes.hint': '導覽時的重點與常見提問（預設收合，觀眾看不到）',

  // ── source badge / reconciliation ─────────────────────────────────────
  'verify.matches': '符合原論文',
  'verify.mismatch': '與原論文不符',
  'verify.custom': '自訂輸入（無原論文對照）',
  'verify.restore': '回到原論文資料',
  'verify.detail.ok': (p: TParams) =>
    `推導出的 ${p.n}×${p.n} Q 矩陣與原論文印出的完全相同，加性常數 ${p.constant} 亦相符。`,
  'verify.detail.bad': (p: TParams) => `有 ${p.count} 格與原論文不符。`,
  'verify.detail.custom':
    '您已修改輸入資料，因此不再與原論文對照。Q 矩陣仍然即時推導，解仍然精確。',

  // ── group intros ──────────────────────────────────────────────────────
  'group.natural.title': 'A · 自然形式',
  'group.natural.body': (
    <>
      這一組的問題本身就是二次的，把目標函數寫出來就已經是{' '}
      <Math>{'x^tQx'}</Math>，完全不需要懲罰函數。這是最舒服的情況，也是理解 Q
      矩陣結構最好的起點。
    </>
  ),
  'group.knownPenalty.title': 'B · 已知懲罰',
  'group.knownPenalty.body': (
    <>
      這一組有約束，但約束的形式恰好落在論文 p.10
      的對照表裡，可以直接查表換成二次懲罰項。重點在於：懲罰是<strong>精確表示</strong>，不是傳統罰函數法的近似：只要 P 夠大，QUBO
      的最優解就等於原問題的最優解。
    </>
  ),
  'group.general.title': 'C · 通用變換',
  'group.general.body': (
    <>
      查不到表就用通用配方。Transformation #1 把任意等式約束{' '}
      <Math>{'Ax = b'}</Math> 變成懲罰 <Math>{'P(Ax-b)^t(Ax-b)'}</Math>；不等式先用 slack 變數補成等式，再把 slack 做二進位展開。
    </>
  ),

  // ── case page panels ──────────────────────────────────────────────────
  'case.tab.formulation': '建模推導',
  'case.tab.matrix': 'Q 矩陣',
  'case.tab.solutions': '解空間',
  'case.tab.domain': '問題檢視',
  'case.tab.code': '程式碼',

  'formulation.original': '原始模型',
  'formulation.slack': 'Slack 變數展開',
  'formulation.penalty': '懲罰項',
  'formulation.result': '結果',
  'formulation.resultBody': (p: TParams) =>
    `${p.n} 個變數、加性常數 ${p.constant}。原始目標值 = xᵀQx + 常數。`,
  'formulation.method.transform1': 'Transformation #1',
  'formulation.method.transform2': 'Transformation #2',
  'formulation.method.atLeastOne': '已知懲罰（p.10 表格第 2 列）',
  'formulation.method.exactlyOne2': '已知懲罰（p.10 表格第 3 列）',
  'formulation.method.implication': '已知懲罰（p.10 表格第 4 列）',
  'formulation.method.equal2': '已知懲罰（p.10 表格第 6 列）',
  'formulation.slackNote': (p: TParams) =>
    `原論文取上界 ${p.used}，這條約束理論上最大可到 ${p.auto}；差額是作者的判斷，不是推導出來的。`,

  'matrix.symmetric': '對稱形式',
  'matrix.upper': '上三角形式',
  'matrix.view.heatmap': '熱圖',
  'matrix.view.latex': '矩陣式',
  'matrix.view.latexHint': '論文印出的排版方式，方便與 PDF 逐格對照。',
  'matrix.hint': '滑過任一格可看到這個數字由哪些來源累加而成。',
  'matrix.provenance': (p: TParams) => `Q[${p.i}][${p.j}] = ${p.value}`,
  'matrix.provenance.empty': '這一格沒有任何來源貢獻。',
  'matrix.constant': (p: TParams) => `加性常數 = ${p.constant}`,

  'solutions.exact': '窮舉（精確）',
  'solutions.heuristic': '啟發式（目前最佳）',
  'solutions.best': '最優解',
  'solutions.degeneracy': (p: TParams) => `有 ${p.count} 個解同時達到最優值`,
  'solutions.unique': '最優解唯一',
  'solutions.energy': 'xᵀQx',
  'solutions.original': '原始目標值',
  'solutions.evaluated': (p: TParams) => `列舉 ${p.count} 組，耗時 ${p.ms} ms`,
  'solutions.feasible': (p: TParams) => `其中 ${p.count} 組滿足全部原始約束`,
  'solutions.landscape': '能量分佈',
  'solutions.landscapeHint':
    '橫軸是 xᵀQx，縱軸是有多少組解落在該區間。可行解被懲罰推到能量低處，這就是懲罰法在做的事。',
  'solutions.feasibilityCheck': '把最優解代回原始約束',
  'solutions.rowOk': '滿足',
  'solutions.rowBad': '違反',
  'solutions.infeasible':
    '找不到可行解：懲罰項無法降到 0。這可能表示原問題本身無解，或 P 設得太小。',
  'solutions.running': '計算中…',

  // ── scale meter ───────────────────────────────────────────────────────
  'scale.title': '規模儀表',
  'scale.vars': (p: TParams) => `${p.n} 變數`,
  'scale.varsWithSlack': (p: TParams) =>
    `${p.base} 個原始變數 ＋ ${p.slack} 個 slack 位元 ＝ ${p.n} 變數`,
  'scale.states': (p: TParams) => `${p.states} 種組合`,
  'scale.tier.green': '窮舉（精確），即時',
  'scale.tier.amber': '窮舉（精確），會跑一下',
  'scale.tier.orange': '自動改用 tabu search（啟發式，不保證最優）',
  'scale.tier.red': '超過上限，拒絕執行',
  'scale.redHint': (p: TParams) =>
    `${p.n} 變數會產生 2^${p.n} 種組合，瀏覽器無法在合理時間內窮舉，tabu search 的結果也不再有參考價值。請縮小輸入。`,

  // ── penalty slider ────────────────────────────────────────────────────
  'penalty.title': '懲罰係數 P',
  'penalty.paperValue': (p: TParams) => `原論文取 P = ${p.value}`,
  'penalty.reset': '回到原論文值',
  'penalty.suggested': (p: TParams) => `建議範圍 ${p.lo} – ${p.hi}`,
  'penalty.hint': (
    <>
      論文 p.13：P 太大會淹沒目標函數資訊、太小則找不到可行解，中間有一段相當寬的「Goldilocks 區間」。經驗法則是取原目標函數估計值的 75%–150%。拖動看看最優解在哪個臨界值上跳進可行區。
    </>
  ),
  'penalty.none': '這個模型沒有約束，不需要懲罰係數。',
  'penalty.infeasibleNow': '目前的 P 太小：最優解已經不可行了。',

  // ── export / code ─────────────────────────────────────────────────────
  'export.tier1': '這一題',
  'export.tier2': '建模函式版',
  'export.tier1.hint':
    'Q 以字面值寫死，直接呼叫 sampler。數值來自本頁即時推導的同一份 Q。',
  'export.tier2.hint':
    '把原始約束模型交給 build_qubo()，在 Python 裡自己算出 Q。這才是論文真正在教的東西。',
  'export.script': 'Python 腳本',
  'export.jupyter': 'Jupyter / Colab',
  'export.sampler': '求解器',
  // The meaningful split is whether D-Wave is contacted at all — NOT where the
  // reader's Python runs. A classical sampler behaves identically on a laptop
  // or in Colab, and Colab itself still requires a Google account, so calling
  // it "local, no account" would be wrong on both counts.
  'export.sampler.local': '純古典求解 · 不連線 D-Wave',
  'export.sampler.token': '需要 D-Wave Leap 帳號',
  'export.sampler.tokenWarn':
    '這個 sampler 會連線到 D-Wave 並消耗 QPU 使用額度。論文的案例規模很小，改用上面的古典求解器就能得到同樣的答案。',
  'export.install.label': '安裝',
  'export.install.hint': '複製到終端機執行；Colab 請用下方 Notebook 分頁的第一個 cell。',
  'export.install.copy.tooltip': '複製安裝指令',
  'export.tokenSetup.label': '設定憑證',
  'export.copyCode.tooltip': '複製程式碼',
  'export.copyCell.tooltip': '複製這個 cell',
  'export.download.py.tooltip': '下載 .py',
  'export.download.ipynb.btn': '下載 .ipynb',
  'export.colabHint': '在 Colab 用「檔案 → 上傳筆記本」開啟。',
  'export.toast.codeCopied': '已複製程式碼',
  'export.toast.cellCopied': '已複製 cell',
  'export.toast.installCopied': '已複製安裝指令',
  'export.toast.pyDownloaded': (p: TParams) => `已下載 ${p.filename}.py`,
  'export.toast.ipynbDownloaded': (p: TParams) => `已下載 ${p.filename}.ipynb`,
  'export.toast.copyFailed': (p: TParams) => `複製失敗：${p.error}`,
  'export.toast.downloadFailed': (p: TParams) => `下載失敗：${p.error}`,

  // ── overview page ───────────────────────────────────────────────────────
  'overview.title': '總覽：QUBO 標準型與求解平台',
  'overview.lead': (
    <>
      Glover、Kochenberger 與 Du 在{' '}
      <em>A Tutorial on Formulating and Using QUBO Models</em>{' '}
      裡的核心主張不是「把問題變難」，而是<strong>把各式各樣的組合最佳化問題，統一映射到同一個標準型</strong>：
      <Math block>{'\\min / \\max \\; y = x^t Q x, \\quad x \\in \\{0,1\\}^n'}</Math>
      除了 0/1 之外沒有任何約束，全部資訊都在一個 Q 矩陣裡。於是問題端各式各樣的問題可以共用求解端同一套生態。
    </>
  ),
  'overview.left': '問題端 · 組合最佳化問題',
  'overview.middle': 'QUBO 標準型',
  'overview.right': '求解端 · 求解器',
  'overview.whyIsing': (
    <>
      求解端為什麼會有量子硬體？因為 QUBO 與物理的 Ising 模型等價（令{' '}
      <Math>{'x_j = (s_j + 1)/2'}</Math>），而 Ising Hamiltonian
      正是量子退火機的原生能量函數，硬體<strong>天生只認得這一種形式</strong>。因果關係要看清楚：不是先挑了 D-Wave 才配合它建模，而是 QUBO 這個形式恰好就是硬體看得懂的樣子。
    </>
  ),
  'overview.platforms': '求解端平台',
  'overview.platform.annealing': '量子退火',
  'overview.platform.gate': '閘模型',
  'overview.platform.digital': '數位退火',
  'overview.platform.classical': '古典啟發式',
  'overview.col.native': '原生形式',
  'overview.col.topology': '拓樸',
  'overview.col.embedding': '需要 embedding',
  'overview.col.scale': '規模',
  'overview.col.here': '本站支援',
  'overview.here.run': '可實跑',
  'overview.here.emit': '產碼',
  'overview.here.planned': '規劃中',
  'overview.yes': '是',
  'overview.no': '否',

  'overview.dwave.title': 'D-Wave：公司、硬體、雲服務、軟體',
  'overview.dwave.body': (
    <>
      「D-Wave」在不同語境下指四種不同的東西，討論時要分清楚。它<strong>本體是一家公司</strong>
      （D-Wave Quantum Inc.，NYSE: QBTS），底下才是硬體、雲服務與軟體。
    </>
  ),
  'overview.dwave.layer.company': '公司',
  'overview.dwave.layer.hardware': '硬體',
  'overview.dwave.layer.cloud': '雲服務',
  'overview.dwave.layer.software': '軟體',
  'overview.dwave.company': 'D-Wave Quantum Inc.（1999 年創立於加拿大 Burnaby）',
  'overview.dwave.hardware':
    'Advantage（Pegasus 拓樸）、Advantage2（Zephyr 拓樸）；皆為量子退火機，不是通用閘模型機',
  'overview.dwave.cloud': 'Leap — 即時雲端存取 QPU 與 hybrid solver，訂閱制',
  'overview.dwave.software':
    'Ocean SDK（開放原始碼，Python）：dimod、dwave-system、dwave-samplers、minorminer',
  'overview.dwave.language': (
    <>
      D-Wave <strong>沒有自己的程式語言</strong>，Python 就是第一等公民。需要「轉換」的不是語言而是問題模型，而且有兩層：第一層是本站在做的「原問題 → Q 矩陣」，第二層是「Q 矩陣 → 硬體拓樸」的 minor-embedding。
    </>
  ),
  'overview.dwave.qbsolvNote': (
    <>
      論文寫於 2019，文中提到的 <code>qbsolv</code> 現已廢棄（D-Wave 於 2022
      年起停止維護），對應功能由 Leap 的 hybrid solvers 取代。
    </>
  ),

  'overview.embedding.title': 'Minor-embedding：為什麼 5000 qubits 放不下 5000 個變數',
  'overview.embedding.body': (
    <>
      QUBO 假設任意兩個變數之間都能有 <Math>{'q_{ij}'}</Math>（全連通），但實體晶片上一顆 qubit 只連到固定幾個鄰居。所以每個<strong>邏輯變數</strong>必須展開成一串物理 qubit（chain），用強耦合綁在一起假裝是同一個變數。鏈越長，吃掉的
      qubit 越多。這就是論文 p.33 說 embedding 本身就是一個很難的問題的意思。
    </>
  ),
  'overview.embedding.vars': '邏輯變數數',
  'overview.embedding.chainLen': '每條 chain 長度',
  'overview.embedding.physical': '物理 qubit 需求',
  'overview.embedding.ratio': (p: TParams) => `放大 ${p.ratio}×`,
  'overview.embedding.play': '播放展開',
  'overview.embedding.pause': '暫停',
  'overview.embedding.reset': '重設',
  'overview.embedding.logical': '邏輯圖（全連通 QUBO）',
  'overview.embedding.physicalView': '物理圖（硬體拓樸上的 chain）',
  'overview.embedding.note': (
    <>
      這是<strong>教學示意</strong>，用的是 Chimera 式的十字構造。晶片畫成{' '}
      <Math>{'n \\times n'}</Math> 個單元格，每格有兩顆 qubit：一顆水平、一顆垂直，格內互相耦合。變數 <Math>{'i'}</Math> 的 chain ={' '}
      <strong>第 {'i'} 列全部的水平 qubit ＋ 第 {'i'} 行全部的垂直 qubit</strong>。於是 chain <Math>{'i'}</Math> 與 chain <Math>{'j'}</Math> 各有一顆 qubit
      同時落在單元格 <Math>{'(i, j)'}</Math> 裡而彼此耦合，那就是{' '}
      <Math>{'q_{ij}'}</Math> 的實體所在。注意<strong>沒有任何 qubit 被兩條 chain
      共用</strong>，這正是真實硬體的規則。代價是每條 chain 長{' '}
      <Math>{'2n'}</Math>、總共 <Math>{'2n^2'}</Math> 顆物理 qubit。真實的 Pegasus / Zephyr 連接度高得多，minorminer 的啟發式也聰明得多，常數小很多，但<strong>「邏輯變數平方級放大」這個量級是真的</strong>。
    </>
  ),

  // ── domain views ──────────────────────────────────────────────────────
  'domain.partition.subset1': '子集 1',
  'domain.partition.subset2': '子集 2',
  'domain.partition.diff': (p: TParams) => `差額 ${p.diff}`,
  'domain.partition.perfect': '完美平分',
  'domain.graph.setA': '集合 A',
  'domain.graph.setB': '集合 B',
  'domain.graph.cutValue': (p: TParams) => `割集大小 = ${p.value}`,
  'domain.cover.size': (p: TParams) => `覆蓋大小 = ${p.size}`,
  'domain.cover.uncovered': '未被覆蓋的邊',
  'domain.color.conflict': '衝突邊（兩端同色）',
  'domain.color.feasible': '合法著色',
  'domain.assign.facility': '設施',
  'domain.assign.location': '位置',
  'domain.assign.cost': (p: TParams) => `加權流量成本 = ${p.cost}`,
  'domain.knapsack.budget': (p: TParams) => `預算 ${p.used} / ${p.total}`,
  'domain.knapsack.value': (p: TParams) => `總價值 = ${p.value}`,
  'domain.sat.count': (p: TParams) => `${p.sat} / ${p.total} 個子句被滿足`,
  'domain.sat.sizeNote': (
    <>
      注意 QUBO 的大小<strong>只由變數數決定，與子句數完全無關</strong>。論文 p.17：
      200 變數、30,000 子句的 Max 2-SAT，仍然只是 200 變數的 QUBO。多加幾個子句試試看：Q 矩陣裡的數字會變，維度不會。
    </>
  ),

  // ── editors ───────────────────────────────────────────────────────────
  'editor.title': '自訂輸入',
  'editor.numbers.label': '數字集合（以逗號分隔）',
  'editor.numbers.helper': '會即時重算 Q 矩陣與最優解。',
  'editor.numbers.invalid': '請輸入以逗號分隔的正整數。',
  'editor.graph.hint': '點擊節點新增／移除；點兩個節點切換它們之間的邊。',
  'editor.graph.addNode': '新增節點',
  'editor.graph.removeNode': '移除節點',
  'editor.graph.clear': '清空邊',
  'editor.colors.label': '顏色數 K',
  'editor.sat.add': '新增子句',
  'editor.sat.vars': '變數數',
  'editor.overflow': (p: TParams) =>
    `Q 矩陣元素達到 ${p.max}，已超過雙精度浮點數的安全整數範圍（2^53）。論文 p.27 也提醒過這一點，建議縮小輸入數值。`,

  // ── hello world ───────────────────────────────────────────────────────
  'hello.title': 'Hello World — 讀懂一個 Q 矩陣',
  'hello.lead': (
    <>
      論文 §2（p.5）自己的暖身題。沒有約束、沒有懲罰、沒有 slack 變數，也沒有任何領域語意，純粹就是「<Math>{'x^tQx'}</Math> 是什麼意思」。四個變數只有 16 種組合，因此<strong>整個解空間可以一次攤開</strong>。
    </>
  ),
  'hello.lesson1.title': '線性項住在對角線上',
  'hello.lesson1.body': (
    <>
      二元變數滿足 <Math>{'x_j = x_j^2'}</Math>，所以 <Math>{'-5x_1'}</Math> 可以寫成{' '}
      <Math>{'-5x_1^2'}</Math>，落在 <Math>{'q_{11}'}</Math> 上。這就是為什麼 Q
      的對角線是原本的線性係數。
    </>
  ),
  'hello.lesson2.title': '二次項對半拆到對稱兩格',
  'hello.lesson2.body': (
    <>
      <Math>{'4x_1x_2'}</Math> 拆成 <Math>{'q_{12} = q_{21} = 2'}</Math>。因為{' '}
      <Math>{'x^tQx'}</Math> 會把 <Math>{'q_{12}'}</Math> 和 <Math>{'q_{21}'}</Math>{' '}
      各算一次，兩格相加才是原本的係數。§4.3 的 Q 出現 ±½ 就是這個緣故。
    </>
  ),
  'hello.lesson3.title': '對稱形式 vs 上三角形式',
  'hello.lesson3.body': (
    <>
      兩種寫法完全等價。論文選對稱形式，但 <code>dimod</code> 要的是上三角形式（非對角係數是 <Math>{'2q_{ij}'}</Math>）。切換上面的開關看差別；匯出的 Python 已為您完成這步轉換。
    </>
  ),
  'hello.allStates': '全部 16 種組合',
  'hello.paperForm': '論文的寫法',
  'hello.paperFormBody': (
    <>
      論文 p.5 把同一件事寫成完整的二次型：變數列向量、Q 矩陣、變數行向量。
      把這一段和 PDF 並排看，就能確認本站推導出的每一格都與論文相同。
      下面熱圖的「矩陣式」開關也可以切出同樣的排版。
    </>
  ),
  'hello.tryIt': '動手試試',
  'hello.tryItBody':
    '改下面任何一個係數，右邊的 Q 矩陣和整張解空間表會即時重算。改完按「回到原論文資料」即可還原 §2 的原始式子。',
  'hello.runIt': '真的跑一次',
  'hello.browserRun': '瀏覽器求解結果',
  'hello.browserRunHint':
    '這不是預先寫好的答案：Web Worker 剛才用 Gray code 順序窮舉了全部組合，下面每個數字都是當場算出來的。',
  'hello.runItBody': (
    <>
      上面的結果是<strong>瀏覽器當場算出來的</strong>。下面的程式碼是同一個計算在 Python 裡的版本，可以直接貼進 Google Colab 或您自己的環境執行，結果應完全一致。預設的{' '}
      <code>dimod.ExactSolver</code> 是純古典求解器，在您執行 Python 的地方直接窮舉全部組合，不連線 D-Wave，因此不需要 Leap 帳號或 API token，也不會產生 QPU 費用。
    </>
  ),

  // ── appendix ──────────────────────────────────────────────────────────
  'appendix.title': '附錄 · §7 的兩個補充技術',
  'appendix.higherOrder.title': '高次項降階（Rosenberg reduction）',
  'appendix.higherOrder.body': (
    <>
      QUBO 只能有二次項，但有些問題天生帶三次以上的項。論文 §7 第 4 點的作法是引入新變數 <Math>{'y_1'}</Math> 代替乘積 <Math>{'x_1x_2'}</Math>，並加上懲罰
      <Math block>{'P(x_1x_2 - 2x_1y_1 - 2x_2y_1 + 3y_1)'}</Math>
      這個懲罰只有在 <Math>{'y_1 = x_1x_2'}</Math> 時才等於 0，所以最佳化過程會自動逼出正確的代換。於是 <Math>{'x_1x_2x_3'}</Math> 降成 <Math>{'y_1x_3'}</Math>。可以遞迴套用到任意高次。
    </>
  ),
  'appendix.higherOrder.table': '懲罰項真值表',
  'appendix.nodeVars.title': '邊變數 → 點變數的置換',
  'appendix.nodeVars.body': (
    <>
      論文 §7 第 3 點：像 clique partitioning 這種以「邊」為決策變數的模型，變數數會是 <Math>{'O(|V|^2)'}</Math>，動輒上百萬。把每個邊變數換成兩個點變數的乘積{' '}
      <Math>{'x_{ij} \\to x_i x_j'}</Math>，線性模型就變成二次模型，但變數數從邊數降到點數，通常小好幾個數量級。二次模型再用前面的方法轉成 QUBO 即可。
    </>
  ),
  'appendix.penaltyValue': '懲罰值',

  // ── misc ──────────────────────────────────────────────────────────────
  'common.constraints': '約束',
  'common.min': '最小化',
  'common.max': '最大化',
} satisfies Record<string, TValue>;

export type Dictionary = typeof zh;
export type TKey = keyof Dictionary;
