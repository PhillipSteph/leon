import { Component } from '@angular/core';
import {WindowComponent} from '../window/window';

@Component({
  selector: 'app-browser',
  imports: [
    WindowComponent
  ],
  templateUrl: './browser.html',
  styleUrl: './browser.scss'
})
export class Browser {

}
