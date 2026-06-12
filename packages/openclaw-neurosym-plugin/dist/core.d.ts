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
export declare function normalizeFacts(values: string[]): string[];
export declare function perceive(input: {
    observations: string[];
    knownFacts?: string[];
    goal?: string;
}): {
    facts: string[];
    goal: string | null;
    observationCount: number;
};
export declare function reason(input: {
    facts: string[];
    rules: Rule[];
    maxSteps: number;
}): {
    facts: string[];
    derivations: {
        fact: string;
        rule: number;
        confidence: number;
    }[];
    steps: number;
    reachedFixpoint: boolean;
};
export declare function decide(input: {
    facts: string[];
    candidates: Candidate[];
    goal?: string;
}): {
    decision: string | null;
    goal: string | null;
    ranked: {
        action: string;
        eligible: boolean;
        score: number;
        matched: string[];
        missing: string[];
    }[];
};
