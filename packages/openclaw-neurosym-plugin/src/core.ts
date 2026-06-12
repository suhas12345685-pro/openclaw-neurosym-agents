export type Rule = {
  if: string[];
  then: string;
  confidence?: number;
};

export type Candidate = {
  action: string;
  requires?: string[];
  prefers?: string[];
  score?: number;
};

export function normalizeFacts(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean))].sort();
}

export function perceive(input: {
  observations: string[];
  knownFacts?: string[];
  goal?: string;
}) {
  const facts = normalizeFacts([...(input.knownFacts ?? []), ...input.observations]);
  return {
    facts,
    goal: input.goal?.trim() || null,
    observationCount: input.observations.length,
  };
}

export function reason(input: {
  facts: string[];
  rules: Rule[];
  maxSteps: number;
}) {
  const facts = new Set(normalizeFacts(input.facts));
  const derivations: Array<{ fact: string; rule: number; confidence: number }> = [];
  let steps = 0;

  while (steps < input.maxSteps) {
    let changed = false;
    for (const [index, rule] of input.rules.entries()) {
      const antecedents = normalizeFacts(rule.if);
      const conclusion = rule.then.trim().toLowerCase();
      if (conclusion && antecedents.every((fact) => facts.has(fact)) && !facts.has(conclusion)) {
        facts.add(conclusion);
        derivations.push({ fact: conclusion, rule: index, confidence: rule.confidence ?? 1 });
        changed = true;
      }
    }
    steps += 1;
    if (!changed) break;
  }

  return {
    facts: [...facts].sort(),
    derivations,
    steps,
    reachedFixpoint: steps < input.maxSteps,
  };
}

export function decide(input: { facts: string[]; candidates: Candidate[]; goal?: string }) {
  const facts = new Set(normalizeFacts(input.facts));
  const ranked = input.candidates
    .map((candidate) => {
      const requires = normalizeFacts(candidate.requires ?? []);
      const prefers = normalizeFacts(candidate.prefers ?? []);
      const missing = requires.filter((fact) => !facts.has(fact));
      const matched = prefers.filter((fact) => facts.has(fact));
      const score = (candidate.score ?? 0) + matched.length - missing.length * 100;
      return { action: candidate.action, eligible: missing.length === 0, score, matched, missing };
    })
    .sort((a, b) => Number(b.eligible) - Number(a.eligible) || b.score - a.score || a.action.localeCompare(b.action));

  return { decision: ranked.find((item) => item.eligible)?.action ?? null, goal: input.goal ?? null, ranked };
}
