# Architecture and external context

Updated 2026-10-13 for [002 MCP Gateway migration](../specs/002-mcp-gateway-migration/spec.md).

## Responsibility and source map
This remote owns read-only MCP catalog exploration, migrated from AI Publisher. Workshop authoring and publishing remain in AI Publisher. The seed example-documents runtime/tests and seed DTO dependency are removed.

features/mcp-console contains:
- api/mcp-api.service.ts: stateless official MCP SDK/Streamable HTTP connection factory.
- api/oauth-api.service.ts: browser S256 PKCE and single-use callback validation.
- models/console.models.ts: published DTOs, connection abstraction and tool choices.
- state/mcp-console.store.ts: root server/connection/result orchestration.
- state/oauth-connection.store.ts: root sign-in and expiry orchestration.
- state/catalog-result.ts: output schema and tool error validation.
- pages/console: scoped typed forms/VM and OnPush composition.
- components/result: typed input/output catalog result presentation.

API → singleton state → scoped VM → view. The VM uses switchMap for replaceable connections and exhaustMap for commands, with lifetime teardown. Disconnect aborts handshake fetches, closes the SDK, invalidates stale results and clears shared state. ConsoleComponent retains the cohesive inline console template/styles (519 lines) as a migration exception to the approximate line guideline.

## Protocol, authorization and contracts
Dependencies: @modelcontextprotocol/client 2.3.1, @tmdjr/service-mcp-gateway-contracts 1.1.0 from a committed vendor tarball, and Ajv 8.17.1. No sibling build/runtime dependency. Protocol is pinned to 2026-07-28. Known commands list_workshops(sectionId), get_workshop(sectionId, workshopId), get_coding_lab(labId, versionId?) run only when discovered with readOnlyHint; discovery grants no authorization. Published schemas validate results; content is safely interpolated.

SDK fetch/request timeout: 15 seconds. Requests omit cookies and reject redirects; fetch bypasses shell HttpClient session interceptors. Endpoints require HTTPS except loopback HTTP; URL credentials/query/fragments are rejected.

OAuth issuer is https://auth.ngx-workshop.io; resource is https://mcp.ngx-workshop.io/mcp. Retain public client ngx-workshop-ai-publisher-prod with the registered exact https://admin.ngx-workshop.io/mcp-gateway/overview callback. Pending PKCE uses the dedicated ngx-mcp-gateway-pkce session-storage key with a ten-minute bound. Tokens live in memory only; expiry/401 clears the connection and results. No refresh token, browser secret or credential persistence. The shell's legacy login remains independent. The live auth client now approves overview alongside the former publisher callback (2026-10-13); registration acceptance was checked separately from frontend tests.

## Federation and routes
Keep named/default App, named Routes, ./Component, ./Routes, remoteEntry.js and the existing remote identity/shared singleton versions. App composes ConsoleComponent. Empty path redirects to overview; overview renders App; hello-world is removed. The consuming shell must use /mcp-gateway/overview. Existing shell providers/theme apply; standalone appConfig supplies zoneless/HTTP/animations and src/styles.scss supplies its Material theme.

Build output/deployment remain dist/mfe-user-journey-admin-mcp-gateway and /opt/mfe-remotes/mfe-user-journey-admin-mcp-gateway. No deployment or production registration is performed by the local migration.
