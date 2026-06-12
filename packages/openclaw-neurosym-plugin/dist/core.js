export const UPSTREAM = {
    repository: "https://github.com/joaovictorcamargo/AI-Agents-as-Neuro-Symbolic-System",
    commit: "8069f88c543c2b4fa94a1277d90d4a0c9885cf98",
    localClone: "upstream/neuro-symbolic-ai-system",
};
// Ported from the upstream React demo's PatternRecognizer component.
export const SIMULATED_OBJECTS = [
    { object: "car", confidence: 0.92 },
    { object: "pedestrian", confidence: 0.88 },
    { object: "traffic_light", confidence: 0.95 },
    { object: "stop_sign", confidence: 0.91 },
];
// Ported from the upstream React demo's SymbolicReasoner component.
export const RULES = [
    {
        if: "traffic_light",
        then: "check_light_color",
        explanation: "When a traffic light is detected, the system must determine its color state",
    },
    {
        if: "stop_sign",
        then: "stop_vehicle",
        explanation: "When a stop sign is detected, the vehicle must come to a complete stop",
    },
    {
        if: "pedestrian",
        then: "reduce_speed",
        explanation: "When a pedestrian is detected, reduce speed and prepare to stop if needed",
    },
    {
        if: "car",
        then: "maintain_safe_distance",
        explanation: "When another vehicle is detected, maintain a safe following distance",
    },
];
export function perceive(input) {
    if (input.object) {
        const match = SIMULATED_OBJECTS.find((item) => item.object === input.object);
        if (!match)
            throw new Error(`Unsupported upstream object: ${input.object}`);
        return { ...match };
    }
    return { ...SIMULATED_OBJECTS[Math.floor(Math.random() * SIMULATED_OBJECTS.length)] };
}
export function reason(pattern) {
    const rule = RULES.find((candidate) => candidate.if === pattern.object);
    return rule ? { action: rule.then, confidence: pattern.confidence, reasoning: rule.explanation } : null;
}
export function decide(pattern) {
    return reason(pattern);
}
export function runPipeline(input) {
    const pattern = perceive(input);
    return { pattern, decision: decide(pattern) };
}
