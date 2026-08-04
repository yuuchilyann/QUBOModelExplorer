# QUBO Model Explorer

互動重現 Glover, Kochenberger & Du，
*Quantum Bridge Analytics I: A Tutorial on Formulating and Using QUBO Models* (2019)
的十一個建模案例的靜態網站。

線上版：<https://yuuchilyann.github.io/QUBOModelExplorer/>

論文教的是一件事：把各式各樣的組合最佳化問題，**統一映射到同一個標準型**

```
min / max   y = xᵀQx,   x ∈ {0,1}ⁿ
```

除了 0/1 之外沒有任何約束，全部資訊都在一個 Q 矩陣裡。本站把這個推導過程變成可以
拖、可以改、可以立刻看到結果的東西。

## 核心設計決策

> **Q 矩陣一律用程式從原始約束模型推導，絕不硬寫。**

論文印出的 Q 另存一份（`paperQ`），只用來做 diff。這代表比對通過時證明的是
**通用配方本身正確**，而不是「十一個矩陣抄對了」，因為十一個案例走的是同一支
`derive()`。

這個決策已經產生實際回報：它在 §5.4 QAP 抓到論文自己的排版錯誤（見下）。

## 六個分頁

| 分頁 | 內容 |
|---|---|
| **總覽** | 問題端（11 類問題）→ QUBO → 求解端（退火／閘模型／數位退火／古典）的全景；D-Wave 四層拆解（公司／硬體／Leap／Ocean）；**互動式 minor-embedding 展開動畫**；**「QUBO 的真實成本」**（見下） |
| **Hello World** | §2 的 4 變數例。16 種組合全部攤開即時計算，教 Q 矩陣的三件事（線性項在對角線、二次項對半拆、對稱 vs 上三角），並手把手示範怎麼貼進 Colab 跑。解空間表可切換 `x₁→x₄`／`x₄→x₁` 欄位順序，後者讀起來就是一般的二進位遞增 |
| **A · 自然形式** | §3 — 問題本身就是二次的，不需要懲罰 |
| **B · 已知懲罰** | §4 — 約束落在 p.10 對照表裡，直接查表 |
| **C · 通用變換** | §5 — Transformation #1 / #2、slack 變數二進位展開 |
| **附錄** | §7 的高次項降階（Rosenberg）與邊變數→點變數置換 |

每個案例頁有五個聯動面板：**建模推導**（KaTeX 逐步展開）、**Q 矩陣**（熱圖＋來源溯源
hover）、**解空間**（窮舉＋能量分佈＋可行性回代）、**問題檢視**（領域專屬圖）、
**程式碼**（Python 匯出）。

## 十一個案例

| § | 案例 | 情境 | 變數 | P | 自訂輸入 |
|---|---|---|---|---|---|
| 2 | Hello World | （刻意沒有情境） | 4 | — | ✓ |
| 3.1 | Number Partitioning | 兩台卡車分貨，載重盡量接近 | 8 | — | ✓ |
| 3.2 | Max-Cut | 網路分兩群，找最脆弱的那道切口 | 5 | — | ✓ |
| 4.1 | Minimum Vertex Cover | 路口裝監視器，每條街都要拍到 | 5 | 8 | ✓ |
| 4.2 | Set Packing | 方案彼此衝突，不衝突下盡量多選 | 4 | 6 | |
| 4.3 | Max 2-SAT | 條件互相打架，盡量滿足最多條 | 4 | — | ✓ |
| 5.1 | Set Partitioning | 航空機組排班，每個航段剛好一張班表 | 6 | 10 | |
| 5.2 | Graph Colouring | 有共同學生的課不能排同一時段 | 15 | 4 | ✓ |
| 5.3 | General 0/1 Programming | （刻意沒有情境，是配方模板本身） | 5 + 5 slack | 10 | |
| 5.4 | Quadratic Assignment (QAP) | 部門配廠房，流量 × 距離最小 | 9 | 200 | |
| 5.5 | Quadratic Knapsack | 選投資專案，兩兩之間有綜效 | 4 + 2 slack | 10 | |

論文用節號稱呼每個案例並直接進入代數，讀者若沒先接觸過該問題，會不知道算出來的
`x` 是要拿來做什麼的。所以每個案例頁在工作區之前先給一段**情境**、一行 **`x` 的意義**，
以及一列**真實應用**（`src/components/CaseScenario.tsx`，文字在 i18n 字典裡）。群組頁的
卡片也顯示同一段文字的前兩行，讓清單可以直接瀏覽。

Hello World 與 §5.3 沒有情境，而且都**明講**這件事：前者是純粹的 `xᵀQx` 算式示範，
後者是通用模板。不說的話，讀者會把「沒有情境」誤讀成自己沒看懂。

## 求解：全部在瀏覽器裡

沒有後端。兩個求解器跑在 Web Worker 裡：

- **窮舉（精確）** — Gray code 順序列舉，翻轉第 k 位的能量變化是封閉式
  `Δ = ±(q_kk + 2·Σ_{j≠k} q_kj·x_j)`，每步 `O(n)` 而非 `O(n²)`，總成本 `O(n·2ⁿ)`。
  論文最大的 15 變數案例不到 1 ms；實用上限約 n = 24。
- **Tabu search（啟發式）** — Glover 本人的方法。維護 gain 向量增量更新，選擇與套用
  移動都是 `O(n)`。含停滯偵測後的多樣化重啟。

兩者的結果在 UI 上有明確不同的標記：窮舉可以宣稱「最優解」，tabu 只能宣稱
「目前找到最好的」。

### 規模儀表

每個可自訂案例旁常駐一條即時讀數，顯示變數數 → 組合數 → 採用策略，並在跨越門檻時變色：

| 變數數 | 策略 |
|---|---|
| ≤ 20 | 🟢 窮舉，即時 |
| 21–24 | 🟡 窮舉，會跑一下 |
| ≥ 25 | 🟠 自動改用 tabu，結果標記為非保證最優 |

這是刻意放在顯眼處的：Graph Colouring 的變數數是「節點數 × 顏色數」、QAP 是 `n²`，
拉一下滑桿就會親身撞到組合爆炸，這比任何文字說明都有效。

## Python 匯出

兩層交付，對應論文自己的兩個抽象層級：

- **第一層「這一題」** — Q 以字面值寫死，直接呼叫 sampler。數值來自頁面上同一份推導，
  零漂移風險。
- **第二層「建模函式版」** — 附上 `build_qubo()`，把原始約束模型丟進去在 Python 裡
  算出 Q。這才是論文真正在教的東西。

求解器選擇器分兩區，中間畫線：

| Sampler | 需要 Leap token |
|---|---|
| `dimod.ExactSolver` | ✗ |
| `TabuSampler` (`dwave-samplers`) | ✗ |
| `SimulatedAnnealingSampler` | ✗ |
| `DWaveSampler` + `EmbeddingComposite` | ✓ |
| `LeapHybridSampler` | ✓ |

**論文十一個案例全部落在 `ExactSolver` 的射程內**，所以前三個 sampler 是純古典求解器，
在執行 Python 的地方直接窮舉，不連線 D-Wave，因此不需要 Leap 帳號或 API token，
也不會產生 QPU 費用。貼進 Colab 或自己的環境按執行，就會跑出論文印的答案。
這不是示意用的假程式碼。

## 三道驗證

```bash
npm run verify:all
```

| 指令 | 檢查什麼 |
|---|---|
| `npm run verify` | 推導的 Q == 論文的 Q（逐格）、加性常數、窮舉最優解 == 論文的解、`yOriginal = yQubo + constant`、最優解代回原始約束全部滿足。外加 tabu 回歸守衛。 |
| `npm run verify:python` | 內嵌的 Python `build_qubo()` == TypeScript `derive()` == 論文的 Q。**三方一致。** |
| `npm run verify:emit` | 把產出的 Python **原封不動執行**（注入純 stdlib 的 `dimod` 樁模組，不動您的環境），確認 11 案例 × 2 層 = 22 支程式都印出論文的答案。 |

第三道檢查的是只存在於產碼器裡的邏輯：上三角轉換、最大化的符號翻轉、加性常數還原、
變數索引對應。前兩道抓不到這些。

最後一次執行全部通過。

## 在論文裡發現的問題

§5.4 QAP：論文 p.28 印出的**目標函數式子**與 p.29 印出的 **Q 矩陣**互相矛盾。

- `60x₂x₇` 應為 `32x₂x₇`（Q[1][6] = 16 ⇒ 係數 32）
- `48x₅x₇` 整項遺漏（Q[4][6] = 24 ⇒ 係數 48）
- `90x₆x₇` 整項遺漏（Q[5][6] = 45 ⇒ 係數 90）

窮舉所有設施／位置配對會得到 18 個二次項，而不是式子列出的 16 個。從流量與距離矩陣
重新推導的結果與論文印出的 **Q 矩陣**完全相符，也重現論文自己的答案 218；換句話說
Q 矩陣是對的，上面那行目標函數式子有排版錯誤。

這正是「推導而非抄寫」這個架構決策存在的理由。

## QUBO 的真實成本

論文由 QUBO 古典啟發式的作者群寫成（Glover 是禁忌搜尋的發明人），對這個標準型的
代價幾乎沒有著墨。只講好處會讓本站變成廣告而不是導讀，所以總覽頁末尾補了一節
**刻意的逆風**，用站上自己的案例當證據：

| 代價 | 證據 |
|---|---|
| 約束被壓成懲罰項，結構跟著消失 | §4.1 六條約束被吸收進對角線（`1` → `−15`／`−23`），常數 48；約束傳播、切平面、鬆弛界全部用不上，另外還多出人工調 `P` 的負擔 |
| 係數動態範圍爆炸 | §5.5 原始資料全是個位數，Q 卻從 20 到 1922、常數 −2560；退火硬體的耦合器精度有限，小係數會被量化進雜訊 |
| 不等式要拿 slack 變數換 | §5.5 四個物品，Q 卻是 6×6；硬體上還要再乘一次 chain 長度 |
| 拿不到對偶界 | MIP 求解器回報「保證在最優的 x% 以內」，QUBO 啟發式只給一個數字。本站十一個案例看不出來，因為都小到可以窮舉 |

結論是與硬體成熟度無關的判準：**目標函數本來就是稠密二次、約束不多的問題，QUBO 是
自然選擇；線性目標加大量結構化約束的問題，用 QUBO 是自找麻煩。** 頁面上附了「划算／
不划算的訊號」雙欄對照。

## 技術棧

| 套件 | 版本 |
|---|---|
| Vite | ^8.0 |
| React | ^19.2 |
| TypeScript | ^6.0 |
| MUI (Material UI) | ^9.0 |
| KaTeX | ^0.16 |
| Prism | ^1.30 |

需要 Node.js 20 以上（Vite 8）。驗證腳本另外需要 `python` 在 PATH 上（純 stdlib，
不需安裝任何套件）；沒有的話會自動 SKIP 而非誤報通過。

## 開發

```bash
npm install
npm run dev          # http://localhost:5174
npm run typecheck
npm run build        # 輸出至 ./publish
npm run preview
npm run verify:all   # 三道驗證
```

## 語言

介面有繁體中文與英文兩種，右上角切換，選擇存在 `localStorage`（`qme.lang`），首次
進站則依瀏覽器語言判斷。

`src/i18n/locales/zh.tsx` 是**正典字典**，`Dictionary` 與 `TKey` 由它推導；
`src/i18n/locales/en.tsx` 已補齊全部 key，並且**型別上就是完整的 `Dictionary`**，
所以在 zh 加了新 key 卻忘了補英文會直接編譯失敗，而不是讓英文頁面默默出現中文。
`I18nProvider` 仍保留 fallback 機制，供日後新增的語言逐步翻譯。

UI 字串一律不寫死在元件裡（講者提示、平台比較表、sampler 上限也都在字典中）。唯一
的例外是約束標籤（`src/cases/*.ts` 的 `label`），它跟論文的式子一樣是與語言無關的
記號，例如 `x₁ + x₃ + x₆ = 1`、`node 3: exactly one colour`。

## 專案結構

```
QUBOModelExplorer/
├─ index.html
├─ vite.config.ts              # base './', build.outDir = "publish"
├─ scripts/
│  ├─ verify-cases.mjs         # 推導 ↔ 論文
│  ├─ verify-python.mjs        # Python ↔ TypeScript ↔ 論文
│  └─ verify-emit.mjs          # 產出的程式碼是否真的跑出論文答案
├─ public/                     # .nojekyll, favicon.svg
└─ src/
   ├─ types.ts                 # QuboCase / ConstrainedModel / QuboModel
   ├─ theme.ts
   ├─ App.tsx                  # 分頁群組 + hash 路由 + 線性導引
   ├─ cases/                   # 十一個案例定義（含 paperQ 對照）
   │  ├─ natural.ts            # §2, §3.1, §3.2
   │  ├─ knownPenalty.ts       # §4.1, §4.2, §4.3
   │  ├─ general.ts            # §5.1 – §5.5
   │  └─ mutate.ts             # 自訂輸入 → 重建案例
   ├─ lib/
   │  ├─ qubo.ts               # QuboBuilder、對稱／上三角、slack 展開
   │  ├─ derive.ts             # 通用推導引擎（全案唯一入口）
   │  ├─ samplers/             # bruteForce.ts、tabu.ts
   │  └─ python/               # samplers / module / emit / serialize
   ├─ workers/solver.worker.ts
   ├─ hooks/                   # useSolver、useHashRoute
   ├─ i18n/                    # zh 為正典，en 已補齊（型別上要求完整）
   ├─ components/
   └─ pages/
```

## 部署

線上版：<https://yuuchilyann.github.io/QUBOModelExplorer/>

使用**相對路徑**（`base: './'`）與 **hash 路由**，所以編譯後的 `publish/` 可以丟到
任何子路徑或 CDN 而不需重編，深連結（`#/case/graph-coloring`）也不需要 404 fallback
hack。`public/.nojekyll` 確保 GitHub Pages 不啟用 Jekyll。

`publish/` **會一起 commit**，`.github/workflows/static.yml` 直接把它上傳到 Pages。
所以改完程式碼後的流程是：

```bash
npm run build     # 更新 publish/
git add -A && git commit && git push
```

忘記重新 build 的話，推上去的原始碼會與線上版不同步。產物的檔名帶內容 hash，每次
build 都會產生新檔名並永久留在 git 歷史裡，所以 production build 刻意關閉 sourcemap
（否則每次會多存約 4 MB）。若日後覺得 repo 膨脹，改成在 CI 裡 build 即可：把
`publish/` 加回 `.gitignore`，並在 workflow 的上傳步驟前插入 `npm ci && npm run build`。

## 已知限制

- **大 n 視覺擁擠**：Q 矩陣熱圖在 n > 20 時字級會縮到很小，目前以橫向捲動因應。
- **自訂輸入只開放五個案例**：Number Partitioning、Max-Cut、Min Vertex Cover、
  Max 2-SAT、Graph Colouring。其餘案例只開放 P 滑桿。
- **不連線 D-Wave 實機**：QPU sampler 只產碼不執行。這是刻意的：論文案例小到
  QPU 毫無優勢，而且實連需要後端 proxy 保管 token。

## 授權

未指定。
