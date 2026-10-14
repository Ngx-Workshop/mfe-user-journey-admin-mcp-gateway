# Development and verification

Updated 2026-10-13. Use Node 22 and npm ci with the committed lockfile/vendor contracts tarball.

| Purpose | Command |
| --- | --- |
| Architecture | npm run check:architecture |
| Dev server | npm start |
| Local bundle/watch | npm run dev:bundle |
| Isolated production build | npm run build -- --output-path dist/migration-verification |
| Behavior tests | npm test -- --watch=false --browsers=ChromeHeadless |
| Strict source checks | npx tsc --noEmit --noUnusedLocals --noUnusedParameters -p tsconfig.app.json |
| Test types | npx tsc --noEmit -p tsconfig.spec.json |

Default port is 4201; avoid running a competing server. Isolated build output avoids overwriting an active watcher bundle. The shell's localhost remote override loads remoteEntry.js; use /mcp-gateway/overview. Standalone bootstrap renders App directly, while the shell consumes the Routes export.

Mirrored tests in testing/app use synthetic SDK/fetch/store doubles for protocol handshake, headers/arguments, connection teardown/races, errors, schema validation, inputs and rendered results. OAuth tests use synthetic pending PKCE transactions and mocked token responses; no live credentials. Set CHROME_BIN to the installed Chrome binary if needed.

Manual acceptance: disconnected/loading/error/empty/content states, tool selection, identifiers, structured/JSON drilldown, disconnect during requests, keyboard access and responsive layout. The exact new overview callback for ngx-workshop-ai-publisher-prod was registered live on 2026-10-13; authorization now redirects to sign-in. Verify account login, consent, return to overview, expiry and reconnect to complete live acceptance. Unit/build checks do not prove deployment or live OAuth.

See [migration handoff](../specs/002-mcp-gateway-migration/handoff.md). Prior 001 docs describe the inherited seed; example CRUD is no longer part of this product.
