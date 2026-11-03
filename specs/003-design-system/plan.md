# Implementation plan
Status: Complete
Updated: 2026-11-02

## Source baseline and mapping
Design-system dependency/federation singleton already installed. ConsoleComponent
is a 500+ line composition and style exception; ResultComponent uses custom pre
blocks. Extract typed form factory and stateless tool/request presenters. Compose
three bounded panels in the scoped console, retain existing store/API ownership.
Use public NgxActionBar, NgxInlineStatus, NgxButton, NgxPanel and NgxCodeBlock.
Use measured viewport/container chrome and lifetime cleanup; mobile panel controls
keep selected content above the fold. Drilldown opens Request; running tools opens
Response. Include standalone theme and component-level ngx-design-system scope.

## Compatibility and constitution
No SDK, OAuth, authorization, protocol, route/export, shared version, API or
persistence changes. Existing VM command streams/teardown remain responsible for
state. Inline OnPush/BEM presenters stay approximately 230 lines. The new form
factory preserves the existing typed controls and field values.

## Verification
Architecture, strict app/spec TypeScript, full Karma suite, isolated production
build and license output. Update composition/result assertions for shared components;
verify tool selection, request gating/drilldown, inert code rendering and code-block
payload. Check shell disconnected/error/selection and desktop/mobile geometry.
