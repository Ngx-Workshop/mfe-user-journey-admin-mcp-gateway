# Admin MCP Gateway

Angular federated read-only MCP catalog explorer. Connect Ngx Workshop, discover tools and inspect workshop summaries, ordered outlines and coding labs with structured and expandable JSON results. Publishing remains in AI Publisher.

Open [MCP Gateway overview](https://admin.ngx-workshop.io/mcp-gateway/overview). The root redirects to overview; the seed hello-world route is replaced. OAuth uses PKCE and in-memory tokens; the auth owner must register this exact new callback for the existing public client ngx-workshop-ai-publisher-prod before live sign-in works.

Use Node 22, npm ci and npm run dev:bundle (port 4201). Run npm run check:architecture, npm test -- --watch=false --browsers=ChromeHeadless and npm run build. For isolated verification use npm run build -- --output-path dist/migration-verification.

Federation exports ./Component (default App) and ./Routes (named Routes) from remoteEntry.js. Remote name remains mfe-user-journey-admin-mcp-gateway; deployment directory remains /opt/mfe-remotes/mfe-user-journey-admin-mcp-gateway/. Use http://localhost:4201/remoteEntry.js as a shell development override.

See [architecture](docs/architecture.md), [development](docs/development.md) and [migration handoff](specs/002-mcp-gateway-migration/handoff.md).
