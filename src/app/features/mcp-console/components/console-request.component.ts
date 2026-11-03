import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxButton } from '@tmdjr/ngx-workshop-design-system';
import { ConsoleForm } from '../forms/console-form';
import { toolChoices, ToolName } from '../models/console.models';
@Component({
  selector: 'ngx-mcp-console-request',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, NgxButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="request" [formGroup]="form()" (ngSubmit)="run.emit()">
      <h2>{{ title() }}</h2>
      @if (selected() !== 'get_coding_lab') {
        <mat-form-field appearance="outline"><mat-label>Section ID</mat-label>
          <input matInput formControlName="sectionId" maxlength="120" required [readonly]="running()" />
          <mat-hint>The catalog’s section identifier.</mat-hint></mat-form-field>
        @if (selected() === 'get_workshop') {
          <mat-form-field appearance="outline"><mat-label>Workshop ID</mat-label>
            <input matInput formControlName="workshopId" maxlength="120" required [readonly]="running()" /></mat-form-field>
        }
      } @else {
        <mat-form-field appearance="outline"><mat-label>Lab ID</mat-label>
          <input matInput formControlName="labId" required [readonly]="running()" />
          <mat-hint>24 hexadecimal characters.</mat-hint></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Version ID (optional)</mat-label>
          <input matInput formControlName="versionId" [readonly]="running()" />
          <mat-hint>Leave blank for the latest published version.</mat-hint></mat-form-field>
      }
      @if (validation()) { <p class="request__error" role="alert">{{ validation() }}</p> }
      <button mat-flat-button ngxButton shape="chevron" type="submit" [disabled]="!available() || running()">
        {{ running() ? 'Running tool…' : 'Run tool →' }}
      </button>
      @if (connected() && !available()) { <p>This server did not advertise this tool as read-only.</p> }
    </form>
  `,
  styles: [`
    @use '@angular/material' as mat;
    :host { display: block; min-width: 0; @include mat.form-field-density(-3); }
    .request { display: grid; gap: 0.75rem; font-size: 0.75rem; }
    h2 { margin: 0 0 0.5rem; font: 600 0.85rem/1.6 var(--ngx-font-mono); color: var(--ngx-color-text); }
    mat-form-field { width: 100%; min-width: 0; }
    .request__error { color: var(--ngx-color-error); overflow-wrap: anywhere; }
  `],
})
export class ConsoleRequestComponent {
  readonly form = input.required<ConsoleForm>(); readonly selected = input.required<ToolName>();
  readonly running = input(false); readonly available = input(false); readonly connected = input(false);
  readonly validation = input(''); readonly run = output<void>();
  title(): string { return toolChoices.find(tool => tool.name === this.selected())!.title; }
}
