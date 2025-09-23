import { Component } from '@angular/core';
import {Application, WindowComponent} from '../window/window';

@Component({
  selector: 'app-browser',
  imports: [
    WindowComponent
  ],
  templateUrl: './browser.html',
  styleUrl: './browser.scss'
})
export class Browser implements Application{
  getComponent(): typeof Browser {
    return Browser;
  }
}
