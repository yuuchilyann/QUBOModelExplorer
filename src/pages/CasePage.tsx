import { Alert, Box, Chip, Stack, Typography } from '@mui/material';

import { findCase } from '../cases';
import { CaseScenario, useCaseName } from '../components/CaseScenario';
import { CaseWorkbench } from '../components/CaseWorkbench';
import { PresenterNotes } from '../components/PresenterNotes';

/** Case-specific talking points for whoever is presenting. */
const NOTES: Record<string, React.ReactNode> = {
  'number-partitioning': (
    <>
      論文是從 <code>diff²</code> 手推 Q 的；本站改用「Transformation #1 套在平衡等式{' '}
      <code>Σsⱼxⱼ = 83</code>、P = 1」推導，得到<strong>一模一樣</strong>的 Q。這說明論文的「自然形式」其實只是通用配方的一個特例。
      <br />
      <br />
      加性常數是 83² = 6,889，所以完美平分時 xᵀQx = −6889、原始目標值 = 0。在「解空間」分頁可以看到這一點。試著改一組加不起來的數字，看差額怎麼變。
    </>
  ),
  'max-cut': (
    <>
      關鍵恆等式：<code>xᵢ + xⱼ − 2xᵢxⱼ</code> 當兩端不同集合時等於 1，同集合時等於 0。所以把它對所有邊加總，就直接是割集大小，不需要任何約束。
      <br />
      <br />
      注意最優解一定<strong>至少有兩個</strong>（degeneracy ≥ 2）：把整個 x 取補集，割集完全一樣。「解空間」分頁的簡併度會顯示這件事，這是窮舉才看得到的現象。
    </>
  ),
  'min-vertex-cover': (
    <>
      對角線是 <code>1 − P·deg(j)</code>，所以度數 3 的節點是 −23、度數 2 的是 −15
      （P = 8）。這個結構在 Q 矩陣熱圖上一眼就能看出來。
      <br />
      <br />
      這一頁最值得玩的是 P 滑桿：把 P 調到 1 以下，最優解會變成「什麼都不選」，因為省下的成本大過懲罰，可行性瞬間崩掉。這就是論文 p.13 說的「P 太小會
      jeopardize the search for feasible solutions」。
    </>
  ),
  'set-packing': (
    <>
      這是最大化問題，所以懲罰是<strong>減</strong>的，非對角線因此是負數（−P/2 = −3）。如果觀眾問「為什麼 §4.1 的懲罰是正的、這裡是負的」，就是這個原因。
    </>
  ),
  'max-2-sat': (
    <>
      本頁的主秀：<strong>QUBO 的維度只由變數數決定，與子句數無關</strong>。現場請按幾次「新增子句」，讓大家看 Q 還是 4×4。論文 p.17 說 200 變數、
      30,000 子句仍然只是 200 變數的 QUBO。
      <br />
      <br />
      這也是唯一 Q 出現 ±½ 的案例：<code>−x₂x₃</code> 這種單一二次項在對稱形式下要對半拆到兩格。切到「上三角形式」就會變回整數。
    </>
  ),
  'set-partitioning': (
    <>
      論文 Remark 2 給了一個捷徑：<code>qᵢᵢ = cᵢ − P·kᵢ</code>、<code>qᵢⱼ = P·rᵢⱼ</code>，其中 kⱼ 是「包含 xⱼ 的約束數」、rᵢⱼ 是「同時包含兩者的約束數」。可以現場抽一格驗算：x₃ 出現在 3 條約束，所以 q₃₃ = 1 − 30 = −29。
      <br />
      <br />
      這個捷徑跟通用的 Transformation #1 完全等價；熱圖 hover 顯示的來源分解就是在展示這件事。
    </>
  ),
  'graph-coloring': (
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
  'general-01': (
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
  qap: (
    <>
      n 個設施要 n² 個變數，這是 QAP 難用的根本原因。3×3 已經 9 個變數，
      5×5 就 25 個（窮舉邊緣），6×6 是 36（只能啟發式）。
      <br />
      <br />
      ⚠️ 一個值得講的發現：論文 p.28 印出的<strong>目標函數式子</strong>與 p.29 印出的
      <strong> Q 矩陣</strong>不一致：式子少列了兩項（48x₅x₇、90x₆x₇），且 32x₂x₇ 被誤植為 60x₂x₇。本站是從流量／距離矩陣<strong>重新推導</strong>的，推出來的 Q 與論文印的 Q 完全相符，也重現了論文自己的答案 218。這正是「推導而非抄寫」這個架構決策的價值。
    </>
  ),
  'quadratic-knapsack': (
    <>
      最大化 + 不等式約束 + slack 二進位展開，把前面所有技術綜合起來。
      slack 上界一樣是論文的判斷（取 3，理論上限是 16）。
      <br />
      <br />
      最優解 x = (1,0,1,1) 讓預算<strong>剛好用滿</strong> 8+5+3 = 16，所以兩個 slack
      位元都是 0。「問題檢視」分頁的預算條可以看到這一點。
    </>
  ),
};

export function CasePage({ id }: { id: string }) {
  const qcase = findCase(id);
  // Hooks must run unconditionally, so this precedes the not-found return.
  const name = useCaseName(id);

  if (!qcase) {
    return <Alert severity="error">找不到案例：{id}</Alert>;
  }

  return (
    <Box>
      {/*
        The paper's own handle (§3.1) stays visible for cross-referencing, but
        the heading now leads with the problem's name rather than its slug.
      */}
      <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', mb: 0.5, flexWrap: 'wrap' }}>
        <Typography variant="h1">{name ?? qcase.id}</Typography>
        <Chip size="small" variant="outlined" label={qcase.section} />
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        {qcase.id}
      </Typography>

      <CaseScenario id={qcase.id} />
      <CaseWorkbench base={qcase} />
      {NOTES[qcase.id] && <PresenterNotes>{NOTES[qcase.id]}</PresenterNotes>}
    </Box>
  );
}
