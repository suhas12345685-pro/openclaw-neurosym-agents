import { describe, expect, it } from "vitest";
import entry from "./index.js";
import { decide, perceive, reason } from "./core.js";
import { getToolPluginMetadata } from "openclaw/plugin-sdk/tool-plugin";

const names = ["neurosym_perceive", "neurosym_reason", "neurosym_decide", "neurosym_run_pipeline", "neurosym_info"];

describe("neurosym_agents", () => {
  it("declares the exact fixed tool contract", () => {
    const metadata = getToolPluginMetadata(entry);
    expect(metadata?.id).toBe("neurosym_agents");
    expect(metadata?.tools.map((tool) => tool.name)).toEqual(names);
  });

  it("normalizes perception facts", () => {
    expect(perceive({ observations: [" Rain ", "RAIN"], knownFacts: ["Cloudy"] }).facts).toEqual(["cloudy", "rain"]);
  });

  it("chains rules until fixpoint", () => {
    const result = reason({
      facts: ["rain"],
      rules: [{ if: ["rain"], then: "wet" }, { if: ["wet"], then: "slippery" }],
      maxSteps: 10,
    });
    expect(result.facts).toEqual(["rain", "slippery", "wet"]);
    expect(result.derivations).toHaveLength(2);
  });

  it("selects the highest-ranked eligible action", () => {
    const result = decide({
      facts: ["wet", "umbrella"],
      candidates: [
        { action: "walk", requires: ["dry"] },
        { action: "take_umbrella", requires: ["umbrella"], prefers: ["wet"] },
      ],
    });
    expect(result.decision).toBe("take_umbrella");
  });
});
