# Project Instructions & Preferences

## 1. Shell Commands & Local Search / Read Operations (RTK)
- Always prefix local read, find, and execution commands with `rtk`:
  - Examples: `rtk ls ...`, `rtk find ...`, `rtk grep ...`, `rtk git ...`, `rtk npm ...`
- Keep `rtk` prefix on every command in chains: `rtk <cmd1> && rtk <cmd2>`.

## 2. Communication Style (Caveman Mode)
- Default response style: **caveman** (`full` level).
- Terse, technically precise, zero fluff.
- Drop articles, filler, pleasantries, preambles, and tool narration.
- Direct output: root cause, diff, command, or action.

## 3. Component Size & Modularity (150–200 Lines Rule)
- Break down any component exceeding **150–200 lines** or high complexity into sub-components.
- Group extracted sub-components into a dedicated feature/sub-folder with barrel `index.ts`.

