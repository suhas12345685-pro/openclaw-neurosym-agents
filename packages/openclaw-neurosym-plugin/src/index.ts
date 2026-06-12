import { Type } from "typebox";
import { defineToolPlugin } from "openclaw/plugin-sdk/tool-plugin";
import { decide, perceive, reason } from "./core.js";

const RuleSchema = Type.Object({
  if: Type.Array(Type.String()),
  then: Type.String(),
  confidence: Type.Optional(Type.Number({ minimum: 0, maximum: 1 })),
});
const CandidateSchema = Type.Object({
  action: Type.String(),
  requires: Type.Optional(Type.Array(Type.String())),
  prefers: Type.Optional(Type.Array(Type.String())),
  score: Type.Optional(Type.Number()),
});
const ConfigSchema = Type.Object({
  defaultMaxSteps: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 10 })),
  defaultVerbose: Type.Optional(Type.Boolean({ default: true })),
});

export default defineToolPlugin({
  id: "neurosym_agents",
  name: "Neuro-Symbolic Agents",
  description: "Deterministic perception, symbolic reasoning, and action selection tools for OpenClaw agents.",
  configSchema: ConfigSchema,
  tools: (tool) => [
    tool({
      name: "neurosym_perceive",
      description: "Normalize observations and known facts into a symbolic world state.",
      parameters: Type.Object({
        observations: Type.Array(Type.String()),
        knownFacts: Type.Optional(Type.Array(Type.String())),
        goal: Type.Optional(Type.String()),
      }),
      execute: async (params) => perceive(params),
    }),
    tool({
      name: "neurosym_reason",
      description: "Apply forward-chaining symbolic rules to facts until a fixpoint or step limit.",
      parameters: Type.Object({
        facts: Type.Array(Type.String()),
        rules: Type.Array(RuleSchema),
        maxSteps: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
      }),
      execute: async (params, config) =>
        reason({ facts: params.facts, rules: params.rules, maxSteps: params.maxSteps ?? config.defaultMaxSteps ?? 10 }),
    }),
    tool({
      name: "neurosym_decide",
      description: "Rank candidate actions using required and preferred symbolic facts.",
      parameters: Type.Object({
        facts: Type.Array(Type.String()),
        candidates: Type.Array(CandidateSchema),
        goal: Type.Optional(Type.String()),
      }),
      execute: async (params) => decide(params),
    }),
    tool({
      name: "neurosym_run_pipeline",
      description: "Run perception, symbolic reasoning, and action selection as one bounded pipeline.",
      parameters: Type.Object({
        observations: Type.Array(Type.String()),
        knownFacts: Type.Optional(Type.Array(Type.String())),
        rules: Type.Array(RuleSchema),
        candidates: Type.Array(CandidateSchema),
        goal: Type.Optional(Type.String()),
        maxSteps: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
      }),
      execute: async (params, config) => {
        const perceived = perceive(params);
        const reasoned = reason({
          facts: perceived.facts,
          rules: params.rules,
          maxSteps: params.maxSteps ?? config.defaultMaxSteps ?? 10,
        });
        const decision = decide({ facts: reasoned.facts, candidates: params.candidates, goal: params.goal });
        return config.defaultVerbose === false ? { decision: decision.decision } : { perceived, reasoned, decision };
      },
    }),
    tool({
      name: "neurosym_info",
      description: "Report plugin capabilities and resolved configuration.",
      parameters: Type.Object({}),
      execute: async (_params, config) => ({
        id: "neurosym_agents",
        version: "1.0.0",
        config: { defaultMaxSteps: config.defaultMaxSteps ?? 10, defaultVerbose: config.defaultVerbose ?? true },
        tools: ["neurosym_perceive", "neurosym_reason", "neurosym_decide", "neurosym_run_pipeline", "neurosym_info"],
      }),
    }),
  ],
});
