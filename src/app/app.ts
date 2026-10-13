import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConsoleComponent } from './features/mcp-console/pages/console/console.component';

@Component({
  selector: 'mfe-user-journey-admin-mcp-gateway',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ConsoleComponent],
  template: `<ngx-mcp-console />`,
  styles: [':host { display: block; }'],
})
export class App {}
export default App;
