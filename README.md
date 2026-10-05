# QUBO Model Explorer

互動重現 Glover, Kochenberger & Du，
*Quantum Bridge Analytics I: A Tutorial on Formulating and Using QUBO Models* (2019)
的十一個建模案例的靜態網站，並補上論文只點名、沒有算例的問題（延伸案例）。

線上版：<https://yuuchilyann.github.io/QUBOModelExplorer/>

論文教的是一件事：把各式各樣的組合最佳化問題，**統一映射到同一個標準型**

```
min / max   y = xᵀQx,   x ∈ {0,1}ⁿ
```

除了 0/1 之外沒有任何約束，全部資訊都在一個 Q 矩陣裡。本站把這個推導過程變成可以
拖、可以改、可以立刻看到結果的東西。

## 核心設計決策

> **Q 矩陣一律用程式從原始約束模型推導，絕不硬寫。**
>
> 推導引擎、案例定義、求解器與產碼器已抽出為獨立的公開套件
> [`qubo-core`](https://github.com/yuuchilyann/qubo-core)，本站是它的消費端之一。

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
| **附錄** | §7 的高次項降階（Rosenberg）與邊變數→點變數置換。兩者現在都有實際案例：Max 3-SAT 用降階、Clique Partitioning 用點變數置換 |

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

## 延伸案例：論文只點名的問題

論文 §1（pp.3–4）列了二十多種「QUBO 涵蓋的問題」，§6 也提到幾種，但**只有上面十一個有算例**。
其餘的問題論文沒有給實例、沒有印 Q、也沒有答案。本站逐步補上這些問題，每一題都在頁面上
**明講**這件事：

| § | 案例 | 情境 | 變數 | P | 自訂輸入 |
|---|---|---|---|---|---|
| 1（點名） | Max Independent Set | 互有衝突的人不能同隊，最多挑幾人 | 5 | 2 | ✓ |
| 1（點名） | Max Clique | 任兩人都互相認識的最大群體 | 5 | 2 | ✓ |
| 1（點名） | Max Diversity | 從 §3.1 的八個數字挑四個，彼此差距最大 | 8 | 200 | |
| 1（點名） | Discrete Tomography | 由列和、行和還原 3×3 黑白影像（5 種答案） | 9 | 1 | |
| 1（點名） | Task Allocation | 三個任務分給兩台處理器，執行與通訊成本拉扯 | 6 | 16 | |
| 1（點名） | Capital Budgeting | §5.5 的專案，兩個預算期 | 4 + 9 slack | 14 | |
| 1（點名） | Multiple Knapsack | §5.5 的物品裝進兩個背包 | 8 + 8 slack | 14 | |
| 1（點名） | P-Median | 恰好開 2 個據點，總距離最短 | 15 | 10 | |
| 1（點名） | Warehouse Location | 據點有開設成本、不限個數 | 15 | 17 | |
| 1（點名） | Linear Ordering | 五位評審的意見循環，排出最一致的總排名 | 6 + 8 slack | 5 | |
| 1（點名） | Clique Partitioning | 正負相似度分群，§7 的點變數置換 | 16 | 10 | |
| 1（點名） | Max 3-SAT | 三文字子句，§7 的高次項降階 | 4 + 1 輔助 | 3 | |
| 1（點名） | CSP（分隊） | 每組三人不能全在同一隊；三次項全部抵消 | 6 | — | |
| 6（引用） | Graph Partitioning | §3.2 同一張圖分成 2／3 兩組，割邊最少 | 5 | 3 | |
| 6（引用） | Portfolio | 恰好持有 3 檔資產，風險 − 報酬最小 | 5 | 40 | |
| 6（引用） | Max Weight Matching | 每人最多一個搭檔，搭檔效益最大 | 6 | 6 | |

§6 的問題不在論文 §1 清單裡，論文只在引用他人研究時提到；頁面上的標籤與說明框會寫「論文 §6 引用」，
和 §1 的「論文僅點名」區分。

Max 3-SAT 是第一個需要改推導引擎的案例：三個文字的子句會產生三次項，引擎先把所有子句加總，
再用 Rosenberg 降階把剩下的高次項換成輔助變數。頁面的「建模推導」會列出每個輔助變數與它的懲罰，
並標示 P 是否大於保證精確所需的下限；量表與解空間把輔助變數和 slack 一樣以虛線標出。

P 一律由本站選定（論文沒有給），每個案例的程式註解寫明保證夠大的推導界；
實際能用的最小 P 通常小得多，對照表在 qubo-core 的 `docs/CASE_CATALOG.md`。

- 頁首一則說明：論文在哪裡點名、實例是本站選的、所以 Q 沒有原論文可以對照
- 來源徽章旁多一個「論文僅點名」標籤；懲罰滑桿寫「本站取 P = …（論文未給）」
- 驗證晶片是另一種顏色的「與原始模型窮舉一致」，不會被誤讀成「符合原論文」
- 產出的 Python 在預期答案的註解裡標明來源是窮舉，不是論文

沒有論文的 Q 可以 diff，所以檢查換成**不經 QUBO、直接窮舉原始約束模型**（`solveConstrained`），
要求 QUBO 最優值加常數與它相同、每個 QUBO 最優解都可行。它和推導引擎沒有共用程式碼，
所以不是「拿推導結果驗證推導結果」。實例盡量沿用論文已有的資料：Max Independent Set 用的
是 §4.1 那張圖，答案 2 可以由 §4.1 印出的 3 推得（獨立集的補集是頂點覆蓋，5 − 3 = 2），
驗證腳本也會斷言這個值。

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
| `MockDWaveSampler` + `EmbeddingComposite` | ✗（真實 minor-embedding，退火本身是模擬的） |
| `DWaveSampler` + `EmbeddingComposite` | ✓ |
| `LeapHybridSampler` | ✓ |

**論文十一個案例全部落在 `ExactSolver` 的射程內**，所以前三個 sampler 是純古典求解器（第四個 mock 另外做一次真實的 minor-embedding，同樣不連線），
在執行 Python 的地方直接窮舉，不連線 D-Wave，因此不需要 Leap 帳號或 API token，
也不會產生 QPU 費用。貼進 Colab 或自己的環境按執行，就會跑出論文印的答案。
這不是示意用的假程式碼。

## 三道驗證

推導引擎與驗證都住在 [`qubo-core`](https://github.com/yuuchilyann/qubo-core)，
所以驗證指令在那邊跑：

```bash
cd ../qubo-core && npm run verify:all
```

| 指令 | 檢查什麼 |
|---|---|
| `npm run verify` | 推導的 Q == 論文的 Q（逐格）、加性常數、窮舉最優解 == 論文的解、`yOriginal = yQubo + constant`、最優解代回原始約束全部滿足、**直接窮舉原始約束模型 == 論文的原始 y**。延伸案例改驗 QUBO 最優 + 常數 == 約束窮舉、每個最優解可行、簡併度一致，以及由論文數字推得的值。外加 tabu 回歸守衛。 |
| `npm run verify:python` | 內嵌的 Python `build_qubo()` == TypeScript `derive()` == 論文的 Q。**三方一致**（延伸案例沒有論文的 Q，為兩方一致）。 |
| `npm run verify:emit` | 把產出的 Python **原封不動執行**（注入純 stdlib 的 `dimod` 樁模組，不動您的環境），確認 12 案例 × 6 種 tier／sampler 組合 = 72 支程式都印出參照答案（論文的答案，或延伸案例的約束窮舉結果）。 |

第三道檢查的是只存在於產碼器裡的邏輯：上三角轉換、最大化的符號翻轉、加性常數還原、
變數索引對應。前兩道抓不到這些。

最後一次執行全部通過。

本站另有一道編譯期檢查（`src/i18n/coreKeys.ts`）：核心宣告它需要哪些字典鍵，
本站斷言自己的字典涵蓋它們，少一個就編譯失敗。

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
| `qubo-core` | 推導引擎、案例、求解器、產碼器 |
| Vite | ^8.0 |
| React | ^19.2 |
| TypeScript | ^6.0 |
| MUI (Material UI) | ^9.0 |
| KaTeX | ^0.16 |
| Prism | ^1.30 |

需要 Node.js 20 以上（Vite 8）。`qubo-core` 的驗證腳本另外需要 `python` 在 PATH 上
（純 stdlib，不需安裝任何套件）；沒有的話會自動 SKIP 而非誤報通過。

## 開發

```bash
npm install
npm run dev          # http://localhost:5174
npm run typecheck
npm run build        # 輸出至 ./publish
npm run preview
```

三道驗證在 `qubo-core` 裡跑（見上）。

## 語言

介面有繁體中文與英文兩種，右上角切換，選擇存在 `localStorage`（`qme.lang`），首次
進站則依瀏覽器語言判斷。

`src/i18n/locales/zh.tsx` 是**正典字典**，`Dictionary` 與 `TKey` 由它推導；
`src/i18n/locales/en.tsx` 已補齊全部 key，並且**型別上就是完整的 `Dictionary`**，
所以在 zh 加了新 key 卻忘了補英文會直接編譯失敗，而不是讓英文頁面默默出現中文。
`I18nProvider` 仍保留 fallback 機制，供日後新增的語言逐步翻譯。

UI 字串一律不寫死在元件裡（講者提示、平台比較表、sampler 上限也都在字典中）。唯一
的例外是約束標籤（`qubo-core` 的 `cases/*.ts` 的 `label`），它跟論文的式子一樣是與語言無關的
記號，例如 `x₁ + x₃ + x₆ = 1`、`node 3: exactly one colour`。

## 專案結構

```
QUBOModelExplorer/
├─ index.html
├─ vite.config.ts              # base './', build.outDir = "publish"
├─ public/                     # .nojekyll, favicon.svg
└─ src/
   ├─ theme.ts
   ├─ App.tsx                  # 分頁群組 + hash 路由 + 線性導引
   ├─ workers/solver.worker.ts # Web Worker 薄殼，求解器本身在 qubo-core
   ├─ hooks/                   # useSolver、useHashRoute
   ├─ i18n/                    # zh 為正典，en 已補齊（型別上要求完整）
   │  └─ coreKeys.ts           # 斷言字典涵蓋 qubo-core 需要的鍵
   ├─ components/
   └─ pages/
```

領域邏輯全部來自 [`qubo-core`](https://github.com/yuuchilyann/qubo-core)：

```
qubo-core/src/
├─ types.ts                    # QuboCase / ConstrainedModel / QuboModel
├─ qubo.ts                     # QuboBuilder、對稱／上三角、slack 展開
├─ derive.ts                   # 通用推導引擎（全案唯一入口）
├─ cases/                      # 十一個案例定義（含 paperQ 對照）+ mutate
├─ samplers/                   # bruteForce.ts、tabu.ts
└─ python/                     # samplers / module / emit / serialize
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
