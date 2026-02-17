# nullclaw.github.io

Documentation site for [nullclaw](https://github.com/nullclaw/nullclaw) — the smallest fully autonomous AI assistant infrastructure.

Live at **https://nullclaw.github.io/**

## Structure

```
index.md                    Landing page
architecture.md             Vtable design, module layout, memory system
security/
  overview.md               Defense-in-depth summary
  sandboxing.md             Landlock, Firejail, Bubblewrap, Docker
  audit-logging.md          Tamper-evident event trail
  resource-limits.md        CPU, memory, disk enforcement
  roadmap.md                Security improvement phases
deployment/
  network.md                Raspberry Pi, tunnels, webhook channels
contributing/
  pr-workflow.md            Pull request governance
  reviewer-playbook.md      Review execution guide
  ci-map.md                 GitHub Actions workflow map
```

## License

MIT — see [nullclaw/LICENSE](https://github.com/nullclaw/nullclaw/blob/main/LICENSE)
