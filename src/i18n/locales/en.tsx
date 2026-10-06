import { Math } from '../../components/Math';
import type { TParams } from '../types';
import type { Dictionary } from './zh';

/**
 * English — now COMPLETE.
 *
 * Typed as the full `Dictionary` rather than `Partial<Dictionary>`: every key
 * has been translated, so a key added to the canonical zh dictionary and not
 * here is a compile error instead of an English page quietly rendering Chinese.
 * `I18nProvider`'s zh fallback still stands for any future locale that ships
 * incrementally.
 *
 * Spelling follows the paper's own British forms (modelling, minimise,
 * colouring); section numbers, page references and figures are the paper's and
 * are never localised.
 */
export const en: Dictionary = {
  // ── metadata ──────────────────────────────────────────────────────────
  'meta.title': 'QUBO Model Explorer',
  'meta.description':
    'QUBO Model Explorer — an interactive companion to Glover, Kochenberger & Du on formulating QUBO models.',

  // ── app shell ─────────────────────────────────────────────────────────
  'app.title': 'QUBO Model Explorer',
  'app.subtitle': 'A Tutorial on Formulating and Using QUBO Models',
  'app.nav.overview': 'Overview',
  'app.nav.hello': 'Hello World',
  'app.nav.natural': 'A · Natural form',
  'app.nav.knownPenalty': 'B · Known penalties',
  'app.nav.general': 'C · General transformations',
  'app.nav.appendix': 'Appendix',
  'app.prev': 'Previous',
  'app.next': 'Next',
  'app.footer': (p: TParams) => `© ${p.year} QUBO Model Explorer`,

  // ── presenter notes ───────────────────────────────────────────────────
  'notes.title': 'Presenter notes',
  'notes.hint': 'Talking points and likely questions (collapsed by default, so the audience never sees them)',

  'notes.overview': (
    <>
      All this page has to land is one idea: <strong>QUBO is a bridge, not a destination</strong>. At one
      end is a long list of problems that look completely unrelated (the paper’s eleven worked ones, plus the extensions it only names), at the other four quite different kinds of
      hardware, and the <Math>{'x^tQx'}</Math> in between is the only shared language.
      <br />
      <br />
      Question one, always asked: “so does handing it to a quantum computer make it faster?” It does not.
      On p.34 the authors themselves report that their own classical solver, QUBO 2.0, beats mainstream
      quantum systems by three orders of magnitude. Every case here is small enough for
      the browser to enumerate in milliseconds.
      <br />
      <br />
      Question two: “why turn the problem into something NP-hard first?” Nothing became harder. QUBO was
      already NP-hard, and the reduction does not make the problem easier either. The motive is a{' '}
      <strong>single interface</strong>, not lower difficulty.
      <br />
      <br />
      For the minor-embedding figure, drag the slider from 3 to 10 on stage so the audience watches the
      physical requirement grow quadratically. It is the quickest answer to “why do 5,000 qubits only hold
      a few hundred variables”.
      <br />
      <br />
      The closing section, “what QUBO really costs”, is <strong>deliberate headwind</strong> that the paper
      itself does not provide. If there is time for only one item, take the 4th (no dual bound): it is the
      one that hurts most in practice and the one fewest people see coming. The 1st can wait for the vertex
      cover page in group B, where the P slider demonstrates live what happens when the penalty does not
      hurt enough.
    </>
  ),
  'notes.hello': (
    <>
      This is the only page on the site that walks through actually running the code; every later page
      assumes the audience has been through it.
      <br />
      <br />
      Suggested flow: read the three lessons (about two minutes), then edit one coefficient live so
      everyone sees all 16 rows on the right recompute — nothing else builds the “the Q matrix IS the
      objective function” intuition as quickly. Finish by pasting the code into Colab and running it for
      real, so the audience sees y = −11 appear in the output.
      <br />
      <br />
      Stress that <code>dimod.ExactSolver</code> <strong>needs no account and no API token</strong>. The
      code on every later page can be pasted in exactly the same way; none of it is pseudocode for show.
    </>
  ),
  'notes.appendix': (
    <>
      Both appendix techniques answer the same question: what to do when QUBO’s quadratic form is not
      enough.
      <br />
      <br />
      Read the Rosenberg truth table row by row on stage. The point is that the penalty is 0{' '}
      <strong>only when the substitution is correct</strong>, so <code>y₁ = x₁x₂</code> never has to be
      forced — the optimisation picks it out by itself. That is exactly the penalty philosophy of the paper
      as a whole.
      <br />
      <br />
      The node-variable substitution is the more powerful of the two in practice, because it changes the{' '}
      <strong>order of magnitude</strong> of the variable count rather than a constant factor. Every case
      up to here has sat at a few dozen variables; this is the move that squeezes a million-variable model
      back down to thousands.
    </>
  ),

  'notes.group.natural': (
    <>
      The intuition to build in this group is that the Q matrix is simply the objective function written
      another way. No penalties, no slack: the diagonal holds the linear terms, the off-diagonal holds half
      of each quadratic term, and that is all there is to it.
      <br />
      <br />
      Number Partitioning is worth an extra minute. The paper derives it by hand from <code>diff²</code>,
      while this site states it as “Transformation #1 applied to the balance equality{' '}
      <code>Σsⱼxⱼ = c/2</code>, with P = 1” — and the Q that comes out is identical. That proves the
      paper’s “natural form” and its “general recipe” are two descriptions of the same thing.
    </>
  ),
  'notes.group.knownPenalty': (
    <>
      The line that matters: <strong>these penalties are exact, not approximate</strong>. A classical
      penalty method can only approach the answer; here, as long as P is large enough, the optimum of the
      QUBO <em>equals</em> the optimum of the original problem. Open the “Solution space” tab and
      substitute the optimum back into the original constraints to see every one satisfied.
      <br />
      <br />
      Max 2-SAT is the best exhibit in the group: dragging P achieves nothing (it has no P), but it shows
      that the size of a QUBO is set by the variable count alone and is independent of the clause count.
      Add a few clauses live and let the audience watch the dimension stay put.
    </>
  ),
  'notes.group.general': (
    <>
      This group is the technical core of the paper. Three moves to spell out:
      <br />
      1. inequality → add a slack variable to turn it into an equality (added for <code>≤</code>,
      subtracted for <code>≥</code>)
      <br />
      2. slack variable → binary expansion into a handful of 0/1 bits
      <br />
      3. equality <code>Ax = b</code> → penalty <code>P(Ax−b)ᵀ(Ax−b)</code>
      <br />
      <br />
      §5.2 Graph Colouring is the only case that uses both #1 and #2, and the one that hits the scale
      meter’s ceiling soonest (variables = nodes × colours). §5.4 QAP grows as n². Drag either one live and
      the combinatorial explosion arrives immediately.
    </>
  ),

  'notes.case.number-partitioning': (
    <>
      The paper derives Q by hand from <code>diff²</code>; this site derives it as “Transformation #1
      applied to the balance equality <code>Σsⱼxⱼ = 83</code>, with P = 1” and obtains{' '}
      <strong>exactly the same</strong> Q. So the paper’s “natural form” is really just a special case of
      the general recipe.
      <br />
      <br />
      The additive constant is 83² = 6,889, so a perfect split gives xᵀQx = −6889 and an original objective
      value of 0 — visible on the “Solution space” tab. Try a set of numbers that cannot be split evenly
      and watch what happens to the difference.
      <br />
      <br />
      The “On the hardware” tab is best shown next to Max-Cut: here Q is <strong>fully connected</strong>{' '}
      (eight numbers make K₈), so it takes 12 qubits and real chains on the chip, while Max-Cut’s Q has only
      the edges of the original graph and needs one qubit per variable. Grow the list to 20 numbers live and
      this site’s heuristic gives up — a good moment to say that this does not mean the hardware could not.
    </>
  ),
  'notes.case.max-cut': (
    <>
      The key identity: <code>xᵢ + xⱼ − 2xᵢxⱼ</code> equals 1 when the two endpoints land in different
      subsets and 0 when they share one. Summed over every edge it is the cut size directly, with no
      constraints needed at all.
      <br />
      <br />
      Note that the optimum always comes <strong>at least in pairs</strong> (degeneracy ≥ 2): complement
      the whole of x and the cut is unchanged. The degeneracy readout on the “Solution space” tab shows
      this — a phenomenon only exhaustive enumeration reveals.
      <br />
      <br />
      On the “On the hardware” tab: Max-Cut’s couplings are exactly the edges of the original graph, so
      every variable gets one qubit and no chains are needed at all. Number Partitioning (fully connected,
      chains required) is the clearest contrast.
    </>
  ),
  'notes.case.min-vertex-cover': (
    <>
      The diagonal is <code>1 − P·deg(j)</code>, so a degree-3 node gives −23 and a degree-2 node −15 (with
      P = 8). That structure is visible at a glance in the Q heat map.
      <br />
      <br />
      The P slider is the thing to play with on this page: push P below 1 and the optimum becomes “select
      nothing”, because the saving outweighs the penalty and feasibility collapses instantly. This is
      exactly what p.13 means when it says that too small a P will “jeopardize the search for feasible
      solutions”.
    </>
  ),
  'notes.case.set-packing': (
    <>
      This is a maximisation, so the penalty is <strong>subtracted</strong>, which is why the off-diagonal
      entries come out negative (−P/2 = −3). If someone asks why the penalty in §4.1 was positive and this
      one is negative, that is the reason.
    </>
  ),
  'notes.case.max-independent-set': (
    <>
      The paper works no example of this one; it is an extension added by this site. Two points worth making:
      the recipe is exactly §4.2’s Set Packing (row 1 of the p.10 table, <code>xᵢ + xⱼ ≤ 1 → P·xᵢxⱼ</code>),
      only with the constraints taken from the edges of a graph; and it is the mirror image of §4.1 — the
      complement of an independent set is a vertex cover, so the answer 2 = 5 − 3 follows straight from §4.1.
      <br />
      <br />
      Worth demonstrating live: drag P down to 1. The optimal value is still 2, but the degeneracy jumps from 4
      to 7, and the three newcomers each pick both ends of some edge. Gain and penalty tie exactly, which is why
      P must be <strong>strictly</strong> greater than 1.
    </>
  ),
  'notes.case.max-clique': (
    <>
      On p.10 the paper notes that Pardalos &amp; Xue used exactly this <code>P·xᵢxⱼ</code> penalty for maximum
      clique. The only difference from maximum independent set is where the constraints come from: the
      independent set takes the pairs that ARE edges, the clique the pairs that are NOT — it is an independent
      set on the complement graph. Put the two Q matrices side by side and their nonzero off-diagonal cells are
      exact complements.
      <br />
      <br />
      The graph’s only triangle is 3–4–5, so the optimum is 3 and unique. In the problem view, chosen pairs that
      are not adjacent are drawn as red dashed lines; drag the P slider down to make them appear.
    </>
  ),
  'notes.case.max-diversity': (
    <>
      The objective is quadratic from the start (<code>Σ dᵢⱼxᵢxⱼ</code>); the only constraint is “choose exactly
      4”, handled by Transformation #1. The optimum is {'{'}7, 10, 31, 42{'}'} with total distance 126: on a line,
      both extremes must be chosen, and the middle pair should be as far apart as possible.
      <br />
      <br />
      The choice of P is worth a minute. This site takes 200, because an extra item gains at most its row sum
      of distances (the largest is 170, for 42), so any P &gt; 170 is guaranteed to work. But on this instance
      P = 60 already does — the guaranteed bound and the actual threshold are more than three times apart, which
      is the paper’s p.13 point that the “Goldilocks” region is wide. Drag the slider down to find where it breaks.
    </>
  ),
  'notes.case.discrete-tomography': (
    <>
      There is no objective; all six projection equalities go through Transformation #1, just like §5.2’s node
      rows, and any positive P works.
      <br />
      <br />
      The point is on the solutions tab: <strong>five</strong> images share exactly these projections, and the
      “X” is only one of them. Row and column sums alone do not determine the picture, which is why real
      tomography adds projections from more directions, or prior knowledge.
    </>
  ),
  'notes.case.task-allocation': (
    <>
      Communication is paid only when two tasks are split, written <code>cᵢⱼ(xᵢ₁xⱼ₂ + xᵢ₂xⱼ₁)</code>, so the
      objective itself is quadratic; each task’s “exactly one processor” is Transformation #1.
      <br />
      <br />
      The data are built so the two pulls disagree. Putting everything on processor 2 avoids all communication,
      for a total of 16; but the optimum splits — tasks 1 and 3 on processor 1, task 2 on processor 2 — for 14.
      P = 16 is the guaranteed bound (unassigning a task saves at most 15); on this instance P = 8 already works.
    </>
  ),
  'notes.case.capital-budgeting': (
    <>
      This is §5.5 without its quadratic terms and with a second budget period. With period 1 alone the best
      choice is projects 2, 3, 4 (value 11); period 2 rules that out, and the optimum becomes projects 2 and 4
      (value 9).
      <br />
      <br />
      Worth pointing out: the slack bounds here are the full row ranges (16 and 13), not §5.5’s 3, because the
      optimum leaves 7 unused in period 1 and a bound of 3 could not represent it. The slack bounds of §5.3 and
      §5.5 are judgements about those problems; a new problem needs its own.
    </>
  ),
  'notes.case.multiple-knapsack': (
    <>
      Like §5.2, this case uses both transformations: “at most one knapsack per item” is row 1 of the p.10
      table (Transformation #2, no slack), and each capacity is a ≤ row with slack (Transformation #1).
      <br />
      <br />
      The total weight of 22 exceeds the 18 available, so something must stay out. The best value is 11,
      reached by four different packings; the solutions tab shows the degeneracy.
    </>
  ),
  'notes.case.p-median': (
    <>
      The first use of row 4 of the p.10 table: “a customer may only be served by an open site”,{' '}
      <code>xᵢⱼ ≤ yⱼ</code> → <code>P(xᵢⱼ − xᵢⱼyⱼ)</code>. One model, three kinds of row: served exactly once and
      exactly 2 open (both Transformation #1), plus 12 implications.
      <br />
      <br />
      An implementation detail: the implication recipe takes its variables in index order as “antecedent ≤
      consequent”, so every x must come before the y’s. The optimum opens the two outer sites, 1 and 3, for a
      total distance of 5.
    </>
  ),
  'notes.case.warehouse-location': (
    <>
      Two differences from P-Median: the “exactly 2 open” row is gone, and the y’s carry opening costs. The
      cheap middle site changes the answer: open sites 1 and 2 for a total of 14, where P-Median on the same
      points opened 1 and 3. Side by side, the two pages make the point that one row more or less changes the
      answer.
    </>
  ),
  'notes.case.linear-ordering': (
    <>
      Each triple i &lt; j &lt; k has two rows, <code>0 ≤ xᵢⱼ + xⱼₖ − xᵢₖ ≤ 1</code>, which rule out cycles. Each
      slack bound is 1, below the row’s full range of 2: whenever the other row holds, this row’s slack cannot
      exceed 1. It is the same kind of judgement the paper makes when it picks slack bounds in §5.3, and the
      constrained search confirms no valid ranking is lost because of it.
      <br />
      <br />
      The objective is net agreement; the problem view adds back the constant 12 to show full agreement. The best
      ranking is 4 › 1 › 2 › 3, agreeing 21 times out of 30.
    </>
  ),
  'notes.case.clique-partitioning': (
    <>
      This is §7 point 3’s node-variable substitution: the standard model has one variable per edge; replacing
      “i and j together” with <code>Σₖ xᵢₖxⱼₖ</code> makes the objective quadratic and leaves only “each node in
      exactly one group”. The appendix page describes the substitution too.
      <br />
      <br />
      The best partition is {'{'}1, 2{'}'} {'{'}3, 4{'}'} with total weight 7, yet the solutions tab shows 12
      optima: group labels are interchangeable (4 × 3 ways to name two groups). A good moment to explain why
      symmetry inflates a QUBO’s solution space.
    </>
  ),
  'notes.case.max-3-sat': (
    <>
      This case needs the paper’s §7 point 4 <strong>higher-order reduction</strong>. A three-literal clause’s
      penalty is the product of three “is false” indicators, so it is cubic. Summed over the eight clauses, only
      two cubic terms survive, <code>−x₁x₂x₃</code> and <code>−x₁x₂x₄</code>; both contain <code>x₁x₂</code>, so one
      auxiliary x₅ replaces it, with Rosenberg’s penalty <code>P(x₁x₂ − 2x₁x₅ − 2x₂x₅ + 3x₅)</code>.
      <br />
      <br />
      Contrast it with Max 2-SAT, where the QUBO’s size depends only on the variable count: here auxiliaries are
      added. On stage, drag P down to 1 — the optimal value is still 0, but a tie with x₅ ≠ x₁x₂ appears; at 0
      even the value goes wrong.
    </>
  ),
  'notes.case.constraint-satisfaction': (
    <>
      “Not all on one team” for a trio becomes two clauses, <code>(a ∨ b ∨ c)</code> and{' '}
      <code>(¬a ∨ ¬b ∨ ¬c)</code>. Each is cubic, but added together their cubic terms <strong>cancel exactly</strong>,
      and the constraint is the quadratic <code>1 − a − b − c + ab + ac + bc</code>.
      <br />
      <br />
      So this case needs no auxiliary at all — the counterpoint to Max 3-SAT: because the engine sums every
      clause before reducing, terms that cancel never cost an extra variable. Eight team assignments satisfy
      every trio; swapping the team names pairs them up, so there are really four.
    </>
  ),
  'notes.case.graph-partitioning': (
    <>
      Present this page side by side with §3.2’s Max-Cut: same graph, same cut-count expression, one maximised
      and the other minimised. Without a constraint, the fewest cut edges means putting everything in one group
      (cutting nothing), so “group 1 has exactly 2 nodes” is required, via Transformation #1.
      <br />
      <br />
      The optimum is {'{'}1, 2{'}'} against the triangle {'{'}3, 4, 5{'}'}, cutting just 2 edges, unique. Five nodes
      cannot split into equal halves, so this is the as-balanced-as-possible 2/3 split.
    </>
  ),
  'notes.case.portfolio': (
    <>
      The objective is risk minus return: risk is the sum of covariances among the assets held,{' '}
      <code>xᵀΣx</code>, quadratic from the start; the only row is “hold exactly 3”. The highest-return trio (2,
      4, 5) carries too much risk; the optimum is 3, 4, 5.
      <br />
      <br />
      A design detail worth mentioning: unconstrained, the best holding would be just assets 3 and 5, so the
      “exactly 3” row genuinely changes the answer, and a P below 4 picks wrongly. This site’s first draft asked
      for 2 assets — whose unconstrained optimum happened to hold 2 as well, so even P = 0 passed and the penalty
      demonstrated nothing. Hence 3.
    </>
  ),
  'notes.case.max-matching': (
    <>
      Here the variables are <strong>edges</strong>, not nodes: one per edge, chosen meaning “paired”. Each node
      may touch at most one chosen edge — rows 1 and 5 of the p.10 table (for nodes with two and three edges), the
      same penalty as §4.2’s Set Packing.
      <br />
      <br />
      The optimum is {'{'}1–2, 3–4{'}'} with weight 4 + 5 = 9. Because 3, 4, 5 form a triangle, no matching can
      pair all five nodes.
    </>
  ),
  'notes.case.community-detection': (
    <>
      The same form Negre et al. use: k communities, each node in exactly one (Transformation #1), maximising
      modularity. Modularity is a fraction, so the objective is scaled by (2m)² to keep every coefficient an
      integer; the problem view converts back to the real Q.
      <br />
      <br />
      Two triangles joined by a bridge is the textbook example of community detection; the optimum is the two
      triangles, Q = 5/14 ≈ 0.357. The solutions tab shows 2 optima because the two community labels can swap.
      Compare it with clique partitioning: there the number of groups is free and the weights are given; here
      the weights come from the structure of the graph.
    </>
  ),
  'notes.case.shortest-path': (
    <>
      This is the standard flow formulation of shortest path, <strong>not</strong> the maze encoding of the Pakin
      paper the tutorial cites. One variable per directed arc; at every node “out minus in” is +1 at the start, −1
      at the end and 0 elsewhere, one equality row each.
      <br />
      <br />
      The shortest route, S→A→B→C→T with length 6, has the most arcs; the two-arc S→B→T is the longest (10). Drag
      P below 4 and the route breaks; the problem view marks the nodes whose flow no longer balances.
    </>
  ),
  'notes.case.travelling-salesman': (
    <>
      The paper cites vehicle routing; this page is its single-vehicle, uncapacitated core, the travelling
      salesman problem. The cited works add vehicles and capacities on top of exactly this structure.
      <br />
      <br />
      Variables are city × position. City 1 is fixed first, which removes the four rotations of every tour —
      16 variables become 9 without excluding any tour. The shortest tour 1→2→4→3→1 has length 18; the solutions
      tab shows 2 optima because a tour and its reverse cost the same.
    </>
  ),
  'notes.case.traffic-flow': (
    <>
      This page follows the QUBO of the cited paper itself (Neukart et al., Volkswagen and D-Wave’s study of
      Beijing taxis): three candidate routes per car, congestion as the sum over road segments of the squared
      number of cars, and exactly one route per car. The square makes crowding one segment more and more costly.
      <br />
      <br />
      λ follows their rule too: the most segment-cost terms any one car appears in, 7 here. All three cars
      originally share segments c and d, congestion 19; the optimum moves car 1 to route 2 and car 3 to route 3,
      leaving one car per segment, congestion 5.
    </>
  ),
  'notes.case.max-2-sat': (
    <>
      The headline of this page: <strong>the dimension of a QUBO is set by the variable count alone and is
      independent of the clause count</strong>. Press “Add clause” a few times on stage and let the
      audience see that Q is still 4×4. On p.17 the paper notes that 200 variables and 30,000 clauses still
      make nothing more than a 200-variable QUBO.
      <br />
      <br />
      It is also the only case where ±½ appears in Q: an isolated quadratic term such as{' '}
      <code>−x₂x₃</code> has to be split across two cells in the symmetric form. Switch to
      “Upper-triangular form” and the entries turn back into integers.
    </>
  ),
  'notes.case.set-partitioning': (
    <>
      Remark 2 of the paper offers a shortcut: <code>qᵢᵢ = cᵢ − P·kᵢ</code> and{' '}
      <code>qᵢⱼ = P·rᵢⱼ</code>, where kⱼ is the number of constraints containing xⱼ and rᵢⱼ the number
      containing both. Check a cell live: x₃ appears in 3 constraints, so q₃₃ = 1 − 30 = −29.
      <br />
      <br />
      The shortcut is exactly equivalent to the general Transformation #1; the provenance breakdown shown
      when you hover the heat map is demonstrating precisely that.
    </>
  ),
  'notes.case.graph-coloring': (
    <>
      The only case that uses both transformations: #1 for the colour assignment, #2 for the adjacency
      restriction. Q’s <strong>block-diagonal structure</strong> (five 3×3 blocks) is unmistakable on the
      heat map, and p.23 remarks that “Looking for patterns is often a useful de-bugging tool”.
      <br />
      <br />
      The scale meter is at its most dramatic here: variables = nodes × colours. 6 nodes with 4 colours =
      24 is already at the edge of exhaustive search, and 7 nodes with 4 colours = 28 forces the heuristic.
      Drag it live and hit the wall.
      <br />
      <br />
      This case has no objective function — it only looks for a feasible solution — so any positive P will
      do.
    </>
  ),
  'notes.case.general-01': (
    <>
      All three constraint types at once (≤, =, ≥), and the most complete demonstration of slack expansion
      on the site.
      <br />
      <br />
      Worth flagging: the slack bounds 3 and 6 are <strong>the authors’ own judgement</strong>, not
      something derived — those two constraints could in theory reach 7 and 11. The “Formulation” tab shows
      both numbers side by side. This is a very typical modelling trade-off: a loose bound spends extra
      bits, a tight one can cut off feasible solutions.
      <br />
      <br />
      Note also that the third constraint is slack at the optimum (11 ≥ 5), consuming a surplus of 6 —
      exactly the bound.
    </>
  ),
  'notes.case.qap': (
    <>
      n facilities need n² variables, which is the fundamental reason QAP is so awkward. 3×3 is already 9
      variables, 5×5 is 25 (the edge of exhaustive search), and 6×6 is 36 (heuristic only).
      <br />
      <br />
      ⚠️ A finding worth mentioning: the <strong>objective function printed on p.28</strong> and the{' '}
      <strong>Q matrix printed on p.29</strong> disagree. The expression omits two terms (48x₅x₇ and
      90x₆x₇) and misprints 32x₂x₇ as 60x₂x₇. This site <strong>re-derives</strong> everything from the
      flow and distance matrices; the Q that comes out matches the paper’s printed Q exactly, and
      reproduces the paper’s own answer of 218. That is precisely the value of the “derive, never
      transcribe” decision.
    </>
  ),
  'notes.case.quadratic-knapsack': (
    <>
      Maximisation, an inequality constraint and a binary slack expansion: every technique so far,
      combined. The slack bound is again the authors’ judgement (they take 3, where the theoretical ceiling
      is 16).
      <br />
      <br />
      The optimum x = (1,0,1,1) uses the budget <strong>exactly</strong>: 8+5+3 = 16, so both slack bits
      are 0. The budget bar on the “Problem view” tab shows this.
    </>
  ),

  // ── source badge / reconciliation ─────────────────────────────────────
  'verify.matches': 'matches paper',
  'verify.mismatch': 'differs from paper',
  'verify.custom': 'custom input (no paper reference)',
  'verify.restore': 'Restore the paper’s data',
  'verify.detail.ok': (p: TParams) =>
    `The derived ${p.n}×${p.n} Q matrix is identical to the one printed in the paper, and the additive constant ${p.constant} agrees too.`,
  'verify.detail.bad': (p: TParams) => `${p.count} cells differ from the paper.`,
  'verify.detail.custom':
    'You have edited the input, so there is no longer a paper reference to compare against. Q is still derived live, and the solutions are still exact.',

  'verify.searched': 'agrees with direct search of the original model',
  'verify.searchedBad': 'disagrees with direct search of the original model',
  'verify.searching': 'checking…',
  'verify.customSearch': 'edited (no longer compared)',
  'verify.restoreSite': 'Restore this site’s defaults',
  'verify.detail.customSearch':
    'You have changed the input or P, so the comparison with direct search of the original model is no longer shown. Q is still derived live, and the solutions are still exact.',
  'verify.detail.searched': (p: TParams) =>
    `The paper works no example of this problem, so there is no printed Q to compare cell by cell. What is checked instead: the QUBO optimum ${p.qubo} plus the constant ${p.constant} equals ${p.best}, the optimum found by searching the original constrained model directly, without any QUBO.`,
  'verify.detail.searchedBad': (p: TParams) =>
    `The QUBO optimum ${p.qubo} plus the constant ${p.constant} does not equal ${p.best}, the optimum of the original constrained model, or the optimum is infeasible.`,
  'source.mentioned': 'named in the paper only',
  'source.mentioned.tooltip':
    'The paper mentions this problem here but gives no instance, Q matrix or answer. The instance on this page was chosen by this site.',
  'extended.banner.title': 'Extension: named in the paper, never worked',
  'extended.banner.body': (p: TParams) => (
    <>
      The paper lists this problem in {String(p.section)} ({String(p.pages)}) as one that QUBO encompasses, but{' '}
      <strong>gives no instance, prints no Q matrix and states no answer</strong>. The instance on this page was
      chosen by this site, so the Q shown here has nothing in the paper to be compared against.
      <br />
      <br />
      The check that takes its place: search the original constrained model directly, without any QUBO —
      enumerate every 0/1 assignment, discard the infeasible ones, score the rest with the original objective —
      and confirm that the QUBO optimum plus its constant equals that value, and that every QUBO optimum is
      feasible. That search shares no code with the derivation engine.
    </>
  ),

  'source.cited': 'cited in §6 only',
  'source.cited.tooltip':
    'The paper mentions this problem only in §6, while citing other people’s work; it is not in the §1 list. The instance on this page was chosen by this site.',
  'extended.banner.titleCited': 'Extension: mentioned only in work the paper cites',
  'extended.banner.bodyCited': (p: TParams) => (
    <>
      This problem is not in the paper’s §1 list; the paper mentions it only in {String(p.section)} (
      {String(p.pages)}) while citing other people’s work, and <strong>gives no instance, prints no Q matrix
      and states no answer</strong>. Both the model and the instance on this page follow the standard form and
      were chosen by this site, so the Q shown here has nothing in the paper to be compared against.
      <br />
      <br />
      The check that takes its place is the same as for the other extensions: search the original constrained
      model directly, without any QUBO, and confirm that the QUBO optimum plus its constant equals that value
      and that every QUBO optimum is feasible.
    </>
  ),

  // ── group intros ──────────────────────────────────────────────────────
  'group.natural.title': 'A · Natural form',
  'group.natural.body': (
    <>
      The problems in this group are quadratic already: write the objective function down and it is{' '}
      <Math>{'x^tQx'}</Math> — no penalty function required. This is the comfortable case, and the best
      place to start if you want to understand the structure of a Q matrix.
    </>
  ),
  'group.knownPenalty.title': 'B · Known penalties',
  'group.knownPenalty.body': (
    <>
      These problems have constraints, but ones whose form happens to appear in the table on p.10 of the
      paper, so they can be looked up and swapped straight for a quadratic penalty. The point to hold onto:
      the penalty is an <strong>exact representation</strong>, not the approximation a classical penalty
      method would give — as long as P is large enough, the optimum of the QUBO is the optimum of the
      original problem.
    </>
  ),
  'group.general.title': 'C · General transformations',
  'group.general.body': (
    <>
      When the table does not have it, use the general recipe. Transformation #1 turns any equality
      constraint <Math>{'Ax = b'}</Math> into the penalty <Math>{'P(Ax-b)^t(Ax-b)'}</Math>; an inequality
      is first padded into an equality with a slack variable, which is then expanded in binary.
    </>
  ),

  // ── case page panels ──────────────────────────────────────────────────
  'case.tab.formulation': 'Formulation',
  'case.tab.matrix': 'Q matrix',
  'case.tab.solutions': 'Solution space',
  'case.tab.domain': 'Problem view',
  'case.tab.code': 'Code',
  'case.tab.embedding': 'On the hardware',
  'case.tab.annealer': 'Digital annealing',

  'formulation.original': 'Original model',
  'formulation.slack': 'Slack expansion',
  'formulation.penalty': 'Penalty terms',
  'formulation.reduction': 'Higher-order reduction (§7 point 4)',
  'formulation.reductionNote': (p: TParams) =>
    `Each auxiliary replaces a product of two variables; its penalty is 0 exactly when the two agree. The largest total |coefficient| an auxiliary replaces is ${p.load}, and P must exceed it for every optimum to be exact (P is now ${p.P}).`,
  'formulation.result': 'Result',
  'formulation.resultBody': (p: TParams) =>
    `${p.n} variables, additive constant ${p.constant}. Original objective value = xᵀQx + constant.`,
  'formulation.method.transform1': 'Transformation #1',
  'formulation.method.transform2': 'Transformation #2',
  'formulation.method.atLeastOne': 'known penalty (p.10 table, row 2)',
  'formulation.method.exactlyOne2': 'known penalty (p.10 table, row 3)',
  'formulation.method.implication': 'known penalty (p.10 table, row 4)',
  'formulation.method.equal2': 'known penalty (p.10 table, row 6)',
  'formulation.moreConstraints': (p: TParams) => `… and ${p.count} more`,
  'formulation.morePenalties': (p: TParams) =>
    `… and ${p.count} more penalty terms (same structure, different variables)`,
  'formulation.slackNote': (p: TParams) =>
    `The paper takes an upper bound of ${p.used}; this constraint could in theory reach ${p.auto}. The gap is the authors’ judgement, not something derived.`,

  'matrix.symmetric': 'Symmetric form',
  'matrix.upper': 'Upper-triangular form',
  'matrix.view.heatmap': 'Heat map',
  'matrix.view.latex': 'Matrix form',
  'matrix.view.latexHint': 'Laid out as the paper prints it, for cell-by-cell comparison with the PDF.',
  'matrix.hint': 'Hover any cell to see which sources add up to that number.',
  'matrix.provenance': (p: TParams) => `Q[${p.i}][${p.j}] = ${p.value}`,
  'matrix.provenance.empty': 'Nothing contributes to this cell.',
  'matrix.constant': (p: TParams) => `additive constant = ${p.constant}`,

  'solutions.exact': 'exhaustive (exact)',
  'solutions.heuristic': 'heuristic (best found)',
  'solutions.best': 'Optimum',
  'solutions.degeneracy': (p: TParams) => `${p.count} solutions reach the optimal value`,
  'solutions.unique': 'the optimum is unique',
  'solutions.energy': 'xᵀQx',
  'solutions.original': 'original objective',
  'solutions.evaluated': (p: TParams) => `${p.count} assignments enumerated in ${p.ms} ms`,
  'solutions.feasible': (p: TParams) => `${p.count} of them satisfy every original constraint`,
  'solutions.landscape': 'Energy distribution',
  'solutions.landscapeHint':
    'The horizontal axis is xᵀQx, the vertical axis how many solutions fall in that bin. Penalties push the feasible solutions down to low energy — which is exactly what the penalty method is for.',
  'solutions.feasibilityCheck': 'Optimum substituted back into the original constraints',
  'solutions.rowOk': 'satisfied',
  'solutions.rowBad': 'violated',
  'solutions.moreRows': (p: TParams) =>
    `… and ${p.count} more (all were checked; only the first ${p.shown} are listed)`,
  'solutions.infeasible':
    'No feasible solution: the penalty terms never reach 0. Either the original problem has no solution, or P is set too low.',
  'solutions.running': 'Solving…',

  // ── scale meter ───────────────────────────────────────────────────────
  'scale.title': 'Scale meter',
  'scale.vars': (p: TParams) => `${p.n} variables`,
  'scale.varsWithSlack': (p: TParams) =>
    `${p.base} original variables + ${p.slack} slack bits = ${p.n} variables`,
  'scale.varsWithAux': (p: TParams) =>
    `${p.base} original variables + ${p.aux} ${p.aux === 1 ? 'auxiliary' : 'auxiliaries'} = ${p.n} variables`,
  'scale.states': (p: TParams) => `${p.states} assignments`,
  'scale.tier.green': 'exhaustive (exact), instant',
  'scale.tier.amber': 'exhaustive (exact), takes a moment',
  'scale.tier.orange': 'switched to tabu search (heuristic, optimality not guaranteed)',
  'scale.tier.red': 'over the ceiling, refusing to run',
  'scale.redHint': (p: TParams) =>
    `${p.n} variables give 2^${p.n} assignments. The browser cannot enumerate that in any reasonable time, and a tabu search result would no longer be worth quoting either. Please shrink the input.`,

  // ── penalty slider ────────────────────────────────────────────────────
  'penalty.title': 'Penalty scalar P',
  'penalty.paperValue': (p: TParams) => `the paper takes P = ${p.value}`,
  'penalty.reset': 'Back to the paper’s value',
  'penalty.siteValue': (p: TParams) => `this site takes P = ${p.value} (the paper gives none)`,
  'penalty.resetSite': 'Back to this site’s default',
  'penalty.suggested': (p: TParams) => `suggested range ${p.lo} – ${p.hi}`,
  'penalty.hint': (
    <>
      From p.13: too large a P drowns out the information in the objective function, too small a P fails to
      find feasible solutions, and between them lies a fairly wide “Goldilocks region”. The rule of thumb
      is 75%–150% of an estimate of the original objective value. Drag the slider and watch which threshold
      the optimum jumps into the feasible region at.
    </>
  ),
  'penalty.none': 'This model has no constraints, so it needs no penalty scalar.',
  'penalty.infeasibleNow': 'P is currently too small: the optimum is no longer feasible.',

  // ── export / code ─────────────────────────────────────────────────────
  'export.tier1': 'This problem',
  'export.tier2': 'Modelling function',
  'export.tier1.hint':
    'Q is written out as a literal and handed straight to a sampler. The numbers are the very ones derived live on this page.',
  'export.tier2.hint':
    'Hands the original constrained model to build_qubo() and computes Q inside Python. This is what the paper is really teaching.',
  'export.script': 'Python script',
  'export.jupyter': 'Jupyter / Colab',
  'export.sampler': 'Sampler',
  // The meaningful split is whether D-Wave is contacted at all — NOT where the
  // reader's Python runs. A classical sampler behaves identically on a laptop
  // or in Colab, and Colab itself still requires a Google account, so calling
  // it "local, no account" would be wrong on both counts.
  'export.sampler.local': 'purely classical · never contacts D-Wave',
  'export.sampler.token': 'requires a D-Wave Leap account',
  'export.sampler.tokenWarn':
    'This sampler connects to D-Wave and consumes QPU time. The paper’s cases are tiny, and the classical samplers above give the same answers.',
  'sampler.limit.exact':
    '≤ ~20 variables (enumerates all 2ⁿ assignments, returns a guaranteed optimum)',
  'sampler.limit.tabu': 'thousands of variables (heuristic, returns the best found so far)',
  'sampler.limit.sa': 'thousands of variables (heuristic)',
  'sampler.limit.mock': 'the same minor-embedding limits as the QPU; the annealing itself is simulated, with no connection to D-Wave',
  'sampler.limit.qpu':
    'bounded by minor-embedding; a few hundred logical variables for a fully connected problem',
  'sampler.limit.hybrid': 'tens of thousands of variables (classical/quantum hybrid)',
  'export.install.label': 'Install',
  'export.install.hint':
    'Copy into a terminal; in Colab, use the first cell of the Notebook tab below instead.',
  'export.install.copy.tooltip': 'Copy the install command',
  'export.tokenSetup.label': 'Configure credentials',
  'export.copyCode.tooltip': 'Copy the code',
  'export.copyCell.tooltip': 'Copy this cell',
  'export.download.py.tooltip': 'Download .py',
  'export.download.ipynb.btn': 'Download .ipynb',
  'export.colabHint': 'In Colab, open it with File → Upload notebook.',
  'export.toast.codeCopied': 'Code copied',
  'export.toast.cellCopied': 'Cell copied',
  'export.toast.installCopied': 'Install command copied',
  'export.toast.pyDownloaded': (p: TParams) => `Downloaded ${p.filename}.py`,
  'export.toast.ipynbDownloaded': (p: TParams) => `Downloaded ${p.filename}.ipynb`,
  'export.toast.copyFailed': (p: TParams) => `Copy failed: ${p.error}`,
  'export.toast.downloadFailed': (p: TParams) => `Download failed: ${p.error}`,

  // ── overview page ───────────────────────────────────────────────────────
  'overview.title': 'Overview: the QUBO standard form and the platforms that solve it',
  'overview.lead': (
    <>
      The central claim Glover, Kochenberger and Du make in{' '}
      <em>A Tutorial on Formulating and Using QUBO Models</em> is not “make the problem harder”, but{' '}
      <strong>map wildly different combinatorial optimisation problems onto one standard form</strong>:
      <Math block>{'\\min / \\max \\; y = x^t Q x, \\quad x \\in \\{0,1\\}^n'}</Math>
      There are no constraints beyond 0/1, and all the information sits in a single Q matrix. Which is how
      a great variety of problems come to share one solver ecosystem.
    </>
  ),
  'overview.left': 'Problem side · combinatorial optimisation',
  'overview.extendedChip': (p: TParams) => `+ ${p.n} extensions (named or cited, not worked)`,
  'overview.middle': 'QUBO standard form',
  'overview.right': 'Solver side · samplers and hardware',
  'overview.whyIsing': (
    <>
      Why is there quantum hardware on the solver side at all? Because QUBO is equivalent to the Ising
      model of physics (set <Math>{'x_j = (s_j + 1)/2'}</Math>), and the Ising Hamiltonian is precisely the
      native energy function of a quantum annealer — the hardware{' '}
      <strong>recognises this one form and nothing else</strong>. Note the direction of causation: nobody
      picked D-Wave first and then modelled to suit it; QUBO simply happens to be the shape the hardware
      can read.
    </>
  ),
  'overview.platforms': 'Solver-side platforms',
  'overview.platform.annealing': 'quantum annealing',
  'overview.platform.gate': 'gate model',
  'overview.platform.digital': 'digital annealing (quantum-inspired)',
  'overview.platform.classical': 'classical heuristic',
  'overview.platform.name.qaoa': 'QAOA (gate model)',
  'overview.platform.name.tabu': 'Tabu search (classical)',
  'overview.platform.name.exhaustive': 'Exhaustive search (classical)',
  'overview.topology.asic': 'fully connected (ASIC)',
  'overview.topology.varies': 'hardware-dependent',
  'overview.scale.advantage2': 'a few hundred fully connected logical variables',
  'overview.scale.digital': '100,000 variables (third generation on; first: 1,024)',
  'overview.scale.qaoa': 'small MaxCut / MIS instances only, so far',
  'overview.scale.tabu': 'thousands of variables',
  'overview.scale.exhaustive': '≤ 24 variables, optimality guaranteed',
  'overview.col.native': 'Native form',
  'overview.col.topology': 'Topology',
  'overview.col.embedding': 'Embedding needed',
  'overview.col.scale': 'Scale',
  'overview.col.here': 'On this site',
  'overview.here.run': 'runs here',
  'overview.here.emit': 'code emitted',
  'overview.here.planned': 'planned',
  'overview.here.note.digital': 'the published algorithm, not Fujitsu hardware',
  'overview.yes': 'yes',
  'overview.no': 'no',

  'overview.dwave.title': 'D-Wave: the company, the hardware, the cloud service, the software',
  'overview.dwave.body': (
    <>
      “D-Wave” means four different things depending on context, and a discussion goes better if they are
      kept apart. It is <strong>a company first</strong> (D-Wave Quantum Inc., NYSE: QBTS); the hardware,
      the cloud service and the software sit underneath it.
    </>
  ),
  'overview.dwave.layer.company': 'Company',
  'overview.dwave.layer.hardware': 'Hardware',
  'overview.dwave.layer.cloud': 'Cloud',
  'overview.dwave.layer.software': 'Software',
  'overview.dwave.company': 'D-Wave Quantum Inc. (founded 1999 in Burnaby, Canada)',
  'overview.dwave.hardware':
    'Advantage (Pegasus topology), Advantage2 (Zephyr topology); quantum annealers, not general-purpose gate machines',
  'overview.dwave.cloud': 'Leap — subscription cloud access to QPUs and hybrid solvers, in real time',
  'overview.dwave.software':
    'Ocean SDK (open source, Python): dimod, dwave-system, dwave-samplers, minorminer',
  'overview.dwave.language': (
    <>
      D-Wave <strong>has no language of its own</strong>; Python is the first-class citizen. What needs
      “translating” is not the language but the problem model, and there are two layers of it: the first is
      what this site does, original problem → Q matrix; the second is minor-embedding, Q matrix → hardware
      topology.
    </>
  ),
  'overview.dwave.qbsolvNote': (
    <>
      The paper was written in 2019, and the <code>qbsolv</code> it mentions is now deprecated (D-Wave
      stopped maintaining it in 2022); the Leap hybrid solvers took over its role.
    </>
  ),

  'overview.embedding.title': 'Minor-embedding: why 5,000 qubits will not hold 5,000 variables',
  'overview.embedding.body': (
    <>
      QUBO assumes any two variables can carry a <Math>{'q_{ij}'}</Math> between them (full connectivity),
      but on a physical chip a qubit is wired to a fixed handful of neighbours. So each{' '}
      <strong>logical variable</strong> has to be spread over a string of physical qubits (a chain), tied
      together by strong couplings so that they act as one variable. The longer the chain, the more qubits
      it eats. That is what p.33 means when it says embedding is itself a hard problem.
    </>
  ),
  'overview.embedding.vars': 'Logical variables',
  'overview.embedding.chainLen': 'Chain length',
  'overview.embedding.physical': 'Physical qubits needed',
  'overview.embedding.ratio': (p: TParams) => `${p.ratio}× blow-up`,
  'overview.embedding.play': 'Play',
  'overview.embedding.pause': 'Pause',
  'overview.embedding.reset': 'Reset',
  'overview.embedding.logical': 'Logical graph (fully connected QUBO)',
  'overview.embedding.physicalView': 'Physical graph (chains on the hardware topology)',
  'overview.embedding.note': (
    <>
      This is a <strong>teaching illustration</strong> built on a Chimera-style cross construction. The
      chip is drawn as <Math>{'n \\times n'}</Math> unit cells, each holding two qubits — one horizontal,
      one vertical — coupled to each other within the cell. The chain for variable <Math>{'i'}</Math> is{' '}
      <strong>every horizontal qubit in row {'i'} plus every vertical qubit in column {'i'}</strong>. Chain{' '}
      <Math>{'i'}</Math> and chain <Math>{'j'}</Math> therefore each have a qubit inside cell{' '}
      <Math>{'(i, j)'}</Math>, coupled to one another — and that coupling is where{' '}
      <Math>{'q_{ij}'}</Math> physically lives. Note that <strong>no qubit is ever shared by two
      chains</strong>, which is the rule real hardware follows too. The small dots and dashes are the
      hardware’s <strong>couplers</strong>: one between neighbouring horizontal qubits along a row, one
      between neighbouring vertical qubits down a column (these string a chain together, so they take its
      colour), and one where the two qubits in each cell cross. On the diagonal that crossing joins chain{' '}
      <Math>{'i'}</Math>’s two arms; everywhere else the <strong>dark crossing</strong> is{' '}
      <Math>{'q_{ij}'}</Math>, drawn as on each case’s “On the hardware” tab. Press Play to start from the
      empty chip. The price is a chain length of{' '}
      <Math>{'2n'}</Math> and <Math>{'2n^2'}</Math> physical qubits in total. Real Pegasus and Zephyr
      topologies are far better connected and minorminer’s heuristics far cleverer, so the constants are
      much smaller — but <strong>the quadratic blow-up in the logical variable count is real</strong>.
      Each case page’s “On the hardware” tab places that case’s own derived Q on an actual Pegasus chip.
    </>
  ),

  // ── hardware embedding tab ────────────────────────────────────────────
  'embed.intro': (
    <>
      Deriving Q is not the last step: to run on D-Wave it has to be placed on the chip. A qubit there is
      coupled to only a handful of neighbours, so each variable is spread over a <strong>chain</strong> of
      connected qubits, such that every pair of variables Q couples ends up with a real coupler between
      their two chains. On the left are the couplings this QUBO needs (the source graph); on the right, a
      fragment of the <strong>Pegasus</strong> topology of D-Wave’s Advantage machines, and where each chain sits.
    </>
  ),
  'embed.size.label': 'Chip fragment',
  'embed.size.auto': 'Auto',
  'embed.reseed': 'Another seed',
  'embed.reseed.tooltip':
    'Embed again with a different random seed. Embeddings are not unique: the same QUBO can be placed many ways, with different chain lengths.',
  'embed.seed': (p: TParams) => `seed #${p.seed}`,
  'embed.hardwareOnly': 'Hardware only (target graph)',
  'embed.stat.vars': (p: TParams) => `${p.n} logical variables`,
  'embed.stat.edges': (p: TParams) => `${p.edges} couplings needed (density ${p.density}%)`,
  'embed.stat.fragment': (p: TParams) => `Pegasus P(${p.m}), ${p.qubits} qubits`,
  'embed.stat.used': (p: TParams) => `${p.qubits} qubits used`,
  'embed.stat.maxChain': (p: TParams) => `longest chain ${p.len}`,
  'embed.stat.meanChain': (p: TParams) => `mean chain ${p.len}`,
  'embed.valid': 'Checker: valid embedding',
  'embed.invalid': 'Checker: invalid embedding',
  'embed.valid.tooltip':
    'Confirmed by an independent checker: every chain is connected, no qubit is shared, and every needed coupling has a coupler. The checker shares no code with the search.',
  'embed.running': (p: TParams) => (p.m ? `Trying Pegasus P(${p.m})…` : 'Preparing…'),
  'embed.failed': (p: TParams) => (
    <>
      This site’s simplified heuristic found <strong>no embedding</strong> up to P({String(p.m)}). That
      does <strong>not</strong> mean the hardware cannot hold it: Ocean’s minorminer is much stronger — on
      P(3) it fits a fully connected graph of 24 variables, where this site stops at 14. Try another seed,
      or make the input smaller.
    </>
  ),
  'embed.tooLarge': (p: TParams) =>
    `This QUBO has ${p.n} variables, beyond what this page demonstrates, so no embedding is attempted. That many chains would not be readable anyway.`,
  'embed.error': (p: TParams) => `Embedding failed with an error: ${p.message}`,
  'embed.source.title': 'Couplings this QUBO needs (source graph)',
  'embed.target.pending': 'Pegasus fragment',
  'embed.target.title': (p: TParams) =>
    `Pegasus P(${p.m}) (target graph): ${p.qubits} qubits, ${p.couplers} couplers`,
  'embed.embedding.title': (p: TParams) => `Embedded on Pegasus P(${p.m}) (embedding)`,
  'embed.var.title': (p: TParams) => `${p.name}: chain of ${p.len}`,
  'embed.qubit.used': (p: TParams) => `qubit ${p.q} · in the chain of ${p.name}`,
  'embed.qubit.free': (p: TParams) => `qubit ${p.q} · unused`,
  'embed.legend': (
    <>
      <strong>Reading it:</strong> each line segment is one qubit. Thick segments in one colour are one
      chain, and the joints in that colour are the couplers inside it; D-Wave sets them strongly (the chain
      strength) so the chain acts as one variable, and a chain whose qubits read out different values is a{' '}
      <strong>chain break</strong>. The <strong>dark joints</strong> where two differently coloured chains
      meet are the couplers that actually carry a <Math>{'q_{ij}'}</Math>. Light grey segments are unused
      qubits. <strong>Hover or tap</strong> a variable on the left or a qubit on the right to keep only its
      chain and its neighbours.
    </>
  ),
  'embed.legend.hardware': (
    <>
      <strong>This is the hardware itself</strong>: each line segment is a qubit. Where two segments cross
      there is a coupler, and there is one between two qubits end to end on the same line and between each
      side-by-side pair. Only there can a coupling strength be set, so for two variables to interact,
      their chains have to meet somewhere on this picture.
    </>
  ),
  'embed.note': (
    <>
      Three things to be clear about. One: this is an <strong>ideal Pegasus fragment</strong>, not the
      working graph of any real machine (a real QPU is missing whatever qubits failed in fabrication, and
      each differs). Two: this is <strong>this site’s simplified heuristic</strong> — not an optimal
      embedding, and not what <code>EmbeddingComposite</code> would actually return; on this site’s cases it
      comes out almost the same as Ocean’s minorminer (same longest chain in 29 of 31). Three:{' '}
      <strong>the paper does not cover this</strong>; it only says on p.33 that embedding is itself a hard
      problem. This page is the site’s addition.
    </>
  ),

  // ── digital annealer tab ──────────────────────────────────────────────
  'anneal.intro': (
    <>
      Fujitsu’s <strong>Digital Annealer</strong> is a special-purpose digital chip, “quantum-inspired”: there is
      nothing quantum on it, and what it runs is a modified simulated annealing. The algorithm is published as
      Algorithm 2 of Aramon et al. (2019, <em>Frontiers in Physics</em>) and differs from plain simulated annealing
      in two ways: <strong>parallel trial</strong>, where every step tests a flip of all n variables and applies one of
      the accepted flips at random; and a <strong>dynamic offset</strong>, where a step with no accepted flip raises an
      energy offset <Math>{'E_{\\text{off}}'}</Math>, lowering the bar until the search can climb out of a local
      minimum. This page runs that algorithm on this case’s Q in the browser, next to single-trial simulated
      annealing with the same schedule and the same number of steps.
    </>
  ),
  'anneal.sweeps': 'Sweeps per anneal',
  'anneal.reseed': 'New seed',
  'anneal.reseed.tooltip':
    'Run again with another random seed. Both methods share the seed, so the comparison stays fair; changing it shows how much of the result is luck.',
  'anneal.budget': (p: TParams) => `${p.runs} independent anneals each, ${p.steps} steps per anneal · seed ${p.seed}`,
  'anneal.running': 'Annealing…',
  'anneal.error': (p: TParams) => `Annealing failed: ${p.message}`,
  'anneal.tooLarge': (p: TParams) =>
    `This QUBO has ${p.n} variables, above this page’s limit of ${p.max}. Each step costs O(n) in a browser, so larger problems stop being interactive.`,
  'anneal.da.title': 'Digital annealing (parallel trial)',
  'anneal.da.sub': 'Tests all n flips per step and uses the dynamic offset',
  'anneal.sa.title': 'Simulated annealing (single trial)',
  'anneal.sa.sub': 'Tests one random variable per step, no offset; same schedule and step count',
  'anneal.reached': 'Optimum reached',
  'anneal.missed': 'Optimum missed',
  'anneal.stat.best': 'Best energy y',
  'anneal.stat.hits': 'Runs reaching the optimum',
  'anneal.stat.acceptance': 'Steps that applied a flip',
  'anneal.stat.offsetSteps': 'Steps that raised the offset',
  'anneal.stat.evaluated': 'Flips evaluated',
  'anneal.noOptimum':
    'There is no exhaustive optimum at this size to compare against; the two methods can only be compared with each other.',
  'anneal.trace.title': 'Trajectory of the first anneal',
  'anneal.trace.optimum': 'optimum',
  'anneal.trace.steps': (p: TParams) => `steps → (${p.n} in total)`,
  'anneal.trace.legend': (
    <>
      <strong>Reading the chart:</strong> the top half is energy falling over the steps: colour for digital
      annealing, grey for single-trial simulated annealing, the dashed green line for the exhaustive optimum. The
      bottom half is the digital annealer’s <Math>{'E_{\\text{off}}'}</Math>: it climbs while no flip is accepted and
      drops to zero as soon as one is. Late in the anneal, when the temperature is low and nearly every uphill move is
      rejected, the sawtooth is densest — that is the offset pushing the trajectory out of a local minimum.
    </>
  ),
  'anneal.precision.title': 'Does it fit the DA’s registers?',
  'anneal.precision.intro': (
    <>
      The DA takes its coefficients as fixed-width signed integers: linear <Math>{'h_i = q_{ii}'}</Math>, quadratic{' '}
      <Math>{'J_{ij} = 2q_{ij}'}</Math>. If they do not fit they are multiplied by one common factor and rounded; that
      is how the paper put its Gaussian instances on the first-generation DA, and Fujitsu’s cloud service does it
      automatically. The common factor cannot move the optimum; <strong>only the rounding can</strong>.
    </>
  ),
  'anneal.precision.col.linear': 'Linear h',
  'anneal.precision.col.quadratic': 'Quadratic J',
  'anneal.precision.col.fits': 'Loads unchanged',
  'anneal.precision.needed': 'This Q needs',
  'anneal.precision.bits': (p: TParams) => `${p.bits} bits (max |value| ${p.max})`,
  'anneal.precision.nonInteger': 'non-integer, must be scaled',
  'anneal.precision.register': (p: TParams) => `${p.bits} bits`,
  'anneal.precision.da1': 'First-generation DA (1,024 bits)',
  'anneal.precision.da3': 'Third generation on (100,000 bits)',
  'anneal.precision.fits': 'yes',
  'anneal.precision.scaled': 'scaled',
  'anneal.precision.what': (p: TParams) =>
    `If the quadratic register had only ${p.bits} bits (max ±${p.max}; linear gets 10 more, as in the first generation’s 26/16):`,
  'anneal.precision.tooLarge': (p: TParams) =>
    `Above ${p.max} variables the rounded problem is not enumerated; this demonstration runs on the small cases only.`,
  'anneal.precision.untouched': (p: TParams) =>
    `This Q already fits in ${p.bits} bits: no scaling, nothing rounded. Try fewer bits.`,
  'anneal.precision.kept': (p: TParams) =>
    `The optimum survives. After multiplying by ${p.scale}, ${p.rounded} coefficients were rounded, without moving the optimum.`,
  'anneal.precision.moved': (p: TParams) =>
    `The optimum moved. After multiplying by ${p.scale} and rounding ${p.rounded} coefficients, the rounded problem’s optimum scores only y = ${p.got} on the original Q; the true optimum is ${p.optimum}. The wider the coefficient range (a larger penalty P widens it), the more easily the small terms round away.`,
  'anneal.note': (
    <>
      Three things to be clear about. First, this <strong>reproduces the algorithm, not Fujitsu’s hardware</strong>.
      The chip completes a step’s n trials at once, while a browser spends O(n) per step; so this shows{' '}
      <strong>how</strong> the method moves, not <strong>how fast</strong>, and it cannot be used to benchmark
      Fujitsu’s product. Second, “the same number of steps” is how the paper compares them, but digital annealing
      evaluates n flips per step, n times the work of single trial. Third, parallel trial is not a cure-all: across
      this site’s cases (32 anneals each, default schedule) it reaches the optimum more often (966/992 versus 916/992), with the gap concentrated in the
      heavily constrained extended cases, and an independent benchmark (Oshiyama &amp; Ohzeki 2022) likewise found it
      ahead only on some problem classes. Running on a real DA needs a Fujitsu cloud account (Web API); this site does{' '}
      <strong>not yet</strong> emit code that calls it.
    </>
  ),

  // ── DA3 submission structure ──────────────────────────────────────────
  'daSubmit.title': 'Handing it to a third-generation DA: one case, three ways',
  'daSubmit.intro': (
    <>
      The paper folds every constraint into a single Q, held in place by a <strong>hand-picked P</strong>. From the
      third generation on, Fujitsu’s service takes more structure: objective and penalty can be submitted as{' '}
      <strong>two separate polynomials</strong>, and one-hot groups and linear inequalities can be{' '}
      <strong>declared directly</strong>. The table sets this case’s three forms side by side. The split is obtained
      by deriving the same model at P = 0 and at P = 1 and subtracting, not by a separate set of rules.
    </>
  ),
  'daSubmit.col.paper': 'Paper: one Q',
  'daSubmit.col.split': 'Split: objective + penalty',
  'daSubmit.col.native': 'Native constraints',
  'daSubmit.row.submit': 'What is submitted',
  'daSubmit.row.vars': 'Variables',
  'daSubmit.row.P': 'Role of P',
  'daSubmit.row.constraints': 'Constraints',
  'daSubmit.paper.submit': 'one Q matrix',
  'daSubmit.split.submit': 'objective polynomial + penalty polynomial (its shape at P = 1)',
  'daSubmit.native.submit': 'objective polynomial + constraint declarations',
  'daSubmit.slackSaved': (p: TParams) => `${p.n} slack bits saved`,
  'daSubmit.paper.P': (p: TParams) => `fixed at ${p.P}, chosen by the modeller`,
  'daSubmit.split.P': 'becomes the penalty weight, which the solver can adjust during the anneal',
  'daSubmit.native.P': 'needed only for equalities that cannot be declared (and higher-order reductions)',
  'daSubmit.paper.constraints': 'all become penalty terms; inequalities first gain slack bits',
  'daSubmit.split.constraints': 'all in the penalty polynomial, which is 0 when feasible',
  'daSubmit.native.constraints': (p: TParams) =>
    `${p.oneHot} one-hot, ${p.inequality} inequalities, ${p.equality} other equalities kept as penalties`,
  'daSubmit.none': 'This case has no constraints: the objective is everything, and the three forms coincide.',
  'daSubmit.check': (p: TParams) => (
    <>
      <strong>At the current best assignment:</strong> objective = {String(p.cost)}, penalty = {String(p.penalty)};
      objective + {String(p.P)} × penalty = {String(p.total)}, which is exactly this assignment’s energy on Q plus
      the constant ({String(p.y)}; negated for a max problem, since the DA always minimises). A zero penalty means
      every constraint holds.
    </>
  ),
  'daSubmit.oneHot.oneWay': (p: TParams) => `One-hot: ${p.n} disjoint groups (one-way one-hot)`,
  'daSubmit.oneHot.twoWay': (p: TParams) =>
    `One-hot: a grid of ${p.rows} rows × ${p.cols} columns, one pick per row and per column (two-way one-hot)`,
  'daSubmit.oneHot.overlapping': (p: TParams) =>
    `One-hot: ${p.n} groups that overlap without forming a grid; only a disjoint subset can use the one-hot interface, the rest stay penalties`,
  'daSubmit.kind.oneHot': 'one-hot',
  'daSubmit.kind.inequality': 'inequality',
  'daSubmit.kind.equality': 'penalty',
  'daSubmit.list.constraint': 'Constraint',
  'daSubmit.list.declared': 'Can be declared as',
  'daSubmit.list.slack': 'Slack bits',
  'daSubmit.note': (
    <>
      This shows the <strong>structure</strong> of a submission, not Fujitsu’s request format: the full format is in
      Fujitsu’s API reference (QUBO API V3c/V4), which is not public, and details such as whether a one-hot group’s
      variables must be consecutive are not reproduced here. Native inequalities have one more advantage: in §5.5 the
      paper bounds the slack below the row’s full range, so some feasible solutions always carry a penalty in the
      QUBO; declaring the inequality directly avoids that.
    </>
  ),

  'overview.cost.title': 'What QUBO really costs',
  'overview.cost.lead': (
    <>
      Everything above is what QUBO <strong>buys</strong>: one interface, a whole row of interchangeable
      solvers. This section is what it <strong>sells</strong>. QUBO trades <strong>structure</strong> for{' '}
      <strong>generality</strong>. The information a solver could have exploited in the original problem —
      which constraints there are, which variables are mutually exclusive, what the linear relaxation looks
      like — is flattened out in the course of being pressed into a single Q matrix. This is not an
      implementation detail but the intrinsic price of the standard form, and one the paper, given its
      position, has little reason to dwell on.
    </>
  ),
  'overview.cost.item1.title': 'Constraints are crushed into penalties, and the structure goes with them',
  'overview.cost.item1.body': (
    <>
      Take the minimum vertex cover on this site (§4.1). The original problem is “minimise{' '}
      <Math>{'\\sum x_i'}</Math>” plus six constraints saying each edge is covered at least once. The
      objective is linear and the constraints are sparse, which is an ideal situation for a MIP solver: the
      linear relaxation is tight and branch-and-bound prunes cleanly.
      <br />
      After the conversion to QUBO, the six constraints have been absorbed into the diagonal ({' '}
      <Math>{'1'}</Math> becomes <Math>{'-15'}</Math> and <Math>{'-23'}</Math>), a constant{' '}
      <Math>{'= 48'}</Math> appears, and <strong>the solver can no longer see that six constraints were
      ever there</strong>. Constraint propagation, cutting planes, relaxation bounds — none of them apply
      any more. What is left is a quadratic with no structure in it.
      <br />
      The side charge is that the penalty scalar <Math>{'P'}</Math> now has to be tuned by hand: too small
      and the optimum wanders into the infeasible region (drag the slider left on any case page to watch
      it); too large and the objective is flattened, so heuristics and hardware can no longer tell one good
      solution from another. A MIP solver has no such problem: a constraint is a constraint.
    </>
  ),
  'overview.cost.item2.title': 'The dynamic range of the coefficients explodes',
  'overview.cost.item2.body': (
    <>
      Every input to the quadratic knapsack (§5.5) is a single digit: values 2–10, weights 3–8, capacity
      16. After Transformation #1 with <Math>{'P = 10'}</Math>, the entries of Q run from 20 up to 1922 and
      the constant is <Math>{'-2560'}</Math> — nearly a hundredfold spread, where the original problem had
      no such range at all.
      <br />
      Solved classically this is just floating point, and harmless. But the couplers on annealing hardware
      have <strong>limited precision</strong> (a few bits in practice, plus analogue noise), so once the
      dynamic range is wide the small coefficients get quantised into the noise and vanish. Which is to
      say: models that are equivalent on paper need not stay equivalent on hardware.
    </>
  ),
  'overview.cost.item3.title': 'Inequality constraints have to be bought with slack variables',
  'overview.cost.item3.body': (
    <>
      QUBO has 0/1 variables and nothing else — there is no “≤”. An inequality constraint has to be padded
      with a slack variable into an equality before it can be squared into a penalty.
      <br />
      Still in the quadratic knapsack: 4 items, plus the slack needed to accommodate{' '}
      <Math>{'8x_1 + 6x_2 + 5x_3 + 3x_4 \\le 16'}</Math>, make <strong>Q 6×6 rather than 4×4</strong> — 50%
      larger. On real hardware that cost is multiplied again: every logical variable expands into a chain,
      so the extra dimensions feed quadratically into the physical qubit requirement (see the section
      above).
    </>
  ),
  'overview.cost.item4.title': 'No dual bound, so no idea how far from optimal you are',
  'overview.cost.item4.body': (
    <>
      This one is the most often overlooked and, in practice, frequently the most painful.
      <br />
      A MIP solver reports “this solution is guaranteed to be within 3.2% of optimal”, and that gap is
      something you can put in front of other people. A heuristic QUBO solver — tabu, simulated annealing,
      quantum annealing — <strong>hands you one number</strong> and no bound at all. You cannot tell
      whether the <Math>{'-11'}</Math> you are holding is the optimum or 40% away from it.
      <br />
      The cases here hide the problem, because they are small enough for{' '}
      <code>dimod.ExactSolver</code> to enumerate and guarantee. Past roughly 20 variables that guarantee
      is gone, and <strong>nothing replaces it</strong>.
    </>
  ),
  'overview.cost.fit.title': 'Signs QUBO is a good trade',
  'overview.cost.unfit.title': 'Signs QUBO is a bad trade',
  'overview.cost.fit.1':
    'the objective is densely quadratic already (variables interact pairwise, combinations pay a bonus)',
  'overview.cost.fit.2': 'few constraints, or none at all',
  'overview.cost.fit.3': 'the linear relaxation is loose and MIP branch-and-bound cannot prune',
  'overview.cost.fit.4':
    'cross-platform portability matters: one Q to feed a digital annealer, a GPU sampler and a QPU',
  'overview.cost.unfit.1': 'the objective is linear and all the difficulty lives in the constraints',
  'overview.cost.unfit.2':
    'many sparse, well-structured constraints (assignment, flow, scheduling and the like)',
  'overview.cost.unfit.3': 'the linear relaxation is tight and a MIP solver converges in seconds',
  'overview.cost.unfit.4': 'you need a proof of optimality, or an auditable gap',
  'overview.cost.verdict': (
    <>
      Whether the trade is worth it depends on the shape of the problem, and has little to do with how
      mature quantum hardware is:{' '}
      <strong>for a problem whose objective is densely quadratic already and whose constraints are few,
      QUBO is the natural choice; for a linear objective with a mass of structured constraints, QUBO is
      asking for trouble.</strong>
      <br />
      The Hello World (§2) and the objective of the quadratic knapsack (§5.5) are the former — that is what
      QUBO looks like in its natural habitat. Minimum vertex cover (§4.1) is the latter: it appears in the
      paper to demonstrate how the penalty method works, not because QUBO is a good way to solve it.
      <br />
      The penalty pages that follow repay reading with this question in hand:{' '}
      <strong>how much solver-usable information did the constraints that were absorbed here carry?</strong>
    </>
  ),

  // ── per-case scenarios ────────────────────────────────────────────────
  // The paper names its cases by section number and jumps straight to the
  // algebra. These give each one a concrete story first, so a reader meets
  // "what is this for" before "here is the Q matrix".
  'scenario.heading': 'What this case is solving',
  'scenario.xMeans': 'What x means',
  'scenario.uses': 'Real applications',

  'case.number-partitioning.name': 'Number partitioning',
  'case.number-partitioning.scenario': (
    <>
      A shipment has to be split across two lorries. The eight crates weigh 25, 7, 13, 31, 42, 17, 21 and
      10, for a total of 166. Both lorries are going out, and the loads should be{' '}
      <strong>as close to equal as possible</strong>: 83 each would be ideal. The smaller the difference,
      the better.
    </>
  ),
  'case.number-partitioning.xMeans':
    'xⱼ = 1 puts crate j on lorry A; xⱼ = 0 puts it on lorry B.',
  'case.number-partitioning.uses':
    'balancing workloads on a production line, distributing server load, splitting staff or budget into two halves, circuit partitioning',

  'case.max-cut.name': 'Max-Cut',
  'case.max-cut.scenario': (
    <>
      Split the nodes of a network into two groups so that as many links as possible{' '}
      <strong>cross between them</strong>. Read the other way round, this looks for the network’s weakest
      seam: cut where, and you sever the most connections.
    </>
  ),
  'case.max-cut.xMeans': 'xᵢ = 1 puts node i in group B; xᵢ = 0 leaves it in group A.',
  'case.max-cut.uses':
    'chip routing layers, foreground/background image segmentation, polarised communities in social networks, spin glasses in statistical physics',

  'case.min-vertex-cover.name': 'Minimum vertex cover',
  'case.min-vertex-cover.scenario': (
    <>
      Treat the nodes as junctions and the edges as streets. Cameras go on junctions, and{' '}
      <strong>every street must be watched by at least one of them</strong>; the question is how few
      cameras that takes, and where they go. This instance has 5 junctions and 6 streets.
    </>
  ),
  'case.min-vertex-cover.xMeans': 'xᵢ = 1 puts a camera on junction i.',
  'case.min-vertex-cover.uses':
    'sensor and camera placement, protecting critical network nodes, key proteins in biological networks, minimal covering sets in software testing',

  'case.set-packing.name': 'Maximum set packing',
  'case.set-packing.scenario': (
    <>
      Four candidate proposals are on the table, and certain pairs of them{' '}
      <strong>conflict</strong> — they want the same resource, or the same time slot — so conflicting
      proposals cannot both be chosen. Choose as many as possible without a conflict.
    </>
  ),
  'case.set-packing.xMeans': 'xⱼ = 1 selects proposal j.',
  'case.set-packing.uses':
    'booking rooms and equipment, compatible flight/crew combinations, ad slot allocation, wireless channel assignment',

  'case.max-independent-set.name': 'Maximum independent set',
  'case.max-independent-set.scenario': (
    <>
      Think of the nodes as people and each edge as “these two do not get along”. Pick a team in which{' '}
      <strong>no two members conflict</strong>, as large as possible. The graph is the same 5-node, 6-edge one
      used for minimum vertex cover.
    </>
  ),
  'case.max-independent-set.xMeans': 'xᵢ = 1 puts node i in the set.',
  'case.max-independent-set.uses':
    'wireless channel and frequency allocation, scheduling jobs that can run together on a conflict graph, choosing codewords for error-correcting codes, module analysis in biological networks',
  'case.max-independent-set.anchor': (
    <>
      The paper never states this answer, but it follows from a number the paper does print: a set of nodes is
      independent exactly when the remaining nodes form a vertex cover. This page uses §4.1’s graph, whose
      minimum cover §4.1 prints as 3, so the maximum independent set must be <strong>5 − 3 = 2</strong>. The
      verification script asserts that the search finds exactly this value.
    </>
  ),

  'case.max-clique.name': 'Maximum clique',
  'case.max-clique.scenario': (
    <>
      Think of the nodes as people and each edge as “these two know each other”. Find the largest group in
      which <strong>every two members know each other</strong>. The graph is the same 5-node, 6-edge one. It is the
      mirror image of maximum independent set: there no two members may be adjacent, here every two must be.
    </>
  ),
  'case.max-clique.xMeans': 'xᵢ = 1 puts node i in the clique.',
  'case.max-clique.uses':
    'finding tight-knit circles in social networks, functional modules in protein interaction networks, linked accounts in financial transaction networks, chemical structure matching',

  'case.max-diversity.name': 'Maximum diversity',
  'case.max-diversity.scenario': (
    <>
      From eight numbers, <strong>choose exactly four</strong> so that the gaps between every pair of them add up to
      as much as possible. The numbers are the eight from §3.1’s number partitioning (25, 7, 13, 31, 42, 17, 21,
      10), and the gap is the absolute difference.
    </>
  ),
  'case.max-diversity.xMeans': 'xⱼ = 1 selects the j-th number.',
  'case.max-diversity.uses':
    'choosing the most mutually different candidates or projects, diverse compound libraries in drug screening, store siting that avoids cannibalisation, diversity in recommendation lists',

  'case.discrete-tomography.name': 'Discrete tomography',
  'case.discrete-tomography.scenario': (
    <>
      A 3×3 black-and-white image is hidden; all that is known is <strong>how many black cells each row and each
      column contains</strong> (row and column sums are both 2, 1, 2). Recover the image. It is CT scanning in
      miniature: work back from projections to what is inside.
    </>
  ),
  'case.discrete-tomography.xMeans':
    'Variables are numbered row by row (x₁…x₉: row 1 left to right, then row 2, …); = 1 makes that cell black.',
  'case.discrete-tomography.uses':
    'medical and industrial CT reconstruction, lattice reconstruction in electron microscopy, detecting internal defects in materials',

  'case.task-allocation.name': 'Task allocation',
  'case.task-allocation.scenario': (
    <>
      Three computing tasks must be placed on two processors. Each task has a different <strong>execution
      cost</strong> on each processor, and two tasks placed on different processors also pay a <strong>communication
      cost</strong> between them. Decide where each task runs so that the total cost is lowest.
    </>
  ),
  'case.task-allocation.xMeans':
    'Variables run task by processor: x₁, x₂ put task 1 on processor 1 or 2, x₃, x₄ are task 2, and so on; = 1 places it there.',
  'case.task-allocation.uses':
    'job scheduling in distributed and cloud systems, thread placement on multi-core processors, microservice deployment, offloading decisions in edge computing',

  'case.capital-budgeting.name': 'Capital budgeting',
  'case.capital-budgeting.scenario': (
    <>
      Four investment projects each have a value, but every project draws on <strong>two budget periods</strong>,
      each with its own limit. Which projects maximise total value without overspending in either period? The
      values and period 1 come from §5.5; period 2 is this site’s.
    </>
  ),
  'case.capital-budgeting.xMeans': 'xⱼ = 1 funds project j; the variables after them are each period’s slack bits.',
  'case.capital-budgeting.uses':
    'annual corporate investment portfolios, ranking public infrastructure, R&D portfolio management, IT budget allocation',

  'case.multiple-knapsack.name': 'Multiple knapsack',
  'case.multiple-knapsack.scenario': (
    <>
      Four items, two knapsacks (capacities 10 and 8). Each item goes into <strong>at most one knapsack</strong>, no
      knapsack may be overloaded, and the total value packed should be as large as possible. Item weights and
      values are §5.5’s four projects.
    </>
  ),
  'case.multiple-knapsack.xMeans':
    'Variables run item by knapsack: x₁, x₂ put item 1 in knapsack 1 or 2, and so on; then come the two capacities’ slack bits.',
  'case.multiple-knapsack.uses':
    'loading containers and vehicles, placing virtual machines on hosts, splitting an ad budget across channels, assigning jobs to production lines',

  'case.p-median.name': 'P-median',
  'case.p-median.scenario': (
    <>
      Four customers sit along a road (at 0, 2, 7, 10) with three candidate sites (at 1, 5, 9). Open{' '}
      <strong>exactly 2 sites</strong> and serve every customer from one of them so that the total distance is
      as small as possible.
    </>
  ),
  'case.p-median.xMeans':
    'The first 12 variables run customer by site, = 1 meaning that site serves that customer; the last 3, y₁…y₃, = 1 open that site.',
  'case.p-median.uses':
    'siting distribution centres and warehouses, placing fire and ambulance stations, retail store networks, k-medoids clustering',

  'case.warehouse-location.name': 'Warehouse location',
  'case.warehouse-location.scenario': (
    <>
      The same four customers and three candidate sites, but now <strong>each site has an opening cost</strong> (4,
      1, 6) and any number may be opened. Trade opening costs against travel distance to minimise the total.
    </>
  ),
  'case.warehouse-location.xMeans':
    'As in P-median: the first 12 variables assign customers to sites, and the last 3, y₁…y₃, open the sites.',
  'case.warehouse-location.uses':
    'planning warehouses and distribution centres, plant location, rolling out charging stations and base stations, data-centre siting',

  'case.linear-ordering.name': 'Linear ordering',
  'case.linear-ordering.scenario': (
    <>
      Five judges compare four items pair by pair — for example, 4 of them prefer item 1 to item 2. Produce one{' '}
      <strong>overall ranking</strong> that agrees with the judges as often as possible. The difficulty: the
      majorities form a cycle — most prefer 1 to 2 and 2 to 4, yet also 4 to 1.
    </>
  ),
  'case.linear-ordering.xMeans':
    'One variable per pair i < j (x₁₂, x₁₃, …, x₃₄), = 1 putting i ahead of j; then come the slack bits that rule out cycles.',
  'case.linear-ordering.uses':
    'rank aggregation (merging judges or search engines), sports rankings, triangulating input–output tables in economics, seriation in archaeology',

  'case.clique-partitioning.name': 'Clique partitioning',
  'case.clique-partitioning.scenario': (
    <>
      Every pair of four nodes has a similarity, positive (wants to be together) or negative (wants to be
      apart). Split the nodes into <strong>any number of groups</strong> so the total similarity inside groups
      is as large as possible.
    </>
  ),
  'case.clique-partitioning.xMeans':
    'Variables run node by group (4 nodes, up to 4 groups): x₁…x₄ put node 1 in group 1–4, and so on; = 1 places it there.',
  'case.clique-partitioning.uses':
    'correlation clustering, community detection, gene clustering in bioinformatics, machine–part grouping in manufacturing',

  'case.max-3-sat.name': 'Maximum 3-satisfiability',
  'case.max-3-sat.scenario': (
    <>
      Like maximum 2-satisfiability, but each condition now needs <strong>one of three</strong> statements to hold:
      eight conditions, each three yes/no statements joined by “or”, and as many conditions as possible should
      hold. This set has exactly one assignment that satisfies them all.
    </>
  ),
  'case.max-3-sat.xMeans':
    'xᵢ = 1 makes statement i true; x₅ is the auxiliary the reduction adds, standing for x₁x₂.',
  'case.max-3-sat.uses':
    'circuit and hardware verification, software model checking, logical encodings of scheduling and planning, cryptanalysis',

  'case.constraint-satisfaction.name': 'Constraint satisfaction (team split)',
  'case.constraint-satisfaction.scenario': (
    <>
      Six people are to be split into two teams, and six trios are listed: <strong>no trio may end up entirely
      on one team</strong>. Find every way to do it. Constraints of this “not all equal” kind are also known as
      set splitting, or 2-colouring a hypergraph.
    </>
  ),
  'case.constraint-satisfaction.xMeans': 'xᵢ = 1 puts person i on team 2; = 0 on team 1.',
  'case.constraint-satisfaction.uses':
    'hard rules in grouping and rostering, block assignment in experimental design, circuit partitioning, balance conditions in coding theory',

  'case.warehouse-location.provenance': (
    <>
      <strong>Matches the authors’ own method.</strong> The paper’s §1 list comes from Kochenberger &amp; Glover
      (2006). Their §5.1 treats this class of problem by complementing y and applying Transformation #2, giving{' '}
      <code>P·xᵢⱼ(1 − yⱼ)</code> — which expands to the p.10 row-4 penalty <code>P(xᵢⱼ − xᵢⱼyⱼ)</code> used on this
      page, term for term, and likewise needs no new variables. Their instances are random, so the method can be
      compared, not the numbers.
    </>
  ),
  'case.constraint-satisfaction.provenance': (
    <>
      <strong>Not the authors’ own formulation.</strong> The paper’s §1 list comes from Kochenberger &amp; Glover
      (2006), whose §5.2 treats CSPs as linear systems <code>Ax = b</code> (coefficients −1, 0, 1; right-hand
      sides 1 or 2), recast with Transformation #1 at P = 2. “Not all equal” is a CSP too, but a different one —
      chosen here to show cubic terms cancelling, which Max 3-SAT alone cannot.
    </>
  ),
  'case.graph-partitioning.name': 'Graph partitioning',
  'case.graph-partitioning.scenario': (
    <>
      Split the nodes of a network into two groups (of 2 and 3) so that <strong>as few links as possible cross
      between them</strong> — splitting work across two machines while keeping their communication down, say.
      It is §3.2’s Max-Cut graph: Max-Cut cuts as many edges as possible, this cuts as few.
    </>
  ),
  'case.graph-partitioning.xMeans': 'xᵢ = 1 puts node i in group 1 (which has exactly 2 nodes).',
  'case.graph-partitioning.uses':
    'dividing work in parallel computing, partitioning integrated circuits, clustering social networks, mesh partitioning for large simulations',

  'case.portfolio.name': 'Portfolio selection',
  'case.portfolio.scenario': (
    <>
      Five assets each have an expected return, and their movements are correlated (covariance). Hold{' '}
      <strong>exactly 3</strong> of them so that risk minus return is as small as possible. The highest-return
      assets are not necessarily best: they may rise and fall together, compounding the risk.
    </>
  ),
  'case.portfolio.xMeans': 'xᵢ = 1 holds asset i.',
  'case.portfolio.uses':
    'asset allocation for funds and pensions, choosing constituents to track an index, diversifying a project portfolio',

  'case.max-matching.name': 'Maximum weight matching',
  'case.max-matching.scenario': (
    <>
      Think of the nodes as people and each edge as “could work together”, with the number on it the value of
      the pairing. Each person may have <strong>at most one partner</strong>; maximise the total value of the
      pairs. The graph is §3.2’s, with a weight on each of its six edges.
    </>
  ),
  'case.max-matching.xMeans': 'One variable per edge (x₁₂, x₁₃, …, x₄₅); = 1 pairs those two nodes.',
  'case.max-matching.uses':
    'matching people to tasks, kidney-exchange pairing, link scheduling in wireless networks, bond structures in chemistry',

  'case.community-detection.name': 'Community detection',
  'case.community-detection.scenario': (
    <>
      A social network of six people: two tight trios joined by a single acquaintance. Split them into{' '}
      <strong>two communities</strong> so that links inside communities exceed what chance would predict by as
      much as possible — the measure called modularity.
    </>
  ),
  'case.community-detection.xMeans':
    'Variables run node by community: x₁, x₂ put node 1 in community 1 or 2, and so on; = 1 places it there.',
  'case.community-detection.uses':
    'social network analysis, functional modules in protein networks, research fields in citation networks, partitioning power grids',

  'case.shortest-path.name': 'Shortest path',
  'case.shortest-path.scenario': (
    <>
      A small road network with several one-way routes from S to T, each road with a length. Find the route
      with the <strong>smallest total length</strong>.
    </>
  ),
  'case.shortest-path.xMeans': 'One variable per directed road (S→A, S→B, …, C→T); = 1 means the route uses it.',
  'case.shortest-path.uses': 'navigation and route planning, packet routing, robot and maze path finding, logistics routes',

  'case.travelling-salesman.name': 'Travelling salesman (vehicle routing)',
  'case.travelling-salesman.scenario': (
    <>
      A vehicle starts at city 1 and must <strong>visit every city once and return</strong>, travelling as short a
      distance as possible. It is the core of vehicle routing with one vehicle and no capacity limit.
    </>
  ),
  'case.travelling-salesman.xMeans':
    'Variables run city 2–4 by position 2–4 (city 1 is fixed first); = 1 puts that city at that position.',
  'case.travelling-salesman.uses':
    'delivery and pickup routes, drilling order for circuit boards, inspection rounds, ordering fragments in genome sequencing',

  'case.traffic-flow.name': 'Traffic flow optimisation',
  'case.traffic-flow.scenario': (
    <>
      Three cars each have three candidate routes, and their original routes all crowd onto the same stretch of
      road. Give <strong>each car one route</strong> so that total congestion — the squared number of cars on each
      road segment, summed — is as low as possible. A miniature of Volkswagen and D-Wave’s study on Beijing taxi
      data.
    </>
  ),
  'case.traffic-flow.xMeans':
    'Variables run car by route: x₁…x₃ are car 1’s three routes, and so on; = 1 takes that route.',
  'case.traffic-flow.uses':
    'real-time traffic redirection, fleet and ride-sharing route assignment, spreading network traffic over paths, logistics fleet scheduling',

  'case.max-2-sat.name': 'Max 2-satisfiability',
  'case.max-2-sat.scenario': (
    <>
      A pile of conditions all of the form “A or B”, each involving just two yes/no questions. The
      conditions <strong>contradict one another</strong>, so satisfying all of them is impossible and the
      goal retreats to satisfying as many as possible. This instance has 4 variables and 12 clauses.
    </>
  ),
  'case.max-2-sat.xMeans': 'xᵢ = 1 answers the i-th yes/no question with “yes”.',
  'case.max-2-sat.uses':
    'circuit and hardware verification, soft preferences in rostering, energy minimisation in computer vision, pairwise constraints in recommender systems',

  'case.set-partitioning.name': 'Set partitioning',
  'case.set-partitioning.scenario': (
    <>
      The airline classic. Four flight legs have to be flown and six ready-made crew rosters are available,
      each covering some of the legs at its own cost. Every leg must be covered{' '}
      <strong>exactly once</strong> — nothing missed, nobody double-crewed — at the lowest total cost.
    </>
  ),
  'case.set-partitioning.xMeans': 'xⱼ = 1 uses roster j.',
  'case.set-partitioning.uses':
    'airline crew scheduling, bus and freight route planning, shift rota construction, electoral districting',

  'case.graph-coloring.name': 'Graph colouring',
  'case.graph-coloring.scenario': (
    <>
      Read the nodes as courses and the edges as “these two share students”. Two courses with students in
      common <strong>cannot be timetabled in the same slot</strong>. Given 5 courses, 7 conflicts and 3
      slots, is there a timetable at all?
      <br />
      Note that this case has <strong>no objective function</strong> — it only looks for a feasible
      solution. Producing a timetable is the whole win; there is no “better timetable” to find.
    </>
  ),
  'case.graph-coloring.xMeans':
    'x is a node × colour expansion: cell (i, c) = 1 paints node i with colour c, i.e. schedules it in slot c.',
  'case.graph-coloring.uses':
    'exam and course timetabling, frequency assignment for base stations, register allocation in compilers, sports fixture scheduling',

  'case.general-01.name': 'General 0/1 linear programme',
  'case.general-01.scenario': (
    <>
      This case <strong>deliberately has no story</strong>. It is a worked template: any problem of the
      form “0/1 variables + linear objective + linear constraints”, whatever field it comes from, can be
      turned into a QUBO by this procedure.
      <br />
      All three constraint types (<code>≤</code>, <code>=</code>, <code>≥</code>) appear at once here, and
      the binary expansion of the slack variables is demonstrated in full.
    </>
  ),
  'case.general-01.xMeans':
    'x₁…x₅ are five yes/no decisions with no assigned meaning; everything from x₆ on is a slack bit added to turn an inequality into an equality.',
  'case.general-01.uses':
    'this is the recipe itself rather than an application; every other case in this group is a special case of it',

  'case.qap.name': 'Quadratic assignment problem',
  'case.qap.scenario': (
    <>
      Several departments in a plant have to be assigned to several sites. Each pair of departments has a
      fixed daily <strong>material flow</strong> between them, each pair of sites a fixed{' '}
      <strong>distance</strong>, and the total cost is the sum of flow × distance. Decide which department
      goes where so that the total transport cost is lowest.
      <br />
      The cost depends on <strong>a combination of two decisions</strong> (A goes here and B goes there,
      only then is there a distance to speak of), so the problem is quadratic by nature — QUBO’s native
      shape.
    </>
  ),
  'case.qap.xMeans':
    'x is a facility × location expansion: cell (i, k) = 1 puts facility i at location k.',
  'case.qap.uses':
    'plant and hospital department layout, keyboard layout design, component placement on chips, rack allocation in data centres',

  'case.quadratic-knapsack.name': 'Quadratic knapsack',
  'case.quadratic-knapsack.scenario': (
    <>
      Four projects can be funded, each with its own expected return, but there are also{' '}
      <strong>pairwise synergies</strong>: certain pairs done together earn a bonus. Each project consumes
      part of a budget totalling 16. Pick a set of projects maximising “individual returns + combination
      bonuses”.
      <br />
      So picking by unit value alone will not do: a project that looks like good value may not be worth
      doing if it crowds out a better pairing.
    </>
  ),
  'case.quadratic-knapsack.xMeans':
    'xⱼ = 1 funds project j; x₅ and x₆ are the slack bits for the budget inequality.',
  'case.quadratic-knapsack.uses':
    'project portfolios and R&D selection, portfolio allocation, marketing bundles, complementarity in facility siting',

  // ── domain views ──────────────────────────────────────────────────────
  'domain.partition.subset1': 'Subset 1',
  'domain.partition.subset2': 'Subset 2',
  'domain.partition.diff': (p: TParams) => `difference ${p.diff}`,
  'domain.partition.perfect': 'perfect split',
  'domain.graph.setA': 'Set A',
  'domain.graph.setB': 'Set B',
  'domain.graph.cutValue': (p: TParams) => `cut size = ${p.value}`,
  'domain.cover.size': (p: TParams) => `cover size = ${p.size}`,
  'domain.cover.uncovered': 'uncovered edges',
  'domain.color.conflict': 'conflicting edge (same colour at both ends)',
  'domain.color.feasible': 'valid colouring',
  'domain.independent.size': (p: TParams) => `independent set size = ${p.size}`,
  'domain.independent.conflict': 'edges with both ends chosen',
  'domain.clique.size': (p: TParams) => `clique size = ${p.size}`,
  'domain.clique.missing': 'chosen pairs that are not adjacent',
  'domain.diversity.total': (p: TParams) => `total distance = ${p.value}`,
  'domain.diversity.count': (p: TParams) => `${p.count} of ${p.pick} chosen`,
  'domain.tomo.match': 'all projections match',
  'domain.tomo.mismatch': 'projections do not match',
  'domain.tomo.note':
    'The numbers beside the grid read “current / target”. For the other images with the same projections, see the degeneracy on the solutions tab.',
  'domain.alloc.task': 'task',
  'domain.alloc.proc': 'processor',
  'domain.alloc.exec': (p: TParams) => `execution ${p.value}`,
  'domain.alloc.comm': (p: TParams) => `communication ${p.value}`,
  'domain.alloc.total': (p: TParams) => `total cost = ${p.value}`,
  'domain.alloc.note': 'Each cell is that task’s execution cost on that processor; blue is the current placement.',
  'domain.budget.project': (p: TParams) => `project ${p.j} (value ${p.value})`,
  'domain.budget.period': (p: TParams) => `period ${p.k} budget`,
  'domain.mknap.sack': (p: TParams) => `knapsack ${p.k}`,
  'domain.mknap.left': (p: TParams) => `left out: ${p.items}`,
  'domain.mknap.note': 'One bar per knapsack, reading “used / capacity”.',
  'domain.facility.distance': (p: TParams) => `distance ${p.value}`,
  'domain.facility.fixed': (p: TParams) => `opening ${p.value}`,
  'domain.facility.total': (p: TParams) => `total cost = ${p.value}`,
  'domain.facility.note':
    'Squares are candidate sites (blue = open), circles are customers; each link shows which site serves the customer, red dashed if that site is closed.',
  'domain.order.item': (p: TParams) => `item ${p.i}`,
  'domain.order.consistent': 'no cycle in the ranking',
  'domain.order.cycle': 'contains a cycle — not a valid ranking',
  'domain.order.agreement': (p: TParams) => `agrees with judges ${p.value} / ${p.total}`,
  'domain.order.note':
    'Agreement = the model’s net value + the constant 12, which a constrained model has no place for and is added back here.',
  'domain.cluster.inside': (p: TParams) => `similarity inside groups = ${p.value}`,
  'domain.cluster.invalid': 'some node is not in exactly one group',
  'domain.cluster.note': (p: TParams) => `similarities: ${p.weights}`,
  'domain.teams.team': (p: TParams) => `team ${p.k}`,
  'domain.teams.ok': 'every trio is split across the teams',
  'domain.teams.bad': (p: TParams) => `${p.count} trio(s) entirely on one team`,
  'domain.matching.total': (p: TParams) => `matching weight = ${p.value}`,
  'domain.matching.clash': (p: TParams) => `${p.count} node(s) touch two or more chosen edges`,
  'domain.portfolio.asset': (p: TParams) => `asset ${p.i}`,
  'domain.portfolio.return': 'expected return',
  'domain.portfolio.variance': 'own variance',
  'domain.portfolio.totalReturn': (p: TParams) => `total return ${p.value}`,
  'domain.portfolio.totalRisk': (p: TParams) => `total risk ${p.value}`,
  'domain.portfolio.objective': (p: TParams) => `risk − return = ${p.value}`,
  'domain.portfolio.note':
    'Total risk is the sum of every covariance among the assets held — pairwise links included, not just each asset’s own variance.',
  'domain.community.q': (p: TParams) => `modularity Q = ${p.q} (${p.num}/${p.den})`,
  'domain.community.invalid': 'some node is not in exactly one community',
  'domain.path.length': (p: TParams) => `route length = ${p.value}`,
  'domain.path.broken': (p: TParams) => `${p.count} node(s) out of balance — not a single route`,
  'domain.tour.length': (p: TParams) => `tour length = ${p.value}`,
  'domain.tour.invalid': 'not a valid tour (some city or position is not used exactly once)',
  'domain.tour.note': 'City 1 (orange) is fixed as start and end.',
  'domain.traffic.route': (p: TParams) => `route ${p.r}`,
  'domain.traffic.car': (p: TParams) => `car ${p.i}`,
  'domain.traffic.congestion': (p: TParams) => `congestion = Σ cars² = ${p.value}`,
  'domain.traffic.note':
    'Each cell lists the segments of a route; below, how many cars each segment carries now, red for more than one.',
  'domain.assign.facility': 'Facility',
  'domain.assign.location': 'Location',
  'domain.assign.cost': (p: TParams) => `weighted flow cost = ${p.cost}`,
  'domain.knapsack.budget': (p: TParams) => `budget ${p.used} / ${p.total}`,
  'domain.knapsack.value': (p: TParams) => `total value = ${p.value}`,
  'domain.sat.count': (p: TParams) => `${p.sat} / ${p.total} clauses satisfied`,
  'domain.sat.current': (p: TParams) =>
    `Currently ${p.vars} variables · ${p.clauses} clauses → the QUBO is still ${p.vars}×${p.vars}`,
  'domain.sat.auxNote': (p: TParams) => (
    <>
      Unlike Max 2-SAT, this QUBO has <strong>{String(p.aux)} {p.aux === 1 ? 'auxiliary variable' : 'auxiliary variables'} beyond the original ones</strong>:
      three-literal clauses produce cubic terms, which §7 point 4’s reduction can only remove by adding variables.
      So §4.3’s “QUBO size is independent of the clause count” does not hold here.
    </>
  ),
  'domain.sat.sizeNote': (
    <>
      Note that the size of a QUBO is <strong>set by the variable count alone and is completely
      independent of the clause count</strong>. From p.17: a Max 2-SAT with 200 variables and 30,000
      clauses is still only a 200-variable QUBO. Add a few clauses and see for yourself — the numbers in Q
      change, the dimension does not.
    </>
  ),

  // ── editors ───────────────────────────────────────────────────────────
  'editor.title': 'Custom input',
  'editor.numbers.label': 'Set of numbers (comma-separated)',
  'editor.numbers.helper': 'The Q matrix and the optimum are recomputed as you type.',
  'editor.numbers.invalid': 'Please enter comma-separated positive integers.',
  'editor.graph.hint': 'Click a node to add or remove it; click two nodes to toggle the edge between them.',
  'editor.graph.addNode': 'Add node',
  'editor.graph.removeNode': 'Remove node',
  'editor.graph.clear': 'Clear edges',
  'editor.colors.label': 'Number of colours K',
  'editor.sat.add': 'Add clause',
  'editor.sat.vars': 'Variables',
  'editor.sat.clauses': (p: TParams) => `${p.count} clauses`,
  'editor.hello.linear': 'Linear coefficients',
  'editor.hello.quadratic': 'Quadratic coefficients',
  'editor.overflow': (p: TParams) =>
    `An entry of Q has reached ${p.max}, beyond the safe integer range of double-precision floating point (2^53). The paper raises this on p.27 as well; please use smaller inputs.`,

  // ── hello world ───────────────────────────────────────────────────────
  'hello.title': 'Hello World — how to read a Q matrix',
  'hello.lead': (
    <>
      The paper’s own warm-up, §2 (p.5). No constraints, no penalty, no slack variables and no domain
      meaning whatsoever — purely “what does <Math>{'x^tQx'}</Math> mean”. Four variables give just 16
      assignments, so <strong>the entire solution space fits on the page at once</strong>.
    </>
  ),
  'hello.lesson1.title': 'Linear terms live on the diagonal',
  'hello.lesson1.body': (
    <>
      A binary variable satisfies <Math>{'x_j = x_j^2'}</Math>, so <Math>{'-5x_1'}</Math> can be written{' '}
      <Math>{'-5x_1^2'}</Math> and lands on <Math>{'q_{11}'}</Math>. That is why the diagonal of Q holds
      the original linear coefficients.
    </>
  ),
  'hello.lesson2.title': 'Quadratic terms split in half across two symmetric cells',
  'hello.lesson2.body': (
    <>
      <Math>{'4x_1x_2'}</Math> splits into <Math>{'q_{12} = q_{21} = 2'}</Math>. Because{' '}
      <Math>{'x^tQx'}</Math> counts <Math>{'q_{12}'}</Math> and <Math>{'q_{21}'}</Math> once each, only
      their sum recovers the original coefficient. That is where the ±½ entries in the Q of §4.3 come from.
    </>
  ),
  'hello.lesson3.title': 'Symmetric form vs upper-triangular form',
  'hello.lesson3.body': (
    <>
      The two are entirely equivalent. The paper works in the symmetric form, while <code>dimod</code>{' '}
      wants the upper-triangular one (off-diagonal coefficients of <Math>{'2q_{ij}'}</Math>). Flip the
      switch above to see the difference; the exported Python has done this conversion for you.
    </>
  ),
  'hello.noScenario.title': 'This case deliberately has no story',
  'hello.noScenario.body': (
    <>
      Every case after this one opens with a story — which junction gets the camera, which projects are
      worth funding — before any algebra. <strong>This one does not</strong>, and that is on purpose. The
      four variables stand for nothing, and <Math>{'-11'}</Math> is not a real cost or a real return. §2
      uses it to answer exactly one question: what does the expression <Math>{'x^tQx'}</Math> mean?
      <br />
      So if you finish this page wondering what the answer could be used for, the correct answer is{' '}
      <strong>nothing at all</strong>. It is not a problem; it is a worked expression. x starts standing
      for real-world decisions in groups A, B and C.
    </>
  ),
  'hello.allStates': 'All 16 assignments',
  'hello.order.label': 'Column order',
  'hello.order.asc': (p: TParams) => `x1→x${p.n}`,
  'hello.order.desc': (p: TParams) => `x${p.n}→x1`,
  'hello.order.hint':
    'The row order never changes; the switch only reverses the left-to-right direction of the columns. Set to x4→x1, each row reads as an ordinary binary count (0000, 0001, 0010, …).',
  'hello.paperForm': 'As the paper writes it',
  'hello.paperFormBody': (
    <>
      On p.5 the paper writes the same thing as a full quadratic form: row vector of variables, Q matrix,
      column vector of variables. Put this side by side with the PDF and every cell derived here can be
      confirmed against the paper. The “Matrix form” switch on the heat map below produces the same layout.
    </>
  ),
  'hello.tryIt': 'Try it',
  'hello.tryItBody':
    'Change any coefficient below and the Q matrix on the right, along with the whole solution-space table, recomputes immediately. Press “Restore the paper’s data” to return to the original expression from §2.',
  'hello.runIt': 'Actually run it',
  'hello.browserRun': 'Solved in your browser',
  'hello.browserRunHint':
    'These are not canned answers: a Web Worker just enumerated every assignment in Gray-code order, and each number below was computed on the spot.',
  'hello.runItBody': (
    <>
      The results above were <strong>computed in your browser just now</strong>. The code below is the same
      computation in Python; paste it into Google Colab or your own environment and the results should be
      identical. The default <code>dimod.ExactSolver</code> is a purely classical solver that enumerates
      every assignment wherever your Python runs. It never contacts D-Wave, so it needs no Leap account and
      no API token, and it incurs no QPU charge.
    </>
  ),

  // ── appendix ──────────────────────────────────────────────────────────
  'appendix.title': 'Appendix · the two supplementary techniques of §7',
  'appendix.higherOrder.title': 'Reducing higher-order terms (Rosenberg reduction)',
  'appendix.higherOrder.body': (
    <>
      A QUBO can only carry quadratic terms, but some problems are cubic or worse by nature. Point 4 of §7
      introduces a new variable <Math>{'y_1'}</Math> to stand for the product <Math>{'x_1x_2'}</Math>,
      together with the penalty
      <Math block>{'P(x_1x_2 - 2x_1y_1 - 2x_2y_1 + 3y_1)'}</Math>
      This penalty is 0 only when <Math>{'y_1 = x_1x_2'}</Math>, so the optimisation forces the correct
      substitution by itself. <Math>{'x_1x_2x_3'}</Math> thereby drops to <Math>{'y_1x_3'}</Math>. Applied
      recursively, it handles any degree.
    </>
  ),
  'appendix.higherOrder.table': 'Truth table for the penalty',
  'appendix.higherOrder.tableNote': (
    <>
      The green rows are the four cases with <Math>{'y_1 = x_1x_2'}</Math>: the penalty is exactly 0 there
      and strictly positive everywhere else. So under minimisation the optimum picks the right substitution
      on its own.
    </>
  ),
  'appendix.nodeVars.title': 'Replacing edge variables with node variables',
  'appendix.nodeVars.body': (
    <>
      Point 3 of §7: in a model whose decision variables are edges — clique partitioning, for instance —
      the variable count is <Math>{'O(|V|^2)'}</Math> and runs into the millions readily enough. Replace
      each edge variable by the product of two node variables, <Math>{'x_{ij} \\to x_i x_j'}</Math>, and
      the linear model becomes a quadratic one whose variable count drops from the number of edges to the
      number of nodes — usually several orders of magnitude smaller. The quadratic model is then converted
      to a QUBO by the methods above.
    </>
  ),
  'appendix.nodeVars.example':
    'For example: on a dense graph of 1,000 nodes, the edge-variable model has around 500,000 variables, while the node-variable one has 1,000 — a factor of 500. This is exactly what point 3 of §7 means by “a graph normally has a much smaller number of nodes than edges”.',
  'appendix.penaltyValue': 'Penalty',

  // ── misc ──────────────────────────────────────────────────────────────
  'case.notFound': (p: TParams) => `No such case: ${p.id}`,
  'common.constraints': 'constraints',
  'common.min': 'minimise',
  'common.max': 'maximise',
};
