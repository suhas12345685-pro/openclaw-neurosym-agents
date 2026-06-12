# Neuro-Symbolic Agents for OpenClaw

Native OpenClaw tool plugin providing deterministic perception, forward-chaining symbolic reasoning, action selection, and a complete neuro-symbolic pipeline.

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
