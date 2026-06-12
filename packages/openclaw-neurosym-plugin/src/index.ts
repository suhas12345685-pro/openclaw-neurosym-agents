import { Type } from "typebox";
import { defineToolPlugin } from "openclaw/plugin-sdk/tool-plugin";
import { decide, perceive, reason, RULES, runPipeline, SIMULATED_OBJECTS, UPSTREAM } from "./core.js";

const ObjectSchema = Type.Union([
  Type.Literal("car"),
  Type.Literal("pedestrian"),
  Type.Literal("traffic_light"),
  Type.Literal("stop_sign"),
]);
const PatternSchema = Type.Object({ object: Type.String(), confidence: Type.Number({ minimum: 0, maximum: 1 }) });
const ConfigSchema = Type.Object({
  defaultMaxSteps: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 10 })),
  defaultVerbose: Type.Optional(Type.Boolean({ default: true })),
});

export default defineToolPlugin({
  id: "neurosym_agents",
  name: "Neuro-Symbolic Agents",
  description: "Native OpenClaw wrapper for joaovictorcamargo/AI-Agents-as-Neuro-Symbolic-System.",
  configSchema: ConfigSchema,
  tools: (tool) => [
    tool({
      name: "neurosym_perceive",
      description: "Run the upstream demo's simulated neural pattern recognizer.",
      parameters: Type.Object({ object: Type.Optional(ObjectSchema) }),
      execute: async (params) => perceive(params),
    }),
    tool({
      name: "neurosym_reason",
      description: "Apply the upstream demo's symbolic rule to a recognized pattern.",
      parameters: PatternSchema,
      execute: async (params) => reason(params),
    }),
    tool({
      name: "neurosym_decide",
      description: "Produce the upstream demo's final action, confidence, and reasoning.",
      parameters: PatternSchema,
      execute: async (params) => decide(params),
    }),
    tool({
      name: "neurosym_run_pipeline",
      description: "Run the upstream demo's pattern recognition, reasoning, and decision flow.",
      parameters: Type.Object({ object: Type.Optional(ObjectSchema) }),
      execute: async (params, config) => {
        const result = runPipeline(params);
        return config.defaultVerbose === false ? result.decision : result;
      },
    }),
    tool({
      name: "neurosym_info",
      description: "Report wrapped upstream source, supported patterns, rules, and OpenClaw configuration.",
      parameters: Type.Object({}),
      execute: async (_params, config) => ({
        id: "neurosym_agents",
        version: "1.1.0",
        upstream: UPSTREAM,
        simulatedObjects: SIMULATED_OBJECTS,
        rules: RULES,
        config: { defaultMaxSteps: config.defaultMaxSteps ?? 10, defaultVerbose: config.defaultVerbose ?? true },
      }),
    }),
  ],
});
