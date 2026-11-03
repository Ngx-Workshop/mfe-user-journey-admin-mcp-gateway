import { NgxButton, NgxCodeBlock, NgxCodeLanguage } from '@tmdjr/ngx-workshop-design-system';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import type { CatalogResult } from '../../models/console.models';

@Component({
  selector: 'ngx-mcp-result',
  imports: [JsonPipe, MatButtonModule, NgxButton, NgxCodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (result(); as result) {
      <div class="result">
        @switch (result.name) {
          @case ('list_workshops') {
            <p class="result__count">
              {{ result.data.workshops.length }} workshops returned
            </p>
            @for (
              workshop of result.data.workshops;
              track workshop.id
            ) {
              <article class="result__card">
                <button class="result__row" type="button" [attr.aria-label]="'Inspect workshop ' + workshop.title"
                  (click)="workshopSelected.emit({ sectionId: workshop.sectionId, workshopId: workshop.id })">
                  <span class="result__eyebrow">LEVEL {{ workshop.level }}</span>
                  <strong>{{ workshop.title }}</strong>
                  <span class="result__summary" [title]="workshop.summary">{{ workshop.summary }}</span>
                  <code>{{ workshop.id }}</code>
                </button>
              </article>
            } @empty {
              <p class="result__empty">
                No workshops in this section. Try another section ID.
              </p>
            }
          }
          @case ('get_workshop') {
            <span class="result__eyebrow"
              >WORKSHOP · LEVEL {{ result.data.workshop.level }}</span
            >
            <h3>{{ result.data.workshop.title }}</h3>
            <p>{{ result.data.workshop.summary }}</p>
            <h4>Learning outline</h4>
            <ol class="result__outline">
              @for (
                item of result.data.workshop.outline;
                track $index
              ) {
                <li>
                  <strong>{{ item.title }}</strong
                  ><span>{{ item.kind }}</span
                  ><code>{{ item.resourceId }}</code>
                  @if (item.kind === 'CODING_LAB') {
                    <button
                      mat-flat-button ngxButton surface="outline"
                      (click)="labSelected.emit(item.resourceId)"
                    >
                      Inspect lab →
                    </button>
                  }
                </li>
              } @empty {
                <li>No outline items available.</li>
              }
            </ol>
          }
          @case ('get_coding_lab') {
            <span class="result__eyebrow"
              >{{ result.data.lab.language }} · VERSION
              {{ result.data.lab.versionNumber }} ·
              {{
                result.data.lab.difficulty || 'Unspecified difficulty'
              }}</span
            >
            <h3>{{ result.data.lab.title }}</h3>
            <h4>Prompt</h4>
            <pre class="result__prose">{{
              result.data.lab.promptMarkdown
            }}</pre>
            <h4>Starter code</h4>
            <ngx-code-block [code]="result.data.lab.starterCode" label="Starter code" [language]="language(result.data.lab.language)" [wrap]="true" />
            <h4>Hints</h4>
            <ol>
              @for (hint of result.data.lab.hints; track $index) {
                <li>{{ hint }}</li>
              } @empty {
                <li>No published hints.</li>
              }
            </ol>
            <h4>Public sample tests</h4>
            @for (test of result.data.lab.sampleTests; track $index) {
              <details>
                <summary>{{ test.name }} · {{ test.kind }}</summary>
                <ngx-code-block [code]="(test | json) ?? ''" [label]="test.name" language="json" [wrap]="true" />
              </details>
            } @empty {
              <p>No public sample tests.</p>
            }
          }
        }
        <details class="result__raw">
          <summary>View response JSON</summary>
          <ngx-code-block [code]="result.raw" label="Response JSON" language="json" [wrap]="true" />
        </details>
      </div>
    }
  `,
  styles: [`
    :host { display: block; min-width: 0; }
    .result { color: var(--ngx-color-text); position: relative; min-width: 0; }
    .result__count, .result__eyebrow { color: var(--ngx-color-muted); font: var(--ngx-font-label); font-size: 0.7rem; }
    .result__card { border-bottom: 1px solid var(--ngx-color-border); }
    .result__row { display: grid; gap: 2px; width: 100%; padding: 8px; border: 0; cursor: pointer; text-align: left;
      background: var(--ngx-color-surface-low); color: var(--ngx-color-text); }
    .result__row strong { font: 600 0.8rem/1.5 var(--ngx-font-mono); }
    .result__row:hover { background: var(--ngx-color-surface-high); }
    .result__row:focus-visible { outline: 2px solid var(--ngx-color-primary); outline-offset: -2px; }
    .result__summary { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
    h3 { margin: 0.5rem 0; font: 600 1rem/1.5 var(--ngx-font-mono); }
    h4 { margin: 1rem 0 0.5rem; font-size: 0.8rem; }
    p, li { font-size: 0.8rem; line-height: 1.6; }
    code { overflow-wrap: anywhere; color: var(--ngx-color-primary); font-size: 0.7rem; }
    .result__outline { padding-left: 1.25rem; }
    .result__outline li { padding: 6px 4px; border-bottom: 1px solid var(--ngx-color-border); }
    .result__outline span, .result__outline code { display: block; }
    .result__outline span { color: var(--ngx-color-muted); font-size: 0.7rem; }
    .result__prose { padding: 0.75rem; white-space: pre-wrap; overflow-wrap: anywhere; font: inherit; font-size: 0.8rem; background: var(--ngx-color-surface-low); }
    ngx-code-block { position: relative; min-width: 0; }
    details { margin-top: 0.75rem; }
    summary { cursor: pointer; padding: 0.5rem 0; font-size: 0.8rem; font-weight: 600; }
    .result__raw { border-top: 1px solid var(--ngx-color-border); }
    .result__empty { padding: 1rem 0; }
  `],
})
export class ResultComponent {
  language(value: string): NgxCodeLanguage {
    const language = value.toLowerCase();
    return language === 'typescript' || language === 'javascript' || language === 'html' || language === 'css' || language === 'json' ? language : 'text';
  }
  readonly result = input.required<CatalogResult>();
  readonly workshopSelected = output<{
    sectionId: string;
    workshopId: string;
  }>();
  readonly labSelected = output<string>();
}
