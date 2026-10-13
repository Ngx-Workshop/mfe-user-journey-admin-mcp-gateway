# MCP Gateway tests

Run npm test -- --watch=false --browsers=ChromeHeadless. testing/app mirrors src/app. Synthetic fetch/API doubles cover the real SDK protocol boundary, singleton lifecycle, scoped tool inputs, safe catalog rendering, PKCE validation and overview routing. OAuth tests use synthetic session-storage transactions; no live credentials or domain mutations. See docs/development.md for integration prerequisites.
