export type PatternRecognitionResult = {
    object: string;
    confidence: number;
};
export type SymbolicRule = {
    if: string;
    then: string;
    explanation: string;
};
export type Decision = {
    action: string;
    confidence: number;
    reasoning: string;
};
export declare const UPSTREAM: {
    readonly repository: "https://github.com/joaovictorcamargo/AI-Agents-as-Neuro-Symbolic-System";
    readonly commit: "8069f88c543c2b4fa94a1277d90d4a0c9885cf98";
    readonly localClone: "upstream/neuro-symbolic-ai-system";
};
export declare const SIMULATED_OBJECTS: readonly PatternRecognitionResult[];
export declare const RULES: readonly SymbolicRule[];
export declare function perceive(input: {
    object?: string;
}): PatternRecognitionResult;
export declare function reason(pattern: PatternRecognitionResult): Decision | null;
export declare function decide(pattern: PatternRecognitionResult): Decision | null;
export declare function runPipeline(input: {
    object?: string;
}): {
    pattern: PatternRecognitionResult;
    decision: Decision | null;
};
