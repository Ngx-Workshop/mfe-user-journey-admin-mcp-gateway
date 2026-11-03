import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef,
  inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxActionBar, NgxButton, NgxInlineStatus } from '@tmdjr/ngx-workshop-design-system';
import { ConsoleViewModel } from './console.view-model';
import { ConsolePanelComponent } from '../../components/console-panel.component';
import { ConsoleToolsComponent } from '../../components/console-tools.component';
import { ConsoleRequestComponent } from '../../components/console-request.component';
import { ResultComponent } from '../../components/result/result.component';
import { observeWorkspaceHeight } from '../../utils/panel-body-viewport';
import type { ToolName } from '../../models/console.models';
@Component({
  selector: 'ngx-mcp-console', host: { class: 'ngx-design-system' },
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule, NgxActionBar, NgxButton, NgxInlineStatus,
    ConsolePanelComponent, ConsoleToolsComponent, ConsoleRequestComponent, ResultComponent],
  providers: [ConsoleViewModel], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngx-action-bar heading="MCP Gateway">
      <ngx-inline-status ngxActionBarIndicators [announce]="true"
        [label]="vm.status() === 'connected' ? 'Connected' : vm.status() === 'connecting' ? 'Connecting…' : 'Disconnected'"
        [tone]="vm.status() === 'connected' ? 'success' : 'neutral'" />
      <span ngxActionBarIndicators class="console__indicator">MCP catalog explorer</span>
      @if (vm.status() === 'disconnected') {
        <button mat-flat-button ngxButton surface="outline" shape="chevron" type="button"
          [disabled]="vm.signingIn()" (click)="vm.connect()">
          <mat-icon>link</mat-icon>{{ vm.signingIn() ? 'Completing sign-in…' : 'Connect Ngx Workshop' }}
        </button>
      } @else {
        <button mat-flat-button ngxButton surface="outline" type="button" (click)="vm.disconnect()"><mat-icon>link_off</mat-icon>Disconnect</button>
      }
    </ngx-action-bar>
    <main class="console" aria-label="MCP catalog console">
      <div #workspace class="console__workspace" [style.height.px]="workspaceHeight()">
        <div class="console__switch" role="group" aria-label="Console panels">
          <button mat-button type="button" [attr.aria-pressed]="pane() === 'tools'" (click)="pane.set('tools')">Gateway</button>
          <button mat-button type="button" [attr.aria-pressed]="pane() === 'request'" (click)="pane.set('request')">Request</button>
          <button mat-button type="button" [attr.aria-pressed]="pane() === 'response'" (click)="pane.set('response')">Response</button>
        </div>
        <ngx-mcp-console-panel heading="Gateway & tools" eyebrow="MCP / EXPLORE" shape="chamfered"
          [class.console__panel--hidden]="pane() !== 'tools'">
          @if (vm.signInError()) { <p class="console__error" role="alert">{{ vm.signInError() }}</p> }
          <ngx-mcp-console-tools [status]="vm.status()" [server]="vm.server()" [tools]="vm.tools()"
            [selected]="vm.selected()" [running]="vm.running()" (select)="selectTool($event)" />
        </ngx-mcp-console-panel>
        <ngx-mcp-console-panel heading="Request" eyebrow="MCP / INPUT" [resetKey]="vm.selected()"
          [class.console__panel--hidden]="pane() !== 'request'">
          <ngx-mcp-console-request [form]="vm.toolForm" [selected]="vm.selected()" [running]="vm.running()"
            [available]="vm.available()" [connected]="vm.status() === 'connected'"
            [validation]="vm.validation()" (run)="run()" />
        </ngx-mcp-console-panel>
        <ngx-mcp-console-panel heading="Response" eyebrow="MCP / INSPECT" background="grid" [resetKey]="vm.result()"
          [class.console__panel--hidden]="pane() !== 'response'">
          @if (vm.status() === 'connecting' || vm.running()) { <mat-progress-bar mode="indeterminate" aria-label="Waiting for MCP gateway" /> }
          @if (vm.error()) { <p class="console__error" role="alert">{{ vm.error() }}</p> }
          <div role="status" class="console__announcement">{{ vm.running() ? 'Waiting for tool response.' : vm.result() ? 'Tool response received.' : '' }}</div>
          @if (vm.result(); as result) {
            <ngx-mcp-result [result]="result" (workshopSelected)="inspectWorkshop($event.sectionId, $event.workshopId)" (labSelected)="inspectLab($event)" />
          } @else {
            <div class="console__empty">
              <mat-icon aria-hidden="true">hub</mat-icon>
              <h2>{{ vm.running() ? 'Fetching catalog content…' : 'A window into your content' }}</h2>
              <p>{{ vm.status() !== 'connected' ? 'Connect your gateway to discover its tools. Then choose a tool and supply its identifiers.'
                : vm.error() ? 'Your request did not complete. Review the message and run the tool again.' : 'Run a tool to inspect published content here.' }}</p>
            </div>
          }
          <p class="console__boundary">Public content only · No content changes. Catalog results do not determine learner access or eligibility.</p>
        </ngx-mcp-console-panel>
      </div>
    </main>
  `,
  styles: [`
    :host { display: block; min-width: 0; color: var(--ngx-color-text); background: var(--ngx-color-canvas); }
    ngx-action-bar { --ngx-action-bar-top: var(--mcp-toolbar-top, 96px); }
    .console { width: calc(100% - 2rem); margin: 0 auto; padding: 1rem 0; }
    .console__workspace { display: grid; grid-template-columns: minmax(250px, 300px) minmax(260px, 320px) minmax(0, 1fr); grid-template-rows: minmax(0, 1fr); gap: 1rem; min-width: 0; min-height: 0; }
    .console__switch { display: none; }
    .console__indicator { font: var(--ngx-font-label); font-size: 0.7rem; }
    .console__error { color: var(--ngx-color-error); font-size: 0.75rem; overflow-wrap: anywhere; }
    .console__empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1rem; min-height: 180px; text-align: center; font-size: 0.8rem; }
    .console__empty mat-icon { color: var(--ngx-color-primary); }
    .console__empty h2 { font: 600 1rem/1.5 var(--ngx-font-mono); color: var(--ngx-color-text); }
    .console__boundary { margin-top: 1rem; border-top: 1px solid var(--ngx-color-border); padding-top: 0.75rem; font-size: 0.7rem; }
    .console__announcement { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
    @media (max-width: 1100px) {
      .console { width: calc(100% - 1rem); padding: 0.5rem 0 1rem; }
      .console__workspace { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr); gap: 0.5rem; }
      .console__switch { display: flex; flex-wrap: wrap; }
      .console__switch button[aria-pressed='true'] { background: var(--ngx-color-surface-high); }
      ngx-mcp-console-panel { grid-column: 1; grid-row: 2; }
      .console__panel--hidden { display: none; }
    }
    @media (max-width: 720px) { .console__indicator { display: none; } ngx-action-bar { --ngx-action-bar-top: var(--mcp-toolbar-top, 76px); } }
  `],
})
export class ConsoleComponent {
  readonly vm = inject(ConsoleViewModel); readonly pane = signal<'tools' | 'request' | 'response'>('tools');
  readonly workspaceHeight = signal(0);
  private readonly workspace = viewChild.required<ElementRef<HTMLElement>>('workspace');
  private readonly destroyRef = inject(DestroyRef);
  constructor() { afterNextRender(() => this.destroyRef.onDestroy(observeWorkspaceHeight(this.workspace().nativeElement, height => this.workspaceHeight.set(height)))); }
  selectTool(name: ToolName): void { this.vm.select(name); this.pane.set('request'); }
  run(): void { this.vm.run(); if (!this.vm.validation() && this.vm.available()) this.pane.set('response'); }
  inspectWorkshop(section: string, id: string): void { this.vm.inspectWorkshop(section, id); this.pane.set('request'); }
  inspectLab(id: string): void { this.vm.inspectLab(id); this.pane.set('request'); }
}
