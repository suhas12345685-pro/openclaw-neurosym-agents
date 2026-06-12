import { describe, expect, it } from "vitest";
import entry from "./index.js";
import { decide, perceive, reason, runPipeline, UPSTREAM } from "./core.js";
import { getToolPluginMetadata } from "openclaw/plugin-sdk/tool-plugin";

const names = ["neurosym_perceive", "neurosym_reason", "neurosym_decide", "neurosym_run_pipeline", "neurosym_info"];

describe("neurosym_agents upstream wrapper", () => {
  it("declares the exact fixed tool contract", () => {
    const metadata = getToolPluginMetadata(entry);
    expect(metadata?.id).toBe("neurosym_agents");
    expect(metadata?.tools.map((tool) => tool.name)).toEqual(names);
  });

  it("wraps the upstream simulated pattern recognizer", () => {
    expect(perceive({ object: "stop_sign" })).toEqual({ object: "stop_sign", confidence: 0.91 });
  });

  it("wraps the upstream symbolic reasoner", () => {
    expect(reason({ object: "pedestrian", confidence: 0.88 })).toEqual({
      action: "reduce_speed",
      confidence: 0.88,
      reasoning: "When a pedestrian is detected, reduce speed and prepare to stop if needed",
    });
  });

  it("returns no decision for an object outside the upstream rules", () => {
    expect(decide({ object: "bicycle", confidence: 0.8 })).toBeNull();
  });

  it("runs the original three-stage flow", () => {
    expect(runPipeline({ object: "car" }).decision.action).toBe("maintain_safe_distance");
  });

  it("pins the wrapped upstream source", () => {
    expect(UPSTREAM.commit).toBe("8069f88c543c2b4fa94a1277d90d4a0c9885cf98");
  });
});
