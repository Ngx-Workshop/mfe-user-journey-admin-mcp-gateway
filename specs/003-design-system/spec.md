# MCP Gateway design-system migration
Status: Complete
Created: 2026-11-02

## Problem and scope
The catalog console uses a large custom header and unbounded Material surfaces.
Migrate its presentation to the installed design-system 21.0.10, consistent with
the other admin remotes. Preserve routes, exports, SDK/OAuth/PKCE, read-only tool
gating, validation, teardown and API contracts.

## Requirements and acceptance
- FR-001 / AC-001: Shared action bar shows connection status and connect/disconnect.
  Gateway/tools, request inputs and response use full-width bounded panels that
  scroll internally. On narrow screens panel controls reveal one panel at a time.
- FR-002 / AC-002: Tool selection preserves typed form/validation, running locks,
  discovered read-only gating and drilldown inputs. Errors/loading/empty states
  stay useful; no new automatic calls or mutations.
- FR-003 / AC-003: Workshop rows and outline are compact; response JSON, lab starter
  code and sample tests use shared code blocks with inert text and copy controls.
- FR-004 / AC-004: Shell themes and standalone fallback apply. Keyboard access,
  accessible labels, responsive bounds and raw output fidelity remain intact.

## Success criteria
Architecture, strict app/spec types, behavior tests and isolated production build
pass. Browser checks cover the supplied shell's available states and mobile bounds.
Synthetic connected results do not prove live OAuth/consent or deployment. No
backend/registration/data migration, package publishing or deployment is in scope.
