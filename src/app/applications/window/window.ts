import { Component } from '@angular/core';

@Component({
  selector: 'app-window',
  template: `
    <div class="window-frame">
      <div class="window-header">My Window</div>
      <div class="window-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./window.component.scss']
})
export class WindowComponent {}
