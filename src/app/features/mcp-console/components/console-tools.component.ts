import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgxInlineStatus } from '@tmdjr/ngx-workshop-design-system';
import type { Tool } from '@modelcontextprotocol/client';
import { toolChoices, ToolName } from '../models/console.models';
@Component({
  selector: 'ngx-mcp-console-tools', imports: [NgxInlineStatus], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tools__identity">
      <ngx-inline-status [label]="status() === 'connected' ? 'Connected' : status() === 'connecting' ? 'Connecting…' : 'Disconnected'"
        [tone]="status() === 'connected' ? 'success' : 'neutral'" />
      @if (status() === 'disconnected') {
        <p>Sign in with your Ngx Workshop account and approve access to the published catalog.</p>
        <p>Your connection expires automatically. Reconnect when prompted.</p>
      } @else { <strong>{{ server() || 'Discovering server capabilities…' }}</strong><p>{{ tools().length }} tools discovered</p> }
    </div>
    <nav class="tools__list" aria-label="Catalog tools">
      @for (tool of choices; track tool.name) {
        <button class="console__tool" type="button" [attr.aria-pressed]="selected() === tool.name"
          [disabled]="running()" (click)="select.emit(tool.name)" [title]="tool.description">
          <strong>{{ tool.title }}</strong><code>{{ tool.name }}</code><span>{{ tool.description }}</span>
        </button>
      }
    </nav>
    @if (status() === 'connected') {
      <details class="tools__discovery"><summary>Discovered tools ({{ tools().length }})</summary>
        @for (tool of tools(); track tool.name) { <p><code>{{ tool.name }}</code><br />{{ tool.description }}</p> }
        @empty { <p>This server has no tools.</p> }
      </details>
    }
  `,
  styles: [`
    .tools__identity { font-size: 0.75rem; line-height: 1.6; overflow-wrap: anywhere; }
    .tools__identity strong { display: block; margin-top: 0.5rem; color: var(--ngx-color-text); }
    .tools__list { display: grid; border: 1px solid var(--ngx-color-border); }
    .console__tool { padding: 8px 10px; text-align: left; border: 0; border-bottom: 1px solid var(--ngx-color-border);
      background: var(--ngx-color-surface-low); color: var(--ngx-color-text); cursor: pointer; }
    .console__tool strong, .console__tool code, .console__tool span { display: block; }
    .console__tool strong { font: 600 0.75rem/1.5 var(--ngx-font-mono); }
    .console__tool code { color: var(--ngx-color-primary); font-size: 0.65rem; }
    .console__tool span { margin-top: 3px; font-size: 0.7rem; color: var(--ngx-color-muted); line-height: 1.5; }
    .console__tool[aria-pressed='true'] { box-shadow: inset 3px 0 var(--ngx-color-primary); background: var(--ngx-color-surface-high); }
    .console__tool:focus-visible { outline: 2px solid var(--ngx-color-primary); outline-offset: -2px; }
    .console__tool:disabled { opacity: 0.5; cursor: default; }
    .tools__discovery { margin-top: 1rem; font-size: 0.75rem; overflow-wrap: anywhere; }
    summary { cursor: pointer; }
  `],
})
export class ConsoleToolsComponent {
  readonly choices = toolChoices; readonly selected = input.required<ToolName>();
  readonly running = input(false); readonly status = input.required<string>();
  readonly server = input(''); readonly tools = input<readonly Tool[]>([]); readonly select = output<ToolName>();
}
