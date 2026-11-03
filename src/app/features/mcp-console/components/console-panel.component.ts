import { afterNextRender, afterRenderEffect, ChangeDetectionStrategy, Component, DestroyRef,
  ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { NgxPanel, NgxPanelShape, NgxPanelBackground } from '@tmdjr/ngx-workshop-design-system';
import { observePanelBody } from '../utils/panel-body-viewport';
@Component({
  selector: 'ngx-mcp-console-panel', imports: [NgxPanel], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngx-panel [heading]="heading()" [eyebrow]="eyebrow()" [shape]="shape()" [background]="background()">
      <div #body class="console-panel__body" [style.height.px]="bodyHeight()" tabindex="0"
        role="region" [attr.aria-label]="heading()"><ng-content /></div>
    </ngx-panel>
  `,
  styles: [`
    :host { display: block; min-width: 0; min-height: 0; height: 100%; }
    ngx-panel { height: auto; }
    .console-panel__body { position: relative; min-height: 0; overflow: auto; scrollbar-width: thin; padding: 4px 2px; box-sizing: border-box; }
    .console-panel__body:focus-visible { outline: 2px solid var(--ngx-color-primary); outline-offset: -2px; }
  `],
})
export class ConsolePanelComponent {
  readonly heading = input.required<string>(); readonly eyebrow = input.required<string>();
  readonly shape = input<NgxPanelShape>('stepped'); readonly background = input<NgxPanelBackground>('solid');
  readonly resetKey = input<unknown>(null); readonly bodyHeight = signal(0);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly body = viewChild.required<ElementRef<HTMLElement>>('body');
  private readonly destroyRef = inject(DestroyRef);
  constructor() {
    afterRenderEffect(() => { this.resetKey(); this.body().nativeElement.scrollTop = 0; });
    afterNextRender(() => this.destroyRef.onDestroy(observePanelBody(this.host.nativeElement,
      this.body().nativeElement, height => this.bodyHeight.set(height ?? 0), 'container')));
  }
}
