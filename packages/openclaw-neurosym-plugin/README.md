# Neuro-Symbolic Agents for OpenClaw

Native OpenClaw wrapper for [joaovictorcamargo/AI-Agents-as-Neuro-Symbolic-System](https://github.com/joaovictorcamargo/AI-Agents-as-Neuro-Symbolic-System), pinned to upstream commit `8069f88c543c2b4fa94a1277d90d4a0c9885cf98`.

The upstream project is a React demonstration rather than a reusable library. This plugin ports its actual runtime model into OpenClaw tools: four simulated recognized objects, four symbolic rules, and the resulting action/confidence/reasoning decision.

## Install

```bash
openclaw plugins install openclaw-neurosym-agents
openclaw plugins enable neurosym_agents
openclaw gateway restart
openclaw plugins inspect neurosym_agents --runtime --json
```

## Configure

```json5
{
  plugins: {
    entries: {
      neurosym_agents: {
        enabled: true,
        config: {
          defaultMaxSteps: 10,
          defaultVerbose: true
        }
      }
    }
  }
}
```

## Tools

- `neurosym_perceive`
- `neurosym_reason`
- `neurosym_decide`
- `neurosym_run_pipeline`
- `neurosym_info`

## Build

```bash
npm install
npm run plugin:build
npm run plugin:validate
npm test
```
