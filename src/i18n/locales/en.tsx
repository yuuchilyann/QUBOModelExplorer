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
      end are eleven problems that look completely unrelated, at the other four quite different kinds of
      hardware, and the <Math>{'x^tQx'}</Math> in between is the only shared language.
      <br />
      <br />
      Question one, always asked: “so does handing it to a quantum computer make it faster?” It does not.
      On p.34 the authors themselves report that their own classical solver, QUBO 2.0, beats mainstream
      quantum systems by three orders of magnitude. Every one of the eleven cases here is small enough for
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

  'formulation.original': 'Original model',
  'formulation.slack': 'Slack expansion',
  'formulation.penalty': 'Penalty terms',
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
  'overview.platform.digital': 'digital annealing',
  'overview.platform.classical': 'classical heuristic',
  'overview.platform.name.qaoa': 'QAOA (gate model)',
  'overview.platform.name.tabu': 'Tabu search (classical)',
  'overview.platform.name.exhaustive': 'Exhaustive search (classical)',
  'overview.topology.asic': 'fully connected (ASIC)',
  'overview.topology.varies': 'hardware-dependent',
  'overview.scale.advantage2': 'a few hundred fully connected logical variables',
  'overview.scale.digital': '1,024 variables (Aramon et al. 2019)',
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
      chains</strong>, which is the rule real hardware follows too. The price is a chain length of{' '}
      <Math>{'2n'}</Math> and <Math>{'2n^2'}</Math> physical qubits in total. Real Pegasus and Zephyr
      topologies are far better connected and minorminer’s heuristics far cleverer, so the constants are
      much smaller — but <strong>the quadratic blow-up in the logical variable count is real</strong>.
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
      The eleven cases here hide the problem, because they are small enough for{' '}
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
  'domain.assign.facility': 'Facility',
  'domain.assign.location': 'Location',
  'domain.assign.cost': (p: TParams) => `weighted flow cost = ${p.cost}`,
  'domain.knapsack.budget': (p: TParams) => `budget ${p.used} / ${p.total}`,
  'domain.knapsack.value': (p: TParams) => `total value = ${p.value}`,
  'domain.sat.count': (p: TParams) => `${p.sat} / ${p.total} clauses satisfied`,
  'domain.sat.current': (p: TParams) =>
    `Currently ${p.vars} variables · ${p.clauses} clauses → the QUBO is still ${p.vars}×${p.vars}`,
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
