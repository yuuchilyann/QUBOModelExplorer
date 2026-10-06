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

  // Note bodies live here rather than in the pages so English gets them too;
  // they are the densest prose on the site and the most useful to a presenter.
  'notes.overview': (
    <>
      這一頁只要讓觀眾接受一件事：<strong>QUBO 是一座橋，不是一個目的地</strong>。一端是一大串看起來毫無關係的問題（論文算過的十一個，加上論文只點名、本站補上的延伸案例），另一端是四種完全不同的硬體，中間那個{' '}
      <Math>{'x^tQx'}</Math> 是唯一的共同語言。
      <br />
      <br />
      常見提問一：「那是不是丟給量子電腦就會比較快？」答案是不會。論文作者自己在 p.34
      說他們的古典 solver QUBO 2.0 比主流量子系統快三個數量級。本站所有案例全都小到瀏覽器毫秒級就窮舉完了。
      <br />
      <br />
      常見提問二：「為什麼要先變成 NP-hard？」其實並沒有變難。QUBO 本來就是 NP-hard，規約沒有讓問題變簡單。動機是<strong>統一介面</strong>，不是降低難度。
      <br />
      <br />
      minor-embedding 那張圖建議現場拖 slider 從 3 拉到 10，讓大家看物理需求怎麼平方成長。這是「5000 qubits 為什麼只放得下幾百個變數」最快的解釋。
      <br />
      <br />
      最後那節「真實成本」是<strong>刻意加的逆風</strong>，論文本身沒有。如果時間不夠只能講一項，講第 4 項（拿不到對偶界），
      那是實務上最痛、也最少人事先想到的。第 1 項可以留到 B 組的頂點覆蓋頁再講，那裡有 P 滑桿可以現場示範「罰得不夠痛就會作弊」。
    </>
  ),
  'notes.hello': (
    <>
      這一頁是全站唯一「手把手教怎麼跑起來」的地方，後面每一頁都假設觀眾已經會了。
      <br />
      <br />
      建議流程：先念三個 lesson（約 2 分鐘），再現場改一個係數讓大家看右邊 16 列整張表即時重算，這一步最能建立「Q 矩陣就是目標函數」的直覺。最後把程式碼複製到 Colab 真的跑一次，讓大家看到 y = −11 出現在輸出裡。
      <br />
      <br />
      強調 <code>dimod.ExactSolver</code> <strong>不需要任何帳號或 API token</strong>。後面每一頁的程式碼都可以照樣貼進去跑，這不是示意用的假程式碼。
    </>
  ),
  'notes.appendix': (
    <>
      附錄這兩招都是「當 QUBO 的二次形式不夠用時怎麼辦」。
      <br />
      <br />
      Rosenberg reduction 的真值表建議現場逐列念一遍：重點是懲罰項<strong>只有在代換正確時才等於 0</strong>，所以不必額外「強迫」<code>y₁ = x₁x₂</code>，最佳化過程會自己選對。這和整篇論文的懲罰哲學完全一致。
      <br />
      <br />
      點變數置換那一招在實務上威力最大，因為它動的是變數數的<strong>數量級</strong>，不是常數。前面所有案例都還在幾十個變數，這一招是真的把百萬級問題壓回千級的手法。
    </>
  ),

  'notes.group.natural': (
    <>
      這一組要建立的直覺是「Q 矩陣就是目標函數換個寫法」。沒有懲罰、沒有 slack，對角線是線性項、非對角線是二次項的一半，就這樣。
      <br />
      <br />
      Number Partitioning 值得多停一下：論文是從 <code>diff²</code>{' '}
      手推的，但本站把它表達成「Transformation #1 套在平衡等式{' '}
      <code>Σsⱼxⱼ = c/2</code> 上、P = 1」，推出來的 Q 一模一樣。這證明論文的「自然形式」和「通用配方」其實是同一件事的兩種說法。
    </>
  ),
  'notes.group.knownPenalty': (
    <>
      重點台詞：<strong>這些懲罰是精確的，不是近似的</strong>。傳統罰函數法只能逼近，這裡只要 P 夠大，QUBO 的最優解就<em>等於</em>原問題的最優解；可以在「解空間」分頁把最優解代回原始約束，看到全部滿足。
      <br />
      <br />
      Max 2-SAT 是這一組最好的展示品：拖 P 沒有用（它沒有 P），但它示範了「QUBO 大小只由變數數決定，與子句數無關」。現場多加幾個子句給觀眾看維度不變。
    </>
  ),
  'notes.group.general': (
    <>
      這一組是論文的技術核心。三個動作要講清楚：
      <br />
      1. 不等式 → 加 slack 變數變成等式（<code>≤</code> 加、<code>≥</code> 減）
      <br />
      2. slack 變數 → 二進位展開成幾個 0/1 位元
      <br />
      3. 等式 <code>Ax = b</code> → 懲罰 <code>P(Ax−b)ᵀ(Ax−b)</code>
      <br />
      <br />
      §5.2 Graph Colouring 是唯一同時用到 #1 和 #2 的案例，也是規模儀表最容易撞牆的案例（變數數 = 節點數 × 顏色數）。§5.4 QAP 則是 n² 成長。這兩個現場拉一下就會撞到組合爆炸。
    </>
  ),

  'notes.case.number-partitioning': (
    <>
      論文是從 <code>diff²</code> 手推 Q 的；本站改用「Transformation #1 套在平衡等式{' '}
      <code>Σsⱼxⱼ = 83</code>、P = 1」推導，得到<strong>一模一樣</strong>的 Q。這說明論文的「自然形式」其實只是通用配方的一個特例。
      <br />
      <br />
      加性常數是 83² = 6,889，所以完美平分時 xᵀQx = −6889、原始目標值 = 0。在「解空間」分頁可以看到這一點。試著改一組加不起來的數字，看差額怎麼變。
      <br />
      <br />
      「硬體嵌入」分頁很適合和 Max-Cut 對照：這裡的 Q 是<strong>全連通</strong>的（8 個數字就是 K₈），上晶片要 12 顆 qubit、有 chain；Max-Cut 的 Q
      只有原圖的邊，每個變數一顆 qubit 就夠。現場把數字加到 20 個，本站的啟發式就找不到了，可以順便說明這不代表硬體放不下。
    </>
  ),
  'notes.case.max-cut': (
    <>
      關鍵恆等式：<code>xᵢ + xⱼ − 2xᵢxⱼ</code> 當兩端不同集合時等於 1，同集合時等於 0。所以把它對所有邊加總，就直接是割集大小，不需要任何約束。
      <br />
      <br />
      注意最優解一定<strong>至少有兩個</strong>（degeneracy ≥ 2）：把整個 x 取補集，割集完全一樣。「解空間」分頁的簡併度會顯示這件事，這是窮舉才看得到的現象。
      <br />
      <br />
      「硬體嵌入」分頁：Max-Cut 的 Q 耦合就是原圖的邊，所以每個變數剛好一顆 qubit、完全不需要 chain。拿來對照數字分割（全連通，需要 chain）最清楚。
    </>
  ),
  'notes.case.min-vertex-cover': (
    <>
      對角線是 <code>1 − P·deg(j)</code>，所以度數 3 的節點是 −23、度數 2 的是 −15
      （P = 8）。這個結構在 Q 矩陣熱圖上一眼就能看出來。
      <br />
      <br />
      這一頁最值得玩的是 P 滑桿：把 P 調到 1 以下，最優解會變成「什麼都不選」，因為省下的成本大過懲罰，可行性瞬間崩掉。這就是論文 p.13 說的「P 太小會
      jeopardize the search for feasible solutions」。
    </>
  ),
  'notes.case.set-packing': (
    <>
      這是最大化問題，所以懲罰是<strong>減</strong>的，非對角線因此是負數（−P/2 = −3）。如果觀眾問「為什麼 §4.1 的懲罰是正的、這裡是負的」，就是這個原因。
    </>
  ),
  'notes.case.max-independent-set': (
    <>
      這一題論文沒有算例，是本站補的延伸案例。可以強調兩件事：第一，配方和 §4.2 Set Packing 完全相同（p.10 表格第 1 列，<code>xᵢ + xⱼ ≤ 1 → P·xᵢxⱼ</code>），只是約束來自圖的邊；第二，它和 §4.1 是一體兩面，獨立集的補集就是頂點覆蓋，所以答案 2 = 5 − 3 可以直接由 §4.1 推得。
      <br />
      <br />
      值得現場示範：把 P 拉到 1，最優值仍然是 2，但簡併度從 4 變成 7，多出來的 3 個是同時選了某條邊兩端的不可行解。收益和懲罰剛好打平，所以 P 必須<strong>嚴格大於</strong> 1。
    </>
  ),
  'notes.case.max-clique': (
    <>
      論文 p.10 提到 Pardalos &amp; Xue 在 maximum clique 上用的就是 <code>P·xᵢxⱼ</code> 這個懲罰。和最大獨立集只差在約束取自哪裡：獨立集取「有邊」的點對，團取「沒有邊」的點對，也就是補圖上的獨立集。把兩頁的 Q 矩陣並排比較，非零的非對角格剛好互補。
      <br />
      <br />
      這張圖唯一的三角形是 3–4–5，最優值 3、唯一解。問題檢視裡，被選入卻不相鄰的點對會畫成紅色虛線，拖 P 滑桿時可以看到它們出現。
    </>
  ),
  'notes.case.max-diversity': (
    <>
      目標函數本來就是二次的（<code>Σ dᵢⱼxᵢxⱼ</code>），唯一的約束是「恰好選 4 個」，用 Transformation #1 處理。最優解是 {'{'}7, 10, 31, 42{'}'}，總距離 126：直線上的點，兩個端點必選，中間兩個要拉得最開。
      <br />
      <br />
      P 的取法值得講：本站取 200，理由是多選一個數字最多多賺它的距離列和（最大是 42 的 170），所以 P &gt; 170 一定夠。但實測 P = 60 就不會出錯，充分界和實際門檻差了三倍多，這就是論文 p.13 說的 Goldilocks 區間很寬。把滑桿往下拉，可以找到它失效的地方。
    </>
  ),
  'notes.case.discrete-tomography': (
    <>
      沒有目標函數，六條投影等式都用 Transformation #1，結構和 §5.2 的節點指派方程一樣，任何正的 P 都可以。
      <br />
      <br />
      重點在解空間分頁：有 <strong>5 張</strong>影像的投影完全相同，「X」形只是其中之一。只給列和與行和，影像無法唯一決定，這正是真實的斷層重建要再加其他方向的投影或先驗知識的原因。
    </>
  ),
  'notes.case.task-allocation': (
    <>
      通訊成本只在兩個任務分開時才付，寫成 <code>cᵢⱼ(xᵢ₁xⱼ₂ + xᵢ₂xⱼ₁)</code>，所以目標函數本身就是二次的；每個任務「恰好放一台」用 Transformation #1。
      <br />
      <br />
      資料刻意設計成兩股力量互相拉扯：全部放處理器 2 可以省掉所有通訊，總成本 16；但最優解是拆開（任務 1、3 在處理器 1，任務 2 在處理器 2），總成本 14。P 取 16 是充分界（拿掉一個任務最多省 15），實測 P = 8 就夠了。
    </>
  ),
  'notes.case.capital-budgeting': (
    <>
      這是 §5.5 去掉二次項、再多一個預算期。只有第一期時最好是選 2、3、4（價值 11），第二期把它排除，最優解變成 2、4（價值 9）。
      <br />
      <br />
      值得指出：slack 上界這裡用整列範圍（16、13），不能沿用 §5.5 的 3，因為最優解第一期剩下 7，上界 3 表示不了。§5.3／§5.5 的 slack 上界是針對那一題的判斷，換一題就要重新判斷。
    </>
  ),
  'notes.case.multiple-knapsack': (
    <>
      這題和 §5.2 一樣同時用兩種變換：「每件最多放一個背包」是 p.10 表格第 1 列（Transformation #2，不需 slack），容量是 ≤ 加 slack（Transformation #1）。
      <br />
      <br />
      總重 22 超過總容量 18，一定有東西放不進去。最優價值 11，有 4 種不同裝法，解空間分頁會顯示這個簡併度。
    </>
  ),
  'notes.case.p-median': (
    <>
      第一次用到 p.10 表格第 4 列：「客戶只能由開了的據點服務」<code>xᵢⱼ ≤ yⱼ</code> → <code>P(xᵢⱼ − xᵢⱼyⱼ)</code>。一題裡同時有三種約束：恰好服務一次、恰好開 2 個（都是 Transformation #1），以及 12 條蘊含式。
      <br />
      <br />
      實作細節：蘊含式配方依變數編號取「前件 ≤ 後件」，所以所有 x 必須排在 y 前面。最優解開最外側的據點 1、3，總距離 5。
    </>
  ),
  'notes.case.warehouse-location': (
    <>
      和 P-中位數只差兩處：拿掉「恰好開 2 個」，在 y 上加開設成本。便宜的中間據點改變了答案：最優解開據點 1、2，總成本 14；P-中位數在同一組點上開的是 1、3。兩頁並排很好講「模型差一條約束，答案就不同」。
    </>
  ),
  'notes.case.linear-ordering': (
    <>
      每個三元組 i &lt; j &lt; k 有兩條約束 <code>0 ≤ xᵢⱼ + xⱼₖ − xᵢₖ ≤ 1</code>，確保不出現循環。slack 上界取 1，低於整列範圍 2：只要另一條成立，這條的 slack 不會超過 1。這和 §5.3 論文自己挑 slack 上界是同一種判斷，約束窮舉確認沒有因此漏掉任何合法排名。
      <br />
      <br />
      目標是淨一致數；問題檢視補回常數 12，顯示完整的一致數。最佳排名 4 › 1 › 2 › 3，一致 21／30。
    </>
  ),
  'notes.case.clique-partitioning': (
    <>
      這是論文 §7 第 3 點的點變數置換：標準模型每條邊一個變數，改成「i 與 j 同組」= <code>Σₖ xᵢₖxⱼₖ</code>，目標變成二次、約束只剩每個節點恰好一組。附錄頁也有這個置換的說明。
      <br />
      <br />
      最優是 {'{'}1, 2{'}'} {'{'}3, 4{'}'}，總權重 7，但解空間顯示 12 個最優解：組的標籤可以互換（4 × 3 種命名）。可以藉此講對稱性為什麼讓 QUBO 的解空間變大。
    </>
  ),
  'notes.case.max-3-sat': (
    <>
      這一題需要論文 §7 第 4 點的<strong>高次項降階</strong>。三個文字的子句，懲罰是三個「為假」指示函數的乘積，所以是三次的。八條子句加總後只剩兩個三次項 <code>−x₁x₂x₃</code>、<code>−x₁x₂x₄</code>，兩個都含 <code>x₁x₂</code>，所以只要一個輔助變數 x₅ 取代它，再加上 Rosenberg 懲罰 <code>P(x₁x₂ − 2x₁x₅ − 2x₂x₅ + 3x₅)</code>。
      <br />
      <br />
      和 Max 2-SAT 對照：那裡 QUBO 的大小只看變數數，這裡多了輔助變數。現場可以把 P 拉到 1：最優值仍是 0，但會出現 x₅ ≠ x₁x₂ 的平手解；拉到 0 連最優值都錯了。
    </>
  ),
  'notes.case.constraint-satisfaction': (
    <>
      每組三人「不能全在同一隊」寫成兩條子句 <code>(a ∨ b ∨ c)</code> 與 <code>(¬a ∨ ¬b ∨ ¬c)</code>。各自都是三次，但加起來三次項<strong>剛好抵消</strong>，整組約束是二次的 <code>1 − a − b − c + ab + ac + bc</code>。
      <br />
      <br />
      所以這題一個輔助變數都不需要，和 Max 3-SAT 正好對照：引擎先把所有子句加總、再降階，抵消掉的項就不必付出額外變數的代價。8 種分隊方式都滿足所有約束，交換隊名算兩種，所以本質上是 4 種。
    </>
  ),
  'notes.case.graph-partitioning': (
    <>
      這頁最好和 §3.2 Max-Cut 並排講：同一張圖、同一個割邊計數式，只是一個要最多、一個要最少。不加約束的話，「最少割邊」的答案是全部放同一組（割 0 條），所以必須加上「第 1 組恰好 2 個節點」，用 Transformation #1。
      <br />
      <br />
      最優是 {'{'}1, 2{'}'} 對三角形 {'{'}3, 4, 5{'}'}，只割 2 條邊，唯一。五個節點分不成兩個一樣大的組，所以這裡是「盡量平衡」的 2／3 分法。
    </>
  ),
  'notes.case.portfolio': (
    <>
      目標是「風險 − 報酬」：風險是持有資產的共變異數總和 <code>xᵀΣx</code>，本來就是二次的；唯一的約束是「恰好持有 3 檔」。報酬最高的組合（2、4、5）風險太大，最優是 3、4、5。
      <br />
      <br />
      值得一提的設計細節：不加約束時最好只持有 3、5 兩檔，所以「恰好 3 檔」這條約束真的改變了答案，P 太小（低於 4）就會選錯。本站初稿要求持有 2 檔，結果無約束的最優解剛好也是 2 檔，P = 0 也能過，等於沒有示範到懲罰，所以改成 3 檔。
    </>
  ),
  'notes.case.max-matching': (
    <>
      這題的變數是<strong>邊</strong>而不是點：每條邊一個變數，被選中表示配成一對。每個節點最多接一條被選的邊，就是 p.10 表格第 1 列（兩條邊的節點）和第 5 列（三條邊的節點），也就是 §4.2 Set Packing 的同一個懲罰。
      <br />
      <br />
      最優是 {'{'}1–2, 3–4{'}'}，權重 4 + 5 = 9。因為 3、4、5 構成三角形，五個節點不可能全部配對。
    </>
  ),
  'notes.case.community-detection': (
    <>
      和 Negre 等的寫法相同：k 個社群、每個節點恰好屬於一個（Transformation #1），最大化模組度。模組度本身是分數，所以目標乘上 (2m)² 讓係數全是整數；問題檢視再換算回真正的 Q。
      <br />
      <br />
      兩個三角形用一條橋連起來，是社群偵測的教科書例子；最優就是兩個三角形，Q = 5/14 ≈ 0.357。解空間顯示 2 個最優解，因為兩個社群的標籤可以互換。可以和「團分割」對照：那題的組數不固定、權重是自己給的，這題的權重來自圖的結構。
    </>
  ),
  'notes.case.shortest-path': (
    <>
      這是最短路徑的標準流量寫法，<strong>不是</strong>論文引用的 Pakin 那篇的迷宮編碼。每條有向弧一個變數；每個節點「流出 − 流入」在起點是 +1、終點是 −1、其他是 0，各是一條等式約束。
      <br />
      <br />
      最短路徑 S→A→B→C→T 長 6，而且弧數最多；只有兩段的 S→B→T 反而最長（10）。把 P 拉低（低於 4）會看到路徑斷掉，問題檢視會標出哪些節點流量不平衡。
    </>
  ),
  'notes.case.travelling-salesman': (
    <>
      論文引用的是車輛路徑問題；這頁做的是它的單車、無容量核心，也就是旅行推銷員問題。被引用的研究就是在這個結構上再加車輛數與容量。
      <br />
      <br />
      變數是「城市 × 順序」。城市 1 固定排第一，消掉每條路線的 4 種旋轉，變數從 16 個降到 9 個，且不排除任何路線。最短路線 1→2→4→3→1 長 18；解空間有 2 個最優解，因為同一條路線正著走和反著走一樣長。
    </>
  ),
  'notes.case.traffic-flow': (
    <>
      這頁照原論文（Neukart 等，Volkswagen 與 D-Wave 的北京計程車研究）的 QUBO：每輛車三條候選路線，擁塞是每個路段「車數的平方」加總，每輛車恰好一條路線。平方讓同一路段擠越多車、成本上升越快。
      <br />
      <br />
      λ 也照原論文的規則：單一車輛出現在路段成本裡的最多次數，這裡是 7。三輛車原本都走 c、d 路段，擁塞 19；最優解把車 1 改走路線 2、車 3 改走路線 3，每個路段只剩一輛車，擁塞 5。
    </>
  ),
  'notes.case.max-2-sat': (
    <>
      本頁的主秀：<strong>QUBO 的維度只由變數數決定，與子句數無關</strong>。現場請按幾次「新增子句」，讓大家看 Q 還是 4×4。論文 p.17 說 200 變數、
      30,000 子句仍然只是 200 變數的 QUBO。
      <br />
      <br />
      這也是唯一 Q 出現 ±½ 的案例：<code>−x₂x₃</code> 這種單一二次項在對稱形式下要對半拆到兩格。切到「上三角形式」就會變回整數。
    </>
  ),
  'notes.case.set-partitioning': (
    <>
      論文 Remark 2 給了一個捷徑：<code>qᵢᵢ = cᵢ − P·kᵢ</code>、<code>qᵢⱼ = P·rᵢⱼ</code>，其中 kⱼ 是「包含 xⱼ 的約束數」、rᵢⱼ 是「同時包含兩者的約束數」。可以現場抽一格驗算：x₃ 出現在 3 條約束，所以 q₃₃ = 1 − 30 = −29。
      <br />
      <br />
      這個捷徑跟通用的 Transformation #1 完全等價；熱圖 hover 顯示的來源分解就是在展示這件事。
    </>
  ),
  'notes.case.graph-coloring': (
    <>
      唯一同時用到兩種變換的案例：節點指派用 #1，相鄰限制用 #2。
      Q 的<strong>區塊對角結構</strong>（五個 3×3 區塊）在熱圖上非常明顯，論文 p.23 特別說「Looking for patterns is often a useful de-bugging tool」。
      <br />
      <br />
      規模儀表在這一頁最有戲：變數數 = 節點數 × 顏色數。6 節點 4 色 = 24 已經到窮舉邊緣，7 節點 4 色 = 28 就得改啟發式。現場拉一下就撞牆。
      <br />
      <br />
      這題沒有目標函數，只是找可行解，所以任何正的 P 都行。
    </>
  ),
  'notes.case.general-01': (
    <>
      三種約束一次到齊（≤、=、≥），也是 slack 變數展開最完整的示範。
      <br />
      <br />
      重點提醒：slack 上界 3 和 6 是<strong>論文作者自己判斷的</strong>，不是推導出來的，這兩條約束理論上最大可到 7 和 11。本站在「建模推導」分頁會把兩個數字並列顯示。這是實務建模裡很典型的取捨：上界估太鬆會多花 bit，估太緊會切掉可行解。
      <br />
      <br />
      另外注意最優解裡第三條約束是鬆的（11 ≥ 5），surplus 用掉 6，正好是上界。
    </>
  ),
  'notes.case.qap': (
    <>
      n 個設施要 n² 個變數，這是 QAP 難用的根本原因。3×3 已經 9 個變數，
      5×5 就 25 個（窮舉邊緣），6×6 是 36（只能啟發式）。
      <br />
      <br />
      ⚠️ 一個值得講的發現：論文 p.28 印出的<strong>目標函數式子</strong>與 p.29 印出的
      <strong> Q 矩陣</strong>不一致：式子少列了兩項（48x₅x₇、90x₆x₇），且 32x₂x₇ 被誤植為 60x₂x₇。本站是從流量／距離矩陣<strong>重新推導</strong>的，推出來的 Q 與論文印的 Q 完全相符，也重現了論文自己的答案 218。這正是「推導而非抄寫」這個架構決策的價值。
    </>
  ),
  'notes.case.quadratic-knapsack': (
    <>
      最大化 + 不等式約束 + slack 二進位展開，把前面所有技術綜合起來。
      slack 上界一樣是論文的判斷（取 3，理論上限是 16）。
      <br />
      <br />
      最優解 x = (1,0,1,1) 讓預算<strong>剛好用滿</strong> 8+5+3 = 16，所以兩個 slack
      位元都是 0。「問題檢視」分頁的預算條可以看到這一點。
    </>
  ),

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

  'verify.searched': '與原始模型窮舉一致',
  'verify.searchedBad': '與原始模型窮舉不符',
  'verify.searching': '比對中…',
  'verify.customSearch': '已修改（不再比對）',
  'verify.restoreSite': '回到本站預設資料',
  'verify.detail.customSearch':
    '您已修改輸入資料或 P，因此不再顯示與原始模型窮舉的比對。Q 矩陣仍然即時推導，解仍然精確。',
  'verify.detail.searched': (p: TParams) =>
    `論文沒有這題的算例，沒有可逐格對照的 Q。這裡比對的是：QUBO 窮舉最優值 ${p.qubo} 加上常數 ${p.constant}，等於直接窮舉原始約束模型（不經 QUBO）得到的最優值 ${p.best}。`,
  'verify.detail.searchedBad': (p: TParams) =>
    `QUBO 窮舉最優值 ${p.qubo} 加上常數 ${p.constant}，與直接窮舉原始約束模型的最優值 ${p.best} 不符，或最優解不可行。`,
  'source.mentioned': '論文僅點名',
  'source.mentioned.tooltip':
    '論文在此處提到這個問題，但沒有給實例、Q 矩陣或答案。本頁實例由本站選定。',
  'extended.banner.title': '延伸案例：論文只點名，沒有算例',
  'extended.banner.body': (p: TParams) => (
    <>
      論文在 {String(p.section)}（{String(p.pages)}）把這個問題列為 QUBO 能涵蓋的問題之一，但<strong>沒有給實例、沒有印出 Q 矩陣，也沒有答案</strong>。這一頁的實例是本站選的，所以頁面上的 Q 沒有原論文可以逐格對照。
      <br />
      <br />
      取而代之的檢查是：不經過 QUBO，直接窮舉原始約束模型（列出所有 0/1 組合、丟掉不可行的、用原始目標式計分），確認 QUBO 的最優值加上常數與它相同，而且 QUBO 的每個最優解都可行。這個比對和推導引擎沒有共用任何程式碼。
    </>
  ),

  'source.cited': '論文 §6 引用',
  'source.cited.tooltip':
    '論文只在 §6 引用他人研究時提到這個問題，不在 §1 的清單裡。本頁實例由本站選定。',
  'extended.banner.titleCited': '延伸案例：論文只在引用的研究中提到',
  'extended.banner.bodyCited': (p: TParams) => (
    <>
      這個問題不在論文 §1 的清單裡；論文只在 {String(p.section)}（{String(p.pages)}）引用其他人的研究時提到它，<strong>沒有給實例、沒有印出 Q 矩陣，也沒有答案</strong>。這一頁的模型與實例都是本站依標準寫法選的，所以頁面上的 Q 沒有原論文可以逐格對照。
      <br />
      <br />
      取而代之的檢查和其他延伸案例相同：不經過 QUBO，直接窮舉原始約束模型，確認 QUBO 的最優值加上常數與它相同，而且 QUBO 的每個最優解都可行。
    </>
  ),

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
  'case.tab.embedding': '硬體嵌入',

  'formulation.original': '原始模型',
  'formulation.slack': 'Slack 變數展開',
  'formulation.penalty': '懲罰項',
  'formulation.reduction': '高次項降階（§7 第 4 點）',
  'formulation.reductionNote': (p: TParams) =>
    `每個輔助變數取代兩個變數的乘積，懲罰在兩者相等時為 0。它取代的項 |係數| 總和最大為 ${p.load}，P 必須大於它才保證最優解精確（目前 P = ${p.P}）。`,
  'formulation.result': '結果',
  'formulation.resultBody': (p: TParams) =>
    `${p.n} 個變數、加性常數 ${p.constant}。原始目標值 = xᵀQx + 常數。`,
  'formulation.method.transform1': 'Transformation #1',
  'formulation.method.transform2': 'Transformation #2',
  'formulation.method.atLeastOne': '已知懲罰（p.10 表格第 2 列）',
  'formulation.method.exactlyOne2': '已知懲罰（p.10 表格第 3 列）',
  'formulation.method.implication': '已知懲罰（p.10 表格第 4 列）',
  'formulation.method.equal2': '已知懲罰（p.10 表格第 6 列）',
  'formulation.moreConstraints': (p: TParams) => `…另外 ${p.count} 條`,
  'formulation.morePenalties': (p: TParams) =>
    `…另外 ${p.count} 個懲罰項（結構相同，只是換了變數）`,
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
  'solutions.moreRows': (p: TParams) =>
    `…另外 ${p.count} 條（全部已檢查，只顯示前 ${p.shown} 條）`,
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
  'scale.varsWithAux': (p: TParams) => `${p.base} 個原始變數 ＋ ${p.aux} 個輔助變數 ＝ ${p.n} 變數`,
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
  'penalty.siteValue': (p: TParams) => `本站取 P = ${p.value}（論文未給）`,
  'penalty.resetSite': '回到本站預設值',
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
  // Practical ceilings, keyed by sampler id (see lib/python/samplers.ts).
  'sampler.limit.exact': '≤ ~20 變數（窮舉全部 2ⁿ 組合，回傳保證最優解）',
  'sampler.limit.tabu': '數千變數（啟發式，回傳目前找到最好的解）',
  'sampler.limit.sa': '數千變數（啟發式）',
  'sampler.limit.mock': '與 QPU 相同的 minor-embedding 限制；退火本身是模擬的，不連線 D-Wave',
  'sampler.limit.qpu': '受 minor-embedding 限制，全連通問題約數百個邏輯變數',
  'sampler.limit.hybrid': '數萬變數（古典／量子混合）',
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
  'overview.extendedChip': (p: TParams) => `＋ ${p.n} 個延伸案例（論文只點名或引用）`,
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
  // Platform rows: proper nouns stay put, everything descriptive is a key.
  'overview.platform.name.qaoa': 'QAOA（閘模型）',
  'overview.platform.name.tabu': 'Tabu search（古典）',
  'overview.platform.name.exhaustive': '窮舉（古典）',
  'overview.topology.asic': '全連通 (ASIC)',
  'overview.topology.varies': '依硬體而異',
  'overview.scale.advantage2': '全連通約數百個邏輯變數',
  'overview.scale.digital': '1,024 變數（Aramon et al. 2019）',
  'overview.scale.qaoa': '目前僅小規模 MaxCut / MIS',
  'overview.scale.tabu': '數千變數',
  'overview.scale.exhaustive': '≤ 24 變數，保證最優',
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
      每個案例頁的「硬體嵌入」分頁，則是把該案例推導出來的 Q 真的放上 Pegasus 晶片。
    </>
  ),

  // ── hardware embedding tab ────────────────────────────────────────────
  'embed.intro': (
    <>
      Q 推導出來之後，還要放上晶片才能在 D-Wave 上跑。晶片上一顆 qubit 只連到少數幾個鄰居，所以每個變數要展開成一條{' '}
      <strong>chain</strong>（一組相連的 qubit），讓 Q 裡每一對有耦合的變數，都落在兩條 chain 之間一條真實的 coupler 上。左邊是這個 QUBO
      需要的耦合（Source graph），右邊是 D-Wave Advantage 的 <strong>Pegasus</strong> 拓樸上的一個片段，以及每條 chain 的位置。
    </>
  ),
  'embed.size.label': '晶片片段',
  'embed.size.auto': '自動',
  'embed.reseed': '換一個 seed',
  'embed.reseed.tooltip': '用另一個亂數種子重新嵌入。嵌入不是唯一的：同一個 QUBO 可以有很多種放法，chain 的長度也會不同。',
  'embed.seed': (p: TParams) => `第 ${p.seed} 個 seed`,
  'embed.hardwareOnly': '只看硬體（Target graph）',
  'embed.stat.vars': (p: TParams) => `邏輯變數 ${p.n}`,
  'embed.stat.edges': (p: TParams) => `需要的耦合 ${p.edges} 對（密度 ${p.density}%）`,
  'embed.stat.fragment': (p: TParams) => `Pegasus P(${p.m})，${p.qubits} 顆 qubit`,
  'embed.stat.used': (p: TParams) => `用掉 ${p.qubits} 顆 qubit`,
  'embed.stat.maxChain': (p: TParams) => `最長 chain ${p.len}`,
  'embed.stat.meanChain': (p: TParams) => `平均 chain ${p.len}`,
  'embed.valid': '檢查器：合法嵌入',
  'embed.invalid': '檢查器：嵌入不合法',
  'embed.valid.tooltip':
    '由獨立的檢查器確認：每條 chain 都相連、彼此不共用 qubit，而且每一對需要的耦合都有 coupler 對應。檢查器與搜尋程式不共用任何程式碼。',
  'embed.running': (p: TParams) => (p.m ? `正在嘗試 Pegasus P(${p.m})…` : '準備中…'),
  'embed.failed': (p: TParams) => (
    <>
      本站的簡化啟發式在 P({String(p.m)}) 以內<strong>找不到</strong>嵌入。這<strong>不代表硬體放不下</strong>：Ocean 的 minorminer
      比本站的版本強得多，例如 P(3) 上它放得下 24 個變數的全連通圖，本站只到 14 個。試試換一個 seed，或把輸入改小一點。
    </>
  ),
  'embed.tooLarge': (p: TParams) =>
    `這個 QUBO 有 ${p.n} 個變數，超過本頁示範的上限，不嘗試嵌入。畫面上同時有這麼多條 chain 也已經看不清楚。`,
  'embed.error': (p: TParams) => `嵌入時發生錯誤：${p.message}`,
  'embed.source.title': '這個 QUBO 需要的耦合（Source graph）',
  'embed.target.pending': 'Pegasus 片段',
  'embed.target.title': (p: TParams) =>
    `Pegasus P(${p.m})（Target graph）：${p.qubits} 顆 qubit、${p.couplers} 個 coupler`,
  'embed.embedding.title': (p: TParams) => `嵌入到 Pegasus P(${p.m}) 上（Embedding）`,
  'embed.var.title': (p: TParams) => `${p.name}：chain 長 ${p.len}`,
  'embed.qubit.used': (p: TParams) => `qubit ${p.q} · 屬於 ${p.name} 的 chain`,
  'embed.qubit.free': (p: TParams) => `qubit ${p.q} · 未使用`,
  'embed.legend': (
    <>
      <strong>讀圖：</strong>每條線段是一顆 qubit。同色的粗線段是同一條 chain，同色的接點是 chain 內部的 coupler；D-Wave 會用很強的耦合（chain strength）把它們綁成同一個變數，讀出時若同一條
      chain 的 qubit 值不一致，叫 <strong>chain break</strong>。兩條不同色 chain 交會處的<strong>深灰接點</strong>，就是實際承載{' '}
      <Math>{'q_{ij}'}</Math> 的 coupler。淺灰線段是沒用到的 qubit。<strong>滑過或點選</strong>左邊的變數或右邊的 qubit，只留下它的 chain 和鄰居。
    </>
  ),
  'embed.legend.hardware': (
    <>
      <strong>這就是硬體本身</strong>：每條線段是一顆 qubit。兩條線段交叉的地方是一個 coupler；同一直線上首尾相接的兩顆、以及並排的一對之間，也各有一個 coupler。
      只有這些位置能設定耦合強度，所以任兩個變數要有耦合，它們的 chain 就必須在這張圖上相遇。
    </>
  ),
  'embed.note': (
    <>
      三件事要先說清楚：一、這是<strong>理想的 Pegasus 片段</strong>，不是任何一台真實機器的 working graph（真機會少掉製造時壞掉的 qubit，每台不同）。二、這是
      <strong>本站的簡化啟發式</strong>，不是最佳嵌入，也不是 <code>EmbeddingComposite</code> 實際會算出的結果；在本站的案例上，它和 Ocean 的 minorminer
      結果幾乎相同（31 個案例有 29 個最長 chain 一樣）。三、<strong>論文沒有這部分</strong>，只在 p.33 提到嵌入本身就是很難的問題，這一頁是本站補充的。
    </>
  ),

  'overview.cost.title': 'QUBO 的真實成本',
  'overview.cost.lead': (
    <>
      上面整頁講的是 QUBO <strong>買到</strong>了什麼：一個統一介面、一整排可以替換的求解器。這一節講它<strong>賣掉</strong>了什麼。
      QUBO 是拿<strong>結構</strong>換<strong>通用性</strong>。原問題裡那些求解器可以利用的資訊（約束是哪幾條、哪些變數互斥、線性鬆弛長什麼樣），在壓進單一 Q 矩陣的過程中會被抹平。這不是實作細節，是這個標準型的本質代價；論文因為立場的關係，對這一面著墨不多。
    </>
  ),
  'overview.cost.item1.title': '約束被壓成懲罰項，結構跟著消失',
  'overview.cost.item1.body': (
    <>
      以本站的最小頂點覆蓋（§4.1）為例：原問題是「最小化 <Math>{'\\sum x_i'}</Math>」加上六條「每條邊至少被覆蓋一次」。目標是線性的、約束是稀疏的，這對 MIP 求解器是理想狀況：線性鬆弛很緊、分支定界剪得很乾淨。
      <br />
      轉成 QUBO 之後，六條約束被吸收進對角線（<Math>{'1'}</Math> 變成 <Math>{'-15'}</Math> 與 <Math>{'-23'}</Math>），多出一個 constant <Math>{'= 48'}</Math>，然後<strong>求解器再也看不到「這裡有六條約束」這件事</strong>。約束傳播、切平面、鬆弛界，全部用不上了，剩下一個沒有結構的二次式。
      <br />
      附帶的負擔是懲罰係數 <Math>{'P'}</Math> 要人工調校：太小，最優解會跑進不可行區（在案例頁把滑桿往左拉就看得到）；太大，目標函數被壓平，啟發式與硬體反而分不出好解與好解之間的差別。MIP 求解器沒有這個問題：約束就是約束。
    </>
  ),
  'overview.cost.item2.title': '係數的動態範圍會爆炸',
  'overview.cost.item2.body': (
    <>
      二次背包（§5.5）的原始資料全是個位數：價值 2–10、重量 3–8、容量 16。套用 Transformation #1、<Math>{'P = 10'}</Math> 之後，Q 的元素從 20 一路到 1922，常數是 <Math>{'-2560'}</Math>：最大與最小差了將近百倍，而原始問題根本沒有這種尺度。
      <br />
      純古典求解時這只是浮點數，無所謂。但退火硬體的耦合器<strong>精度有限</strong>（實際只有幾個位元，還帶類比雜訊），動態範圍一大，小係數就被量化進雜訊裡消失。也就是說：紙上等價的模型，跑到硬體上不一定等價。
    </>
  ),
  'overview.cost.item3.title': '不等式約束要拿 slack 變數來換',
  'overview.cost.item3.body': (
    <>
      QUBO 只有 0/1 變數，沒有「≤」這種東西。一條不等式約束必須先補上 slack 變數變成等式，才有辦法平方成懲罰項。
      <br />
      還是二次背包：4 個物品，加上容納 <Math>{'8x_1 + 6x_2 + 5x_3 + 3x_4 \\le 16'}</Math> 所需的 slack，<strong>Q 是 6×6 而不是 4×4</strong>，多了 50%。在真實硬體上這個代價還要再乘一次：每個邏輯變數都要展開成一條 chain，維度膨脹會平方級地反映到物理 qubit 需求上（見上一節）。
    </>
  ),
  'overview.cost.item4.title': '拿不到對偶界，不知道自己離最優有多遠',
  'overview.cost.item4.body': (
    <>
      這一項最常被忽略，實務上卻往往最痛。
      <br />
      MIP 求解器回報的是「目前這個解，保證在最優的 3.2% 以內」，那個 gap 是可以拿去跟人交代的。QUBO 的啟發式求解器（tabu、模擬退火、量子退火）<strong>只給您一個數字</strong>，不附帶任何界限。您不會知道手上的 <Math>{'-11'}</Math> 究竟是最優解，還是離最優還差 40%。
      <br />
      本站的案例看不出這個問題，因為它們小到可以用 <code>dimod.ExactSolver</code> 窮舉、保證最優。一旦超過約 20 個變數，這個保證就沒了，而且<strong>沒有東西可以取代它</strong>。
    </>
  ),
  'overview.cost.fit.title': 'QUBO 划算的訊號',
  'overview.cost.unfit.title': 'QUBO 不划算的訊號',
  'overview.cost.fit.1': '目標函數本來就是稠密二次的（變數兩兩互相影響、有搭配加成）',
  'overview.cost.fit.2': '約束很少，或根本沒有約束',
  'overview.cost.fit.3': '線性鬆弛很鬆，MIP 的分支定界剪不動',
  'overview.cost.fit.4': '需要跨平台可攜性：同一個 Q 要餵給數位退火機、GPU sampler、QPU',
  'overview.cost.unfit.1': '目標函數是線性的，複雜度全在約束上',
  'overview.cost.unfit.2': '約束多而稀疏、結構良好（指派、流量、排程這類）',
  'overview.cost.unfit.3': '線性鬆弛很緊，MIP 求解器幾秒就收斂',
  'overview.cost.unfit.4': '需要最優性證明，或可稽核的 gap',
  'overview.cost.verdict': (
    <>
      這個交易划不划算，取決於問題長什麼樣，跟量子硬體成不成熟關係不大：<strong>目標函數本來就是稠密二次、約束不多的問題，QUBO 是自然選擇；線性目標加大量結構化約束的問題，用 QUBO 是自找麻煩。</strong>
      <br />
      本站的 Hello World（§2）與二次背包的目標函數（§5.5）屬於前者，那就是 QUBO 天生的樣子。最小頂點覆蓋（§4.1）屬於後者：它出現在論文裡是為了示範懲罰法怎麼運作，不是因為 QUBO 是解它的好辦法。
      <br />
      帶著這個問句去讀後面的懲罰法頁面會更有收穫：<strong>這裡被吸收掉的約束，原本承載了多少求解器可以利用的資訊？</strong>
    </>
  ),

  // ── per-case scenarios ────────────────────────────────────────────────
  // The paper names its cases by section number and jumps straight to the
  // algebra. These give each one a concrete story first, so a reader meets
  // "what is this for" before "here is the Q matrix".
  'scenario.heading': '這題在解什麼',
  'scenario.xMeans': 'x 的意義',
  'scenario.uses': '真實應用',

  'case.number-partitioning.name': '數字分割',
  'case.number-partitioning.scenario': (
    <>
      一批貨要分裝上兩台卡車，八個箱子的重量是 25、7、13、31、42、17、21、10，總重 166。兩台車都要出，希望兩邊載重<strong>盡量接近</strong>：各 83 是最理想的情況。差額越小越好。
    </>
  ),
  'case.number-partitioning.xMeans': 'xⱼ = 1 表示第 j 個箱子放上 A 車，= 0 表示放上 B 車。',
  'case.number-partitioning.uses': '生產線工時平衡、伺服器負載分配、兩組人力或預算對分、電路分割',

  'case.max-cut.name': '最大割',
  'case.max-cut.scenario': (
    <>
      把一張網路的節點分成兩群，讓<strong>橫跨兩群</strong>的連線越多越好。換個角度看，這是在找這張網路最脆弱的那道切口：從哪裡剪下去，可以切斷最多連結。
    </>
  ),
  'case.max-cut.xMeans': 'xᵢ = 1 表示節點 i 分到 B 群，= 0 表示留在 A 群。',
  'case.max-cut.uses': '晶片佈線分層、影像的前景／背景分割、社群網路的對立分群、統計物理的自旋玻璃',

  'case.min-vertex-cover.name': '最小頂點覆蓋',
  'case.min-vertex-cover.scenario': (
    <>
      把節點看成路口、邊看成街道。要在路口裝監視器，讓<strong>每一條街都至少被一台拍到</strong>，問最少要裝幾台、裝在哪裡。這一題的圖有 5 個路口、6 條街。
    </>
  ),
  'case.min-vertex-cover.xMeans': 'xᵢ = 1 表示在路口 i 裝一台監視器。',
  'case.min-vertex-cover.uses': '感測器與監視器布點、網路關鍵節點防護、生物網路的關鍵蛋白質、軟體測試的最小覆蓋集',

  'case.set-packing.name': '最大集合裝填',
  'case.set-packing.scenario': (
    <>
      手上有四個候選方案，其中某幾組<strong>彼此衝突</strong>（搶同一個資源、佔同一個時段），衝突的不能同時選。在不衝突的前提下，盡量多選幾個。
    </>
  ),
  'case.set-packing.xMeans': 'xⱼ = 1 表示選用第 j 個方案。',
  'case.set-packing.uses': '會議室與設備預約、航班與機組的相容組合、廣告版位配置、無線通道分配',

  'case.max-independent-set.name': '最大獨立集',
  'case.max-independent-set.scenario': (
    <>
      把節點看成人、邊看成「彼此有衝突」。要挑一群人組隊，條件是<strong>隊裡任兩人都沒有衝突</strong>，問最多能挑幾個人。用的是和最小頂點覆蓋同一張 5 個節點、6 條邊的圖。
    </>
  ),
  'case.max-independent-set.xMeans': 'xᵢ = 1 表示選入節點 i。',
  'case.max-independent-set.uses': '無線通道與頻率分配、衝突圖上可同時進行的作業排程、錯誤更正碼的碼字選取、生物網路的模組分析',
  'case.max-independent-set.anchor': (
    <>
      這題的答案論文沒寫，但可以由論文印出的數字推得：一組點是獨立集，若且唯若其餘的點構成頂點覆蓋。本頁用的正是 §4.1 那張圖，§4.1 印出的最小頂點覆蓋是 3，所以最大獨立集必為 <strong>5 − 3 = 2</strong>。驗證腳本會斷言窮舉結果等於這個值。
    </>
  ),

  'case.max-clique.name': '最大團',
  'case.max-clique.scenario': (
    <>
      把節點看成人、邊看成「彼此認識」。要找出最大的一群人，<strong>群裡任兩人都互相認識</strong>。用的仍是那張 5 個節點、6 條邊的圖。它和最大獨立集正好相反：獨立集要任兩人都不相鄰，團要任兩人都相鄰。
    </>
  ),
  'case.max-clique.xMeans': 'xᵢ = 1 表示節點 i 在團裡。',
  'case.max-clique.uses': '社群網路的緊密小圈圈偵測、蛋白質交互作用網路的功能模組、金融交易網路的關聯帳戶、化學結構比對',

  'case.max-diversity.name': '最大分散度',
  'case.max-diversity.scenario': (
    <>
      從八個數字裡<strong>挑恰好四個</strong>，讓它們兩兩之間的差距加起來越大越好。數字沿用 §3.1 數字分割的那八個（25, 7, 13, 31, 42, 17, 21, 10），差距就是兩數相減的絕對值。
    </>
  ),
  'case.max-diversity.xMeans': 'xⱼ = 1 表示選入第 j 個數字。',
  'case.max-diversity.uses': '挑選彼此差異最大的候選人或專案組合、新藥篩選的多樣化化合物庫、店面選址避免互搶客源、推薦清單的多樣性',

  'case.discrete-tomography.name': '離散斷層重建',
  'case.discrete-tomography.scenario': (
    <>
      一張 3×3 的黑白影像看不到，只知道<strong>每一列、每一行各有幾個黑格</strong>（列和、行和都是 2, 1, 2）。要把影像還原回來。這是 CT 掃描的極簡版：從各方向的投影推回內部的樣子。
    </>
  ),
  'case.discrete-tomography.xMeans': '變數依列優先編號（x₁…x₉ 對應第 1 列由左到右，再第 2 列……）；= 1 表示該格是黑格。',
  'case.discrete-tomography.uses': '醫學與工業 CT 影像重建、電子顯微鏡的晶格結構重建、材料內部缺陷檢測',

  'case.task-allocation.name': '任務分配',
  'case.task-allocation.scenario': (
    <>
      三個運算任務要分給兩台處理器。每個任務在不同處理器上的<strong>執行成本</strong>不同；兩個任務若放在不同處理器，彼此之間還要付<strong>通訊成本</strong>。要決定每個任務放哪台，讓總成本最低。
    </>
  ),
  'case.task-allocation.xMeans': '變數依「任務 × 處理器」排列：x₁、x₂ 是任務 1 放處理器 1、2，x₃、x₄ 是任務 2，依此類推；= 1 表示放在那台。',
  'case.task-allocation.uses': '分散式系統與雲端的工作排程、多核心處理器的執行緒配置、微服務部署位置、邊緣運算的卸載決策',

  'case.capital-budgeting.name': '資本預算',
  'case.capital-budgeting.scenario': (
    <>
      四個投資專案各有價值，但每個專案在<strong>兩個預算期</strong>都要花錢，每一期都有上限。要選哪幾個專案，讓總價值最大、兩期都不超支？價值與第一期預算沿用 §5.5，第二期是本站加的。
    </>
  ),
  'case.capital-budgeting.xMeans': 'xⱼ = 1 表示投資第 j 個專案；後面的變數是兩期預算各自的 slack 位元。',
  'case.capital-budgeting.uses': '企業年度投資組合、政府公共建設排序、研發專案組合管理、IT 預算分配',

  'case.multiple-knapsack.name': '多背包',
  'case.multiple-knapsack.scenario': (
    <>
      四件物品、兩個背包（容量 10 和 8）。每件物品<strong>最多放進一個背包</strong>，每個背包不能超重，要讓裝進去的總價值最大。物品的重量與價值沿用 §5.5 的四個專案。
    </>
  ),
  'case.multiple-knapsack.xMeans': '變數依「物品 × 背包」排列：x₁、x₂ 是物品 1 放背包 1、2，依此類推；後面是兩個背包容量的 slack 位元。',
  'case.multiple-knapsack.uses': '貨櫃與車輛裝載、雲端虛擬機配置到多台主機、廣告預算分配到多個通路、生產工單分配到多條產線',

  'case.p-median.name': 'P-中位數選址',
  'case.p-median.scenario': (
    <>
      一條路上有四個客戶（位置 0, 2, 7, 10）和三個候選據點（位置 1, 5, 9）。要<strong>恰好開 2 個據點</strong>，每個客戶由開了的據點之一服務，讓所有客戶的總距離最短。
    </>
  ),
  'case.p-median.xMeans': '前 12 個變數依「客戶 × 據點」排列，= 1 表示該客戶由該據點服務；最後 3 個變數 y₁…y₃ = 1 表示該據點開設。',
  'case.p-median.uses': '物流中心與倉庫選址、消防隊與救護站配置、零售門市布點、資料分群（k-medoids）',

  'case.warehouse-location.name': '倉庫選址',
  'case.warehouse-location.scenario': (
    <>
      同樣四個客戶、三個候選據點，但這次<strong>每個據點有開設成本</strong>（4, 1, 6），而且不限開幾個。要在開設成本與運送距離之間取捨，讓總成本最低。
    </>
  ),
  'case.warehouse-location.xMeans': '與 P-中位數相同：前 12 個變數是「客戶 × 據點」的服務指派，最後 3 個 y₁…y₃ 是據點是否開設。',
  'case.warehouse-location.uses': '倉儲與配送中心規劃、工廠設廠決策、充電站與基地台布建、資料中心選址',

  'case.linear-ordering.name': '線性排序',
  'case.linear-ordering.scenario': (
    <>
      五位評審對四個項目兩兩比較，例如有 4 位認為 1 比 2 好。要排出一個<strong>總排名</strong>，讓排名和評審意見一致的次數最多。難處在於多數意見是循環的：多數認為 1 勝 2、2 勝 4，卻也認為 4 勝 1。
    </>
  ),
  'case.linear-ordering.xMeans': '每一對 i < j 一個變數（x₁₂, x₁₃, …, x₃₄），= 1 表示 i 排在 j 前面；後面是避免循環的 slack 位元。',
  'case.linear-ordering.uses': '排名聚合（多位評審或多個搜尋引擎的結果合併）、運動賽事排名、經濟學投入產出表的三角化、考古學的定年排序',

  'case.clique-partitioning.name': '團分割',
  'case.clique-partitioning.scenario': (
    <>
      四個節點兩兩之間有正負不等的相似度（正的希望同組、負的希望分開）。要把節點分成<strong>任意多組</strong>，讓同組內的相似度總和最大。
    </>
  ),
  'case.clique-partitioning.xMeans': '變數依「節點 × 組」排列（4 個節點、最多 4 組）：x₁…x₄ 是節點 1 放第 1–4 組，依此類推；= 1 表示放在那一組。',
  'case.clique-partitioning.uses': '相關性分群（correlation clustering）、社群偵測、生物資訊的基因分群、製造業的機器與零件分組',

  'case.max-3-sat.name': '最大 3-可滿足性',
  'case.max-3-sat.scenario': (
    <>
      和最大 2-可滿足性一樣，只是每個條件換成<strong>三選一以上成立</strong>：八個條件，每個由三個「是／否」陳述用「或」連起來，要讓最多條件成立。這組條件恰好有一種賦值可以全部滿足。
    </>
  ),
  'case.max-3-sat.xMeans': 'xᵢ = 1 表示第 i 個陳述為真；x₅ 是降階加入的輔助變數，代表 x₁x₂。',
  'case.max-3-sat.uses': '電路與硬體驗證、軟體模型檢查、排程與規劃問題的邏輯編碼、密碼分析',

  'case.constraint-satisfaction.name': '約束滿足問題（分隊）',
  'case.constraint-satisfaction.scenario': (
    <>
      六個人要分成兩隊，並列出了六組三人組：<strong>每一組三人都不能全在同一隊</strong>。找出所有可行的分法。這類「不能全部相同」的約束又叫集合分割或超圖二著色。
    </>
  ),
  'case.constraint-satisfaction.xMeans': 'xᵢ = 1 表示第 i 個人在第 2 隊，= 0 表示在第 1 隊。',
  'case.constraint-satisfaction.uses': '分組與排班的硬性規則、實驗設計的區組分配、電路分割、編碼理論中的平衡條件',

  'case.warehouse-location.provenance': (
    <>
      <strong>與原作者做法一致。</strong>論文 §1 這份清單出自 Kochenberger &amp; Glover（2006）。該文 §5.1 處理同一類問題時，把 y 取補數、再套 Transformation #2，得到 <code>P·xᵢⱼ(1 − yⱼ)</code>；展開就是本頁用的 p.10 第 4 列 <code>P(xᵢⱼ − xᵢⱼyⱼ)</code>，逐項相同，也同樣不需要新變數。該文的實例是隨機產生的，所以能比對的是做法，不是數字。
    </>
  ),
  'case.constraint-satisfaction.provenance': (
    <>
      <strong>這不是原作者用的寫法。</strong>論文 §1 這份清單出自 Kochenberger &amp; Glover（2006）。該文 §5.2 的 CSP 是線性等式組 <code>Ax = b</code>（係數只有 −1、0、1，右邊是 1 或 2），用 Transformation #1、P = 2 轉換。本頁的「不能全部相同」也是 CSP，但是另一種；選它是為了示範三次項互相抵消，這是 Max 3-SAT 單獨示範不了的。
    </>
  ),
  'case.graph-partitioning.name': '圖分割',
  'case.graph-partitioning.scenario': (
    <>
      把網路的節點分成兩組（2 個和 3 個），讓<strong>跨組的連線越少越好</strong>，例如把工作分給兩台機器，盡量減少機器之間的通訊。用的是 §3.2 Max-Cut 同一張圖：Max-Cut 要切最多，這題要切最少。
    </>
  ),
  'case.graph-partitioning.xMeans': 'xᵢ = 1 表示節點 i 分到第 1 組（第 1 組恰好 2 個節點）。',
  'case.graph-partitioning.uses': '平行計算的工作切分、積體電路的區塊劃分、社群網路分群、大型模擬的網格分割',

  'case.portfolio.name': '投資組合選擇',
  'case.portfolio.scenario': (
    <>
      五檔資產各有預期報酬，彼此的漲跌也互相關聯（共變異數）。要<strong>恰好挑 3 檔</strong>持有，讓「風險減去報酬」最小。報酬最高的組合不一定最好，因為它們可能一起漲跌、風險疊加。
    </>
  ),
  'case.portfolio.xMeans': 'xᵢ = 1 表示持有第 i 檔資產。',
  'case.portfolio.uses': '基金與退休金的資產配置、指數追蹤的成分股挑選、專案組合的風險分散',

  'case.max-matching.name': '最大權重匹配',
  'case.max-matching.scenario': (
    <>
      把節點看成人、邊看成「可以搭檔」，邊上的數字是搭檔的效益。每個人<strong>最多只能有一個搭檔</strong>，要讓配成的搭檔效益總和最大。用的是 §3.2 同一張圖，六條邊各有權重。
    </>
  ),
  'case.max-matching.xMeans': '每條邊一個變數（x₁₂, x₁₃, …, x₄₅），= 1 表示這兩個節點配成一對。',
  'case.max-matching.uses': '人員與任務配對、器官捐贈的交換配對、無線網路的連線排程、化學分子的鍵結結構',

  'case.community-detection.name': '社群偵測',
  'case.community-detection.scenario': (
    <>
      六個人的社交網路：兩個三人小圈圈，中間只靠一段關係連起來。要把人分成<strong>兩個社群</strong>，讓社群內部的連結比隨機情況下預期的多越好，這個指標叫模組度（modularity）。
    </>
  ),
  'case.community-detection.xMeans': '變數依「節點 × 社群」排列：x₁、x₂ 是節點 1 屬於社群 1、2，依此類推；= 1 表示屬於該社群。',
  'case.community-detection.uses': '社群網路分析、蛋白質交互作用網路的功能模組、引用網路的研究領域分群、電力網路的分區',

  'case.shortest-path.name': '最短路徑',
  'case.shortest-path.scenario': (
    <>
      一個小路網，從 S 到 T 有好幾條單向路可以走，每段路有長度。要找<strong>總長度最短</strong>的路線。
    </>
  ),
  'case.shortest-path.xMeans': '每條有向路段一個變數（S→A、S→B、…、C→T），= 1 表示路線經過這一段。',
  'case.shortest-path.uses': '導航與路徑規劃、網路封包路由、機器人與迷宮尋路、物流路線',

  'case.travelling-salesman.name': '旅行推銷員（車輛路徑）',
  'case.travelling-salesman.scenario': (
    <>
      一輛車從城市 1 出發，要<strong>每個城市都去一次再回到原點</strong>，總距離越短越好。這是車輛路徑問題只有一輛車、沒有載重限制時的核心。
    </>
  ),
  'case.travelling-salesman.xMeans': '變數依「城市 2–4 × 順序 2–4」排列（城市 1 固定第一）；= 1 表示該城市排在該順序。',
  'case.travelling-salesman.uses': '配送與收件路線、電路板鑽孔順序、巡檢排程、基因定序的片段排列',

  'case.traffic-flow.name': '交通流量最佳化',
  'case.traffic-flow.scenario': (
    <>
      三輛車各有三條候選路線，原本的路線全都擠在同一段路上。要幫每輛車<strong>各挑一條路線</strong>，讓所有路段的擁塞程度（每段路車數的平方）加總最小。這是 Volkswagen 與 D-Wave 用北京計程車資料做的研究的縮小版。
    </>
  ),
  'case.traffic-flow.xMeans': '變數依「車輛 × 路線」排列：x₁…x₃ 是車 1 的三條路線，依此類推；= 1 表示走該路線。',
  'case.traffic-flow.uses': '即時交通導流、車隊與共乘路線分配、網路流量的路徑分散、物流車隊排程',

  'case.max-2-sat.name': '最大 2-可滿足性',
  'case.max-2-sat.scenario': (
    <>
      有一堆「A 或 B」形式的條件，每條只牽涉兩個是非題。這些條件<strong>彼此打架</strong>，不可能全部滿足，所以目標退一步改成「盡量滿足最多條」。這一題是 4 個變數、12 條子句。
    </>
  ),
  'case.max-2-sat.xMeans': 'xᵢ = 1 表示第 i 個是非題答「是」。',
  'case.max-2-sat.uses': '電路與硬體驗證、排班的軟性偏好、電腦視覺的能量最小化、推薦系統的成對限制',

  'case.set-partitioning.name': '集合分割',
  'case.set-partitioning.scenario': (
    <>
      航空公司的經典題。有四個航段要飛，六張現成的「機組班表」可選，每張涵蓋其中幾個航段、各有成本。要求每個航段<strong>剛好</strong>被一張班表涵蓋一次（不能漏掉，也不能重複派人），並讓總成本最低。
    </>
  ),
  'case.set-partitioning.xMeans': 'xⱼ = 1 表示採用第 j 張班表。',
  'case.set-partitioning.uses': '航空機組排班、公車與貨運路線規劃、輪班表編制、選區劃分',

  'case.graph-coloring.name': '圖著色',
  'case.graph-coloring.scenario': (
    <>
      把節點看成課程、邊看成「這兩門課有共同學生」。有共同學生的兩門課<strong>不能排在同一個時段</strong>。給定 5 門課、7 組衝突、3 個時段，問排不排得出來。
      <br />
      注意這一題<strong>沒有目標函數</strong>，只是在找可行解：排得出來就贏了，沒有「排得更好」這回事。
    </>
  ),
  'case.graph-coloring.xMeans':
    'x 是「節點 × 顏色」的展開：第 (i, c) 格 = 1 表示節點 i 塗第 c 色，也就是排進第 c 個時段。',
  'case.graph-coloring.uses': '考試與課表排程、無線基地台頻率配置、編譯器的暫存器配置、球隊賽程安排',

  'case.general-01.name': '通用 0/1 線性規劃',
  'case.general-01.scenario': (
    <>
      這一題<strong>刻意沒有情境</strong>，它是一份示範模板：任何「0/1 變數 ＋ 線性目標 ＋ 線性約束」的問題，無論來自哪個領域，都可以照這個流程轉成 QUBO。
      <br />
      三種約束（<code>≤</code>、<code>=</code>、<code>≥</code>）在這裡一次到齊，slack 變數的二進位展開也示範得最完整。
    </>
  ),
  'case.general-01.xMeans':
    'x₁…x₅ 是五個沒有指定意義的是非決策；x₆ 之後是為了把不等式補成等式而加的 slack 位元。',
  'case.general-01.uses': '這是配方本身，不是應用；本組其他每一個案例都是它的特例',

  'case.qap.name': '二次指派問題',
  'case.qap.scenario': (
    <>
      工廠裡有幾個部門要配置到幾個廠房位置。部門之間每天有固定的<strong>搬運流量</strong>，位置之間有固定的<strong>距離</strong>，總成本是「流量 × 距離」的總和。要決定哪個部門放哪個位置，讓總搬運成本最低。
      <br />
      成本取決於<strong>兩個決策的組合</strong>（A 放這、B 放那，才談得上距離），所以它天生就是二次的，這正是 QUBO 的原生形狀。
    </>
  ),
  'case.qap.xMeans': 'x 是「設施 × 位置」的展開：第 (i, k) 格 = 1 表示設施 i 放在位置 k。',
  'case.qap.uses': '廠房與醫院科室佈局、鍵盤配列設計、晶片元件擺放、資料中心機櫃配置',

  'case.quadratic-knapsack.name': '二次背包',
  'case.quadratic-knapsack.scenario': (
    <>
      有四個專案可以投資，各自有預期收益，但<strong>兩兩之間還有綜效</strong>：某兩個一起做會額外加分。每個專案吃掉一部分預算，總預算 16。要選一組專案，讓「單獨收益 ＋ 搭配加成」最大。
      <br />
      所以不能只挑單價最高的：一個看似划算的專案，可能因為排擠掉更好的搭配而不值得做。
    </>
  ),
  'case.quadratic-knapsack.xMeans': 'xⱼ = 1 表示投資第 j 個專案；x₅、x₆ 是預算上限那條不等式的 slack 位元。',
  'case.quadratic-knapsack.uses': '專案組合與研發選題、投資組合配置、行銷方案搭售、設施選址的互補效應',

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
  'domain.independent.size': (p: TParams) => `獨立集大小 = ${p.size}`,
  'domain.independent.conflict': '兩端都被選入的邊',
  'domain.clique.size': (p: TParams) => `團的大小 = ${p.size}`,
  'domain.clique.missing': '選入但不相鄰的點對',
  'domain.diversity.total': (p: TParams) => `總距離 = ${p.value}`,
  'domain.diversity.count': (p: TParams) => `已選 ${p.count} / ${p.pick} 個`,
  'domain.tomo.match': '投影全部吻合',
  'domain.tomo.mismatch': '投影不吻合',
  'domain.tomo.note': '格子旁的數字是「目前／目標」。投影同樣吻合的其他影像，見「解空間」分頁的簡併度。',
  'domain.alloc.task': '任務',
  'domain.alloc.proc': '處理器',
  'domain.alloc.exec': (p: TParams) => `執行成本 ${p.value}`,
  'domain.alloc.comm': (p: TParams) => `通訊成本 ${p.value}`,
  'domain.alloc.total': (p: TParams) => `總成本 = ${p.value}`,
  'domain.alloc.note': '格子裡是該任務在該處理器上的執行成本；藍色是目前的分配。',
  'domain.budget.project': (p: TParams) => `專案 ${p.j}（價值 ${p.value}）`,
  'domain.budget.period': (p: TParams) => `第 ${p.k} 期預算`,
  'domain.mknap.sack': (p: TParams) => `背包 ${p.k}`,
  'domain.mknap.left': (p: TParams) => `沒裝進去：${p.items}`,
  'domain.mknap.note': '每列是一個背包，數字是「已用／容量」。',
  'domain.facility.distance': (p: TParams) => `總距離 ${p.value}`,
  'domain.facility.fixed': (p: TParams) => `開設成本 ${p.value}`,
  'domain.facility.total': (p: TParams) => `總成本 = ${p.value}`,
  'domain.facility.note': '方塊是候選據點（藍色＝開設），圓點是客戶；連線表示由哪個據點服務，紅色虛線表示服務據點沒開。',
  'domain.order.item': (p: TParams) => `項目 ${p.i}`,
  'domain.order.consistent': '排名沒有循環',
  'domain.order.cycle': '出現循環，不是合法排名',
  'domain.order.agreement': (p: TParams) => `與評審一致 ${p.value} / ${p.total}`,
  'domain.order.note': '一致數 = 模型的淨值 + 常數 12。約束模型沒有放常數的地方，這裡補回。',
  'domain.cluster.inside': (p: TParams) => `組內相似度總和 = ${p.value}`,
  'domain.cluster.invalid': '有節點不在恰好一組裡',
  'domain.cluster.note': (p: TParams) => `相似度：${p.weights}`,
  'domain.teams.team': (p: TParams) => `第 ${p.k} 隊`,
  'domain.teams.ok': '每組三人都有分在兩隊',
  'domain.teams.bad': (p: TParams) => `${p.count} 組三人全在同一隊`,
  'domain.matching.total': (p: TParams) => `匹配權重 = ${p.value}`,
  'domain.matching.clash': (p: TParams) => `${p.count} 個節點接了兩條以上的邊`,
  'domain.portfolio.asset': (p: TParams) => `資產 ${p.i}`,
  'domain.portfolio.return': '預期報酬',
  'domain.portfolio.variance': '自身變異數',
  'domain.portfolio.totalReturn': (p: TParams) => `總報酬 ${p.value}`,
  'domain.portfolio.totalRisk': (p: TParams) => `總風險 ${p.value}`,
  'domain.portfolio.objective': (p: TParams) => `風險 − 報酬 = ${p.value}`,
  'domain.portfolio.note': '總風險是持有資產之間所有共變異數的總和，包含兩兩之間的關聯，不只是各自的變異數。',
  'domain.community.q': (p: TParams) => `模組度 Q = ${p.q}（${p.num}/${p.den}）`,
  'domain.community.invalid': '有節點不屬於恰好一個社群',
  'domain.path.length': (p: TParams) => `路線長度 = ${p.value}`,
  'domain.path.broken': (p: TParams) => `${p.count} 個節點流量不平衡，不是一條完整路線`,
  'domain.tour.length': (p: TParams) => `路線長度 = ${p.value}`,
  'domain.tour.invalid': '不是合法的路線（有城市或順序沒被恰好用一次）',
  'domain.tour.note': '城市 1（橘色）固定為起點與終點。',
  'domain.traffic.route': (p: TParams) => `路線 ${p.r}`,
  'domain.traffic.car': (p: TParams) => `車 ${p.i}`,
  'domain.traffic.congestion': (p: TParams) => `擁塞 = Σ 車數² = ${p.value}`,
  'domain.traffic.note': '格子裡是路線經過的路段；下方是每個路段目前的車數，紅色表示超過一輛車。',
  'domain.assign.facility': '設施',
  'domain.assign.location': '位置',
  'domain.assign.cost': (p: TParams) => `加權流量成本 = ${p.cost}`,
  'domain.knapsack.budget': (p: TParams) => `預算 ${p.used} / ${p.total}`,
  'domain.knapsack.value': (p: TParams) => `總價值 = ${p.value}`,
  'domain.sat.count': (p: TParams) => `${p.sat} / ${p.total} 個子句被滿足`,
  'domain.sat.current': (p: TParams) =>
    `目前：${p.vars} 變數 · ${p.clauses} 子句 → QUBO 仍是 ${p.vars}×${p.vars}`,
  'domain.sat.auxNote': (p: TParams) => (
    <>
      和 Max 2-SAT 不同，這裡的 QUBO <strong>比原始變數多了 {String(p.aux)} 個輔助變數</strong>：三個文字的子句會產生三次項，必須用 §7 第 4 點的降階補上新變數。所以 §4.3 那句「QUBO 大小與子句數無關」在這裡不成立。
    </>
  ),
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
  'editor.sat.clauses': (p: TParams) => `${p.count} 子句`,
  'editor.hello.linear': '線性項係數',
  'editor.hello.quadratic': '二次項係數',
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
  'hello.noScenario.title': '這一題刻意沒有情境',
  'hello.noScenario.body': (
    <>
      後面每一個案例都會先給您一個故事（監視器裝在哪個路口、哪些專案值得投資），再進入代數。<strong>這一題沒有</strong>，而且是故意的。
      四個變數不代表任何東西，<Math>{'-11'}</Math> 也不是任何真實的成本或收益。論文 §2 用它回答的問題只有一個：<Math>{'x^tQx'}</Math> 這個式子是什麼意思。
      <br />
      所以如果您看完覺得「那這個答案能拿來做什麼」，正確答案是<strong>什麼都不能</strong>。它不是一個問題，是一個算式示範。等到 A / B / C 三組的案例，
      x 才會開始代表真實世界裡的決定。
    </>
  ),
  'hello.allStates': '全部 16 種組合',
  'hello.order.label': '欄位順序',
  'hello.order.asc': (p: TParams) => `x1→x${p.n}`,
  'hello.order.desc': (p: TParams) => `x${p.n}→x1`,
  'hello.order.hint':
    '列的順序固定不變，切換的只是欄位由左到右的方向。切成 x4→x1 之後，每一列讀起來就是一般的二進位遞增（0000、0001、0010 …）。',
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
  'appendix.higherOrder.tableNote': (
    <>
      綠色列是 <Math>{'y_1 = x_1x_2'}</Math> 的四種情形：懲罰值恰好全是
      0，其餘全是正數。所以最小化時最佳解一定會自己選對代換。
    </>
  ),
  'appendix.nodeVars.title': '邊變數 → 點變數的置換',
  'appendix.nodeVars.body': (
    <>
      論文 §7 第 3 點：像 clique partitioning 這種以「邊」為決策變數的模型，變數數會是 <Math>{'O(|V|^2)'}</Math>，動輒上百萬。把每個邊變數換成兩個點變數的乘積{' '}
      <Math>{'x_{ij} \\to x_i x_j'}</Math>，線性模型就變成二次模型，但變數數從邊數降到點數，通常小好幾個數量級。二次模型再用前面的方法轉成 QUBO 即可。
    </>
  ),
  'appendix.nodeVars.example':
    '舉例：一個 1,000 個節點的稠密圖，邊變數模型有約 500,000 個變數；換成點變數只剩 1,000 個。差了 500 倍，這正是論文 §7 第 3 點說的「a graph normally has a much smaller number of nodes than edges」。',
  'appendix.penaltyValue': '懲罰值',

  // ── misc ──────────────────────────────────────────────────────────────
  'case.notFound': (p: TParams) => `找不到案例：${p.id}`,
  'common.constraints': '約束',
  'common.min': '最小化',
  'common.max': '最大化',
} satisfies Record<string, TValue>;

export type Dictionary = typeof zh;
export type TKey = keyof Dictionary;
